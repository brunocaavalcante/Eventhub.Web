# User History - Visualização de Comprovante de Contribuição

## 1. Informações Gerais

| Campo         | Valor                                                |
| :------------ | :--------------------------------------------------- |
| **Módulo**    | gestao-presentes                                     |
| **Prioridade**| Alta                                                 |
| **Estimativa**| M (Médio - 5-8 horas)                                |
| **Dependências** | Nenhuma                                           |

### 1.1 História do Usuário

**COMO** Organizador de evento
**QUERO** Visualizar o comprovante de pagamento de uma contribuição
**PARA** Verificar a autenticidade da contribuição antes de aprovar ou ter contexto visual ao gerenciar contribuições

### 1.2 Justificativa de Mercado

95% das plataformas de eventos com sistema de presentes (iCasei, Zankyou, Casare, Meu Casamento, Sympla) possuem sistema de visualização de comprovantes para validação de contribuições. A funcionalidade de filtro rápido por status melhora significativamente a produtividade do organizador ao gerenciar grandes volumes de contribuições.

---

## 2. Critérios de Aceite

### 2.1 Cenário 1: Visualizar Comprovante via Menu de Ações

**DADO** que o organizador está na página de detalhes de um presente com contribuições que possuem comprovante
**QUANDO** o organizador clica na ação "Ver Comprovante" no menu de uma contribuição
**ENTÃO** o sistema abre modal fullscreen exibindo a imagem do comprovante
**E** exibe as seguintes características:
- Modal ocupa toda a tela com fundo escuro semi-transparente
- Imagem do comprovante centralizada e redimensionada para caber na tela
- Botões de ação: Fechar (X), Zoom In (+), Zoom Out (-), Download
- Nome do convidado e valor da contribuição exibidos no cabeçalho do modal

#### 2.1.1 Informações Adicionais
- **Validações**: Verificar se a contribuição possui comprovante antes de mostrar ação
- **Comportamento**: Modal com `disableClose=false` (permite fechar clicando fora ou ESC)
- **Feedback**: Loading spinner enquanto carrega imagem
- **Modal**:
  - Largura: 90vw
  - Altura: 90vh
  - MaxWidth: 1200px
  - Fundo overlay: rgba(0, 0, 0, 0.85)
  - Transição de abertura: fade in de 0.3s

---

### 2.2 Cenário 2: Funcionalidade de Zoom na Imagem

**DADO** que o modal de comprovante está aberto
**QUANDO** o organizador clica nos botões de Zoom In (+) ou Zoom Out (-)
**ENTÃO** o sistema aumenta ou diminui o tamanho da imagem proporcionalmente
**E** aplica as seguintes regras:
- Zoom In: aumenta imagem em 25% a cada clique
- Zoom Out: diminui imagem em 25% a cada clique
- Zoom mínimo: 50% do tamanho original
- Zoom máximo: 300% do tamanho original
- Botões desabilitam quando atingem limites

#### 2.2.1 Informações Adicionais
- **Validações**:
  - Desabilitar botão + quando zoom = 300%
  - Desabilitar botão - quando zoom = 50%
- **Comportamento**:
  - Transição suave de 0.3s no redimensionamento
  - Zoom inicial sempre 100%
  - Incremento/decremento: 25% por clique
- **Feedback**:
  - Cursor pointer nos botões de zoom
  - Botões ficam com opacidade 0.5 quando desabilitados
  - Ícone + para zoom in, - para zoom out

---

### 2.3 Cenário 3: Download do Comprovante

**DADO** que o modal de comprovante está aberto
**QUANDO** o organizador clica no botão "Download"
**ENTÃO** o sistema inicia download da imagem do comprovante
**E** aplica as seguintes regras:
- Nome do arquivo: `comprovante-[nomeConvidado]-[data].png`
- Formato: PNG ou JPG conforme original
- Download usa técnica de blob para forçar download

