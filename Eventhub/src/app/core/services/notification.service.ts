import { Injectable, Optional } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
    constructor(@Optional() private snackBar?: MatSnackBar) { }

    /**
     * Exibe uma mensagem de erro ao usuário. Usa MatSnackBar quando disponível,
     * caso contrário faz fallback para window.alert.
     */
    showError(message: string): void {
        const text = message || 'Ocorreu um erro. Tente novamente.';
        if (this.snackBar) {
            try {
                this.snackBar.open(text, 'Fechar', { duration: 5000 });
                return;
            } catch (e) {
                // fallback para alert
            }
        }

        window.alert(text);
    }

    showSuccess(message: string): void {
        const text = message || 'Operação realizada com sucesso.';
        if (this.snackBar) {
            try {
                this.snackBar.open(text, 'Fechar', { duration: 3000 });
                return;
            } catch (e) {
                // fallback para alert
            }
        }

        window.alert(text);
    }
}
