import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastroConvidadoComponent } from './cadastro-convidado.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipanteService } from '../../../../core/services/participante.service';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { provideNgxMask } from 'ngx-mask';

describe('CadastroConvidadoComponent', () => {
  let component: CadastroConvidadoComponent;
  let fixture: ComponentFixture<CadastroConvidadoComponent>;
  let convidadoServiceMock: any;
  let routerMock: any;
  let dialogMock: any;
  let spinnerMock: any;
  const route = { snapshot: { paramMap: { get: jest.fn().mockReturnValue('evento123') } } };
  const mockUsuarioService = {
    obterUsuarioLogado: jest.fn().mockResolvedValue(null)
  };

  beforeEach(async () => {
    convidadoServiceMock = { cadastro: jest.fn().mockResolvedValue({}) };
    routerMock = { navigate: jest.fn() };
    dialogMock = { open: jest.fn(() => ({ afterClosed: () => ({ subscribe: jest.fn() }) })) };
    spinnerMock = { show: jest.fn(), hide: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [CadastroConvidadoComponent, ReactiveFormsModule],
      providers: [
        { provide: ParticipanteService, useValue: convidadoServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: SpinnerService, useValue: spinnerMock },
        { provide: ActivatedRoute, useValue: route },
        { provide: UsuarioService, useValue: mockUsuarioService },
        provideNgxMask()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CadastroConvidadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir erro se o nome estiver vazio', () => {
    component.form.patchValue({ nome: '', email: 'a@a.com', telefone: '123' });
    component.adicionarConvidado();
    expect(component.erros()).toContain('nome');
  });

  it('deve exibir erro se email e telefone estiverem vazios', () => {
    component.form.patchValue({ nome: 'Teste', email: '', telefone: '' });
    component.adicionarConvidado();
    expect(component.erros()).toContain('e-mail ou o telefone');
  });

  it('deve chamar service.cadastro quando o formulário for válido', async () => {
    component.form.patchValue({ nome: 'Teste', email: 'a@a.com', telefone: '(11) 96449-0371' });
    component.idEvento = '1';
    await component.adicionarConvidado();
    expect(convidadoServiceMock.cadastro).toHaveBeenCalled();
  });

  it('deve abrir modal de sucesso e navegar após cadastro', async () => {
    const dialogSpy = jest.spyOn(dialogMock, 'open').mockReturnValue({ afterClosed: () => ({ subscribe: (fn: any) => fn() }) } as any);
    component.form.patchValue({ nome: 'Teste', email: 'a@a.com', telefone: '(11) 96449-0371' });
    component.idEvento = '1';
    await component.adicionarConvidado();
    expect(dialogSpy).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/convidados/consultar', '1']);
  });

  it('deve abrir modal de cancelamento e navegar se confirmado', () => {
    const afterClosedMock = { subscribe: (fn: any) => fn(true) };
    dialogMock.open = jest.fn(() => ({ afterClosed: () => afterClosedMock }));
    component.idEvento = '1';
    component.abrirModalCancelar();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/convidados/consultar', '1']);
  });
});
