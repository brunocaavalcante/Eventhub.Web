# User History - Detalhes do Presente

## 1. Critério de Aceite

### 1.1 Cenário 1: Visualizar Detalhes Completos do Presente

**DADO** que o usuário está na lista de presentes
**QUANDO** o usuário clica em "Ver Detalhes" no menu de um presente
**ENTÃO** o sistema redireciona para a página de detalhes exibindo:
- Carrossel de imagens do presente (com navegação se houver múltiplas imagens)
- Nome do presente
- Descrição (se disponível)
- Total arrecadado (em verde)
- Valor restante (em rosa)
- Lista completa de contribuições com nome do participante, foto, valor doado, data e status

#### 1.1.1 Informações adicionais
- **Carrossel de Imagens**:
  - Navegação com setas esquerda/direita
  - Indicadores de posição na parte inferior
  - Clique nos indicadores para ir diretamente à imagem
- **Valores**:
  - Total arrecadado exibido em card verde com ícone de check
  - Valor restante exibido em card rosa com ícone de coração
  - Valores formatados em Real brasileiro (R$)
- **Lista de Contribuições**:
  - Tabela com colunas: Convidado, Valor Doado, Data, Status, Ações
  - Foto do participante circular de 40px
  - Status exibido como texto em negrito com cores diferenciadas (verde para "Validado", amarelo para "Pendente")
  - Desktop: Ações exibidas como ícones com tooltip (até 3 ações) ou menu suspenso (mais de 3 ações)
  - Mobile: Ações sempre exibidas em menu suspenso com ícone e descrição

### 1.2 Cenário 2: Filtrar Contribuições por Nome

**DADO** que o usuário está na página de detalhes do presente
**QUANDO** o usuário digita um termo no campo "Filtrar por nome..."
**ENTÃO** o sistema filtra a lista de contribuições exibindo apenas os participantes cujo nome ou email contém o termo digitado (case-insensitive)

#### 1.2.1 Informações adicionais
- **Filtro**:
  - Campo com ícone de busca
  - Filtro em tempo real (a cada tecla digitada)
  - Busca por nome e email do participante
  - Exibe mensagem "Nenhuma contribuição encontrada" se não houver resultados

### 1.3 Cenário 3: Navegar no Carrossel de Imagens

**DADO** que o usuário está visualizando um presente com múltiplas imagens
**QUANDO** o usuário clica nas setas de navegação ou nos indicadores
**ENTÃO** o sistema altera a imagem exibida mantendo a transição suave

#### 1.3.1 Informações adicionais
- **Navegação**:
  - Seta esquerda: imagem anterior (volta para última se estiver na primeira)
  - Seta direita: próxima imagem (volta para primeira se estiver na última)
  - Indicadores: clique direto na bolinha para ir à imagem específica
  - Indicador ativo destacado em cor primária

### 1.4 Cenário 4: Acessar Ações da Contribuição

**DADO** que o usuário está visualizando as contribuições
**QUANDO** o usuário interage com a coluna de ações
**ENTÃO** o sistema permite executar ações disponíveis para cada contribuição

#### 1.4.1 Informações adicionais
- **Desktop com até 3 ações**:
  - Ícones exibidos diretamente na linha
  - Tooltip ao passar o mouse mostrando a descrição da ação
- **Desktop com mais de 3 ações**:
  - Ícone de menu (three dots vertical)
  - Ao clicar, exibe menu suspenso com todas as ações
  - Cada item do menu mostra ícone + descrição
- **Mobile**:
  - Sempre exibe ícone de menu (three dots vertical)
  - Ao clicar, exibe menu suspenso com ícone + descrição das ações
  - Funciona independente da quantidade de ações
- **Exemplo de ação**: "Ver comprovante" com ícone "receipt"
- **Comportamento**: Atualmente registra no console (TODO: Implementar modal/página)

### 1.5 Cenário 5: Voltar para Lista de Presentes

**DADO** que o usuário está na página de detalhes
**QUANDO** o usuário clica em "Voltar para Lista de Presentes"
**ENTÃO** o sistema retorna à página anterior (lista de presentes do evento)

#### 1.5.1 Informações adicionais
- **Botão**: Localizado no topo da página com seta para esquerda
- **Comportamento**: Usa `Location.back()` para voltar

### 1.6 Cenário 6: Presente sem Contribuições

