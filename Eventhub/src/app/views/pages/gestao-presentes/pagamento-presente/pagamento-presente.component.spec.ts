import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagamentoPresenteComponent } from './pagamento-presente.component';

describe('PagamentoPresenteComponent', () => {
  let component: PagamentoPresenteComponent;
  let fixture: ComponentFixture<PagamentoPresenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagamentoPresenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagamentoPresenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
