import { Component } from '@angular/core';
import { BaseComponent } from '../../../../core/components/base.component';
import { CommonModule } from '@angular/common';
import { MatButton } from "@angular/material/button"; import { RouterLink } from '@angular/router';
;

@Component({
  selector: 'app-meus-eventos',
  imports: [CommonModule, MatButton, RouterLink],
  templateUrl: './meus-eventos.component.html',
  styleUrl: './meus-eventos.component.scss'
})
export class MeusEventosComponent extends BaseComponent {
  meusEventos = [];

}
