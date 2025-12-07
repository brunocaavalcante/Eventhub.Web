import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CadastroOrganizadoresComponent } from './cadastro-organizadores.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { UsuarioService } from '../../../../../core/services/usuario.service';
import { PerfilService } from '../../../../../core/services/perfil.service';

class MatDialogMock {
  open() {
    return { afterClosed: () => of(true) };
  }
}

const mockPerfilService = {
  obterPerfis: jest.fn(() => of({
    executouComSucesso: true,
    data: [],
    statusHttp: 200,
    erros: []
  })),
};

describe('CadastroOrganizadoresComponent', () => {
  let component: CadastroOrganizadoresComponent;
  let fixture: ComponentFixture<CadastroOrganizadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, CadastroOrganizadoresComponent, HttpClientTestingModule],
      providers: [
        { provide: MatDialog, useClass: MatDialogMock },
        { provide: UsuarioService, useValue: {} },
        { provide: PerfilService, useValue: mockPerfilService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CadastroOrganizadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve adicionar um organizador válido', () => {
    component.form.patchValue({
      tipo: 'Pessoa Física',
      nome: 'João',
      email: 'joao@email.com',
      telefone: '11999999999'
    });
    component.adicionarOrganizador();
    expect(component.organizadores.length).toBe(1);
    expect(component.organizadores[0].nome).toBe('João');
  });

  it('não deve adicionar organizador inválido', () => {
    component.form.patchValue({
      tipo: 'Pessoa Física',
      nome: '',
      email: '',
      telefone: ''
    });
    component.adicionarOrganizador();
    expect(component.organizadores.length).toBe(0);
  });

  it('deve editar um organizador', () => {
    component.form.patchValue({
      tipo: 'Pessoa Física',
      nome: 'Maria',
      email: 'maria@email.com',
      telefone: '11988888888'
    });
    component.adicionarOrganizador();
    component.editarOrganizador(0);
    component.form.patchValue({ nome: 'Maria Editada' });
    component.adicionarOrganizador();
    expect(component.organizadores[0].nome).toBe('Maria Editada');
  });

  it('deve remover um organizador após confirmação', async () => {
    component.form.patchValue({
      tipo: 'Pessoa Física',
      nome: 'Carlos',
      email: 'carlos@email.com',
      telefone: '11977777777'
    });
    component.adicionarOrganizador();
    expect(component.organizadores.length).toBe(1);
    await component.removerOrganizador(0);
    expect(component.organizadores.length).toBe(0);
  });
  describe('Mensagens de validação', () => {

    it('deve exibir mensagem de validação se nome for vazio e tocado', () => {
      const nomeControl = component.form.get('nome');
      nomeControl?.setValue('');
      nomeControl?.markAsTouched();
      component.validarCampo();
      expect(component.displayMessage['nome']).toContain('obrigatório');
    });

    it('deve exibir mensagem de validação se email for vazio e tocado', () => {
      const emailControl = component.form.get('email');
      emailControl?.setValue('');
      emailControl?.markAsTouched();
      component.validarCampo();
      expect(component.displayMessage['email']).toContain('obrigatório');
    });

    it('deve exibir mensagem de validação se email for inválido', () => {
      const emailControl = component.form.get('email');
      emailControl?.setValue('email-invalido');
      emailControl?.markAsTouched();
      component.validarCampo();
      expect(component.displayMessage['email']).toContain('deve ser válido.');
    });

    it('deve exibir mensagem de validação se telefone for vazio e tocado', () => {
      const telefoneControl = component.form.get('telefone');
      telefoneControl?.setValue('');
      telefoneControl?.markAsTouched();
      component.validarCampo();
      expect(component.displayMessage['telefone']).toContain('obrigatório');
    });
  });
});
