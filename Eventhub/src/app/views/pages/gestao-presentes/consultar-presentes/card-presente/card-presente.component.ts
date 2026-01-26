import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { Presente } from '../../../../../core/models/presente.model';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CurrencyBrPipe } from '../../../../../core/utils/pipes/currency-br.pipe';
import { RouterModule } from "@angular/router";
import { Base64ImageUtil } from '../../../../../core/utils/base64-image.util';
import { EnumStatusContribuicao } from '../../../../../core/utils/enums/status-contribuicao.enum';

@Component({
  selector: 'app-card-presente',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule,
    MatCardModule,
    MatMenuModule,
    CurrencyBrPipe,
    RouterModule
  ],
  templateUrl: './card-presente.component.html',
  styleUrl: './card-presente.component.scss'
})
export class CardPresenteComponent {
  @Input() presente!: Presente;
  @Output() excluir = new EventEmitter<Presente>();
  currentImageIndex = 0;

  get imagens(): string[] {
    return this.presente?.imagens?.map(img => Base64ImageUtil.resolveImageSource(img.base64)) || [];
  }

  get hasImages(): boolean {
    return this.imagens.length > 0;
  }

  get hasMultipleImages(): boolean {
    return this.imagens.length > 1;
  }

  get currentImage(): string {
    return this.imagens[this.currentImageIndex] || '';
  }

  nextImage(): void {
    if (this.hasMultipleImages) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.imagens.length;
    }
  }

  calcularProgresso(): number {
    if (!this.presente.valor || this.presente.valor === 0) {
      return 0;
    }
    const totalContribuido = this.retornaSomaContribuicoes();
    return Math.min((totalContribuido / this.presente.valor) * 100, 100);
  }

  retornaSomaContribuicoes(): number {
    if (!this.presente.contribuicoes || this.presente.contribuicoes.length === 0) {
      return 0;
    }
    return this.presente.contribuicoes
      .filter(contribuicao => {
        return contribuicao.status === EnumStatusContribuicao.Confirmado.toString();
      })
      .reduce((soma, contribuicao) => soma + contribuicao.valor, 0);
  }

  previousImage(): void {
    if (this.hasMultipleImages) {
      this.currentImageIndex = this.currentImageIndex === 0
        ? this.imagens.length - 1
        : this.currentImageIndex - 1;
    }
  }

  goToImage(index: number): void {
    if (index >= 0 && index < this.imagens.length) {
      this.currentImageIndex = index;
    }
  }

  excluirPresente(presente: Presente): void {
    this.excluir.emit(presente);
  }
}
