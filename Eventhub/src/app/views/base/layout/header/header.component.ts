import { Component, EventEmitter, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true
})
export class HeaderComponent {
  router = inject(Router);
  isMobile = false;

  openMenuSide: EventEmitter<void> = new EventEmitter<void>();

  constructor() {
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());
  }

  checkMobile() {
    this.isMobile = window.innerWidth <= 900;
  }

  toggleMenu() {
    this.openMenuSide.emit();
  }

  login() {
    this.router.navigate(['usuarios/login']);
  }
}
