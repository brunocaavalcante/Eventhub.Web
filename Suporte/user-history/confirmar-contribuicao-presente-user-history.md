# User History - Confirmar Contribuição de Presente

## 1. Informações Gerais

| Campo         | Valor                                                |
| :------------ | :--------------------------------------------------- |
| **ID**        | US-012                                               |
| **Título**    | Confirmar Contribuição de Presente                   |
| **Módulo**    | gestao-presentes                                     |
| **Prioridade**| Alta                                                 |
| **Estimativa**| P (Pequeno - 2-4 horas)                              |
| **Dependências** | Detalhar Presente (US-011)                        |

### 1.1 História do Usuário

**COMO** organizador de evento  
**QUERO** confirmar contribuições de presentes realizadas pelos convidados  
**PARA** validar o pagamento, autorizar que o valor seja contabilizado no total arrecadado e atualizar o status da contribuição de "Pendente" para "Confirmado"

### 1.2 Justificativa de Mercado

Praticamente todas as plataformas de gestão de presentes para eventos (iCasei, Zankyou, Casare, Meu Casamento, Festeiê, Noivei) possuem funcionalidade de confirmação manual de contribuições. Esta funcionalidade é crítica para:
- **Controle Financeiro**: Garantir que apenas contribuições validadas sejam contabilizadas
- **Prevenção de Fraudes**: Permitir ao organizador verificar comprovantes antes de confirmar
- **Gestão de Status**: Manter rastreabilidade do status das contribuições
- **Experiência do Usuário**: Dar transparência aos convidados sobre suas contribuições

---

## 2. Critérios de Aceite

### 2.1 Cenário 1: Exibir Ação "Confirmar Contribuição" na Tabela

**DADO** que o organizador está na página de detalhes de um presente  
**QUANDO** o sistema exibe a tabela de contribuições  
**ENTÃO** o menu de ações deve mostrar opção "Confirmar contribuição" apenas para contribuições que atendam:
- Status NÃO é "Confirmado" (id ≠ 2)
- Status NÃO é "Cancelado" (id ≠ 3)

**E** contribuições com status "Confirmado" ou "Cancelado" NÃO devem exibir esta ação

#### 2.1.1 Informações Adicionais
- **Validações:**
  - Verificar `contribuicao.status.id !== EnumStatusContribuicao.Confirmado`
  - Verificar `contribuicao.status.id !== EnumStatusContribuicao.Cancelado`
- **Comportamento:**
  - Ação exibida no menu de ações da linha da tabela
  - Ícone: `check_circle`
  - Label: "Confirmar contribuição"
  - Cor: Verde (primária)
- **Status Elegíveis:**
  - Pendente (id: 1)
  - Em Análise (id: 4)
  - Estornado (id: 5)

---

### 2.2 Cenário 2: Abrir Modal de Confirmação

**DADO** que o organizador clicou em "Confirmar contribuição"  
**QUANDO** o sistema processa a ação  
**ENTÃO** deve exibir modal de confirmação contendo:
- **Título**: "Confirmar Contribuição"
- **Mensagem**: "Tem certeza que deseja confirmar a contribuição de [Nome do Convidado] no valor de R$ [Valor]?"
- **Informações adicionais exibidas**:
  - Nome do convidado com avatar (se disponível)
  - Valor da contribuição formatado em reais
  - Data da contribuição (se disponível)
  - Status atual da contribuição
- **Botões**: 
  - "Sim" (primário, verde)
  - "Não" (secundário, cinza)

**E** ao clicar em "Não":
- Fechar modal sem realizar ação
- Manter status atual da contribuição

#### 2.2.1 Informações Adicionais
- **Validações:** Nenhuma validação adicional necessária no frontend
- **Comportamento:**
  - Modal não pode ser fechado clicando fora (`disableClose: false`)
  - Pode ser fechado com tecla ESC
  - Width: 500px, MaxWidth: 90vw
- **Formatação de Valores:**
  - Valor em formato brasileiro (R$ 1.234,56)
  - Data em formato DD/MM/YYYY
- **Acessibilidade:**
  - Foco automático no botão "Não" (ação segura)
  - Leitura de tela: anunciar título e mensagem

