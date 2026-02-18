export interface Imagem {
  id?: number;
  publicId?: string;
  url?: string;
  nomeArquivo: string;
  base64: string;
  tipoImagem: TipoImagemEvento;
  tipoArquivo: string;
}

export enum TipoImagemEvento {
  Capa = "Capa",
  Local = "Local",
  Galeria = "Galeria",
  Convite = "Convite",
  Produto = "Produto",
  Comprovante = "Comprovante"
}

const MIME_TYPE_POR_EXTENSAO: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  bmp: 'image/bmp',
  heic: 'image/heic',
  heif: 'image/heif',
  avif: 'image/avif',
  tiff: 'image/tiff',
  tif: 'image/tiff',
  ico: 'image/x-icon'
};

const MIME_TYPE_PADRAO = 'application/octet-stream';

export function extrairExtensaoArquivo(nomeArquivo: string): string {
  const partes = nomeArquivo.split('.');
  return partes.length > 1 ? partes.pop()!.toLowerCase() : '';
}

export function resolverMimeTypeArquivo(nomeArquivoOuExtensao?: string): string {
  if (!nomeArquivoOuExtensao) {
    return MIME_TYPE_PADRAO;
  }

  const valorNormalizado = nomeArquivoOuExtensao.trim().toLowerCase();

  if (!valorNormalizado) {
    return MIME_TYPE_PADRAO;
  }

  if (valorNormalizado.includes('/')) {
    return valorNormalizado;
  }

  const extensao = valorNormalizado.includes('.')
    ? extrairExtensaoArquivo(valorNormalizado)
    : valorNormalizado;

  if (!extensao) {
    return MIME_TYPE_PADRAO;
  }

  return MIME_TYPE_POR_EXTENSAO[extensao] ?? MIME_TYPE_PADRAO;
}
