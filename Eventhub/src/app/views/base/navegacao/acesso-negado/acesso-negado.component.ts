import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-acesso-negado',
  imports: [MatIconModule, MatButtonModule, CommonModule, RouterLink],
  templateUrl: './acesso-negado.component.html',
  styleUrl: './acesso-negado.component.scss'
})
export class AcessoNegadoComponent implements OnInit {
  @Input() descricao?: string;

  usuarioLogado = signal<null | any>(null);

  private readonly usuarioService = inject(UsuarioService);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.carregarUsuario();
    if (!this.descricao) {
      const queryDesc = this.route.snapshot.queryParamMap.get('descricao');
      if (queryDesc) {
        this.descricao = queryDesc;
      }
    }
  }

  private async carregarUsuario() {
    this.usuarioLogado.set(await this.usuarioService.obterUsuarioLogado());
  }
}
