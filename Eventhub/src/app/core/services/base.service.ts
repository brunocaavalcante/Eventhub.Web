import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { NotificationService } from './notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalErrorComponent } from '../components/modal/modal-error/modal-error.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BaseService {
    protected readonly urlApi = environment.urlApi;
    protected readonly http = inject(HttpClient);
    protected readonly auth: Auth = inject(Auth);
    protected readonly firestore: Firestore = inject(Firestore);
    private readonly notification = inject(NotificationService);
    private readonly dialog = inject(MatDialog);

    /**
     * Centraliza o tratamento de erros de chamadas a serviços (ex.: Firebase).
     * - mapeia erros conhecidos para mensagens mais amigáveis
     * - notifica o usuário com uma mensagem genérica ou customizada
     */
    protected handleError(err: unknown, customMessage?: string): never {

        let message = customMessage || 'Ocorreu um erro. Tente novamente.';

        try {
            // firebase errors frequentemente têm a propriedade code e message
            const anyErr: any = err as any;
            if (anyErr && typeof anyErr === 'object') {
                if (anyErr.code) {
                    // Mapear códigos comuns do Firebase para mensagens amigáveis
                    switch (String(anyErr.code)) {
                        case 'auth/email-already-in-use':
                            message = 'Este email já está em uso.'; break;
                        case 'auth/invalid-email':
                            message = 'Formato de email inválido.'; break;
                        case 'auth/weak-password':
                            message = 'A senha é muito fraca.'; break;
                        case 'auth/user-not-found':
                            message = 'Usuário não encontrado.'; break;
                        case 'auth/wrong-password':
                            message = 'Email ou senha inválidos.'; break;
                        case 'permission-denied':
                            message = 'Permissão negada.'; break;
                        default:
                            if (anyErr.message && typeof anyErr.message === 'string') {
                                message = anyErr.message;
                            }
                    }
                } else if (anyErr.message && typeof anyErr.message === 'string') {
                    message = anyErr.message;
                }
            }
        } catch (e) { }

        try {
            this.openErrorDialog(message);
        }
        catch (e) { this.notification.showError(message); }

        throw err;
    }

    private openErrorDialog(message: string, title = 'Ocorreu um Erro', okLabel = 'OK'): void {
        try {
            this.dialog.open(ModalErrorComponent, {
                data: { title, message, okLabel },
                disableClose: false,
            });
        } catch (e) { throw e; }
    }
}