#### 2.3.1 Informações Adicionais
- **Validações**: Verificar se imagem está carregada antes de permitir download
- **Comportamento**:
  - Não fecha o modal após download
  - Se nome do convidado contém caracteres especiais, substituir por hífen
  - Data no formato: YYYY-MM-DD
  - Extensão baseada no tipo MIME da imagem
- **Feedback**: Toast de sucesso "Comprovante baixado com sucesso"
- **Exemplo de nome**: `comprovante-joao-silva-2026-01-15.png`

---

### 2.4 Cenário 4: Fechar Modal de Comprovante

**DADO** que o modal de comprovante está aberto
**QUANDO** o organizador clica no X, pressiona ESC ou clica fora do modal
**ENTÃO** o sistema fecha o modal e retorna para a página de detalhes do presente
**E** aplica as seguintes regras:
- Estado de zoom é resetado para 100%
- Scroll da página principal é restaurado

#### 2.4.1 Informações Adicionais
- **Validações**: Nenhuma validação necessária
- **Comportamento**:
  - Transição de fade out de 0.2s
  - Limpar estado interno do componente
  - ESC key funciona apenas se modal não tiver disableClose
- **Feedback**: Nenhum feedback necessário

---

### 2.5 Cenário 5: Contribuição sem Comprovante

**DADO** que uma contribuição não possui comprovante anexado
**QUANDO** o organizador visualiza o menu de ações da contribuição
**ENTÃO** a ação "Ver Comprovante" não é exibida no menu
**E** o menu exibe apenas ações disponíveis (Editar, Cancelar, etc)

#### 2.5.1 Informações Adicionais
- **Validações**: Verificar se campo `comprovante` existe e não é null/undefined
- **Comportamento**:
  - Ocultar ação completamente, não apenas desabilitar
  - Verificação: `contribuicao.comprovante?.base64`
- **Feedback**: Nenhum feedback necessário

---

### 2.6 Cenário 6: Filtro Rápido por Status com Comprovante

**DADO** que o organizador está na página de detalhes do presente
**QUANDO** o organizador seleciona um filtro de status no dropdown (Todos, Pendente, Confirmado, Cancelado)
**ENTÃO** o sistema filtra a tabela de contribuições exibindo apenas os registros do status selecionado
**E** aplica as seguintes regras:
- Filtro "Todos": exibe todas as contribuições
- Filtro "Pendente": exibe apenas contribuições com status Pendente
- Filtro "Confirmado": exibe apenas contribuições confirmadas
- Filtro "Cancelado": exibe apenas contribuições canceladas
- Badge ao lado de cada opção mostra quantidade (ex: "Pendente (3)")

#### 2.6.1 Informações Adicionais
- **Validações**: Filtro deve ser case-insensitive e trabalhar com IDs de status
- **Comportamento**:
  - Filtro em tempo real sem necessidade de botão "Aplicar"
  - Dropdown posicionado acima da tabela de contribuições
  - Estilo: Material Design Select
  - Valor padrão: "Todos"
- **Feedback**:
  - Se nenhum resultado, mostrar "Nenhuma contribuição encontrada para este status"
  - Ícone de filtro ao lado do dropdown

---

### 2.7 Cenário 7: Erro ao Carregar Comprovante

**DADO** que o organizador clica para ver um comprovante
**QUANDO** ocorre erro ao carregar a imagem (base64 inválido, arquivo corrompido, etc)
**ENTÃO** o sistema exibe modal de erro
**E** exibe as seguintes informações:
- Título: "Erro ao Carregar Comprovante"
- Mensagem: "Não foi possível carregar o comprovante. O arquivo pode estar corrompido ou indisponível."
- Botão: "Fechar"

#### 2.7.1 Informações Adicionais
- **Validações**: Try-catch na renderização da imagem
- **Comportamento**:
  - Registrar erro no console para debug
  - Fechar spinner de loading
  - Não abrir modal de comprovante
- **Feedback**: Modal de erro via `ModalService`

---

## 3. Regras de Negócio

