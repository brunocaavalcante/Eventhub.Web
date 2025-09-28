import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';

import { ModalSucessComponent, ModalSucessData } from './modal-sucess.component';

describe('ModalSucessComponent', () => {
  let component: ModalSucessComponent;
  let fixture: ComponentFixture<ModalSucessComponent>;
  let dialogCloseSpy: any;

  const data: ModalSucessData = {
    title: 'Teste OK',
    message: 'Mensagem de sucesso personalizada',
    okLabel: 'Fechar'
  };

  const dialogRefMock = {
    close: jest.fn()
  } as unknown as MatDialogRef<ModalSucessComponent>;

  beforeEach(async () => {
    dialogCloseSpy = dialogRefMock.close as any;

    await TestBed.configureTestingModule({
      imports: [ModalSucessComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: data }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ModalSucessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display provided title and message', () => {
    const titleEl = fixture.debugElement.query(By.css('.modal-success-title'))?.nativeElement as HTMLElement;
    const msgEl = fixture.debugElement.query(By.css('.modal-success-message'))?.nativeElement as HTMLElement;

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
