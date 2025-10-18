import { Component, inject, OnInit, signal, computed } from '@angular/core';
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
import { ConvidadoService } from '../../../../core/services/convidado.service';
import { PresenteService } from '../../../../core/services/presente.service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { Usuario } from '../../../../core/models/usuario.model';
import { Evento } from '../../../../core/models/evento.model';
import { getTipoEventoInfo } from '../../../../core/models/tipo-evento.model';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { DateUtils } from '../../../../core/utils/date.utils';

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
  private readonly spinner = inject(SpinnerService);
  private readonly convidadoService = inject(ConvidadoService);
  private readonly presenteService = inject(PresenteService);

  usuarioLogado = signal<Usuario | null>(null);
  eventosOriginais = signal<Evento[]>([]);
  filtroBusca = signal('');
  filtroStatus = signal('');

  meusEventos = computed(() => {
    const termo = this.filtroBusca().trim().toLowerCase();
    const status = this.filtroStatus();
    return this.eventosOriginais().filter(ev => {
      const tipoInfo = getTipoEventoInfo(ev.tipoEvento ?? 0);
      const nomeOuTipo = ev.nome.toLowerCase().includes(termo) || tipoInfo.descricao.toLowerCase().includes(termo);
      const statusOk = !status || (ev.status && ev.status.toLowerCase() === status);
      return nomeOuTipo && statusOk;
    });
  });

  async ngOnInit(): Promise<void> {
    this.spinner.show();
    try {
      await this.obterUsuario();
      const eventos = await this.service.buscarMeusEventos(this.usuarioLogado()!.uid!);
      this.eventosOriginais.set(eventos);
      await this.carregarInformacoesEventos();
    } finally {
      this.spinner.hide();
    }
  }

  /**
   * Carrega convidados confirmados e presentes para cada evento da lista.
   * Adiciona as informações diretamente em cada objeto evento.
   */
  async carregarInformacoesEventos(): Promise<void> {
    const eventos = this.eventosOriginais();
    const promises = eventos.map(async (evento: Evento) => {
      const [convidados, presentes] = await Promise.all([
        this.convidadoService.buscarConvidadosPorEvento(evento.id!),
        this.presenteService.buscarPresentesPorEvento(evento.id!)
      ]);
      evento.convidados = convidados;
      evento.presentes = presentes;
    });
    await Promise.all(promises);
    this.eventosOriginais.set([...eventos]);
    console.log('Eventos atualizados com convidados e presentes:', this.eventosOriginais());
  }

  obterConvidadosConfirmados = (eventoId: string) => {
    const evento = this.eventosOriginais().find(ev => ev.id === eventoId);
    return evento?.convidados?.filter(c => c.statusConfirmacao === 'Confirmado').length || 0;
  };

  obterPresentes = (eventoId: string) => {
    const evento = this.eventosOriginais().find(ev => ev.id === eventoId);
    return evento?.presentes?.length || 0;
  };

  async obterUsuario() {
    this.usuarioLogado.set(await this.userService.obterUsuarioLogado());
  }

  onBuscarEventos() {
    // Atualiza os signals para disparar o filtro reativo
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
