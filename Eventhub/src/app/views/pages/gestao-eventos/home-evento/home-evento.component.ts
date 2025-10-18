import { Component, inject, OnInit } from '@angular/core';
import { DateUtils } from '../../../../core/utils/date.utils';
import { ActivatedRoute } from '@angular/router';
import { Evento } from '../../../../core/models/evento.model';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { BaseComponent } from '../../../../core/components/base.component';
import { CommonModule } from '@angular/common';
import { EventoService } from '../../../../core/services/evento.service';
import { ConvidadoService } from '../../../../core/services/convidado.service';
import { Usuario } from '../../../../core/models/usuario.model';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { getTipoEventoInfo } from '../../../../core/models/tipo-evento.model';

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
  private readonly convidadoService = inject(ConvidadoService);
  private readonly route = inject(ActivatedRoute);
  DateUtils: any = DateUtils;
  evento: Evento | null = null;
  usuario: Usuario | null = null;

  cards = [
    {
      icon: 'card_giftcard',
      title: 'Lista de Presentes',
      desc: 'Veja nossas sugestões',
      route: (id: string) => `/eventos/${id}/presentes`
    },
    {
      icon: 'groups',
      title: 'Convidados',
      desc: 'Gerencie seus convidados',
      route: (id: string) => `/convidados/consultar/${id}`
    },
    {
      icon: 'event_note',
      title: 'Agenda do Evento',
      desc: 'Programação completa',
      route: (id: string) => `/eventos/${id}/agenda`
    },
    {
      icon: 'photo_camera',
      title: 'Galeria',
      desc: 'Veja as fotos do evento',
      route: (id: string) => `/eventos/${id}/galeria`
    },
    {
      icon: 'favorite',
      title: 'Anfitriões',
      desc: 'Conheça mais sobre nós',
      route: (id: string) => `/eventos/${id}/anfitrioes`
    },
    {
      icon: 'message',
      title: 'Chat',
      desc: 'Grupo de Mensagens do Evento',
      route: (id: string) => `/eventos/${id}/chat`
    },
    {
      icon: 'savings',
      title: 'Orçamento',
      desc: 'Orçamento do Evento',
      route: (id: string) => `/eventos/${id}/orcamento`
    },
    {
      icon: 'settings',
      title: 'Configurações',
      desc: 'Configurações do Evento',
      route: (id: string) => `/eventos/${id}/configuracoes`
    },
    {
      icon: 'cancel',
      title: 'Cancelar',
      desc: 'Cancelar Evento',
      route: (id: string) => `/eventos/${id}/cancelar`
    },
  ];

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {

      this.spinner.show();
      try {
        this.usuario = await this.obterUsuarioLogado();
        this.evento = await this.buscarEventoPorId(id);
        this.evento!.convidados = await this.convidadoService.buscarConvidadosPorEvento(id);
        this.identificarPerfilUsuario();
        console.log(this.evento, this.usuario, this.isOrganizador, this.isConvidado);
      } finally {
        this.spinner.hide();
      }
    }
  }

  identificarPerfilUsuario() {
    if (!this.usuario || !this.evento) return;
    this.isOrganizador = !!this.evento.organizadores?.some(org => org.email === this.usuario!.email);
    this.isConvidado = !!this.evento.convidados?.some(conv => conv.email === this.usuario!.email);
  }

  async buscarEventoPorId(id: string): Promise<Evento | null> {
    try {
      return await this.service.buscarPorId(id);
    } catch (e) {
      return null;
    }
  }

  cardsVisiveis() {
    return this.cards.filter(card => {
      if ([
        'Orçamento',
        'Configurações',
        'Cancelar'
      ].includes(card.title)) {
        return this.isOrganizador;
      }
      return true;
    });
  }

  getTipoEventoInfo(tipo: number | undefined) {
    return getTipoEventoInfo(tipo ?? 0);
  }

}
