import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

export interface ModalInputData {
  title: string;
  message: string;
  inputLabel: string;
  inputPlaceholder?: string;
  inputType?: 'text' | 'textarea';
  confirmLabel?: string;
  cancelLabel?: string;
  inputRequired?: boolean;
  inputMinLength?: number;
  inputMaxLength?: number;
}

@Component({
  selector: 'app-modal-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './modal-input.component.html',
  styleUrls: ['./modal-input.component.scss']
})
export class ModalInputComponent {
  readonly data: ModalInputData = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ModalInputComponent>);

  inputValue = signal<string>('');
  showError = signal<boolean>(false);
  errorMessage = signal<string>('');

  onInputChange(): void {
    this.showError.set(false);
    this.errorMessage.set('');
  }

  isValid(): boolean {
    const value = this.inputValue().trim();

    if (this.data.inputRequired && !value) {
      return false;
    }

    if (this.data.inputMinLength && value.length < this.data.inputMinLength) {
      return false;
    }

    if (this.data.inputMaxLength && value.length > this.data.inputMaxLength) {
      return false;
    }

    return true;
  }

  onConfirm(): void {
    const value = this.inputValue().trim();

    if (!this.isValid()) {
      if (this.data.inputRequired && !value) {
        this.errorMessage.set('Este campo é obrigatório');
      } else if (this.data.inputMinLength && value.length < this.data.inputMinLength) {
        this.errorMessage.set(`Mínimo de ${this.data.inputMinLength} caracteres`);
      }
      this.showError.set(true);
      return;
    }

    this.dialogRef.close(value);
  }
}
