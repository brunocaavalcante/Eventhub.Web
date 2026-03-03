export interface ModuloDto {
    id: number;
    nome: string;
    descricao: string;
    icone: string;
    rota: string;
    ordem: number;
    showInMenu: boolean;
}

export interface PermissaoDto{
    id:number;
    nome: string;
    descricao: string;
    chave: string;
    modulo: ModuloDto;
}