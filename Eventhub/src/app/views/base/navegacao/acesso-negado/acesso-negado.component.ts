import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-acesso-negado',
  imports: [MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './acesso-negado.component.html',
  styleUrl: './acesso-negado.component.scss'
})
export class AcessoNegadoComponent implements OnInit {
  @Input() descricao?: string;

  usuarioLogado = signal<null | any>(null);

  private readonly usuarioService = inject(UsuarioService);
  ngOnInit(): void {
    this.carregarUsuario();
  }

  private async carregarUsuario() {
    this.usuarioLogado.set(await this.usuarioService.obterUsuarioLogado());
  }
}
