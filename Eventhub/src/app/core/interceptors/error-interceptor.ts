import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const modalService = inject(ModalService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((response: HttpErrorResponse) => {
      console.error('Erro no serviço:', response);

      // Extração do recurso da URL para mensagens mais específicas
      const urlSegments = req.url.split('/');
      const recurso = getRecursoFromUrl(urlSegments);

      switch (response.status) {
        case 401:
          authService.refreshToken().subscribe();
          break;

        case 403:
          modalService.openAccessDeniedModal();
          break;

        case 404:
          //TODO: Verificar necessidade deve exibir em rotas não encontradas
          //modalService.openNotFoundModal(recurso);
          break;

        case 408:
        case 0:
          modalService.openConnectionErrorModal(req.url);
          break;

        case 424:
        case 400:
          // Erro específico do serviço
          if (response.error?.erros && response.error.erros.length > 0 && response.error.erros[0]?.exibirMsg) {
            modalService.openValidationErrorModal(response.error.erros[0].mensagem);
          } else {
            modalService.openErrorModal();
          }
          break;

        case 429:
          modalService.openCustomErrorModal(
            'Limite Excedido',
            'Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.',
            'alerta.svg'
          );
          break;

        default:
          // Erros de servidor (5xx) ou outros erros não mapeados
          if (response.status >= 500) {
            modalService.openErrorModal();
          } else if (response.error?.message) {
            modalService.openServiceErrorModal(response.error.message);
          } else if (response.status >= 400 && response.status < 500) {
            if (response.error?.erros && response.error.erros.length > 0 && response.error.erros[0].exibirMsg) {
              modalService.openValidationErrorModal(response.error.erros[0].mensagem);
            } else {
              modalService.openErrorModal();
            }
          }
          break;
      }

      return throwError(() => response);
    })
  );
};

// Função auxiliar para extrair recurso da URL para mensagens mais específicas
function getRecursoFromUrl(urlSegments: string[]): string {
  const resourceMap: { [key: string]: string } = {
    'ObterTipoMedida': 'campos de medidas',
    'ObterTamanhoFardamento': 'medidas do fardamento',
    'ObterUltimasMedidasPm': 'medidas do PM',
    'CadastrarMedidasPm': 'cadastro de medidas',
    'PolicialMilitar': 'dados do policial militar',
    'auth': 'autenticação',
    'login': 'login',
    'refresh': 'renovação de token',
    'logout': 'logout'
  };

  for (const segment of urlSegments) {
    if (resourceMap[segment]) {
      return resourceMap[segment];
    }
  }

  return 'recurso solicitado';
}