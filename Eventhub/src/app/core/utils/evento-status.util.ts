import { StatusEvento } from "../models/evento.model";

export interface StatusEventoInfo {
  label: string;
  class: string;
}

export const StatusEventoMap: Record<number, StatusEventoInfo> = {
  [StatusEvento.Ativo]: { label: 'Ativo', class: 'status-ativo' },
  [StatusEvento.Rascunho]: { label: 'Rascunho', class: 'status-rascunho' },
  [StatusEvento.Finalizado]: { label: 'Finalizado', class: 'status-finalizado' },
  [StatusEvento.Cancelado]: { label: 'Cancelado', class: 'status-cancelado' }
};

/**
 * Retorna as informações de status do evento (label e classe CSS)
 * @param idStatus - ID do status do evento
 * @returns Objeto com label e classe CSS do status
 */
export function getStatusEventoInfo(idStatus?: number): StatusEventoInfo {
  return StatusEventoMap[idStatus || 0] || { label: 'Desconhecido', class: '' };
}
