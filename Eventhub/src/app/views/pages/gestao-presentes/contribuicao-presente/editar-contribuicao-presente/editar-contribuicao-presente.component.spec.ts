import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { EditarContribuicaoPresenteComponent } from './editar-contribuicao-presente.component';
import { AuthService } from '../../../../../core/services/auth.service';
import { SpinnerService } from '../../../../../core/services/spinner.service';
import { PresenteService } from '../../../../../core/services/presente/presente.service';

describe('EditarContribuicaoPresenteComponent', () => {
  let component: EditarContribuicaoPresenteComponent;
  let fixture: ComponentFixture<EditarContribuicaoPresenteComponent>;
  let mockAuthService: any;
  let mockPresenteService: any;
  let mockSpinnerService: any;
  let mockRouter: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    // Mock OBRIGATÓRIO do AuthService (BaseComponent)
    mockAuthService = {
      obterUsuarioLogado: jest.fn().mockResolvedValue({
        id: 1, nome: 'Usuario Teste', email: 'teste@example.com'
      })
    };

    // Mock do PresenteService
    mockPresenteService = {
      obterDetalhesPorId: jest.fn().mockReturnValue(of({
        executouComSucesso: true,
        data: {
          id: 1,
          nome: 'Liquidificador Premium',
          valor: 150.00,
          contribuicoes: [
            {
              id: 1,
              valor: 50.00,
              dataCadastro: new Date('2023-12-10'),
              status: { descricao: 'Confirmado' },
              participante: { id: 1, nome: 'Mariana Almeida', email: 'mariana@example.com' }
            }
          ]
        }
      })),
      obterStatusContribuicaoPresente: jest.fn().mockReturnValue(of({
        executouComSucesso: true,
        data: [{ id: 1, descricao: 'Confirmado' }, { id: 2, descricao: 'Cancelado' }]
      })),
      atualizarContribuicao: jest.fn().mockReturnValue(of({
        executouComSucesso: true,
        data: {}
      }))
    };

    // Mock do SpinnerService
    mockSpinnerService = {
      show: jest.fn(),
      hide: jest.fn()
    };

    // Mock do Router
    mockRouter = {
      navigate: jest.fn()
    };

    // Mock do ActivatedRoute
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn((key: string) => {
            if (key === 'idEvento') return '123';
            if (key === 'idPresente') return '1';
            if (key === 'idContribuicao') return '1';
            return null;
          })
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        EditarContribuicaoPresenteComponent,
        NoopAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: PresenteService, useValue: mockPresenteService },
        { provide: SpinnerService, useValue: mockSpinnerService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarContribuicaoPresenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar dados da contribuição ao inicializar', () => {
    expect(mockPresenteService.obterDetalhesPorId).toHaveBeenCalledWith(1);
    expect(component.contribuicao).toBeTruthy();
    expect(component.nomeConvidado).toBe('Mariana Almeida');
    expect(component.nomePresente).toBe('Liquidificador Premium');
  });

  it('deve validar campo valor obrigatório', () => {
    const campo = component.form.get('valor');
    campo?.setValue('');
    expect(campo?.hasError('required')).toBe(true);
  });

  it('deve validar campo data obrigatório', () => {
    const campo = component.form.get('dataContribuicao');
    campo?.setValue('');
    expect(campo?.hasError('required')).toBe(true);
  });

  it('deve validar campo status obrigatório', () => {
    const campo = component.form.get('status');
    campo?.setValue('');
    expect(campo?.hasError('required')).toBe(true);
  });

  it('deve alterar status ao clicar em botão', () => {
    component.selecionarStatus({ id: 1, descricao: 'Confirmado' });
    expect(component.form.get('status')?.value).toBe(1);
  });

  it('deve chamar serviço ao salvar', () => {
    component.form.patchValue({
      valor: '50.00',
      dataContribuicao: new Date('2023-12-10'),
      status: { id: 1, descricao: 'Confirmado' }
    });

    component.salvar();

    expect(mockPresenteService.atualizarContribuicao).toHaveBeenCalled();
  });

  it('deve navegar para detalhes ao cancelar sem alterações', () => {
    component.cancelar();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/presentes/detalhes', '123', 1]);
  });

  it('deve desabilitar botão salvar se formulário inválido', () => {
    component.form.get('valor')?.setValue('');
    expect(component.form.invalid).toBe(true);
  });
});