---

### 2.3 Cenário 3: Confirmar Contribuição com Sucesso

**DADO** que o organizador clicou em "Sim" no modal de confirmação  
**QUANDO** o sistema processa a confirmação  
**ENTÃO** o sistema deve:
1. Exibir spinner de carregamento global
2. Enviar requisição POST para API `/contribuicaopresente/confirmar`
3. Com o payload:
   ```json
   {
     "idContribuicao": 123,
     "idPresente": 456
   }
   ```
4. Aguardar resposta da API
5. Se `executouComSucesso === true`:
   - Ocultar spinner
   - Fechar modal de confirmação
   - Exibir modal de sucesso com:
     - **Título**: "Contribuição Confirmada"
     - **Mensagem**: "A contribuição foi confirmada com sucesso."
     - Ícone de sucesso (check verde)
   - Recarregar detalhes do presente (atualizar lista de contribuições)
   - Atualizar "Total Arrecadado" no card do presente
   - Atualizar "Valor Restante" no card do presente

**E** a contribuição deve:
- Ter status alterado para "Confirmado" (id: 2)
- Aparecer com badge verde de "Confirmado" na tabela
- Não mais exibir a ação "Confirmar contribuição"
- Manter data de cadastro original
- Registrar data/hora da confirmação (no backend)

#### 2.3.1 Informações Adicionais
- **Spinner Global**: Utilizar `SpinnerService.show()` e `SpinnerService.hide()`
- **Atualização de Dados**: 
  - Chamar `carregarDetalhes()` após confirmação
  - Recalcular `totalArrecadado` (soma de contribuições confirmadas)
  - Recalcular `valorRestante` (valor presente - total arrecadado)
- **Modal de Sucesso**:
  - Largura: 400px, MaxWidth: 90vw
  - Botão único: "OK"
  - Auto-close após 3 segundos (opcional)
- **Feedback Visual:**
  - Toast verde (opcional, além do modal)
  - Duração: 5 segundos
  - Posição: topo da tela

---

### 2.4 Cenário 4: Erro ao Confirmar Contribuição

**DADO** que o organizador clicou em "Sim" para confirmar  
**QUANDO** ocorre erro na requisição à API  
**ENTÃO** o sistema deve:
1. Ocultar spinner de carregamento
2. Fechar modal de confirmação
3. Exibir modal de erro com:
   - **Título**: "Erro ao Confirmar"
   - **Mensagem**: Mensagem de erro da API (se disponível) ou mensagem padrão
   - Ícone de erro (X vermelho)
   - Botão: "Fechar"
4. Registrar erro no console para debug
5. NÃO alterar status da contribuição
6. NÃO recarregar detalhes do presente

**E** erros possíveis incluem:
- Contribuição não encontrada (404)
- Contribuição já confirmada (409)
- Presente não encontrado (404)
- Erro de validação (400)
- Erro de servidor (500)
- Erro de conexão/timeout

#### 2.4.1 Informações Adicionais
- **Tratamento de Erros:**
  - Capturar erro no bloco `error` do subscribe
  - Log: `console.error('Erro ao confirmar contribuição:', err)`
  - Exibir mensagem amigável ao usuário
- **Mensagens de Erro Específicas:**
  - 404: "Contribuição ou presente não encontrado"
  - 409: "Esta contribuição já foi confirmada anteriormente"
  - 400: Exibir mensagem de validação da API
  - 500: "Erro no servidor. Tente novamente mais tarde"
  - Timeout: "Tempo de conexão excedido. Verifique sua internet"
- **Modal de Erro:**
  - Largura: 400px, MaxWidth: 90vw
  - Cor: tema de erro (vermelho)
  - Botão: "Fechar" (primário)

---

### 2.5 Cenário 5: Validação de Contribuição Já Confirmada (Race Condition)

**DADO** que dois organizadores tentam confirmar a mesma contribuição simultaneamente  
**QUANDO** o segundo organizador tenta confirmar uma contribuição já confirmada pelo primeiro  
**ENTÃO** o backend deve:
1. Validar se contribuição ainda está pendente
2. Retornar erro 409 (Conflict) se já confirmada
3. Mensagem: "Esta contribuição já foi confirmada por outro organizador"

