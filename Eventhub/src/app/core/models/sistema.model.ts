export interface ModuloDto {
    id: number;
    nome: string;
    descricao: string;
    icone: string;
    rota: string;
    ordem: number;
}

export interface PermissaoDto{
    id:number;
    nome: string;
    descricao: string;
    chave: string;
    modulo: ModuloDto;
}