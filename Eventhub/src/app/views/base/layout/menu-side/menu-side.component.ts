import { Component, Input, Output, EventEmitter, computed, inject, DestroyRef, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { NotificacaoService } from '../../../../core/services/notificacao.service';
import { UsuarioInfoDTO } from '../../../../core/models/usuario.model';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MenuItem } from '../header/header.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, interval, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-menu-side',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatBadgeModule, RouterModule],
  templateUrl: './menu-side.component.html',
  styleUrl: './menu-side.component.scss'
})
export class MenuSideComponent implements OnInit {
  @Input({ required: true }) open = false;
  @Output() fecharMenuSide = new EventEmitter<void>();

  private readonly usuarioService = inject(UsuarioService);
  private readonly notificacaoService = inject(NotificacaoService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  usuario = signal<UsuarioInfoDTO | null>(null);
  contadorNotificacoes = signal<number>(0);

  public readonly loggedOutMenu: MenuItem[] = [
    { label: 'Início', route: '/', icon: 'home' },
    { label: 'Sobre nós', route: '/explorar', icon: 'info' },
    { label: 'Login', route: '/usuarios/login', icon: 'login' },
    { label: 'Criar Conta', route: '/usuarios/cadastro', icon: 'person_add' }
  ];

  public readonly loggedInMenu: MenuItem[] = [
    { label: 'Início', route: '/', icon: 'home' },
    { label: 'Meus Eventos', route: '/eventos/meus-eventos', icon: 'celebration' },
    { label: 'Chat do Evento', icon: 'chat', route: '/chat' },
    { label: 'Agenda', icon: 'event', route: '/agenda' },
    { label: 'Central de Notificações', icon: 'notifications', route: '/notificacoes' },
    { label: 'Perfil', route: '/perfil', icon: 'person' },
    { label: 'Configurações', icon: 'settings', route: '/configuracoes' },
  ];

  menuItems = computed(() => this.usuario() ? this.loggedInMenu : this.loggedOutMenu);

  constructor() {
    this.atualizarUsuarioLogado();
    this.observarNavegacao();
  }

  ngOnInit(): void {
    this.iniciarAtualizacaoNotificacoes();
  }

  private iniciarAtualizacaoNotificacoes(): void {
    // Atualizar contador a cada 60 segundos
    interval(60000)
      .pipe(
        startWith(0),
        switchMap(() => {
          const usuario = this.usuario();
          if (!usuario) return [];
          return this.notificacaoService.buscarNaoLidas(usuario.id);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (response) => {
          if (response?.executouComSucesso && response.data) {
            this.contadorNotificacoes.set(response.data.length);
          }
        },
        error: (error) => {
          console.error('Erro ao buscar notificações:', error);
        }
      });
  }

  private observarNavegacao(): void {
    this.router.events
      .pipe(
        filter((evento): evento is NavigationEnd => evento instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.atualizarUsuarioLogado());
  }

  private atualizarUsuarioLogado(): void {
    this.usuario.set(this.usuarioService.obterUsuarioLogado());
  }

  navegarPara(route: string): void {
    this.router.navigate([route]);
    this.fechar();
  }

  fechar() {
    this.fecharMenuSide.emit();
  }
}
