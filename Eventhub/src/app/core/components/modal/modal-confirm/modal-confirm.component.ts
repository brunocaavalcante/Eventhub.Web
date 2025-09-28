import { Component, Inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

export interface ModalConfirmData {
  title?: string;
  message?: string;
  cancelLabel?: string;
  confirmLabel?: string;
}

@Component({
  selector: 'app-modal-confirm',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatCardModule, MatDividerModule],
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.scss']
})
export class ModalConfirmComponent {
  @Input() title = 'Confirmar Ação';
  @Input() message = 'Tem certeza que deseja prosseguir com esta ação? Esta operação não poderá ser desfeita.';
  @Input() cancelLabel = 'Cancelar';
  @Input() confirmLabel = 'Confirmar';

  constructor(
    private dialogRef: MatDialogRef<ModalConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: ModalConfirmData
  ) {
    if (data) {
      this.title = data.title || this.title;
      this.message = data.message || this.message;
      this.cancelLabel = data.cancelLabel || this.cancelLabel;
      this.confirmLabel = data.confirmLabel || this.confirmLabel;
    }
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
