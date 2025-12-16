import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-modal-background-config',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatSliderModule
  ],
  templateUrl: './modal-background-config.component.html',
  styleUrl: './modal-background-config.component.scss'
})
export class ModalBackgroundConfigComponent {
  backgroundImage: string = '';
  opacity: number = 100;
  backgroundPosition: string = 'center';

  constructor(
    private readonly dialogRef: MatDialogRef<ModalBackgroundConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: BackgroundConfig
  ) {
    if (data) {
      this.backgroundImage = data.backgroundImage || '';
      this.opacity = data.opacity || 100;
      this.backgroundPosition = data.backgroundPosition || 'center';
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.backgroundImage = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.backgroundImage = '';
  }

  salvar() {
    const config: BackgroundConfig = {
      backgroundImage: this.backgroundImage,
      opacity: this.opacity,
      backgroundPosition: this.backgroundPosition
    };
    this.dialogRef.close(config);
  }

  fechar() {
    this.dialogRef.close();
  }

  get previewStyle() {
    return {
      'background-image': this.backgroundImage ? `url(${this.backgroundImage})` : 'none',
      'background-size': 'cover',
      'background-position': this.backgroundPosition,
      'opacity': this.opacity / 100
    };
  }
}

export interface BackgroundConfig {
  backgroundImage: string;
  opacity: number;
  backgroundPosition: string;
}
