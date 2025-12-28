
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
        tipoImagem: TipoImagemEvento.Local
      },
      {
        base64: 'data:image/png;base64,BBB',
        nomeArquivo: '',
        tipoImagem: TipoImagemEvento.Local
      }
    ],
    contribuicoes: [
      { convidadoId: '1', valor: 1000 },
      { convidadoId: '2', valor: 2000 }
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
    component.presente = mockPresente;
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
    expect(img.src).toContain('data:image/png;base64,AAA');
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

  it('deve chamar editarPresente ao clicar em editar', () => {
    const spy = jest.spyOn(component, 'editarPresente');
    const items = openMenuAndGetItems();
    items[0].triggerEventHandler('click', null);
    expect(spy).toHaveBeenCalledWith(mockPresente);
  });

  it('deve chamar verContribuicoes ao clicar em ver contribuições', () => {
    const spy = jest.spyOn(component, 'verContribuicoes');
    const items = openMenuAndGetItems();
    items[1].triggerEventHandler('click', null);
    expect(spy).toHaveBeenCalledWith(mockPresente);
  });

  it('deve chamar excluirPresente ao clicar em excluir', () => {
    const spy = jest.spyOn(component, 'excluirPresente');
    const items = openMenuAndGetItems();
    items[2].triggerEventHandler('click', null);
    expect(spy).toHaveBeenCalledWith(mockPresente);
  });
});
