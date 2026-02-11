import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalharPresenteComponent } from './detalhar-presente.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PresenteService } from '../../../../core/services/presente/presente.service';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { Location } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EnumStatusPresente } from '../../../../core/utils/enums/status-presente.enum';
import { PresenteDetalhesDto } from '../../../../core/models/presente.model';
import { TipoImagemEvento } from '../../../../core/models/imagem.model';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { EnumStatusContribuicao } from '../../../../core/utils/enums/status-contribuicao.enum';

describe('DetalharPresenteComponent', () => {
  let component: DetalharPresenteComponent;
  let fixture: ComponentFixture<DetalharPresenteComponent>;
  let mockPresenteService: any;
  let mockSpinnerService: any;
  let mockLocation: any;
  let mockRouter: any;

  const mockPresente: PresenteDetalhesDto = {
    id: 1,
    idEvento: 0,
    nome: 'Presente Teste',
    descricao: 'Descrição teste',
    valor: 1000,
    linkProduto: 'https://exemplo.com',
    status: { id: EnumStatusPresente.Disponivel, descricao: 'Disponível' },
    imagens: [
      {
        base64: 'data:image/png;base64,abc123',
        nomeArquivo: '',
        tipoImagem: TipoImagemEvento.Capa,
      },
    ],
    contribuicoes: [
      {
        id: 1,
        valor: 300,
        dataCadastro: '2024-01-01',
        participante: { nome: 'João', foto: '', id: 0 },
        status: { id: EnumStatusContribuicao.Confirmado, descricao: 'Confirmado' },
      },
      {
        id: 2,
        valor: 200,
        dataCadastro: '2024-01-02',
        participante: { nome: 'Maria', foto: '', id: 0 },
        status: { id: EnumStatusContribuicao.Confirmado, descricao: 'Confirmado' },
      },
    ],
    categoria: { id: 0, nome: 'Teste' },
  };

  beforeEach(async () => {
    mockPresenteService = { obterDetalhesPorId: jest.fn() };
    mockSpinnerService = { show: jest.fn(), hide: jest.fn() };
    mockLocation = { back: jest.fn() };
    mockRouter = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [DetalharPresenteComponent, NoopAnimationsModule, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: (k: string) => k === 'idEvento' ? '1' : '1' } } } },
        { provide: PresenteService, useValue: mockPresenteService },
        { provide: SpinnerService, useValue: mockSpinnerService },
        { provide: Location, useValue: mockLocation },
        { provide: Router, useValue: mockRouter },
        { provide: UsuarioService, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetalharPresenteComponent);
    component = fixture.componentInstance;
  });

  it('deve criar componente', () => {
    mockPresenteService.obterDetalhesPorId.mockReturnValue(of({ executouComSucesso: true, data: mockPresente }));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('deve carregar detalhes do presente', () => {
    component.idPresente = '1';
    mockPresenteService.obterDetalhesPorId.mockReturnValue(of({ executouComSucesso: true, data: mockPresente }));
    component.carregarDetalhes();
    expect(mockSpinnerService.show).toHaveBeenCalled();
    expect(mockPresenteService.obterDetalhesPorId).toHaveBeenCalledWith(1);
    expect(component.presente()).toEqual(mockPresente);
    expect(mockSpinnerService.hide).toHaveBeenCalled();
  });

  it('deve tratar erro ao carregar detalhes', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockPresenteService.obterDetalhesPorId.mockReturnValue(throwError(() => new Error('Erro')));
    component.carregarDetalhes();
    expect(mockSpinnerService.hide).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('deve retornar imagens do presente', () => {
    component.presente.set(mockPresente);
    expect(component.imagens.length).toBe(1);
    expect(component.hasImages).toBe(true);
    expect(component.hasMultipleImages).toBe(false);
  });

  it('deve retornar imagem atual', () => {
    component.presente.set(mockPresente);
    expect(component.currentImage).toBeTruthy();
  });

  it('deve calcular total arrecadado', () => {
    component.presente.set(mockPresente);
    expect(component.totalArrecadado).toBe(500);
  });

  it('deve calcular valor restante', () => {
    component.presente.set(mockPresente);
    expect(component.valorRestante).toBe(500);
  });

  it('deve navegar para próxima imagem', () => {
    component.presente.set({
      ...mockPresente, imagens: [{
        base64: 'img1',
        nomeArquivo: '',
        tipoImagem: TipoImagemEvento.Capa
      }, {
        base64: 'img2',
        nomeArquivo: '',
        tipoImagem: TipoImagemEvento.Capa
      }]
    });
    component.nextImage();
    expect(component.currentImageIndex).toBe(1);
    component.nextImage();
    expect(component.currentImageIndex).toBe(0);
  });

  it('deve navegar para imagem anterior', () => {
    component.presente.set({
      ...mockPresente, imagens: [{
        base64: 'img1',
        nomeArquivo: '',
        tipoImagem: TipoImagemEvento.Capa
      }, {
        base64: 'img2',
        nomeArquivo: '',
        tipoImagem: TipoImagemEvento.Capa
      }]
    });
    component.previousImage();
    expect(component.currentImageIndex).toBe(1);
  });

  it('deve ir para imagem específica', () => {
    component.presente.set({
      ...mockPresente, imagens: [{
        base64: 'img1',
        nomeArquivo: '',
        tipoImagem: TipoImagemEvento.Capa
      }, {
        base64: 'img2',
        nomeArquivo: '',
        tipoImagem: TipoImagemEvento.Capa
      }]
    });
    component.goToImage(1);
    expect(component.currentImageIndex).toBe(1);
  });

  it('deve voltar para página anterior', () => {
    component.voltar();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/presentes', component.idEvento]);
  });

  it('deve navegar para editar presente', () => {
    component.idEvento = '1';
    component.idPresente = '1';
    component.editarPresente();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/presentes/editar', '1', '1']);
  });

  it('deve retornar classe de status correta', () => {
    expect(component.getStatusClass({ id: EnumStatusPresente.Disponivel, descricao: 'Disponível' })).toBe('status-disponivel');
    expect(component.getStatusClass({ id: EnumStatusPresente.Reservado, descricao: 'Reservado' })).toBe('status-confirmado');
    expect(component.getStatusClass({ id: EnumStatusPresente.EmArrecadacao, descricao: 'Em Arrecadação' })).toBe('status-em-arrecadacao');
    expect(component.getStatusClass({ id: EnumStatusPresente.Finalizado, descricao: 'Finalizado' })).toBe('status-confirmado');
    expect(component.getStatusClass({ id: EnumStatusPresente.Cancelado, descricao: 'Cancelado' })).toBe('status-cancelado');
    expect(component.getStatusClass({ id: 99, descricao: 'Desconhecido' })).toBe('');
  });

  it('deve resolver foto do participante', () => {
    expect(component.resolverFoto('')).toBe('assets/icones/user-default.png');
    expect(component.resolverFoto('data:image/png;base64,abc')).toContain('data:image');
  });
});
