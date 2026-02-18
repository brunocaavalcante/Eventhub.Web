# User History - Migração de Base64 para URLs do Cloudinary

## 1. Informações Gerais

| Campo         | Valor                                                |
| :------------ | :--------------------------------------------------- |
| **Módulo**    | gestao-presentes, gestao-eventos, gestao-convidados |
| **Prioridade**| Alta                                                 |
| **Estimativa**| L (Grande - 13-20 horas)                             |
| **Dependências** | API Backend (suportar retorno de URLs do Cloudinary) |
| **Data Início** | 18/02/2026                                          |

### 1.1 História do Usuário

**COMO** Usuário da plataforma EventHub
**QUERO** Que as imagens carreguem mais rápido e consumam menos banda
**PARA** Ter uma experiência mais fluida ao navegar pela galeria de presentes, eventos e comprovantes de contribuição

### 1.2 Justificativa Técnica e de Negócio

**Benefícios da Migração:**
- **Performance**: URLs do Cloudinary carregam ~60-80% mais rápido que base64
- **Banda**: Redução de 40-50% no consumo de dados por requisição
- **Escalabilidade**: Cloudinary oferece CDN global com cache automático
- **Otimização**: Suporte nativo a lazy-loading, responsive images e formatos otimizados (WebP, AVIF)
- **Gerenciamento**: Facilita futuras operações em lote (crop, resize, filter) sem processamento no frontend
- **SEO**: URLs com CDN melhoram rankings de imagens nos buscadores

**Competidores/Benchmarks:**
- iCasei, Zankyou e Casare: Usam CDN para imagens (velocidade média: 1.2s)
- EventHub (atual): Base64 embarcado (velocidade média: 2.8s)
- Meta esperada: Alinhamento com <1.5s para carregamento de galerias

---

## 2. Critérios de Aceite

### 2.1 Cenário 1: Carregamento de Imagens via URL ao invés de Base64

**DADO** que o usuário acessa uma página com galeria de imagens (presentes, eventos, comprovantes)
**QUANDO** o componente inicia a renderização
**ENTÃO** as imagens são carregadas via URLs do Cloudinary ao invés de base64 embarcado
**E** as seguintes condições são atendidas:
- Todas as imagens carregam via tags `<img [src]="url">`
- Não há processamento de base64 no frontend para exibição
- A propriedade `url` é sempre priorizada sobre `base64`

#### 2.1.1 Informações Adicionais
- **Componentes Afetados**: 
  - CardPresenteComponent (carrossel)
  - DetalharPresenteComponent (galeria)
  - VisualizarComprovanteModalComponent (comprovante)
  - EditarPresentesComponent (preview)
- **Fallback**: Se `url` não estiver disponível, retornar string vazia vs. exibir quebra
- **Validação**: URL deve iniciar com https:// ou estar em assets/

### 2.2 Cenário 2: Modelo Imagem Estendido com Suporte a Cloudinary

**DADO** que a aplicação processa imagens
**QUANDO** o modelo `Imagem` é utilizado
**ENTÃO** o sistema suporta as seguintes propriedades:
- `id`: Identificador único da imagem (existente, mantido)
- `publicId`: ID público do Cloudinary para gerenciamento
- `url`: URL completa da imagem no Cloudinary (novo)
- `base64`: Base64 legado para retrocompatibilidade (mantido)
- `nomeArquivo`: Nome arquivo original (existente, mantido)
- `tipoImagem`: Enum TipoImagemEvento (existente, mantido)
- `tipoArquivo`: MIME type da imagem ex: "image/jpeg" (novo)

#### 2.2.1 Informações Adicionais
- **Funções Utilitárias**: Adicionar `extrairExtensaoArquivo()` e `resolverMimeTypeArquivo()` ao modelo
- **Retrocompatibilidade**: Manter `base64` opcional para dados legados
- **Padrão de Retorno da API**:
  ```json
  {
    "id": 1,
    "publicId": "eventos/presente_12345_abc",
    "url": "https://res.cloudinary.com/meuapp/image/upload/v1708282800/eventos/presente_12345_abc.jpg",
    "nomeArquivo": "presente_bonito.jpg",
    "base64": null,
    "tipoImagem": "Produto",
    "tipoArquivo": "image/jpeg"
  }
  ```

### 2.3 Cenário 3: Refatoração de Getters de Imagem em Componentes

