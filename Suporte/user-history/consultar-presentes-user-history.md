# User History - Consultar Presentes

## 1. Critério de Aceite

### 1.1 Cenário 1: Listar Presentes do Evento

**DADO** que o usuário está no menu do evento
**QUANDO** o usuário acessa a lista de presentes
**ENTÃO** o sistema carrega e exibe todos os presentes do evento agrupados por status:
- **Disponíveis**: presentes ainda não reservados
- **Em Arrecadação**: presentes com contribuições em andamento
- **Reservados**: presentes completamente reservados

#### 1.1.1 Informações adicionais
- Cada grupo exibe o ícone correspondente e a contagem de presentes entre parênteses
- Os presentes são exibidos em cards dentro de cada seção
- Se não houver presentes cadastrados, exibe o `empty state` com botão de ação para adicionar o primeiro presente
- O spinner de carregamento é exibido durante as chamadas à API

### 1.2 Cenário 2: Filtrar Presentes por Busca de Texto

**DADO** que o usuário está na lista de presentes e há pelo menos um presente cadastrado
**QUANDO** o usuário digita um termo no campo "Buscar presentes..."
**ENTÃO** o sistema filtra em tempo real, exibindo apenas os presentes cujo nome ou descrição contém o termo digitado (case-insensitive)

#### 1.2.1 Informações adicionais
- Campo com ícone de busca (`search`) prefixado
- Filtro aplicado a cada tecla digitada
- Busca no `nome` e na `descricao` do presente
- Se nenhum presente corresponder ao filtro, exibe o `empty state` com mensagem "Tente ajustar os filtros ou limpar a pesquisa"

### 1.3 Cenário 3: Filtrar Presentes por Status

**DADO** que o usuário está na lista de presentes e há pelo menos um presente cadastrado
**QUANDO** o usuário seleciona um status no campo "Filtrar por status"
**ENTÃO** o sistema exibe apenas os presentes com o status selecionado

#### 1.3.1 Informações adicionais
- Opções do select carregadas via API (`obterStatusPresente`)
- A opção "Todos os status" (valor vazio) exibe todos os presentes sem filtro
- O filtro de status é aplicado em conjunto com o filtro de busca de texto
- Se nenhum presente corresponder à combinação de filtros, exibe o `empty state`

### 1.4 Cenário 4: Visualizar Card do Presente

**DADO** que o usuário está na lista de presentes
**QUANDO** os presentes são exibidos
**ENTÃO** cada card apresenta:
- Menu de ações (três pontos verticais) no canto superior
- Carrossel de imagens (se houver imagens cadastradas) ou ícone padrão (`card_giftcard`)
- Nome do presente
- Status do presente
- Valor formatado em Real brasileiro (R$)
- Descrição (se disponível)
- Barra de progresso com total arrecadado e número de contribuintes (quando houver contribuições confirmadas)
- Botões de ação conforme regras de negócio

#### 1.4.1 Carrossel de Imagens
- Setas de navegação esquerda/direita exibidas quando há mais de uma imagem
- Indicadores de posição (bolinhas) na parte inferior do carrossel
- Clique nos indicadores navega diretamente para a imagem correspondente
- Quando não há imagens, exibe ícone `card_giftcard`

### 1.5 Cenário 5: Reservar Presente

**DADO** que o usuário está visualizando um presente com status "Disponível" e sem contribuições ativas
**QUANDO** o usuário clica em "Reservar Presente"
**ENTÃO** o sistema exibe um modal de confirmação com nome, valor e link do produto (se houver)

**E QUANDO** o usuário confirma a reserva
**ENTÃO** o sistema chama a API para registrar a reserva, recarrega a lista e exibe modal de sucesso informando que o organizador foi notificado

#### 1.5.1 Informações adicionais
- **Validação**: O botão "Reservar Presente" só aparece quando `podeReservar()` é verdadeiro:
  - Status do presente é "Disponível" (`id === 1`)
  - Não há contribuições ativas (todas canceladas ou nenhuma)
- **Modal de confirmação**: exibe nome do presente, valor formatado e link do produto (se existir)
- **Em caso de erro**: exibe modal de erro com a mensagem retornada pela API

### 1.6 Cenário 6: Cancelar Reserva de Presente

**DADO** que o usuário está visualizando um presente que ele mesmo reservou (status "Reservado")
**QUANDO** o usuário clica em "Cancelar Reserva"
**ENTÃO** o sistema exibe um modal com campo de texto solicitando o motivo do cancelamento

**E QUANDO** o usuário preenche o motivo (mínimo 10 caracteres) e confirma
**ENTÃO** o sistema chama a API para cancelar a reserva, recarrega a lista e exibe modal de sucesso informando que o presente voltou a ficar disponível

