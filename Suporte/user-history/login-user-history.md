# User History - Login

## 1. Critério de Aceite

### 1.1 Cenário 1: Login com Credenciais Válidas

**DADO** que o usuário está na página de login  
**QUANDO** o usuário preenche o email e senha válidos e clica em "Entrar"  
**ENTÃO** o sistema valida as credenciais, autentica o usuário e redireciona para a página inicial ("/")

#### 1.1.1 Informações adicionais
- **Validações**: 
  - Email deve ser um endereço de e-mail válido
  - Senha deve ter no mínimo 6 caracteres
- **Comportamento**: 
  - Botão "Entrar" desabilitado quando formulário é inválido ou durante carregamento
  - Exibe "Entrando..." enquanto processa o login
  - Mensagens de erro exibidas abaixo dos campos inválidos com ícone de erro

### 1.2 Cenário 2: Tentativa de Login com Campos Inválidos

**DADO** que o usuário está na página de login  
**QUANDO** o usuário tenta submeter o formulário com campos vazios ou inválidos  
**ENTÃO** o sistema marca todos os campos como tocados e exibe mensagens de erro específicas para cada validação

#### 1.2.1 Informações adicionais
- **Validações**:
  - Email vazio: "Informe o E-mail"
  - Email inválido: "E-mail inválido"
  - Senha vazia: "Informe a Senha"
  - Senha menor que 6 caracteres: "A Senha deve ter pelo menos 6 caracteres"
- **Comportamento**:
  - Formulário não é submetido se houver erros de validação
  - Botão permanece desabilitado até que todos os campos sejam válidos

### 1.3 Cenário 3: Navegação para Cadastro

**DADO** que o usuário está na página de login  
**QUANDO** o usuário clica no link "Cadastre-se"  
**ENTÃO** o sistema redireciona para a página de cadastro ("/usuarios/cadastro")

#### 1.3.1 Informações adicionais
- **Comportamento**: 
  - Link destacado na parte inferior do formulário
  - Texto: "Não tem uma conta? Cadastre-se"

## 2. Campos da Interface

| Campo | Descrição | Tipo | Obrigatório |
| :--- | :--- | :--- | :--- |
| Email | Email para login (Placeholder: "seuemail@exemplo.com") | Input (email) | Sim |
| Senha | Senha de acesso (Placeholder: "********") | Input (password) | Sim |