**E** o frontend deve:
1. Exibir mensagem de erro apropriada
2. Recarregar página de detalhes automaticamente
3. Mostrar status atualizado da contribuição

#### 2.5.1 Informações Adicionais
- **Validação no Backend:**
  - Verificar status atual antes de confirmar
  - Usar transação de banco para garantir atomicidade
  - Lock pessimista ou otimista no registro
- **Comportamento Frontend:**
  - Após erro 409, aguardar 1 segundo e recarregar
  - Mensagem clara sobre o que aconteceu
- **Log de Auditoria:**
  - Registrar quem confirmou e quando
  - Registrar tentativas de confirmação duplicada

---

### 2.6 Cenário 6: Atualização de Totais do Presente

**DADO** que uma contribuição foi confirmada com sucesso  
**QUANDO** o sistema recarrega os detalhes do presente  
**ENTÃO** os seguintes valores devem ser recalculados:
- **Total Arrecadado**: Soma de todas contribuições com status "Confirmado" (id: 2)
- **Valor Restante**: Valor do presente - Total Arrecadado
- **Progresso (%)**: (Total Arrecadado / Valor do Presente) × 100

**E** se `Total Arrecadado >= Valor do Presente`:
- Marcar presente como "Totalmente Arrecadado"
- Exibir badge de "100% Arrecadado"
- Atualizar status do presente se aplicável

**E** os cards devem exibir:
- Total Arrecadado com ícone `check_circle` (verde)
- Valor Restante com ícone `favorite` (vermelho/laranja)
- Barra de progresso visual (se aplicável)

#### 2.6.1 Informações Adicionais
- **Cálculo de Total Arrecadado:**
  ```typescript
  const totalArrecadado = contribuicoes
    .filter(c => c.status.id === EnumStatusContribuicao.Confirmado)
    .reduce((soma, c) => soma + c.valor, 0);
  ```
- **Cálculo de Valor Restante:**
  ```typescript
  const valorRestante = Math.max(0, presente.valor - totalArrecadado);
  ```
- **Formatação:**
  - Usar pipe `currencyBr` para formatar valores
  - Exibir valores sempre com 2 casas decimais
- **Comportamento Visual:**
  - Animação suave na atualização dos valores (opcional)
  - Highlight temporário nos valores alterados (opcional)

---

### 2.7 Cenário 7: Confirmar Múltiplas Contribuições

**DADO** que o organizador precisa confirmar várias contribuições  
**QUANDO** o organizador confirma uma contribuição  
**ENTÃO** após o modal de sucesso:
1. Sistema retorna para a página de detalhes
2. Lista de contribuições é atualizada
3. Organizador pode imediatamente confirmar outra contribuição
4. Não há necessidade de recarregar página manualmente

**E** o fluxo deve ser otimizado:
- Sem redirecionamentos desnecessários
- Atualização automática da tabela
- Mantém posição de scroll (opcional)
- Mantém filtros aplicados (se houver)

#### 2.7.1 Informações Adicionais
- **UX Otimizada:**
  - Não fechar/reabrir componentes desnecessariamente
  - Manter contexto do usuário (filtros, busca)
  - Feedback visual claro sobre o que mudou
- **Performance:**
  - Atualizar apenas dados necessários
  - Evitar recarregar imagens do presente
  - Cache de dados quando possível

---

## 3. Regras de Negócio

