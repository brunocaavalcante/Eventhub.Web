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
        chave: 'status',
        titulo: 'STATUS',
        tipo: 'status'
      }
    ],
    acoes: [
      {
        label: 'Ver comprovante',
        icon: 'receipt',
        handler: (contrib) => this.verComprovante(contrib)
      },
      {
        label: 'Editar contribuição',
        icon: 'edit',
        handler: (contrib) => {
          this.router.navigate(['/presentes', this.idEvento, 'detalhar', this.idPresente, 'contribuicoes', contrib.id, 'editar']);
        }
      },
      {
        label: 'Cancelar contribuição',
        icon: 'cancel',
        handler: (contrib) => {
          this.router.navigate(['/presentes', this.idEvento, 'detalhar', this.idPresente, 'contribuicoes', contrib.id, 'cancelar']);
        }
      },
      {
        label: 'Confirmar contribuição',
        icon: 'check_circle',
        handler: (contrib) => {
          this.router.navigate(['/presentes', this.idEvento, 'detalhar', this.idPresente, 'contribuicoes', contrib.id, 'confirmar']);
        }
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
    colunaStatusMobile: 'status'
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
            this.contribuicoesFiltradas.set(response.data.contribuicoes || []);
          }
        },
        error: (err) => {
          console.error('Erro ao carregar detalhes do presente:', err);
        }
      });
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
    return presente.contribuicoes.reduce((total, contrib) => total + contrib.valor, 0);
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
    console.log('Ver comprovante:', contribuicao);
    // TODO: Implementar visualização de comprovante
  }

  voltar(): void {
    this.location.back();
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

