# Sistema de Design EventHub
## Filosofia: Sofisticação Alegre

---

## 1. Visão Geral

O EventHub é uma plataforma de celebração que combina elegância premium com uma experiência calorosa e acessível. Rejeitamos a estética corporativa fria em favor de um design editorial que honra momentos especiais da vida.

Cada tela deve parecer um espaço de celebração cuidadosamente curado, onde elementos vibrantes (através da paleta rosa) se equilibram com generosos espaços em branco. O resultado é uma interface festiva, porém refinada.

### Princípios Fundamentais

**Celebrar Momentos, Não Formulários**: Cada interação deve ser encantadora, não transacional.

**Calor Através da Cor**: O rosa não é apenas uma cor de marca, é o tom emocional.

**Espaço para Respirar**: O espaço é tão importante quanto o conteúdo. Nunca apertado, sempre elegante.

**Profundidade Tonal em Vez de Linhas**: Use superfícies e tons para criar hierarquia, não bordas.

---

## 2. Cores

Nossa paleta é centrada no rosa primário e apoiada por uma hierarquia sofisticada de superfícies tonais.

### A Regra das Bordas Suaves

EventHub minimiza bordas explícitas de 1px. Os limites são definidos através de mudanças sutis de cor de fundo e espaçamento generoso.

Quando uma borda visual é absolutamente necessária, use uma Borda Fantasma: a cor de contorno em 40% de opacidade.

Exceção: Campos de entrada e botões podem usar bordas para affordance, mas nunca para seccionamento puro de layout.

### Hierarquia de Superfícies

Pense na interface como camadas de papel fino em tons variados de rosa e brancos cremosos:

**Tela Base**: Branco puro - O fundo principal.

**Áreas Recuadas**: Rosa muito claro - Para distinções sutis de painéis.

**Elementos Elevados**: Rosa claro - Para cards e conteúdo contido.

**Zonas Interativas**: Rosa destaque - Para estados hover e áreas ativas.

### Paleta Principal

Rosa Vibrante (Primário): #f04299
Rosa Claro: #f0dbe6
Rosa Escuro: #d81b60
Rosa Muito Claro: #fff0f6

Rosa Intenso (Secundário): #ff4fa0
Rosa Suave: #fcf8fa
Rosa Médio: #e02880

Superfície Base: #ffffff (branco)
Superfície Baixa: #fcf8fa (rosa bem claro)
Superfície Container: #f0dbe6 (rosa claro)
Superfície Destaque: #fff0f6 (rosa muito claro)

### Cores de Texto

Texto Principal: #333333 (cinza escuro)
Texto Secundário: #666666 (cinza médio)
Cinza Médio: #6e5f67 (com tint rosa)
Cinza Claro: #f8f3ef (com tint rosa)
Contorno: #f3e7ed (rosa bem claro)

### Cores Semânticas (Usar Com Moderação)

Sucesso: #4caf50 - Fundo: #e6f4ea
Erro: #d32f2f - Fundo: #fcebea
Aviso: #ff9800 - Fundo: #fff4e5
Info: #0288d1 - Fundo: #e1f5fe

Importante: Use APENAS para indicadores de status, alertas e feedback. Nunca como cores principais da interface.

### Gradientes

Para CTAs principais e elementos hero, aplique um gradiente vertical sutil:
- Início: Rosa primário
- Fim: Rosa escuro

Para overlays flutuantes (navegação, modais), use fundo semi-transparente com desfoque de 20px para criar efeito de vidro fosco.

---

## 3. Tipografia

A tipografia é nossa principal ferramenta de narrativa. Usamos uma pilha de fontes do sistema que equilibra precisão técnica com calor humano.

### Escala de Importância

Display (Momentos Hero): 1.8rem / peso 700 - Para títulos de página e anúncios de celebração.

Headline (Âncoras de Seção): 1.5rem / peso 600 - Para cabeçalhos de seção que guiam o olho.

Título (Cabeçalhos de Conteúdo): 1rem / peso 600 - Para títulos de cards e sub-seções.

Corpo (Leitura Principal): 1rem / peso 500 - A espinha dorsal do conteúdo.

Label (Texto de Suporte): 0.875rem / peso 500 - Para metadados, legendas e texto auxiliar.

