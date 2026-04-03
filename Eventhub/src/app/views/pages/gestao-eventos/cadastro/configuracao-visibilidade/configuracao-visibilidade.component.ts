import { Component, input, output, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { ConfiguracaoVisibilidadeDto } from '../../../../../core/models/evento.model';


interface Feature {
  id: keyof ConfiguracaoVisibilidadeDto;
  icon: string;
  titulo: string;
  descricao: string;
}

@Component({
  selector: 'app-configuracao-visibilidade',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSlideToggleModule, MatIconModule],
  templateUrl: './configuracao-visibilidade.component.html',
  styleUrl: './configuracao-visibilidade.component.scss'
})
export class ConfiguracaoVisibilidadeComponent implements OnInit {
  formGroup = input.required<FormGroup>();
  configuracaoChange = output<ConfiguracaoVisibilidadeDto>();

  configuracoes = signal<ConfiguracaoVisibilidadeDto>({
    galeriaFotos: true,
    chatConvidados: true,
    listaPresentes: false,
    listaConvidados: false,
    agendaEvento: true
  });

  readonly features: Feature[] = [
    { id: 'galeriaFotos', icon: 'collections', titulo: 'Galeria de Fotos', descricao: 'Permite que convidados visualizem e compartilhem fotos do evento.' },
    { id: 'chatConvidados', icon: 'forum', titulo: 'Chat de Convidados', descricao: 'Habilita mensagens em tempo real entre os convidados.' },
    { id: 'listaPresentes', icon: 'card_giftcard', titulo: 'Lista de Presentes', descricao: 'Torna sua lista de presentes visível para todos os convidados.' },
    { id: 'listaConvidados', icon: 'people', titulo: 'Lista de Confirmados', descricao: 'Permite que convidados vejam quem confirmou presença.' },
    { id: 'agendaEvento', icon: 'event', titulo: 'Agenda do Evento', descricao: 'Exibe a programação e horários das atividades do dia.' }
  ];

  ngOnInit(): void {
    this.formGroup().patchValue(this.configuracoes());
  }

  alternarConfiguracao(campo: keyof ConfiguracaoVisibilidadeDto): void {
    const novaConfig = { ...this.configuracoes(), [campo]: !this.configuracoes()[campo] };
    this.configuracoes.set(novaConfig);
    this.formGroup().patchValue({ [campo]: novaConfig[campo] });
    this.configuracaoChange.emit(novaConfig);
  }

  obterValor(campo: keyof ConfiguracaoVisibilidadeDto): boolean {
    return this.configuracoes()[campo];
  }
}
