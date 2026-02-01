# User History - Editar Contribuição do Presente

## 1. Critério de Aceite

### 1.1 Cenário 1: Carregar Dados da Contribuição

DADO que o usuário acessa a rota `/presentes/editar-contribuicao/:idEvento/:idPresente/:idContribuicao`  
QUANDO a página é carregada  
ENTÃO o sistema:
1. Exibe spinner de carregamento
2. Busca os detalhes do presente via API (`obterDetalhesPorId`)
3. Localiza a contribuição específica pelo `idContribuicao`
4. Preenche o formulário com os dados:
   - Valor da contribuição formatado (R$)
   - Data da contribuição
   - Status atual da contribuição
5. Exibe informações do convidado e presente no cabeçalho
6. Remove o spinner

#### 1.1.1 Informações adicionais
- **Validações**: Se a contribuição não for encontrada, redireciona para a página de detalhes do presente
- **Spinner Global**: Exibido via `SpinnerService`
- **Dados Exibidos**: 
  - Nome do convidado (ícone person)
  - Nome do presente (ícone card_giftcard)
- **Status Disponíveis**: Carregados via `obterStatusContribuicaoPresente()`

### 1.2 Cenário 2: Validar Campo Valor

DADO que o usuário está editando o valor da contribuição  
QUANDO o campo valor está vazio ou com valor zero  
ENTÃO o sistema exibe mensagens de erro:
- "Campo obrigatório" (se vazio)
- "Valor deve ser maior que zero" (se ≤ 0)
E desabilita o botão "SALVAR"

#### 1.2.1 Informações adicionais
- **Tipo**: Input com máscara monetária (`mask="separator.2"`)
- **Formato**: R$ 0,00 (separador de milhar `.`, decimal `,`)
- **Validações**: 
  - `Validators.required`
  - `Validators.min(0.01)`
- **Placeholder**: "R$ 0,00"
- **Prefixo**: "R$ "

### 1.3 Cenário 3: Validar Campo Data da Contribuição

DADO que o usuário está editando a data da contribuição  
QUANDO o campo data está vazio  
ENTÃO o sistema exibe mensagem de erro "Campo obrigatório" e desabilita o botão "SALVAR"

#### 1.3.1 Informações adicionais
- **Tipo**: Date Picker do Material Angular
- **Validação**: `Validators.required`
- **Formato**: Data selecionada via calendário
- **Placeholder**: "Selecione a data"

### 1.4 Cenário 4: Selecionar Status da Contribuição

DADO que o usuário visualiza os status disponíveis  
QUANDO o usuário clica em um botão de status  
ENTÃO o sistema:
1. Destaca o botão selecionado (classe `active`)
2. Atualiza o valor do campo `status` no formulário
3. Se o status selecionado for "Cancelado", abre automaticamente o modal de cancelamento

#### 1.4.1 Informações adicionais
- **Comportamento**: 
  - Status exibidos em botões horizontais
  - Apenas um status pode estar ativo por vez
  - Classe `active` aplicada ao botão selecionado
- **Status Especial "Cancelado"**: 
  - Abre modal `CancelarContribuicaoPresenteComponent`
  - Se o cancelamento não for confirmado, reverte para o status anterior
  - Se confirmado, executa o cancelamento via API
- **Validação**: `Validators.required`

### 1.5 Cenário 5: Abrir Modal de Cancelamento ao Selecionar "Cancelado"

DADO que o usuário seleciona o status "Cancelado"  
QUANDO o botão é clicado  
ENTÃO o sistema:
1. Abre modal de cancelamento (`CancelarContribuicaoPresenteComponent`)
2. Passa os dados da contribuição para o modal
3. Aguarda resposta do usuário
4. Se confirmado: executa cancelamento via API e exibe modal de sucesso
5. Se não confirmado: reverte o status para o valor anterior

#### 1.5.1 Informações adicionais
- **Modal**: Largura 600px, maxWidth 90vw, `disableClose: true`
- **Spinner**: Exibido durante processamento do cancelamento
- **Modal de Sucesso**: "Contribuição Cancelada" com mensagem "A contribuição foi cancelada com sucesso."
- **Reversão**: Se usuário cancelar a ação, o status volta ao valor original

### 1.6 Cenário 6: Caixa de Informação sobre Status