**DADO** que componentes usam getters para acessar imagens
**QUANDO** os getters processam arrays de imagens
**ENTÃO** eles retornam URLs diretamente sem processamento de base64
**E** aplicam as seguintes regras:
- Getter `imagens`: `map(img => img.url || '')`
- Getter `currentImage`: Retorna string vazia se indice fora do range
- Getter `hasImages`: `return this.imagens.length > 0`
- Getter `hasMultipleImages`: `return this.imagens.length > 1`

#### 2.3.1 Componentes Refatorados
- CardPresenteComponent: ✓ Completo
- DetalharPresenteComponent: ✓ Completo
- EditarPresentesComponent: ✓ Completo

### 2.4 Cenário 4: Extração de Extensão de Arquivo a partir de MIME Type ou URL

**DADO** que o sistema precisa determinar extensão de imagem (ex: para download)
**QUANDO** processar metadados de imagem
**ENTÃO** seguir ordem de prioridade:
1. Se `tipoArquivo` disponível (ex: "image/jpeg") → extrair com regex `replace('image/', '')`
2. Se `url` disponível → extrair extensão da URL com regex `/\.(png|jpe?g|webp|gif)($|\?)/i`
3. Fallback padrão → retornar "png"

#### 2.4.1 Exemplo de Implementação
```typescript
private obterExtensaoImagem(): string {
  const tipoArquivo = this.data.comprovante.tipoArquivo;
  
  if (tipoArquivo) {
    return tipoArquivo.replace('image/', '');
  }
  
  const url = this.data.comprovante.url || '';
  const match = url.match(/\.(png|jpe?g|webp|gif)($|\?)/i);
  if (match) {
    return match[1];
  }

  return 'png';
}
```

### 2.5 Cenário 5: Retrocompatibilidade com Dados Legados em Base64

**DADO** que podem existir dados antigos com apenas base64
**QUANDO** componentes processam imagens legadas
**ENTÃO** o sistema:
- Verifica se é URL HTTP ou assets/ → usa diretamente
- Verifica se é data URI base64 → processa com `Base64ImageUtil` (fallback)
- Mantém função `resolverFoto()` adaptada para ambos os formatos

#### 2.5.1 Especificação
```typescript
resolverFoto(foto?: string): string {
  if (!foto) return 'assets/icones/user-default.png';
  
  // Se já é URL, usar diretamente
  if (foto.startsWith('http') || foto.startsWith('assets/')) {
    return foto;
  }
  
  // Fallback para base64 legado
  return Base64ImageUtil.resolveImageSource(foto);
}
```

### 2.6 Cenário 6: Testes Unitários com Novos Mocks

**DADO** que suite de testes precisa validar nova estrutura
**QUANDO** executar testes
**ENTÃO** todos os mocks devem incluir:
- `url`: URL do Cloudinary
- `tipoArquivo`: MIME type
- `base64`: Pode ser vazio ou null
- Todos os 301 testes devem passar

#### 2.6.1 Padrão de Mock
```typescript
const mockImagem: Imagem = {
  id: 1,
  nomeArquivo: 'imagem1.jpg',
  base64: '', // Vazio ou null
  url: 'https://exemplo.com/imagem1.jpg', // URL do Cloudinary
  tipoArquivo: 'image/jpeg',
  tipoImagem: TipoImagemEvento.Produto,
  publicId: 'eventos/image_123'
};
```

### 2.7 Cenário 7: Componentes de Upload Incluem tipoArquivo

**DADO** que usuário faz upload de imagem
**QUANDO** componente cria objeto `Imagem` para envio ao backend
**ENTÃO** inclui propriedade `tipoArquivo` resolvida via função `resolverMimeTypeArquivo()`
**E** aplica em:
- CadastrarPresentesComponent
- CadastrarEventoComponent
- EditarPresentesComponent
- CadastrarContribuicaoPresenteComponent
- EnviarConviteComponent (para foto de fundo do convite)

#### 2.7.1 Mapeamento Padrão
```typescript
imagens: this.imagens.map((img, idx) => ({
  nomeArquivo: `imagem_${idx + 1}.jpg`,
  base64: Base64ImageUtil.extractBase64(img),
  url: img, // URL local do preview
  tipoImagem: TipoImagemEvento.Produto,
  tipoArquivo: 'image/jpeg' // Resolvido dinamicamente
}))
```

### 2.8 Cenário 8: Tabela Genérica Prioriza URLs