| ID     | Descrição                                                                                                          | Justificativa                                                                 | Exceções                                                              |
| :----- | :----------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- | :-------------------------------------------------------------------- |
| RN-001 | Apenas contribuições com status diferente de "Confirmado" e "Cancelado" podem ser confirmadas                     | Evitar confirmação duplicada ou de contribuições já canceladas                | Nenhuma                                                               |
| RN-002 | Confirmação de contribuição requer validação explícita do organizador via modal de confirmação                     | Evitar confirmações acidentais que impactam financeiramente o evento          | Nenhuma                                                               |
| RN-003 | Total Arrecadado deve considerar apenas contribuições com status "Confirmado"                                      | Garantir precisão financeira - apenas valores validados entram na conta       | Nenhuma                                                               |
| RN-004 | Sistema deve recarregar automaticamente detalhes do presente após confirmação bem-sucedida                         | Garantir que dados exibidos estejam sempre atualizados                        | Nenhuma                                                               |
| RN-005 | Backend deve impedir confirmação de contribuição já confirmada (race condition)                                    | Garantir integridade dos dados em ambiente multi-usuário                      | Nenhuma                                                               |
| RN-006 | Confirmação deve registrar data/hora e usuário que realizou a ação (auditoria)                                     | Rastreabilidade e auditoria de operações financeiras                          | Implementação no backend                                              |
| RN-007 | Valor Restante nunca pode ser negativo (mínimo = 0)                                                                | Mesmo se total arrecadado exceder valor do presente, exibir 0 como restante   | Permitir arrecadação maior que valor do presente                      |
| RN-008 | Após confirmação, contribuição deve ser incluída imediatamente no cálculo de totais                                | Feedback instantâneo ao organizador sobre impacto da confirmação              | Nenhuma                                                               |

---

## 4. Campos da Interface

### 4.1 Modal de Confirmação

| Campo                    | Descrição                                           | Tipo     | Obrigatório | Validações                                         |
| :----------------------- | :-------------------------------------------------- | :------- | :---------: | :------------------------------------------------- |
| Título                   | "Confirmar Contribuição"                            | text     | Sim         | Fixo                                               |
| Mensagem                 | Texto dinâmico com nome e valor                     | text     | Sim         | Incluir nome do convidado e valor formatado        |
| Nome do Convidado        | Nome exibido na mensagem                            | text     | Sim         | Obtido de `contribuicao.participante.nome`         |
| Valor da Contribuição    | Valor formatado em R$                               | currency | Sim         | Formato: R$ 1.234,56                               |
| Botão "Sim"              | Confirma a ação                                     | button   | Sim         | Cor primária (verde), action: confirmar            |
| Botão "Não"              | Cancela a ação                                      | button   | Sim         | Cor secundária (cinza), action: fechar modal       |

### 4.2 Modal de Sucesso

| Campo                    | Descrição                                           | Tipo     | Obrigatório | Validações                                         |
| :----------------------- | :-------------------------------------------------- | :------- | :---------: | :------------------------------------------------- |
| Título                   | "Contribuição Confirmada"                           | text     | Sim         | Fixo                                               |
| Mensagem                 | "A contribuição foi confirmada com sucesso."        | text     | Sim         | Fixo                                               |
| Ícone                    | Check verde                                         | icon     | Sim         | Material Icon: `check_circle`                      |
| Botão "OK"               | Fecha modal e continua                              | button   | Sim         | Cor primária                                       |

### 4.3 Ação na Tabela

| Campo                    | Descrição                                           | Tipo     | Obrigatório | Validações                                         |
| :----------------------- | :-------------------------------------------------- | :------- | :---------: | :------------------------------------------------- |
| Label                    | "Confirmar contribuição"                            | text     | Sim         | Fixo                                               |
| Ícone                    | `check_circle`                                      | icon     | Sim         | Material Icon                                      |
| Visibilidade             | Condicional baseada em status                       | boolean  | Sim         | Status !== Confirmado && Status !== Cancelado      |
| Handler                  | Função `confirmarContribuicao()`                    | function | Sim         | Recebe contribuição como parâmetro                 |

---

## 5. Validações e Regras de Interface

### 5.1 Validações de Exibição

| Validação                          | Descrição                                                                 | Mensagem de Erro/Comportamento                    |
| :--------------------------------- | :------------------------------------------------------------------------ | :------------------------------------------------ |
| Status da Contribuição             | Verificar se status permite confirmação                                   | Não exibir ação se status = Confirmado/Cancelado  |
| Contribuição Existe                | Verificar se contribuição existe no array                                 | Não exibir ação se não encontrada                 |
| Permissões do Usuário              | Verificar se usuário é organizador do evento                              | Apenas organizadores veem a ação                  |

### 5.2 Validações de Backend

