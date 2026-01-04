# 🎯 GUIA DE PADRÕES ANGULAR 19 - PROJETO EVENTHUB

> **Objetivo:** Documento de referência para agente especialista Angular criar componentes, features e services seguindo os padrões arquiteturais estabelecidos no projeto Eventhub, eliminando repetição e acelerando desenvolvimento.

---

## 📋 ÍNDICE

1. [Estrutura de Pastas](#estrutura-de-pastas)
2. [Nomenclatura de Arquivos](#nomenclatura-de-arquivos)
3. [Nomenclatura de Classes e Variáveis](#nomenclatura-de-classes-e-variáveis)
4. [Herança e Componentes Base](#herança-e-componentes-base)
5. [Services](#services)
6. [Models](#models)
7. [Rotas](#rotas)
8. [Guards](#guards)
9. [Tratamento de Erros](#tratamento-de-erros)
10. [Sistema de Modais](#sistema-de-modais)
11. [Validação de Formulários](#validação-de-formulários)
12. [Theme e Estilos SCSS](#theme-e-estilos-scss)
13. [Loading e Máscaras](#loading-e-máscaras)
14. [Utils e Helpers](#utils-e-helpers)
15. [Melhorias Angular 19](#melhorias-angular-19)
16. [Checklist de Criação](#checklist-de-criação)
17. [Anti-Patterns](#anti-patterns)
18. [Setup Inicial do Projeto](#setup-inicial-do-projeto)

---

## 1. 📁 ESTRUTURA DE PASTAS

```
src/app/
├── core/                          # Funcionalidades centrais reutilizáveis
│   ├── components/                # Componentes compartilhados
│   │   ├── base.component.ts      # Classe base abstrata
│   │   ├── drop-zone-image/       # Upload de imagens
│   │   └── modal/                 # Modais (confirm, error, success)
│   ├── interceptors/              # HTTP interceptors
│   ├── models/                    # Interfaces e tipos
│   ├── services/                  # Serviços injetáveis
│   │   └── base.service.ts        # Serviço base
│   └── utils/                     # Utilitários
│       ├── guards/                # Route guards
│       ├── security/              # Criptografia
│       ├── theme/                 # SCSS variáveis e mixins
│       ├── validations/           # Validadores de formulários
│       └── enums/                 # Enumeradores
│
├── views/                         # Páginas e componentes de apresentação
│   ├── base/                      # Layout base da aplicação
│   │   ├── layout/                # Componente de layout principal
│   │   └── navegacao/             # Páginas de navegação
│   └── pages/                     # Páginas do sistema
│       ├── gestao-eventos/        # Módulo de eventos
│       ├── gestao-convidados/     # Módulo de convidados
│       ├── gestao-presentes/      # Módulo de presentes
│       └── gestao-usuarios/       # Módulo de usuários
│
└── assets/                        # Recursos estáticos
    ├── icones/
    └── imagens/
```

### 📌 Regras de Organização

- ✅ **core/**: Componentes, services, models e utils **REUTILIZÁVEIS**
- ✅ **views/pages/**: Componentes **ESPECÍFICOS** de cada módulo
- ✅ **Cada módulo** tem arquivo `nome-modulo.route.ts`
- ✅ **Subpastas** por funcionalidade (cadastro/, consulta/, etc)

---

## 2. 📝 NOMENCLATURA DE ARQUIVOS

### Padrão Geral: `kebab-case` + sufixo descritivo

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| **Componente** | `nome.component.ts` | `cadastrar-evento.component.ts` |
| **Template** | `nome.component.html` | `cadastrar-evento.component.html` |
| **Estilo** | `nome.component.scss` | `cadastrar-evento.component.scss` |
| **Teste** | `nome.component.spec.ts` | `cadastrar-evento.component.spec.ts` |
| **Service** | `nome.service.ts` | `evento.service.ts` |
| **Model** | `nome.model.ts` | `evento.model.ts` |
| **Guard** | `nome.guard.ts` | `auth.guard.ts` |
| **Interceptor** | `nome.interceptor.ts` | `error-interceptor.ts` |
| **Util** | `nome.util.ts` ou `nome.utils.ts` | `date.utils.ts` |
| **Enum** | `nome.enum.ts` | `status-evento.enum.ts` |
| **Route** | `nome-modulo.route.ts` | `gestao-eventos.route.ts` |

---

## 3. 👨‍💻 NOMENCLATURA DE CLASSES E VARIÁVEIS

### Classes: `PascalCase` + Sufixo

```typescript
// Componentes
export class MeusEventosComponent extends BaseComponent { }
export class CadastrarEventoComponent extends BaseComponent { }

// Services
export class EventoService extends BaseService { }
export class ModalService { }

// Models
export interface EventoDto { }
export interface CadastroEventoDto { }
export enum StatusEvento { }
```

### Variáveis e Propriedades: `camelCase`

```typescript
// Injeção de dependências (private readonly)
private readonly service = inject(EventoService);
private readonly spinner = inject(SpinnerService);
private readonly destroyRef = inject(DestroyRef);
private readonly fb = inject(FormBuilder);

// Propriedades públicas
form: FormGroup;
imagens: string[] = [];
organizadores: Participante[] = [];
etapa = 0;

// Signals (Angular 16+)
usuarioLogado = signal<UsuarioInfoDTO | null>(null);
eventosOriginais = signal<EventoUserDto[]>([]);
filtroBusca = signal('');
```

### Métodos: `camelCase` com verbo inicial

```typescript
ngOnInit(): void { }
ngAfterViewInit(): void { }
proximo(): void { }
salvarEvento(): void { }
buscarCep(): void { }
obterUsuarioLogado(): Promise<UsuarioInfoDTO | null> { }
carregarConvidados(eventoId: number): void { }

// Métodos privados
private emitChange(): void { }
private hasUnsavedChanges(): boolean { }
```

### @Input/@Output

```typescript
@Input() imagens: string[] = [];
@Output() imagensChange = new EventEmitter<string[]>(); // Sufixo 'Change' para two-way binding
```

### Constantes

```typescript
private readonly maxImagens = 10;
private salvou = false;
```

---

## 4. 🧬 HERANÇA E COMPONENTES BASE

### BaseComponent

**Localização:** `src/app/core/components/base.component.ts`

```typescript
export abstract class BaseComponent {
    displayMessage: DisplayMessage = {};
    genericValidator!: ValidadorGenerico;
    validationMessages!: ValidationMessages;
    protected dialog = inject(MatDialog);
    protected readonly userService = inject(UsuarioService);

    protected async obterUsuarioLogado(): Promise<UsuarioInfoDTO | null> {
        return await this.userService.obterUsuarioLogado();
    }

    protected configurarMensagensValidacaoBase(validationMessages: ValidationMessages) {
        this.genericValidator = new ValidadorGenerico(validationMessages);
    }

    protected configurarValidacaoFormularioBase(
        formInputElements: ElementRef[],
        formGroup: FormGroup
    ) {
        // Configura listeners de blur e change
        // Valida formulário automaticamente
    }

    protected validarFormulario(formGroup: FormGroup) {
        this.displayMessage = this.genericValidator.processarMensagens(formGroup);
    }
}
```

### ✅ Funcionalidades Fornecidas

- Acesso ao usuário logado via `obterUsuarioLogado()`
- Instância de `MatDialog` para abrir modais
- Sistema de validação de formulários genérico
- Mensagens de erro automáticas em campos

### Exemplo de Uso

```typescript
export class CadastrarEventoComponent extends BaseComponent implements OnInit, AfterViewInit {
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];
    form: FormGroup;

    constructor() {
        super();
        
        // 1. Definir mensagens de validação
        this.validationMessages = {
            nome: {
                required: 'Informe o Nome do Evento',
                minlength: 'O Nome deve ter pelo menos 3 caracteres'
            },
            email: {
                required: 'Informe o E-mail',
                email: 'E-mail inválido'
            }
        };
        
        // 2. Configurar validador
        this.configurarMensagensValidacaoBase(this.validationMessages);
    }

    ngAfterViewInit(): void {
        // 3. Configurar validação automática
        this.configurarValidacaoFormularioBase(this.formInputElements, this.form);
    }
}
```

---

## 5. 🔧 SERVICES

### BaseService

**Localização:** `src/app/core/services/base.service.ts`

```typescript
@Injectable({ providedIn: 'root' })
export class BaseService {
    protected readonly urlApi = environment.urlApi;
    protected readonly http = inject(HttpClient);
    protected readonly auth: Auth = inject(Auth);
    protected readonly firestore: Firestore = inject(Firestore);
    private readonly notification = inject(NotificationService);
    private readonly dialog = inject(MatDialog);

    protected handleError(err: unknown, customMessage?: string): never {
        let message = customMessage || 'Ocorreu um erro. Tente novamente.';
        // Mapeia erros do Firebase
        // Abre modal de erro
        throw err;
    }
}
```

### ✅ Padrão de Services Concretos

```typescript
@Injectable({ providedIn: 'root' })
export class EventoService extends BaseService {
    cadastro(evento: CadastroEventoDto): Observable<RetornoAPI<CadastroEventoDto[]>> {
        return this.http.post<RetornoAPI<CadastroEventoDto[]>>(`${this.urlApi}/eventos`, evento);
    }

    buscarMeusEventos(idUser: number): Observable<RetornoAPI<EventoUserDto[]>> {
        return this.http.get<RetornoAPI<EventoUserDto[]>>(`${this.urlApi}/eventos/usuario/${idUser}`);
    }

    buscarEventoPorId(idEvento: number): Observable<RetornoAPI<EventoDto>> {
        return this.http.get<RetornoAPI<EventoDto>>(`${this.urlApi}/eventos/${idEvento}`);
    }
}
```

### 📌 Regras

- ✅ **Herdar de `BaseService`**
- ✅ **Injeção** via `inject()` (não constructor)
- ✅ **Retorno** com `Observable<RetornoAPI<T>>`
- ✅ **Métodos** com nomes verbais descritivos
- ✅ **Tratamento de erro** delegado ao `handleError()`

---

## 6. 📦 MODELS

### Padrões de Nomenclatura

| Tipo | Sufixo | Exemplo |
|------|--------|---------|
| Interface de entidade | `Dto` | `EventoDto`, `UsuarioDto` |
| DTO de criação | `Dto` com prefixo | `CadastroEventoDto` |
| DTO de listagem | `Dto` com contexto | `EventoUserDto`, `ListarConvidadosDto` |
| Enum | Nenhum | `StatusEvento`, `TipoImagemEvento` |
| Response padrão | `Dto` | `RetornoAPI<T>` |

### Exemplos

```typescript
export interface RetornoAPI<T = any> {
    statusHttp: number;
    executouComSucesso: boolean;
    data: T;
    erros: string[];
}

export enum StatusEvento {
    Ativo = 1,
    Rascunho = 2,
    Finalizado = 3,
    Cancelado = 4
}

export interface CadastroEventoDto {
    nome: string;
    descricao?: string;
    idTipoEvento: number;
    idUsuarioCriador: number;
    maxConvidado: number;
    dataInicio: Date;
    dataFim: Date | null;
    endereco: EnderecoEventoDto;
    imagens: Imagem[];
    participantes: Participante[];
}
```

### 📌 Regras

- ✅ **Interfaces** para estruturas de dados
- ✅ **Enums** para valores fixos
- ✅ **Propriedades opcionais** com `?`
- ✅ **Datas** podem ser `Date | string` (flexibilidade Firebase/API)
- ✅ **IDs** podem ser `number` (API) ou `string` (Firestore)

---

## 7. 🛤️ ROTAS

### app.routes.ts (Raiz)

```typescript
export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'acesso-negado', component: AcessoNegadoComponent },
    {
        path: 'eventos',
        loadChildren: () => import('./views/pages/gestao-eventos/gestao-eventos.route')
            .then(m => m.routes)
    },
    {
        path: 'convidados',
        loadChildren: () => import('./views/pages/gestao-convidados/gestao-convidados.route')
            .then(m => m.routes)
    }
];
```

### gestao-eventos.route.ts (Módulo)

```typescript
export const routes = [
    { 
        path: 'meus-eventos', 
        component: MeusEventosComponent, 
        canActivate: [authGuard] 
    },
    { 
        path: 'cadastrar/:tipo', 
        component: CadastrarEventoComponent, 
        canDeactivate: [pendingChangesGuard], 
        canActivate: [authGuard] 
    },
    { 
        path: 'home/:id', 
        component: HomeEventoComponent, 
        canActivate: [authGuard] 
    }
];
```

### 📌 Regras

- ✅ **Lazy loading** com `loadChildren`
- ✅ **Paths** em kebab-case
- ✅ **Guards** aplicados com `canActivate` e `canDeactivate`
- ✅ **Parâmetros** com `:nomeParametro`

---

## 8. 🛡️ GUARDS

### authGuard

```typescript
export const authGuard: CanActivateFn = async () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const usuarioLogado = await authService.logado();
    
    if (usuarioLogado) return true;

    router.navigate(['/acesso-negado'], { 
        queryParams: { 
            descricao: 'Você precisa estar logado para acessar esta página.' 
        } 
    });
    return false;
};
```

### pendingChangesGuard

```typescript
export const pendingChangesGuard: CanDeactivateFn<{ canDeactivate?: () => boolean | any }> = (component) => {
    if (component && typeof component.canDeactivate === 'function') {
        return component.canDeactivate();
    }
    return true;
};
```

### Implementação no Componente

```typescript
export class CadastrarEventoComponent extends BaseComponent {
    private salvou = false;

    @HostListener('window:beforeunload', ['$event'])
    handleBeforeUnload(event: BeforeUnloadEvent) {
        if (this.hasUnsavedChanges()) {
            event.preventDefault();
            event.returnValue = '';
        }
    }

    canDeactivate(): boolean | Observable<boolean> {
        if (!this.hasUnsavedChanges()) return true;
        
        return this.dialog.open(ModalConfirmComponent, {
            data: {
                title: 'Sair sem salvar?',
                message: 'Você tem alterações não salvas. Deseja realmente sair?',
                cancelLabel: 'Continuar editando',
                confirmLabel: 'Sair'
            }
        }).afterClosed();
    }

    private hasUnsavedChanges(): boolean {
        const formDirty = this.form?.dirty;
        const hasOtherChanges = (this.imagens?.length ?? 0) > 0;
        return !this.salvou && (!!formDirty || hasOtherChanges);
    }
}
```

---

## 9. ⚠️ TRATAMENTO DE ERROS

### error-interceptor.ts

```typescript
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const modalService = inject(ModalService);
    const authService = inject(AuthService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            console.error('Erro no serviço:', error);

            switch (error.status) {
                case 401:
                    authService.refreshToken().subscribe();
                    break;
                case 403:
                    modalService.openAccessDeniedModal();
                    break;
                case 404:
                    modalService.openNotFoundModal(recurso);
                    break;
                case 424:
                    if (error.error?.erros) {
                        modalService.openServiceErrorModal(error.error.erros[0].mensagem);
                    }
                    break;
                default:
                    if (error.status >= 500) {
                        modalService.openErrorModal();
                    }
                    break;
            }

            return throwError(() => error);
        })
    );
};
```

### 📌 Mapeamento de Status

- **401**: Refresh token automático
- **403**: Modal de acesso negado
- **404**: Modal de recurso não encontrado
- **424**: Erros de negócio da API
- **5xx**: Modal genérico de erro

---

## 10. 🔲 SISTEMA DE MODAIS

### ModalService

```typescript
@Injectable({ providedIn: 'root' })
export class ModalService {
    private readonly dialog = inject(MatDialog);

    openErrorModal(data?: ModalErrorData): Observable<DialogResult> {
        return this.dialog.open(ModalErrorComponent, { data }).afterClosed();
    }

    openSuccessModal(data?: ModalSucessData): Observable<DialogResult> {
        return this.dialog.open(ModalSucessComponent, { data }).afterClosed();
    }

    openConfirmationModal(data?: ModalConfirmData): Observable<DialogResult> {
        return this.dialog.open(ModalConfirmComponent, { data }).afterClosed();
    }

    // Helpers especializados
    openOperationSuccessModal(message: string): Observable<DialogResult> {
        return this.openSuccessModal({ title: 'Operação Concluída!', message });
    }
}
```

### Uso nos Componentes

```typescript
// Confirmação
this.dialog.open(ModalConfirmComponent, {
    data: {
        title: 'Cancelar Cadastro',
        message: 'Todas as informações serão perdidas.',
        confirmLabel: 'Sim, cancelar',
        cancelLabel: 'Voltar'
    }
}).afterClosed().subscribe((confirmado: boolean) => {
    if (confirmado) {
        this.router.navigate(['/convidados', this.idEvento]);
    }
});

// Sucesso
this.dialog.open(ModalSucessComponent, {
    data: {
        title: 'Cadastro Realizado',
        message: 'O convidado foi adicionado com sucesso.'
    }
}).afterClosed().subscribe(() => {
    this.router.navigate(['/convidados', this.idEvento]);
});
```

---

## 11. ✅ VALIDAÇÃO DE FORMULÁRIOS

### Padrão Completo

```typescript
export class CadastroUsuarioComponent extends BaseComponent implements OnInit, AfterViewInit {
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];
    form: FormGroup;
    
    private readonly fb = inject(FormBuilder);

    constructor() {
        super();

        // 1. Definir mensagens de validação
        this.validationMessages = {
            nome: {
                required: 'Informe o Nome',
                minlength: 'O Nome deve ter pelo menos 3 caracteres'
            },
            email: {
                required: 'Informe o E-mail',
                email: 'E-mail inválido'
            },
            senha: {
                required: 'Informe a Senha',
                minlength: 'A Senha deve ter pelo menos 6 caracteres'
            },
            confirmarSenha: {
                required: 'Confirme a Senha',
                senhasDiferentes: 'As senhas não coincidem'
            },
            telefone: {
                required: 'Informe o Telefone',
                pattern: 'Telefone inválido'
            }
        };

        // 2. Configurar validador base
        this.configurarMensagensValidacaoBase(this.validationMessages);

        // 3. Criar formulário
        this.form = this.fb.group({
            nome: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            senha: ['', [Validators.required, Validators.minLength(6)]],
            confirmarSenha: ['', [Validators.required]],
            telefone: ['', [Validators.required]]
        });
    }

    ngAfterViewInit(): void {
        // 4. Configurar validação automática em blur/change
        this.configurarValidacaoFormularioBase(this.formInputElements, this.form);
    }
}
```

### Template HTML

```html
<mat-form-field appearance="outline">
    <mat-label>Nome</mat-label>
    <input matInput formControlName="nome" />
    <mat-error *ngIf="displayMessage.nome">
        <mat-icon>error</mat-icon> {{ displayMessage.nome }}
    </mat-error>
</mat-form-field>
```

---

## 12. 🎨 THEME E ESTILOS SCSS

### variables.scss

**Localização:** `src/app/core/utils/theme/variables.scss`

```scss
// Cores primárias
$cor-primaria: #f04299;
$cor-primaria-clara: #fde6f2;
$cor-primaria-escura: #d81b60;
$cor-secundaria: #ff4fa0;

// Cores de status
$cor-sucesso: #4caf50;
$cor-erro: #d32f2f;
$cor-atencao: #ff9800;

// Cores neutras
$cor-cinza-claro: #f8f3ef;
$cor-cinza-medio: #6e5f67;
$cor-branco: #fff;
$cor-texto: #333;

// Radius e espaçamentos
$radius: 12px;
$radius-card: 16px;
$radius-btn: 6px;
$gap: 18px;

// Fontes
$font-titulo: 1.8rem;
$font-titulo-mobile: 1.3rem;
$font-btn: 1rem;
$font-peso-bold: 700;

// Sombras
$sombra-card: 0 2px 16px 0 rgba($cor-primaria, 0.04);
$sombra-card-leve: 0 2px 8px rgba($cor-primaria, 0.08);

// Breakpoints
$break-mobile: 600px;
$break-tablet: 900px;
```

### mixins.scss

**Localização:** `src/app/core/utils/theme/mixins.scss`

```scss
@use 'variables' as *;

@mixin container($max-width: 1200px) {
    display: flex;
    flex-direction: column;
    max-width: $max-width;
    margin: auto;
    padding: 0 40px;

    @media (max-width: 600px) {
        padding: 0 15px;
    }
}

@mixin grid-columns($cols: 3, $gap: 20px) {
    display: grid;
    grid-template-columns: repeat($cols, 1fr);
    gap: $gap;

    @media (max-width: 900px) {
        grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: 600px) {
        grid-template-columns: 1fr;
    }
}

@mixin btn-primary {
    background: $cor-secundaria;
    color: $cor-branco;
    font-size: $font-btn;
    font-weight: $font-peso-bold;
    border-radius: $radius-btn;
    padding: 10px 22px;
    height: 55px;
    box-shadow: $sombra-card-leve;
    cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s;

    &:hover {
        background: darken($cor-secundaria, 8%);
        box-shadow: $sombra-card;
    }
}
```

### Uso em Componentes

```scss
@import '../../../../../../core/utils/theme/variables';
@import '../../../../../../core/utils/theme/mixins';

.container {
    @include container(1200px);
}

.grid-eventos {
    @include grid-columns(3, 24px);
}

.btn-cadastrar {
    @include btn-primary();
}
```

---

## 13. ⏳ LOADING E MÁSCARAS

### ngx-ui-loader (Spinner)

#### Configuração Global

**Localização:** `src/app/core/services/spinner.service.ts`

```typescript
export const ngxUiLoaderConfig: NgxUiLoaderConfig = {
    bgsColor: "#f04299",
    bgsOpacity: 0.6,
    bgsPosition: "bottom-right",
    bgsSize: 70,
    bgsType: "ball-spin-clockwise",
    blur: 15,
    fgsColor: "#f04299",
    fgsPosition: "center-center",
    fgsSize: 150,
    fgsType: "ball-scale-multiple",
    overlayColor: "rgba(40, 40, 40, 0.8)",
    pbColor: "#f04299",
    hasProgressBar: true,
    text: "CARREGANDO...",
    textColor: "#FFFFFF",
    minTime: 300
};

@Injectable({ providedIn: 'root' })
export class SpinnerService extends BaseService {
    private readonly service = inject(NgxUiLoaderService);

    show(): void {
        this.service.startLoader('loader-01');
    }

    hide(): void {
        this.service.stopLoader('loader-01');
    }
}
```

#### Uso em Componentes

```typescript
export class CadastrarEventoComponent extends BaseComponent {
    private readonly spinner = inject(SpinnerService);

    salvarEvento() {
        this.spinner.show();

        this.service.cadastro(dto)
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => this.spinner.hide())
            )
            .subscribe({
                next: (result) => {
                    // Sucesso
                },
                error: (err) => {
                    console.error('Erro:', err);
                }
            });
    }
}
```

### ngx-mask (Máscaras de Input)

#### Configuração Global

**Localização:** `src/app/app.config.ts`

```typescript
export const appConfig: ApplicationConfig = {
    providers: [
        provideEnvironmentNgxMask(),
        // ... outros providers
    ]
};
```

#### Uso em Componentes

```typescript
@Component({
    selector: 'app-cadastro-usuario',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgxMaskDirective
    ],
    providers: [provideNgxMask()] // Provider local
})
export class CadastroUsuarioComponent { }
```

#### No Template

```html
<!-- Telefone -->
<input matInput formControlName="telefone" 
       mask="(00) 0000-0000||(00) 00000-0000" 
       placeholder="(00) 00000-0000" />

<!-- CEP -->
<input matInput formControlName="cep" 
       mask="00000-000" 
       placeholder="00000-000" />

<!-- CPF -->
<input matInput formControlName="cpf" 
       mask="000.000.000-00" 
       placeholder="000.000.000-00" />

<!-- Valor Monetário (Padrão BR) -->
<input matInput 
       formControlName="valor" 
       placeholder="R$ 0,00" 
       type="text"
       mask="separator.2"
       thousandSeparator="."
       decimalMarker=","
       prefix="R$ " />
<!-- Resultado: R$ 5,00 ou R$ 1.500,00 ou R$ 10.000,00 -->

<!-- Data (Padrão BR) -->
<input matInput 
       formControlName="data" 
       placeholder="dd/MM/yyyy" 
       type="text"
       mask="d0/M0/0000" />
<!-- Resultado: 20/12/2025 -->
```

### 📌 Regras de Máscaras Brasileiras

#### Valor Monetário
- ✅ **Sempre usar** `mask="separator.2"` para valores monetários
- ✅ **Separador de milhar:** `.` (ponto)
- ✅ **Separador decimal:** `,` (vírgula)
- ✅ **Prefixo:** `R$ `
- ✅ **Casas decimais:** Sempre 2 casas (`.2`)
- ✅ **Exemplos válidos:** 
  - R$ 5,00
  - R$ 150,50
  - R$ 1.500,00
  - R$ 150.000,00

#### Data Brasileira
- ✅ **Formato padrão:** `dd/MM/yyyy`
- ✅ **Máscara:** `d0/M0/0000`
- ✅ **Exemplos válidos:** 
  - 01/01/2025
  - 20/12/2025
  - 31/12/2026

#### Telefone com Máscara Dinâmica
- ✅ **Fixo:** `(00) 0000-0000`
- ✅ **Celular:** `(00) 00000-0000`
- ✅ **Máscara combinada:** `(00) 0000-0000||(00) 00000-0000`
- ✅ **Troca automática:** Ao digitar o 9º dígito, muda para formato celular

#### Conversão de Valor Monetário

**Template → TypeScript:**
```typescript
// O ngx-mask retorna string formatada: "R$ 1.500,00"
// Para enviar à API, converta para number:

salvarPresente(): void {
    const valorFormatado = this.form.get('valor')?.value; // "R$ 1.500,00"
    const valorNumerico = this.converterMoedaBRParaNumber(valorFormatado);
    
    const dto = {
        ...this.form.value,
        valor: valorNumerico // 1500.00
    };
}

private converterMoedaBRParaNumber(valor: string): number {
    if (!valor) return 0;
    // Remove "R$", espaços, pontos e converte vírgula para ponto
    return parseFloat(
        valor.replace(/R\$\s?/g, '')
             .replace(/\./g, '')
             .replace(',', '.')
    ) || 0;
}
```

**TypeScript → Template:**
```typescript
// Da API vem number: 1500.00
// Para exibir no input, converta para string formatada:

ngOnInit(): void {
    this.carregarPresente();
}

carregarPresente(): void {
    this.presenteService.buscarPorId(this.id).subscribe(presente => {
        this.form.patchValue({
            nome: presente.nome,
            valor: this.formatarNumberParaMoedaBR(presente.valor) // "R$ 1.500,00"
        });
    });
}

private formatarNumberParaMoedaBR(valor: number): string {
    if (!valor) return '';
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}
```

#### Conversão de Data Brasileira

**Template → TypeScript:**
```typescript
// O ngx-mask retorna string: "20/12/2025"
// Para enviar à API, converta para Date ou ISO string:

salvarEvento(): void {
    const dataFormatada = this.form.get('dataEvento')?.value; // "20/12/2025"
    const dataDate = this.converterDataBRParaDate(dataFormatada);
    
    const dto = {
        ...this.form.value,
        dataEvento: dataDate // Date object ou ISO string
    };
}

private converterDataBRParaDate(dataBR: string): Date | null {
    if (!dataBR) return null;
    const [dia, mes, ano] = dataBR.split('/');
    return new Date(Number(ano), Number(mes) - 1, Number(dia));
}
```

**TypeScript → Template:**
```typescript
// Da API vem Date ou ISO string
// Para exibir no input, converta para string DD/MM/YYYY:

carregarEvento(): void {
    this.eventoService.buscarPorId(this.id).subscribe(evento => {
        this.form.patchValue({
            nome: evento.nome,
            dataEvento: this.formatarDateParaBR(evento.dataEvento) // "20/12/2025"
        });
    });
}

private formatarDateParaBR(data: Date | string | null): string {
    if (!data) return '';
    const d = new Date(data);
    const dia = d.getDate().toString().padStart(2, '0');
    const mes = (d.getMonth() + 1).toString().padStart(2, '0');
    const ano = d.getFullYear();
    return `${dia}/${mes}/${ano}`;
}
```

---

## 14. 🔧 UTILS E HELPERS

### DateUtils

```typescript
export class DateUtils {
    static toDate(data: any): Date | null {
        if (!data) return null;
        if (data.seconds) return new Date(data.seconds * 1000); // Firestore
        if (data instanceof Date) return data;
        if (typeof data === 'string') return new Date(data);
        return null;
    }

    static formatarDataExtenso(data: any): string {
        const meses = ['Janeiro', 'Fevereiro', ...];
        const d = DateUtils.toDate(data);
        if (!d) return '';
        return `${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
    }

    static combineDateAndTime(date: Date | string | null, time: string | null): Date | null {
        if (!date) return null;
        const result = new Date(date);
        if (time) {
            const [hours, minutes] = time.split(':');
            result.setHours(Number(hours) || 0, Number(minutes) || 0, 0, 0);
        }
        return result;
    }
}
```

### Base64ImageUtil

```typescript
export class Base64ImageUtil {
    static extractBase64(dataUrl: string): string {
        const idx = dataUrl.indexOf('base64,');
        return idx !== -1 ? dataUrl.substring(idx + 7) : dataUrl;
    }

    static resolveImageSource(imageSrc: string | null | undefined): string {
        if (!imageSrc) return '';
        if (imageSrc.startsWith('data:')) return imageSrc;
        if (/^https?:\/\//i.test(imageSrc)) return imageSrc;
        return `data:image/jpeg;base64,${imageSrc}`;
    }
}
```

### EncryptPassword (Criptografia de Senhas)

**Localização:** `src/app/core/utils/security/encrypt-password.ts`

```typescript
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../../environments/environment';

export class EncryptPassword {
  private static key = CryptoJS.enc.Utf8.parse(environment.encryptionKey);
  private static iv = CryptoJS.enc.Utf8.parse(environment.encryptionIv);

  /**
   * Criptografa uma senha usando AES-128-CBC
   * @param password Senha em texto plano
   * @returns Senha criptografada em Base64
   */
  static encryptPassword(password: string): string {
    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(password),
      this.key,
      {
        keySize: 128 / 8,
        iv: this.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
  }

  /**
   * Descriptografa uma senha criptografada em Base64
   * @param encryptedPassword Senha criptografada
   * @returns Senha em texto plano
   */
  static decryptPassword(encryptedPassword: string): string {
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(encryptedPassword)
    });

    const decrypted = CryptoJS.AES.decrypt(
      cipherParams,
      this.key,
      {
        keySize: 128 / 8,
        iv: this.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
```

#### Configuração do Environment

**`src/environments/environment.ts`**
```typescript
export const environment = {
  production: false,
  encryptionKey: '1234567890123456', // 16 caracteres (128 bits)
  encryptionIv: '1234567890123456',  // 16 caracteres (128 bits)
  apiUrl: 'http://localhost:3000/api'
};
```

**`src/environments/environment.prod.ts`**
```typescript
export const environment = {
  production: true,
  encryptionKey: 'SUA_CHAVE_SECRETA_PRODUCAO_16_CHARS',
  encryptionIv: 'SEU_IV_SECRETO_PRODUCAO_16_CHARS',
  apiUrl: 'https://api.eventhub.com.br/api'
};
```

⚠️ **IMPORTANTE:** Nunca commite as chaves reais no repositório! Use variáveis de ambiente.

#### Instalação da Dependência

```bash
npm install crypto-js
npm install --save-dev @types/crypto-js
```

#### Uso em Componentes

**Cadastro de Usuário:**
```typescript
import { EncryptPassword } from '../../../../core/utils/security/encrypt-password';

export class CadastroUsuarioComponent extends BaseComponent {
    
    cadastrar(): void {
        const senhaPlano = this.form.get('senha')?.value;
        const senhaCriptografada = EncryptPassword.encryptPassword(senhaPlano);
        
        const dto: CadastroUsuarioDto = {
            ...this.form.value,
            senha: senhaCriptografada // Envia criptografada para API
        };
        
        this.usuarioService.cadastrar(dto)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.dialog.open(ModalSucessComponent, {
                        data: { mensagem: 'Usuário cadastrado com sucesso!' }
                    });
                }
            });
    }
}
```

**Login (se necessário descriptografar):**
```typescript
// Geralmente login envia senha criptografada e API compara
login(): void {
    const senha = this.form.get('senha')?.value;
    const senhaCriptografada = EncryptPassword.encryptPassword(senha);
    
    this.authService.login({
        email: this.form.get('email')?.value,
        senha: senhaCriptografada
    }).subscribe();
}

// Descriptografia (uso raro no frontend)
recuperarSenha(): void {
    const senhaCriptografada = 'base64_encrypted_string';
    const senhaOriginal = EncryptPassword.decryptPassword(senhaCriptografada);
    console.log(senhaOriginal); // Apenas para debug, NUNCA em produção
}
```

#### 📌 Boas Práticas de Segurança

✅ **Sempre criptografe** senhas antes de enviar à API  
✅ **Use HTTPS** em produção (TLS)  
✅ **Chaves no environment** nunca no código  
✅ **Chaves diferentes** para dev/prod  
✅ **16 caracteres** para AES-128 (128 bits)  
✅ **Nunca logue** senhas descriptografadas  

❌ **Nunca** commite chaves reais no Git  
❌ **Nunca** armazene senhas em localStorage sem criptografia  
❌ **Nunca** envie senhas em query params  
❌ **Nunca** exponha senhas descriptografadas no console  

---

## 15. 🚀 MELHORIAS ANGULAR 19

### 1. Nova Sintaxe de Controle de Fluxo

❌ **Evitar (Sintaxe Antiga)**
```html
<div *ngIf="eventos.length > 0; else semEventos">
    <div *ngFor="let evento of eventos">
        {{ evento.nome }}
    </div>
</div>
<ng-template #semEventos>
    <p>Nenhum evento encontrado</p>
</ng-template>
```

✅ **Usar (Angular 19)**
```html
@if (eventos.length > 0) {
    @for (evento of eventos; track evento.id) {
        <div>{{ evento.nome }}</div>
    }
} @else {
    <p>Nenhum evento encontrado</p>
}
```

### 2. Input/Output Signals

❌ **Evitar (Decorators)**
```typescript
@Input() imagens: string[] = [];
@Output() imagensChange = new EventEmitter<string[]>();
```

✅ **Usar (Angular 19)**
```typescript
imagens = input<string[]>([]);
imagensChange = output<string[]>();

// Emitir
this.imagensChange.emit(newImages);
```

### 3. Defer (Lazy Loading de Views)

✅ **Usar para Componentes Pesados**
```html
@defer (on viewport) {
    <app-grafico-complexo [dados]="dados" />
} @placeholder {
    <div class="skeleton-loader"></div>
} @loading (minimum 500ms) {
    <mat-spinner></mat-spinner>
}
```

### 4. Effect() para Side Effects

✅ **Usar com Signals**
```typescript
filtroBusca = signal('');
eventos = signal<Evento[]>([]);

constructor() {
    // Reage automaticamente a mudanças
    effect(() => {
        const termo = this.filtroBusca();
        console.log('Filtro alterado:', termo);
        this.filtrarEventos(termo);
    });
}
```

### 5. Computed Signals

✅ **Usar para Valores Derivados**
```typescript
eventosOriginais = signal<Evento[]>([]);
filtroBusca = signal('');
filtroStatus = signal('');

eventosFiltrados = computed(() => {
    const termo = this.filtroBusca().toLowerCase();
    const status = this.filtroStatus();
    
    return this.eventosOriginais().filter(ev => {
        const matchNome = ev.nome.toLowerCase().includes(termo);
        const matchStatus = !status || ev.status === status;
        return matchNome && matchStatus;
    });
});
```

---

## 16. ✅ CHECKLIST DE CRIAÇÃO

### 🎯 Criar Novo Componente de Página

- [ ] Definir pasta correta em `views/pages/[modulo]/[funcionalidade]/`
- [ ] Gerar componente: `ng g c views/pages/[modulo]/[funcionalidade]/[nome-componente]`
- [ ] Herdar de `BaseComponent`
- [ ] Importar módulos necessários: `CommonModule`, `ReactiveFormsModule`, `MatModule`
- [ ] Se usa formulário:
  - [ ] Adicionar `@ViewChildren(FormControlName, { read: ElementRef }) formInputElements!`
  - [ ] Criar `form: FormGroup`
  - [ ] Definir `validationMessages` no constructor
  - [ ] Chamar `configurarMensagensValidacaoBase(this.validationMessages)`
  - [ ] Chamar `configurarValidacaoFormularioBase()` no `ngAfterViewInit`
- [ ] Se usa máscaras:
  - [ ] Importar `NgxMaskDirective`
  - [ ] Adicionar `providers: [provideNgxMask()]`
- [ ] Injetar services via `inject()`:
  - [ ] `private readonly service = inject(XxxService)`
  - [ ] `private readonly spinner = inject(SpinnerService)`
  - [ ] `private readonly destroyRef = inject(DestroyRef)`
- [ ] Adicionar rota em `[modulo].route.ts`
- [ ] Se rota precisa autenticação: `canActivate: [authGuard]`
- [ ] Se formulário com mudanças não salvas: `canDeactivate: [pendingChangesGuard]`

### 🎯 Criar Novo Service

- [ ] Definir em `core/services/[nome].service.ts`
- [ ] Herdar de `BaseService`
- [ ] Adicionar `@Injectable({ providedIn: 'root' })`
- [ ] Métodos retornam `Observable<RetornoAPI<T>>`
- [ ] Usar `this.urlApi` para endpoints
- [ ] Usar `this.http` para chamadas HTTP
- [ ] Tratar erros com `this.handleError()`

### 🎯 Criar Novo Model

- [ ] Definir em `core/models/[nome].model.ts`
- [ ] Usar `interface` para estruturas de dados
- [ ] Usar `enum` para valores fixos
- [ ] Sufixo `Dto` para DTOs
- [ ] Propriedades opcionais com `?`
- [ ] Exportar todas as interfaces/enums

### 🎯 Adicionar Loading em Operação

- [ ] Injetar `private readonly spinner = inject(SpinnerService)`
- [ ] Chamar `this.spinner.show()` antes da operação
- [ ] Usar `finalize(() => this.spinner.hide())` no pipe do Observable

### 🎯 Adicionar Modal de Confirmação

- [ ] Usar `this.dialog.open(ModalConfirmComponent, { data: {...} })`
- [ ] Subscrever em `.afterClosed()`
- [ ] Verificar resultado boolean para confirmar ação

---

## 17. 🚫 ANTI-PATTERNS

### ❌ Evitar: Uso de `any`

```typescript
// ❌ ERRADO
getData(): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/data`);
}

// ✅ CORRETO
getData(): Observable<RetornoAPI<DataDto>> {
    return this.http.get<RetornoAPI<DataDto>>(`${this.urlApi}/data`);
}
```

### ❌ Evitar: Subscribe sem Unsubscribe

```typescript
// ❌ ERRADO
ngOnInit() {
    this.service.getData().subscribe(data => {
        this.data = data;
    });
}

// ✅ CORRETO
private readonly destroyRef = inject(DestroyRef);

ngOnInit() {
    this.service.getData()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(data => {
            this.data = data;
        });
}
```

### ❌ Evitar: Mutação Direta de Arrays

```typescript
// ❌ ERRADO
this.imagens.push(novaImagem);

// ✅ CORRETO
this.imagens = [...this.imagens, novaImagem];
```

### ❌ Evitar: Constructor com Lógica

```typescript
// ❌ ERRADO
constructor(private service: Service) {
    this.service.loadData().subscribe(...);
}

// ✅ CORRETO
private readonly service = inject(Service);

ngOnInit() {
    this.service.loadData().subscribe(...);
}
```

### ❌ Evitar: console.log em Produção

```typescript
// ❌ ERRADO
subscribe({
    next: (data) => {
        console.log('Data:', data);
    }
});

// ✅ CORRETO
subscribe({
    next: (data) => {
        // Processar dados
    },
    error: (err) => {
        console.error('Erro ao carregar dados:', err);
    }
});
```

### ❌ Evitar: Nested Subscribes

```typescript
// ❌ ERRADO
this.service1.getData().subscribe(data1 => {
    this.service2.getData(data1.id).subscribe(data2 => {
        // ...
    });
});

// ✅ CORRETO
this.service1.getData().pipe(
    switchMap(data1 => this.service2.getData(data1.id)),
    takeUntilDestroyed(this.destroyRef)
).subscribe(data2 => {
    // ...
});
```

### ❌ Evitar: FormGroup sem Tipagem

```typescript
// ❌ ERRADO
form: any;

// ✅ CORRETO
form: FormGroup;
```

### ❌ Evitar: Lógica no Template

```html
<!-- ❌ ERRADO -->
<div *ngIf="usuarios.filter(u => u.ativo).length > 0">
    ...
</div>

<!-- ✅ CORRETO -->
<div *ngIf="usuariosAtivos.length > 0">
    ...
</div>
```

```typescript
// No componente
get usuariosAtivos() {
    return this.usuarios.filter(u => u.ativo);
}

// OU MELHOR: usar computed signal
usuariosAtivos = computed(() => 
    this.usuarios().filter(u => u.ativo)
);
```

---

## 18. 🏗️ SETUP INICIAL DO PROJETO

Este guia contém todos os comandos e códigos necessários para criar a estrutura base do projeto Eventhub do zero.

### 🚀 Comando Rápido (Script Consolidado)

Adicione ao `package.json`:

```json
{
  "scripts": {
    "scaffold:base": "npm run scaffold:folders && npm run scaffold:core",
    "scaffold:folders": "node -e \"const fs = require('fs'); const dirs = ['src/app/core/components', 'src/app/core/interceptors', 'src/app/core/models', 'src/app/core/services', 'src/app/core/utils/guards', 'src/app/core/utils/security', 'src/app/core/utils/theme', 'src/app/core/utils/validations', 'src/app/core/utils/enums', 'src/app/views/base/layout', 'src/app/views/pages']; dirs.forEach(d => fs.mkdirSync(d, {recursive: true}));\"",
    "scaffold:core": "echo \"Estrutura de pastas criada! Agora adicione os arquivos base manualmente.\""
  }
}
```

Execute:
```bash
npm run scaffold:base
```

---

### 📂 Passo 1: Criar Estrutura de Pastas

```bash
# Windows (PowerShell)
New-Item -ItemType Directory -Force -Path src/app/core/components
New-Item -ItemType Directory -Force -Path src/app/core/interceptors
New-Item -ItemType Directory -Force -Path src/app/core/models
New-Item -ItemType Directory -Force -Path src/app/core/services
New-Item -ItemType Directory -Force -Path src/app/core/utils/guards
New-Item -ItemType Directory -Force -Path src/app/core/utils/security
New-Item -ItemType Directory -Force -Path src/app/core/utils/theme
New-Item -ItemType Directory -Force -Path src/app/core/utils/validations
New-Item -ItemType Directory -Force -Path src/app/core/utils/enums
New-Item -ItemType Directory -Force -Path src/app/views/base/layout
New-Item -ItemType Directory -Force -Path src/app/views/pages

# Linux/Mac
mkdir -p src/app/core/{components,interceptors,models,services,utils/{guards,security,theme,validations,enums}}
mkdir -p src/app/views/{base/layout,pages}
```

---

### 📝 Passo 2: Criar BaseComponent

**Arquivo:** `src/app/core/components/base.component.ts`

```typescript
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GenericValidator, ValidationMessages } from '../utils/validations/generic-form.validator';
import { UsuarioInfoDTO } from '../models/usuario.model';
import { AuthService } from '../services/auth.service';

export abstract class BaseComponent {
  protected readonly dialog = inject(MatDialog);
  private readonly authService = inject(AuthService);

  public validationMessages!: ValidationMessages;
  public genericValidator!: GenericValidator;
  public displayMessage: { [key: string]: string } = {};

  /**
   * Obtém o usuário logado do AuthService
   */
  protected async obterUsuarioLogado(): Promise<UsuarioInfoDTO | null> {
    return await this.authService.obterUsuarioLogado();
  }

  /**
   * Configura mensagens de validação base
   */
  protected configurarMensagensValidacaoBase(validationMessages: ValidationMessages): void {
    this.validationMessages = validationMessages;
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  /**
   * Configura validação automática do formulário
   */
  protected configurarValidacaoFormularioBase(
    formInputElements: ElementRef[],
    formGroup: FormGroup
  ): void {
    this.genericValidator.configurarValidacaoFormulario(
      formGroup,
      formInputElements,
      (displayMessage) => {
        this.displayMessage = displayMessage;
      }
    );
  }
}
```

---

### 📝 Passo 3: Criar BaseService

**Arquivo:** `src/app/core/services/base.service.ts`

```typescript
import { inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export abstract class BaseService {
  protected readonly http = inject(HttpClient);
  protected readonly urlApi = environment.apiUrl;

  /**
   * Trata erros de requisições HTTP
   */
  protected handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro desconhecido';
    
    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do lado do servidor
      errorMessage = `Código: ${error.status}\nMensagem: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => error);
  }
}
```

---

### 📝 Passo 4: Criar Utils Essenciais

#### 4.1 DateUtils

**Arquivo:** `src/app/core/utils/date.utils.ts`

```typescript
export class DateUtils {
  /**
   * Converte Timestamp, Date ou string para Date
   */
  static toDate(data: any): Date | null {
    if (!data) return null;
    if (data.seconds) return new Date(data.seconds * 1000);
    if (data instanceof Date) return data;
    if (typeof data === 'string') return new Date(data);
    return null;
  }

  /**
   * Formata data para formato extenso brasileiro
   * @returns "20 de Dezembro de 2025"
   */
  static formatarDataExtenso(data: any): string {
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    const d = DateUtils.toDate(data);
    if (!d) return '';
    const dia = d.getDate().toString().padStart(2, '0');
    const mes = meses[d.getMonth()];
    const ano = d.getFullYear();
    return `${dia} de ${mes} de ${ano}`;
  }

  /**
   * Formata data para padrão brasileiro
   * @returns "20/12/2025"
   */
  static formatarDataBR(data: any): string {
    const d = DateUtils.toDate(data);
    if (!d) return '';
    const dia = d.getDate().toString().padStart(2, '0');
    const mes = (d.getMonth() + 1).toString().padStart(2, '0');
    const ano = d.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  /**
   * Formata hora no padrão brasileiro
   * @returns "14:30"
   */
  static formatarHora(data: any): string {
    const d = DateUtils.toDate(data);
    if (!d) return '';
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  /**
   * Combina data e hora em um único Date
   */
  static combineDateAndTime(date: Date | string | null, time: string | null): Date | null {
    if (!date) return null;
    const result = new Date(date);
    if (time) {
      const [hours, minutes] = time.split(':');
      result.setHours(Number(hours) || 0, Number(minutes) || 0, 0, 0);
    } else {
      result.setHours(0, 0, 0, 0);
    }
    return result;
  }

  /**
   * Converte string DD/MM/YYYY para Date
   */
  static converterDataBRParaDate(dataBR: string): Date | null {
    if (!dataBR) return null;
    const [dia, mes, ano] = dataBR.split('/');
    return new Date(Number(ano), Number(mes) - 1, Number(dia));
  }
}
```

#### 4.2 Base64ImageUtil

**Arquivo:** `src/app/core/utils/base64-image.util.ts`

```typescript
export class Base64ImageUtil {
  /**
   * Remove o prefixo data:image/...;base64, de uma string base64
   */
  static extractBase64(dataUrl: string): string {
    if (!dataUrl) return '';
    const idx = dataUrl.indexOf('base64,');
    return idx !== -1 ? dataUrl.substring(idx + 7) : dataUrl;
  }

  /**
   * Adiciona prefixo data:image ao base64 puro
   */
  static toDataUrl(base64: string, mimeType = 'image/jpeg'): string {
    return `data:${mimeType};base64,${base64}`;
  }

  /**
   * Resolve source de imagem (base64, URL remota ou data URL)
   */
  static resolveImageSource(imageSrc: string | null | undefined, mimeType = 'image/jpeg'): string {
    if (!imageSrc) return '';
    const trimmed = imageSrc.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('data:')) return trimmed;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    if (trimmed.startsWith('assets/')) return trimmed;
    return this.toDataUrl(trimmed, mimeType);
  }

  /**
   * Converte URL de imagem para base64 puro
   */
  static async getBackgroundBase64(imageSrc: string | null | undefined): Promise<string> {
    if (!imageSrc) return '';
    if (imageSrc.startsWith('data:')) return this.extractBase64(imageSrc);

    try {
      const response = await fetch(imageSrc);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      const dataUrl = await this.blobToDataUrl(blob);
      return this.extractBase64(dataUrl);
    } catch (error) {
      console.error('Erro ao converter imagem:', error);
      return '';
    }
  }

  private static blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  }
}
```

#### 4.3 EncryptPassword

**Arquivo:** `src/app/core/utils/security/encrypt-password.ts`

```typescript
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../../environments/environment';

export class EncryptPassword {
  private static key = CryptoJS.enc.Utf8.parse(environment.encryptionKey);
  private static iv = CryptoJS.enc.Utf8.parse(environment.encryptionIv);

  static encryptPassword(password: string): string {
    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(password),
      this.key,
      {
        keySize: 128 / 8,
        iv: this.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
  }

  static decryptPassword(encryptedPassword: string): string {
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(encryptedPassword)
    });
    const decrypted = CryptoJS.AES.decrypt(cipherParams, this.key, {
      keySize: 128 / 8,
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
```

---

### 📝 Passo 5: Criar Theme SCSS

#### 5.1 Variables

**Arquivo:** `src/app/core/utils/theme/variables.scss`

```scss
// Cores primárias
$cor-primaria: #f04299;
$cor-primaria-clara: #fde6f2;
$cor-primaria-escura: #d81b60;
$cor-secundaria: #ff4fa0;

// Cores de status
$cor-sucesso: #4caf50;
$cor-erro: #d32f2f;
$cor-atencao: #ff9800;
$cor-info: #2196f3;

// Cores neutras
$cor-cinza-claro: #f8f3ef;
$cor-cinza-medio: #6e5f67;
$cor-cinza-escuro: #333;
$cor-branco: #fff;
$cor-preto: #000;
$cor-texto: #333;
$cor-texto-secundario: #666;

// Bordas e raios
$radius: 12px;
$radius-card: 16px;
$radius-btn: 6px;
$radius-input: 8px;

// Espaçamentos
$gap: 18px;
$gap-sm: 12px;
$gap-lg: 24px;
$padding: 20px;
$padding-sm: 12px;
$padding-lg: 32px;

// Fontes
$font-titulo: 1.8rem;
$font-titulo-mobile: 1.3rem;
$font-subtitulo: 1.2rem;
$font-body: 1rem;
$font-btn: 1rem;
$font-small: 0.875rem;
$font-peso-light: 300;
$font-peso-normal: 400;
$font-peso-medium: 500;
$font-peso-bold: 700;

// Sombras
$sombra-card: 0 2px 16px 0 rgba($cor-primaria, 0.04);
$sombra-card-leve: 0 2px 8px rgba($cor-primaria, 0.08);
$sombra-card-hover: 0 4px 20px rgba($cor-primaria, 0.12);
$sombra-btn: 0 2px 8px rgba($cor-primaria, 0.2);

// Breakpoints
$break-mobile: 600px;
$break-tablet: 900px;
$break-desktop: 1200px;

// Transições
$transition-fast: 0.2s ease;
$transition-normal: 0.3s ease;
$transition-slow: 0.5s ease;
```

#### 5.2 Mixins

**Arquivo:** `src/app/core/utils/theme/mixins.scss`

```scss
@use 'variables' as *;

// Container responsivo
@mixin container($max-width: 1200px) {
  width: 100%;
  max-width: $max-width;
  margin: 0 auto;
  padding: 0 $padding;
  
  @media (max-width: $break-mobile) {
    padding: 0 $padding-sm;
  }
}

// Grid de colunas
@mixin grid-columns($cols: 3, $gap: $gap) {
  display: grid;
  grid-template-columns: repeat($cols, 1fr);
  gap: $gap;
  
  @media (max-width: $break-tablet) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: $break-mobile) {
    grid-template-columns: 1fr;
  }
}

// Botão primário
@mixin btn-primary {
  background: $cor-primaria;
  color: $cor-branco;
  border: none;
  border-radius: $radius-btn;
  padding: 12px 24px;
  font-size: $font-btn;
  font-weight: $font-peso-medium;
  cursor: pointer;
  transition: all $transition-fast;
  box-shadow: $sombra-btn;
  
  &:hover:not(:disabled) {
    background: $cor-primaria-escura;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba($cor-primaria, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

// Botão secundário
@mixin btn-secondary {
  background: transparent;
  color: $cor-primaria;
  border: 2px solid $cor-primaria;
  border-radius: $radius-btn;
  padding: 12px 24px;
  font-size: $font-btn;
  font-weight: $font-peso-medium;
  cursor: pointer;
  transition: all $transition-fast;
  
  &:hover:not(:disabled) {
    background: $cor-primaria-clara;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

// Card padrão
@mixin card {
  background: $cor-branco;
  border-radius: $radius-card;
  box-shadow: $sombra-card;
  padding: $padding;
  transition: box-shadow $transition-normal;
  
  &:hover {
    box-shadow: $sombra-card-hover;
  }
}

// Flexbox centralizado
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

// Truncate text
@mixin truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

// Clamp lines
@mixin line-clamp($lines: 2) {
  display: -webkit-box;
  -webkit-line-clamp: $lines;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

---

### 📝 Passo 6: Criar Guards

#### 6.1 authGuard

**Arquivo:** `src/app/core/utils/guards/auth.guard.ts`

```typescript
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const usuario = await authService.obterUsuarioLogado();
  
  if (usuario) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
```

#### 6.2 pendingChangesGuard

**Arquivo:** `src/app/core/utils/guards/pending-changes.guard.ts`

```typescript
import { CanDeactivateFn } from '@angular/router';

export interface ComponentCanDeactivate {
  canDeactivate?: () => boolean | Promise<boolean>;
}

export const pendingChangesGuard: CanDeactivateFn<ComponentCanDeactivate> = (component) => {
  if (component.canDeactivate && !component.canDeactivate()) {
    return confirm('Você tem alterações não salvas. Deseja realmente sair?');
  }
  return true;
};
```

---

### 📝 Passo 7: Criar Models Base

**Arquivo:** `src/app/core/models/retorno-api.model.ts`

```typescript
export interface RetornoAPI<T = any> {
  sucesso: boolean;
  mensagem: string;
  dados?: T;
  erros?: string[];
}
```

**Arquivo:** `src/app/core/models/usuario.model.ts`

```typescript
export interface UsuarioDto {
  id: number | string;
  nome: string;
  email: string;
  telefone?: string;
  dataCriacao?: Date | string;
}

export interface UsuarioInfoDTO {
  id: number | string;
  nome: string;
  email: string;
  perfil?: string;
}

export interface CadastroUsuarioDto {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
}
```

---

### 📝 Passo 8: Instalar Dependências

```bash
# Angular Material
ng add @angular/material

# Máscaras de input
npm install ngx-mask

# Spinner de loading
npm install ngx-ui-loader

# Criptografia
npm install crypto-js
npm install --save-dev @types/crypto-js
```

---

### 📝 Passo 9: Configurar Environment

**`src/environments/environment.ts`**

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  encryptionKey: '1234567890123456', // ALTERE EM PRODUÇÃO
  encryptionIv: '1234567890123456'   // ALTERE EM PRODUÇÃO
};
```

**`src/environments/environment.prod.ts`**

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.eventhub.com.br/api',
  encryptionKey: process.env['ENCRYPTION_KEY'] || '',
  encryptionIv: process.env['ENCRYPTION_IV'] || ''
};
```

⚠️ **IMPORTANTE:** Em produção, use variáveis de ambiente do servidor, nunca commite chaves reais!

---

### ✅ Checklist de Verificação

Após executar todos os passos, verifique:

- [ ] Estrutura de pastas `core/` e `views/` criada
- [ ] `BaseComponent` implementado com validação de formulários
- [ ] `BaseService` implementado com tratamento de erros
- [ ] `DateUtils` com métodos de formatação BR
- [ ] `Base64ImageUtil` com conversão de imagens
- [ ] `EncryptPassword` com AES-128-CBC configurado
- [ ] `variables.scss` com cores e medidas do projeto
- [ ] `mixins.scss` com mixins reutilizáveis
- [ ] `authGuard` protegendo rotas
- [ ] `pendingChangesGuard` alertando sobre mudanças não salvas
- [ ] Models base criados (RetornoAPI, Usuario)
- [ ] Dependências instaladas (ngx-mask, ngx-ui-loader, crypto-js)
- [ ] Environments configurados com chaves
- [ ] Angular Material adicionado e tema configurado
- [ ] Projeto compilando sem erros (`ng build`)

🎉 **Estrutura base pronta! Agora você pode começar a criar componentes usando os padrões estabelecidos.**

---

## 🎓 RESUMO EXECUTIVO

### Sempre Fazer

✅ Herdar de `BaseComponent` para componentes de página  
✅ Herdar de `BaseService` para services  
✅ Usar `inject()` ao invés de constructor injection  
✅ Usar `takeUntilDestroyed(this.destroyRef)` em subscribes  
✅ Usar `finalize()` para `spinner.hide()`  
✅ Tipar retorno de services com `Observable<RetornoAPI<T>>`  
✅ Usar signals para estado reativo  
✅ Usar computed signals para valores derivados  
✅ Aplicar `authGuard` em rotas protegidas  
✅ Aplicar `pendingChangesGuard` em formulários  
✅ Importar `variables` e `mixins` em SCSS  
✅ Usar `ngx-mask` para inputs formatados  
✅ Usar `SpinnerService` para operações assíncronas  

### Nunca Fazer

❌ Usar `any` sem necessidade  
❌ Subscribe sem unsubscribe  
❌ Mutar arrays/objetos diretamente  
❌ Lógica de negócio no constructor  
❌ Nested subscribes  
❌ console.log em produção  
❌ FormGroup sem tipagem  
❌ Lógica complexa no template  

---

**🎯 Este guia garante consistência, manutenibilidade e performance no projeto Eventhub.**
