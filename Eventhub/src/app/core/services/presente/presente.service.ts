import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CreateContribuicaoPresenteDto, ContribuicaoPresenteDto, CancelarContribuicaoPresenteDto, StatusContribuicaoPresenteDto, UpdateContribuicaoPresenteDto, ConfirmarContribuicaoPresenteDto } from "../../models/contribuicao-presente.model";
import { CreatePresenteDto, Presente, UpdatePresenteDto, CategoriaPresenteDto, PresenteDetalhesDto, ReservarPresenteDto, CancelarReservaPresenteDto, StatusPresenteDto } from "../../models/presente.model";
import { RetornoAPI } from "../../models/retorno-api.model";
import { BaseService } from "../base.service";

@Injectable({ providedIn: 'root' })
export class PresenteService extends BaseService {

    cadastro(presente: CreatePresenteDto): Observable<RetornoAPI<Presente[]>> {
        return this.http.post<RetornoAPI<Presente[]>>(`${this.urlApi}/presentes`, presente);
    }

    contribuir(contribuicao: CreateContribuicaoPresenteDto): Observable<RetornoAPI<ContribuicaoPresenteDto>> {
        return this.http.post<RetornoAPI<ContribuicaoPresenteDto>>(`${this.urlApi}/contribuicaopresente`, contribuicao);
    }

    cancelarContribuicao(model: CancelarContribuicaoPresenteDto): Observable<RetornoAPI<null>> {
        return this.http.post<RetornoAPI<null>>(`${this.urlApi}/contribuicaopresente/cancelar`, model);
    }

    confirmarContribuicao(model: ConfirmarContribuicaoPresenteDto): Observable<RetornoAPI<null>> {
        return this.http.post<RetornoAPI<null>>(`${this.urlApi}/contribuicaopresente/confirmar`, model);
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

    obterStatusPresente(): Observable<RetornoAPI<StatusPresenteDto[]>> {
        return this.http.get<RetornoAPI<StatusPresenteDto[]>>(`${this.urlApi}/presentes/status`);
    }

    obterStatusContribuicaoPresente(): Observable<RetornoAPI<StatusContribuicaoPresenteDto[]>> {
        return this.http.get<RetornoAPI<StatusContribuicaoPresenteDto[]>>(`${this.urlApi}/contribuicaopresente/status`);
    }

    atualizarContribuicao(contribuicao: UpdateContribuicaoPresenteDto): Observable<RetornoAPI<ContribuicaoPresenteDto>> {
        return this.http.put<RetornoAPI<ContribuicaoPresenteDto>>(`${this.urlApi}/contribuicaopresente/${contribuicao.id}`, contribuicao);
    }

    reservarPresente(reserva: ReservarPresenteDto): Observable<RetornoAPI<Presente>> {
        return this.http.post<RetornoAPI<Presente>>(`${this.urlApi}/presentes/${reserva.idPresente}/reservar`, reserva);
    }

    cancelarReserva(cancelamento: CancelarReservaPresenteDto): Observable<RetornoAPI<null>> {
        return this.http.post<RetornoAPI<null>>(`${this.urlApi}/presentes/${cancelamento.idPresente}/cancelar-reserva`, cancelamento);
    }
}
