import { Component, Inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

export interface ModalErrorData {
  title?: string;
  message?: string;
  okLabel?: string;
}

@Component({
  selector: 'app-modal-error',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatCardModule, MatDividerModule],
  templateUrl: './modal-error.component.html',
  styleUrls: ['./modal-error.component.scss']
})
export class ModalErrorComponent {
  @Input() title = 'Ocorreu um Erro';
  @Input() message = 'Não foi possível concluir sua solicitação. Por favor, tente novamente mais tarde.';
  @Input() okLabel = 'OK';

  constructor(
    private dialogRef: MatDialogRef<ModalErrorComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: ModalErrorData
  ) {
    if (data) {
      this.title = data.title || this.title;
      this.message = data.message || this.message;
      this.okLabel = data.okLabel || this.okLabel;
    }
  }

  close(): void {
    this.dialogRef.close(true);
  }
}
