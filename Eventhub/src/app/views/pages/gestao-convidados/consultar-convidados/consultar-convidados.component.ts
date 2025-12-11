import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../../../core/components/base.component';
import { ParticipanteService } from '../../../../core/services/participante.service';
import { ListarConvidadosDto } from '../../../../core/models/participante.model';
import { EnviarConviteComponent } from '../enviar-convite/enviar-convite.component';
import { EnumStatusEnvioConvite } from '../../../../core/utils/enums/status-envio-convite.enum';

@Component({
  selector: 'app-consultar-convidados',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, RouterLink, EnviarConviteComponent],
  templateUrl: './consultar-convidados.component.html',
  styleUrls: ['./consultar-convidados.component.scss']
})
export class ConsultarConvidadosComponent extends BaseComponent implements OnInit {
  filtroStatus = signal('');
  busca = signal('');
  convidados = signal<ListarConvidadosDto[]>([]);
  eventoId: string = '';
  tabAtiva: 'convidados' | 'convite' = 'convidados';
  private readonly participanteService = inject(ParticipanteService);
  private readonly route = inject(ActivatedRoute);

  async ngOnInit() {

    this.eventoId = this.route.snapshot.paramMap.get('idEvento') || '';
    if (this.eventoId) {
      this.obterConvidados();
    }
  }

  obterConvidados() {
    this.participanteService.obterConvidadosPorIdEvento(Number(this.eventoId)).subscribe({
      next: (result) => {
        if (result.executouComSucesso && result.data) {
          this.convidados.set(result.data);
        }
      },
      error: (err) => {
        console.error('Erro ao obter convidados:', err);
      }
    });
  }

  get filtroStatusModel() {
    return this.filtroStatus();
  }

  set filtroStatusModel(value: string) {
    this.filtroStatus.set(value);
  }

  confirmados = computed(() => {
    if (this.filtroStatus() && this.filtroStatus() !== 'confirmado') return [];
    return this.convidados().filter(c => c.statusConfirmacao === EnumStatusEnvioConvite.Confirmado && this.filtraBusca(c));
  });
  pendentes = computed(() => {
    if (this.filtroStatus() && this.filtroStatus() !== 'pendente') return [];
    return this.convidados().filter(c => c.statusConfirmacao === EnumStatusEnvioConvite.Pendente && this.filtraBusca(c));
  });
  ausentes = computed(() => {
    if (this.filtroStatus() && this.filtroStatus() !== 'ausente') return [];
    return this.convidados().filter(c => c.statusConfirmacao === EnumStatusEnvioConvite.Recusado && this.filtraBusca(c));
  });
  pendenteEnvio = computed(() => {
    if (this.filtroStatus() && this.filtroStatus() !== 'pendente-envio') return [];
    return this.convidados().filter(c => c.statusConfirmacao === EnumStatusEnvioConvite.PendenteEnvio && this.filtraBusca(c));
  });

  private filtraBusca(convidado: ListarConvidadosDto) {
    const busca = this.busca().toLowerCase();
    if (!busca) return true;
    return convidado.nome.toLowerCase().includes(busca);
  }
}
