# User History - Reservar Presente

## 1. Informações Gerais

- **ID:** US-007
- **Título:** Reservar Presente do Evento
- **Módulo:** gestao-presentes
- **Prioridade:** Alta
- **Estimativa:** M (Média)
- **Dependências:** Nenhuma

---

## 2. História do Usuário

**Como** convidado do evento,  
**Quero** reservar um presente por inteiro,  
**Para** garantir que irei presentear os noivos/aniversariante com aquele item específico sem que outras pessoas também o comprem.

---

## 3. Critérios de Aceite

### 3.1 Cenário 1: Exibir Botão de Reservar no Card do Presente

**DADO** que o convidado está visualizando a lista de presentes  
**QUANDO** o sistema exibe os cards dos presentes  
**ENTÃO** o sistema deve mostrar botão "Reservar" apenas em presentes que:
- Status = Disponível (id: 1)
- NÃO possuem contribuições

**E** presentes com contribuições ou já reservados NÃO devem exibir o botão de reservar

#### 3.1.1 Informações Adicionais
- **Validações:**
  - Verificar `presente.status.id === 1` (Disponível)
  - Verificar `presente.contribuicoes.length === 0` ou `!presente.contribuicoes`
- **Comportamento:**
  - Botão exibido com ícone de bookmark/tag e texto "Reservar"
  - Cor primária do tema
  - Posicionado na área de ações do card
- **Feedback:**
  - Tooltip ao passar mouse: "Reservar este presente"

### 3.2 Cenário 2: Confirmar Reserva do Presente

**DADO** que o convidado clicou no botão "Reservar"  
**QUANDO** o sistema processa a ação  
**ENTÃO** o sistema deve exibir modal/popup de confirmação contendo:
- Nome do presente
- Valor total do presente (formatado em R$)
- Link do produto (se disponível)
- Botões: "Sim, Reservar" e "Cancelar"

**E** ao clicar em "Sim, Reservar":
- Alterar status do presente para Reservado (id: 2)
- Registrar ID do participante que reservou
- Registrar data/hora da reserva
- Enviar notificação para organizadores do evento
- Exibir mensagem de sucesso: "Presente reservado com sucesso!"
- Fechar modal
- Atualizar lista de presentes

**E** ao clicar em "Cancelar":
- Fechar modal sem realizar ação

#### 3.2.1 Informações Adicionais
- **Validações no Backend:**
  - Verificar se presente ainda está disponível (evitar race condition)
  - Verificar se presente não possui contribuições
  - Verificar se participante está vinculado ao evento
- **Notificação para Organizadores:**
  - Título: "Presente Reservado!"
  - Mensagem: "[Nome do Convidado] reservou o presente [Nome do Presente] no valor de R$ [Valor]"
  - Tipo: Info/Success
- **Mensagem de Sucesso:**
  - Toast verde no topo da tela
  - Duração: 5 segundos
  - Texto: "Presente reservado com sucesso! O organizador foi notificado."

### 3.3 Cenário 3: Exibir Botão de Cancelar Reserva

**DADO** que um presente foi reservado pelo convidado atual  
**QUANDO** o sistema exibe o card do presente  
**ENTÃO** o botão "Reservar" deve ser substituído por "Cancelar Reserva"

**E** o botão deve ser exibido apenas para o convidado que fez a reserva

#### 3.3.1 Informações Adicionais
- **Validações:**
  - Verificar `presente.status.id === 2` (Reservado)
  - Verificar `presente.idParticipanteReservou === idParticipanteLogado`
- **Comportamento:**
  - Botão exibido com ícone de close/cancel e texto "Cancelar Reserva"
  - Cor de erro/warning (vermelho/laranja)
  - Tooltip ao passar mouse: "Cancelar minha reserva"

### 3.4 Cenário 4: Cancelar Reserva com Justificativa

