import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import { BaseComponent } from '../../../../core/components/base.component';
import { EventoService } from '../../../../core/services/evento.service';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { EventoUserDto, StatusEvento } from '../../../../core/models/evento.model';
import { DateUtils } from '../../../../core/utils/date.utils';
import { Base64ImageUtil } from '../../../../core/utils/base64-image.util';
import { getTipoEventoInfo } from '../../../../core/models/tipo-evento.model';

@Component({
  selector: 'app-visualizar-convite',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './visualizar-convite.component.html',
  styleUrl: './visualizar-convite.component.scss'
})
export class VisualizarConviteComponent extends BaseComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly eventoService = inject(EventoService);
  private readonly spinner = inject(SpinnerService);
  private readonly destroyRef = inject(DestroyRef);

  tokenEvento: string = '';
  evento = signal<EventoUserDto | null>(null);
  erroCarregamento = signal<string | null>(null);
  DateUtils = DateUtils;

  ngOnInit(): void {
    this.tokenEvento = this.route.snapshot.paramMap.get('id') || '';

    if (!this.tokenEvento) {
      this.erroCarregamento.set('Link inválido. Verifique o convite recebido.');
      return;
    }

    this.carregarEvento();
  }

  carregarEvento(): void {
    this.spinner.show();

    this.eventoService.buscarEventoPorToken(this.tokenEvento)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.spinner.hide())
      )
      .subscribe({
        next: (response) => {
          if (response.executouComSucesso && response.data) {
            const eventoData = response.data;

            // Verificar se evento foi cancelado
            if (eventoData.idStatus === StatusEvento.Cancelado) {
              this.erroCarregamento.set('Este evento foi cancelado.');
              return;
            }

            this.evento.set(eventoData);
          } else {
            this.erroCarregamento.set('Evento não encontrado ou link inválido.');
          }
        },
        error: () => {
          this.erroCarregamento.set('Não foi possível carregar o evento. Tente novamente.');
        }
      });
  }

  responderConvite(): void {
    this.router.navigate(['/participar-evento', this.tokenEvento, 'responder']);
  }

  getImagemCapa(): string {
    const evento = this.evento();
    if (!evento?.fotoCapaBase64) {
      return getTipoEventoInfo(evento?.idTipoEvento ?? 0)?.imagem;
    }
    return Base64ImageUtil.resolveImageSource(evento.fotoCapaBase64);
  }

  getEnderecoCompleto(): string {
    const evento = this.evento();
    if (!evento?.endereco) return '';

    const { nomeLocal, logradouro, numero, cidade } = evento.endereco;
    const partes = [];

    if (nomeLocal) partes.push(nomeLocal);
    if (logradouro) partes.push(`${logradouro}${numero ? ', ' + numero : ''}`);
    if (cidade) partes.push(cidade);

    return partes.join(' - ');
  }
}
