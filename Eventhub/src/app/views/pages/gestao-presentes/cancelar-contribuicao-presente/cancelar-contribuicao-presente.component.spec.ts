import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CancelarContribuicaoPresenteComponent, CancelarContribuicaoData } from './cancelar-contribuicao-presente.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ContribuicaoDetalhesDto } from '../../../../core/models/presente.model';
import { UsuarioService } from '../../../../core/services/usuario.service';

describe('CancelarContribuicaoPresenteComponent', () => {
  let component: CancelarContribuicaoPresenteComponent;
  let fixture: ComponentFixture<CancelarContribuicaoPresenteComponent>;
  let mockDialogRef: any;

  const mockContribuicao: ContribuicaoDetalhesDto = {
    id: 1,
    valor: 50,
    dataCadastro: '2024-01-01',
    status: 'Confirmado',
    participante: { id: 1, nome: 'Mariana Almeida', foto: '' }
  };

  const mockData: CancelarContribuicaoData = {
    contribuicao: mockContribuicao
  };

  beforeEach(async () => {
    mockDialogRef = { close: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [CancelarContribuicaoPresenteComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: UsuarioService, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CancelarContribuicaoPresenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar formulário', () => {
    expect(component.form).toBeDefined();
    expect(component.form.get('justificativa')).toBeDefined();
  });

  it('deve retornar contribuição do data', () => {
    expect(component.contribuicao).toEqual(mockContribuicao);
  });

  it('deve validar campo justificativa como obrigatório', () => {
    const justificativa = component.form.get('justificativa');
    justificativa?.setValue('');
    expect(justificativa?.hasError('required')).toBe(true);
  });

  it('deve validar tamanho mínimo da justificativa', () => {
    const justificativa = component.form.get('justificativa');
    justificativa?.setValue('curto');
    expect(justificativa?.hasError('minlength')).toBe(true);
  });

  it('deve aceitar justificativa válida', () => {
    const justificativa = component.form.get('justificativa');
    justificativa?.setValue('Esta é uma justificativa válida com mais de 10 caracteres');
    expect(justificativa?.valid).toBe(true);
  });

  it('deve fechar modal ao cancelar', () => {
    component.cancelar();
    expect(mockDialogRef.close).toHaveBeenCalledWith({ confirmado: false });
  });

  it('não deve confirmar se formulário inválido', () => {
    component.form.get('justificativa')?.setValue('');
    component.confirmar();
    expect(component.form.valid).toBe(false);
    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });

  it('deve confirmar com justificativa válida', () => {
    const justificativaTexto = 'Contribuição cancelada por erro no pagamento';
    component.form.get('justificativa')?.setValue(justificativaTexto);
    component.confirmar();
    expect(mockDialogRef.close).toHaveBeenCalledWith({
      confirmado: true,
      justificativa: justificativaTexto
    });
  });

  it('deve marcar todos os campos como touched ao tentar confirmar com formulário inválido', () => {
    component.form.get('justificativa')?.setValue('');
    const markTouchedSpy = jest.spyOn(component.form, 'markAllAsTouched');
    component.confirmar();
    expect(markTouchedSpy).toHaveBeenCalled();
  });
});
