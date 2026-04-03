import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideNgxMask } from 'ngx-mask';

import { ConfiguracoesEventoComponent } from './configuracoes-evento.component';
import { EventoService } from '../../../../core/services/evento.service';
import { TipoEventoService } from '../../../../core/services/tipo-evento.service';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ModalService } from '../../../../core/services/modal.service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { RetornoAPI } from '../../../../core/models/retorno-api.model';

describe('ConfiguracoesEventoComponent', () => {
  let component: ConfiguracoesEventoComponent;
  let fixture: ComponentFixture<ConfiguracoesEventoComponent>;
  let mockEventoService: jest.Mocked<EventoService>;
  let mockTipoEventoService: jest.Mocked<TipoEventoService>;
  let mockSpinnerService: jest.Mocked<SpinnerService>;
  let mockNotificationService: jest.Mocked<NotificationService>;
  let mockModalService: jest.Mocked<ModalService>;
  let mockUsuarioService: jest.Mocked<UsuarioService>;

  const mockEvento = {
    id: 1,
    nome: 'Evento Teste',
    descricao: 'Descrição teste',
    idTipoEvento: 1,
    idStatus: 1,
    maxConvidado: 100,
    tipoData: 'unica' as const,
    dataInicio: new Date('2026-12-31'),
    dataFim: null,
    tokenConvite: 'abc123',
    endereco: {
      cep: '12345-678',
      logradouro: 'Rua Teste',
      cidade: 'Cidade Teste',
      numero: '123',
      pontoReferencia: 'Próximo ao shopping',
      nomeLocal: 'Salão Teste'
    }
  };

  beforeEach(async () => {
    mockEventoService = {
      buscarEventoPorId: jest.fn().mockReturnValue(of({ executouComSucesso: true, data: mockEvento })),
      buscarStatusEventos: jest.fn().mockReturnValue(of({ executouComSucesso: true, data: [] })),
      atualizar: jest.fn().mockReturnValue(of({ executouComSucesso: true, data: mockEvento })),
      atualizarStatus: jest.fn().mockReturnValue(of({ executouComSucesso: true, data: mockEvento })),
      cancelarEvento: jest.fn().mockReturnValue(of({ executouComSucesso: true, data: null })),
      reativarEvento: jest.fn().mockReturnValue(of({ executouComSucesso: true, data: mockEvento })),
      excluir: jest.fn().mockReturnValue(of({ executouComSucesso: true, data: null }))
    } as any;

    mockTipoEventoService = {
      obterTiposEvento: jest.fn().mockReturnValue(of({ executouComSucesso: true, data: [] }))
    } as any;

    mockSpinnerService = {
      show: jest.fn(),
      hide: jest.fn()
    } as any;

    mockNotificationService = {
      showSuccess: jest.fn(),
      showError: jest.fn()
    } as any;

    mockModalService = {
      openConfirmationModal: jest.fn().mockReturnValue(of(true)),
      openInputModal: jest.fn().mockReturnValue(of('Motivo do cancelamento')),
      openSuccessModal: jest.fn().mockReturnValue(of(true))
    } as any;

    mockUsuarioService = {
      obterUsuarioLogado: jest.fn().mockResolvedValue({ id: 1, nome: 'Test User' })
    } as any;

    await TestBed.configureTestingModule({
      imports: [ConfiguracoesEventoComponent, ReactiveFormsModule],
      providers: [
        provideAnimations(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNativeDateAdapter(),
        provideNgxMask(),
        { provide: EventoService, useValue: mockEventoService },
        { provide: TipoEventoService, useValue: mockTipoEventoService },
        { provide: SpinnerService, useValue: mockSpinnerService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: ModalService, useValue: mockModalService },
        { provide: UsuarioService, useValue: mockUsuarioService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: jest.fn().mockReturnValue('1')
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfiguracoesEventoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar evento ao inicializar', () => {
    fixture.detectChanges();
    expect(mockEventoService.buscarEventoPorId).toHaveBeenCalledWith(1);
    expect(component.evento()?.nome).toBe('Evento Teste');
  });

  it('deve inicializar formulário corretamente', () => {
    fixture.detectChanges();
    expect(component.form).toBeDefined();
  });

  it('deve preencher formulário com dados do evento', () => {
    fixture.detectChanges();
    expect(component.form.get('nome')?.value).toBe('Evento Teste');
    expect(component.form.get('cep')?.value).toBe('12345-678');
  });

  it('deve salvar configurações', () => {
    fixture.detectChanges();
    component.form.patchValue({ nome: 'Novo Nome' });
    component.salvar();
    
    expect(mockEventoService.atualizar).toHaveBeenCalled();
  });

  it('deve arquivar evento', () => {
    fixture.detectChanges();
    component.arquivar();
    
    expect(mockModalService.openConfirmationModal).toHaveBeenCalled();
    expect(mockEventoService.atualizarStatus).toHaveBeenCalledWith(1, 3); // StatusEvento.Finalizado
  });

  it('deve cancelar evento', () => {
    fixture.detectChanges();
    component.cancelar();
    
    expect(mockModalService.openInputModal).toHaveBeenCalled();
    expect(mockEventoService.cancelarEvento).toHaveBeenCalled();
  });

  it('deve excluir evento', () => {
    fixture.detectChanges();
    component.excluir();
    
    expect(mockModalService.openConfirmationModal).toHaveBeenCalled();
  });

  it('deve validar formulário', () => {
    fixture.detectChanges();
    
    component.form.get('nome')?.setValue('');
    expect(component.form.invalid).toBe(true);
    
    component.form.get('nome')?.setValue('Nome Válido');
    expect(component.form.invalid).toBe(false);
  });

  it('deve confirmar antes de voltar com alterações não salvas', () => {
    fixture.detectChanges();
    component.form.markAsDirty();
    component.form.markAsTouched();
    component.voltar();
    
    expect(mockModalService.openConfirmationModal).toHaveBeenCalled();
  });

  it('deve identificar evento cancelado corretamente', () => {
    const eventoCancelado = { ...mockEvento, status: { id: 4, descricao: 'Cancelado' } };
    mockEventoService.buscarEventoPorId.mockReturnValue(of({ 
      executouComSucesso: true, 
      data: eventoCancelado,
      statusHttp: 200,
      erros: []
    }));
    
    fixture.detectChanges();
    
    expect(component.eventoCancelado()).toBe(true);
  });

  it('deve identificar evento não expirado corretamente', () => {
    const eventoFuturo = { ...mockEvento, dataInicio: new Date('2027-12-31') };
    mockEventoService.buscarEventoPorId.mockReturnValue(of({ 
      executouComSucesso: true, 
      data: eventoFuturo,
      statusHttp: 200,
      erros: []
    }));
    
    fixture.detectChanges();
    
    expect(component.eventoExpirado()).toBe(false);
  });

  it('deve identificar evento expirado corretamente', () => {
    const eventoPassado = { ...mockEvento, dataInicio: new Date('2020-01-01') };
    mockEventoService.buscarEventoPorId.mockReturnValue(of({ 
      executouComSucesso: true, 
      data: eventoPassado,
      statusHttp: 200,
      erros: []
    }));
    
    fixture.detectChanges();
    
    expect(component.eventoExpirado()).toBe(true);
  });

  it('deve permitir reativar evento cancelado e não expirado', () => {
    const eventoCanceladoFuturo = { 
      ...mockEvento, 
      status: { id: 4, descricao: 'Cancelado' },
      dataInicio: new Date('2027-12-31')
    };
    mockEventoService.buscarEventoPorId.mockReturnValue(of({ 
      executouComSucesso: true, 
      data: eventoCanceladoFuturo,
      statusHttp: 200,
      erros: []
    }));
    
    fixture.detectChanges();
    
    expect(component.podeReativar()).toBe(true);
  });

  it('não deve permitir reativar evento cancelado e expirado', () => {
    const eventoCanceladoPassado = { 
      ...mockEvento, 
      status: { id: 4, descricao: 'Cancelado' },
      dataInicio: new Date('2020-01-01')
    };
    mockEventoService.buscarEventoPorId.mockReturnValue(of({ 
      executouComSucesso: true, 
      data: eventoCanceladoPassado,
      statusHttp: 200,
      erros: []
    }));
    
    fixture.detectChanges();
    
    expect(component.podeReativar()).toBe(false);
  });

  it('deve reativar evento cancelado', () => {
    const eventoCanceladoFuturo = { 
      ...mockEvento, 
      status: { id: 4, descricao: 'Cancelado' },
      dataInicio: new Date('2027-12-31')
    };
    mockEventoService.buscarEventoPorId.mockReturnValue(of({ 
      executouComSucesso: true, 
      data: eventoCanceladoFuturo,
      statusHttp: 200,
      erros: []
    }));
    
    fixture.detectChanges();
    
    component.reativarEvento();
    
    expect(mockModalService.openConfirmationModal).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Reativar Evento',
        message: 'O evento voltará ao status Ativo e os convidados poderão confirmar presença novamente.',
        confirmLabel: 'Reativar',
        cancelLabel: 'Cancelar'
      })
    );
    expect(mockSpinnerService.show).toHaveBeenCalled();
    expect(mockEventoService.reativarEvento).toHaveBeenCalledWith(1);
    expect(mockSpinnerService.hide).toHaveBeenCalled();
    expect(mockModalService.openSuccessModal).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Evento Reativado',
        message: 'O evento foi reativado com sucesso.'
      })
    );
  });

  it('não deve reativar evento quando usuário cancela confirmação', () => {
    const eventoCanceladoFuturo = { 
      ...mockEvento, 
      status: { id: 4, descricao: 'Cancelado' },
      dataInicio: new Date('2027-12-31')
    };
    mockEventoService.buscarEventoPorId.mockReturnValue(of({ 
      executouComSucesso: true, 
      data: eventoCanceladoFuturo,
      statusHttp: 200,
      erros: []
    }));
    mockModalService.openConfirmationModal.mockReturnValue(of(false));
    
    fixture.detectChanges();
    
    component.reativarEvento();
    
    expect(mockModalService.openConfirmationModal).toHaveBeenCalled();
    expect(mockEventoService.reativarEvento).not.toHaveBeenCalled();
  });

  it('deve exibir erro ao falhar reativação de evento', () => {
    const eventoCanceladoFuturo = { 
      ...mockEvento, 
      status: { id: 4, descricao: 'Cancelado' },
      dataInicio: new Date('2027-12-31')
    };
    mockEventoService.buscarEventoPorId.mockReturnValue(of({ 
      executouComSucesso: true, 
      data: eventoCanceladoFuturo,
      statusHttp: 200,
      erros: []
    }));
    mockEventoService.reativarEvento.mockReturnValue(throwError(() => new Error('Erro ao reativar evento')));
    
    fixture.detectChanges();
    
    component.reativarEvento();
    
    expect(mockNotificationService.showError).toHaveBeenCalledWith('Erro ao reativar evento');
  });

  it('deve usar dataFim para verificar expiração em eventos de período', () => {
    const eventoPeriodo = { 
      ...mockEvento, 
      tipoData: 'periodo' as const,
      dataInicio: new Date('2020-01-01'),
      dataFim: new Date('2027-12-31')
    };
    mockEventoService.buscarEventoPorId.mockReturnValue(of({ 
      executouComSucesso: true, 
      data: eventoPeriodo,
      statusHttp: 200,
      erros: []
    }));
    
    fixture.detectChanges();
    
    // Não deve estar expirado porque dataFim é futura
    expect(component.eventoExpirado()).toBe(false);
  });
});
