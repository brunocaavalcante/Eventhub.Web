import { Component, computed, DestroyRef, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { BaseComponent } from '../../../../core/components/base.component';
import { ProgramacaoEventoResponseDto } from '../../../../core/models/programacao-evento.model';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { ProgramacaoEventoService } from '../../../../core/services/programacao-evento.service';
import { ModalService } from '../../../../core/services/modal.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-consultar-programacao',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule
  ],
  templateUrl: './consultar-programacao.component.html',
  styleUrl: './consultar-programacao.component.scss'
})
export class ConsultarProgramacaoComponent extends BaseComponent implements OnInit, OnDestroy {
  private readonly acRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly programacaoService = inject(ProgramacaoEventoService);
  private readonly spinner = inject(SpinnerService);
  private readonly modalService = inject(ModalService);
  private readonly notificationService = inject(NotificationService);

  programacoes = signal<ProgramacaoEventoResponseDto[]>([]);
  busca = signal('');
  eventoId = 0;
  isMobile = signal(window.innerWidth < 600);

  // Computed property para filtrar programações
  programacoesFiltradas = computed(() => {
    const busca = this.busca().toLowerCase();
    const programacoes = this.programacoes();

    if (!busca) return programacoes;

    return programacoes.filter(p =>
      p.titulo.toLowerCase().includes(busca) ||
      p.descricao.toLowerCase().includes(busca) ||
      p.local.toLowerCase().includes(busca) ||
      p.responsavel.toLowerCase().includes(busca)
    );
  });

  ngOnInit(): void {
    this.eventoId = Number(this.acRoute.snapshot.paramMap.get('idEvento'));
    this.carregarProgramacoes();
    
    window.addEventListener('resize', this.handleResize);
  }

  private handleResize = () => {
    this.isMobile.set(window.innerWidth < 600);
  };

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.handleResize);
  }

  carregarProgramacoes(): void {
    this.spinner.show();
    this.programacaoService.buscarPorEvento(this.eventoId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.spinner.hide())
      )
      .subscribe({
        next: (response) => {
          if (response.data) {
            this.programacoes.set(response.data);
          }
        },
        error: (error) => {
          console.error('Erro ao carregar programações:', error);
          this.notificationService.showError('Erro ao carregar programações do evento');
        }
      });
  }

  adicionarProgramacao(): void {
    this.router.navigate(['/programacoes/cadastrar', this.eventoId]);
  }

  editarProgramacao(programacao: ProgramacaoEventoResponseDto): void {
    this.router.navigate(['/programacoes/editar', this.eventoId, programacao.id]);
  }

  excluirProgramacao(programacao: ProgramacaoEventoResponseDto): void {
    this.modalService.openConfirmationModal({
      title: 'Confirmar Exclusão',
      message: `Deseja realmente excluir a programação "${programacao.titulo}"?`,
      confirmLabel: 'Excluir',
      cancelLabel: 'Cancelar'
    }).subscribe((confirmado) => {
      if (confirmado) {
        this.spinner.show();
        this.programacaoService.remover(programacao.id)
          .pipe(
            takeUntilDestroyed(this.destroyRef),
            finalize(() => this.spinner.hide())
          )
          .subscribe({
            next: () => {
              this.notificationService.showSuccess('Programação excluída com sucesso');
              this.carregarProgramacoes();
            },
            error: (error) => {
              console.error('Erro ao excluir programação:', error);
              this.notificationService.showError('Erro ao excluir programação');
            }
          });
      }
    });
  }

  formatarHora(data: Date | string): string {
    return new Date(data).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatarDataCompleta(data: Date | string): string {
    return new Date(data).toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    }).replace(/^\w/, c => c.toUpperCase());
  }

  obterIcone(index: number): string {
    const icones = ['favorite', 'church', 'restaurant', 'cake', 'music_note', 'local_bar', 'photo_camera', 'celebration'];
    return icones[index % icones.length];
  }
}
