import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { EditarProgramacaoComponent } from './editar-programacao.component';
import { ProgramacaoEventoService } from '../../../../core/services/programacao-evento.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { RetornoAPI } from '../../../../core/models/retorno-api.model';
import { ProgramacaoEventoResponseDto } from '../../../../core/models/programacao-evento.model';

describe('EditarProgramacaoComponent', () => {
  let component: EditarProgramacaoComponent;
  let fixture: ComponentFixture<EditarProgramacaoComponent>;
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
      buscarPorId: jest.fn(),
      atualizar: jest.fn()
    };

    const notificationServiceMock = {
      showSuccess: jest.fn(),
      showError: jest.fn()
    };

    const spinnerServiceMock = {
      show: jest.fn(),
      hide: jest.fn()
    };

    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: (key: string) => {
            if (key === 'idEvento') return '1';
            if (key === 'id') return '1';
            return null;
          }
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        EditarProgramacaoComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        provideRouter([{ path: 'gestao-programacao/:idEvento', component: EditarProgramacaoComponent }]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ProgramacaoEventoService, useValue: programacaoServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: SpinnerService, useValue: spinnerServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarProgramacaoComponent);
    component = fixture.componentInstance;
    programacaoService = TestBed.inject(ProgramacaoEventoService) as jest.Mocked<ProgramacaoEventoService>;
    notificationService = TestBed.inject(NotificationService) as jest.Mocked<NotificationService>;
    spinnerService = TestBed.inject(SpinnerService) as jest.Mocked<SpinnerService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar dados da programação ao inicializar', () => {
    const mockResponse: RetornoAPI<ProgramacaoEventoResponseDto> = {
      executouComSucesso: true,
      data: mockProgramacao,
      statusHttp: 0,
      erros: []
    };

    programacaoService.buscarPorId.mockReturnValue(of(mockResponse));
    
    fixture.detectChanges();

    expect(programacaoService.buscarPorId).toHaveBeenCalledWith(1);
    expect(component.programacao).toEqual(mockProgramacao);
  });

  it('deve preencher formulário com dados carregados', () => {
    const mockResponse: RetornoAPI<ProgramacaoEventoResponseDto> = {
      executouComSucesso: true,
      data: mockProgramacao,
      statusHttp: 0,
      erros: []
    };

    programacaoService.buscarPorId.mockReturnValue(of(mockResponse));
    
    fixture.detectChanges();

    expect(component.form.value.titulo).toBe('Palestra de Abertura');
    expect(component.form.value.descricao).toBe('Descrição da palestra');
    expect(component.form.value.local).toBe('Auditório Principal');
    expect(component.form.value.responsavel).toBe('João Silva');
    expect(component.form.value.duracao).toBe('02:00');
  });

  it('deve separar data e hora corretamente ao preencher formulário', () => {
    const mockResponse: RetornoAPI<ProgramacaoEventoResponseDto> = {
      executouComSucesso: true,
      data: mockProgramacao,
      statusHttp: 0,
      erros: []
    };

    programacaoService.buscarPorId.mockReturnValue(of(mockResponse));
    
    fixture.detectChanges();

    const formData = new Date(component.form.value.data);
    expect(formData.getDate()).toBe(15);
    expect(formData.getMonth()).toBe(0); // Janeiro
    expect(formData.getFullYear()).toBe(2024);
    expect(component.form.value.hora).toBe('09:00');
  });

  it('deve tratar erro ao carregar programação', () => {
    programacaoService.buscarPorId.mockReturnValue(throwError(() => new Error('Erro ao carregar')));
    const navigateSpy = jest.spyOn((component as any).router, 'navigate');
    
    fixture.detectChanges();

    expect(notificationService.showError).toHaveBeenCalledWith('Erro ao carregar programação');
    expect(navigateSpy).toHaveBeenCalledWith(['/gestao-programacao', 1]);
  });

  it('deve atualizar programação com sucesso', () => {
    const mockLoadResponse: RetornoAPI<ProgramacaoEventoResponseDto> = {
      executouComSucesso: true,
      data: mockProgramacao,
      statusHttp: 0,
      erros: [] 
    };

    const mockUpdateResponse: RetornoAPI<ProgramacaoEventoResponseDto> = {
      executouComSucesso: true,
      data: { ...mockProgramacao, titulo: 'Título Atualizado' },
      statusHttp: 0,
      erros: []
    };

    programacaoService.buscarPorId.mockReturnValue(of(mockLoadResponse));
    programacaoService.atualizar.mockReturnValue(of(mockUpdateResponse));
    
    fixture.detectChanges();

    component.form.patchValue({
      titulo: 'Título Atualizado'
    });

    component.onSubmit();

    expect(programacaoService.atualizar).toHaveBeenCalled();
    expect(notificationService.showSuccess).toHaveBeenCalledWith('Programação atualizada com sucesso');
  });

  it('deve tratar erro ao atualizar', () => {
    const mockLoadResponse: RetornoAPI<ProgramacaoEventoResponseDto> = {
      executouComSucesso: true,
      data: mockProgramacao,
      statusHttp: 0,
      erros: []
    };

    programacaoService.buscarPorId.mockReturnValue(of(mockLoadResponse));
    programacaoService.atualizar.mockReturnValue(throwError(() => new Error('Erro ao atualizar')));
    
    fixture.detectChanges();

    component.onSubmit();

    expect(notificationService.showError).toHaveBeenCalledWith('Erro ao atualizar programação');
  });

  it('não deve atualizar com formulário inválido', () => {
    const mockResponse: RetornoAPI<ProgramacaoEventoResponseDto> = {
      executouComSucesso: true,
      data: mockProgramacao,
      statusHttp: 0,
      erros: []
    };

    programacaoService.buscarPorId.mockReturnValue(of(mockResponse));
    
    fixture.detectChanges();

    component.form.patchValue({
      titulo: 'AB' // Menor que o mínimo
    });

    component.onSubmit();

    expect(programacaoService.atualizar).not.toHaveBeenCalled();
  });

  it('deve navegar ao cancelar', () => {
    const mockResponse: RetornoAPI<ProgramacaoEventoResponseDto> = {
      executouComSucesso: true,
      data: mockProgramacao,
      statusHttp: 0,
      erros: []
    };

    programacaoService.buscarPorId.mockReturnValue(of(mockResponse));
    
    fixture.detectChanges();

    const navigateSpy = jest.spyOn((component as any).router, 'navigate');
    component.cancelar();
    expect(navigateSpy).toHaveBeenCalledWith(['/gestao-programacao', 1]);
  });
});
