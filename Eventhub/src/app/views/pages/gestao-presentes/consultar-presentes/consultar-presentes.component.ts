import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { BaseComponent } from '../../../../core/components/base.component';
import { PresenteService } from '../../../../core/services/presente.service';
import { Presente } from '../../../../core/models/presente.model';
import { ModalConfirmComponent } from '../../../../core/components/modal/modal-confirm/modal-confirm.component';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { CardPresenteComponent } from './card-presente/card-presente.component';

@Component({
  selector: 'app-consultar-presentes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatMenuModule,
    MatChipsModule,
    MatProgressBarModule,
    MatDialogModule,
    CardPresenteComponent
  ],
  templateUrl: './consultar-presentes.component.html',
  styleUrl: './consultar-presentes.component.scss'
})
export class ConsultarPresentesComponent extends BaseComponent implements OnInit {
  private readonly acRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly presenteService = inject(PresenteService);
  private readonly spinner = inject(SpinnerService);

  presentes = signal<Presente[]>([]);
  busca = signal('');
  filtroStatus = signal<string>('');
  filtroCategoria = signal<string>('');
  eventoId = '';

  // Computed properties para filtros
  presentesFiltrados = computed(() => {
    let resultado = this.presentes();
    const busca = this.busca().toLowerCase();
    const status = this.filtroStatus();
    const categoria = this.filtroCategoria();

    if (busca) {
      resultado = resultado.filter(p =>
        p.nome.toLowerCase().includes(busca) ||
        p.descricao?.toLowerCase().includes(busca)
      );
    }

    if (status) {
      resultado = resultado.filter(p => p.status?.id === Number(status));
    }

    if (categoria) {
      // TODO: Adicionar filtro por categoria quando implementado
    }

    return resultado;
  });

  disponiveis = computed(() =>
    this.presentesFiltrados().filter(p => p.status?.id === 1)
  );

  parciais = computed(() =>
    this.presentesFiltrados().filter(p => p.status?.id === 2)
  );

  reservados = computed(() =>
    this.presentesFiltrados().filter(p => p.status?.id === 3)
  );

  ngOnInit(): void {
    this.eventoId = this.acRoute.snapshot.paramMap.get('idEvento') || '0';
    this.carregarPresentes();
  }

  carregarPresentes(): void {
    this.spinner.show();
    this.presenteService.obterPresentesPorEvento(this.eventoId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response.executouComSucesso) {
            console.log('Presentes carregados:', response.data);
            this.presentes.set(response.data || []);
          }

          this.spinner.hide();
        },
        error: (error) => {
          console.error('Erro ao carregar presentes:', error);
          this.spinner.hide();
        }
      });
  }

  calcularProgresso(presente: Presente): number {
    if (!presente.valor || presente.valor === 0) return 0;
    const totalContribuido = presente.contribuicoes?.reduce((sum, c) => sum + c.valor, 0) || 0;
    return Math.min((totalContribuido / presente.valor) * 100, 100);
  }

  calcularValorRestante(presente: Presente): number {
    if (!presente.valor) return 0;
    const totalContribuido = presente.contribuicoes?.reduce((sum, c) => sum + c.valor, 0) || 0;
    return Math.max(presente.valor - totalContribuido, 0);
  }

  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  getStatusLabel(status?: string): string {
    switch (status) {
      case 'disponivel': return 'Disponível';
      case 'parcial': return 'Parcialmente Reservado';
      case 'completo': return 'Reservado';
      default: return 'Desconhecido';
    }
  }

  getStatusClass(status?: number): string {
    switch (status) {
      case 1: return 'status-disponivel';
      case 2: return 'status-parcial';
      case 3: return 'status-completo';
      default: return '';
    }
  }

  editarPresente(presente: Presente): void {
    // TODO: Navegar para tela de edição
    console.log('Editar presente:', presente);
  }

  excluirPresente(presente: Presente): void {
    const dialogRef = this.dialog.open(ModalConfirmComponent, {
      data: {
        title: 'Confirmar Exclusão',
        message: `Deseja realmente excluir o presente "${presente.nome}"?`,
        confirmLabel: 'Excluir',
        cancelLabel: 'Cancelar'
      }
    });

    /*dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(confirmed => {
        if (confirmed && presente.id) {
          this.presenteService.remover(presente.id)
            .then(() => {
              this.dialog.open(ModalSucessComponent, {
                data: {
                  title: 'Presente Excluído',
                  message: 'O presente foi removido com sucesso.',
                  okLabel: 'Fechar'
                }
              });
              this.carregarPresentes();
            })
            .catch(error => {
              console.error('Erro ao excluir presente:', error);
              this.dialog.open(ModalErrorComponent, {
                data: {
                  title: 'Erro ao Excluir',
                  message: 'Não foi possível excluir o presente. Tente novamente.',
                  okLabel: 'Fechar'
                }
              });
            });
        }
      });*/
  }

  verContribuicoes(presente: Presente): void {
    // TODO: Abrir modal com lista de contribuições
    console.log('Ver contribuições:', presente);
  }

  get filtroStatusModel() {
    return this.filtroStatus();
  }

  set filtroStatusModel(value: string) {
    this.filtroStatus.set(value);
  }

  get filtroCategoriaModel() {
    return this.filtroCategoria();
  }

  set filtroCategoriaModel(value: string) {
    this.filtroCategoria.set(value);
  }
}
