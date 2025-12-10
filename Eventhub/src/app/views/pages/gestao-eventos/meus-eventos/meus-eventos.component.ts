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
import { UsuarioInfoDTO } from '../../../../core/models/usuario.model';
import { EventoStatusDto, EventoUserDto } from '../../../../core/models/evento.model';
import { getTipoEventoInfo } from '../../../../core/models/tipo-evento.model';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { DateUtils } from '../../../../core/utils/date.utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, forkJoin } from 'rxjs';

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

  ngOnInit(): void {
    this.spinner.show();
    this.obterUsuario();

    const usuario = this.usuarioLogado();
    if (!usuario) {
      this.spinner.hide();
      return;
    }

    forkJoin({
      status: this.service.buscarStatusEventos(),
      eventos: this.service.buscarMeusEventos(usuario.id)
    })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.spinner.hide())
      )
      .subscribe({
        next: ({ status, eventos }) => {
          if (status?.executouComSucesso) {
            this.status.set(status.data);
          }

          if (eventos?.executouComSucesso && eventos.data) {
            this.eventosOriginais.set(eventos.data);
            eventos.data.forEach(evento => {
              if (evento.id) {
                this.carregarConvidadosConfirmados(evento.id);
              }
            });
          }
        },
        error: (error) => {
          console.error('Erro ao carregar dados iniciais:', error);
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