| Validação                          | Descrição                                                                 | Código HTTP | Mensagem                                          |
| :--------------------------------- | :------------------------------------------------------------------------ | :---------: | :------------------------------------------------ |
| Contribuição Existe                | Validar se ID da contribuição existe no banco                             | 404         | "Contribuição não encontrada"                     |
| Presente Existe                    | Validar se ID do presente existe no banco                                 | 404         | "Presente não encontrado"                         |
| Status Atual                       | Validar se contribuição não está confirmada/cancelada                     | 409         | "Contribuição já foi confirmada/cancelada"        |
| Usuário Autorizado                 | Validar se usuário é organizador do evento                                | 403         | "Usuário não autorizado"                          |
| Integridade de Dados               | Validar relacionamento contribuição-presente                              | 400         | "Contribuição não pertence a este presente"       |

---

## 6. Endpoints de API

### 6.1 Confirmar Contribuição

**Endpoint:** `POST /api/contribuicaopresente/confirmar`

**Request Body:**
```json
{
  "idContribuicao": 123,
  "idPresente": 456
}
```

**Response Success (200):**
```json
{
  "executouComSucesso": true,
  "mensagem": "Contribuição confirmada com sucesso",
  "dados": null
}
```

**Response Error (409):**
```json
{
  "executouComSucesso": false,
  "mensagem": "Esta contribuição já foi confirmada",
  "dados": null
}
```

**Response Error (404):**
```json
{
  "executouComSucesso": false,
  "mensagem": "Contribuição ou presente não encontrado",
  "dados": null
}
```

---

## 7. Fluxo de Telas

### 7.1 Fluxo Principal - Confirmação com Sucesso

```
1. Página de Detalhes do Presente
   └─> Lista de contribuições exibida
   └─> Organizador visualiza contribuição com status "Pendente"
   └─> Organizador clica em "..." (menu de ações)
   
2. Menu de Ações Aberto
   └─> "Confirmar contribuição" está visível (ícone check_circle)
   └─> Organizador clica em "Confirmar contribuição"
   
3. Modal de Confirmação
   └─> Exibe: "Tem certeza que deseja confirmar a contribuição de [Nome] no valor de R$ [Valor]?"
   └─> Organizador clica em "Sim"
   
4. Processamento
   └─> Spinner global exibido
   └─> API chamada: POST /contribuicaopresente/confirmar
   └─> Aguarda resposta
   
5. Modal de Sucesso
   └─> Exibe: "Contribuição Confirmada" + "A contribuição foi confirmada com sucesso."
   └─> Organizador clica em "OK"
   
6. Página de Detalhes Atualizada
   └─> Lista de contribuições recarregada
   └─> Status da contribuição agora é "Confirmado" (badge verde)
   └─> Total Arrecadado atualizado
   └─> Valor Restante atualizado
   └─> Ação "Confirmar contribuição" não é mais exibida para esta contribuição
```

### 7.2 Fluxo Alternativo - Cancelamento da Confirmação

```
1. Modal de Confirmação
   └─> Organizador visualiza pergunta de confirmação
   └─> Organizador clica em "Não"
   
2. Página de Detalhes do Presente
   └─> Modal fechado
   └─> Nenhuma alteração realizada
   └─> Contribuição mantém status original
```

### 7.3 Fluxo de Exceção - Erro na Confirmação

```
1. Processamento
   └─> Spinner global exibido
   └─> API chamada: POST /contribuicaopresente/confirmar
   └─> Erro retornado (ex: 409 - já confirmada)
   
2. Modal de Erro
   └─> Spinner ocultado
   └─> Exibe: "Erro ao Confirmar" + mensagem específica do erro
   └─> Organizador clica em "Fechar"
   
3. Página de Detalhes do Presente
   └─> Modal fechado
   └─> Contribuição mantém status original
   └─> Nenhuma alteração nos totais
```

---

## 8. Casos de Uso Especiais

### 8.1 Contribuição Pendente há Muito Tempo

**Cenário:** Organizador confirma contribuição que está pendente há semanas

**Comportamento:**
- Sistema permite confirmação normalmente
- Não há validação de "tempo máximo pendente"
- Data de confirmação é registrada (diferente de data de cadastro)

### 8.2 Contribuição com Comprovante

**Cenário:** Organizador visualiza comprovante antes de confirmar