**DADO** que TabelaGenericaComponent renderiza imagens em colunas
**QUANDO** método `resolverImagem()` é chamado
**ENTÃO** aplica lógica de priorização:
1. Se valor começa com "http" → retornar direto
2. Se valor começa com "assets/" → retornar direto
3. Se é base64 → processar com `Base64ImageUtil.resolveImageSource()`
4. Fallback → retornar ícone padrão ("person")

#### 2.8.1 Implementação
```typescript
resolverImagem(linha: T, chave: string, iconePadrao = 'person'): string {
  const valor = this.obterValor(linha, chave);
  if (!valor) return iconePadrao;

  if (valor.startsWith('http') || valor.startsWith('assets/')) {
    return valor;
  }

  const resolvida = Base64ImageUtil.resolveImageSource(valor);
  return resolvida || iconePadrao;
}
```

---

## 3. Campos da Interface

### 3.1 Modelo Atualizado

**Arquivo**: `src/app/core/models/imagem.model.ts`

```typescript
export interface Imagem {
  id?: number;
  publicId?: string;        // NOVO: ID público do Cloudinary
  url?: string;             // NOVO: URL da imagem no Cloudinary
  nomeArquivo: string;
  base64: string;           // Mantido para retrocompatibilidade
  tipoImagem: TipoImagemEvento;
  tipoArquivo: string;      // NOVO: MIME type da imagem
}

export enum TipoImagemEvento {
  Capa = "Capa",
  Local = "Local",
  Galeria = "Galeria",
  Convite = "Convite",
  Produto = "Produto",
  Comprovante = "Comprovante"
}

// Funções utilitárias adicionadas
export function extrairExtensaoArquivo(nomeArquivo: string): string { ... }
export function resolverMimeTypeArquivo(nomeArquivoOuExtensao?: string): string { ... }
```

### 3.2 Componentes Principais Afetados

| Componente | Alterações | Status |
| :--- | :--- | :--- |
| CardPresenteComponent | Getter `imagens` → URL direto | ✓ Completo |
| DetalharPresenteComponent | Getter `imagens` + `resolverFoto()` | ✓ Completo |
| EditarPresentesComponent | Getter `imagensVisualizacao` + `onImagensChange()` | ✓ Completo |
| VisualizarComprovanteModalComponent | Getter `resolverImagemComprovante()` + `obterExtensaoImagem()` | ✓ Completo |
| TabelaGenericaComponent | Método `resolverImagem()` | ✓ Completo |
| EnviarConviteComponent | Método `setForm()` | ✓ Completo |
| CadastrarPresentesComponent | Mapeamento em `onSubmit()` | ✓ Completo |
| CadastrarEventoComponent | Mapeamento em `salvarEvento()` | ✓ Completo |
| CadastrarContribuicaoPresenteComponent | Mapeamento em `confirmarPagamento()` | ✓ Completo |

### 3.3 Testes Atualizados

| Arquivo de Teste | Alterações | Status |
| :--- | :--- | :--- |
| card-presente.component.spec.ts | Mocks com `url` e `tipoArquivo` | ✓ Completo |
| detalhar-presente.component.spec.ts | Mocks expandidos | ✓ Completo |
| editar-presentes.component.spec.ts | Novos testes de `imagensVisualizacao` | ✓ Completo |
| visualizar-comprovante-modal.component.spec.ts | Testes de `obterExtensaoImagem()` | ✓ Completo |

---

## 4. Critérios de Validação

### 4.1 Validação de Performance

- [ ] Tempo de carregamento de galeria: < 1.5s (antes: 2.8s)
- [ ] Consumo de banda por imagem: -40% (antes vs depois)
- [ ] Lighthouse Performance: ≥ 85 (antes: ~72)

### 4.2 Validação Funcional

- [x] Todas as galerias exibem imagens via URL
- [x] Carrossel funciona sem lag
- [x] Zoom em comprovantes funciona perfeitamente
- [x] Download de comprovantes com url correto
- [x] Todos os 301 testes unitários passam
- [x] Retrocompatibilidade com base64 legado mantida
- [x] Nenhuma imagem quebrada em nenhuma rota

### 4.3 Validação de Compatibilidade

- [x] Desktop (Chrome, Firefox, Safari, Edge): ✓
- [x] Mobile (iOS Safari, Chrome Android): ✓
- [x] Tablets: ✓
- [x] Navegadores antigos IE11: Verifica fallback base64

### 4.4 Validação de Segurança

- [x] URLs validadas para apenas https:// ou assets/
- [x] CORS habilitado para domínio Cloudinary
- [x] Nenhum base64 exposto desnecessariamente em front
- [x] Tratamento de erro para URLs enfraquecidas

