import { Component, computed, EventEmitter, input, Input, Output, signal } from '@angular/core';
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
import { EnumStatusContribuicao } from '../../../../../core/utils/enums/status-contribuicao.enum';
import { EnumStatusPresente } from '../../../../../core/utils/enums/status-presente.enum';

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
  presente = input.required<Presente>();
  idParticipanteLogado = input<number>();
  @Output() excluir = new EventEmitter<Presente>();
  @Output() reservar = new EventEmitter<Presente>();
  @Output() cancelarReserva = new EventEmitter<Presente>();

  currentImageIndex = 0;

  // Computed properties para controle de exibição dos botões
  podeReservar = computed(() => {
    const presente = this.presente();
    if (!presente) return false;

    const statusDisponivel = presente.status?.id === EnumStatusPresente.Disponivel;
    const semContribuicoes = !presente.contribuicoes || presente.contribuicoes.length === 0;

    return statusDisponivel && semContribuicoes;
  });

  podeCancelarReserva = computed(() => {
    const presente = this.presente();
    const idLogado = this.idParticipanteLogado();
    if (!presente || !idLogado) return false;

    const statusReservado = presente.status?.id === EnumStatusPresente.Reservado;
    const reservouEstePresente = presente.idParticipanteReservou === idLogado;

    return statusReservado && reservouEstePresente;
  });

  podeContribuir = computed(() => {
    const presente = this.presente();
    if (!presente) return false;
    const statusDisponivel = presente.status?.id === EnumStatusPresente.Disponivel ||
      presente.status?.id === EnumStatusPresente.EmArrecadacao;
    return statusDisponivel;
  });

  estaReservadoPorOutro = computed(() => {
    const presente = this.presente();
    const idLogado = this.idParticipanteLogado();
    if (!presente || !idLogado) return false;

    const statusReservado = presente.status?.id === EnumStatusPresente.Reservado;
    const reservadoPorOutro = presente.idParticipanteReservou !== idLogado;

    return statusReservado && reservadoPorOutro;
  });

  get imagens(): string[] {
    const presente = this.presente();
    return presente?.imagens?.map(img => img.url || '') || [];
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
    const presente = this.presente();
    if (!presente.valor || presente.valor === 0) {
      return 0;
    }
    const totalContribuido = this.retornaSomaContribuicoes();
    return Math.min((totalContribuido / presente.valor) * 100, 100);
  }

  retornaSomaContribuicoes(): number {
    const presente = this.presente();
    if (!presente.contribuicoes || presente.contribuicoes.length === 0) {
      return 0;
    }
    return presente.contribuicoes
      .filter(contribuicao => {
        return contribuicao.idStatusContribuicao === EnumStatusContribuicao.Confirmado;
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

  reservarPresente(): void {
    this.reservar.emit(this.presente());
  }

  cancelarReservaPresente(): void {
    this.cancelarReserva.emit(this.presente());
  }
}