**DADO** que o convidado clicou em "Cancelar Reserva"  
**QUANDO** o sistema processa a ação  
**ENTÃO** o sistema deve exibir modal de cancelamento contendo:
- Título: "Cancelar Reserva"
- Mensagem: "Tem certeza que deseja cancelar a reserva do presente '[Nome do Presente]'?"
- Campo obrigatório: "Justificativa" (textarea, mín. 10 caracteres)
- Botões: "Sim, Cancelar" e "Voltar"

**E** ao clicar em "Sim, Cancelar" com justificativa válida:
- Alterar status do presente de volta para Disponível (id: 1)
- Remover vínculo com participante
- Registrar histórico de cancelamento (justificativa)
- Enviar notificação para organizadores
- Exibir mensagem de sucesso: "Reserva cancelada com sucesso!"
- Fechar modal
- Atualizar lista de presentes

**E** ao clicar sem preencher justificativa:
- Exibir erro: "Por favor, informe o motivo do cancelamento (mínimo 10 caracteres)"

#### 3.4.1 Informações Adicionais
- **Validações:**
  - Justificativa obrigatória
  - Mínimo 10 caracteres
  - Máximo 500 caracteres
- **Notificação para Organizadores:**
  - Título: "Reserva Cancelada"
  - Mensagem: "[Nome do Convidado] cancelou a reserva do presente [Nome do Presente]. Motivo: [Justificativa]"
  - Tipo: Warning
- **Mensagem de Sucesso:**
  - Toast amarelo/laranja no topo
  - Duração: 5 segundos
  - Texto: "Reserva cancelada. O presente voltou a ficar disponível."

### 3.5 Cenário 5: Presente Reservado por Outro Convidado

**DADO** que um presente foi reservado por outro convidado  
**QUANDO** o convidado atual visualiza o card  
**ENTÃO** o sistema NÃO deve exibir botão "Reservar" nem "Cancelar Reserva"

**E** deve exibir badge/chip "Reservado" indicando que não está disponível

#### 3.5.1 Informações Adicionais
- **Comportamento:**
  - Badge com texto "Reservado"
  - Cor cinza/neutro
  - Posicionado no topo do card
  - Opcionalmente: exibir nome do convidado que reservou (se permitido pelo organizador)

### 3.6 Cenário 6: Validação de Integridade

**DADO** que um presente possui contribuições  
**QUANDO** o sistema verifica disponibilidade para reserva  
**ENTÃO** o botão "Reservar" NÃO deve ser exibido

**E** o sistema deve exibir indicação de que o presente está em arrecadação

#### 3.6.1 Informações Adicionais
- **Validações:**
  - Verificar `presente.contribuicoes && presente.contribuicoes.length > 0`
  - Mesmo que status seja "Disponível", se houver contribuição, não permitir reserva
- **Feedback:**
  - Exibir badge "Em Arrecadação"
  - Mostrar progresso da vaquinha

---

## 4. Regras de Negócio

### RN-001: Elegibilidade para Reserva
**Descrição:** Um presente só pode ser reservado se atender TODAS as condições:
- Status = Disponível (id: 1)
- Não possui contribuições (contribuicoes.length === 0)
- Convidado está vinculado ao evento

**Justificativa:** Evitar conflitos entre reserva total e contribuição fracionada. Um presente não pode ter ambos os fluxos simultaneamente.

**Exceções:** Nenhuma

### RN-002: Unicidade de Reserva
**Descrição:** Um presente pode ter apenas UMA reserva ativa por vez. Apenas um convidado pode reservar o mesmo presente.

**Justificativa:** Garantir que não haja duplicidade de compras do mesmo item.

**Exceções:** Nenhuma

### RN-003: Cancelamento Restrito
**Descrição:** Apenas o convidado que fez a reserva pode cancelá-la. Organizadores do evento também podem cancelar via painel administrativo.

**Justificativa:** Dar controle ao convidado sobre sua reserva, mas permitir que organizadores gerenciem em caso de necessidade.

