import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { CadastrarQrcodeComponent } from './cadastrar-qrcode.component';
import { PixEventoService } from '../../../../core/services/pix-evento.service';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { ModalService } from '../../../../core/services/modal.service';
import { FinalidadePix } from '../../../../core/utils/enums/finalidade-pix.enum';
import { RetornoAPI } from '../../../../core/models/retorno-api.model';
import { UsuarioService } from '../../../../core/services/usuario.service';

describe('CadastrarQrcodeComponent', () => {
  let component: CadastrarQrcodeComponent;
  let fixture: ComponentFixture<CadastrarQrcodeComponent>;
  let pixEventoService: jest.Mocked<PixEventoService>;
  let spinnerService: jest.Mocked<SpinnerService>;
  let modalService: jest.Mocked<ModalService>;
  let router: jest.Mocked<Router>;
  let activatedRoute: any;

  beforeEach(async () => {
    const pixEventoServiceMock = {
      cadastro: jest.fn()
    };

    const spinnerServiceMock = {
      show: jest.fn(),
      hide: jest.fn()
    };

    const modalServiceMock = {
      openSuccessModal: jest.fn().mockReturnValue(of(true)),
      openConfirmationModal: jest.fn().mockReturnValue(of(true))
    };

    const routerMock = {
      navigate: jest.fn()
    };

    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jest.fn((param: string) => {
            if (param === 'idEvento') return '123';
            if (param === 'finalidade') return '1';
            return null;
          })
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        CadastrarQrcodeComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: PixEventoService, useValue: pixEventoServiceMock },
        { provide: SpinnerService, useValue: spinnerServiceMock },
        { provide: ModalService, useValue: modalServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: UsuarioService, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CadastrarQrcodeComponent);
    component = fixture.componentInstance;
    pixEventoService = TestBed.inject(PixEventoService) as jest.Mocked<PixEventoService>;
    spinnerService = TestBed.inject(SpinnerService) as jest.Mocked<SpinnerService>;
    modalService = TestBed.inject(ModalService) as jest.Mocked<ModalService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Inicialização do Componente', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('deve inicializar o formulário com campos vazios', () => {
      expect(component.form).toBeDefined();
      expect(component.form.get('codigoPix')?.value).toBe('');
      expect(component.form.get('nomeBeneficiario')?.value).toBe('');
    });

    it('deve inicializar cadastrarPix como false', () => {
      expect(component.cadastrarPix()).toBe(false);
    });

    it('deve capturar os parâmetros da rota no ngOnInit', () => {
      component.ngOnInit();
      
      expect(component.idEvento).toBe(123);
      expect(component.finalidadePix).toBe(1);
    });

    it('deve definir idEvento como 0 quando não houver parâmetro na rota', () => {
      activatedRoute.snapshot.paramMap.get = jest.fn().mockReturnValue(null);
      
      component.ngOnInit();
      
      expect(component.idEvento).toBe(0);
    });
  });

  describe('Validação do Formulário', () => {
    describe('Campo codigoPix', () => {
      it('deve ser inválido quando vazio', () => {
        const codigoPixControl = component.form.get('codigoPix');
        codigoPixControl?.setValue('');
        
        expect(codigoPixControl?.valid).toBe(false);
        expect(codigoPixControl?.hasError('required')).toBe(true);
      });

      it('deve ser inválido quando tiver menos de 50 caracteres', () => {
        const codigoPixControl = component.form.get('codigoPix');
        codigoPixControl?.setValue('00020126' + 'x'.repeat(30));
        
        expect(codigoPixControl?.valid).toBe(false);
        expect(codigoPixControl?.hasError('minlength')).toBe(true);
      });

      it('deve ser inválido quando não começar com 00020126', () => {
        const codigoPixControl = component.form.get('codigoPix');
        codigoPixControl?.setValue('12345678' + 'x'.repeat(50));
        
        expect(codigoPixControl?.valid).toBe(false);
        expect(codigoPixControl?.hasError('pattern')).toBe(true);
      });

      it('deve ser válido com código correto', () => {
        const codigoPixControl = component.form.get('codigoPix');
        codigoPixControl?.setValue('00020126' + 'x'.repeat(50));
        
        expect(codigoPixControl?.valid).toBe(true);
      });
    });

    describe('Campo nomeBeneficiario', () => {
      it('deve ser inválido quando vazio', () => {
        const nomeBeneficiarioControl = component.form.get('nomeBeneficiario');
        nomeBeneficiarioControl?.setValue('');
        
        expect(nomeBeneficiarioControl?.valid).toBe(false);
        expect(nomeBeneficiarioControl?.hasError('required')).toBe(true);
      });

      it('deve ser inválido quando tiver menos de 3 caracteres', () => {
        const nomeBeneficiarioControl = component.form.get('nomeBeneficiario');
        nomeBeneficiarioControl?.setValue('AB');
        
        expect(nomeBeneficiarioControl?.valid).toBe(false);
        expect(nomeBeneficiarioControl?.hasError('minlength')).toBe(true);
      });

      it('deve ser válido com nome correto', () => {
        const nomeBeneficiarioControl = component.form.get('nomeBeneficiario');
        nomeBeneficiarioControl?.setValue('João da Silva');
        
        expect(nomeBeneficiarioControl?.valid).toBe(true);
      });
    });

    it('deve ter formulário inválido quando ambos os campos estiverem vazios', () => {
      expect(component.form.valid).toBe(false);
    });

    it('deve ter formulário válido quando todos os campos estiverem preenchidos corretamente', () => {
      component.form.patchValue({
        codigoPix: '00020126' + 'x'.repeat(50),
        nomeBeneficiario: 'João da Silva'
      });
      
      expect(component.form.valid).toBe(true);
    });
  });

  describe('Método salvar()', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('não deve submeter o formulário se estiver inválido', () => {
      component.form.patchValue({
        codigoPix: '',
        nomeBeneficiario: ''
      });

      component.salvar();

      expect(spinnerService.show).not.toHaveBeenCalled();
      expect(pixEventoService.cadastro).not.toHaveBeenCalled();
      expect(component.form.touched).toBe(true);
    });

    it('deve marcar todos os campos como touched quando formulário inválido', () => {
      component.form.patchValue({
        codigoPix: '',
        nomeBeneficiario: ''
      });

      const markAllAsTouchedSpy = jest.spyOn(component.form, 'markAllAsTouched');

      component.salvar();

      expect(markAllAsTouchedSpy).toHaveBeenCalled();
    });

    it('deve submeter o formulário com dados corretos quando válido', () => {
      const mockResponse:RetornoAPI = {
        executouComSucesso: true, data: null,
        statusHttp: 0,
        erros: []
      };
      pixEventoService.cadastro.mockReturnValue(of(mockResponse));

      component.idEvento = 123;
      component.finalidadePix = FinalidadePix.Presentes;
      
      component.form.patchValue({
        codigoPix: '00020126' + 'x'.repeat(50),
        nomeBeneficiario: 'João da Silva'
      });

      component.salvar();

      expect(spinnerService.show).toHaveBeenCalled();
      expect(pixEventoService.cadastro).toHaveBeenCalledWith({
        idEvento: 123,
        finalidade: FinalidadePix.Presentes,
        qrCodePix: '00020126' + 'x'.repeat(50),
        nomeBeneficiario: 'João da Silva'
      });
    });

    it('deve exibir spinner e escondê-lo após sucesso', (done) => {
      const mockResponse:RetornoAPI = {
        executouComSucesso: true, data: null,
        statusHttp: 0,
        erros: []
      };
      pixEventoService.cadastro.mockReturnValue(of(mockResponse));

      component.form.patchValue({
        codigoPix: '00020126' + 'x'.repeat(50),
        nomeBeneficiario: 'João da Silva'
      });

      component.salvar();

      setTimeout(() => {
        expect(spinnerService.show).toHaveBeenCalled();
        expect(spinnerService.hide).toHaveBeenCalled();
        done();
      }, 100);
    });

    it('deve exibir modal de sucesso após cadastro bem-sucedido', (done) => {
      const mockResponse:RetornoAPI = {
        executouComSucesso: true, data: null,
        statusHttp: 0,
        erros: []
      };
      pixEventoService.cadastro.mockReturnValue(of(mockResponse));

      component.form.patchValue({
        codigoPix: '00020126' + 'x'.repeat(50),
        nomeBeneficiario: 'João da Silva'
      });

      component.salvar();

      setTimeout(() => {
        expect(modalService.openSuccessModal).toHaveBeenCalledWith({
          title: 'QR Code Cadastrado!',
          message: 'Seu QR Code PIX foi cadastrado com sucesso e já está disponível para receber contribuições.'
        });
        done();
      }, 100);
    });

    it('deve navegar para página de presentes após confirmação do modal quando finalidade for Presentes', (done) => {
        const mockResponse:RetornoAPI = {
          executouComSucesso: true, data: null,
          statusHttp: 0,
          erros: []
        };
      pixEventoService.cadastro.mockReturnValue(of(mockResponse));
      modalService.openSuccessModal.mockReturnValue(of(true));

      component.idEvento = 123;
      component.finalidadePix = FinalidadePix.Presentes;

      component.form.patchValue({
        codigoPix: '00020126' + 'x'.repeat(50),
        nomeBeneficiario: 'João da Silva'
      });

      component.salvar();

      setTimeout(() => {
        expect(router.navigate).toHaveBeenCalledWith(['/presentes', 123]);
        done();
      }, 100);
    });

    it('deve esconder spinner em caso de erro', (done) => {
      const mockError = { error: 'Erro ao cadastrar' };
      pixEventoService.cadastro.mockReturnValue(throwError(() => mockError));

      component.form.patchValue({
        codigoPix: '00020126' + 'x'.repeat(50),
        nomeBeneficiario: 'João da Silva'
      });

      component.salvar();

      setTimeout(() => {
        expect(spinnerService.hide).toHaveBeenCalled();
        done();
      }, 100);
    });

  describe('Método cancelar()', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('deve exibir modal de confirmação ao cancelar', () => {
      component.cancelar();

      expect(modalService.openConfirmationModal).toHaveBeenCalledWith({
        title: 'Cancelar Cadastro',
        message: 'Tem certeza que deseja cancelar o cadastro do QR Code PIX? As informações preenchidas serão perdidas.',
        confirmLabel: 'Sim, cancelar',
        cancelLabel: 'Continuar cadastrando'
      });
    });

    it('deve navegar para página de presentes se usuário confirmar cancelamento', (done) => {
      modalService.openConfirmationModal.mockReturnValue(of(true));
      component.idEvento = 123;

      component.cancelar();

      setTimeout(() => {
        expect(router.navigate).toHaveBeenCalledWith(['/presentes', 123]);
        done();
      }, 100);
    });

    it('não deve navegar se usuário não confirmar cancelamento', (done) => {
      modalService.openConfirmationModal.mockReturnValue(of(false));

      component.cancelar();

      setTimeout(() => {
        expect(router.navigate).not.toHaveBeenCalled();
        done();
      }, 100);
    });
  });

  describe('Mensagens de Validação', () => {
    it('deve ter mensagens de validação configuradas para codigoPix', () => {
      expect(component.validationMessages['codigoPix']).toBeDefined();
      expect(component.validationMessages['codigoPix']['required']).toBe('Informe o código PIX');
      expect(component.validationMessages['codigoPix']['minlength']).toBe('O código PIX deve ter pelo menos 50 caracteres');
      expect(component.validationMessages['codigoPix']['pattern']).toBe('Código PIX inválido. Deve começar com "00020126"');
    });

    it('deve ter mensagens de validação configuradas para nomeBeneficiario', () => {
      expect(component.validationMessages['nomeBeneficiario']).toBeDefined();
      expect(component.validationMessages['nomeBeneficiario']['required']).toBe('Informe o Nome do Beneficiário');
      expect(component.validationMessages['nomeBeneficiario']['minlength']).toBe('O Nome deve ter pelo menos 3 caracteres');
    });
  });

  describe('Signal cadastrarPix', () => {
    it('deve alterar o valor de cadastrarPix usando set', () => {
      expect(component.cadastrarPix()).toBe(false);
      
      component.cadastrarPix.set(true);
      
      expect(component.cadastrarPix()).toBe(true);
    });
  });
});
