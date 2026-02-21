import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import { CancelarReservaPresenteDto, ReservarPresenteDto } from '../../models/presente.model';
import { PresenteService } from './presente.service';

describe('PresenteService - Reserva de Presentes', () => {
  let service: PresenteService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.urlApi;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PresenteService]
    });
    service = TestBed.inject(PresenteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('reservarPresente', () => {
    it('deve enviar requisição POST para reservar presente', () => {
      const reserva: ReservarPresenteDto = {
        idPresente: 1,
        idParticipante: 123
      };

      const mockResponse = {
        executouComSucesso: true,
        data: {
          id: 1,
          nome: 'Presente Teste',
          status: { id: 2, descricao: 'Reservado' },
          idParticipanteReservou: 123,
          dataReserva: new Date().toISOString()
        },
        erros: [],
        avisos: []
      };

      service.reservarPresente(reserva).subscribe(response => {
        expect(response.executouComSucesso).toBe(true);
        expect(response.data?.status?.id).toBe(2);
        expect(response.data?.idParticipanteReservou).toBe(123);
      });

      const req = httpMock.expectOne(`${apiUrl}/presentes/${reserva.idPresente}/reservar`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(reserva);
      req.flush(mockResponse);
    });

    it('deve tratar erro ao reservar presente', () => {
      const reserva: ReservarPresenteDto = {
        idPresente: 1,
        idParticipante: 123
      };

      const mockError = {
        executouComSucesso: false,
        data: null,
        erros: ['Presente já possui contribuições'],
        avisos: []
      };

      service.reservarPresente(reserva).subscribe(response => {
        expect(response.executouComSucesso).toBe(false);
        expect(response.erros).toContain('Presente já possui contribuições');
      });

      const req = httpMock.expectOne(`${apiUrl}/presentes/${reserva.idPresente}/reservar`);
      req.flush(mockError);
    });
  });

  describe('cancelarReserva', () => {
    it('deve enviar requisição POST para cancelar reserva', () => {
      const cancelamento: CancelarReservaPresenteDto = {
        idPresente: 1,
        idParticipante: 123,
        justificativa: 'Consegui o presente em outro lugar'
      };

      const mockResponse = {
        executouComSucesso: true,
        data: null,
        erros: [],
        avisos: []
      };

      service.cancelarReserva(cancelamento).subscribe(response => {
        expect(response.executouComSucesso).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/presentes/${cancelamento.idPresente}/cancelar-reserva`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(cancelamento);
      req.flush(mockResponse);
    });

    it('deve tratar erro ao cancelar reserva', () => {
      const cancelamento: CancelarReservaPresenteDto = {
        idPresente: 1,
        idParticipante: 123,
        justificativa: 'Motivo'
      };

      const mockError = {
        executouComSucesso: false,
        data: null,
        erros: ['Justificativa deve ter no mínimo 10 caracteres'],
        avisos: []
      };

      service.cancelarReserva(cancelamento).subscribe(response => {
        expect(response.executouComSucesso).toBe(false);
        expect(response.erros).toContain('Justificativa deve ter no mínimo 10 caracteres');
      });

      const req = httpMock.expectOne(`${apiUrl}/presentes/${cancelamento.idPresente}/cancelar-reserva`);
      req.flush(mockError);
    });

    it('deve validar justificativa mínima de 10 caracteres', () => {
      const cancelamentoInvalido: CancelarReservaPresenteDto = {
        idPresente: 1,
        idParticipante: 123,
        justificativa: 'abc' // Menos de 10 caracteres
      };

      expect(cancelamentoInvalido.justificativa.length).toBeLessThan(10);
    });
  });
});
