export interface Imagem {
  id?: number;
  nomeArquivo: string;
  base64: string;
  tipoImagem: TipoImagemEvento;
}

export enum TipoImagemEvento {
  Capa = "Capa",
  Local = "Local",
  Galeria = "Galeria",
  Convite = "Convite",
  Produto = "Produto",
  Comprovante = "Comprovante"
}
