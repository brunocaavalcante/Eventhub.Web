import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ResponderConviteComponent } from './responder-convite.component';
import { EventoService } from '../../../../core/services/evento.service';
import { ParticipanteService } from '../../../../core/services/participante.service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { AuthService } from '../../../../core/services/auth.service';

describe('ResponderConviteComponent', () => {
  let component: ResponderConviteComponent;
  let fixture: ComponentFixture<ResponderConviteComponent>;
  let mockEventoService: any;
  let mockParticipanteService: any;
  let mockUsuarioService: any;
  let mockAuthService: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockEventoService = {
      buscarEventoPorToken: jest.fn()
    };

    mockParticipanteService = {
      confirmarPresenca: jest.fn(),
      recusarConvite: jest.fn()
    };

    mockUsuarioService = {
      obterUsuarioLogado: jest.fn().mockReturnValue(null),
      verificarEmailExiste: jest.fn(),
      cadastro: jest.fn()
    };

    mockAuthService = {
      login: jest.fn()
    };

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue('123')
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [ResponderConviteComponent, NoopAnimationsModule, HttpClientTestingModule],
      providers: [
        { provide: EventoService, useValue: mockEventoService },
        { provide: ParticipanteService, useValue: mockParticipanteService },
        { provide: UsuarioService, useValue: mockUsuarioService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResponderConviteComponent);
    component = fixture.componentInstance;
  });

  it('deve criar componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar evento ao inicializar', () => {
    const mockEvento = {
      id: 123,
      idStatus: 1,
      status: 'Ativo',
      nome: 'Casamento',
      descricao: 'Evento de casamento',
      maxConvidado: 100,
      idTipoEvento: 1,
      tipoEvento: 'Casamento',
      dataInicio: new Date(),
      dataFim: new Date(),
      fotoCapaBase64: '',
      tipoData: 'unica' as const
    };

    mockEventoService.buscarEventoPorToken.mockReturnValue(
      of({ executouComSucesso: true, data: mockEvento })
    );

    fixture.detectChanges();

    expect(mockEventoService.buscarEventoPorToken).toHaveBeenCalledWith('123');
    expect(component.evento()).toEqual(mockEvento);
  });

  it('deve validar quantidade mínima de acompanhantes', () => {
    const mockEvento = {
      id: 123,
      idStatus: 1,
      status: 'Ativo',
      nome: 'Evento',
      descricao: 'Descrição do evento',
      maxConvidado: 50,
      idTipoEvento: 1,
      tipoEvento: 'Festa',
      dataInicio: new Date(),
      dataFim: new Date(),
      fotoCapaBase64: '',
      tipoData: 'unica' as const
    };

    mockEventoService.buscarEventoPorToken.mockReturnValue(
      of({ executouComSucesso: true, data: mockEvento })
    );

    fixture.detectChanges();

    component.formResposta.patchValue({
      vaiComparecer: 'sim',
      qtdAcompanhantes: -1
    });

    expect(component.formResposta.get('qtdAcompanhantes')?.hasError('min')).toBeTruthy();
  });

  it('deve detectar email existente', fakeAsync(() => {
    const mockEvento = {
      id: 123,
      idStatus: 1,
      status: 'Ativo',
      nome: 'Evento',
      descricao: 'Descrição do evento',
      maxConvidado: 50,
      idTipoEvento: 1,
      tipoEvento: 'Festa',
      dataInicio: new Date(),
      dataFim: new Date(),
      fotoCapaBase64: '',
      tipoData: 'unica' as const
    };

    mockEventoService.buscarEventoPorToken.mockReturnValue(
      of({ executouComSucesso: true, data: mockEvento })
    );

    mockUsuarioService.verificarEmailExiste.mockReturnValue(
      of({ executouComSucesso: true, data: { existe: true } })
    );

    fixture.detectChanges();
    tick();

    component.verificarEmail('teste@email.com');
    tick();

    expect(component.emailJaExiste()).toBeTruthy();
  }));

  it('deve habilitar campos de cadastro se email não existe', fakeAsync(() => {
    const mockEvento = {
      id: 123,
      idStatus: 1,
      status: 'Ativo',
      nome: 'Evento',
      descricao: 'Descrição do evento',
      maxConvidado: 50,
      idTipoEvento: 1,
      tipoEvento: 'Festa',
      dataInicio: new Date(),
      dataFim: new Date(),
      fotoCapaBase64: '',
      tipoData: 'unica' as const
    };

    mockEventoService.buscarEventoPorToken.mockReturnValue(
      of({ executouComSucesso: true, data: mockEvento })
    );

    mockUsuarioService.verificarEmailExiste.mockReturnValue(
      of({ executouComSucesso: false })
    );

    fixture.detectChanges();
    tick();

    component.verificarEmail('novoemail@email.com');
    tick();

    expect(component.emailJaExiste()).toBeFalsy();
    expect(component.formCadastro.get('nome')?.disabled).toBeFalsy();
  }));

  it('deve validar senhas iguais', () => {
    const mockEvento = {
      id: 123,
      idStatus: 1,
      status: 'Ativo',
      nome: 'Evento',
      descricao: 'Descrição do evento',
      maxConvidado: 50,
      idTipoEvento: 1,
      tipoEvento: 'Festa',
      dataInicio: new Date(),
      dataFim: new Date(),
      fotoCapaBase64: '',
      tipoData: 'unica' as const
    };

    mockEventoService.buscarEventoPorToken.mockReturnValue(
      of({ executouComSucesso: true, data: mockEvento })
    );

    fixture.detectChanges();

    component.emailJaExiste.set(false);
    component.formCadastro.patchValue({
      senha: '123456',
      confirmarSenha: '654321'
    });

    const resultado = component.validarSenhasIguais();

    expect(resultado).toBeFalsy();
  });

  it('deve confirmar presença com sucesso', fakeAsync(() => {
    // Configurar evento mock
    const mockEvento = {
      id: 123,
      idStatus: 1,
      status: 'Ativo',
      nome: 'Casamento',
      descricao: 'Evento de casamento',
      maxConvidado: 100,
      idTipoEvento: 1,
      tipoEvento: 'Casamento',
      dataInicio: new Date(),
      dataFim: new Date(),
      fotoCapaBase64: '',
      tipoData: 'unica' as const
    };

    mockEventoService.buscarEventoPorToken.mockReturnValue(
      of({ executouComSucesso: true, data: mockEvento })
    );

    mockParticipanteService.confirmarPresenca.mockReturnValue(
      of({ executouComSucesso: true })
    );

    mockUsuarioService.verificarEmailExiste.mockReturnValue(
      of({ executouComSucesso: false })
    );

    // Inicializar o componente
    fixture.detectChanges();
    tick();

    // Preencher formulários
    component.formResposta.patchValue({
      vaiComparecer: 'sim',
      qtdAcompanhantes: 2,
      mensagemOrganizador: 'Estarei lá!'
    });

    component.formCadastro.patchValue({
      email: 'teste@exemplo.com',
      nome: 'João Silva'
    });

    component.salvarConfirmacao();
    tick();

    expect(mockParticipanteService.confirmarPresenca).toHaveBeenCalled();
  }));
});
