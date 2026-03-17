import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { NotificacoesComponent } from './notificacoes.component';
import { NotificacaoService } from '../../../core/services/notificacao.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SpinnerService } from '../../../core/services/spinner.service';
import { NotificacaoResponseDto, NotificacaoStatus, NotificacaoPrioridade } from '../../../core/models/notificacao.model';

describe('NotificacoesComponent', () => {
  let component: NotificacoesComponent;
  let fixture: ComponentFixture<NotificacoesComponent>;
  let mockNotificacaoService: jest.Mocked<NotificacaoService>;
  let mockNotificationService: jest.Mocked<NotificationService>;
  let mockSpinnerService: jest.Mocked<SpinnerService>;

  const mockNotificacao: NotificacaoResponseDto = {
    id: 1,
    titulo: 'Nova notificação',
    descricao: 'Descrição da notificação',
    idUsuarioDestino: 1,
    nomeUsuarioDestino: 'João',
    idUsuarioOrigem: 2,
    nomeUsuarioOrigem: 'Maria',
    idEvento: 1,
    nomeEvento: 'Evento Teste',
    status: NotificacaoStatus.Enviada,
    prioridade: NotificacaoPrioridade.Media,
    linkAcao: '/eventos/1',
    icone: 'notifications',
    dataCadastro: new Date(),
    dataEnvio: new Date(),
    dataLeitura: new Date(0),
    lida: false
  };

  beforeEach(async () => {
    mockNotificacaoService = {
      buscarPorUsuario: jest.fn(),
      buscarNaoLidas: jest.fn(),
      marcarComoLida: jest.fn(),
      marcarTodasComoLidas: jest.fn(),
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

    await TestBed.configureTestingModule({
      imports: [NotificacoesComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: NotificacaoService, useValue: mockNotificacaoService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: SpinnerService, useValue: mockSpinnerService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificacoesComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar notificações', () => {
    const mockResponse = {
      executouComSucesso: true,
      data: [mockNotificacao]
    };

    const mockUsuario = { 
      id: 1, 
      nome: 'Teste', 
      email: 'test@test.com', 
      keycloakId: '123',
      telefone: '',
      foto: '',
      dataCadastro: new Date(),
      status: 'Ativo'
    };

    mockNotificacaoService.buscarPorUsuario.mockReturnValue(of(mockResponse as any));
    component.usuarioLogado.set(mockUsuario);
    
    component.carregarNotificacoes();

    expect(mockNotificacaoService.buscarPorUsuario).toHaveBeenCalled();
  });

  it('deve marcar notificação como lida', () => {
    const mockResponse = {
      executouComSucesso: true,
      data: { ...mockNotificacao, lida: true }
    };

    mockNotificacaoService.marcarComoLida.mockReturnValue(of(mockResponse as any));
    component.notificacoes.set([mockNotificacao]);

    component.marcarComoLida(mockNotificacao);

    expect(mockNotificacaoService.marcarComoLida).toHaveBeenCalledWith(1);
  });

  it('deve marcar todas como lidas', () => {
    const mockResponse = {
      executouComSucesso: true,
      data: { mensagem: 'Sucesso' }
    };

    const mockUsuario = { 
      id: 1, 
      nome: 'Teste', 
      email: 'test@test.com', 
      keycloakId: '123',
      telefone: '',
      foto: '',
      dataCadastro: new Date(),
      status: 'Ativo'
    };

    mockNotificacaoService.marcarTodasComoLidas.mockReturnValue(of(mockResponse as any));
    mockNotificacaoService.buscarPorUsuario.mockReturnValue(of({ executouComSucesso: true, data: [] } as any));
    component.usuarioLogado.set(mockUsuario);
    component.notificacoes.set([mockNotificacao]);

    component.marcarTodasComoLidas();

    expect(mockSpinnerService.show).toHaveBeenCalled();
  });

  it('deve calcular contador de não lidas', () => {
    const notificacaoLida = { ...mockNotificacao, id: 2, lida: true };
    component.notificacoes.set([mockNotificacao, notificacaoLida]);

    expect(component.contadorNaoLidas()).toBe(1);
  });

  it('deve agrupar notificações por data', () => {
    const hoje = new Date();
    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);
    
    const notif1 = { ...mockNotificacao, id: 1, dataEnvio: hoje };
    const notif2 = { ...mockNotificacao, id: 2, dataEnvio: ontem };
    
    component.notificacoes.set([notif1, notif2]);
    const grupos = component.gruposNotificacoes();

    expect(grupos.length).toBeGreaterThan(0);
  });

  it('deve remover notificação', () => {
    const mockResponse = {
      executouComSucesso: true,
      data: { mensagem: 'Notificação removida' }
    };

    const mockEvent = {
      stopPropagation: jest.fn()
    } as any;

    mockNotificacaoService.remover.mockReturnValue(of(mockResponse as any));
    component.notificacoes.set([mockNotificacao, { ...mockNotificacao, id: 2 }]);

    component.remover(mockNotificacao, mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(mockNotificacaoService.remover).toHaveBeenCalledWith(1);
    expect(mockSpinnerService.show).toHaveBeenCalled();
  });
});
