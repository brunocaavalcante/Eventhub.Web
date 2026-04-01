export interface ProgramacaoEventoResponseDto {
    id: number;
    idEvento: number;
    nomeEvento: string;
    titulo: string;
    descricao: string;
    data: Date | string;
    duracao: string;
    local: string;
    responsavel: string;
    idStatus: number;
    descricaoStatus: string;
    dataCadastro: Date | string;
}

export interface ProgramacaoEventoCreateDto {
    idEvento: number;
    titulo: string;
    descricao: string;
    data: Date | string;
    duracao?: string;
    local: string;
    responsavel: string;
    idStatus?: number; // default 1
}

export interface ProgramacaoEventoUpdateDto {
    id: number;
    titulo: string;
    descricao: string;
    data: Date | string;
    duracao?: string;
    local: string;
    responsavel: string;
    idStatus: number;
}
