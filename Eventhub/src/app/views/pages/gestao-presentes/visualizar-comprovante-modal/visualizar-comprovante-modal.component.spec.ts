import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { VisualizarComprovanteModalComponent, VisualizarComprovanteData } from './visualizar-comprovante-modal.component';
import { NotificationService } from '../../../../core/services/notification.service';
import { Imagem, TipoImagemEvento } from '../../../../core/models/imagem.model';

describe('VisualizarComprovanteModalComponent', () => {
  let component: VisualizarComprovanteModalComponent;
  let fixture: ComponentFixture<VisualizarComprovanteModalComponent>;
  let dialogRef: jest.Mocked<MatDialogRef<VisualizarComprovanteModalComponent>>;
  let notificationService: jest.Mocked<NotificationService>;

  const mockComprovante: Imagem = {
    id: 1,
    nomeArquivo: 'comprovante.png',
    base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    url: 'https://exemplo.com/comprovante.png',
    tipoArquivo: 'image/png',
    tipoImagem: TipoImagemEvento.Comprovante
  };

  const mockData: VisualizarComprovanteData = {
    comprovante: mockComprovante,
    nomeConvidado: 'João Silva',
    valorContribuicao: 150.00
  };

  beforeEach(async () => {
    const dialogRefMock = {
      close: jest.fn()
    };

    const notificationServiceMock = {
      showSuccess: jest.fn(),
      showError: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        VisualizarComprovanteModalComponent,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: NotificationService, useValue: notificationServiceMock }
      ]
    }).compileComponents();

    dialogRef = TestBed.inject(MatDialogRef) as jest.Mocked<MatDialogRef<VisualizarComprovanteModalComponent>>;
    notificationService = TestBed.inject(NotificationService) as jest.Mocked<NotificationService>;
    fixture = TestBed.createComponent(VisualizarComprovanteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar com zoom de 100%', () => {
    expect(component.zoom()).toBe(100);
  });

  it('deve receber os dados corretos via MAT_DIALOG_DATA', () => {
    expect(component.data).toEqual(mockData);
    expect(component.data.nomeConvidado).toBe('João Silva');
    expect(component.data.valorContribuicao).toBe(150.00);
  });

  it('deve resolver a imagem do comprovante corretamente', () => {
    expect(component.imagemSrc).toBeTruthy();
    expect(component.imagemSrc).toBe('https://exemplo.com/comprovante.png');
  });

  describe('Zoom In', () => {
    it('deve aumentar o zoom em 25%', () => {
      component.zoom.set(100);
      component.zoomIn();
      expect(component.zoom()).toBe(125);
    });

    it('deve aumentar o zoom até o máximo de 300%', () => {
      component.zoom.set(275);
      component.zoomIn();
      expect(component.zoom()).toBe(300);
    });

    it('não deve aumentar o zoom além de 300%', () => {
      component.zoom.set(300);
      component.zoomIn();
      expect(component.zoom()).toBe(300);
    });

    it('computed podeAumentarZoom deve retornar false quando zoom é 300%', () => {
      component.zoom.set(300);
      expect(component.podeAumentarZoom()).toBe(false);
    });

    it('computed podeAumentarZoom deve retornar true quando zoom é menor que 300%', () => {
      component.zoom.set(275);
      expect(component.podeAumentarZoom()).toBe(true);
    });
  });

  describe('Zoom Out', () => {
    it('deve diminuir o zoom em 25%', () => {
      component.zoom.set(100);
      component.zoomOut();
      expect(component.zoom()).toBe(75);
    });

    it('deve diminuir o zoom até o mínimo de 50%', () => {
      component.zoom.set(75);
      component.zoomOut();
      expect(component.zoom()).toBe(50);
    });

    it('não deve diminuir o zoom além de 50%', () => {
      component.zoom.set(50);
      component.zoomOut();
      expect(component.zoom()).toBe(50);
    });

    it('computed podeDiminuirZoom deve retornar false quando zoom é 50%', () => {
      component.zoom.set(50);
      expect(component.podeDiminuirZoom()).toBe(false);
    });

    it('computed podeDiminuirZoom deve retornar true quando zoom é maior que 50%', () => {
      component.zoom.set(75);
      expect(component.podeDiminuirZoom()).toBe(true);
    });
  });

  describe('Carregamento de Imagem', () => {
    it('deve marcar imagem como carregada ao chamar onImageLoad', () => {
      component.imagemCarregada.set(false);
      component.onImageLoad();
      expect(component.imagemCarregada()).toBe(true);
    });

    it('deve marcar imagem como não carregada ao chamar onImageError', () => {
      component.imagemCarregada.set(true);
      component.onImageError();
      expect(component.imagemCarregada()).toBe(false);
    });
  });

  describe('Download', () => {
    it('deve exibir erro se a imagem não estiver carregada', async () => {
      component.imagemCarregada.set(false);
      await component.download();
      expect(notificationService.showError).toHaveBeenCalledWith('Aguarde o carregamento da imagem');
    });

    it('deve exibir mensagem de sucesso após download', async () => {
      component.imagemCarregada.set(true);
      
      await component.download();

      expect(notificationService.showSuccess).toHaveBeenCalledWith('Comprovante baixado com sucesso');
    });

    it('deve formatar nome do arquivo corretamente removendo caracteres especiais', () => {
      const originalNome = component.data.nomeConvidado;
      component.data.nomeConvidado = 'José António Pereira';
      component.imagemCarregada.set(true);
      
      const nomeArquivo = (component as any).gerarNomeArquivo();
      
      expect(nomeArquivo).toContain('jose-antonio-pereira');
      expect(nomeArquivo).not.toContain('ã');
      expect(nomeArquivo).not.toContain('ó');
      
      // Restaurar nome original para outros testes
      component.data.nomeConvidado = originalNome;
    });
  });

  describe('Fechar Modal', () => {
    it('deve fechar o modal ao chamar fechar()', () => {
      component.fechar();
      expect(dialogRef.close).toHaveBeenCalled();
    });
  });

  describe('Obter Extensão da Imagem', () => {
    it('deve retornar png para imagem PNG', () => {
      component.data.comprovante.tipoArquivo = 'image/png';
      const extensao = (component as any).obterExtensaoImagem();
      expect(extensao).toBe('png');
    });

    it('deve retornar jpg para imagem JPEG', () => {
      component.data.comprovante.tipoArquivo = 'image/jpeg';
      const extensao = (component as any).obterExtensaoImagem();
      expect(extensao).toBe('jpeg');
    });

    it('deve retornar png como padrão para formato desconhecido', () => {
      component.data.comprovante.tipoArquivo = '';
      component.data.comprovante.url = 'https://exemplo.com/imagem';
      const extensao = (component as any).obterExtensaoImagem();
      expect(extensao).toBe('png');
    });

    it('deve extrair extensão da URL quando tipoArquivo não está disponível', () => {
      component.data.comprovante.tipoArquivo = '';
      component.data.comprovante.url = 'https://exemplo.com/foto.jpg';
      const extensao = (component as any).obterExtensaoImagem();
      expect(extensao).toBe('jpg');
    });
  });

  describe('Template', () => {
    it('deve exibir nome do convidado no cabeçalho', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.convidado-nome')?.textContent).toContain('João Silva');
    });

    it('deve exibir valor da contribuição formatado no cabeçalho', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.valor-contribuicao')).toBeTruthy();
    });

    it('deve exibir botões de zoom e download', () => {
      const compiled = fixture.nativeElement;
      const buttons = compiled.querySelectorAll('.modal-actions button');
      expect(buttons.length).toBeGreaterThanOrEqual(3);
    });

    it('deve exibir indicador de zoom', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.zoom-indicator')?.textContent).toContain('100%');
    });
  });
});
