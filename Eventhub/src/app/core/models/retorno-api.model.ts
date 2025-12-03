export interface RetornoAPI<T = any> {
  statusHttp: number;
  executouComSucesso: boolean;
  data: T;
  erros: string[];
}