| ID     | Descrição                                                                                                          | Justificativa                                                                 | Exceções                                                              |
| :----- | :----------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- | :-------------------------------------------------------------------- |
| RN-001 | Apenas contribuições com comprovante anexado podem exibir a ação "Ver Comprovante"                                 | Evitar erro ao tentar visualizar comprovante inexistente                      | Nenhuma                                                               |
| RN-002 | O nome do arquivo de download deve seguir padrão: `comprovante-[nomeConvidado]-[dataContribuicao].[extensao]`     | Facilita organização de arquivos baixados pelo organizador                    | Se nome do convidado contém caracteres especiais, substituir por hífen|
| RN-003 | Zoom da imagem tem limites de 50% (mínimo) e 300% (máximo)                                                        | Evitar imagem muito pequena (ilegível) ou muito grande (problema de performance) | Nenhuma                                                            |
| RN-004 | Modal de comprovante não bloqueia fechamento (`disableClose=false`)                                                | Permitir que organizador feche rapidamente se precisar                        | Nenhuma                                                               |
| RN-005 | Filtro por status deve incluir contagem de contribuições em cada categoria                                         | Dar visibilidade rápida de quantas contribuições estão pendentes, confirmadas, etc | Nenhuma                                                          |

---

## 4. Campos da Interface

| Campo                    | Descrição                                           | Tipo     | Obrigatório | Validações                                         |
| :----------------------- | :-------------------------------------------------- | :------- | :---------: | :------------------------------------------------- |
| Modal Comprovante        | Container fullscreen para exibir imagem             | modal    | Sim         | Largura: 90vw, Altura: 90vh, MaxWidth: 1200px     |
| Imagem do Comprovante    | Imagem base64 ou URL do comprovante                 | image    | Sim         | Formato: PNG, JPG, JPEG                            |
| Botão Zoom In (+)        | Aumenta zoom da imagem                              | button   | Sim         | Desabilitar quando zoom = 300%                     |
| Botão Zoom Out (-)       | Diminui zoom da imagem                              | button   | Sim         | Desabilitar quando zoom = 50%                      |
| Botão Download           | Faz download do comprovante                         | button   | Sim         | Ícone: download                                    |
| Botão Fechar (X)         | Fecha o modal                                       | button   | Sim         | Posição: canto superior direito                    |
| Label Nome Convidado     | Nome do participante que fez a contribuição         | text     | Sim         | Exibir no cabeçalho do modal                       |
| Label Valor Contribuição | Valor da contribuição formatado                     | text     | Sim         | Formato: R$ 0.000,00                               |
| Dropdown Filtro Status   | Filtro de status das contribuições                  | select   | Não         | Opções: Todos, Pendente (X), Confirmado (Y), Cancelado (Z) |
| Badge Contador           | Quantidade de contribuições por status              | badge    | Não         | Cor: primária, Formato: (número)                   |

---

## 5. Protótipo/Referência Visual

### 5.1 Descrição do Layout

Modal fullscreen similar ao comportamento de galeria de imagens. Cabeçalho com informações do convidado, corpo centralizado com a imagem, rodapé com controles de zoom e download. Filtro de status na página de detalhes do presente, acima da tabela de contribuições.

### 5.2 Módulo Similar
- **Base**: `detalhar-presente` (usar como base para adicionar filtro)

### 5.3 Componentes a Reutilizar
- `ModalService` para criar modais
- `Base64ImageUtil` para converter imagens
- `CurrencyBrPipe` para formatar valores
- Estrutura de tabela de contribuições existente

### 5.4 Estrutura do Modal

```
┌─────────────────────────────────────────────────────────────┐
│ [X]                  Comprovante de Contribuição            │
│ João Silva - R$ 150,00                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                                                             │
│                     [Imagem Comprovante]                    │
│                                                             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│          [+] Zoom In    [-] Zoom Out    [↓] Download       │
└─────────────────────────────────────────────────────────────┘
```

### 5.5 Filtro de Status

