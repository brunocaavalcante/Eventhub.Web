
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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

@Component({
  selector: 'app-consultar-convidados',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  templateUrl: './consultar-convidados.component.html',
  styleUrls: ['./consultar-convidados.component.scss']
})
export class ConsultarConvidadosComponent extends BaseComponent implements OnInit {
  filtroStatus: string = '';
  busca = signal('');
  convidados = signal<Convidado[]>([]);
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
      { nome: 'Mariana Oliveira', statusConfirmacao: 'Recusado', foto: 'https://randomuser.me/api/portraits/women/68.jpg' }
    ];
    this.convidados.set(mockConvidados);
    // DESCOMENTE PARA USAR O SERVIÇO REAL
    // const eventoId = this.route.snapshot.paramMap.get('idEvento');
    // if (eventoId) {
    //   const lista = await this.convidadoService.buscarConvidadosPorEvento(eventoId);
    //   this.convidados.set(lista);
    // }
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
