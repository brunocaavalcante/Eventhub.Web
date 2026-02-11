import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ModalInputComponent, ModalInputData } from './modal-input.component';

describe('ModalInputComponent', () => {
  let component: ModalInputComponent;
  let fixture: ComponentFixture<ModalInputComponent>;
  let mockDialogRef: jest.Mocked<MatDialogRef<ModalInputComponent>>;

  const mockData: ModalInputData = {
    title: 'Cancelar Reserva',
    message: 'Tem certeza que deseja cancelar a reserva?',
    inputLabel: 'Justificativa',
    inputPlaceholder: 'Digite o motivo',
    inputType: 'textarea',
    confirmLabel: 'Sim, Cancelar',
    cancelLabel: 'Voltar',
    inputRequired: true,
    inputMinLength: 10,
    inputMaxLength: 500
  };

  beforeEach(async () => {
    mockDialogRef = {
      close: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [ModalInputComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir título e mensagem corretos', () => {
    const title = fixture.nativeElement.querySelector('h2');
    const message = fixture.nativeElement.querySelector('.modal-message');

    expect(title.textContent).toContain('Cancelar Reserva');
    expect(message.textContent).toContain('Tem certeza que deseja cancelar a reserva?');
  });

  it('deve validar campo obrigatório', () => {
    component.inputValue.set('');
    expect(component.isValid()).toBe(false);
  });

  it('deve validar comprimento mínimo', () => {
    component.inputValue.set('abc'); // Menos de 10 caracteres
    expect(component.isValid()).toBe(false);

    component.inputValue.set('1234567890'); // Exatamente 10 caracteres
    expect(component.isValid()).toBe(true);
  });

  it('deve validar comprimento máximo', () => {
    const longText = 'a'.repeat(501); // Mais de 500 caracteres
    component.inputValue.set(longText);
    expect(component.isValid()).toBe(false);

    const validText = 'a'.repeat(500); // Exatamente 500 caracteres
    component.inputValue.set(validText);
    expect(component.isValid()).toBe(true);
  });

  it('deve fechar modal com valor ao confirmar com input válido', () => {
    const validInput = 'Esta é uma justificativa válida com mais de 10 caracteres';
    component.inputValue.set(validInput);

    component.onConfirm();

    expect(mockDialogRef.close).toHaveBeenCalledWith(validInput);
  });

  it('não deve fechar modal ao confirmar com input inválido', () => {
    component.inputValue.set('abc'); // Inválido

    component.onConfirm();

    expect(mockDialogRef.close).not.toHaveBeenCalled();
    expect(component.showError()).toBe(true);
  });

  it('deve limpar erro ao alterar input', () => {
    component.showError.set(true);
    component.errorMessage.set('Erro de teste');

    component.onInputChange();

    expect(component.showError()).toBe(false);
    expect(component.errorMessage()).toBe('');
  });

  it('deve desabilitar botão confirmar quando input inválido', () => {
    component.inputValue.set('abc');
    fixture.detectChanges();

    const confirmBtn = fixture.nativeElement.querySelector('.btn-confirm');
    expect(confirmBtn.disabled).toBe(true);
  });

  it('deve habilitar botão confirmar quando input válido', () => {
    component.inputValue.set('Esta é uma justificativa válida');
    fixture.detectChanges();

    const confirmBtn = fixture.nativeElement.querySelector('.btn-confirm');
    expect(confirmBtn.disabled).toBe(false);
  });
});