DADO que o usuário visualiza a página de edição  
QUANDO a página é renderizada  
ENTÃO o sistema exibe uma caixa informativa (info-box) com:
- Ícone de informação
- Texto explicativo sobre os efeitos dos status:
  - "Alterar o status para Validado enviará automaticamente um agradecimento ao convidado."
  - "O status Cancelado libera o valor da meta novamente."

#### 1.6.1 Informações adicionais
- **Estilo**: Caixa com ícone info, texto destacado em negrito para palavras-chave
- **Propósito**: Informar o usuário sobre as consequências das ações

### 1.7 Cenário 7: Confirmar Atualização

DADO que o formulário é válido e o usuário clica em "SALVAR"  
QUANDO o botão é pressionado  
ENTÃO o sistema:
1. Abre modal de confirmação "Confirmar Atualização"
2. Exibe mensagem "Tem certeza que deseja atualizar a contribuição?"
3. Se confirmado:
   - Exibe spinner de carregamento
   - Converte valor para formato numérico (substitui vírgula por ponto)
   - Envia requisição para API (`atualizarContribuicao`)
   - Exibe modal de sucesso "Contribuição Atualizada!"
   - Redireciona para a página de detalhes do presente
4. Se não confirmado: fecha modal e permanece na tela de edição

#### 1.7.1 Informações adicionais
- **DTO Enviado**: `UpdateContribuicaoPresenteDto`
  - `id`: ID da contribuição
  - `valor`: Valor numérico convertido
  - `status`: Objeto de status selecionado
- **Conversão de Valor**: `toString().replace(',', '.')` antes de `parseFloat()`
- **Modal de Confirmação**: Botões "Sim" e "Não"
- **Modal de Sucesso**: Título "Contribuição Atualizada!", mensagem "As alterações foram salvas com sucesso."
- **Redirecionamento**: `/presentes/detalhes/:idEvento/:idPresente`

### 1.8 Cenário 8: Cancelar Edição (Botão Cancelar)

DADO que o usuário está editando a contribuição  
QUANDO o usuário clica no botão "CANCELAR"  
ENTÃO o sistema:
1. Verifica se o formulário está modificado (`form.dirty`)
2. Se modificado: abre modal de confirmação "Cancelar Edição" com mensagem "Você tem alterações não salvas. Deseja realmente sair?"
3. Se confirmado ou formulário não modificado: redireciona para a página de detalhes do presente
4. Se não confirmado: permanece na tela de edição

#### 1.8.1 Informações adicionais
- **Proteção de Dados**: Verifica `form.dirty` antes de sair
- **Modal de Confirmação**: 
  - Título: "Cancelar Edição"
  - Botões: "Sim, sair" e "Continuar editando"
- **Redirecionamento**: `/presentes/detalhes/:idEvento/:idPresente`

### 1.9 Cenário 9: Botão Voltar para Detalhes

DADO que o usuário está na página de edição  
QUANDO o usuário clica no botão "Voltar para Detalhes do Presente" (ícone arrow_back)  
ENTÃO o sistema redireciona para a página de detalhes do presente

#### 1.9.1 Informações adicionais
- **Localização**: Topo da página (header)
- **Ícone**: arrow_back (Material Icons)
- **Navegação**: `/presentes/detalhes/:idEvento/:idPresente`

### 1.10 Cenário 10: Botão Salvar Desabilitado

DADO que o formulário possui erros de validação  
QUANDO o usuário visualiza o botão "SALVAR"  
ENTÃO o botão está desabilitado (`[disabled]="form.invalid"`)

#### 1.10.1 Informações adicionais
- **Comportamento**: Botão cinza quando desabilitado
- **Validações**:
  - Valor obrigatório e > 0
  - Data obrigatória
  - Status obrigatório
- **Ícone**: save (Material Icons)

---

## 7. Campos da Interface

| Campo | Descrição | Tipo | Obrigatório | Validações |
| :--- | :--- | :--- | :---: | :--- |
| Convidado | Nome do participante da contribuição | Label (exibição) | - | - |
| Presente | Nome do presente | Label (exibição) | - | - |
| Valor doado (R$) | Valor monetário da contribuição | Input (máscara monetária) | Sim | Required, Min: 0.01 |
| Data da contribuição | Data em que a contribuição foi feita | Date Picker | Sim | Required |
| Status da Contribuição | Status atual da contribuição (botões) | Button Group | Sim | Required |
