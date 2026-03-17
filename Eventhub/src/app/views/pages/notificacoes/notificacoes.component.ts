import { Component, inject, OnInit, signal, computed, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import { BaseComponent } from '../../../core/components/base.component';
import { NotificacaoService } from '../../../core/services/notificacao.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SpinnerService } from '../../../core/services/spinner.service';
import { NotificacaoResponseDto, NotificacaoPrioridade } from '../../../core/models/notificacao.model';
import { UsuarioInfoDTO } from '../../../core/models/usuario.model';
import { DateUtils } from '../../../core/utils/date.utils';

interface GrupoNotificacoes {
  titulo: string;
  notificacoes: NotificacaoResponseDto[];
}

@Component({
  selector: 'app-notificacoes',
  templateUrl: './notificacoes.component.html',
  styleUrl: './notificacoes.component.scss',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule, RouterLink]
})
export class NotificacoesComponent extends BaseComponent implements OnInit {
  private readonly notificacaoService = inject(NotificacaoService);
  private readonly notification = inject(NotificationService);
  private readonly spinner = inject(SpinnerService);
  private readonly destroyRef = inject(DestroyRef);

  usuarioLogado = signal<UsuarioInfoDTO | null>(null);
  notificacoes = signal<NotificacaoResponseDto[]>([]);

  gruposNotificacoes = computed(() => this.agruparPorData(this.notificacoes()));
  contadorNaoLidas = computed(() => this.notificacoes().filter(n => !n.lida).length);

  ngOnInit(): void {
    this.obterUsuario();
    this.carregarNotificacoes();
  }

  obterUsuario(): void {
    this.usuarioLogado.set(this.userService.obterUsuarioLogado());
  }

  carregarNotificacoes(): void {
    const usuario = this.usuarioLogado();
    if (!usuario) return;

    this.spinner.show();
    this.notificacaoService.buscarPorUsuario(usuario.id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.spinner.hide())
      )
      .subscribe({
        next: (response) => {
          if (response?.executouComSucesso && response.data) {
            this.notificacoes.set(response.data);
          }
        },
        error: (error) => {
          console.error('Erro ao carregar notificações:', error);
          this.notification.showError('Erro ao carregar notificações');
        }
      });
  }

  marcarComoLida(notificacao: NotificacaoResponseDto): void {
    if (notificacao.lida) return;

    this.spinner.show();
    this.notificacaoService.marcarComoLida(notificacao.id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.spinner.hide())
      )
      .subscribe({
        next: (response) => {
          if (response?.executouComSucesso && response.data) {
            const notificacoesAtualizadas = this.notificacoes().map(n =>
              n.id === notificacao.id ? response.data : n
            );
            this.notificacoes.set(notificacoesAtualizadas);
          }
        },
        error: (error) => {
          console.error('Erro ao marcar como lida:', error);
          this.notification.showError('Erro ao marcar notificação como lida');
        }
      });
  }

  marcarTodasComoLidas(): void {
    const usuario = this.usuarioLogado();
    if (!usuario || this.contadorNaoLidas() === 0) {
      this.notification.showWarning('Não há notificações não lidas');
      return;
    }

    this.spinner.show();
    this.notificacaoService.marcarTodasComoLidas(usuario.id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.spinner.hide())
      )
      .subscribe({
        next: (response) => {
          if (response?.executouComSucesso) {
            this.notification.showSuccess('Todas marcadas como lidas');
            this.carregarNotificacoes();
          }
        },
        error: () => this.notification.showError('Erro ao marcar notificações')
      });
  }

  remover(notificacao: NotificacaoResponseDto, event: Event): void {
    event.stopPropagation();

    this.spinner.show();
    this.notificacaoService.remover(notificacao.id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.spinner.hide())
      )
      .subscribe({
        next: (response) => {
          if (response?.executouComSucesso) {
            const notificacoesAtualizadas = this.notificacoes().filter(n => n.id !== notificacao.id);
            this.notificacoes.set(notificacoesAtualizadas);
            this.notification.showSuccess('Notificação removida');
          }
        },
        error: (error) => {
          console.error('Erro ao remover notificação:', error);
          this.notification.showError('Erro ao remover notificação');
        }
      });
  }

  agruparPorData(notificacoes: NotificacaoResponseDto[]): GrupoNotificacoes[] {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const ontem = new Date(hoje);
    ontem.setDate(ontem.getDate() - 1);

    const grupos: GrupoNotificacoes[] = [
      { titulo: 'Hoje', notificacoes: [] },
      { titulo: 'Ontem', notificacoes: [] },
      { titulo: 'Anteriores', notificacoes: [] }
    ];

    notificacoes.forEach(n => {
      const data = this.converterData(n.dataEnvio);
      if (!data) return;
      
      data.setHours(0, 0, 0, 0);
      
      if (data.getTime() === hoje.getTime()) {
        grupos[0].notificacoes.push(n);
      } else if (data.getTime() === ontem.getTime()) {
        grupos[1].notificacoes.push(n);
      } else {
        grupos[2].notificacoes.push(n);
      }
    });

    return grupos.filter(g => g.notificacoes.length > 0);
  }

  obterCorIcone(prioridade: NotificacaoPrioridade): { bg: string, icon: string, icone: string } {
    const cores = {
      [NotificacaoPrioridade.Urgente]: { bg: '#fee', icon: '#d32f2f', icone: 'error' },
      [NotificacaoPrioridade.Alta]: { bg: '#fff3e0', icon: '#f57c00', icone: 'warning' },
      [NotificacaoPrioridade.Media]: { bg: '#e3f2fd', icon: '#1976d2', icone: 'info' },
      [NotificacaoPrioridade.Baixa]: { bg: '#f8f9ff', icon: '#7b1fa2', icone: 'notifications' }
    };
    return cores[prioridade] || cores[NotificacaoPrioridade.Media];
  }

  converterData(data: any): Date | null {
    return DateUtils.toDate(data);
  }

  formatarDataRelativa(data: any): string {
    const dataConvertida = this.converterData(data);
    if (!dataConvertida) return '';

    const agora = new Date();
    const diff = agora.getTime() - dataConvertida.getTime();
    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(diff / 3600000);

    if (minutos < 1) return 'Agora';
    if (minutos < 60) return `${minutos}min atrás`;
    if (horas < 24) return `${horas}h atrás`;
    
    return dataConvertida.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short'
    });
  }
}
