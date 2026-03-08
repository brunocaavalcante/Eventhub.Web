export interface LoginResponseDTO {
    accessToken: string;
    refreshToken: string;
    usuario: UsuarioInfoDTO;
}

export interface UsuarioInfoDTO {
    id: number;
    keycloakId: string;
    nome: string;
    email: string;
    telefone: string;
    foto: string;
    dataCadastro: Date | string;
    status: string;
}

export interface CreateUsuarioDTO {
    nome: string;
    email: string;
    password: string;
    telefone?: string;
}