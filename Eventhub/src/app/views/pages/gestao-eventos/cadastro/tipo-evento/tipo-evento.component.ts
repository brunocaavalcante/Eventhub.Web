import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tipo-evento',
  imports: [CommonModule, MatIconModule, RouterLink],
  templateUrl: './tipo-evento.component.html',
  styleUrl: './tipo-evento.component.scss'
})
export class TipoEventoComponent {
  eventTypes = [
    { id: 1, icon: 'home', name: 'Chá de Casa Nova', desc: 'Comemore seu novo lar.' },
    { id: 2, icon: 'favorite', name: 'Casamento', desc: 'Celebre o amor e a união.' },
    { id: 3, icon: 'cake', name: 'Aniversário', desc: 'Marque mais um ano de vida.' },
    { id: 4, icon: 'child_friendly', name: 'Chá de Bebê', desc: 'Dê boas-vindas ao bebê.' },
    { id: 5, icon: 'school', name: 'Formatura', desc: 'Homenageie uma conquista.' },
    { id: 6, icon: 'groups', name: 'Networking', desc: 'Conecte-se com pessoas.' },
    { id: 7, icon: 'business_center', name: 'Corporativo', desc: 'Celebre um marco profissional.' },
    { id: 8, icon: 'apps', name: 'Outro', desc: 'Crie um evento personalizado.' }
  ];
}
