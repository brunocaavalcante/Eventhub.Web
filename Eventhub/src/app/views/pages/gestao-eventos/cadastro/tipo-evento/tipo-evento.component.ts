import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TipoEventoService } from '../../../../../core/services/tipo-evento.service';
import { TipoEvento } from '../../../../../core/models/evento.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RetornoAPI } from '../../../../../core/models/retorno-api.model';

@Component({
  selector: 'app-tipo-evento',
  imports: [CommonModule, MatIconModule, RouterLink],
  templateUrl: './tipo-evento.component.html',
  styleUrl: './tipo-evento.component.scss'
})
export class TipoEventoComponent implements OnInit {

  private readonly tipoEventoService = inject(TipoEventoService);
  private readonly destroyRef = inject(DestroyRef);

  eventTypes: TipoEvento[] = [];
  ngOnInit(): void {
    this.buscarTiposEvento();
  }

  buscarTiposEvento(): void {
    this.tipoEventoService.obterTiposEvento().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: async (tiposEvento: RetornoAPI<TipoEvento[]>) => {
        if (tiposEvento.executouComSucesso && tiposEvento.data) {
          this.eventTypes = tiposEvento.data;
        }
      },
      error: (error: any) => {
        console.error('Erro ao buscar tipos de evento:', error);
      }
    });
  }
}