import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { provideNgxMask } from 'ngx-mask';
import { EditarPresentesComponent } from './editar-presentes.component';
import { PresenteService } from '../../../../core/services/presente/presente.service';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { ModalService } from '../../../../core/services/modal.service';
import { TipoImagemEvento } from '../../../../core/models/imagem.model';
import { Base64ImageUtil } from '../../../../core/utils/base64-image.util';
import { UsuarioService } from '../../../../core/services/usuario.service';

describe('EditarPresentesComponent', () => {
  let component: EditarPresentesComponent;
  let fixture: ComponentFixture<EditarPresentesComponent>;
  let presenteService: jest.Mocked<PresenteService>;
  let usuarioService: jest.Mocked<UsuarioService>;
  let spinnerService: jest.Mocked<SpinnerService>;
  let modalService: jest.Mocked<ModalService>;
  let router: jest.Mocked<Router>;

  const mockPresenteData = {
    id: 1,
    nome: 'Presente Teste',
    descricao: 'Descrição do presente',
    valor: 100.50,
    categoria: { id: 1, nome: 'Categoria Teste' },
    imagens: [
      {
        id: 1,
        nomeArquivo: 'imagem1.jpg',
        base64: 'base64string1',
        url: 'https://exemplo.com/imagem1.jpg',
        tipoArquivo: 'image/jpeg',
        tipoImagem: TipoImagemEvento.Local
      }
    ]
  };

  const mockCategorias = [
    { id: 1, nome: 'Categoria 1' },
    { id: 2, nome: 'Categoria 2' }
  ];

  beforeEach(async () => {
    const presenteServiceMock = {
      obterPorId: jest.fn(),
      obterCategoriasPresentes: jest.fn(),
      atualizar: jest.fn()
    };

    const spinnerServiceMock = {
      show: jest.fn(),
      hide: jest.fn()
    };

    const modalServiceMock = {
      openSuccessModal: jest.fn(),
      openConfirmationModal: jest.fn()
    };

    const routerMock = {
      navigate: jest.fn()
    };

    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jest.fn((param: string) => {
            if (param === 'idEvento') return '10';
            if (param === 'id') return '1';
            return '0';
          })
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [EditarPresentesComponent],
      providers: [
        FormBuilder,
        provideNgxMask(),
        { provide: PresenteService, useValue: presenteServiceMock },
        { provide: SpinnerService, useValue: spinnerServiceMock },
        { provide: ModalService, useValue: modalServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: UsuarioService, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarPresentesComponent);
    component = fixture.componentInstance;
    presenteService = TestBed.inject(PresenteService) as jest.Mocked<PresenteService>;
    spinnerService = TestBed.inject(SpinnerService) as jest.Mocked<SpinnerService>;
    modalService = TestBed.inject(ModalService) as jest.Mocked<ModalService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Inicialização', () => {
    it('deve inicializar o formulário com validações corretas', () => {
      expect(component.form).toBeDefined();
      expect(component.form.get('nome')).toBeDefined();
      expect(component.form.get('descricao')).toBeDefined();
      expect(component.form.get('categoria')).toBeDefined();
      expect(component.form.get('valor')).toBeDefined();
    });

    it('deve obter eventoId e presenteId da rota', () => {
      expect(component.eventoId).toBe(10);
      expect(component.presenteId).toBe(1);
    });

    it('deve configurar mensagens de validação', () => {
      expect(component.validationMessages).toBeDefined();
      expect(component.validationMessages['nome']).toBeDefined();
      expect(component.validationMessages['categoria']).toBeDefined();
      expect(component.validationMessages['valor']).toBeDefined();
    });
  });

  describe('ngOnInit', () => {
    it('deve chamar obterCategoriasPresente e obterPresentePorId', () => {
      presenteService.obterCategoriasPresentes.mockReturnValue(of({ executouComSucesso: true, data: mockCategorias } as any));
      presenteService.obterPorId.mockReturnValue(of({ executouComSucesso: true, data: mockPresenteData } as any));

      component.ngOnInit();

      expect(presenteService.obterCategoriasPresentes).toHaveBeenCalled();
      expect(presenteService.obterPorId).toHaveBeenCalledWith(1);
    });
  });

  describe('obterPresentePorId', () => {
    it('deve carregar dados do presente com sucesso', () => {
      presenteService.obterPorId.mockReturnValue(of({ executouComSucesso: true, data: mockPresenteData } as any));

      component.obterPresentePorId();

      expect(spinnerService.show).toHaveBeenCalled();
      expect(presenteService.obterPorId).toHaveBeenCalledWith(1);
      expect(spinnerService.hide).toHaveBeenCalled();
      expect(component.form.get('nome')?.value).toBe('Presente Teste');
      expect(component.form.get('descricao')?.value).toBe('Descrição do presente');
      expect(component.form.get('categoria')?.value).toBe(1);
      expect(component.form.get('valor')?.value).toBe(100.50);
      expect(component.imagens).toEqual(mockPresenteData.imagens);
    });

    it('deve tratar erro ao carregar presente', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      presenteService.obterPorId.mockReturnValue(throwError(() => new Error('Erro ao buscar')));

      component.obterPresentePorId();

      expect(spinnerService.show).toHaveBeenCalled();
      expect(spinnerService.hide).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    it('não deve preencher formulário se data estiver vazia', () => {
      presenteService.obterPorId.mockReturnValue(of({ executouComSucesso: true, data: null } as any));

      component.obterPresentePorId();

      expect(component.form.get('nome')?.value).toBe('');
    });
  });

  describe('obterCategoriasPresente', () => {
    it('deve carregar categorias com sucesso', () => {
      presenteService.obterCategoriasPresentes.mockReturnValue(of({ executouComSucesso: true, data: mockCategorias } as any));

      component.obterCategoriasPresente();

      expect(spinnerService.show).toHaveBeenCalled();
      expect(presenteService.obterCategoriasPresentes).toHaveBeenCalled();
      expect(spinnerService.hide).toHaveBeenCalled();
      expect(component.categorias()).toEqual(mockCategorias);
    });

    it('deve tratar erro ao carregar categorias', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      presenteService.obterCategoriasPresentes.mockReturnValue(throwError(() => new Error('Erro')));

      component.obterCategoriasPresente();

      expect(spinnerService.show).toHaveBeenCalled();
      expect(spinnerService.hide).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.form.patchValue({
        nome: 'Presente Atualizado',
        descricao: 'Nova descrição',
        categoria: 1,
        valor: 200
      });
      component.imagens = mockPresenteData.imagens!;
    });

    it('deve atualizar presente com sucesso', () => {
      presenteService.atualizar.mockReturnValue(of({ executouComSucesso: true } as any));
      modalService.openSuccessModal.mockReturnValue(of(true) as any);

      component.onSubmit();

      expect(spinnerService.show).toHaveBeenCalled();
      expect(presenteService.atualizar).toHaveBeenCalledWith({
        id: 1,
        nome: 'Presente Atualizado',
        descricao: 'Nova descrição',
        valor: 200,
        idCategoriaPresente: 1,
        imagens: mockPresenteData.imagens
      });
      expect(spinnerService.hide).toHaveBeenCalled();
      expect(modalService.openSuccessModal).toHaveBeenCalledWith({
        title: 'Presente Atualizado',
        message: 'O presente foi atualizado com sucesso!'
      });
      expect(router.navigate).toHaveBeenCalledWith(['/presentes', 10]);
    });

    it('não deve enviar se formulário inválido', () => {
      component.form.patchValue({ nome: '' });

      component.onSubmit();

      expect(presenteService.atualizar).not.toHaveBeenCalled();
    });

    it('não deve enviar se presenteId for 0', () => {
      component.presenteId = 0;

      component.onSubmit();

      expect(presenteService.atualizar).not.toHaveBeenCalled();
    });

    it('deve tratar erro ao atualizar', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      presenteService.atualizar.mockReturnValue(throwError(() => new Error('Erro ao atualizar')));

      component.onSubmit();

      expect(spinnerService.show).toHaveBeenCalled();
      expect(spinnerService.hide).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('cancelar', () => {
    it('deve navegar para lista quando confirmado', () => {
      modalService.openConfirmationModal.mockReturnValue(of(true) as any);

      component.cancelar();

      expect(modalService.openConfirmationModal).toHaveBeenCalledWith({
        title: 'Cancelar Edição',
        message: 'Tem certeza que deseja cancelar a edição do presente? As informações não salvas serão perdidas.',
        confirmLabel: 'Sim',
        cancelLabel: 'Não'
      });
      expect(router.navigate).toHaveBeenCalledWith(['/presentes', 10]);
    });

    it('não deve navegar quando cancelado', () => {
      modalService.openConfirmationModal.mockReturnValue(of(false) as any);

      component.cancelar();

      expect(modalService.openConfirmationModal).toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('imagensVisualizacao', () => {
    it('deve converter imagens para formato de visualização', () => {
      component.imagens = [
        {
          id: 1,
          nomeArquivo: 'teste.jpg',
          base64: 'base64string',
          url: 'https://exemplo.com/teste.jpg',
          tipoArquivo: 'image/jpeg',
          tipoImagem: TipoImagemEvento.Local
        }
      ];

      const resultado = component.imagensVisualizacao;

      expect(resultado.length).toBe(1);
      expect(resultado[0]).toBe('https://exemplo.com/teste.jpg');
    });

    it('deve retornar array vazio se não houver imagens', () => {
      component.imagens = [];

      const resultado = component.imagensVisualizacao;

      expect(resultado).toEqual([]);
    });
  });

  describe('onImagensChange', () => {
    it('deve adicionar nova imagem', () => {
      component.imagens = [];
      const novaImagemBase64 = 'data:image/jpeg;base64,novaImagem123';

      component.onImagensChange([novaImagemBase64]);

      expect(component.imagens.length).toBe(1);
      expect(component.imagens[0].nomeArquivo).toBe('imagem_1.jpg');
      expect(component.imagens[0].tipoImagem).toBe(TipoImagemEvento.Local);
    });

    it('deve preservar imagens existentes', () => {
      const imagemExistente = {
        id: 1,
        nomeArquivo: 'existente.jpg',
        base64: 'base64Existente',
        url: 'https://exemplo.com/existente.jpg',
        tipoArquivo: 'image/jpeg',
        tipoImagem: TipoImagemEvento.Local
      };
      component.imagens = [imagemExistente];
      
      const imagemExistenteString = imagemExistente.url!;
      const novaImagemString = 'data:image/jpeg;base64,novaImagem';

      component.onImagensChange([imagemExistenteString, novaImagemString]);

      expect(component.imagens.length).toBe(2);
      expect(component.imagens[0].id).toBe(1);
      expect(component.imagens[0].nomeArquivo).toBe('existente.jpg');
      expect(component.imagens[1].id).toBeUndefined();
    });

    it('deve remover imagens quando array reduzido', () => {
      component.imagens = [
        { nomeArquivo: 'img1.jpg', base64: 'base1', url: 'https://exemplo.com/img1.jpg', tipoArquivo: 'image/jpeg', tipoImagem: TipoImagemEvento.Local },
        { nomeArquivo: 'img2.jpg', base64: 'base2', url: 'https://exemplo.com/img2.jpg', tipoArquivo: 'image/jpeg', tipoImagem: TipoImagemEvento.Local }
      ];

      const imagemString = component.imagens[0].url!;
      component.onImagensChange([imagemString]);

      expect(component.imagens.length).toBe(1);
    });
  });

  describe('Validações do Formulário', () => {
    it('campo nome deve ser obrigatório', () => {
      const nome = component.form.get('nome');
      nome?.setValue('');
      expect(nome?.hasError('required')).toBeTruthy();
    });

    it('campo nome deve ter mínimo 3 caracteres', () => {
      const nome = component.form.get('nome');
      nome?.setValue('ab');
      expect(nome?.hasError('minlength')).toBeTruthy();
    });

    it('campo nome deve ter máximo 100 caracteres', () => {
      const nome = component.form.get('nome');
      nome?.setValue('a'.repeat(101));
      expect(nome?.hasError('maxlength')).toBeTruthy();
    });

    it('campo categoria deve ser obrigatório', () => {
      const categoria = component.form.get('categoria');
      categoria?.setValue('');
      expect(categoria?.hasError('required')).toBeTruthy();
    });

    it('campo valor deve ser obrigatório', () => {
      const valor = component.form.get('valor');
      valor?.setValue('');
      expect(valor?.hasError('required')).toBeTruthy();
    });

    it('campo valor deve ser maior que zero', () => {
      const valor = component.form.get('valor');
      valor?.setValue(-1);
      expect(valor?.hasError('min')).toBeTruthy();
    });

    it('campo descricao deve ter máximo 500 caracteres', () => {
      const descricao = component.form.get('descricao');
      descricao?.setValue('a'.repeat(501));
      expect(descricao?.hasError('maxlength')).toBeTruthy();
    });

    it('formulário deve ser válido com dados corretos', () => {
      component.form.patchValue({
        nome: 'Presente Válido',
        descricao: 'Descrição válida',
        categoria: 1,
        valor: 100
      });
      expect(component.form.valid).toBeTruthy();
    });
  });
});
