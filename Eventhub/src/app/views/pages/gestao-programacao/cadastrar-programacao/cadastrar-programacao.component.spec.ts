import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { CadastrarProgramacaoComponent } from './cadastrar-programacao.component';
import { ProgramacaoEventoService } from '../../../../core/services/programacao-evento.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { RetornoAPI } from '../../../../core/models/retorno-api.model';
import { ProgramacaoEventoResponseDto } from '../../../../core/models/programacao-evento.model';

describe('CadastrarProgramacaoComponent', () => {
  let component: CadastrarProgramacaoComponent;
  let fixture: ComponentFixture<CadastrarProgramacaoComponent>;
  let programacaoService: jest.Mocked<ProgramacaoEventoService>;
  let notificationService: jest.Mocked<NotificationService>;
  let spinnerService: jest.Mocked<SpinnerService>;

  const mockProgramacao: ProgramacaoEventoResponseDto = {
    id: 1,
    idEvento: 1,
    nomeEvento: 'Evento Teste',
    titulo: 'Palestra de Abertura',
    descricao: 'Descrição da palestra',
    data: new Date('2024-01-15T09:00:00'),
    duracao: '02:00:00',
    local: 'Auditório Principal',
    responsavel: 'João Silva',
    idStatus: 1,
    descricaoStatus: 'Agendado',
    dataCadastro: new Date()
  };

  beforeEach(async () => {
    const programacaoServiceMock = {
      criar: jest.fn()
    };

    const notificationServiceMock = {
      showSuccess: jest.fn(),
      showError: jest.fn()
    };

    const spinnerServiceMock = {
      show: jest.fn(),
      hide: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        CadastrarProgramacaoComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        provideRouter([{ path: 'gestao-programacao/:idEvento', component: CadastrarProgramacaoComponent }]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ProgramacaoEventoService, useValue: programacaoServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: SpinnerService, useValue: spinnerServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CadastrarProgramacaoComponent);
    component = fixture.componentInstance;
    programacaoService = TestBed.inject(ProgramacaoEventoService) as jest.Mocked<ProgramacaoEventoService>;
    notificationService = TestBed.inject(NotificationService) as jest.Mocked<NotificationService>;
    spinnerService = TestBed.inject(SpinnerService) as jest.Mocked<SpinnerService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar o formulário com valores padrão', () => {
    expect(component.form.value).toEqual({
      titulo: '',
      descricao: '',
      data: '',
      hora: '',
      duracao: '01:00',
      local: '',
      responsavel: ''
    });
  });

  it('deve validar campos obrigatórios', () => {
    const form = component.form;
    expect(form.valid).toBeFalsy();

    form.patchValue({
      titulo: 'Palestra de Abertura',
      data: new Date(),
      hora: '09:00',
      local: 'Auditório Principal',
      responsavel: 'João Silva'
    });

    expect(form.valid).toBeTruthy();
  });

  it('deve validar o tamanho mínimo do título', () => {
    const titulo = component.form.get('titulo');
    titulo?.setValue('AB');
    expect(titulo?.hasError('minlength')).toBeTruthy();

    titulo?.setValue('ABC');
    expect(titulo?.hasError('minlength')).toBeFalsy();
  });

  it('deve validar o formato da hora', () => {
    const hora = component.form.get('hora');
    hora?.setValue('25:00');
    expect(hora?.hasError('pattern')).toBeTruthy();

    hora?.setValue('23:59');
    expect(hora?.hasError('pattern')).toBeFalsy();
  });

  it('deve validar o formato da duração', () => {
    const duracao = component.form.get('duracao');
    duracao?.setValue('999:99');
    expect(duracao?.hasError('pattern')).toBeTruthy();

    duracao?.setValue('02:30');
    expect(duracao?.hasError('pattern')).toBeFalsy();
  });

  it('deve salvar programação com sucesso', () => {
    const mockResponse: RetornoAPI<ProgramacaoEventoResponseDto> = {
      executouComSucesso: true,
      data: mockProgramacao,
      statusHttp: 0,
      erros: []
    };

    programacaoService.criar.mockReturnValue(of(mockResponse));
    component.eventoId = 1; // Configurar eventoId

    component.form.patchValue({
      titulo: 'Palestra de Abertura',
      descricao: 'Descrição da palestra',
      data: new Date('2024-01-15'),
      hora: '09:00',
      duracao: '02:00',
      local: 'Auditório Principal',
      responsavel: 'João Silva'
    });

    component.onSubmit();

    expect(programacaoService.criar).toHaveBeenCalled();
    expect(notificationService.showSuccess).toHaveBeenCalledWith('Programação cadastrada com sucesso');
  });

  it('deve tratar erro ao salvar', () => {
    programacaoService.criar.mockReturnValue(throwError(() => new Error('Erro ao salvar')));
    component.eventoId = 1; // Configurar eventoId

    component.form.patchValue({
      titulo: 'Palestra de Abertura',
      descricao: 'Descrição da palestra',
      data: new Date('2024-01-15'),
      hora: '09:00',
      duracao: '02:00',
      local: 'Auditório Principal',
      responsavel: 'João Silva'
    });

    component.onSubmit();

    expect(notificationService.showError).toHaveBeenCalledWith('Erro ao cadastrar programação');
  });

  it('não deve salvar com formulário inválido', () => {
    component.form.patchValue({
      titulo: 'AB', // Menor que o mínimo
      data: new Date(),
      hora: '09:00',
      local: 'Auditório',
      responsavel: 'João'
    });

    component.onSubmit();

    expect(programacaoService.criar).not.toHaveBeenCalled();
  });

  it('deve navegar ao cancelar', () => {
    const navigateSpy = jest.spyOn((component as any).router, 'navigate');
    component.eventoId = 1;
    component.cancelar();
    expect(navigateSpy).toHaveBeenCalledWith(['/programacoes', 1]);
  });
});
