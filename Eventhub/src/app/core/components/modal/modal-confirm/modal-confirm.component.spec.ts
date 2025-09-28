import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';

import { ModalConfirmComponent, ModalConfirmData } from './modal-confirm.component';

describe('ModalConfirmComponent', () => {
  let component: ModalConfirmComponent;
  let fixture: ComponentFixture<ModalConfirmComponent>;
  let dialogCloseSpy: any;

  const data: ModalConfirmData = {
    title: 'Confirmar Ação',
    message: 'Tem certeza que deseja prosseguir com esta ação? Esta operação não poderá ser desfeita.',
    cancelLabel: 'Cancelar',
    confirmLabel: 'Confirmar'
  };

  const dialogRefMock = {
    close: jest.fn()
  } as unknown as MatDialogRef<ModalConfirmComponent>;

  beforeEach(async () => {
    dialogCloseSpy = dialogRefMock.close as any;

    await TestBed.configureTestingModule({
      imports: [ModalConfirmComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: data }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ModalConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display provided title and message', () => {
    const titleEl = fixture.debugElement.query(By.css('.modal-confirm-title'))?.nativeElement as HTMLElement;
    const msgEl = fixture.debugElement.query(By.css('.modal-confirm-message'))?.nativeElement as HTMLElement;

    expect(titleEl).toBeTruthy();
    expect(msgEl).toBeTruthy();
    expect(titleEl.textContent).toContain(data.title as string);
    expect(msgEl.textContent).toContain(data.message as string);
  });

  it('should close with false when cancel is clicked', () => {
    const button = fixture.debugElement.query(By.css('.cancel-btn'));
    expect(button).toBeTruthy();
    button.triggerEventHandler('click', null);
    expect(dialogCloseSpy).toHaveBeenCalledWith(false);
  });

  it('should close with true when confirm is clicked', () => {
    const button = fixture.debugElement.query(By.css('.confirm-btn'));
    expect(button).toBeTruthy();
    button.triggerEventHandler('click', null);
    expect(dialogCloseSpy).toHaveBeenCalledWith(true);
  });
});
