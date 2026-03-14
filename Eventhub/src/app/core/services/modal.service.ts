import { ComponentType } from '@angular/cdk/portal';
import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ModalConfirmComponent, ModalConfirmData } from '../components/modal/modal-confirm/modal-confirm.component';
import { ModalErrorComponent, ModalErrorData } from '../components/modal/modal-error/modal-error.component';
import { ModalSucessComponent, ModalSucessData } from '../components/modal/modal-sucess/modal-sucess.component';
import { ModalInputComponent, ModalInputData } from '../components/modal/modal-input/modal-input.component';

type DialogResult = boolean | undefined;

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private readonly dialog = inject(MatDialog);
  private readonly defaultConfig: MatDialogConfig = {
    disableClose: true,
    panelClass: 'modal'
  };

  private openDialog<D, R = DialogResult>(
    component: ComponentType<unknown>,
    data?: D,
    config?: MatDialogConfig<D>
  ): Observable<R> {
    const dialogConfig: MatDialogConfig<D> = {
      ...this.defaultConfig,
      ...config,
      data: data ?? config?.data
    };

    return this.dialog.open(component, dialogConfig).afterClosed() as Observable<R>;
  }

  openErrorModal(data?: ModalErrorData, config?: MatDialogConfig<ModalErrorData>): Observable<DialogResult> {
    return this.openDialog(ModalErrorComponent, data, config);
  }

  openServiceErrorModal(message: string): Observable<DialogResult> {
    return this.openErrorModal({
      title: 'Erro na Operação',
      message
    }, { width: '500px' });
  }

  openValidationErrorModal(message: string): Observable<DialogResult> {
    return this.openErrorModal({
      title: 'Erro de Validação',
      message,
      okLabel: 'OK'
    }, { width: '500px' });
  }

  openAccessDeniedModal(): Observable<DialogResult> {
    return this.openErrorModal({
      title: 'Acesso Negado',
      message: 'Você não tem permissão para acessar este recurso.'
    }, { width: '500px' });
  }

  openNotFoundModal(recurso: string = 'recurso'): Observable<DialogResult> {
    return this.openErrorModal({
      title: 'Não Encontrado',
      message: `O ${recurso} solicitado não foi encontrado.`
    }, { width: '500px' });
  }

  openConnectionErrorModal(url?: string): Observable<DialogResult> {
    const message = url
      ? `Verifique sua conexão com a internet e tente novamente. Serviço fora: ${url}`
      : 'Verifique sua conexão com a internet e tente novamente.';

    return this.openErrorModal(
      { title: 'Erro de Conexão', message, okLabel: 'FECHAR' },
      { width: '600px' }
    );
  }

  openCustomErrorModal(title: string, message: string, okLabel = 'OK'): Observable<DialogResult> {
    return this.openErrorModal({ title, message, okLabel }, { width: '500px' });
  }

  openSessionExpiredModal(): Observable<DialogResult> {
    return this.openErrorModal({
      title: 'Sessão Expirada',
      message: 'Sua sessão expirou. Você será redirecionado para o login.'
    });
  }

  openSuccessModal(
    data?: ModalSucessData,
    config?: MatDialogConfig<ModalSucessData>
  ): Observable<DialogResult> {
    return this.openDialog(ModalSucessComponent, data, config);
  }

  openOperationSuccessModal(
    message: string,
    title = 'Operação Concluída com Sucesso!'
  ): Observable<DialogResult> {
    return this.openSuccessModal({ title, message });
  }

  openConfirmationModal(
    data?: ModalConfirmData,
    config?: MatDialogConfig<ModalConfirmData>
  ): Observable<DialogResult> {
    return this.openDialog<ModalConfirmData, DialogResult>(ModalConfirmComponent, data, config);
  }

  openInputModal(
    data?: ModalInputData,
    config?: MatDialogConfig<ModalInputData>
  ): Observable<string | null> {
    return this.openDialog<ModalInputData, string | null>(ModalInputComponent, data, config);
  }
}
