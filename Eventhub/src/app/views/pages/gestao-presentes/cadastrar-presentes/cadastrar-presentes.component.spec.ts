import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastrarPresentesComponent } from './cadastrar-presentes.component';
import { PresenteService } from '../../../../core/services/presente.service';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { ModalService } from '../../../../core/services/modal.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CategoriaPresenteDto, CreatePresenteDto } from '../../../../core/models/presente.model';
import { RetornoAPI } from '../../../../core/models/retorno-api.model';
import { UsuarioService } from '../../../../core/services/usuario.service';

describe('CadastrarPresentesComponent', () => {
  let component: CadastrarPresentesComponent;
  let fixture: ComponentFixture<CadastrarPresentesComponent>;
  let presenteService: jest.Mocked<PresenteService>;
  let spinnerService: jest.Mocked<SpinnerService>;
  let modalService: jest.Mocked<ModalService>;
  let router: jest.Mocked<Router>;
  let activatedRoute: ActivatedRoute;

  const mockCategorias: CategoriaPresenteDto[] = [
    { id: 1, nome: 'Eletrônicos' },
    { id: 2, nome: 'Eletrodomésticos' },
    { id: 3, nome: 'Utilidades Domésticas' }
  ];

  const mockRetornoCategoriasSuccess: RetornoAPI<CategoriaPresenteDto[]> = {
    executouComSucesso: true,
    statusHttp: 200,
    data: mockCategorias,
    erros: []
  };

  const mockRetornoCadastroSuccess: RetornoAPI<any> = {
    executouComSucesso: true,
    statusHttp: 201,
    data: { id: 1, nome: 'Cafeteira' },
    erros: []
  };

  beforeEach(async () => {
    const presenteServiceMock = {
      obterCategoriasPresentes: jest.fn(),
      cadastro: jest.fn()
    };

    const spinnerServiceMock = {
      show: jest.fn(),
      hide: jest.fn()
    };

    const modalServiceMock = {
      openSuccessModal: jest.fn(),
      openConfirmationModal: jest.fn()
    };

    const usuarioServiceMock = {
      obterUsuarioLogado: jest.fn().mockReturnValue(of({ id: 1, nome: 'Usuário Teste' }))
    };

    const routerMock = {
      navigate: jest.fn()
    };

    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue('123')
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        CadastrarPresentesComponent,
        BrowserAnimationsModule
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PresenteService, useValue: presenteServiceMock },
        { provide: SpinnerService, useValue: spinnerServiceMock },
        { provide: ModalService, useValue: modalServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: UsuarioService, useValue: usuarioServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CadastrarPresentesComponent);
    component = fixture.componentInstance;
    presenteService = TestBed.inject(PresenteService) as jest.Mocked<PresenteService>;
    spinnerService = TestBed.inject(SpinnerService) as jest.Mocked<SpinnerService>;
    modalService = TestBed.inject(ModalService) as jest.Mocked<ModalService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Inicialização do Componente', () => {
    it('deve criar o componente', () => {
      expect(component).toBeTruthy();
    });

    it('deve inicializar o formulário com os campos obrigatórios', () => {
      expect(component.form).toBeDefined();
      expect(component.form.get('nome')).toBeDefined();
      expect(component.form.get('descricao')).toBeDefined();
      expect(component.form.get('categoria')).toBeDefined();
      expect(component.form.get('valor')).toBeDefined();
    });

    it('deve inicializar o formulário com valores vazios', () => {
      expect(component.form.get('nome')?.value).toBe('');
      expect(component.form.get('descricao')?.value).toBe('');
      expect(component.form.get('categoria')?.value).toBe('');
      expect(component.form.get('valor')?.value).toBe('');
    });

    it('deve configurar validações do formulário corretamente', () => {
      const nomeControl = component.form.get('nome');
      const categoriaControl = component.form.get('categoria');
      const valorControl = component.form.get('valor');

      expect(nomeControl?.hasError('required')).toBeTruthy();
      expect(categoriaControl?.hasError('required')).toBeTruthy();
      expect(valorControl?.hasError('required')).toBeTruthy();
    });

    it('deve obter o eventoId da rota no ngOnInit', () => {
      presenteService.obterCategoriasPresentes.mockReturnValue(of(mockRetornoCategoriasSuccess));

      component.ngOnInit();

      expect(component.eventoId).toBe('123');
    });

    it('deve chamar obterCategoriasPresente no ngOnInit', () => {
      presenteService.obterCategoriasPresentes.mockReturnValue(of(mockRetornoCategoriasSuccess));

      component.ngOnInit();

      expect(presenteService.obterCategoriasPresentes).toHaveBeenCalled();
    });
  });

  describe('obterCategoriasPresente', () => {
    it('deve exibir spinner durante a requisição', () => {
      presenteService.obterCategoriasPresentes.mockReturnValue(of(mockRetornoCategoriasSuccess));

      component.obterCategoriasPresente();

      expect(spinnerService.show).toHaveBeenCalled();
    });

    it('deve carregar categorias com sucesso', (done) => {
      presenteService.obterCategoriasPresentes.mockReturnValue(of(mockRetornoCategoriasSuccess));

      component.obterCategoriasPresente();

      setTimeout(() => {
        expect(spinnerService.hide).toHaveBeenCalled();
        expect(component.categorias()).toEqual(mockCategorias);
        done();
      }, 100);
    });

    it('deve ocultar spinner após sucesso', (done) => {
      presenteService.obterCategoriasPresentes.mockReturnValue(of(mockRetornoCategoriasSuccess));

      component.obterCategoriasPresente();

      setTimeout(() => {
        expect(spinnerService.hide).toHaveBeenCalled();
        done();
      }, 100);
    });

    it('deve tratar erro ao buscar categorias', (done) => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      presenteService.obterCategoriasPresentes.mockReturnValue(throwError(() => new Error('Erro ao buscar categorias')));

      component.obterCategoriasPresente();

      setTimeout(() => {
        expect(spinnerService.hide).toHaveBeenCalled();
        expect(consoleErrorSpy).toHaveBeenCalled();
        consoleErrorSpy.mockRestore();
        done();
      }, 100);
    });

    it('não deve atualizar categorias se executouComSucesso for false', (done) => {
      const mockRetornoFalha: RetornoAPI<CategoriaPresenteDto[]> = {
        executouComSucesso: false,
        statusHttp: 400,
        data: [],
        erros: ['Erro ao buscar categorias']
      };
      presenteService.obterCategoriasPresentes.mockReturnValue(of(mockRetornoFalha));

      component.obterCategoriasPresente();

      setTimeout(() => {
        expect(component.categorias()).toEqual([]);
        done();
      }, 100);
    });
  });

  describe('Validações do Formulário', () => {
    it('deve invalidar formulário quando nome estiver vazio', () => {
      component.form.patchValue({
        nome: '',
        descricao: 'Descrição teste',
        categoria: 1,
        valor: 100
      });

      expect(component.form.valid).toBeFalsy();
      expect(component.form.get('nome')?.hasError('required')).toBeTruthy();
    });

    it('deve invalidar formulário quando nome tiver menos de 3 caracteres', () => {
      component.form.patchValue({
        nome: 'AB',
        descricao: 'Descrição teste',
        categoria: 1,
        valor: 100
      });

      expect(component.form.valid).toBeFalsy();
      expect(component.form.get('nome')?.hasError('minlength')).toBeTruthy();
    });

    it('deve invalidar formulário quando nome tiver mais de 100 caracteres', () => {
      const nomeLongo = 'A'.repeat(101);
      component.form.patchValue({
        nome: nomeLongo,
        descricao: 'Descrição teste',
        categoria: 1,
        valor: 100
      });

      expect(component.form.valid).toBeFalsy();
      expect(component.form.get('nome')?.hasError('maxlength')).toBeTruthy();
    });

    it('deve invalidar formulário quando categoria não for selecionada', () => {
      component.form.patchValue({
        nome: 'Cafeteira',
        descricao: 'Descrição teste',
        categoria: '',
        valor: 100
      });

      expect(component.form.valid).toBeFalsy();
      expect(component.form.get('categoria')?.hasError('required')).toBeTruthy();
    });

    it('deve invalidar formulário quando valor estiver vazio', () => {
      component.form.patchValue({
        nome: 'Cafeteira',
        descricao: 'Descrição teste',
        categoria: 1,
        valor: ''
      });

      expect(component.form.valid).toBeFalsy();
      expect(component.form.get('valor')?.hasError('required')).toBeTruthy();
    });

    it('deve validar formulário quando todos os campos obrigatórios estiverem preenchidos corretamente', () => {
      component.form.patchValue({
        nome: 'Cafeteira',
        descricao: 'Descrição teste',
        categoria: 1,
        valor: 100
      });

      expect(component.form.valid).toBeTruthy();
    });

    it('deve permitir descrição vazia', () => {
      component.form.patchValue({
        nome: 'Cafeteira',
        descricao: '',
        categoria: 1,
        valor: 100
      });

      expect(component.form.valid).toBeTruthy();
    });

    it('deve invalidar quando descrição ultrapassar 500 caracteres', () => {
      const descricaoLonga = 'A'.repeat(501);
      component.form.patchValue({
        nome: 'Cafeteira',
        descricao: descricaoLonga,
        categoria: 1,
        valor: 100
      });

      expect(component.form.valid).toBeFalsy();
      expect(component.form.get('descricao')?.hasError('maxlength')).toBeTruthy();
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.eventoId = '123';
      component.form.patchValue({
        nome: 'Cafeteira',
        descricao: 'Cafeteira elétrica 1L',
        categoria: 1,
        valor: 150.50
      });
    });

    it('não deve submeter quando formulário for inválido', () => {
      component.form.patchValue({ nome: '' });

      component.onSubmit();

      expect(presenteService.cadastro).not.toHaveBeenCalled();
      expect(spinnerService.show).not.toHaveBeenCalled();
    });

    it('não deve submeter quando eventoId for "0"', () => {
      component.eventoId = '0';

      component.onSubmit();

      expect(presenteService.cadastro).not.toHaveBeenCalled();
      expect(spinnerService.show).not.toHaveBeenCalled();
    });

    it('não deve submeter quando eventoId for vazio', () => {
      component.eventoId = '';

      component.onSubmit();

      expect(presenteService.cadastro).not.toHaveBeenCalled();
      expect(spinnerService.show).not.toHaveBeenCalled();
    });

    it('deve exibir spinner ao submeter formulário', () => {
      presenteService.cadastro.mockReturnValue(of(mockRetornoCadastroSuccess));

      component.onSubmit();

      expect(spinnerService.show).toHaveBeenCalled();
    });

    it('deve chamar serviço de cadastro com dados corretos', () => {
      presenteService.cadastro.mockReturnValue(of(mockRetornoCadastroSuccess));

      component.onSubmit();

      expect(presenteService.cadastro).toHaveBeenCalledWith(
        expect.objectContaining({
          nome: 'Cafeteira',
          descricao: 'Cafeteira elétrica 1L',
          valor: 150.50,
          idCategoria: 1,
          idEvento: 123
        })
      );
    });

    it('deve incluir imagens no DTO quando houver imagens', () => {
      const mockImagens = ['data:image/jpeg;base64,ABC123', 'data:image/jpeg;base64,DEF456'];
      component.imagens = mockImagens;
      presenteService.cadastro.mockReturnValue(of(mockRetornoCadastroSuccess));

      component.onSubmit();

      const chamada = presenteService.cadastro.mock.calls[0][0] as CreatePresenteDto;
      expect(chamada.imagens).toBeDefined();
      expect(chamada.imagens?.length).toBe(2);
    });

    it('deve exibir modal de sucesso após cadastro bem-sucedido', (done) => {
      presenteService.cadastro.mockReturnValue(of(mockRetornoCadastroSuccess));
      const modalObservable = of(true);
      modalService.openSuccessModal.mockReturnValue(modalObservable);

      component.onSubmit();

      setTimeout(() => {
        expect(spinnerService.hide).toHaveBeenCalled();
        expect(modalService.openSuccessModal).toHaveBeenCalledWith({
          title: 'Presente Cadastrado',
          message: 'O presente foi cadastrado com sucesso!'
        });
        done();
      }, 100);
    });

    it('deve navegar para lista de presentes após fechar modal de sucesso', (done) => {
      presenteService.cadastro.mockReturnValue(of(mockRetornoCadastroSuccess));
      const modalObservable = of(true);
      modalService.openSuccessModal.mockReturnValue(modalObservable);

      component.onSubmit();

      setTimeout(() => {
        expect(router.navigate).toHaveBeenCalledWith(['/presentes', '123']);
        done();
      }, 100);
    });

    it('deve ocultar spinner e logar erro em caso de falha', (done) => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      presenteService.cadastro.mockReturnValue(throwError(() => new Error('Erro ao cadastrar')));

      component.onSubmit();

      setTimeout(() => {
        expect(spinnerService.hide).toHaveBeenCalled();
        expect(consoleErrorSpy).toHaveBeenCalled();
        expect(modalService.openSuccessModal).not.toHaveBeenCalled();
        consoleErrorSpy.mockRestore();
        done();
      }, 100);
    });

    it('não deve exibir modal quando executouComSucesso for false', (done) => {
      const mockRetornoFalha: RetornoAPI<any> = {
        executouComSucesso: false,
        statusHttp: 400,
        data: null,
        erros: ['Erro de validação']
      };
      presenteService.cadastro.mockReturnValue(of(mockRetornoFalha));

      component.onSubmit();

      setTimeout(() => {
        expect(spinnerService.hide).toHaveBeenCalled();
        expect(modalService.openSuccessModal).not.toHaveBeenCalled();
        done();
      }, 100);
    });
  });

  describe('cancelar', () => {
    beforeEach(() => {
      component.eventoId = '123';
    });

    it('deve exibir modal de confirmação ao cancelar', () => {
      modalService.openConfirmationModal.mockReturnValue(of(false) as any);

      component.cancelar();

      expect(modalService.openConfirmationModal).toHaveBeenCalledWith({
        title: 'Cancelar Cadastro',
        message: 'Tem certeza que deseja cancelar o cadastro do presente? As informações não salvas serão perdidas.',
        confirmLabel: 'Sim',
        cancelLabel: 'Não'
      });
    });

    it('deve navegar para lista de presentes quando usuário confirmar', (done) => {
      modalService.openConfirmationModal.mockReturnValue(of(true) as any);

      component.cancelar();

      setTimeout(() => {
        expect(router.navigate).toHaveBeenCalledWith(['/presentes', '123']);
        done();
      }, 100);
    });

    it('não deve navegar quando usuário cancelar a confirmação', (done) => {
      modalService.openConfirmationModal.mockReturnValue(of(false) as any);

      component.cancelar();

      setTimeout(() => {
        expect(router.navigate).not.toHaveBeenCalled();
        done();
      }, 100);
    });
  });

  describe('onImagensChange', () => {
    it('deve atualizar array de imagens quando receber novas imagens', () => {
      const novasImagens = ['image1.jpg', 'image2.jpg', 'image3.jpg'];

      component.onImagensChange(novasImagens);

      expect(component.imagens).toEqual(novasImagens);
    });

    it('deve limpar array de imagens quando receber array vazio', () => {
      component.imagens = ['image1.jpg', 'image2.jpg'];

      component.onImagensChange([]);

      expect(component.imagens).toEqual([]);
    });

    it('deve substituir imagens antigas por novas', () => {
      component.imagens = ['old1.jpg', 'old2.jpg'];
      const novasImagens = ['new1.jpg', 'new2.jpg', 'new3.jpg'];

      component.onImagensChange(novasImagens);

      expect(component.imagens).toEqual(novasImagens);
      expect(component.imagens.length).toBe(3);
    });
  });

  describe('Mensagens de Validação', () => {
    it('deve ter mensagens de validação configuradas', () => {
      expect(component.validationMessages).toBeDefined();
      expect(component.validationMessages['nome']).toBeDefined();
      expect(component.validationMessages['descricao']).toBeDefined();
      expect(component.validationMessages['categoria']).toBeDefined();
      expect(component.validationMessages['valor']).toBeDefined();
    });

    it('deve ter mensagem de required para nome', () => {
      expect(component.validationMessages['nome']['required']).toBe('Informe o Nome do Presente');
    });

    it('deve ter mensagem de minlength para nome', () => {
      expect(component.validationMessages['nome']['minlength']).toBe('O Nome deve ter pelo menos 3 caracteres');
    });

    it('deve ter mensagem de maxlength para nome', () => {
      expect(component.validationMessages['nome']['maxlength']).toBe('O Nome deve ter no máximo 100 caracteres');
    });

    it('deve ter mensagem de required para categoria', () => {
      expect(component.validationMessages['categoria']['required']).toBe('Selecione uma Categoria');
    });

    it('deve ter mensagem de required para valor', () => {
      expect(component.validationMessages['valor']['required']).toBe('Informe o Valor do Presente');
    });
  });

  describe('Integração do Formulário', () => {

    it('deve marcar formulário como touched após blur em campo', () => {
      const nomeControl = component.form.get('nome');
      nomeControl?.markAsTouched();

      expect(nomeControl?.touched).toBeTruthy();
    });

    it('deve permitir resetar o formulário', () => {
      component.form.patchValue({
        nome: 'Cafeteira',
        descricao: 'Teste',
        categoria: 1,
        valor: 100
      });

      component.form.reset();

      expect(component.form.get('nome')?.value).toBeNull();
      expect(component.form.get('descricao')?.value).toBeNull();
    });
  });
});
