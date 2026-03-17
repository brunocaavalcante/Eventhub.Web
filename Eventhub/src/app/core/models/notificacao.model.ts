export enum NotificacaoStatus {
    Enviada = 1,
    Lida = 2,
    Arquivada = 3
}

export enum NotificacaoPrioridade {
    Baixa = 1,
    Media = 2,
    Alta = 3,
    Urgente = 4
}

export interface NotificacaoResponseDto {
    id: number;
    titulo: string;
    descricao: string;
    idUsuarioDestino: number;
    nomeUsuarioDestino: string;
    idUsuarioOrigem: number;
    nomeUsuarioOrigem: string;
    idEvento: number;
    nomeEvento: string;
    status: NotificacaoStatus;
    prioridade: NotificacaoPrioridade;
    linkAcao: string;
    icone: string;
    dataCadastro: Date | string;
    dataEnvio: Date | string;
    dataLeitura: Date | string;
    lida: boolean;
}

export interface NotificacaoCreateDto {
    titulo: string;
    descricao: string;
    idUsuarioDestino: number;
    idEvento: number;
    idUsuarioOrigem: number;
    status?: NotificacaoStatus;
    prioridade?: NotificacaoPrioridade;
    linkAcao?: string;
    icone?: string;
}
