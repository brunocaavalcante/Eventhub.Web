import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { CategoriaPresenteDto, CreatePresenteDto, Presente, PresenteDetalhesDto, UpdatePresenteDto } from "../models/presente.model";
import { RetornoAPI } from "../models/retorno-api.model";
import { Observable } from "rxjs";
import { ContribuicaoPresenteDto, CreateContribuicaoPresenteDto } from "../models/contribuicao-pix.model";

@Injectable({ providedIn: 'root' })
export class PresenteService extends BaseService {

    cadastro(presente: CreatePresenteDto): Observable<RetornoAPI<Presente[]>> {
        return this.http.post<RetornoAPI<Presente[]>>(`${this.urlApi}/presentes`, presente);
    }

    contribuir(contribuicao: CreateContribuicaoPresenteDto): Observable<RetornoAPI<ContribuicaoPresenteDto>> {
        return this.http.post<RetornoAPI<ContribuicaoPresenteDto>>(`${this.urlApi}/presentes/contribuicoes`, contribuicao);
    }

    atualizar(presente: UpdatePresenteDto): Observable<RetornoAPI<Presente[]>> {
        return this.http.put<RetornoAPI<Presente[]>>(`${this.urlApi}/presentes/${presente.id}`, presente);
    }

    excluir(idPresente: number): Observable<RetornoAPI<null>> {
        return this.http.delete<RetornoAPI<null>>(`${this.urlApi}/presentes/${idPresente}`);
    }

    obterPorId(idPresente: number): Observable<RetornoAPI<Presente>> {
        return this.http.get<RetornoAPI<Presente>>(`${this.urlApi}/presentes/${idPresente}`);
    }

    obterCategoriasPresentes(): Observable<RetornoAPI<CategoriaPresenteDto[]>> {
        return this.http.get<RetornoAPI<CategoriaPresenteDto[]>>(`${this.urlApi}/presentes/categorias`);
    }

    obterPresentesPorEvento(idEvento: string): Observable<RetornoAPI<Presente[]>> {
        return this.http.get<RetornoAPI<Presente[]>>(`${this.urlApi}/presentes/evento/${idEvento}`);
    }

    obterDetalhesPorId(idPresente: number): Observable<RetornoAPI<PresenteDetalhesDto>> {
        return this.http.get<RetornoAPI<PresenteDetalhesDto>>(`${this.urlApi}/presentes/${idPresente}/detalhes`);
    }
}
