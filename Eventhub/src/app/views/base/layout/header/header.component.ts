import { Component, EventEmitter, inject, signal, computed, DestroyRef, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { UsuarioInfoDTO } from '../../../../core/models/usuario.model';
import { AuthService } from '../../../../core/services/auth.service';

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
export class HeaderComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly destroyRef = inject(DestroyRef);

  // Signals
  isMobile = signal(window.innerWidth <= 900);
  user = signal<UsuarioInfoDTO | null>(null);
  avatarUrl = computed(() => this.user()?.foto || '');

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

  menuItems = computed(() => this.user() ? this.loggedInMenu : this.loggedOutMenu);

  ngOnInit(): void {
    this.iniciarMonitoramentoDeTela();
    this.atualizarUsuarioLogado();
    this.observarNavegacao();
  }

  private iniciarMonitoramentoDeTela(): void {
    window.addEventListener('resize', this.onResize);
    this.destroyRef.onDestroy(() => window.removeEventListener('resize', this.onResize));
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
    this.user.set(this.usuarioService.obterUsuarioLogado());
  }

  alternarMenuLateral(): void {
    this.openMenuSide.emit();
  }

  navegarPara(rota?: string): void {
    if (!rota) {
      return;
    }
    this.router.navigate([rota]);
  }

  login() {
    this.router.navigate(['usuarios/login']);
  }

  criarConta() {
    this.router.navigate(['usuarios/cadastro']);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.user.set(null),
      error: () => this.user.set(null)
    });
  }
}
