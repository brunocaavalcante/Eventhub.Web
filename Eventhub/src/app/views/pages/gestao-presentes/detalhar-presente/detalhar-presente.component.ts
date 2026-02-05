import { Component, DestroyRef, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BaseComponent } from '../../../../core/components/base.component';
import { PresenteService } from '../../../../core/services/presente.service';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { ContribuicaoDetalhesDto, PresenteDetalhesDto, StatusPresenteDto } from '../../../../core/models/presente.model';
import { CurrencyBrPipe } from '../../../../core/utils/pipes/currency-br.pipe';
import { Base64ImageUtil } from '../../../../core/utils/base64-image.util';
import { DateUtils } from '../../../../core/utils/date.utils';
import { finalize } from 'rxjs';
import { TabelaGenericaComponent } from '../../../../core/components/tabela-generica/tabela-generica.component';
import { ConfigTabela } from '../../../../core/components/tabela-generica/tabela-generica.model';
import { EnumStatusPresente } from '../../../../core/utils/enums/status-presente.enum';
import { ModalSucessComponent } from '../../../../core/components/modal/modal-sucess/modal-sucess.component';
import { CancelarContribuicaoPresenteDto } from '../../../../core/models/contribuicao-presente.model';
import { CancelarContribuicaoPresenteComponent, CancelarContribuicaoResult } from '../contribuicao-presente/cancelar-contribuicao-presente/cancelar-contribuicao-presente.component';
import { VisualizarComprovanteModalComponent } from '../visualizar-comprovante-modal/visualizar-comprovante-modal.component';
import { MatSelectModule } from '@angular/material/select';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-detalhar-presente',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatSelectModule,
    MatBadgeModule,
    RouterModule,
    CurrencyBrPipe,
    TabelaGenericaComponent
  ],
  templateUrl: './detalhar-presente.component.html',
  styleUrl: './detalhar-presente.component.scss'
})
export class DetalharPresenteComponent extends BaseComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly presenteService = inject(PresenteService);
  private readonly spinner = inject(SpinnerService);
  private readonly destroyRef = inject(DestroyRef);

  presente = signal<PresenteDetalhesDto | null>(null);
  contribuicoesFiltradas = signal<ContribuicaoDetalhesDto[]>([]);
  filtroNome = signal('');
  filtroStatus = signal<string>('todos');
  currentImageIndex = 0;

  configTabela = computed<ConfigTabela<ContribuicaoDetalhesDto>>(() => ({
    colunas: [
      {
        chave: 'participante.foto',
        titulo: 'CONVIDADO',
        tipo: 'imagem',
        iconeAvatarPadrao: 'person',
        formatador: (_, linha) => linha.participante.nome
      },
      {
        chave: 'valor',
        titulo: 'VALOR',
        tipo: 'moeda',
        alinhamento: 'left'
      },
      {
        chave: 'dataCadastro',
        titulo: 'DATA',
        tipo: 'data'
      },
      {
        chave: 'status.descricao',
        titulo: 'STATUS',
        tipo: 'status'
      }
    ],
    acoes: [
      {
        label: 'Ver comprovante',
        icon: 'receipt',
        visivel: (contrib) => contrib.comprovante != null,
        handler: (contrib) => this.verComprovante(contrib)
      },
      {
        label: 'Confirmar contribuição',
        icon: 'check_circle',
        visivel: (contrib) => {
          const status = contrib.status?.descricao?.toLowerCase();
          return status !== 'confirmado' && status !== 'cancelado';
        },
        handler: (contrib) => {
          this.router.navigate(['/presentes', this.idEvento, 'detalhar', this.idPresente, 'contribuicoes', contrib.id, 'confirmar']);
        }
      },
      {
        label: 'Editar contribuição',
        icon: 'edit',
        visivel: (contrib) => {
          const status = contrib.status?.descricao?.toLowerCase();
          return status !== 'cancelado';
        },
        handler: (contrib) => {
          this.router.navigate(['/presentes/editar-contribuicao', this.idEvento, this.idPresente, contrib.id]);
        }
      },
      {
        label: 'Cancelar contribuição',
        icon: 'cancel',
        visivel: (contrib) => {
          const status = contrib.status?.descricao?.toLowerCase();
          return status !== 'cancelado';
        },
        handler: (contrib) => this.cancelarContribuicao(contrib)
      }
    ],
    placeholder: 'Filtrar por nome...',
    estadoVazio: {
      icone: 'sentiment_dissatisfied',
      mensagem: 'Nenhuma contribuição encontrada'
    },
    alturaMaxima: '600px',
    colunaImagemMobile: 'participante.foto',
    colunaPrincipalMobile: 'participante.nome',
    colunaStatusMobile: 'status.descricao'
  }));

  idEvento!: string;
  idPresente!: string;

  ngOnInit(): void {
    this.idEvento = this.route.snapshot.paramMap.get('idEvento')!;
    this.idPresente = this.route.snapshot.paramMap.get('id')!;
    this.carregarDetalhes();
  }

  carregarDetalhes(): void {
    this.spinner.show();

    this.presenteService.obterDetalhesPorId(Number(this.idPresente))
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.spinner.hide())
      )
      .subscribe({
        next: (response) => {
          if (response.executouComSucesso && response.data) {
            this.presente.set(response.data);
            this.atualizarContribuicoesFiltradas();
          }
        },
        error: (err) => {
          console.error('Erro ao carregar detalhes do presente:', err);
        }
      });
  }

  atualizarContribuicoesFiltradas(): void {
    const presente = this.presente();
    if (!presente?.contribuicoes) {
      this.contribuicoesFiltradas.set([]);
      return;
    }

    const status = this.filtroStatus();
    let contribuicoes = presente.contribuicoes;

    if (status !== 'todos') {
      contribuicoes = contribuicoes.filter(c =>
        c.status?.descricao?.toLowerCase() === status.toLowerCase()
      );
    }

    this.contribuicoesFiltradas.set(contribuicoes);
  }

  contarPorStatus(status: string): number {
    const presente = this.presente();
    if (!presente?.contribuicoes) return 0;

    if (status === 'todos') {
      return presente.contribuicoes.length;
    }

    return presente.contribuicoes.filter(c =>
      c.status?.descricao?.toLowerCase() === status.toLowerCase()
    ).length;
  }

  onFiltroStatusChange(novoStatus: string): void {
    this.filtroStatus.set(novoStatus);
    this.atualizarContribuicoesFiltradas();
  }

  get imagens(): string[] {
    const presente = this.presente();
    return presente?.imagens?.map(img => Base64ImageUtil.resolveImageSource(img.base64)) || [];
  }

  get hasImages(): boolean {
    return this.imagens.length > 0;
  }

  get hasMultipleImages(): boolean {
    return this.imagens.length > 1;
  }

  get currentImage(): string {
    return this.imagens[this.currentImageIndex] || '';
  }

  get totalArrecadado(): number {
    const presente = this.presente();

    if (!presente?.contribuicoes) return 0;
    return presente.contribuicoes
      .filter(contrib => {
        return contrib.status?.descricao?.toLowerCase() == "confirmado"
      })
      .reduce((total, contrib) => total + contrib.valor, 0);
  }

  get valorRestante(): number {
    const presente = this.presente();
    if (!presente?.valor) return 0;
    return Math.max(0, presente.valor - this.totalArrecadado);
  }

  nextImage(): void {
    if (this.hasMultipleImages) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.imagens.length;
    }
  }

  previousImage(): void {
    if (this.hasMultipleImages) {
      this.currentImageIndex = this.currentImageIndex === 0
        ? this.imagens.length - 1
        : this.currentImageIndex - 1;
    }
  }

  goToImage(index: number): void {
    if (index >= 0 && index < this.imagens.length) {
      this.currentImageIndex = index;
    }
  }


  formatarData(data: Date | string): string {
    return DateUtils.formatarDataBR(data);
  }

  resolverFoto(foto?: string): string {
    if (!foto) return 'assets/icones/user-default.png';
    return Base64ImageUtil.resolveImageSource(foto);
  }

  verComprovante(contribuicao: ContribuicaoDetalhesDto): void {
    if (!contribuicao.comprovante) {
      console.warn('Contribuição não possui comprovante');
      return;
    }

    this.dialog.open(VisualizarComprovanteModalComponent, {
      width: '90vw',
      height: '90vh',
      maxWidth: '1200px',
      maxHeight: '90vh',
      disableClose: false,
      panelClass: 'modal-fullscreen',
      data: {
        comprovante: contribuicao.comprovante,
        nomeConvidado: contribuicao.participante.nome,
        valorContribuicao: contribuicao.valor
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/presentes', this.idEvento]);
  }

  cancelarContribuicao(contribuicao: ContribuicaoDetalhesDto): void {
    const dialogRef = this.dialog.open(CancelarContribuicaoPresenteComponent, {
      width: '600px',
      maxWidth: '90vw',
      disableClose: true,
      data: { contribuicao }
    });

    dialogRef.afterClosed().subscribe((result: CancelarContribuicaoResult) => {
      if (result?.confirmado) {
        this.spinner.show();
        const model: CancelarContribuicaoPresenteDto = {
          idContribuicao: contribuicao.id,
          justificativa: result.justificativa!
        };
        this.presenteService.cancelarContribuicao(model)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (response) => {
              this.spinner.hide();
              console.log(response);
              if (response.executouComSucesso) {
                this.dialog.open(ModalSucessComponent, {
                  data: { title: 'Contribuição Cancelada', message: 'A contribuição foi cancelada com sucesso.' }
                })
                .afterClosed().subscribe(() => {
                  this.carregarDetalhes();
                });
              }
            },
            error: (err) => {
              console.error('Erro ao cancelar contribuição:', err);
              this.spinner.hide();
            }
          });
      }
    });
  }

  editarPresente(): void {
    this.router.navigate(['/presentes/editar', this.idEvento, this.idPresente]);
  }

  getStatusClass(status: StatusPresenteDto): string {
    switch (status.id) {
      case EnumStatusPresente.Disponivel:
        return 'status-disponivel';
      case EnumStatusPresente.Finalizado:
      case EnumStatusPresente.Reservado:
        return 'status-confirmado';
      case EnumStatusPresente.EmArrecadacao:
        return 'status-em-arrecadacao';
      case EnumStatusPresente.Cancelado:
        return 'status-cancelado';
      default:
        return '';
    }
  }
}

