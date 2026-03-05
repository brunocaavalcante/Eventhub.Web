import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin, finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import { Presente, StatusPresenteDto } from '../../../../core/models/presente.model';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { CardPresenteComponent } from './card-presente/card-presente.component';
import { ModalService } from '../../../../core/services/modal.service';
import { EnumStatusPresente } from '../../../../core/utils/enums/status-presente.enum';
import { PixEventoService } from '../../../../core/services/pix-evento.service';
import { FinalidadePix } from '../../../../core/utils/enums/finalidade-pix.enum';
import { PixEventoDto } from '../../../../core/models/pix-evento.model';
import { PresenteService } from '../../../../core/services/presente/presente.service';

@Component({
  selector: 'app-consultar-presentes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
  private readonly pixEventoService = inject(PixEventoService);
  private readonly spinner = inject(SpinnerService);
  private readonly modalService = inject(ModalService);

  presentes = signal<Presente[]>([]);
  pix = signal<PixEventoDto | null>(null);
  statusPresente = signal<StatusPresenteDto[]>([]);
  busca = signal('');
  filtroStatus = signal<string>('');
  filtroCategoria = signal<string>('');
  eventoId = '';
  idParticipanteLogado = signal<number | undefined>(undefined);

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

  reservados = computed(() =>
    this.presentesFiltrados().filter(p => p.status?.id === 2)
  );

  emArrecadacao = computed(() =>
    this.presentesFiltrados().filter(p => p.status?.id === 3)
  );

  ngOnInit(): void {
    this.eventoId = this.acRoute.snapshot.paramMap.get('idEvento') || '0';
    const usuarioLogado = this.obterUsuarioLogado();
    if (usuarioLogado) {
      this.idParticipanteLogado.set(usuarioLogado.id);
    }
    this.carregarDados();
  }

  carregarDados(): void {
    this.spinner.show();
    forkJoin({
      presentes: this.presenteService.obterPresentesPorEvento(this.eventoId),
      status: this.presenteService.obterStatusPresente(),
      pix: this.pixEventoService.buscarPixEventoFinalidade(Number(this.eventoId), FinalidadePix.Presentes)
    })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.spinner.hide())
      )
      .subscribe({
        next: ({ presentes, status, pix }) => {
          if (presentes.executouComSucesso) {
            this.presentes.set(presentes.data || []);
          }
          if (status.executouComSucesso) {
            this.statusPresente.set(status.data || []);
          }
          if (pix.executouComSucesso) {
            this.pix.set(pix.data || null);
          }
        },
        error: (error) => {
          console.error('Erro ao carregar dados dos presentes:', error);
        }
      });
  }

  carregarPresentes(): void {
    this.spinner.show();
    this.presenteService.obterPresentesPorEvento(this.eventoId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.spinner.hide())
      )
      .subscribe({
        next: (response) => {
          if (response.executouComSucesso) {
            this.presentes.set(response.data || []);
          }
        },
        error: (error) => {
          console.error('Erro ao carregar presentes:', error);
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

  adicionarPresente(): void {
    if (this.pix() === null) {
      this.router.navigate([`/eventos/cadastrar-qrcode/${this.eventoId}/${FinalidadePix.Presentes}`]);
    }
    else {
      this.router.navigate([`presentes/cadastrar/${this.eventoId}`]);
    }
  }

  excluirPresente(presente: Presente): void {
    if (!this.podeExcluirPresente(presente)) {
      return;
    }

    this.modalService.openConfirmationModal({
      title: 'Confirmar Exclusão',
      message: `Deseja realmente excluir o presente "${presente.nome}"?`,
      confirmLabel: 'Excluir',
      cancelLabel: 'Cancelar'
    }).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed: any) => {
        if (confirmed) {
          this.spinner.show();
          this.presenteService.excluir(presente.id!)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: (response) => {
                if (response.executouComSucesso) {
                  this.presentes.update(presentes => presentes.filter(p => p.id !== presente.id));
                  this.modalService.openSuccessModal({
                    title: 'Presente Excluído',
                    message: `O presente "${presente.nome}" foi excluído com sucesso.`
                  });
                }
                this.spinner.hide();
              },
              error: (error) => {
                console.error('Erro ao excluir presente:', error);
                this.spinner.hide();
              }
            });
        }
      });
  }

  private podeExcluirPresente(presente: Presente): boolean {
    // Só permite exclusão se status for Disponível (1)
    if (presente.status?.id !== EnumStatusPresente.Disponivel) {
      let statusMsg = '';
      switch (presente.status?.id) {
        case EnumStatusPresente.Reservado:
          statusMsg = 'está Reservado e não pode ser excluído.';
          break;
        case EnumStatusPresente.EmArrecadacao:
          statusMsg = 'está em Arrecadação e não pode ser excluído.';
          break;
        case EnumStatusPresente.Finalizado:
          statusMsg = 'já foi Finalizado e não pode ser excluído.';
          break;
        default:
          statusMsg = 'não pode ser excluído.';
      }
      this.modalService.openErrorModal({
        title: 'Exclusão não permitida',
        message: `O presente "${presente.nome}" ${statusMsg}`
      });
      return false;
    }
    return true;
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

  reservarPresente(presente: Presente): void {
    if (!presente.id || !this.idParticipanteLogado()) {
      this.modalService.openErrorModal({
        title: 'Erro',
        message: 'Não foi possível reservar o presente. Tente novamente.'
      });
      return;
    }

    this.modalService.openConfirmationModal({
      title: 'Confirmar Reserva',
      message: `
        <p>Deseja reservar o presente: "${presente.nome}", valor: ${this.formatarMoeda(presente.valor || 0)}? O organizador será notificado.</p>
         ${presente.linkProduto ? `<strong>Link:</strong> <a href="${presente.linkProduto}" target="_blank">${presente.linkProduto}</a><br/>` : ''}
      `,
      confirmLabel: 'Sim, Reservar',
      cancelLabel: 'Cancelar'
    }).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed: any) => {
        if (confirmed) {
          this.confirmarReserva(presente);
        }
      });
  }

  private confirmarReserva(presente: Presente): void {
    this.spinner.show();
    this.presenteService.reservarPresente({
      idPresente: presente.id!,
      idParticipante: this.idParticipanteLogado()!
    }).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response.executouComSucesso) {
            this.carregarPresentes();
            this.modalService.openSuccessModal({
              title: 'Presente Reservado!',
              message: 'Presente reservado com sucesso! O organizador foi notificado.'
            });
          } else {
            this.modalService.openErrorModal({
              title: 'Erro ao Reservar',
              message: response.erros?.join(', ') || 'Não foi possível reservar o presente.'
            });
          }
          this.spinner.hide();
        },
        error: (error) => {
          console.error('Erro ao reservar presente:', error);
          this.modalService.openErrorModal({
            title: 'Erro ao Reservar',
            message: error.error?.erros?.join(', ') || 'Não foi possível reservar o presente. Tente novamente.'
          });
          this.spinner.hide();
        }
      });
  }

  cancelarReserva(presente: Presente): void {
    if (!presente.id || !this.idParticipanteLogado()) {
      this.modalService.openErrorModal({
        title: 'Erro',
        message: 'Não foi possível cancelar a reserva. Tente novamente.'
      });
      return;
    }

    this.modalService.openInputModal({
      title: 'Cancelar Reserva',
      message: `Tem certeza que deseja cancelar a reserva do presente "${presente.nome}"?`,
      inputLabel: 'Motivo do cancelamento *',
      inputPlaceholder: 'Informe o motivo do cancelamento (mínimo 10 caracteres)',
      inputType: 'textarea',
      confirmLabel: 'Sim, Cancelar',
      cancelLabel: 'Voltar',
      inputRequired: true,
      inputMinLength: 10,
      inputMaxLength: 500
    }, { width: '700px' }).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((justificativa: string | null) => {
        if (justificativa) {
          this.confirmarCancelamentoReserva(presente, justificativa);
        }
      });
  }

  private confirmarCancelamentoReserva(presente: Presente, justificativa: string): void {
    this.spinner.show();
    this.presenteService.cancelarReserva({
      idPresente: presente.id!,
      idParticipante: this.idParticipanteLogado()!,
      justificativa
    }).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response.executouComSucesso) {
            this.carregarPresentes();
            this.modalService.openSuccessModal({
              title: 'Reserva Cancelada',
              message: 'Reserva cancelada com sucesso. O presente voltou a ficar disponível.'
            });
          } else {
            this.modalService.openErrorModal({
              title: 'Erro ao Cancelar',
              message: response.erros?.join(', ') || 'Não foi possível cancelar a reserva.'
            });
          }
          this.spinner.hide();
        },
        error: (error) => {
          console.error('Erro ao cancelar reserva:', error);
          this.modalService.openErrorModal({
            title: 'Erro ao Cancelar',
            message: error.error?.erros?.join(', ') || 'Não foi possível cancelar a reserva. Tente novamente.'
          });
          this.spinner.hide();
        }
      });
  }

  voltar(): void {
    this.router.navigate([`/eventos/home/${this.eventoId}`]);
  }

  set filtroCategoriaModel(value: string) {
    this.filtroCategoria.set(value);
  }
}