**Exceções:** 
- Organizador principal pode cancelar qualquer reserva
- Sistema pode cancelar automaticamente se evento for cancelado

### RN-004: Justificativa Obrigatória
**Descrição:** Ao cancelar uma reserva, o convidado DEVE informar uma justificativa com no mínimo 10 caracteres.

**Justificativa:** Criar histórico de cancelamentos para análise dos organizadores e evitar cancelamentos levianoos.

**Exceções:** Nenhuma

### RN-005: Notificação aos Organizadores
**Descrição:** Toda reserva e cancelamento de reserva DEVE gerar notificação para os organizadores do evento em tempo real.

**Justificativa:** Manter organizadores informados sobre movimentações importantes na lista de presentes.

**Exceções:** Se organizador desabilitar notificações nas configurações (funcionalidade futura)

### RN-006: Bloqueio por Contribuições
**Descrição:** Se um presente tiver ao menos uma contribuição ativa, a opção de reserva NÃO deve ser disponibilizada, mesmo que o status seja "Disponível".

**Justificativa:** Evitar complexidade de devoluções e conflitos entre contribuição fracionada e reserva total.

**Exceções:** Nenhuma

### RN-007: Alteração de Status
**Descrição:** Ao reservar, o status do presente muda de "Disponível" (1) para "Reservado" (2). Ao cancelar, volta para "Disponível" (1).

**Justificativa:** Manter integridade do modelo de dados e facilitar consultas e relatórios.

**Exceções:** Nenhuma

---

## 5. Campos da Interface

### 5.1 Card do Presente (consultar-presentes)

#### Botão "Reservar"
- **Tipo:** Button (Angular Material)
- **Label:** "Reservar"
- **Ícone:** bookmark_border ou local_offer
- **Cor:** primary
- **Validação:** Exibir apenas se status=1 E contribuicoes.length=0
- **Ação:** Abrir modal de confirmação

#### Botão "Cancelar Reserva"
- **Tipo:** Button (Angular Material)
- **Label:** "Cancelar Reserva"
- **Ícone:** close ou cancel
- **Cor:** warn
- **Validação:** Exibir apenas se status=2 E idParticipanteReservou === idUsuarioLogado
- **Ação:** Abrir modal de cancelamento

### 5.2 Modal de Confirmação de Reserva

```typescript
{
  "titulo": "Confirmar Reserva",
  "conteudo": {
    "nomePresente": "[Nome do Presente]",
    "valor": "[R$ X.XXX,XX]",
    "linkProduto": "[URL]" // Opcional
  },
  "mensagemConfirmacao": "Deseja reservar este presente? O organizador será notificado.",
  "botoes": [
    { "label": "Sim, Reservar", "action": "confirmar", "color": "primary" },
    { "label": "Cancelar", "action": "fechar", "color": "basic" }
  ]
}
```

### 5.3 Modal de Cancelamento de Reserva

```typescript
{
  "titulo": "Cancelar Reserva",
  "conteudo": {
    "mensagem": "Tem certeza que deseja cancelar a reserva do presente '[Nome]'?",
    "campoJustificativa": {
      "label": "Motivo do cancelamento *",
      "tipo": "textarea",
      "placeholder": "Informe o motivo do cancelamento (mínimo 10 caracteres)",
      "validacao": {
        "obrigatorio": true,
        "minCaracteres": 10,
        "maxCaracteres": 500
      }
    }
  },
  "botoes": [
    { "label": "Sim, Cancelar", "action": "confirmar", "color": "warn", "disabled": "!justificativaValida" },
    { "label": "Voltar", "action": "fechar", "color": "basic" }
  ]
}
```

---

## 6. Protótipo/Referência Visual

### Layout do Card com Botão de Reservar

```
┌─────────────────────────────────────┐
│  [Imagem do Presente]               │
│                                     │
│  **Nome do Presente**               │
│  R$ 1.500,00                        │
│                                     │
│  ┌──────────┐  ┌────────────────┐ │
│  │ Detalhes │  │ 🔖 Reservar    │ │
│  └──────────┘  └────────────────┘ │
└─────────────────────────────────────┘
```