**DADO** que um presente não possui contribuições ainda
**QUANDO** o usuário visualiza os detalhes
**ENTÃO** o sistema exibe:
- Total arrecadado: R$ 0,00
- Valor restante: igual ao valor total do presente
- Tabela vazia com mensagem "Nenhuma contribuição encontrada" e ícone de rosto triste

## 2. Campos da Interface

| Campo | Descrição | Tipo | Obrigatório |
| :--- | :--- | :--- | :--- |
| Carrossel de Imagens | Exibe imagens do presente com navegação | Carousel | Não |
| Nome do Presente | Título principal | Texto | Sim |
| Meta Total | Label descritiva "Meta total do presente" | Texto | Sim |
| Total Arrecadado | Soma de todas contribuições validadas | Valor monetário | Sim |
| Valor Restante | Diferença entre valor total e arrecadado | Valor monetário | Sim |
| Descrição | Detalhes adicionais do presente | Texto | Não |
| Filtro de Nome | Campo de busca para filtrar contribuições | Input (text) | Não |
| Tabela de Contribuições | Lista todas as contribuições com detalhes | Tabela | Sim |

## 3. Estrutura da Tabela de Contribuições

| Coluna | Descrição | Formato |
| :--- | :--- | :--- |
| Convidado | Nome e foto do participante | Avatar + Texto |
| Valor Doado | Quantia contribuída | R$ 0,00 |
| Data | Data da contribuição | DD/MM/YYYY |
| Status | Estado da contribuição | Texto negrito colorido (Verde: Validado/Pago/Ativo, Amarelo: Pendente/Aguardando, Vermelho: Cancelado/Inativo) |
| Ações | Botões para ações disponíveis | Ícones com tooltip (desktop ≤3 ações) ou Menu suspenso (desktop >3 ações ou mobile) |

## 4. Integração com API

### Endpoint Utilizado
```
GET /presentes/{id}/detalhes
```

### Resposta Esperada
```typescript
{
  executouComSucesso: true,
  data: {
    id: number,
    idEvento: number,
    nome: string,
    descricao?: string,
    valor: number,
    status: { id: number, descricao: string },
    categoria: { id: number, nome: string },
    imagens?: [{ base64: string, nomeArquivo: string, tipoImagem: string }],
    contribuicoes: [
      {
        id: number,
        valor: number,
        dataCadastro: Date | string,
        status: string,
        participante: {
          id: number,
          nome: string,
          email?: string,
          foto?: string
        }
      }
    ]
  }
}
```

## 5. Rotas Configuradas

- **Detalhes**: `/presentes/detalhes/:idEvento/:id`
- **Requer autenticação**: Sim (`authGuard`)
## 6. Regras de Negócio

### RN-001: Cálculo do Total Arrecadado
- O total arrecadado deve somar APENAS as contribuições com status "Validado", "Pago" ou "Ativo" (case-insensitive)
- Contribuições pendentes ou canceladas não devem ser contabilizadas
- **Validação:** `status.descricao.toLowerCase() !== 'pendente' && status.descricao.toLowerCase() !== 'cancelado'`

### RN-002: Cálculo do Valor Restante
- O valor restante é calculado como: `Valor Total do Presente - Total Arrecadado`
- Se o valor restante for negativo (arrecadação excedeu meta), deve exibir R$ 0,00
- **Fórmula:** `Math.max(0, presente.valor - totalArrecadado)`

### RN-003: Visibilidade da Ação "Ver Comprovante"
- A ação "Ver comprovante" deve ser exibida SOMENTE quando a contribuição possui comprovante anexado
- **Validação:** `contrib.comprovante != null`
- **Justificativa:** Não faz sentido mostrar botão para visualizar algo que não existe
- **Ícone:** `receipt`

### RN-004: Visibilidade da Ação "Ver Justificativa de Cancelamento"
- A ação "Ver justificativa" deve ser exibida SOMENTE quando a contribuição está cancelada E possui justificativa de cancelamento
- **Validação:** `status === 'cancelado' && !!contrib.justificativaCancelamento`
- **Justificativa:**
  - Permite auditoria e transparência sobre o motivo do cancelamento
  - Só aparece quando há informação relevante para exibir
  - Contribui para rastreabilidade das operações
- **Ícone:** `info`
- **Comportamento:** Abre modal exibindo título "Justificativa de Cancelamento" e o texto da justificativa

