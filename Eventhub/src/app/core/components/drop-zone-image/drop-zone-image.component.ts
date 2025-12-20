import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-drop-zone-image',
  imports: [MatIconModule, CommonModule],
  templateUrl: './drop-zone-image.component.html',
  styleUrls: ['./drop-zone-image.component.scss']
})
export class DropZoneImageComponent {
  private readonly maxImagens = 10;

  @Input() imagens: string[] = [];
  @Output() imagensChange = new EventEmitter<string[]>();

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      this.handleFiles(event.dataTransfer.files);
    }
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(input.files);
      input.value = '';
    }
  }

  handleFiles(files: FileList) {
    const espacoDisponivel = this.maxImagens - this.imagens.length;
    if (espacoDisponivel <= 0) {
      return;
    }

    Array.from(files)
      .slice(0, espacoDisponivel)
      .forEach(file => {
        const reader = new FileReader();
        reader.onload = (event: ProgressEvent<FileReader>) => {
          const resultado = event.target?.result as string | null;
          if (!resultado) {
            return;
          }

          if (this.imagens.length < this.maxImagens) {
            this.imagens = [...this.imagens, resultado];
            this.emitChange();
          }
        };
        reader.readAsDataURL(file);
      });
  }

  removerImagem(index: number) {
    this.imagens = this.imagens.filter((_, i) => i !== index);
    this.emitChange();
  }

  private emitChange() {
    this.imagensChange.emit([...this.imagens]);
  }
}
