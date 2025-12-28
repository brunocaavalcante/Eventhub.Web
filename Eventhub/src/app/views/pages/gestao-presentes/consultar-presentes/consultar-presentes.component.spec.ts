import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarPresentesComponent } from './consultar-presentes.component';

describe('ConsultarPresentesComponent', () => {
  let component: ConsultarPresentesComponent;
  let fixture: ComponentFixture<ConsultarPresentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultarPresentesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarPresentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
