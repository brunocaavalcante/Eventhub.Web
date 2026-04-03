import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ConsultarProgramacaoComponent } from './consultar-programacao.component';
import { ProgramacaoEventoService } from '../../../../core/services/programacao-evento.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { ModalService } from '../../../../core/services/modal.service';
import { ProgramacaoEventoResponseDto } from '../../../../core/models/programacao-evento.model';

describe('ConsultarProgramacaoComponent', () => {
  let component: ConsultarProgramacaoComponent;
  let fixture: ComponentFixture<ConsultarProgramacaoComponent>;
  let mockProgramacaoService: jest.Mocked<ProgramacaoEventoService>;
  let mockNotificationService: jest.Mocked<NotificationService>;
  let mockSpinnerService: jest.Mocked<SpinnerService>;
  let mockModalService: jest.Mocked<ModalService>;

  const mockProgramacao: ProgramacaoEventoResponseDto = {
    id: 1,
    idEvento: 1,
    nomeEvento: 'Evento Teste',
    titulo: 'Palestra de Abertura',
    descricao: 'Descrição da palestra',
    data: new Date('2026-04-01T10:00:00'),
    duracao: '02:00:00',
    local: 'Auditório Principal',
    responsavel: 'João Silva',
    idStatus: 1,
    descricaoStatus: 'Ativo',
    dataCadastro: new Date()
  };

  beforeEach(async () => {
    mockProgramacaoService = {
      buscarPorEvento: jest.fn(),
      buscarPorId: jest.fn(),
      criar: jest.fn(),
      atualizar: jest.fn(),
      remover: jest.fn()
    } as any;

    mockNotificationService = {
      showSuccess: jest.fn(),
      showError: jest.fn(),
      showWarning: jest.fn()
    } as any;

    mockSpinnerService = {
      show: jest.fn(),
      hide: jest.fn()
    } as any;

    mockModalService = {
      openConfirmationModal: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [ConsultarProgramacaoComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ProgramacaoEventoService, useValue: mockProgramacaoService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: SpinnerService, useValue: mockSpinnerService },
        { provide: ModalService, useValue: mockModalService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultarProgramacaoComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar programações ao inicializar', () => {
    const mockResponse = {
      executouComSucesso: true,
      data: [mockProgramacao],
      statusHttp: 200,
      erros: []
    };

    mockProgramacaoService.buscarPorEvento.mockReturnValue(of(mockResponse));

    fixture.detectChanges(); // Chama ngOnInit

    expect(mockProgramacaoService.buscarPorEvento).toHaveBeenCalled();
    expect(component.programacoes().length).toBe(1);
  });

  it('deve filtrar programações por busca', () => {
    component.programacoes.set([mockProgramacao]);
    component.busca.set('Palestra');

    const filtradas = component.programacoesFiltradas();

    expect(filtradas.length).toBe(1);
    expect(filtradas[0].titulo).toContain('Palestra');
  });

  it('deve formatar hora corretamente', () => {
    const data = new Date('2026-04-01T10:30:00');
    const resultado = component.formatarHora(data);

    expect(resultado).toContain('10');
    expect(resultado).toContain('30');
  });

  it('deve formatar data completa corretamente', () => {
    const data = new Date('2026-04-01T10:00:00');
    const resultado = component.formatarDataCompleta(data);

    expect(resultado).toBeTruthy();
    expect(resultado).toContain('abril');
  });

  it('deve retornar ícone baseado no índice', () => {
    const icone = component.obterIcone(0);
    expect(icone).toBeTruthy();
  });

  it('deve excluir programação após confirmação', () => {
    mockModalService.openConfirmationModal.mockReturnValue(of(true));
    mockProgramacaoService.remover.mockReturnValue(of({
      executouComSucesso: true,
      data: null,
      statusHttp: 200,
      erros: []
    }));
    mockProgramacaoService.buscarPorEvento.mockReturnValue(of({
      executouComSucesso: true,
      data: [],
      statusHttp: 200,
      erros: []
    }));

    component.excluirProgramacao(mockProgramacao);

    expect(mockModalService.openConfirmationModal).toHaveBeenCalled();
    expect(mockProgramacaoService.remover).toHaveBeenCalledWith(mockProgramacao.id);
  });
});
