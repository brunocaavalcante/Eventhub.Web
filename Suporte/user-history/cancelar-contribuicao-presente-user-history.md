# User History - Cancelar Contribuição do Presente

## 1. Critério de Aceite

### 1.1 Cenário 1: Abrir Modal de Cancelamento

DADO que o usuário está visualizando os detalhes de um presente com contribuições
QUANDO o usuário clica na ação "Cancelar contribuição" no menu de ações de uma contribuição
ENTÃO o sistema abre um modal exibindo:
- Título "Cancelar Contribuição"
- Nome do convidado que fez a contribuição
- Valor da contribuição formatado em Real (R$)
- Aviso em destaque vermelho sobre ação irreversível
- Campo obrigatório de justificativa
- Botões "Voltar" e "Confirmar Cancelamento"

#### 1.1.1 Informações adicionais
- **Modal**:
  - Largura: 600px (desktop), 90vw (mobile)
  - Não pode ser fechado clicando fora (`disableClose: true`)
  - Botão X no canto superior direito fecha o modal
- **Aviso Irreversível**:
  - Background vermelho claro (#fcebea)
  - Borda esquerda vermelha de 4px
  - Ícone de erro vermelho
  - Texto: "AÇÃO IRREVERSÍVEL - Ao confirmar, esta contribuição será excluída do total arrecadado e não poderá ser restaurada."
- **Botão X**: fecha o modal

### 1.2 Cenário 2: Validar Justificativa Obrigatória

DADO que o modal de cancelamento está aberto
QUANDO o usuário tenta confirmar sem preencher a justificativa
ENTÃO o sistema exibe mensagem de erro "A justificativa é obrigatória" e não permite prosseguir

#### 1.2.1 Informações adicionais
- **Campo obrigatório** (`Validators.required`)
- **Mínimo de 10 caracteres** (`Validators.minLength(10)`)
- Mensagem de erro abaixo do campo, borda vermelha quando inválido
- **Mensagem de Ajuda**:
  - "Este campo é obrigatório para manter o histórico do evento."
  - Exibida em itálico abaixo do campo

### 1.3 Cenário 3: Validar Tamanho Mínimo da Justificativa

DADO que o usuário está preenchendo a justificativa
QUANDO o usuário digita menos de 10 caracteres e tenta confirmar
ENTÃO o sistema exibe mensagem de erro "A justificativa deve ter pelo menos 10 caracteres" e não permite prosseguir

#### 1.3.1 Informações adicionais
- **Validação em tempo real** ao sair do campo (blur)
- Mensagem de erro com ícone vermelho

### 1.4 Cenário 4: Cancelar Operação (Voltar)

DADO que o modal de cancelamento está aberto
QUANDO o usuário clica no botão "Voltar" ou no X
ENTÃO o sistema fecha o modal sem executar o cancelamento e retorna objeto `{ confirmado: false }`

#### 1.4.1 Informações adicionais
- **Botão Voltar**: estilo outlined, à esquerda do footer

### 1.5 Cenário 5: Confirmar Cancelamento com Justificativa Válida

DADO que o usuário preencheu uma justificativa válida (mínimo 10 caracteres)
QUANDO o usuário clica em "Confirmar Cancelamento"
ENTÃO o sistema:
1. Fecha o modal
2. Retorna objeto `{ confirmado: true, justificativa: 'texto digitado' }`
3. Exibe spinner de carregamento
4. Chama API para cancelar a contribuição
5. Exibe modal de sucesso "Contribuição Cancelada"
6. Recarrega os detalhes do presente atualizando valores arrecadados

#### 1.5.1 Informações adicionais
- **Botão Confirmar**: fundo vermelho, texto branco, desabilitado se formulário inválido
- **Spinner global** durante processamento
- **Modal de sucesso** após conclusão
- **Atualização** dos valores e remoção da contribuição

### 1.6 Cenário 6: Validação Visual do Formulário

DADO que o usuário interagiu com o campo de justificativa
QUANDO o campo perde o foco (blur) ou o usuário tenta submeter
ENTÃO o sistema valida e exibe feedback visual:
- Campo válido: borda verde
- Campo inválido: borda vermelha + mensagem de erro

#### 1.6.1 Informações adicionais
- **Validação automática** via `BaseComponent.configurarValidacaoFormularioBase()`
- Mensagens configuradas em `validationMessages`

### 1.7 Cenário 7: Visualizar Justificativa de Cancelamento

DADO que uma contribuição está cancelada e possui justificativa de cancelamento
QUANDO o organizador visualiza os detalhes do presente na tabela de contribuições
ENTÃO o sistema exibe a ação "Ver justificativa" para aquela contribuição
E QUANDO o organizador clica na ação "Ver justificativa"
ENTÃO o sistema abre um modal exibindo:
- Título: "Justificativa de Cancelamento"
- Conteúdo: texto completo da justificativa
- Botão "Fechar" ou "OK"

#### 1.7.1 Informações adicionais
- **Ação visível apenas para contribuições canceladas** com justificativa (`status === 'cancelado' && !!contrib.justificativaCancelamento`)
- **Ícone da ação**: `info`
- **Posição na tabela**: fica após a ação "Ver comprovante" (posição 2)
- **Modal utilizado**: `ModalSucessComponent` configurado sem ícone
- **Largura do modal**: 600px (desktop), 90vw (mobile)
- **Validação**: se justificativa não estiver disponível, exibe warning "Justificativa de cancelamento não disponível"
- **Componente**: disponível na tela de "Detalhar Presente"

---

## 2. Campos da Interface

### 2.1 Campos do Modal de Cancelamento

| Campo                        | Descrição                                 | Tipo      | Obrigatório | Validações                |
| :--------------------------- | :---------------------------------------- | :-------- | :---------: | :------------------------ |
| Convidado                    | Nome do participante                      | Label     | -           | -                         |
| Valor da Contribuição        | Valor monetário da contribuição           | Label     | -           | Formatado em R$           |
| Justificativa do Cancelamento| Motivo do cancelamento                    | Textarea  | Sim         | Required, MinLength: 10   |

### 2.2 Campos do Modelo de Resposta da API

| Campo                        | Descrição                                                                    | Tipo      | Obrigatório |
| :--------------------------- | :--------------------------------------------------------------------------- | :-------- | :---------: |
| justificativaCancelamento    | Justificativa fornecida pelo organizador no momento do cancelamento          | string    | Não         |

**Observação**: O campo `justificativaCancelamento` é recuperado junto com os detalhes da contribuição e utilizado para exibir a justificativa em contribuições já canceladas.

---

## 3. Regras de Negócio

### RN-01: Validação do Formulário
- O botão "Confirmar Cancelamento" só é habilitado quando o formulário está válido
- Justificativa obrigatória e mínimo de 10 caracteres

### RN-02: Permanência do Cancelamento
- Cancelamento é permanente
- Valor removido do total arrecadado
- Contribuição removida da lista de contribuições ativas

### RN-03: Retorno do Modal
- Modal de cancelamento retorna: `{ confirmado: false }` ou `{ confirmado: true, justificativa }`
- Utilizado para controlar fluxo de execução após fechamento do modal

### RN-04: Integração com API
- Chamada para API para cancelar contribuição após confirmação
- Atualização dos dados do presente após sucesso da operação

### RN-05: Armazenamento da Justificativa
- A justificativa de cancelamento deve ser armazenada permanentemente no banco de dados
- Deve ser recuperada junto com os detalhes da contribuição
- Campo opcional mas recomendado para auditoria e transparência

### RN-06: Visualização da Justificativa
- A ação "Ver justificativa" só aparece para contribuições canceladas que possuem justificativa
- Validação: `status === 'cancelado' && !!contrib.justificativaCancelamento`
- Deve validar existência da justificativa antes de exibir o modal
- Modal de visualização exibe informação sem necessidade de confirmação (apenas leitura)

---

## 4. Histórico de Alterações

| Versão | Data       | Alteração                                                             | Motivo                                                                           | Impacto                                                |
| :----- | :--------- | :-------------------------------------------------------------------- | :------------------------------------------------------------------------------- | :----------------------------------------------------- |
| 1.0    | -          | Criação da funcionalidade de cancelamento de contribuições           | Necessidade de permitir correção de erros e gestão de contribuições             | Implementação inicial                                  |
| 1.1    | 05/02/2026 | Implementação da visualização de justificativa de cancelamento        | Necessidade de auditoria e transparência sobre cancelamentos de contribuições    | Melhoria na rastreabilidade e prestação de contas      |

---

**Resumo técnico fiel ao código atual.**