### RN-005: Visibilidade da Ação "Confirmar Contribuição"
- A ação "Confirmar contribuição" deve ser exibida SOMENTE para contribuições que NÃO estão confirmadas E NÃO estão canceladas
- **Validação:** `status !== 'confirmado' && status !== 'cancelado'`
- **Justificativa:**
  - Não faz sentido confirmar algo já confirmado
  - Não faz sentido confirmar algo cancelado
  - Deve aparecer apenas para contribuições pendentes
- **Ícone:** `check_circle`

### RN-006: Visibilidade da Ação "Editar Contribuição"
- A ação "Editar contribuição" deve ser exibida para todas contribuições EXCETO as canceladas
- **Validação:** `status !== 'cancelado'`
- **Justificativa:**
  - Pode editar contribuições pendentes
  - Pode editar contribuições já confirmadas (para correções)
  - NÃO pode editar contribuições canceladas (já foram invalidadas)
- **Ícone:** `edit`

### RN-006: Visibilidade da Ação "Cancelar Contribuição"
- A ação "Cancelar contribuição" deve ser exibida para todas contribuições EXCETO as já canceladas
- **Validação:** `status !== 'cancelado'`
- **Justificativa:**
  - Pode cancelar contribuições pendentes
  - Pode cancelar contribuições confirmadas
  - NÃO pode cancelar algo já cancelado (redundante)
- **Ícone:** `cancel`

### RN-008: Ordenação das Ações na Tabela
- As ações na coluna "Ações" devem seguir a seguinte ordem:
  1. Ver comprovante (visualização de documento)
  2. Ver justificativa (visualização de cancelamento)
  3. Confirmar contribuição (ação primária positiva)
  4. Editar contribuição (modificação)
  5. Cancelar contribuição (ação destrutiva)
- **Justificativa:** Segue padrão UX de colocar ações destrutivas por último, priorizando visualizações e confirmação

### RN-009: Filtro de Contribuições
- O filtro deve buscar em nome e email do participante
- A busca deve ser case-insensitive
- O filtro deve ser aplicado em tempo real (a cada tecla digitada)
- Se nenhuma contribuição corresponder, exibir mensagem "Nenhuma contribuição encontrada"

### RN-010: Exibição de Ações (Desktop vs Mobile)
- **Desktop com até 3 ações:** Exibir ícones diretamente com tooltip
- **Desktop com mais de 3 ações:** Exibir menu suspenso (three dots)
- **Mobile:** Sempre exibir menu suspenso, independente da quantidade de ações
- **Nota:** A visibilidade das ações é dinâmica baseada no status de cada contribuição

## 7. Histórico de Alterações

### Versão 1.2 - 05/02/2026
**Alteração:** Implementação da funcionalidade de visualização de justificativa de cancelamento

**Detalhamento:**
- Adicionada RN-004: Regra de visibilidade para ação "Ver justificativa"
- Adicionado campo `justificativaCancelamento` no modelo `ContribuicaoDetalhesDto`
- Implementado método `verJustificativaCancelamento()` que exibe modal com a justificativa
- Atualizada RN-008: Ordenação das ações incluindo a nova ação "Ver justificativa"

**Motivo:**
- Necessidade de auditoria e transparência sobre cancelamentos de contribuições
- Permitir que organizadores revisitem os motivos de cancelamentos passados
- Melhorar rastreabilidade das operações no sistema

**Impacto:**
- Maior transparência nas operações de cancelamento
- Facilitação de auditoria e prestação de contas
- Melhoria na experiência do usuário ao fornecer contexto sobre contribuições canceladas

### Versão 1.1 - 05/02/2026
**Alteração:** Refinamento das regras de visibilidade das ações na tabela de contribuições

**Detalhamento:**
- Adicionada RN-003 a RN-007: Regras específicas de visibilidade para cada ação
- Implementada lógica condicional para exibir ações baseadas no status da contribuição
- Estabelecida ordem padrão das ações seguindo boas práticas de UX

**Motivo:**
- Inconsistências lógicas identificadas durante implementação da funcionalidade de visualização de comprovante
- Necessidade de documentar regras que não estavam explícitas na versão anterior
- Melhorar clareza e coerência das regras de negócio para facilitar manutenção futura

**Impacto:**
- Melhoria na experiência do usuário ao ocultar ações irrelevantes
- Redução de erros ao tentar executar ações impossíveis (ex: confirmar algo já confirmado)
- Código mais manutenível e alinhado com a documentação

### Versão 1.0 - Data inicial
**Alteração:** Versão inicial do documento

**Detalhamento:**
- Critérios de aceite para visualização de detalhes do presente
- Estrutura da interface e tabela de contribuições
- Integração com API