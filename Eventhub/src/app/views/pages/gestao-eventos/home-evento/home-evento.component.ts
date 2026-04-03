import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { DateUtils } from '../../../../core/utils/date.utils';
import { ActivatedRoute } from '@angular/router';
import { EventoDto } from '../../../../core/models/evento.model';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { BaseComponent } from '../../../../core/components/base.component';
import { CommonModule } from '@angular/common';
import { EventoService } from '../../../../core/services/evento.service';
import { ParticipanteService } from '../../../../core/services/participante.service';
import { UsuarioInfoDTO } from '../../../../core/models/usuario.model';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { getTipoEventoInfo } from '../../../../core/models/tipo-evento.model';
import { getStatusEventoInfo } from '../../../../core/utils/evento-status.util';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PerfilService } from '../../../../core/services/perfil.service';
import { ModuloDto } from '../../../../core/models/sistema.model';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EnumPerfil } from '../../../../core/utils/enums/perfil-usuario.enum';
import { EnumEventoStatus } from '../../../../core/utils/enums/status-evento.enum';

@Component({
  selector: 'app-home-evento',
  imports: [MatIconModule, MatCardModule, CommonModule, RouterModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatTooltipModule],
  templateUrl: './home-evento.component.html',
  styleUrl: './home-evento.component.scss'
})
export class HomeEventoComponent extends BaseComponent implements OnInit {

  isConvidado = false;
  private readonly spinner = inject(SpinnerService);
  private readonly service = inject(EventoService);
  private readonly participanteService = inject(ParticipanteService);
  private readonly perfilService = inject(PerfilService);
  private readonly notificationService = inject(NotificationService);
  private readonly def = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  DateUtils: any = DateUtils;
  evento: EventoDto | null = null;
  usuario: UsuarioInfoDTO | null = null;
  idPerfil = signal<number | null>(null);
  cards = signal<ModuloDto[]>([]);
  EnumPerfil = EnumPerfil;
  EnumEventoStatus = EnumEventoStatus;

  linkEvento:string = '';

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
          this.linkEvento = `${window.location.origin}/participar-evento/${this.evento.tokenConvite}`;
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
          if (res.executouComSucesso && res.data && this.evento) {
            this.idPerfil.set(res.data.perfil.id);
            this.obterModulosPerfil(this.evento.id, res.data.perfil.id);
          }
        },
        error: (err) => {
          console.error('Erro ao obter participante:', err);
          this.spinner.hide();
        }
      });
  }

  obterModulosPerfil(idEvento: number, idPerfil: number) {
    this.perfilService.obterModulosPerfil(idEvento, idPerfil)
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

  voltar(): void {
    if (this.evento) {
      this.router.navigate([`/eventos/meus-eventos`]);
    }
  }

  copiarLink(input: HTMLInputElement): void {
    input.select();
    navigator.clipboard.writeText(input.value);
    this.notificationService.showSuccess('Link copiado! Envie para seus convidados.');
  }

  getTipoEventoInfo(tipo: number | undefined) {
    return getTipoEventoInfo(tipo ?? 0);
  }

  getStatusEventoInfo(idStatus: number | undefined) {
    return getStatusEventoInfo(idStatus);
  }
}