#### 1.6.1 Informações adicionais
- **Validação**: O botão "Cancelar Reserva" só aparece quando `podeCancelarReserva()` é verdadeiro:
  - Status do presente é "Reservado" (`id === 2`)
  - O `idParticipanteReservou` do presente é igual ao `idParticipanteLogado`
- **Campo de justificativa**: textarea obrigatório com mínimo de 10 e máximo de 500 caracteres
- **Em caso de erro**: exibe modal de erro com a mensagem retornada pela API

### 1.7 Cenário 7: Contribuir com Pix

**DADO** que o usuário está visualizando um presente com status "Disponível" ou "Em Arrecadação"
**QUANDO** o usuário clica em "Contribuir com Pix"
**ENTÃO** o sistema redireciona para a página de pagamento via Pix do presente (`/presentes/pagar/:idEvento/:id`)

#### 1.7.1 Informações adicionais
- O botão "Contribuir com Pix" aparece quando `podeContribuir()` é verdadeiro:
  - Status "Disponível" (`id === 1`) ou "Em Arrecadação" (`id === 3`)

### 1.8 Cenário 8: Excluir Presente

**DADO** que o usuário acessa o menu de ações de um presente
**QUANDO** o usuário clica em "Excluir"
**ENTÃO** o sistema valida se o presente pode ser excluído

**E SE** o presente estiver com status "Disponível"
**ENTÃO** exibe modal de confirmação; ao confirmar, chama a API para exclusão, remove o card da lista e exibe modal de sucesso

**E SE** o presente estiver com qualquer outro status**
**ENTÃO** exibe modal de erro informando que a exclusão não é permitida para aquele status

#### 1.8.1 Informações adicionais
- **Acessado via**: menu suspenso (ícone `more_vert`) no canto do card
- **Mensagens de bloqueio por status**:
  - Reservado: "está Reservado e não pode ser excluído."
  - Em Arrecadação: "está em Arrecadação e não pode ser excluído."
  - Finalizado: "já foi Finalizado e não pode ser excluído."
  - Demais: "não pode ser excluído."

### 1.9 Cenário 9: Adicionar Presente

**DADO** que o usuário está na lista de presentes e há pelo menos um presente cadastrado
**QUANDO** o usuário clica em "Adicionar Presente"
**ENTÃO** o sistema verifica se existe um PIX configurado para o evento com finalidade "Presentes"

**E SE** não houver PIX configurado
**ENTÃO** redireciona para a tela de cadastro de QR Code (`/eventos/cadastrar-qrcode/:idEvento/1`)

**E SE** houver PIX configurado
**ENTÃO** redireciona para a tela de cadastro de presente (`presentes/cadastrar/:idEvento`)

### 1.10 Cenário 10: Voltar ao Menu do Evento

**DADO** que o usuário está na lista de presentes
**QUANDO** clica em "Voltar para o menu do Evento"
**ENTÃO** o sistema redireciona para a home do evento (`/eventos/home/:idEvento`)

### 1.11 Cenário 11: Empty State — Nenhum Presente Cadastrado

**DADO** que o evento não possui presentes cadastrados
**QUANDO** o usuário acessa a lista de presentes
**ENTÃO** o sistema exibe:
- Ícone `card_giftcard`
- Título "Nenhum presente encontrado"
- Mensagem "Comece adicionando presentes à sua lista!"
- Botão "Adicionar Primeiro Presente" que segue a mesma lógica do cenário 1.9

### 1.12 Cenário 12: Empty State — Filtros sem Resultado

**DADO** que o usuário aplicou filtros de busca ou status
**QUANDO** nenhum presente corresponde aos critérios
**ENTÃO** o sistema exibe:
- Ícone `card_giftcard`
- Título "Nenhum presente encontrado"
- Mensagem "Tente ajustar os filtros ou limpar a pesquisa"
- Botão "Adicionar Primeiro Presente" **não** é exibido (pois há presentes cadastrados, apenas filtrados)

## 2. Campos da Interface

| Campo | Descrição | Tipo | Obrigatório |
| :--- | :--- | :--- | :--- |
| Buscar presentes | Filtra por nome ou descrição | Input (text) | Não |
| Filtrar por status | Filtra pelo status do presente | Select | Não |
| Botão Adicionar Presente | Inicia o fluxo de cadastro | Botão | Não |
| Botão Voltar | Retorna ao menu do evento | Botão | Não |

## 3. Card do Presente

| Elemento | Descrição |
| :--- | :--- |
| Menu de ações | Ícone `more_vert`; opções: Editar, Ver Detalhes, Excluir |
| Imagens | Carrossel com navegação; fallback para ícone padrão |
| Nome | Título do presente |
| Status | Badge com a descrição do status |
| Valor | Valor formatado em R$ |
| Descrição | Texto descritivo opcional |
| Progresso | Barra com valor arrecadado / valor total + nº de contribuintes (apenas com contribuições confirmadas) |
| Botão Contribuir com Pix | Visível quando status é Disponível ou Em Arrecadação |
| Botão Reservar Presente | Visível quando status é Disponível e sem contribuições ativas |
| Botão Cancelar Reserva | Visível quando status é Reservado e o participante logado foi quem reservou |

