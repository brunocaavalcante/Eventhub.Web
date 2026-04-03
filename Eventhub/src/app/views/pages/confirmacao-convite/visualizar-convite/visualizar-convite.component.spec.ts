import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { VisualizarConviteComponent } from './visualizar-convite.component';
import { EventoService } from '../../../../core/services/evento.service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { StatusEvento } from '../../../../core/models/evento.model';

describe('VisualizarConviteComponent', () => {
  let component: VisualizarConviteComponent;
  let fixture: ComponentFixture<VisualizarConviteComponent>;
  let mockEventoService: any;
  let mockUsuarioService: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockEventoService = {
      buscarEventoPorToken: jest.fn()
    };

    mockUsuarioService = {
      obterUsuarioLogado: jest.fn().mockReturnValue(null)
    };

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue('123')
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [VisualizarConviteComponent, NoopAnimationsModule, HttpClientTestingModule],
      providers: [
        { provide: EventoService, useValue: mockEventoService },
        { provide: UsuarioService, useValue: mockUsuarioService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VisualizarConviteComponent);
    component = fixture.componentInstance;
  });

  it('deve criar componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar evento ao inicializar', () => {
    const mockEvento = {
      id: 123,
      nome: 'Festa de Aniversário',
      descricao: 'Venha comemorar comigo',
      dataInicio: new Date(),
      idStatus: StatusEvento.Ativo,
      tipoData: 'unica' as const,
      idTipoEvento: 1,
      endereco: {
        cep: '12345-678',
        logradouro: 'Rua Teste',
        numero: '123',
        cidade: 'São Paulo'
      }
    };

    mockEventoService.buscarEventoPorToken.mockReturnValue(
      of({ executouComSucesso: true, data: mockEvento })
    );

    fixture.detectChanges();

    expect(mockEventoService.buscarEventoPorToken).toHaveBeenCalledWith('123');
    expect(component.evento()).toEqual(mockEvento);
  });

  it('deve exibir erro se evento não existir', () => {
    mockEventoService.buscarEventoPorToken.mockReturnValue(
      of({ executouComSucesso: false })
    );

    fixture.detectChanges();

    expect(component.erroCarregamento()).toBe('Evento não encontrado ou link inválido.');
  });

  it('deve exibir erro se evento estiver cancelado', () => {
    const mockEvento = {
      id: 123,
      nome: 'Festa Cancelada',
      idStatus: StatusEvento.Cancelado
    };

    mockEventoService.buscarEventoPorToken.mockReturnValue(
      of({ executouComSucesso: true, data: mockEvento })
    );

    fixture.detectChanges();

    expect(component.erroCarregamento()).toBe('Este evento foi cancelado.');
  });

  it('deve exibir erro se id for inválido', () => {
    mockActivatedRoute.snapshot.paramMap.get.mockReturnValue('');
    
    component.ngOnInit();

    expect(component.erroCarregamento()).toBe('Link inválido. Verifique o convite recebido.');
  });

  it('deve navegar para responder convite', () => {
    const navigateSpy = jest.spyOn(component['router'], 'navigate');
    component.tokenEvento = '123';

    component.responderConvite();

    expect(navigateSpy).toHaveBeenCalledWith(['/participar-evento', '123', 'responder']);
  });
});
