import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
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
      openInputModal: jest.fn().mockReturnValue(of('Motivo do cancelamento'))
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
    expect(mockEventoService.excluir).toHaveBeenCalledWith(1);
  });

  it('deve validar formulário', () => {
    fixture.detectChanges();
    
    component.form.get('nome')?.setValue('');
    expect(component.form.invalid).toBe(true);
    
    component.form.get('nome')?.setValue('Nome Válido');
    expect(component.form.invalid).toBe(false);
  });

  it('deve retornar status info correto', () => {
    const statusInfo = component.getStatusInfo(1);
    expect(statusInfo.label).toBe('Ativo');
    expect(statusInfo.class).toBe('status-ativo');
  });

  it('deve confirmar antes de voltar com alterações não salvas', () => {
    fixture.detectChanges();
    component.form.markAsDirty();
    component.form.markAsTouched();
    component.voltar();
    
    expect(mockModalService.openConfirmationModal).toHaveBeenCalled();
  });
});