### Princípio do Contraste

Para qualidade editorial, combine títulos grandes com labels significativamente menores. Este alto contraste na escala é a assinatura do design premium.

Nunca use elementos de texto consecutivos na mesma escala. Sempre crie ritmo visual através da variação de tamanho.

### Responsividade Mobile

No mobile (até 600px), redimensione a tipografia para 85% dos valores desktop. Mantenha a mesma hierarquia de peso - o ritmo visual deve ser consistente entre dispositivos.

---

## 4. Elevação e Profundidade

A hierarquia é transmitida através de Camadas Tonais e Sombras Suaves, não linhas estruturais.

### Princípio de Empilhamento

Crie profundidade caminhando superfícies com valores tonais diferentes. Coloque um card de superfície clara em uma seção de superfície ligeiramente mais escura para criar elevação natural.

### Sombras Ambientes

Quando um efeito flutuante é necessário (dropdowns, modais, diálogos), use Sombras Ambientes - sombras extra-difusas e de baixa opacidade:

Sombra de Card Padrão: 0 2px 16px 0 rgba(240, 66, 153, 0.04)
Elevação Hover: 0 4px 20px rgba(240, 66, 153, 0.12)
Lift Interativo: 0 2px 8px rgba(240, 66, 153, 0.08), 0 1.5px 4px rgba(0, 0, 0, 0.04)

Regra Crítica: Sempre tinja sombras com a cor primária em opacidade muito baixa (4%-12%). Nunca use sombras pretas puras - elas parecem duras e datadas.

### Borda Fantasma (Fallback)

Se uma borda for estritamente necessária para acessibilidade ou definição de campo:
- Cor: Rosa claro de contorno
- Opacidade: 40%-60%
- Largura: 1px máximo

---

## 5. Espaçamento e Ritmo

O espaçamento cria espaço para respirar e ritmo visual. Nossa escala de espaçamento é baseada em múltiplos de 6px:

XS: 6px - Micro espaçamento (entre ícones e texto)
SM: 12px - Agrupamento apertado (labels de campos)
MD: 18px - Espaçamento padrão (entre componentes)
LG: 24px - Espaçamento de seção (entre blocos de conteúdo)
XL: 32px - Seções maiores
2XL: 40px - Espaçamento de nível de página
3XL: 48px+ - Seções hero

### Regra do Padding Assimétrico

Crie um lift editorial usando mais padding no topo das seções do que na parte inferior.

Exemplo:
- Padding superior da seção: 40px
- Padding inferior da seção: 24px

Isso cria uma sensação de conteúdo "flutuante" que parece intencional e curado.


---

## 6. Botões

Os botões são elementos de ação que devem transmitir confiança.

### Botão Primário

Cor de fundo: Gradiente vertical do rosa primário para o rosa escuro
Cor do texto: Branco
Tamanho da fonte: 1rem, negrito
Espaçamento interno: 14px acima/abaixo, 32px esquerda/direita
Arredondamento: 8px
Sombra: Sombra rosa suave

No hover o botão "levanta" com mais sombra e aumenta um pouco de tamanho.

Use para: "Criar Evento", "Confirmar Presença", "Salvar"

### Botão Secundário

Fundo transparente com borda rosa primária
Texto rosa primário
Mesmo tamanho e espaçamento do primário

No hover adiciona fundo rosa bem claro.

Use para: "Cancelar", "Voltar", "Ver Detalhes"

### Botão Terciário

Sem fundo, sem borda
Apenas texto rosa intenso
Sublinhado aparece no hover

Use para: "Editar", "Excluir", links inline

---

## 7. Cards

Cards são containers que mostram conteúdo de forma organizada.

Fundo: Branco
Arredondamento: 16px
Sombra: Rosa suave muito leve
Espaçamento interno: 20px
No hover: Sombra aumenta levemente

### Regra Importante: Não use Linhas Divisórias

Evite usar linhas horizontais dentro dos cards. Em vez disso:
- Use espaços maiores entre seções (16px-24px)
- Mude a cor de fundo de uma seção se precisar separar

Máximo 3 seções por card: cabeçalho, conteúdo, rodapé
Deixe 24px de espaço entre cards

