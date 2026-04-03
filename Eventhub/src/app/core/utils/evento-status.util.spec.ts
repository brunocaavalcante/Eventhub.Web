import { getStatusEventoInfo, StatusEventoMap } from './evento-status.util';
import { StatusEvento } from '../models/evento.model';

describe('EventoStatusUtil', () => {
  describe('getStatusEventoInfo', () => {
    it('deve retornar informações corretas para status Ativo', () => {
      const result = getStatusEventoInfo(StatusEvento.Ativo);
      expect(result.label).toBe('Ativo');
      expect(result.class).toBe('status-ativo');
    });

    it('deve retornar informações corretas para status Rascunho', () => {
      const result = getStatusEventoInfo(StatusEvento.Rascunho);
      expect(result.label).toBe('Rascunho');
      expect(result.class).toBe('status-rascunho');
    });

    it('deve retornar informações corretas para status Finalizado', () => {
      const result = getStatusEventoInfo(StatusEvento.Finalizado);
      expect(result.label).toBe('Finalizado');
      expect(result.class).toBe('status-finalizado');
    });

    it('deve retornar informações corretas para status Cancelado', () => {
      const result = getStatusEventoInfo(StatusEvento.Cancelado);
      expect(result.label).toBe('Cancelado');
      expect(result.class).toBe('status-cancelado');
    });

    it('deve retornar "Desconhecido" para status inválido', () => {
      const result = getStatusEventoInfo(999);
      expect(result.label).toBe('Desconhecido');
      expect(result.class).toBe('');
    });

    it('deve retornar "Desconhecido" quando idStatus é undefined', () => {
      const result = getStatusEventoInfo(undefined);
      expect(result.label).toBe('Desconhecido');
      expect(result.class).toBe('');
    });

    it('deve retornar "Desconhecido" quando idStatus é 0', () => {
      const result = getStatusEventoInfo(0);
      expect(result.label).toBe('Desconhecido');
      expect(result.class).toBe('');
    });
  });

  describe('StatusEventoMap', () => {
    it('deve conter todos os status do enum StatusEvento', () => {
      expect(StatusEventoMap[StatusEvento.Ativo]).toBeDefined();
      expect(StatusEventoMap[StatusEvento.Rascunho]).toBeDefined();
      expect(StatusEventoMap[StatusEvento.Finalizado]).toBeDefined();
      expect(StatusEventoMap[StatusEvento.Cancelado]).toBeDefined();
    });

    it('deve ter exatamente 4 entradas', () => {
      expect(Object.keys(StatusEventoMap).length).toBe(4);
    });
  });
});
