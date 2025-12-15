export interface Imagem {
    nomeArquivo: string;
    base64: string;
    tipoImagem: TipoImagemEvento;
}

export enum TipoImagemEvento {
  Local = 'local',
  Profile = 'profile',
  Galeria = 'galeria',
  Capa = 'capa',
  Convite = 'convite'
}