## 4. Integração com API

### Endpoints Utilizados

```
GET /presentes/evento/{idEvento}
GET /presentes/status
GET /pix-evento/finalidade?idEvento={idEvento}&finalidade={finalidade}
DELETE /presentes/{id}
POST /presentes/reservar
POST /presentes/cancelar-reserva
```

### Resposta — Listar Presentes (`GET /presentes/evento/{idEvento}`)
```typescript
{
  executouComSucesso: true,
  data: [
    {
      id: number,
      idEvento: number,
      nome: string,
      descricao?: string,
      valor: number,
      linkProduto?: string,
      status: { id: number, descricao: string },
      categoria: { id: number, nome: string },
      contribuicoes?: ContribuicaoPresenteDto[],
      imagens?: Imagem[],
      idParticipanteReservou?: number,
      dataReserva?: Date | string
    }
  ]
}
```

### Resposta — Status dos Presentes (`GET /presentes/status`)
```typescript
{
  executouComSucesso: true,
  data: [
    { id: number, descricao: string }
  ]
}
```

## 5. Rotas Configuradas

- **Lista de Presentes**: `/presentes/:idEvento`
- **Requer autenticação**: Sim (`authGuard`)

## 6. Regras de Negócio

### RN-001: Agrupamento por Status na Listagem
- Os presentes são exibidos em seções separadas por status
- Seção "Disponíveis": `status.id === 1`
- Seção "Reservados": `status.id === 2`
- Seção "Em Arrecadação": `status.id === 3`
- Uma seção só é renderizada se houver ao menos um presente naquele status após aplicação dos filtros

### RN-002: Filtros Combinados
- O filtro de texto e o filtro de status são aplicados conjuntamente (AND)
- O filtro de texto é case-insensitive e busca em `nome` e `descricao`
- O filtro de status compara `status.id` com o valor numérico selecionado no select
- Os computed signals `disponiveis()`, `emArrecadacao()` e `reservados()` derivam de `presentesFiltrados()`

### RN-003: Visibilidade do Botão "Reservar Presente"
- Exibido quando:
  - `status.id === 1` (Disponível)
  - Não há contribuições, ou todas as contribuições têm status Cancelado
- **Computed:** `podeReservar()`

### RN-004: Visibilidade do Botão "Cancelar Reserva"
- Exibido quando:
  - `status.id === 2` (Reservado)
  - `idParticipanteReservou === idParticipanteLogado`
- **Computed:** `podeCancelarReserva()`

### RN-005: Visibilidade do Botão "Contribuir com Pix"
- Exibido quando:
  - `status.id === 1` (Disponível) **ou** `status.id === 3` (Em Arrecadação)
- **Computed:** `podeContribuir()`

### RN-006: Restrição de Exclusão por Status
- Apenas presentes com status "Disponível" (`id === 1`) podem ser excluídos
- Para os demais status, a exclusão é bloqueada e um modal de erro é exibido com mensagem específica
- **Método:** `podeExcluirPresente(presente)`

### RN-007: Fluxo de Adição — Dependência do PIX
- Antes de redirecionar para o cadastro de presente, verifica se existe PIX configurado para a finalidade "Presentes" (`FinalidadePix.Presentes = 1`)
- Sem PIX → redireciona para cadastro de QR Code
- Com PIX → redireciona para cadastro de presente

### RN-008: Progresso de Arrecadação no Card
- A barra de progresso e o total arrecadado só são exibidos quando houver contribuições com valor > 0 e status "Confirmado"
- **Método:** `temContribuicoesComValor()`
- Soma somente contribuições com `idStatusContribuicao === EnumStatusContribuicao.Confirmado`
- Progresso calculado como `Math.min((totalArrecadado / valor) * 100, 100)`

### RN-009: Justificativa de Cancelamento de Reserva
- O campo é obrigatório, com mínimo de 10 e máximo de 500 caracteres
- A justificativa é enviada no corpo da requisição de cancelamento

## 7. Histórico de Alterações

### Versão 1.0 — 22/02/2026
**Alteração:** Versão inicial do documento

**Detalhamento:**
- Critérios de aceite para listagem, filtragem, reserva, cancelamento de reserva, contribuição via Pix e exclusão de presentes
- Documentação do card de presente e seus botões de ação com regras de visibilidade
- Integração com API (endpoints e estrutura de resposta)
- Regras de negócio RN-001 a RN-009