---

## 8. Campos de Formulário

Os campos devem ser acolhedores e fáceis de usar.

Fundo: Rosa bem claro
Borda: Rosa muito claro com transparência
Arredondamento: 8px
Espaçamento interno: 12px acima/abaixo, 16px esquerda/direita
Tamanho da fonte: 1rem

### Quando o usuário clica no campo

Borda fica rosa primário sólido
Aparece uma sombra interna sutil
Transição suave de 150ms

### Labels e Textos de Ajuda

Label acima do campo: Tamanho 0.875rem, negrito, cinza escuro, 8px de distância
Texto de ajuda abaixo: Tamanho 0.75rem, cinza médio, 6px de distância

### Mensagens de Erro

Use tom amigável: "Ops! Esse email não parece estar completo." em vez de "Email inválido."
Label e borda ficam vermelhos no erro

Ícones ajudam o usuário a entender ações rapidamente.

Tamanho: 20px ou 24px (nunca menor que 16px)
 Espessura: Traços de 1.5px a 2px
Cor: Mesma cor do texto ao redor (cinza escuro ou rosa)
Espaçamento: 8px entre ícone e texto

### Ícones Comuns

Calendário para eventos
Grupo de pessoas para convidados
Caixa de presente para presentes
Sino para notificações
Lápis para editar, lixeira para excluir, check para confirmar

### Use com Moderação

Não encha a interface de ícones. Use apenas quando ajudar a clareza.

---

## 10. Etiquetas (Badges)

Etiquetas mostram status de forma visual.

Fundo: Cor semântica com 10% de opacidade
Texto: Cor semântica completa
Tamanho da fonte: 0.75rem, negrito, maiúsculas
Espaçamento interno: 4px vertical, 10px horizontal
Arredondamento: 12px (formato de pílula)

### Cores de Status

Verde: Confirmado, completo
Laranja: Pendente, aguardando
Vermelho: Erro, cancelado
Azul: Informação
Rosa: Destaque, novo

---

## 11. Layout e Grade

O layout deve ser limpo e focado no conteúdo.

### Grade de 3 Colunas (Desktop)

Largura máxima: 1200px
Espaçamento entre colunas: 24px
Largura mínima da coluna: 300px

Em tablets: 2 colunas
Em mobile: 1 coluna

### Padrão Hero + Conteúdo

Seção hero: Largura total, altura de 60% da tela
Conteúdo: Máximo 1200px de largura, centralizado
Espaçamento vertical: 48px ou mais

### Padrão Sidebar

Sidebar: 280px de largura, fundo rosa claro
Conteúdo principal: Largura flexível, 32px de margem da sidebar

---

## 12. Animações

As animações devem ser suaves e naturais.

### Velocidades

Rápido (150ms): Hover, foco
Normal (200ms): Clique de botão, dropdown
Lento (300ms): Mudança de página, modal

### Efeito Aparecer

Quando algo aparece na tela:
- Opacidade vai de 0 para 1
- Move de 12px abaixo para posição final
- Duração: 200ms

Isto cria um efeito de "elevação" sutil.

### Evite

Não use efeitos de bounce
Não use piscadas rápidas
Não use rotações excessivas

---

## 13. Responsividade

O EventHub deve funcionar bem em todos os tamanhos de tela.

### Pontos de Quebra

Mobile: até 600px
Tablet: 601px a 900px
Desktop: acima de 900px

### Adaptações Mobile

Tamanhos de fonte: 85% dos valores desktop
Espaçamentos: 75% dos valores desktop
Grade: Uma única coluna
Áreas de toque: Mínimo 44px

### Princípio da Consistência

Mesmo mudando o layout, mantenha:
- Dominância da cor rosa
- Espaçamento generoso (proporcional)
- Hierarquia de tipografia

---

## 14. Acessibilidade

Design premium nunca compromete acessibilidade.

### Contraste de Cores

Texto normal: Mínimo 4.5:1 de contraste
Texto grande (mais de 18pt): Mínimo 3:1
Elementos interativos: Mínimo 3:1 com o entorno

### Indicadores de Foco

Todos os elementos clicáveis precisam mostrar quando estão focados:

