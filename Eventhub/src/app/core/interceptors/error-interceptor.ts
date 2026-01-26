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
    catchError((error: HttpErrorResponse) => {
      console.error('Erro no serviço:', error);

      // Extração do recurso da URL para mensagens mais específicas
      const urlSegments = req.url.split('/');
      const recurso = getRecursoFromUrl(urlSegments);

      switch (error.status) {          
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
          // Erro específico do serviço
          if (error.error?.erros && error.error.erros.length > 0 && error.error.erros[0]?.showErro) {
            modalService.openServiceErrorModal(error.error.erros[0].mensagem);
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
          if (error.status >= 500) {
            modalService.openErrorModal();
          } else if (error.error?.message) {
            modalService.openServiceErrorModal(error.error.message);
          } else if (error.status >= 400 && error.status < 500) {
            // Outros erros 4xx não tratados especificamente
            modalService.openValidationErrorModal('Erro na requisição. Verifique os dados informados.');
          } else {
            modalService.openErrorModal();
          }
          break;
      }

      return throwError(() => error);
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