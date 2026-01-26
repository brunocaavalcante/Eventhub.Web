import { Component, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { CurrencyBrPipe } from '../../utils/pipes/currency-br.pipe';
import { DateUtils } from '../../utils/date.utils';
import { Base64ImageUtil } from '../../utils/base64-image.util';
import { ConfigTabela } from './tabela-generica.model';

@Component({
  selector: 'app-tabela-generica',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatTooltipModule,
    MatCardModule,
    MatMenuModule
  ],
  templateUrl: './tabela-generica.component.html',
  styleUrl: './tabela-generica.component.scss'
})
export class TabelaGenericaComponent<T = any> {
  config = input.required<ConfigTabela<T>>();
  dados = input.required<T[]>();
  
  filtro = signal('');
  
  dadosFiltrados = computed(() => {
    const termo = this.filtro().toLowerCase();
    if (!termo) return this.dados();
    
    return this.dados().filter(item => {
      return this.config().colunas.some(col => {
        const valor = this.obterValor(item, col.chave);
        return valor?.toString().toLowerCase().includes(termo);
      });
    });
  });

  get colunasExibidas(): string[] {
    const cols = this.config().colunasExibidas || this.config().colunas.map(c => c.chave);
    return this.config().acoes?.length ? [...cols, 'acoes'] : cols;
  }

  obterValor(linha: T, chave: string): any {
    return chave.split('.').reduce((obj: any, key) => obj?.[key], linha);
  }

  formatarCelula(linha: T, coluna: any): string {
    const valor = this.obterValor(linha, coluna.chave);
    
    if (coluna.formatador) return coluna.formatador(valor, linha);
    
    switch (coluna.tipo) {
      case 'moeda':
        return new CurrencyBrPipe().transform(valor);
      case 'data':
        return DateUtils.formatarDataBR(valor);
      case 'numero':
        return valor?.toString() || '0';
      default:
        return valor?.toString() || '';
    }
  }

  resolverImagem(linha: T, chave: string, iconePadrao = 'person'): string {
    const valor = this.obterValor(linha, chave);
    if (!valor) return iconePadrao;
    
    const resolvida = Base64ImageUtil.resolveImageSource(valor);
    return resolvida || iconePadrao;
  }

  ehImagem(src: string): boolean {
    return src.startsWith('data:') || src.startsWith('http') || src.startsWith('assets/');
  }

  obterClasseStatus(valor: string, config?: { [chave: string]: string }): string {
    if (!config) return `status-${valor.toLowerCase()}`;
    return config[valor] || `status-${valor.toLowerCase()}`;
  }

  aplicarFiltro(event: Event): void {
    this.filtro.set((event.target as HTMLInputElement).value);
  }

  acaoVisivel(acao: any, row: T): boolean {
    return !acao.visivel || acao.visivel(row);
  }

  obterAcoesVisiveis(linha: T): any[] {
    return this.config().acoes?.filter(acao => this.acaoVisivel(acao, linha)) || [];
  }

  temMuitasAcoes(linha: T): boolean {
    return this.obterAcoesVisiveis(linha).length > 3;
  }
}
