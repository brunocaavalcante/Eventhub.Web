export interface ColunaTabela<T = any> {
  chave: string;
  titulo: string;
  tipo?: 'texto' | 'numero' | 'data' | 'moeda' | 'status' | 'imagem' | 'acoes';
  largura?: string;
  alinhamento?: 'left' | 'center' | 'right';
  formatador?: (valor: any, linha: T) => string;
  configStatus?: { [chave: string]: string };
  iconeAvatarPadrao?: string;
  ocultoMobile?: boolean;
}

export interface AcaoTabela<T = any> {
  label: string;
  icon: string;
  style?: string;
  visivel?: (row: T) => boolean;
  permissao?: { nome: string; claim: string };
  handler: (row: T) => void;
}

export interface ConfigTabela<T = any> {
  colunas: ColunaTabela<T>[];
  colunasExibidas?: string[];
  acoes?: AcaoTabela<T>[];
  placeholder?: string;
  estadoVazio?: {
    icone: string;
    mensagem: string;
  };
  alturaMaxima?: string;
  colunaImagemMobile?: string;
  colunaPrincipalMobile?: string;
  colunaStatusMobile?: string;
}