Contorno: 2px sólido rosa primário
Distância do contorno: 2px
Arredondamento: Igual ao elemento

Nunca remova o foco sem adicionar uma alternativa.

### Navegação por Teclado

Todos os elementos devem funcionar com teclado
Ordem do Tab segue a hierarquia visual
Modais prendem o foco até serem fechados

### Leitores de Tela

Imagens têm texto alternativo
Labels associados aos campos
Botões só com ícone têm labels ARIA
Mensagens de status são anunciadas

---

## 15. Regras Importantes

### Faça

Use mudanças de tom de cor para criar limites
Abraçe os espaços em branco como elemento de design
Crie contraste com tamanhos de texto diferentes
Empilhe superfícies para criar profundidade

### Não Faça

Não use linhas divisórias entre itens de lista
Não use sombras pretas puras
Não coloque cards dentro de cards dentro de cards
Não confie apenas em bordas para organização

### Cores

Use o rosa primário como âncora emocional
Adicione tint rosa nas sombras
Aplique gradientes em CTAs principais
Use cores semânticas com moderação

Não abuse de cores vermelhas/verdes
Não use cores muito saturadas em fundos grandes
Não misture cinzas frios e quentes
Não use só cor para transmitir informação

### Espaçamento

Use mais padding em cima que embaixo (assimetria editorial)
Dobre o espaçamento antes de adicionar borda
Mantenha mínimo 44px para área de toque
Quebre a grade ocasionalmente para criar interesse

Não aperte o conteúdo
Não use valores aleatórios, siga a escala de 6px
Não aninhe mais de 3 níveis de containers
Não esqueça de testar no mobile

---

## 16. Configuração no Stitch

### The Container Philosophy

All content lives within a **centered container** that respects reading comfort:

```
Max-width: 1200px
Margin: 0 auto (centered)
Padding: 0 40px 40px 40px (Desktop)
Padding: 0 15px 15px 15px (Mobile)
```

### Grid System: Responsive & Flexible

Use a **fluid grid** that adapts gracefully:

* **Desktop (>900px)**: 3 columns with 20px gap
* **Tablet (601-900px)**: 2 columns with 18px gap
* **Mobile (≤600px)**: Single column with 16px gap

**The Asymmetry Rule:** Occasionally break the grid by offsetting elements or using unequal column widths (e.g., 2:1 ratio) to create visual interest and escape the "template" feel.

### Page Header Pattern

```
┌─────────────────────────────────────────────────────┐
│ [Page Title (1.8rem/700)]        [Primary CTA]     │
│ [Subtitle/Breadcrumb (0.875rem/500)]               │
└─────────────────────────────────────────────────────┘
Spacing: 32px bottom margin
```

### Search & Filter Bar

```
┌─────────────────────────────────────────────────────┐
│ [Search Input (70% width)]  [Filter Select (30%)]  │
└─────────────────────────────────────────────────────┘
Background: surface_low (#fcf8fa)
Border-radius: 12px
Padding: 16px
Margin-bottom: 24px
```

### Empty States: Emotional Voids

Empty states should feel **hopeful, not empty**.

```
[Illustration (centered, max 300px width)]
[Heading (1.5rem/600)]
[Description (1rem/500, max 400px width)]
[Primary CTA]

All centered, vertical spacing: 24px between elements
Background: surface or surface_low
```

**Illustration Style:** Flat design using the rose palette, friendly and modern

---

## 8. Responsive Behavior

### Breakpoint Strategy

* **Mobile**: ≤ 600px
* **Tablet**: 601px - 900px
* **Desktop**: > 900px

### Mobile-First Adaptations

When transitioning to mobile:
1. **Typography**: Scale to 85% of desktop values
2. **Spacing**: Reduce by 25% (40px → 15px, 24px → 18px)
3. **Grid**: Collapse to single column
4. **Navigation**: Transform to bottom tab bar or drawer
5. **Cards**: Remove horizontal padding, allow full bleed

**Critical Rule:** Never hide functionality on mobile. Adapt the UI, don't remove features.

---

## 9. Interaction & Motion

### Transition Philosophy

Motion should feel **natural and purposeful**, never arbitrary.

