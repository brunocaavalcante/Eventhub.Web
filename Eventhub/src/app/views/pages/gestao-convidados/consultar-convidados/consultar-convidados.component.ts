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
import { ConvidadoService } from '../../../../core/services/convidado.service';
import { Convidado } from '../../../../core/models/convidado.model';
import { EnviarConviteComponent } from '../enviar-convite/enviar-convite.component';

@Component({
  selector: 'app-consultar-convidados',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, RouterLink, EnviarConviteComponent],
  templateUrl: './consultar-convidados.component.html',
  styleUrls: ['./consultar-convidados.component.scss']
})
export class ConsultarConvidadosComponent extends BaseComponent implements OnInit {
  filtroStatus: string = '';
  busca = signal('');
  convidados = signal<Convidado[]>([]);
  eventoId: string = '';
  tabAtiva: 'convidados' | 'convite' = 'convidados';
  private readonly convidadoService = inject(ConvidadoService);
  private readonly route = inject(ActivatedRoute);

  async ngOnInit() {
    // MOCK PARA TESTES
    const mockConvidados: Convidado[] = [
      { nome: 'Sofia Almeida', statusConfirmacao: 'Confirmado', acompanhante: 1, foto: 'https://randomuser.me/api/portraits/women/44.jpg' },
      { nome: 'Lucas Pereira', statusConfirmacao: 'Confirmado', acompanhante: 2, foto: 'https://randomuser.me/api/portraits/men/32.jpg' },
      { nome: 'Isabela Costa', statusConfirmacao: 'Pendente', foto: 'https://randomuser.me/api/portraits/women/65.jpg' },
      { nome: 'Rafael Souza', statusConfirmacao: 'Pendente', foto: 'https://randomuser.me/api/portraits/men/76.jpg' },
      { nome: 'Gabriel Santos', statusConfirmacao: 'Recusado', foto: 'https://randomuser.me/api/portraits/men/85.jpg' },
      { nome: 'Mariana Oliveira', statusConfirmacao: 'Recusado', foto: 'https://randomuser.me/api/portraits/women/68.jpg' },
      { nome: 'Pedro Silva', statusConfirmacao: 'Pendente envio convite', foto: 'https://randomuser.me/api/portraits/men/41.jpg' },
      { nome: 'Ana Carolina', statusConfirmacao: 'Pendente envio convite', foto: 'https://randomuser.me/api/portraits/women/22.jpg' }
    ];
    this.convidados.set(mockConvidados);

    this.eventoId = this.route.snapshot.paramMap.get('idEvento') || '';
    if (this.eventoId) {
      //const lista = await this.convidadoService.buscarConvidadosPorEvento(this.eventoId);
      //this.convidados.set(lista);
    }
  }

  confirmados = computed(() =>
    this.convidados().filter(c => c.statusConfirmacao === 'Confirmado' && this.filtraBusca(c))
  );
  pendentes = computed(() =>
    this.convidados().filter(c => c.statusConfirmacao === 'Pendente' && this.filtraBusca(c))
  );
  ausentes = computed(() =>
    this.convidados().filter(c => c.statusConfirmacao === 'Recusado' && this.filtraBusca(c))
  );
  pendenteEnvio = computed(() =>
    this.convidados().filter(c => c.statusConfirmacao === 'Pendente envio convite' && this.filtraBusca(c))
  );

  private filtraBusca(convidado: Convidado) {
    const busca = this.busca().toLowerCase();
    if (!busca) return true;
    return convidado.nome.toLowerCase().includes(busca);
  }

  exibeFoto(convidado: Convidado): boolean {
    // Suporte futuro: se houver campo foto, retorna true, senão false
    // Por padrão, retorna false (exibe ícone user)
    // Se quiser mockar, pode usar: return !!convidado['foto'];
    return false;
  }
}
