import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarEventoComponent } from './cadastrar-evento.component';

describe('CadastrarEventoComponent', () => {
  let component: CadastrarEventoComponent;
  let fixture: ComponentFixture<CadastrarEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarEventoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastrarEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