* **Fast (0.2s ease)**: Button hovers, simple color shifts
* **Normal (0.3s ease)**: Card elevations, dropdown reveals
* **Slow (0.5s ease)**: Page transitions, complex animations

**The Easing Rule:** Use `ease` or `ease-out` for most transitions. Avoid `linear` unless creating a mechanical effect.


Ícones ajudam o usuário a entender ações rapidamente.

Tamanho: 20px ou 24px (nunca menor que 16px)
Espessura: Traços de 1.5px a 2px
Cor: Mesma cor do texto ao redor (cinza escuro ou rosa)
Espaçamento: 8px entre ícone e texto

### Ícones Comuns

Calendário para eventos
Grupo de pessoas para convidados
Caixa de presente para presentes
Sino para notificações
Lápis para editar, lixeira para excluir, check para confirmar

### Use com Moderação

Não encha a interface de ícones. Use apenas quando ajudar a clareza.

---

## 10. Etiquetas (Badges)

Etiquetas mostram status de forma visual.

Fundo: Cor semântica com 10% de opacidade
Texto: Cor semântica completa
Tamanho da fonte: 0.75rem, negrito, maiúsculas
Espaçamento interno: 4px vertical, 10px horizontal
Arredondamento: 12px (formato de pílula)

### Cores de Status

Verde: Confirmado, completo
Laranja: Pendente, aguardando
Vermelho: Erro, cancelado
Azul: Informação
Rosa: Destaque, novo

---

## 11. Layout e Grade

O layout deve ser limpo e focado no conteúdo.

### Grade de 3 Colunas (Desktop)

Largura máxima: 1200px
Espaçamento entre colunas: 24px
Largura mínima da coluna: 300px

Em tablets: 2 colunas
Em mobile: 1 coluna

### Padrão Hero + Conteúdo

Seção hero: Largura total, altura de 60% da tela
Conteúdo: Máximo 1200px de largura, centralizado
Espaçamento vertical: 48px ou mais

### Padrão Sidebar

Sidebar: 280px de largura, fundo rosa claro
Conteúdo principal: Largura flexível, 32px de margem da sidebar

---

## 12. Animações

As animações devem ser suaves e naturais.

### Velocidades

Rápido (150ms): Hover, foco
Normal (200ms): Clique de botão, dropdown
Lento (300ms): Mudança de página, modal

### Efeito Aparecer

Quando algo aparece na tela:
- Opacidade vai de 0 para 1
- Move de 12px abaixo para posição final
- Duração: 200ms

Isto cria um efeito de "elevação" sutil.

### Evite

Não use efeitos de bounce
Não use piscadas rápidas
Não use rotações excessivas

---

## 13. Responsividade

O EventHub deve funcionar bem em todos os tamanhos de tela.

### Pontos de Quebra

Mobile: até 600px
Tablet: 601px a 900px
Desktop: acima de 900px

### Adaptações Mobile

Tamanhos de fonte: 85% dos valores desktop
Espaçamentos: 75% dos valores desktop
Grade: Uma única coluna
Áreas de toque: Mínimo 44px

### Princípio da Consistência

Mesmo mudando o layout, mantenha:
- Dominância da cor rosa
- Espaçamento generoso (proporcional)
- Hierarquia de tipografia

---

## 14. Acessibilidade

Design premium nunca compromete acessibilidade.

### Contraste de Cores

Texto normal: Mínimo 4.5:1 de contraste
Texto grande (mais de 18pt): Mínimo 3:1
Elementos interativos: Mínimo 3:1 com o entorno

### Indicadores de Foco

Todos os elementos clicáveis precisam mostrar quando estão focados:

Contorno: 2px sólido rosa primário
Distância do contorno: 2px
Arredondamento: Igual ao elemento

Nunca remova o foco sem adicionar uma alternativa.

### Navegação por Teclado

Todos os elementos devem funcionar com teclado
Ordem do Tab segue a hierarquia visual
Modais prendem o foco até serem fechados

### Leitores de Tela

Imagens têm texto alternativo
Labels associados aos campos
Botões só com ícone têm labels ARIA
Mensagens de status são anunciadas

---

## 15. Regras Importantes

### Faça