**Comportamento:**
- Organizador pode clicar em "Ver Comprovante" antes de confirmar
- Após visualizar e validar comprovante, pode confirmar
- Confirmação não exige obrigatoriamente visualização do comprovante

### 8.3 Contribuição sem Comprovante

**Cenário:** Organizador deseja confirmar contribuição sem comprovante anexado

**Comportamento:**
- Sistema permite confirmação mesmo sem comprovante
- Cabe ao organizador decidir se confirma ou não
- Recomenda-se ter processo de verificação externo (Pix, transferência, etc.)

### 8.4 Arrecadação Excede Valor do Presente

**Cenário:** Total de contribuições confirmadas ultrapassa valor do presente

**Comportamento:**
- Sistema permite confirmação normalmente
- Valor Restante exibido como R$ 0,00 (não negativo)
- Total Arrecadado mostra valor real (mesmo sendo maior que o valor do presente)
- Progresso pode mostrar >100% ou limitar em 100% (decisão de UX)

---

## 9. Métricas de Sucesso

| Métrica                              | Descrição                                             | Meta         |
| :----------------------------------- | :---------------------------------------------------- | :----------- |
| Taxa de Sucesso de Confirmação       | % de confirmações sem erro                            | > 99%        |
| Tempo Médio de Confirmação           | Tempo do clique até modal de sucesso                  | < 2 segundos |
| Erros de Race Condition              | Número de tentativas de confirmação duplicada         | < 0.1%       |
| Satisfação do Organizador            | Feedback sobre facilidade de usar a funcionalidade    | > 4.5/5      |

---

## 10. Considerações de Segurança

| Aspecto                     | Descrição                                                                           | Implementação                                     |
| :-------------------------- | :---------------------------------------------------------------------------------- | :------------------------------------------------ |
| Autorização                 | Apenas organizadores do evento podem confirmar contribuições                        | Validação no backend via token JWT                |
| Auditoria                   | Registrar quem confirmou a contribuição e quando                                    | Log de auditoria no banco de dados                |
| Validação de Integridade    | Garantir que contribuição pertence ao presente correto                              | Validação no backend antes de confirmar           |
| Prevenção de Race Condition | Evitar confirmação duplicada simultânea                                             | Lock de banco ou validação de estado              |
| Validação de Status         | Não permitir confirmação de contribuição já confirmada/cancelada                    | Validação no backend com retorno de erro 409      |

---

## 11. Cenários de Teste

### 11.1 Testes Funcionais

| ID    | Cenário                                              | Entrada                                    | Resultado Esperado                                              |
| :---- | :--------------------------------------------------- | :----------------------------------------- | :-------------------------------------------------------------- |
| TF-01 | Confirmar contribuição pendente                      | Contribuição status Pendente               | Status muda para Confirmado, totais atualizados                 |
| TF-02 | Tentar confirmar contribuição já confirmada          | Contribuição status Confirmado             | Ação não é exibida no menu                                      |
| TF-03 | Tentar confirmar contribuição cancelada              | Contribuição status Cancelado              | Ação não é exibida no menu                                      |
| TF-04 | Cancelar confirmação no modal                        | Clicar em "Não" no modal                   | Modal fecha, nenhuma alteração realizada                        |
| TF-05 | Confirmar contribuição com erro de API               | API retorna erro 500                       | Modal de erro exibido, status não alterado                      |
| TF-06 | Confirmar com contribuição já confirmada (backend)   | API retorna 409 Conflict                   | Modal de erro exibido com mensagem específica                   |
| TF-07 | Confirmar múltiplas contribuições sequencialmente    | Confirmar 3 contribuições seguidas         | Todas confirmadas com sucesso, totais atualizados corretamente  |
| TF-08 | Verificar atualização de Total Arrecadado           | Contribuição de R$ 100,00 confirmada       | Total Arrecadado aumenta em R$ 100,00                           |
| TF-09 | Verificar atualização de Valor Restante              | Contribuição de R$ 100,00 confirmada       | Valor Restante diminui em R$ 100,00                             |

### 11.2 Testes de Interface

