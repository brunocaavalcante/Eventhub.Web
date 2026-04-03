import { Injectable } from "@angular/core";
import { CreateUsuarioDTO, UsuarioInfoDTO } from "../models/usuario.model";
import { BaseService } from "./base.service";
import { Observable } from "rxjs";
import { RetornoAPI } from "../models/retorno-api.model";

@Injectable({ providedIn: 'root' })
export class UsuarioService extends BaseService {

    cadastro(usuario: CreateUsuarioDTO): Observable<RetornoAPI<void>> {
        if (!usuario || !usuario.email || !usuario.password) {
            throw new Error('Email e senha são obrigatórios para cadastro');
        }

        return this.http.post<RetornoAPI<void>>(`${this.urlApi}/usuarios`, usuario);
    }
    
    obterUsuarioLogado(): UsuarioInfoDTO | null {
        return sessionStorage.getItem('usuarioLogado') ?
            JSON.parse(sessionStorage.getItem('usuarioLogado') as string)?.usuario as UsuarioInfoDTO : null;
    }

    verificarEmailExiste(email: string): Observable<RetornoAPI<UsuarioInfoDTO>> {
        return this.http.get<RetornoAPI<UsuarioInfoDTO>>(`${this.urlApi}/usuarios/email/${encodeURIComponent(email)}`);
    }
}