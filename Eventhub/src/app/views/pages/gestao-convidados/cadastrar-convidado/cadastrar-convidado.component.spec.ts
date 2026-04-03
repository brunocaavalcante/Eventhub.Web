import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { CadastrarConvidadoComponent } from './cadastrar-convidado.component';
import { ParticipanteService } from '../../../../core/services/participante.service';
import { ModalService } from '../../../../core/services/modal.service';
import { SpinnerService } from '../../../../core/services/spinner.service';

describe('CadastrarConvidadoComponent', () => {
  let component: CadastrarConvidadoComponent;
  let fixture: ComponentFixture<CadastrarConvidadoComponent>;
  let mockParticipanteService: jest.Mocked<ParticipanteService>;
  let mockModalService: jest.Mocked<ModalService>;
  let mockSpinnerService: jest.Mocked<SpinnerService>;
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: Partial<ActivatedRoute>;

  beforeEach(async () => {
    mockParticipanteService = {
      cadastrarConvidado: jest.fn()
    } as any;

    mockModalService = {
      openSuccessModal: jest.fn().mockReturnValue(of(true)),
      openErrorModal: jest.fn().mockReturnValue(of(true))
    } as any;

    mockSpinnerService = {
      show: jest.fn(),
      hide: jest.fn()
    } as any;

    mockRouter = {
      navigate: jest.fn()
    } as any;

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue('1')
        }
      } as any
    };

    await TestBed.configureTestingModule({
      imports: [CadastrarConvidadoComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ParticipanteService, useValue: mockParticipanteService },
        { provide: ModalService, useValue: mockModalService },
        { provide: SpinnerService, useValue: mockSpinnerService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CadastrarConvidadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar formulário com campos vazios', () => {
    expect(component.formulario.get('nome')?.value).toBe('');
    expect(component.formulario.get('telefone')?.value).toBe('');
    expect(component.formulario.get('email')?.value).toBe('');
  });

  it('deve validar campo nome obrigatório', () => {
    const nome = component.formulario.get('nome');
    expect(nome?.valid).toBe(false);

    nome?.setValue('João Silva');
    expect(nome?.valid).toBe(true);
  });

  it('deve validar formato de telefone', () => {
    const telefone = component.formulario.get('telefone');
    
    telefone?.setValue('123');
    expect(telefone?.valid).toBe(false);

    telefone?.setValue('(11) 99999-9999');
    expect(telefone?.valid).toBe(true);
  });

  it('deve validar email opcional', () => {
    const email = component.formulario.get('email');
    
    // Email vazio é válido (opcional)
    expect(email?.valid).toBe(true);

    email?.setValue('invalido');
    expect(email?.valid).toBe(false);

    email?.setValue('teste@email.com');
    expect(email?.valid).toBe(true);
  });

  it('deve cadastrar convidado com sucesso', () => {
    mockParticipanteService.cadastrarConvidado.mockReturnValue(of({
      executouComSucesso: true,
      data: null as any,
      statusHttp: 201,
      erros: []
    }));

    component.formulario.patchValue({
      nome: 'João Silva',
      telefone: '(11) 99999-9999',
      email: 'joao@email.com'
    });

    component.salvar();

    expect(mockParticipanteService.cadastrarConvidado).toHaveBeenCalled();
    expect(mockModalService.openSuccessModal).toHaveBeenCalledWith({ title: 'Convidado cadastrado com sucesso!' });
  });
});
