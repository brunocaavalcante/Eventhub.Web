import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultarPresentesComponent } from './consultar-presentes.component';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { PixEventoService } from '../../../../core/services/pix-evento.service';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { ModalService } from '../../../../core/services/modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { Presente } from '../../../../core/models/presente.model';
import { PresenteService } from '../../../../core/services/presente/presente.service';

describe('ConsultarPresentesComponent', () => {
  let component: ConsultarPresentesComponent;
  let fixture: ComponentFixture<ConsultarPresentesComponent>;
  let mockPresenteService: jest.Mocked<any>;
  let mockPixService: jest.Mocked<any>;
  let mockModalService: jest.Mocked<any>;
  let mockRouter: jest.Mocked<any>;
  let mockUsuarioService: jest.Mocked<any>;

  beforeEach(async () => {
    mockPresenteService = { obterPresentesPorEvento: jest.fn(() => of({ executouComSucesso: true, data: [] })), excluir: jest.fn(() => of({ executouComSucesso: true })), obterStatusPresente: jest.fn(() => of({ executouComSucesso: true, data: [] })) };
    mockPixService = { buscarPixEventoFinalidade: jest.fn(() => of({ executouComSucesso: true, data: null })) };
    mockModalService = { openConfirmationModal: jest.fn(() => of(true)), openSuccessModal: jest.fn(), openErrorModal: jest.fn() };
    mockRouter = { navigate: jest.fn() };
    mockUsuarioService = { obterUsuarioLogado: jest.fn(() => ({ id: 123, nome: 'Teste', email: 'teste@teste.com' })) };

    await TestBed.configureTestingModule({
      imports: [ConsultarPresentesComponent],
      providers: [
        { provide: UsuarioService, useValue: mockUsuarioService },
        { provide: PresenteService, useValue: mockPresenteService },
        { provide: PixEventoService, useValue: mockPixService },
        { provide: SpinnerService, useValue: { show: jest.fn(), hide: jest.fn() } },
        { provide: ModalService, useValue: mockModalService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultarPresentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar presentes no init', () => {
    expect(mockPresenteService.obterPresentesPorEvento).toHaveBeenCalledWith('1');
    expect(mockPixService.buscarPixEventoFinalidade).toHaveBeenCalled();
  });

  it('deve filtrar presentes por busca', () => {
    component.presentes.set([{ id: 1, nome: 'TV', valor: 1000 } as Presente, { id: 2, nome: 'Geladeira', valor: 2000 } as Presente]);
    component.busca.set('tv');
    expect(component.presentesFiltrados().length).toBe(1);
    expect(component.presentesFiltrados()[0].nome).toBe('TV');
  });

  it('deve filtrar presentes por status', () => {
    component.presentes.set([{ id: 1, nome: 'TV', status: { id: 1, descricao: 'Disponível' } } as Presente, { id: 2, nome: 'Geladeira', status: { id: 2, descricao: 'Reservado' } } as Presente]);
    component.filtroStatus.set('1');
    expect(component.presentesFiltrados().length).toBe(1);
  });

  it('deve calcular progresso corretamente', () => {
    const presente = { valor: 1000, contribuicoes: [{ valor: 300 }, { valor: 200 }] } as Presente;
    expect(component.calcularProgresso(presente)).toBe(50);
  });

  it('deve calcular valor restante', () => {
    const presente = { valor: 1000, contribuicoes: [{ valor: 600 }] } as Presente;
    expect(component.calcularValorRestante(presente)).toBe(400);
  });

  it('deve navegar para cadastrar pix quando não existe', () => {
    component.pix.set(null);
    component.adicionarPresente();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/eventos/cadastrar-qrcode/1/1']);
  });

  it('deve navegar para cadastrar presente quando pix existe', () => {
    component.pix.set({ id: 1 } as any);
    component.adicionarPresente();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['presentes/cadastrar/1']);
  });

  it('deve excluir presente disponível', () => {
    const presente = { id: 1, nome: 'TV', status: { id: 1, descricao: 'Disponível' } } as Presente;
    component.excluirPresente(presente);
    expect(mockModalService.openConfirmationModal).toHaveBeenCalled();
    expect(mockPresenteService.excluir).toHaveBeenCalledWith(1);
  });

  it('não deve excluir presente reservado', () => {
    const presente = { id: 1, nome: 'TV', status: { id: 2, descricao: 'Reservado' } } as Presente;
    component.excluirPresente(presente);
    expect(mockModalService.openErrorModal).toHaveBeenCalled();
    expect(mockPresenteService.excluir).not.toHaveBeenCalled();
  });

  it('deve retornar classe de status correta', () => {
    expect(component.getStatusClass(1)).toBe('status-disponivel');
    expect(component.getStatusClass(2)).toBe('status-parcial');
    expect(component.getStatusClass(3)).toBe('status-completo');
  });

  it('deve separar presentes por status', () => {
    component.presentes.set([
      { id: 1, status: { id: 1, descricao: 'Disponível' } } as Presente,
      { id: 2, status: { id: 2, descricao: 'Reservado' } } as Presente,
      { id: 3, status: { id: 3, descricao: 'Em Arrecadação' } } as Presente
    ]);
    expect(component.disponiveis().length).toBe(1);
    expect(component.reservados().length).toBe(1);
    expect(component.emArrecadacao().length).toBe(1);
  });
});
