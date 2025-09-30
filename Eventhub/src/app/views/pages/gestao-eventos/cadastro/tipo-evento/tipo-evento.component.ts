import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tipo-evento',
  imports: [CommonModule, MatIconModule],
  templateUrl: './tipo-evento.component.html',
  styleUrl: './tipo-evento.component.scss'
})
export class TipoEventoComponent {
  eventTypes = [
    { icon: 'home', name: 'Chá de Casa Nova', desc: 'Comemore seu novo lar.' },
    { icon: 'favorite', name: 'Casamento', desc: 'Celebre o amor e a união.' },
    { icon: 'cake', name: 'Aniversário', desc: 'Marque mais um ano de vida.' },
    { icon: 'child_friendly', name: 'Chá de Bebê', desc: 'Dê boas-vindas ao bebê.' },
    { icon: 'school', name: 'Formatura', desc: 'Homenageie uma conquista.' },
    { icon: 'groups', name: 'Networking', desc: 'Conecte-se com pessoas.' },
    { icon: 'business_center', name: 'Corporativo', desc: 'Celebre um marco profissional.' },
    { icon: 'apps', name: 'Outro', desc: 'Crie um evento personalizado.' }
  ];
}
