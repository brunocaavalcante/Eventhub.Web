import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ItemTemplate } from '../template-convite.component';
import { ModalEditarItemComponent } from './modal-editar-item.component';

describe('ModalEditarItemComponent', () => {
  let component: ModalEditarItemComponent;
  let fixture: ComponentFixture<ModalEditarItemComponent>;
  const dialogRefStub: Partial<MatDialogRef<ModalEditarItemComponent>> = {
    close: jest.fn()
  };
  const dialogData: { item: ItemTemplate } = {
    item: { id: 1, texto: 'Teste', styles: 'font-size: 16px;' }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditarItemComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefStub },
        { provide: MAT_DIALOG_DATA, useValue: dialogData }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditarItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
