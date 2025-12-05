import { Component, Input, Output, EventEmitter, computed, inject, DestroyRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { UsuarioInfoDTO } from '../../../../core/models/usuario.model';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MenuItem } from '../header/header.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

@Component({
  selector: 'app-menu-side',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './menu-side.component.html',
  styleUrl: './menu-side.component.scss'
})
export class MenuSideComponent {
  @Input({ required: true }) open = false;
  @Output() fecharMenuSide = new EventEmitter<void>();

  private readonly usuarioService = inject(UsuarioService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  usuario = signal<UsuarioInfoDTO | null>(null);

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
