import { HomeEventoComponent } from './home-evento.component';

describe('HomeEventoComponent (Jest)', () => {
  let component: HomeEventoComponent;

  beforeEach(() => {
    // Mocks mínimos para dependências
    const spinner = { show: jest.fn(), hide: jest.fn() };
    const service = { buscarPorId: jest.fn() };
    const convidadoService = { buscarConvidadosPorEvento: jest.fn() };
    const route = { snapshot: { paramMap: { get: jest.fn().mockReturnValue('evento123') } } };
    // @ts-ignore
    component = new HomeEventoComponent();
    // Injetar dependências mockadas
    // @ts-ignore
    component.spinner = spinner;
    // @ts-ignore
    component.service = service;
    // @ts-ignore
    component.convidadoService = convidadoService;
    // @ts-ignore
    component.route = route;
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