Use mudanças de tom de cor para criar limites
Abrace os espaços em branco como elemento de design
Crie contraste com tamanhos de texto diferentes
Empilhe superfícies para criar profundidade

### Não Faça

Não use linhas divisórias entre itens de lista
Não use sombras pretas puras
Não coloque cards dentro de cards dentro de cards
Não confie apenas em bordas para organização

### Cores

Use o rosa primário como âncora emocional
Adicione tint rosa nas sombras
Aplique gradientes em CTAs principais
Use cores semânticas com moderação

Não abuse de cores vermelhas/verdes
Não use cores muito saturadas em fundos grandes
Não misture cinzas frios e quentes
Não use só cor para transmitir informação

### Espaçamento

Use mais padding em cima que embaixo (assimetria editorial)
Dobre o espaçamento antes de adicionar borda
Mantenha mínimo 44px para área de toque
Quebre a grade ocasionalmente para criar interesse

Não aperte o conteúdo
Não use valores aleatórios, siga a escala de 6px
Não aninhe mais de 3 níveis de containers
Não esqueça de testar no mobile

---

## 16. Referência Rápida de Código

### Variáveis CSS

Cores principais:
- Rosa primário: #f04299
- Rosa claro: #f0dbe6
- Rosa escuro: #d81b60
- Rosa suave: #fcf8fa
- Branco: #ffffff
- Texto: #333333
- Texto secundário: #666666

Espaçamentos:
- XS: 6px
- SM: 12px
- MD: 18px
- LG: 24px
- XL: 32px
- 2XL: 40px
- 3XL: 48px

Tipografia:
- Display: 1.8rem
- Headline: 1.5rem
- Título: 1rem
- Corpo: 1rem
- Label: 0.875rem

Sombras:
- Card: 0 2px 16px 0 rgba(240, 66, 153, 0.04)
- Hover: 0 4px 20px rgba(240, 66, 153, 0.12)

Transições:
- Rápida: 0.2s ease
- Normal: 0.3s ease
- Lenta: 0.5s ease

### Mixins SCSS Disponíveis

Use os mixins já existentes em /src/app/core/utils/theme/mixins/:

btn-primary() - Estilos de botão primário
btn-secondary() - Estilos de botão secundário
card() - Container de card com sombra
container() - Container de página
grid-columns() - Grade responsiva
titulo-pagina() - Tipografia de título
texto-alert() - Estilos de alerta

---

## 17. Configuração no Stitch

---

## 17. Configuração no Stitch

Ao criar protótipos no Stitch, siga estas instruções.

### CRÍTICO: Configuração da Paleta de Cores

O EventHub usa PALETA MONOCROMÁTICA ROSA, não cores complementares.

NÃO deixe o Stitch gerar cores automáticas como azul ou roxo.

### Como Configurar (Passo a Passo)

1. Cor Semente: #f04299
2. Tema de Cor: Selecione "Personalizado"
3. Configure manualmente:

Primário (Rosa Vibrante):
- Principal: #f04299
- Claro: #f0dbe6
- Escuro: #d81b60
- Container: #fff0f6

Secundário (Rosa Intenso):
- Principal: #ff4fa0
- Claro: #fcf8fa
- Escuro: #e02880
- Container: #f0dbe6

Terciário (Neutro com Rosa):
- Principal: #f8f3ef
- Claro: #ffffff
- Escuro: #f3e7ed
- Container: #fcf8fa

Neutro (Cinzas com Rosa):
- Principal: #6e5f67
- Claro: #f8f3ef
- Escuro: #333333
- Container: #f3e7ed

### Cores Prontas para Copiar

Rosa Primário: #f04299
Rosa Escuro: #d81b60
Rosa Claro: #f0dbe6
Rosa Intenso: #ff4fa0
Branco: #ffffff
Rosa Suave: #fcf8fa
Rosa Container: #f0dbe6
Rosa Destaque: #fff0f6
Texto Principal: #333333
Texto Secundário: #666666
Contorno: #f3e7ed
Cinza Médio: #6e5f67

### Cores Semânticas (Usar Pouco)

Verde Sucesso: #4caf50 com fundo #e6f4ea
Vermelho Erro: #d32f2f com fundo #fcebea
Laranja Aviso: #ff9800 com fundo #fff4e5
Azul Info: #0288d1 com fundo #e1f5fe

