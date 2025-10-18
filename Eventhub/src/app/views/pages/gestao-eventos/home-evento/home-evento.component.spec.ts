import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HomeEventoComponent } from './home-evento.component';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { EventoService } from '../../../../core/services/evento.service';
import { ConvidadoService } from '../../../../core/services/convidado.service';
import { UsuarioService } from '../../../../core/services/usuario.service';

describe('HomeEventoComponent (Jest)', () => {
  let component: HomeEventoComponent;
  let fixture: ComponentFixture<HomeEventoComponent>;

  beforeEach(async () => {
    // Mocks mínimos para dependências
    const spinner = { show: jest.fn(), hide: jest.fn() };
    const service = { buscarPorId: jest.fn() };
    const convidadoService = { buscarConvidadosPorEvento: jest.fn() };
    const route = { snapshot: { paramMap: { get: jest.fn().mockReturnValue('evento123') } } };
    const mockUsuarioService = {
      obterUsuarioLogado: jest.fn().mockResolvedValue(null)
    };


    await TestBed.configureTestingModule({
      imports: [HomeEventoComponent],
      providers: [
        { provide: EventoService, useValue: service },
        { provide: SpinnerService, useValue: spinner },
        { provide: ActivatedRoute, useValue: route },
        { provide: ConvidadoService, useValue: convidadoService },
        { provide: UsuarioService, useValue: mockUsuarioService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeEventoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeDefined();
  });

  it('deve identificar perfil de organizador e convidado corretamente', () => {
    component.usuario = { email: 'org@email.com' } as any;
    component.evento = {
      organizadores: [{ email: 'org@email.com' }],
      convidados: [{ email: 'convidado@email.com' }]
    } as any;
    component.identificarPerfilUsuario();
    expect(component.isOrganizador).toBe(true);
    expect(component.isConvidado).toBe(false);

    component.usuario = { email: 'convidado@email.com' } as any;
    component.identificarPerfilUsuario();
    expect(component.isOrganizador).toBe(false);
    expect(component.isConvidado).toBe(true);
  });

  it('deve filtrar cards visíveis para organizador', () => {
    component.isOrganizador = true;
    const cards = component.cardsVisiveis();
    expect(cards.some(c => c.title === 'Orçamento')).toBe(true);
    expect(cards.some(c => c.title === 'Configurações')).toBe(true);
    expect(cards.some(c => c.title === 'Cancelar')).toBe(true);
  });

  it('deve filtrar cards visíveis para convidado', () => {
    component.isOrganizador = false;
    const cards = component.cardsVisiveis();
    expect(cards.some(c => c.title === 'Orçamento')).toBe(false);
    expect(cards.some(c => c.title === 'Configurações')).toBe(false);
    expect(cards.some(c => c.title === 'Cancelar')).toBe(false);
    expect(cards.some(c => c.title === 'Lista de Presentes')).toBe(true);
  });
});
