import { Component, inject, OnInit, signal, computed, DestroyRef } from '@angular/core';
import { BaseComponent } from '../../../../core/components/base.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventoService } from '../../../../core/services/evento.service';
import { ParticipanteService } from '../../../../core/services/participante.service';
import { PresenteService } from '../../../../core/services/presente.service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { Usuario, UsuarioInfoDTO } from '../../../../core/models/usuario.model';
import { Evento, EventoStatusDto, EventoUserDto, StatusEvento } from '../../../../core/models/evento.model';
import { getTipoEventoInfo } from '../../../../core/models/tipo-evento.model';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { DateUtils } from '../../../../core/utils/date.utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-meus-eventos',
  templateUrl: './meus-eventos.component.html',
  styleUrl: './meus-eventos.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    RouterLink,
    FormsModule
  ]
})
export class MeusEventosComponent extends BaseComponent implements OnInit {
  private readonly service = inject(EventoService);
  private readonly participanteService = inject(ParticipanteService);
  private readonly spinner = inject(SpinnerService);
  private readonly destroyRef = inject(DestroyRef);

  usuarioLogado = signal<UsuarioInfoDTO | null>(null);
  eventosOriginais = signal<EventoUserDto[]>([]);
  status = signal<EventoStatusDto[]>([]);
  filtroBusca = signal('');
  filtroStatus = signal('');
  convidadosConfirmadosCache = signal<Map<number, number>>(new Map());

  meusEventos = computed(() => {
    const termo = this.filtroBusca().trim().toLowerCase();
    const statusFiltro = this.filtroStatus();

    return this.eventosOriginais().filter(ev => {
      const nomeOuTipo = ev.nome.toLowerCase().includes(termo) || ev.tipoEvento.toLowerCase().includes(termo);
      const statusOk = !statusFiltro || (ev.status !== undefined && ev.status.toLowerCase() === statusFiltro.toLowerCase());
      return nomeOuTipo && statusOk;
    });
  });

  async ngOnInit(): Promise<void> {
    this.spinner.show();
    try {
      this.obterUsuario();
      this.obterStatusEvento();
      this.obterMeusEventos();
    } finally {
      this.spinner.hide();
    }
  }

  obterMeusEventos() {
    this.service.buscarMeusEventos(this.usuarioLogado()!.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.eventosOriginais.set(response.data);
        response.data.forEach(evento => {
          if (evento.id) {
            this.carregarConvidadosConfirmados(evento.id);
          }
        });
      },
      error: (error) => {
        console.error('Erro ao buscar eventos:', error);
      }
    });
  }

  obterStatusEvento() {
    this.service.buscarStatusEventos().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        if (response.executouComSucesso) {
          this.status.set(response.data);
        }
      },
      error: (error) => {
        console.error('Erro ao buscar status dos eventos:', error);
      }
    });
  }

  carregarConvidadosConfirmados(eventoId: number) {
    this.participanteService.buscarParticipantesConfirmados(eventoId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (count) => {
          const cache = new Map(this.convidadosConfirmadosCache());
          cache.set(eventoId, count);
          this.convidadosConfirmadosCache.set(cache);
        },
        error: (error) => {
          console.error('Erro ao buscar convidados confirmados:', error);
        }
      });
  }

  obterConvidadosConfirmados(eventoId: number): number {
    return this.convidadosConfirmadosCache().get(eventoId) ?? 0;
  }

  obterUsuario() {
    this.usuarioLogado.set(this.userService.obterUsuarioLogado());
  }

  onBuscarEventos() {
    this.filtroBusca.set(this.filtroBusca());
    this.filtroStatus.set(this.filtroStatus());
  }

  getTipoEventoInfo(tipo: number | undefined) {
    return getTipoEventoInfo(tipo ?? 0);
  }

  onInputBusca(event: Event) {
    const value = (event.target as HTMLInputElement)?.value || '';
    this.filtroBusca.set(value);
    this.onBuscarEventos();
  }

  converterData(data: any): Date | null {
    return DateUtils.toDate(data);
  }
}