| ID    | Cenário                                              | Entrada                                    | Resultado Esperado                                              |
| :---- | :--------------------------------------------------- | :----------------------------------------- | :-------------------------------------------------------------- |
| TI-01 | Verificar visibilidade da ação para contribuição pendente | Status Pendente                       | Ação "Confirmar contribuição" visível                           |
| TI-02 | Verificar ícone da ação                              | -                                          | Ícone `check_circle` exibido                                    |
| TI-03 | Verificar conteúdo do modal de confirmação           | -                                          | Nome do convidado e valor formatado corretos                    |
| TI-04 | Verificar spinner durante processamento              | Clicar em "Sim"                            | Spinner global exibido até resposta da API                      |
| TI-05 | Verificar modal de sucesso                           | Confirmação bem-sucedida                   | Título, mensagem e ícone corretos                               |
| TI-06 | Verificar modal de erro                              | Erro na API                                | Mensagem de erro amigável exibida                               |

### 11.3 Testes de Integração

| ID    | Cenário                                              | Entrada                                    | Resultado Esperado                                              |
| :---- | :--------------------------------------------------- | :----------------------------------------- | :-------------------------------------------------------------- |
| TG-01 | Confirmar e verificar persistência no banco          | Contribuição confirmada                    | Registro no banco com status Confirmado                         |
| TG-02 | Confirmar e verificar notificação ao convidado       | Contribuição confirmada                    | Convidado recebe notificação (se implementado)                  |
| TG-03 | Confirmar e verificar log de auditoria               | Contribuição confirmada                    | Log registra ID do organizador e data/hora                      |
| TG-04 | Duas confirmações simultâneas (race condition)       | 2 organizadores confirmam ao mesmo tempo   | Primeira sucede, segunda retorna erro 409                       |

---

## 12. Dependências Técnicas

### 12.1 Componentes

- **DetalharPresenteComponent**: Componente principal que contém a funcionalidade
- **TabelaGenericaComponent**: Tabela que exibe contribuições e ações
- **ModalService**: Serviço para exibir modais de confirmação, sucesso e erro
- **SpinnerService**: Serviço para exibir spinner de carregamento global

### 12.2 Serviços

- **PresenteService**: Serviço que contém método `confirmarContribuicao()`
- **NotificationService**: Serviço para exibir toasts (opcional)

### 12.3 Models

- **ConfirmarContribuicaoPresenteDto**: DTO para enviar dados de confirmação
- **ContribuicaoDetalhesDto**: DTO com detalhes da contribuição
- **RetornoAPI**: DTO padrão de retorno da API

### 12.4 Enums

- **EnumStatusContribuicao**: Enum com IDs dos status de contribuição
  - Pendente = 1
  - Confirmado = 2
  - Cancelado = 3
  - EmAnalise = 4
  - Estornado = 5

---

## 13. Documentação Adicional

### 13.1 Referências

- [Detalhar Presente User Story](./detalhar-presente-user-history.md)
- [Cancelar Contribuição User Story](./cancelar-contribuicao-presente-user-history.md)
- [Editar Contribuição User Story](./editar-contribuicao-presente-user-history.md)
- [Visualizar Comprovante User Story](./visualizar-comprovante-contribuicao-user-history.md)

### 13.2 Histórico de Alterações

| Data       | Versão | Autor | Alterações                              |
| :--------- | :----- | :---- | :-------------------------------------- |
| 19/02/2026 | 1.0    | AI    | Criação inicial da user story           |

---

## 14. Observações Finais

Esta funcionalidade é crítica para o fluxo financeiro do evento. A confirmação de contribuições impacta diretamente:

1. **Total Arrecadado**: Valor que o organizador pode contar como "confirmado"
2. **Valor Restante**: Quanto ainda precisa ser arrecadado
3. **Status do Presente**: Pode disparar mudanças de status (ex: Totalmente Arrecadado)
4. **Experiência do Convidado**: Contribuições confirmadas podem gerar notificações e agradecimentos

**Atenção especial deve ser dada a:**
- Performance: Confirmações devem ser rápidas
- Segurança: Apenas organizadores autorizados
- Auditoria: Rastreabilidade completa de quem confirmou e quando
- UX: Feedback claro e imediato sobre o resultado da ação