```
Detalhes do Presente
──────────────────────────────────────────────────────────────
[Filtrar por Status: Todos ▼]  [🔍 Filtrar por nome...]

┌─────────────────────────────────────────────────────────────┐
│ Convidado        │ Valor    │ Data       │ Status     │ Ações│
├─────────────────────────────────────────────────────────────┤
│ João Silva       │ R$ 150,00│ 15/01/2026 │ Pendente   │  ⋮  │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Endpoints da API

### 6.1 GET - Buscar Detalhes do Presente

**Rota**: `/presentes/{id}/detalhes`
**Método**: GET
**Autenticação**: Sim (Bearer Token)

#### Request
```
GET /presentes/1/detalhes
Authorization: Bearer {token}
```

#### Response (200 OK)
```json
{
  "executouComSucesso": true,
  "data": {
    "id": 1,
    "nome": "Jogo de Panelas",
    "descricao": "Jogo de panelas antiaderente",
    "valorTotal": 500.00,
    "valorArrecadado": 150.00,
    "contribuicoes": [
      {
        "id": 1,
        "valor": 150.00,
        "dataCadastro": "2026-01-15",
        "status": {
          "id": 1,
          "descricao": "Pendente"
        },
        "participante": {
          "id": 5,
          "nome": "João Silva",
          "email": "joao@email.com",
          "fotoPerfil": {
            "base64": "data:image/png;base64,..."
          }
        },
        "comprovante": {
          "base64": "data:image/png;base64,iVBORw0KGgoAAAANS...",
          "nomeArquivo": "comprovante.png",
          "tipoImagem": "image/png"
        }
      }
    ]
  }
}
```

---

## 7. Tarefas Técnicas

### 7.1 Models
- ✅ Nenhum novo model necessário (usar `Imagem` existente)

### 7.2 Services
- ✅ Nenhum novo service necessário (usar `PresenteService` existente)

### 7.3 Componentes

#### 7.3.1 Criar Novo Componente
- **Nome**: `visualizar-comprovante-modal.component.ts`
- **Localização**: `src/app/views/pages/gestao-presentes/visualizar-comprovante-modal/`
- **Responsabilidades**:
  - Exibir imagem do comprovante em modal fullscreen
  - Implementar zoom in/out (50% - 300%)
  - Implementar download do comprovante
  - Exibir informações do convidado e valor
- **Estrutura**:
  ```
  visualizar-comprovante-modal/
    ├── visualizar-comprovante-modal.component.ts
    ├── visualizar-comprovante-modal.component.html
    ├── visualizar-comprovante-modal.component.scss
    └── visualizar-comprovante-modal.component.spec.ts
  ```

#### 7.3.2 Atualizar Componente Existente
- **Nome**: `detalhar-presente.component.ts`
- **Alterações**:
  - Adicionar dropdown de filtro por status
  - Implementar lógica de filtragem por status
  - Adicionar ação "Ver Comprovante" no menu de ações
  - Implementar abertura do modal de comprovante
  - Adicionar badges com contagem de status

### 7.4 Rotas
- ✅ Nenhuma nova rota necessária (modal não tem rota própria)

### 7.5 Pipes/Utils
- ✅ Reutilizar `Base64ImageUtil` existente
- ✅ Reutilizar `CurrencyBrPipe` existente
- ✅ Reutilizar `DateBrPipe` existente

---

## 8. Cenários de Teste Prioritários

### 8.1 Testes Unitários

| # | Cenário de Teste                                                                 | Prioridade |
|:-:|:---------------------------------------------------------------------------------|:----------:|
| 1 | Deve abrir modal ao clicar em "Ver Comprovante"                                  | Alta       |
| 2 | Deve aumentar zoom em 25% ao clicar em Zoom In                                   | Alta       |
| 3 | Deve diminuir zoom em 25% ao clicar em Zoom Out                                  | Alta       |
| 4 | Deve desabilitar Zoom In quando zoom atingir 300%                                | Alta       |
| 5 | Deve desabilitar Zoom Out quando zoom atingir 50%                                | Alta       |
| 6 | Deve fazer download do comprovante com nome correto ao clicar em Download        | Alta       |
| 7 | Deve fechar modal ao clicar no X                                                 | Alta       |
| 8 | Deve fechar modal ao pressionar ESC                                              | Média      |
| 9 | Deve fechar modal ao clicar fora (backdrop)                                      | Média      |
| 10| Deve resetar zoom para 100% ao fechar modal                                      | Média      |
| 11| Não deve exibir ação "Ver Comprovante" quando comprovante não existe             | Alta       |
| 12| Deve filtrar contribuições por status "Pendente"                                 | Alta       |
| 13| Deve filtrar contribuições por status "Confirmado"                               | Alta       |
| 14| Deve filtrar contribuições por status "Cancelado"                                | Alta       |
| 15| Deve exibir todas as contribuições ao selecionar "Todos"                         | Alta       |
| 16| Deve exibir contagem de contribuições em cada badge de status                    | Média      |
| 17| Deve exibir modal de erro quando base64 da imagem for inválido                   | Alta       |
| 18| Deve exibir toast de sucesso após download                                       | Baixa      |
| 19| Deve substituir caracteres especiais no nome do arquivo por hífen                | Média      |
| 20| Deve exibir loading spinner enquanto carrega imagem                              | Baixa      |

### 8.2 Testes de Integração

| # | Cenário de Teste                                                                 | Prioridade |
|:-:|:---------------------------------------------------------------------------------|:----------:|
| 1 | Deve carregar comprovante real da API e exibir no modal                          | Alta       |
| 2 | Deve aplicar filtro de status e atualizar tabela com dados da API                | Alta       |
| 3 | Deve tratar erro 404 ao tentar carregar comprovante inexistente                  | Média      |

### 8.3 Testes E2E (Manuais)

| # | Cenário de Teste                                                                 | Prioridade |
|:-:|:---------------------------------------------------------------------------------|:----------:|
| 1 | Fluxo completo: abrir modal, dar zoom, fazer download e fechar                   | Alta       |
| 2 | Testar responsividade do modal em diferentes resoluções (mobile, tablet, desktop)| Média      |
| 3 | Testar com imagens de diferentes tamanhos e formatos (PNG, JPG)                  | Média      |
| 4 | Testar navegação por teclado (TAB, ESC)                                          | Baixa      |

---

## 9. Definição de Pronto (DoD)

- [ ] Código implementado seguindo padrões do projeto
- [ ] Componente `visualizar-comprovante-modal` criado e funcional
- [ ] Filtro de status implementado em `detalhar-presente`
- [ ] Ação "Ver Comprovante" adicionada ao menu de ações
- [ ] Zoom in/out funcionando com limites de 50%-300%
- [ ] Download do comprovante com nome correto
- [ ] Modal fecha corretamente (X, ESC, backdrop)
- [ ] Validação de comprovante existente implementada
- [ ] Filtro por status funcional com badges de contagem
- [ ] Tratamento de erros implementado (imagem inválida, etc)
- [ ] Testes unitários implementados e passando (mínimo 80% de cobertura)
- [ ] Testes de integração implementados e passando
- [ ] Responsivo em mobile, tablet e desktop
- [ ] Documentação inline (JSDoc) nos métodos principais
- [ ] Code review aprovado por pelo menos 1 desenvolvedor
- [ ] QA testou e aprovou em ambiente de homologação
- [ ] User story marcada como "Done" no board do projeto

---

## 10. Notas Adicionais

### 10.1 Considerações de Performance
- Lazy loading do modal para não impactar bundle inicial
- Otimização de imagens grandes (considerar compressão se > 5MB)
- Debounce no filtro de status (se houver muitas contribuições)

### 10.2 Acessibilidade
- Adicionar atributos ARIA para leitores de tela
- Suporte completo a navegação por teclado
- Alto contraste nos botões de ação
- Focus trap no modal (não permitir TAB para fora do modal enquanto aberto)

### 10.3 Melhorias Futuras
- Pinch-to-zoom em dispositivos touch
- Rotação da imagem (90°, 180°, 270°)
- Comparação lado a lado de múltiplos comprovantes
- Histórico de visualizações de comprovantes
- Anotações sobre o comprovante (marcação de inconsistências)
