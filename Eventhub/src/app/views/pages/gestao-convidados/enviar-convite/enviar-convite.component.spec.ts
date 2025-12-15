import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { EnviarConviteComponent } from './enviar-convite.component';
import { EventoService } from '../../../../core/services/evento.service';
import { TipoEventoService } from '../../../../core/services/tipo-evento.service';
import { EnvioConviteService } from '../../../../core/services/envio-convite.service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { EventoDto, TipoEvento } from '../../../../core/models/evento.model';
import { RetornoAPI } from '../../../../core/models/retorno-api.model';
import { ConviteDTO } from '../../../../core/models/envio.convite.model';
import { Base64ImageUtil } from '../../../../core/utils/base64-image.util';
import { ModalSucessComponent } from '../../../../core/components/modal/modal-sucess/modal-sucess.component';

describe('EnviarConviteComponent', () => {
  let component: EnviarConviteComponent;
  let fixture: ComponentFixture<EnviarConviteComponent>;

  let eventoServiceMock: { buscarEventoPorId: jest.Mock };
  let tipoEventoServiceMock: { obterTiposEvento: jest.Mock };
  let conviteServiceMock: { buscarConvitePorEvento: jest.Mock; criarConvite: jest.Mock; atualizarConvite: jest.Mock };
  let bottomSheetMock: { open: jest.Mock };
  let dialogMock: { open: jest.Mock };
  let usuarioServiceMock: { obterUsuarioLogado: jest.Mock };

  const mockEvento: EventoDto = {
    id: 1,
    idTipoEvento: 2,
    nome: 'Evento Teste',
    dataInicio: new Date('2024-05-10T18:00:00Z'),
    dataFim: new Date('2024-05-10T21:00:00Z'),
    tipoData: 'unica',
    endereco: {
      cep: '01000-000',
      logradouro: 'Rua Principal',
      cidade: 'São Paulo',
      numero: '100',
      pontoReferencia: 'Centro',
      nomeLocal: 'Espaço Garden'
    }
  };

  const mockTipoEventos: TipoEvento[] = [
    { id: 2, nome: 'Casamento', icon: 'wedding' }
  ];

  const createApiResponse = <T>(data: T): RetornoAPI<T> => ({
    statusHttp: 200,
    executouComSucesso: true,
    data,
    erros: []
  });

  const setValidFormValues = (overrides: Record<string, unknown> = {}) => {
    component.form.patchValue({
      name1: 'João',
      name2: 'Maria',
      eventDate: new Date('2024-05-10'),
      eventTime: '18:00',
      eventEndDate: new Date('2024-05-10'),
      eventEndTime: '21:00',
      venueName: 'Espaço Garden',
      venueAddress: 'Rua Principal, 100',
      message: 'Mensagem padrão',
      themeColor: 'rose',
      fontStyle: 'elegant',
      backgroundImage: 'data:image/png;base64,AAA',
      ...overrides
    });
    component.form.updateValueAndValidity();
  };

  beforeEach(async () => {
    eventoServiceMock = { buscarEventoPorId: jest.fn() };
    tipoEventoServiceMock = { obterTiposEvento: jest.fn() };
    conviteServiceMock = {
      buscarConvitePorEvento: jest.fn(),
      criarConvite: jest.fn(),
      atualizarConvite: jest.fn()
    };
    bottomSheetMock = { open: jest.fn() };
    dialogMock = { open: jest.fn() };
    usuarioServiceMock = { obterUsuarioLogado: jest.fn() };

    eventoServiceMock.buscarEventoPorId.mockReturnValue(of(createApiResponse(mockEvento)));
    tipoEventoServiceMock.obterTiposEvento.mockReturnValue(of(createApiResponse(mockTipoEventos)));
    conviteServiceMock.buscarConvitePorEvento.mockReturnValue(of(createApiResponse(null)));

    await TestBed.configureTestingModule({
      imports: [EnviarConviteComponent],
      providers: [
        { provide: EventoService, useValue: eventoServiceMock },
        { provide: TipoEventoService, useValue: tipoEventoServiceMock },
        { provide: EnvioConviteService, useValue: conviteServiceMock },
        { provide: MatBottomSheet, useValue: bottomSheetMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: UsuarioService, useValue: usuarioServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EnviarConviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    component.evento.set(mockEvento);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('deve criar um novo template quando nenhum convite existe', async () => {
    const createdConvite = { id: 10 } as ConviteDTO;
    conviteServiceMock.criarConvite.mockReturnValue(of(createApiResponse(createdConvite)));
    const base64Spy = jest.spyOn(Base64ImageUtil, 'getBackgroundBase64').mockResolvedValue('generated-base64');

    setValidFormValues();

    await component.saveTemplate();

    expect(base64Spy).toHaveBeenCalledWith('data:image/png;base64,AAA');
    expect(conviteServiceMock.criarConvite).toHaveBeenCalledTimes(1);
    expect(conviteServiceMock.atualizarConvite).not.toHaveBeenCalled();

    const dialogArgs = dialogMock.open.mock.calls[0];
    expect(dialogArgs[0]).toBe(ModalSucessComponent);
    expect(dialogArgs[1]?.data?.title).toBe('Cadastro Realizado');
  });

  it('não deve criar template com formulário inválido', async () => {
    component.form.patchValue({ name1: '' });
    const base64Spy = jest.spyOn(Base64ImageUtil, 'getBackgroundBase64');

    await component.saveTemplate();
    expect(base64Spy).not.toHaveBeenCalled();
    expect(conviteServiceMock.criarConvite).not.toHaveBeenCalled();
    expect(conviteServiceMock.atualizarConvite).not.toHaveBeenCalled();
  });

  it('deve validar campo obrigatório no formulário', () => {
    component.form.patchValue({
      name1: '', eventDate: '',
      eventTime: '',
      eventEndDate: '',
      eventEndTime: '',
      venueName: '',
      venueAddress: ''
    });

    component.form.markAllAsTouched();
    fixture.detectChanges();
    expect(component.form.valid).toBeFalsy();
    expect(component.form.controls['name1'].errors?.['required']).toBeTruthy();
    expect(component.form.controls['eventDate'].errors?.['required']).toBeTruthy();
    expect(component.form.controls['eventTime'].errors?.['required']).toBeTruthy();
    expect(component.form.controls['eventEndDate'].errors?.['required']).toBeTruthy();
    expect(component.form.controls['eventEndTime'].errors?.['required']).toBeTruthy();
    expect(component.form.controls['venueName'].errors?.['required']).toBeTruthy();
    expect(component.form.controls['venueAddress'].errors?.['required']).toBeTruthy();
  });

  it('deve atualizar o template quando um convite já existe', async () => {
    const existingConvite = {
      id: 55,
      idEvento: 1,
      nome: 'Convite Atual',
      nome2: 'Convidado',
      mensagem: 'Mensagem',
      temaConvite: 'rose',
      foto: { id: 5, base64: 'existing-base64' }
    } as unknown as ConviteDTO;
    component.convite.set(existingConvite);

    const updatedConvite = { ...existingConvite, nome: 'Novo Nome' } as ConviteDTO;
    conviteServiceMock.atualizarConvite.mockReturnValue(of(createApiResponse(updatedConvite)));
    jest.spyOn(Base64ImageUtil, 'getBackgroundBase64').mockResolvedValue('updated-base64');

    setValidFormValues({ name1: 'Novo Nome' });

    await component.saveTemplate();

    expect(conviteServiceMock.criarConvite).not.toHaveBeenCalled();

    const updatePayload = conviteServiceMock.atualizarConvite.mock.calls[0][0];
    expect(updatePayload.id).toBe(existingConvite.id);
    expect(updatePayload.nome).toBe('Novo Nome');
    expect(updatePayload.foto.base64).toBe('updated-base64');

    expect(component.convite()).toEqual(updatedConvite);

    const dialogArgs = dialogMock.open.mock.calls[0];
    expect(dialogArgs[0]).toBe(ModalSucessComponent);
    expect(dialogArgs[1]?.data?.title).toBe('Atualização Realizada');
  });

  it('não deve chamar os serviços da API quando o formulário for inválido', async () => {
    component.form.reset();
    const base64Spy = jest.spyOn(Base64ImageUtil, 'getBackgroundBase64');

    await component.saveTemplate();

    expect(conviteServiceMock.criarConvite).not.toHaveBeenCalled();
    expect(conviteServiceMock.atualizarConvite).not.toHaveBeenCalled();
    expect(base64Spy).not.toHaveBeenCalled();
  });
});
