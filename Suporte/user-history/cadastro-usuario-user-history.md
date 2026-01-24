# User History - Cadastro de Usuário

## 1. Critério de Aceite

### 1.1 Cenário 1: Cadastro com Dados Válidos

**DADO** que o usuário está na página de cadastro  
**QUANDO** o usuário preenche todos os campos obrigatórios corretamente e clica em "Cadastrar"  
**ENTÃO** o sistema cria a conta do usuário, exibe modal de sucesso com a mensagem "Seu cadastro foi realizado com sucesso!" e ao fechar o modal redireciona para a página de login ("/usuarios/login")

#### 1.1.1 Informações adicionais
- **Validações**: 
  - Nome deve ter no mínimo 3 caracteres
  - Email deve ser um endereço de e-mail válido
  - Senha deve ter no mínimo 6 caracteres
  - Confirmar Senha deve ser igual à Senha
  - Telefone deve seguir o formato "(99) 99999-9999"
- **Comportamento**: 
  - Botão "Cadastrar" desabilitado durante o carregamento
  - Exibe "Cadastrando..." enquanto processa o cadastro
  - Modal de sucesso com título "Cadastro Realizado" e botão "Fechar"
  - Mensagens de erro exibidas abaixo dos campos inválidos com ícone de erro

### 1.2 Cenário 2: Validação de Confirmação de Senha

**DADO** que o usuário está preenchendo o formulário de cadastro  
**QUANDO** o usuário preenche os campos "Senha" e "Confirmar Senha" com valores diferentes e remove o foco do campo  
**ENTÃO** o sistema valida e exibe a mensagem de erro "As senhas não coincidem" no campo "Confirmar Senha"

#### 1.2.1 Informações adicionais
- **Validações**:
  - Validação é executada no evento blur (perda de foco) dos campos de senha
  - Validação compara os valores dos campos senha e confirmarSenha
- **Comportamento**:
  - Erro é removido automaticamente quando as senhas ficam iguais

### 1.3 Cenário 3: Tentativa de Cadastro com Campos Inválidos

**DADO** que o usuário está na página de cadastro  
**QUANDO** o usuário tenta submeter o formulário com campos vazios ou inválidos  
**ENTÃO** o sistema marca todos os campos como tocados e exibe mensagens de erro específicas para cada validação

#### 1.3.1 Informações adicionais
- **Validações**:
  - Nome vazio: "Informe o Nome"
  - Nome menor que 3 caracteres: "O Nome deve ter pelo menos 3 caracteres"
  - Email vazio: "Informe o E-mail"
  - Email inválido: "E-mail inválido"
  - Senha vazia: "Informe a Senha"
  - Senha menor que 6 caracteres: "A Senha deve ter pelo menos 6 caracteres"
  - Confirmar Senha vazio: "Confirme a Senha"
  - Senhas diferentes: "As senhas não coincidem"
  - Telefone vazio: "Informe o Telefone"
  - Telefone inválido: "Telefone inválido"
- **Comportamento**:
  - Formulário não é submetido se houver erros de validação
  - Botão permanece desabilitado até que todos os campos sejam válidos

### 1.4 Cenário 4: Visualizar/Ocultar Senha

**DADO** que o usuário está preenchendo o formulário de cadastro  
**QUANDO** o usuário clica no ícone de olho (visibility/visibility_off) nos campos de senha  
**ENTÃO** o sistema alterna a visibilidade da senha entre texto visível e oculto (mascarado)

#### 1.4.1 Informações adicionais
- **Comportamento**:
  - Ícone "visibility" quando senha está oculta
  - Ícone "visibility_off" quando senha está visível
  - Funcionalidade disponível tanto para "Senha" quanto para "Confirmar Senha"
  - Cursor muda para pointer ao passar sobre o ícone

### 1.5 Cenário 5: Navegação para Login

**DADO** que o usuário está na página de cadastro  
**QUANDO** o usuário clica no link "Faça login"  
**ENTÃO** o sistema redireciona para a página de login ("/usuarios/login")

#### 1.5.1 Informações adicionais
- **Comportamento**: 
  - Link destacado na parte inferior do formulário
  - Texto: "Já tem uma conta? Faça login"

## 2. Campos da Interface

| Campo | Descrição | Tipo | Obrigatório |
| :--- | :--- | :--- | :--- |
| Nome | Nome completo do usuário (Placeholder: "Seu nome completo") | Input (text) | Sim |
| Email | Email para cadastro (Placeholder: "seu@email.com") | Input (email) | Sim |
| Senha | Senha de acesso com toggle de visibilidade (Placeholder: "Sua senha") | Input (password/text) | Sim |
| Confirmar Senha | Confirmação da senha com toggle de visibilidade (Placeholder: "Confirme sua senha") | Input (password/text) | Sim |
| Telefone | Telefone com máscara "(99) 99999-9999" (Placeholder: "(99) 99999-9999") | Input (tel) | Sim |
