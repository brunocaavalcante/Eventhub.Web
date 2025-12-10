import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { DateUtils } from '../../../../core/utils/date.utils';
import { ActivatedRoute } from '@angular/router';
import { EventoDto } from '../../../../core/models/evento.model';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { BaseComponent } from '../../../../core/components/base.component';
import { CommonModule } from '@angular/common';
import { EventoService } from '../../../../core/services/evento.service';
import { ParticipanteService } from '../../../../core/services/participante.service';
import { UsuarioInfoDTO } from '../../../../core/models/usuario.model';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { getTipoEventoInfo } from '../../../../core/models/tipo-evento.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PerfilService } from '../../../../core/services/perfil.service';
import { ModuloDto } from '../../../../core/models/sistema.model';

@Component({
  selector: 'app-home-evento',
  imports: [MatIconModule, CommonModule, RouterModule],
  templateUrl: './home-evento.component.html',
  styleUrl: './home-evento.component.scss'
})
export class HomeEventoComponent extends BaseComponent implements OnInit {

  isOrganizador = false;
  isConvidado = false;
  private readonly spinner = inject(SpinnerService);
  private readonly service = inject(EventoService);
  private readonly participanteService = inject(ParticipanteService);
  private readonly perfilService = inject(PerfilService);
  private readonly def = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  DateUtils: any = DateUtils;
  evento: EventoDto | null = null;
  usuario: UsuarioInfoDTO | null = null;
  cards = signal<ModuloDto[]>([]);

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.spinner.show();
      this.usuario = await this.obterUsuarioLogado();
      this.buscarEventoPorId(Number(id));
    }
  }

  buscarEventoPorId(id: number) {
    this.service.buscarEventoPorId(id).pipe(takeUntilDestroyed(this.def)).subscribe({
      next: (result) => {
        if (result.executouComSucesso && result.data) {
          this.evento = result.data;
          this.identificarPerfilUsuario();
        }
      },
      error: (err) => {
        console.error('Erro ao obter evento:', err);
        this.spinner.hide();
      }
    });
  }

  identificarPerfilUsuario() {
    if (!this.usuario || !this.evento) return;
    this.participanteService.obterParticipantePorIdUsuario(this.usuario.id, this.evento.id)
      .pipe(takeUntilDestroyed(this.def)).subscribe({
        next: (res) => {
          if (res.executouComSucesso && res.data) {
            this.obterModulosPerfil(res.data.perfil.id);
          }
        },
        error: (err) => {
          console.error('Erro ao obter participante:', err);
          this.spinner.hide();
        }
      });
  }

  obterModulosPerfil(idPerfil: number) {
    this.perfilService.obterModulosPerfil(idPerfil)
      .pipe(takeUntilDestroyed(this.def)).subscribe({
        next: (res) => {
          if (res.executouComSucesso && Array.isArray(res.data)) {
            this.cards.set(res.data);
          }
          this.spinner.hide();
        },
        error: (err) => {
          console.error('Erro ao obter módulos do perfil:', err);
          this.spinner.hide();
        }
      });
  }

  getTipoEventoInfo(tipo: number | undefined) {
    return getTipoEventoInfo(tipo ?? 0);
  }
}
