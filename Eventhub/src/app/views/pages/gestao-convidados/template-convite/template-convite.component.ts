import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ModalEditarItemComponent } from './modal-editar-item/modal-editar-item.component';
import { ModalBackgroundConfigComponent, BackgroundConfig } from './modal-background-config/modal-background-config.component';

@Component({
  selector: 'app-template-convite',
  imports: [MatIconModule, CommonModule, MatTooltip, MatButtonModule],
  templateUrl: './template-convite.component.html',
  styleUrl: './template-convite.component.scss'
})
export class TemplateConviteComponent {
  private readonly dialog = inject(MatDialog);
  backgroundConfig: BackgroundConfig = {
    backgroundImage: '',
    opacity: 27,
    backgroundPosition: 'center'
  };
  activeItemId: number | null = null;

  itens: ItemTemplate[] = [
    { id: 1, texto: 'CONVIDAM PARA O CASAMENTO<br/><br> DE', styles: 'font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 20px;' },
    { id: 2, texto: 'Bruno', styles: 'font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 5px;' },
    { id: 3, texto: '&', styles: 'font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 5px;' },
    { id: 4, texto: 'Sarah', styles: 'font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 5px;' },
    { id: 5, texto: '13 de Dezembro de 2025', styles: 'font-size: 16px; line-height: 1.5; margin-bottom: 5px;' },
    { id: 6, texto: 'ás 01:00', styles: 'font-size: 16px; line-height: 1.5; margin-bottom: 5px;' },
    { id: 7, texto: 'até', styles: 'font-size: 16px; line-height: 1.5; margin-bottom: 5px;' },
    { id: 8, texto: '13 de Dezembro de 2025', styles: 'font-size: 16px; line-height: 1.5; margin-bottom: 5px;' },
    { id: 9, texto: 'ás 06:00', styles: 'font-size: 16px; line-height: 1.5; margin-bottom: 5px;' },
    { id: 10, texto: 'Rodapé do Convite', styles: 'font-size: 12px; text-align: center; color: gray;' }
  ];

  openModalEditar(item: ItemTemplate) {
    const dialogRef = this.dialog.open(ModalEditarItemComponent, {
      data: { item: { ...item } },
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((updated?: ItemTemplate) => {
      if (!updated) {
        return;
      }

      this.itens = this.itens.map((current) =>
        current.id === updated.id
          ? { ...current, ...updated, editado: true }
          : current
      );
    });
  }

  adicionarItem(index: number) {
    const novoId = Math.max(...this.itens.map(i => i.id), 0) + 1;
    const novoItem: ItemTemplate = {
      id: novoId,
      texto: 'Novo item',
      styles: 'font-size: 16px; text-align: center;'
    };
    this.itens.splice(index + 1, 0, novoItem);
  }

  excluirItem(id: number) {
    if (this.itens.length <= 1) {
      return;
    }
    this.itens = this.itens.filter(item => item.id !== id);
  }

  moverItem(index: number, direcao: 'up' | 'down') {
    if (direcao === 'up' && index > 0) {
      [this.itens[index], this.itens[index - 1]] = [this.itens[index - 1], this.itens[index]];
    } else if (direcao === 'down' && index < this.itens.length - 1) {
      [this.itens[index], this.itens[index + 1]] = [this.itens[index + 1], this.itens[index]];
    }
  }

  toggleActions(itemId: number, event: Event) {
    event.stopPropagation();
    this.activeItemId = this.activeItemId === itemId ? null : itemId;
  }

  isItemActive(itemId: number): boolean {
    return this.activeItemId === itemId;
  }

  openBackgroundModal() {
    const dialogRef = this.dialog.open(ModalBackgroundConfigComponent, {
      data: { ...this.backgroundConfig },
      width: '600px'
    });

    dialogRef.afterClosed().subscribe((config?: BackgroundConfig) => {
      if (config) {
        this.backgroundConfig = config;
      }
    });
  }
  
  closeActions() {
    this.activeItemId = null;
  }

}

export interface Template{
  itens: ItemTemplate[];
  backgroundConfig: BackgroundConfig;
}

export interface ItemTemplate {
  id: number;
  texto: string;
  styles: string;
  editado?: boolean;
}