### Layout do Modal de Confirmação

```
┌───────────────────────────────────────┐
│  Confirmar Reserva              ╳     │
├───────────────────────────────────────┤
│                                       │
│  Presente: Smart TV 50"               │
│  Valor: R$ 2.500,00                   │
│  Link: www.loja.com/tv123             │
│                                       │
│  Deseja reservar este presente?       │
│  O organizador será notificado.       │
│                                       │
│  ┌──────────┐  ┌──────────────────┐ │
│  │ Cancelar │  │ ✓ Sim, Reservar  │ │
│  └──────────┘  └──────────────────┘ │
└───────────────────────────────────────┘
```

### Layout do Modal de Cancelamento

```
┌───────────────────────────────────────┐
│  Cancelar Reserva               ╳     │
├───────────────────────────────────────┤
│                                       │
│  Tem certeza que deseja cancelar      │
│  a reserva do presente 'Smart TV'?    │
│                                       │
│  Motivo do cancelamento *             │
│  ┌───────────────────────────────┐   │
│  │ Consegui melhor preço em      │   │
│  │ outra loja                    │   │
│  └───────────────────────────────┘   │
│  Mínimo 10 caracteres                 │
│                                       │
│  ┌──────────┐  ┌──────────────────┐ │
│  │ Voltar   │  │ ⚠ Sim, Cancelar  │ │
│  └──────────┘  └──────────────────┘ │
└───────────────────────────────────────┘
```

---

## 7. Endpoints da API

### 7.1 Reservar Presente

**POST** `/api/presentes/{idPresente}/reservar`

**Request Body:**
```json
{
  "idParticipante": 123
}
```

**Response Success (200):**
```json
{
  "executouComSucesso": true,
  "data": {
    "id": 456,
    "idPresente": 789,
    "idParticipante": 123,
    "dataReserva": "2026-02-07T10:30:00",
    "status": {
      "id": 2,
      "descricao": "Reservado"
    }
  },
  "avisos": [],
  "erros": []
}
```

**Response Error (400):**
```json
{
  "executouComSucesso": false,
  "data": null,
  "avisos": [],
  "erros": [
    "Presente já possui contribuições e não pode ser reservado",
    "Presente já está reservado por outro convidado"
  ]
}
```

### 7.2 Cancelar Reserva

**POST** `/api/presentes/{idPresente}/cancelar-reserva`

**Request Body:**
```json
{
  "idParticipante": 123,
  "justificativa": "Consegui o presente em outro lugar por um preço melhor"
}
```

**Response Success (200):**
```json
{
  "executouComSucesso": true,
  "data": null,
  "avisos": [],
  "erros": []
}
```

**Response Error (400):**
```json
{
  "executouComSucesso": false,
  "data": null,
  "avisos": [],
  "erros": [
    "Você não tem permissão para cancelar esta reserva",
    "Justificativa deve ter no mínimo 10 caracteres"
  ]
}
```

---

## 8. Tarefas Técnicas

### 8.1 Backend (Não escopo deste documento)
- ✅ Endpoint POST `/api/presentes/{id}/reservar`
- ✅ Endpoint POST `/api/presentes/{id}/cancelar-reserva`
- ✅ Adicionar campos no model: `idParticipanteReservou`, `dataReserva`
- ✅ Validações de regras de negócio
- ✅ Sistema de notificações para organizadores

### 8.2 Frontend

#### Models (core/models/)
- [ ] Adicionar `ReservarPresenteDto` em `presente.model.ts`
- [ ] Adicionar `CancelarReservaPresenteDto` em `presente.model.ts`
- [ ] Adicionar campos `idParticipanteReservou?: number` e `dataReserva?: Date` na interface `Presente`

