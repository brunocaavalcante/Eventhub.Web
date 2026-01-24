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