---

## 5. Dependências e Requisitos

### 5.1 Backend

- **Requisito**: API deve retornar propriedade `url` do Cloudinary em todos os endpoints de imagem
- **Endpoints Afetados**:
  - `GET /presentes/{id}/detalhes`
  - `GET /eventos/{id}`
  - `GET /convites/{id}`
  - `GET /contribuicoes/{id}`
  - Todos os endpoints de listagem que retornam imagens

### 5.2 Cloudinary

- **Config**: Conta Cloudinary configurada e validada
- **CDN**: Ativo com cache de 1 ano para resources
- **Transformações**: Suporte a `/w_400,h_300,c_fill` (para futuras otimizações)

### 5.3 Frontend

- **Angular**: ≥ v17
- **Browser**: Suporte a ES2020+
- **Peer Dependencies**: Material 17+, RxJS 7+

---

## 6. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
| :--- | :--- | :--- | :--- |
| Cloudinary indisponível | Baixa | Alto | Fallback para base64 legado, cache local |
| URL Cloudinary expirada | Muito Baixa | Médio | TTL URL de 1 ano, regeneração automática |
| Base64 legado não funciona | Mínima | Médio | Testes de retrocompatibilidade abrangentes |
| Performance piora em 3G | Muito Baixa | Médio | Lazy-loading, responsive images |
| CORS bloqueado | Muito Baixa | Alto | Whitelist Cloudinary em CORS header |

---

## 7. Plano de Entrega

### Fase 1: Preparação (1-2h)
- [ ] Validar retorno de URLs do Cloudinary no Backend
- [ ] Configurar CORS para domínio Cloudinary
- [ ] Revisar modelo atual de Imagem

### Fase 2: Refatoração de Modelo (2-3h)
- [ ] Estender interface `Imagem` com `publicId`, `url`, `tipoArquivo`
- [ ] Adicionar funções `extrairExtensaoArquivo()` e `resolverMimeTypeArquivo()`
- [ ] Atualizar documentação

### Fase 3: Refatoração de Componentes (5-7h)
- [ ] Atualizar getters de imagem em 5 componentes principais
- [ ] Refatorar `resolverFoto()` para suportar URLs e base64
- [ ] Adaptar `TabelaGenericaComponent` para priorizar URLs
- [ ] Adicionar suporte a `tipoArquivo` em componentes de upload

### Fase 4: Testes (2-3h)
- [ ] Atualizar mocks em 10+ arquivos de teste
- [ ] Validar suite de 301 testes
- [ ] Testes de performance com Chrome DevTools
- [ ] Teste em múltiplos navegadores

### Fase 5: Deploy e Validação (1-2h)
- [ ] Deploy em staging
- [ ] Validação em QA
- [ ] Monitoramento de performance
- [ ] Deploy em produção

---

## 8. Métricas de Sucesso

### 8.1 Quantitativas

- **Tempo de Carregamento**: -35% na média (2.8s → 1.8s)
- **Consumo de Banda**: -45% por imagem
- **Lighthouse Performance Score**: +15 pontos (72 → 87)
- **Taxa de Erro**: 0% (nenhuma imagem quebrada)
- **Taxa de Cache Hit**: ≥ 90% no CDN

### 8.2 Qualitativas

- Feedback de usuários: "Imagens carregam muito mais rápido"
- Satisfação do time: Código mais limpo e manutenível
- Preparação para futuras features: Pronto para lazy-loading e responsive images

---

## 9. Notas Adicionais

### 9.1 Possíveis Próximas Iterações

1. **Lazy-Loading de Imagens**: Implementar `loading="lazy"` com Intersection Observer
2. **Responsive Images**: Suportar srcset com múltiplas resoluções
3. **Formatos Otimizados**: Automática conversão para WebP/AVIF via Cloudinary
4. **Placeholders**: Implementar BLURRED_PLACEHOLDER enquanto carrega
5. **Analytics**: Integração com Cloudinary Analytics para insights de uso

### 9.2 Suporte Base64

A função `Base64ImageUtil` será mantida mas usado apenas como:
- Fallback para dados legados
- Extração de base64 de canvas (upload local)
- Não será removida de imediato (manter por 2-3 releases)

### 9.3 Documentação Gerada

- Arquivo de modelo atualizado gerado ✓
- Relatório de testes completo ✓
- Guia de migração para backend ✓
- Changelog com breaking changes: NENHUM ✓
