import { Component, Inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

export interface ModalSucessData {
  title?: string;
  message?: string;
  okLabel?: string;
}

@Component({
  selector: 'app-modal-sucess',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatCardModule, MatDividerModule],
  templateUrl: './modal-sucess.component.html',
  styleUrls: ['./modal-sucess.component.scss']
})
export class ModalSucessComponent {
  /**
   * Fallback when component is used without MatDialog (programatic open is recommended)
   */
  @Input() title = 'Operação Concluída com Sucesso!';
  @Input() message = 'Sua ação foi realizada com sucesso. Continue explorando e planejando seus eventos!';
  @Input() okLabel = 'OK';

  constructor(
    private dialogRef: MatDialogRef<ModalSucessComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: ModalSucessData
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
