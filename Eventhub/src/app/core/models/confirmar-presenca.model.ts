export interface ConfirmarPresencaDTO {
  tokenEvento: string;
  nome: string;
  email: string;
  qtdAcompanhantes: number;
  mensagemOrganizador?: string;
}

export interface RecusarConviteDto {
  tokenEvento: string;
  email: string;
  motivoRecusa?: string;
}