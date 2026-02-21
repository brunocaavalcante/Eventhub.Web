import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { PixEventoService } from '../../../../../core/services/pix-evento.service';
import { SpinnerService } from '../../../../../core/services/spinner.service';
import { ModalService } from '../../../../../core/services/modal.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { NotificationService } from '../../../../../core/services/notification.service';
import { CadastrarContribuicaoPresenteComponent } from './cadastrar-contribuicao-presente.component';
import { PresenteService } from '../../../../../core/services/presente/presente.service';

describe('CadastrarContribuicaoPresenteComponent', () => {
  let component: CadastrarContribuicaoPresenteComponent;
  let fixture: ComponentFixture<CadastrarContribuicaoPresenteComponent>;
  let mockRouter: any;
  let mockActivatedRoute: any;
  let mockPresenteService: any;
  let mockPixEventoService: any;
  let mockSpinner: any;
  let mockModal: any;
  let mockClipboard: any;
  let mockNotification: any;

  beforeEach(async () => {
    mockRouter = { navigate: jest.fn() };
    mockActivatedRoute = { snapshot: { params: { idEvento: '1', id: '2' } } };
    mockPresenteService = {
      obterPorId: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: jest.fn() }) }),
      contribuir: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: jest.fn() }) })
    };
    mockPixEventoService = {
      buscarPixEventoFinalidade: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: jest.fn() }) })
    };
    mockSpinner = { show: jest.fn(), hide: jest.fn() };
    mockModal = {
      openErrorModal: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
      openSuccessModal: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
      openConfirmationModal: jest.fn().mockReturnValue({ subscribe: jest.fn() })
    };
    mockClipboard = { copy: jest.fn().mockReturnValue(true) };
    mockNotification = { showSuccess: jest.fn(), showError: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [CadastrarContribuicaoPresenteComponent, NoopAnimationsModule, HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: PresenteService, useValue: mockPresenteService },
        { provide: PixEventoService, useValue: mockPixEventoService },
        { provide: SpinnerService, useValue: mockSpinner },
        { provide: ModalService, useValue: mockModal },
        { provide: Clipboard, useValue: mockClipboard },
        { provide: NotificationService, useValue: mockNotification }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CadastrarContribuicaoPresenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar formulário com campo valor', () => {
    expect(component.form.get('valor')).toBeDefined();
  });

  it('deve validar campo valor como obrigatório', () => {
    const valor = component.form.get('valor');
    valor?.setValue('');
    expect(valor?.hasError('required')).toBe(true);
  });

  it('deve validar valor mínimo', () => {
    const valor = component.form.get('valor');
    valor?.setValue(0);
    expect(valor?.hasError('min')).toBe(true);
  });

  it('deve chamar copiarCodigoPix e notificar sucesso', () => {
    component.pixCode.set('123456');
    component.copiarCodigoPix();
    expect(mockClipboard.copy).toHaveBeenCalledWith('123456');
    expect(mockNotification.showSuccess).toHaveBeenCalled();
  });

  it('deve exibir erro ao anexar comprovante sem valor', () => {
    component.form.get('valor')?.setValue('');
    component.anexarComprovante();
    expect(mockModal.openErrorModal).toHaveBeenCalled();
    expect(component.mostrarComprovante).toBe(false);
  });

  it('deve mostrar comprovante se valor válido', () => {
    component.form.get('valor')?.setValue(10);
    component.anexarComprovante();
    expect(component.mostrarComprovante).toBe(true);
  });

  it('deve exibir erro se tentar confirmar pagamento sem comprovante', () => {
    component.form.get('valor')?.setValue(10);
    component.comprovante = [];
    component.confirmarPagamento();
    expect(mockModal.openErrorModal).toHaveBeenCalled();
  });

  it('deve chamar spinner e serviço ao confirmar pagamento válido', () => {
    component.form.get('valor')?.setValue(10);
    component.comprovante = ['data:image/png;base64,abc'];
    component.confirmarPagamento();
    expect(mockSpinner.show).toHaveBeenCalled();
    expect(mockPresenteService.contribuir).toHaveBeenCalled();
  });

  it('deve chamar modal de confirmação ao cancelar', () => {
    component.cancelar();
    expect(mockModal.openConfirmationModal).toHaveBeenCalled();
  });
});
