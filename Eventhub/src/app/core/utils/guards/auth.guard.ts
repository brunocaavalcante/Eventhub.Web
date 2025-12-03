import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const authGuard: CanActivateFn = async () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const usuarioLogado = await authService.logado();
    
    if (usuarioLogado) return true;

    router.navigate(['/acesso-negado'], { queryParams: { descricao: 'Você precisa estar logado para acessar esta página.' } });
    return false;
};
