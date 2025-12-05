
import { Component, signal } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { MenuSideComponent } from './menu-side/menu-side.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [HeaderComponent, MenuSideComponent, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  sideMenuOpen = signal(false);

  abrirMenuSide = () => {
    this.sideMenuOpen.set(true);
  };

  fecharMenuSide = () => {
    this.sideMenuOpen.set(false);
  };
}
