import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';

import { ModalErrorComponent, ModalErrorData } from './modal-error.component';

describe('ModalErrorComponent', () => {
  let component: ModalErrorComponent;
  let fixture: ComponentFixture<ModalErrorComponent>;
  let dialogCloseSpy: any;

  const data: ModalErrorData = {
    title: 'Ocorreu um Erro',
    message: 'Não foi possível concluir sua solicitação. Por favor, tente novamente mais tarde.',
    okLabel: 'OK'
  };

  const dialogRefMock = {
    close: jest.fn()
  } as unknown as MatDialogRef<ModalErrorComponent>;

  beforeEach(async () => {
    dialogCloseSpy = dialogRefMock.close as any;

    await TestBed.configureTestingModule({
      imports: [ModalErrorComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: data }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ModalErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display provided title and message', () => {
    const titleEl = fixture.debugElement.query(By.css('.modal-error-title'))?.nativeElement as HTMLElement;
    const msgEl = fixture.debugElement.query(By.css('.modal-error-message'))?.nativeElement as HTMLElement;

    expect(titleEl).toBeTruthy();
    expect(msgEl).toBeTruthy();
    expect(titleEl.textContent).toContain(data.title as string);
    expect(msgEl.textContent).toContain(data.message as string);
  });

  it('should close the dialog with true when OK is clicked', () => {
    const button = fixture.debugElement.query(By.css('.ok-btn'));
    expect(button).toBeTruthy();
    button.triggerEventHandler('click', null);
    expect(dialogCloseSpy).toHaveBeenCalledWith(true);
  });
});
