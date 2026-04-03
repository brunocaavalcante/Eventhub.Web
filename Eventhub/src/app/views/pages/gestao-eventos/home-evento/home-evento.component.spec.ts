import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HomeEventoComponent } from './home-evento.component';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { EventoService } from '../../../../core/services/evento.service';
import { ParticipanteService } from '../../../../core/services/participante.service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { PerfilService } from '../../../../core/services/perfil.service';

describe('HomeEventoComponent (Jest)', () => {
  let component: HomeEventoComponent;
  let fixture: ComponentFixture<HomeEventoComponent>;

  beforeEach(async () => {
    // Mocks mínimos para dependências
    const spinner = { show: jest.fn(), hide: jest.fn() };
    const service = {
      buscarEventoPorId: jest.fn().mockReturnValue({
        pipe: () => ({
          subscribe: (obj: any) => obj.next({ executouComSucesso: true, data: { organizadores: [], convidados: [] } })
        })
      })
    };
    const convidadoService = { buscarConvidadosPorEvento: jest.fn() };
    const perfilService = { obterModulosPerfil: jest.fn() };
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
        { provide: ParticipanteService, useValue: convidadoService },
        { provide: PerfilService, useValue: perfilService },
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

  it('deve definir cards do perfil', () => {
    const modulos = [
      { nome: 'Orçamento', showInMenu: true },
      { nome: 'Configurações', showInMenu: true },
      { nome: 'Cancelar', showInMenu: true },
      { nome: 'Lista de Presentes', showInMenu: true }
    ];
    component.cards.set(modulos as any);
    expect(component.cards().length).toBe(4);
    expect(component.cards()[0].nome).toBe('Orçamento');
  });

  it('deve retornar tipo de evento padrão se indefinido', () => {
    const tipoInfo = component.getTipoEventoInfo(undefined);
    expect(tipoInfo).toBeDefined();
    expect(typeof tipoInfo).toBe('object');
  });

  it('deve identificar agenda do evento', () => {
    component.evento = {
      dataInicio: new Date('2025-12-10'),
      dataFim: new Date('2025-12-12'),
      tipoData: 'periodo',
      nome: 'Evento Teste',
      organizadores: [],
      convidados: []
    } as any;
    expect(component.evento?.dataInicio).toBeInstanceOf(Date);
    expect(component.evento?.dataFim).toBeInstanceOf(Date);
    expect(component.evento?.tipoData).toBe('periodo');
  });

  it('deve identificar perfil de organizador e convidado corretamente', () => {
    component.usuario = { id: 1, email: 'org@email.com' } as any;
    component.evento = {
      id: 99,
      organizadores: [{ email: 'org@email.com' }],
      convidados: [{ email: 'convidado@email.com' }]
    } as any;
    // Mock participanteService.obterParticipantePorIdUsuario
    const participanteService = TestBed.inject(ParticipanteService);
    participanteService.obterParticipantePorIdUsuario = jest.fn().mockReturnValue({
      pipe: () => ({
        subscribe: (obj: any) => obj.next({ executouComSucesso: true, data: { perfil: { id: 1 } } })
      })
    });
    // Mock perfilService.obterModulosPerfil
    const perfilService = TestBed.inject(PerfilService);
    perfilService.obterModulosPerfil = jest.fn().mockReturnValue({
      pipe: () => ({
        subscribe: (obj: any) => obj.next({ executouComSucesso: true, data: [{ title: 'Orçamento', showInMenu: true }] })
      })
    });
    component.identificarPerfilUsuario();
    expect(component.cards().length).toBeGreaterThan(0);
  });

  it('deve definir módulos do perfil', () => {
    const perfilService = TestBed.inject(PerfilService);
    perfilService.obterModulosPerfil = jest.fn().mockReturnValue({
      pipe: () => ({
        subscribe: (obj: any) => obj.next({ executouComSucesso: true, data: [{ nome: 'Galeria', showInMenu: true  }] })
      })
    });
    component.obterModulosPerfil(99, 1);
    expect(component.cards().length).toBeGreaterThan(0);
    expect(component.cards()[0].nome).toBe('Galeria');
  });
});
