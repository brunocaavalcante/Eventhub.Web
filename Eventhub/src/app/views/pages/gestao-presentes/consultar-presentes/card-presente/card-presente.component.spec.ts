
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardPresenteComponent } from './card-presente.component';
import { Presente } from '../../../../../core/models/presente.model';
import { By } from '@angular/platform-browser';
import { CurrencyBrPipe } from '../../../../../core/utils/pipes/currency-br.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TipoImagemEvento } from '../../../../../core/models/imagem.model';
import { EnumStatusContribuicao } from '../../../../../core/utils/enums/status-contribuicao.enum';

describe('CardPresenteComponent', () => {
  let component: CardPresenteComponent;
  let fixture: ComponentFixture<CardPresenteComponent>;

  const mockActivatedRoute: any = {
    snapshot: {
      paramMap: {}
    }
  };

  const mockPresente: Presente = {
    id: 1,
    nome: 'Jogo de Jantar Cerâmica',
    descricao: 'Conjunto de pratos e tigelas',
    valor: 3000,
    status: { id: 1, descricao: 'Disponível' },
    imagens: [
      {
        base64: 'data:image/png;base64,AAA',
        nomeArquivo: '',
        tipoImagem: TipoImagemEvento.Local,
        tipoArquivo: ''
      },
      {
        base64: 'data:image/png;base64,BBB',
        nomeArquivo: '',
        tipoImagem: TipoImagemEvento.Local,
        tipoArquivo: ''
      }
    ],
    contribuicoes: [
      { id: 1, idPresente: 1, idParticipante: 1, valor: 2000, dataCadastro: new Date(), idStatusContribuicao: EnumStatusContribuicao.Confirmado },
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CardPresenteComponent,
        CurrencyBrPipe,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatCardModule,
        MatProgressBarModule,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: 'ActivatedRoute', useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CardPresenteComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('presente', mockPresente);
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir o nome do presente', () => {
    const nome = fixture.nativeElement.querySelector('.presente-nome');
    expect(nome.textContent).toContain('Jogo de Jantar Cerâmica');
  });

  it('deve exibir o valor formatado', () => {
    const valor = fixture.nativeElement.querySelector('.presente-valor');
    expect(valor.textContent).toContain('R$');
    expect(valor.textContent).toContain('3.000,00');
  });

  it('deve exibir a descrição', () => {
    const desc = fixture.nativeElement.querySelector('.presente-descricao');
    expect(desc.textContent).toContain('Conjunto de pratos e tigelas');
  });

  it('deve exibir o status', () => {
    const status = fixture.nativeElement.querySelector('.presente-status');
    expect(status.textContent).toContain('Disponível');
  });

  it('deve exibir o carrossel de imagens se houver imagens', () => {
    const carousel = fixture.nativeElement.querySelector('.carousel');
    expect(carousel).toBeTruthy();
    const img = carousel.querySelector('img');
    expect(img).toBeTruthy();
  });

  it('deve navegar para a próxima imagem ao chamar nextImage()', () => {
    expect(component.currentImageIndex).toBe(0);
    component.nextImage();
    expect(component.currentImageIndex).toBe(1);
    component.nextImage();
    expect(component.currentImageIndex).toBe(0);
  });

  it('deve navegar para a imagem anterior ao chamar previousImage()', () => {
    component.currentImageIndex = 1;
    component.previousImage();
    expect(component.currentImageIndex).toBe(0);
    component.previousImage();
    expect(component.currentImageIndex).toBe(1);
  });

  it('deve exibir o botão de menu', () => {
    const btnMenu = fixture.debugElement.query(By.css('.btn-menu'));
    expect(btnMenu).toBeTruthy();
  });

  it('deve exibir a seção de contribuição se houver contribuicoes', () => {
    const contrib = fixture.nativeElement.querySelector('.contribuicao');
    expect(contrib).toBeTruthy();
    expect(contrib.textContent).toContain('Cota compartilhada');
  });

  function openMenuAndGetItems() {
    // Abrir o menu
    const btnMenu = fixture.debugElement.query(By.css('.btn-menu'));
    btnMenu.nativeElement.click();
    fixture.detectChanges();
    // O Angular Material pode precisar de mais um ciclo para renderizar o menu
    return fixture.debugElement.queryAll(By.css('button[mat-menu-item]'));
  }

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('deve navegar para detalhes ao clicar em ver detalhes', () => {
    const items = openMenuAndGetItems();
    const linkElement = items[1].nativeElement;
    expect(linkElement.getAttribute('ng-reflect-router-link')).toContain('/presentes/detalhes');
  });

  it('deve chamar excluirPresente ao clicar em excluir', () => {
    const spy = jest.spyOn(component, 'excluirPresente');
    const items = openMenuAndGetItems();
    items[2].nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith(mockPresente);
  });

  describe('Funcionalidades de Reserva', () => {
    it('podeReservar deve retornar true para presente disponível', () => {
      const presenteSemContribuicoes: Presente = {
        ...mockPresente,
        status: { id: 1, descricao: 'Disponível' },
        contribuicoes: []
      };
      fixture.componentRef.setInput('presente', presenteSemContribuicoes);
      fixture.componentRef.setInput('idParticipanteLogado', 123);
      fixture.detectChanges();

      expect(component.podeReservar()).toBe(true);
    });

    it('podeReservar deve retornar true quando todas as contribuições estão canceladas', () => {
      const presenteComContribuicoesCanceladas: Presente = {
        ...mockPresente,
        status: { id: 1, descricao: 'Disponível' },
        contribuicoes: [
          { id: 1, idPresente: 1, idParticipante: 1, valor: 500, dataCadastro: new Date(), idStatusContribuicao: EnumStatusContribuicao.Cancelado },
          { id: 2, idPresente: 1, idParticipante: 2, valor: 300, dataCadastro: new Date(), idStatusContribuicao: EnumStatusContribuicao.Cancelado }
        ]
      };
      fixture.componentRef.setInput('presente', presenteComContribuicoesCanceladas);
      fixture.componentRef.setInput('idParticipanteLogado', 123);
      fixture.detectChanges();

      expect(component.podeReservar()).toBe(true);
    });

    it('podeReservar deve retornar false quando há contribuição não cancelada', () => {
      const presenteComContribuicaoAtiva: Presente = {
        ...mockPresente,
        status: { id: 1, descricao: 'Disponível' },
        contribuicoes: [
          { id: 1, idPresente: 1, idParticipante: 1, valor: 500, dataCadastro: new Date(), idStatusContribuicao: EnumStatusContribuicao.Confirmado }
        ]
      };
      fixture.componentRef.setInput('presente', presenteComContribuicaoAtiva);
      fixture.componentRef.setInput('idParticipanteLogado', 123);
      fixture.detectChanges();

      expect(component.podeReservar()).toBe(false);
    });

    it('podeReservar deve retornar false para presente reservado', () => {
      const presenteReservado: Presente = {
        ...mockPresente,
        status: { id: 2, descricao: 'Reservado' },
        contribuicoes: []
      };
      fixture.componentRef.setInput('presente', presenteReservado);
      fixture.componentRef.setInput('idParticipanteLogado', 123);
      fixture.detectChanges();

      expect(component.podeReservar()).toBe(false);
    });

    it('podeCancelarReserva deve retornar true quando usuário reservou o presente', () => {
      const presenteReservadoPorMim: Presente = {
        ...mockPresente,
        status: { id: 2, descricao: 'Reservado' },
        idParticipanteReservou: 123
      };
      fixture.componentRef.setInput('presente', presenteReservadoPorMim);
      fixture.componentRef.setInput('idParticipanteLogado', 123);
      fixture.detectChanges();

      expect(component.podeCancelarReserva()).toBe(true);
    });

    it('podeCancelarReserva deve retornar false quando outro usuário reservou', () => {
      const presenteReservadoPorOutro: Presente = {
        ...mockPresente,
        status: { id: 2, descricao: 'Reservado' },
        idParticipanteReservou: 456
      };
      fixture.componentRef.setInput('presente', presenteReservadoPorOutro);
      fixture.componentRef.setInput('idParticipanteLogado', 123);
      fixture.detectChanges();

      expect(component.podeCancelarReserva()).toBe(false);
    });

    it('deve emitir evento ao chamar reservarPresente', () => {
      const spy = jest.spyOn(component.reservar, 'emit');
      component.reservarPresente();
      expect(spy).toHaveBeenCalledWith(mockPresente);
    });

    it('deve emitir evento ao chamar cancelarReservaPresente', () => {
      const spy = jest.spyOn(component.cancelarReserva, 'emit');
      component.cancelarReservaPresente();
      expect(spy).toHaveBeenCalledWith(mockPresente);
    });
  });
});
