import { Component, EventEmitter, inject, signal, computed, DestroyRef } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth, user as afUser } from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';
import { UsuarioService } from '../../../../core/services/usuario.service';

type MenuItem = {
  label: string;
  route?: string;
  icon?: string;
  isButton?: boolean; // render as flat primary button when true
};

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly auth = inject(Auth);
  private readonly usuarioService = inject(UsuarioService);
  private readonly destroyRef = inject(DestroyRef);

  // Signals
  isMobile = signal(window.innerWidth <= 900);
  user = toSignal(afUser(this.auth), { initialValue: null });
  isLoggedIn = computed(() => !!this.user());
  avatarUrl = computed(() => this.user()?.photoURL || '');

  openMenuSide: EventEmitter<void> = new EventEmitter<void>();
  private readonly onResize = () => this.isMobile.set(window.innerWidth <= 900);

  // menu definitions (controlled here)
  private readonly loggedOutMenu: MenuItem[] = [
    { label: 'Início', route: '/' },
    { label: 'Sobre nós', route: '/explorar' },
    { label: 'Login', route: '/usuarios/login' },
    { label: 'Criar Conta', route: '/usuarios/cadastro', isButton: true }
  ];

  private readonly loggedInMenu: MenuItem[] = [
    { label: 'Início', route: '/' },
    { label: 'Meus Eventos', route: '/eventos/meus-eventos' },
    { label: 'Perfil', route: '/perfil' }
  ];

  menuItems = computed(() => this.isLoggedIn() ? this.loggedInMenu : this.loggedOutMenu);

  constructor() {
    window.addEventListener('resize', this.onResize);
    this.destroyRef.onDestroy(() => window.removeEventListener('resize', this.onResize));
  }

  toggleMenu() {
    this.openMenuSide.emit();
  }

  navigate(route?: string) {
    if (!route) return;
    this.router.navigate([route]);
  }

  login() {
    this.router.navigate(['usuarios/login']);
  }

  criarConta() {
    this.router.navigate(['usuarios/cadastro']);
  }

  async logout() {
    await this.usuarioService.logout();
    this.router.navigate(['/']);
  }
}