#### Services (core/services/)
- [ ] Adicionar método `reservarPresente(idPresente, idParticipante)` em `presente.service.ts`
- [ ] Adicionar método `cancelarReserva(idPresente, justificativa)` em `presente.service.ts`

#### Components (views/pages/gestao-presentes/)
- [ ] Adicionar lógica de validação no `card-presente.component.ts`:
  - Computed property `podeReservar()`
  - Computed property `podeCancelarReserva()`
  - Método `confirmarReserva()`
  - Método `abrirCancelamentoReserva()`
- [ ] Adicionar botões no template `card-presente.component.html`
- [ ] Estilizar botões em `card-presente.component.scss`
- [ ] Criar componente de modal de confirmação (ou usar ModalService)
- [ ] Criar componente de modal de cancelamento

#### Testes (*.spec.ts)
- [ ] Testar validação `podeReservar()` no `card-presente.component.spec.ts`
- [ ] Testar validação `podeCancelarReserva()` no `card-presente.component.spec.ts`
- [ ] Testar chamada de API em `presente.service.spec.ts`
- [ ] Testar fluxo completo de reserva e cancelamento

---

## 9. Cenários de Teste Prioritários

### Teste 1: Reservar Presente Disponível
- **Setup:** Presente com status=1, sem contribuições
- **Ação:** Clicar em "Reservar" e confirmar
- **Esperado:** Status muda para 2, botão muda para "Cancelar Reserva", sucesso exibido

### Teste 2: Bloquear Reserva de Presente com Contribuição
- **Setup:** Presente com status=1, MAS com contribuições
- **Ação:** Visualizar card
- **Esperado:** Botão "Reservar" NÃO é exibido

### Teste 3: Cancelar Reserva com Justificativa
- **Setup:** Presente reservado pelo usuário logado
- **Ação:** Clicar em "Cancelar Reserva", preencher justificativa, confirmar
- **Esperado:** Status volta para 1, botão volta para "Reservar", sucesso exibido

### Teste 4: Bloquear Cancelamento sem Justificativa
- **Setup:** Presente reservado pelo usuário
- **Ação:** Clicar em "Cancelar Reserva", NÃO preencher justificativa, clicar em confirmar
- **Esperado:** Erro de validação, modal não fecha

### Teste 5: Ocultar Botões para Presente Reservado por Outro
- **Setup:** Presente reservado por participante ID=999, usuário logado ID=123
- **Ação:** Visualizar card
- **Esperado:** Nenhum botão de ação exibido, apenas badge "Reservado"

---

## 10. Definição de Pronto (DoD)

- [x] Regras de negócio documentadas
- [ ] User story criada e revisada
- [ ] DTOs criados nos models
- [ ] Métodos adicionados no service
- [ ] Lógica implementada no componente
- [ ] Interface atualizada (botões e modais)
- [ ] Estilos aplicados conforme design system
- [ ] Validações de formulário funcionando
- [ ] Mensagens de sucesso/erro implementadas
- [ ] Testes unitários escritos e passando
- [ ] Código revisado (segue padrões do projeto)
- [ ] Funcionalidade testada manualmente
- [ ] Sem erros no console
- [ ] Documentação atualizada

---

## 11. Observações e Melhorias Futuras

### Versão 1.0 (MVP)
- Reserva simples com confirmação
- Cancelamento com justificativa
- Notificações básicas

### Versão 2.0 (Futuro)
- Histórico completo de reservas/cancelamentos
- Prazo limite para reserva (X dias antes do evento)
- Permitir organizador configurar se exibe nome de quem reservou
- Relatório de todas as reservas do evento
- Opção de "liberar reserva" pelo organizador
- Sistema de lembretes (lembrar convidado que reservou)
- Analytics: taxa de reserva vs contribuição

---

**Criada em:** 07/02/2026  
**Atualizada em:** 07/02/2026  
**Autor:** Bruno C  
**Status:** ✅ Pronta para Implementação
