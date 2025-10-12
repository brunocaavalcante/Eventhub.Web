import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

export const authGuard: CanActivateFn = async () => {
    const usuarioService = inject(UsuarioService);
    const router = inject(Router);
    const usuario = await usuarioService.obterUsuarioLogado();
    if (usuario) {
        return true;
    }
    router.navigate(['/acesso-negado'], { queryParams: { descricao: 'Você precisa estar logado para acessar esta página.' } });
    return false;
};
