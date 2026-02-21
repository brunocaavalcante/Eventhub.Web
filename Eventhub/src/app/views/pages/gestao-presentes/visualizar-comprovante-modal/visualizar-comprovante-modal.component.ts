import { Component, Inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Imagem } from '../../../../core/models/imagem.model';
import { CurrencyBrPipe } from '../../../../core/utils/pipes/currency-br.pipe';
import { NotificationService } from '../../../../core/services/notification.service';

export interface VisualizarComprovanteData {
  comprovante: Imagem;
  nomeConvidado: string;
  valorContribuicao: number;
}

@Component({
  selector: 'app-visualizar-comprovante-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    CurrencyBrPipe
  ],
  templateUrl: './visualizar-comprovante-modal.component.html',
  styleUrl: './visualizar-comprovante-modal.component.scss'
})
export class VisualizarComprovanteModalComponent {
  zoom = signal<number>(100);
  imagemCarregada = signal<boolean>(false);

  zoomMin = 50;
  zoomMax = 300;
  zoomIncremento = 25;

  podeAumentarZoom = computed(() => this.zoom() < this.zoomMax);
  podeDiminuirZoom = computed(() => this.zoom() > this.zoomMin);

  imagemSrc: string;

  constructor(
    private dialogRef: MatDialogRef<VisualizarComprovanteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VisualizarComprovanteData,
    private notificationService: NotificationService
  ) {
    this.imagemSrc = this.resolverImagemComprovante();
  }

  resolverImagemComprovante(): string {
    try {
      return this.data.comprovante.url || '';
    } catch (error) {
      console.error('Erro ao carregar imagem do comprovante:', error);
      return '';
    }
  }

  onImageLoad(): void {
    this.imagemCarregada.set(true);
  }

  onImageError(): void {
    console.error('Erro ao carregar imagem');
    this.imagemCarregada.set(false);
  }

  zoomIn(): void {
    if (this.podeAumentarZoom()) {
      this.zoom.update(z => Math.min(z + this.zoomIncremento, this.zoomMax));
    }
  }

  zoomOut(): void {
    if (this.podeDiminuirZoom()) {
      this.zoom.update(z => Math.max(z - this.zoomIncremento, this.zoomMin));
    }
  }

  async download(): Promise<void> {
    if (!this.imagemCarregada()) {
      this.notificationService.showError('Aguarde o carregamento da imagem');
      return;
    }

    try {
      const nomeArquivo = this.gerarNomeArquivo();
      const imagemUrl = this.imagemSrc;

      // Criar elemento <a> temporário para forçar download
      const link = document.createElement('a');
      link.href = imagemUrl;
      link.download = nomeArquivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      this.notificationService.showSuccess('Comprovante baixado com sucesso');
    } catch (error) {
      console.error('Erro ao baixar comprovante:', error);
      this.notificationService.showError('Erro ao baixar comprovante');
    }
  }

  private gerarNomeArquivo(): string {
    const nomeFormatado = this.data.nomeConvidado
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9]+/g, '-')     // Substitui caracteres especiais por hífen
      .replace(/^-+|-+$/g, '');         // Remove hífens do início e fim

    const dataAtual = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const extensao = this.obterExtensaoImagem();

    return `comprovante-${nomeFormatado}-${dataAtual}.${extensao}`;
  }

  private obterExtensaoImagem(): string {
    const tipoArquivo = this.data.comprovante.tipoArquivo;
    
    if (tipoArquivo) {
      return tipoArquivo.replace('image/', '');
    }
    
    const url = this.data.comprovante.url || '';
    const match = url.match(/\.(png|jpe?g|webp|gif)($|\?)/i);
    if (match) {
      return match[1];
    }

    return 'png'; // Padrão
  }

  fechar(): void {
    this.dialogRef.close();
  }
}