Use APENAS para status, alertas e feedback, nunca como cores principais.

### Componentes Principais

Botões:

Botão Primário:
- Fundo: Gradiente vertical de #f04299 para #d81b60
- Texto: Branco
- Borda: 1.5px sólido #f04299
- Arredondamento: 8px
- Altura: 55px desktop, 42px mobile
- Sombra: 0 2px 8px rgba(240, 66, 153, 0.08)

Botão Secundário:
- Fundo: Branco
- Texto: #f04299
- Borda: 1.5px sólido #f04299
- Mesmas dimensões do primário

Cards:

- Fundo: Branco
- Arredondamento: 16px
- Sombra: 0 2px 16px 0 rgba(240, 66, 153, 0.04)
- Padding: 24px desktop, 16px mobile
- No hover: Sombra aumenta para 0 4px 20px rgba(240, 66, 153, 0.12)

Campos de Input:

- Fundo: #fcf8fa
- Borda: 1px #f3e7ed com 60% de opacidade
- Arredondamento: 8px
- Padding: 12px 16px
- No foco: Borda fica #f04299 sólido com brilho sutil

Badges:

- Fundo: Cor semântica com 10% de opacidade
- Texto: Cor semântica com 100% de opacidade
- Padding: 4px 12px
- Arredondamento: 16px (pílula)
- Fonte: 0.75rem negrito maiúsculas

### Grade e Layout

Desktop: 3 colunas com 20px de espaço
Tablet: 2 colunas com 18px de espaço
Mobile: 1 coluna com 16px de espaço

Container máximo: 1200px centralizado
Padding externo: 40px desktop, 15px mobile

### Tipografia

Display (Títulos Grandes): 1.8rem, peso 700
Headline (Cabeçalhos): 1.5rem, peso 600
Título (Cards): 1rem, peso 600
Corpo (Texto): 1rem, peso 500
Label (Pequeno): 0.875rem, peso 500

Mobile: Reduzir para 85% dos tamanhos desktop

### Checklist Antes de Prototipar

1. Paleta configurada só com rosa (não azul/roxo)
2. Todas as cores têm tint rosa
3. Botões primários com gradiente vertical
4. Cards com sombra rosa, não preta
5. Sem linhas divisórias entre seções
6. Espaçamentos na escala de 6px
7. Arredondamentos: 8px botões, 16px cards
8. Tipografia segue escala definida
9. Layout responsivo 3→2→1 colunas
10. Estados hover mostram elevação suave

### Erros Comuns

MONOCROMÁTICO significa tudo na família rosa
Não use azul ou roxo
Não aceite sugestões automáticas de cores
Verifique se todas as cores têm tint rosa
Não use sombras pretas puras

---

## Fim do Documento

Este é o sistema de design do EventHub. Use como referência para manter consistência visual em todo o projeto.
```

#### Cards
```
Background: #ffffff
Border-radius: 16px
Shadow: 0 2px 16px 0 rgba(240, 66, 153, 0.04)
Padding: 24px
Hover Shadow: 0 4px 20px rgba(240, 66, 153, 0.12)
```

#### Inputs
```
Background: #fcf8fa (surface_low)
Border: 1px solid #f3e7ed at 60% opacity
Border-radius: 8px
Padding: 12px 16px
Focus Border: #f04299 with 2px glow
```

#### Badges
```
Background: Semantic color at 10% opacity
  - Success badge: #e6f4ea
  - Warning badge: #fff4e5
  - Error badge: #fcebea
Text: Darken background color by 40%
Border-radius: 16px (full pill)
Padding: 4px 12px
Font: 0.75rem / 600 weight
```

### Layout Specifications

#### Container
```
Max-width: 1200px
Padding: 40px (desktop) | 15px (mobile)
Margin: 0 auto (centered)
```

#### Grid System
```
Desktop (>900px): 3 columns, 20px gap
Tablet (601-900px): 2 columns, 18px gap
Mobile (≤600px): 1 column, 16px gap
```

---

## Fim do Documento

Este é o sistema de design do EventHub. Use como referência para manter consistência visual em todo o projeto.
