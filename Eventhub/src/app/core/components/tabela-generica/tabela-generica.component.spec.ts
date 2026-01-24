import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabelaGenericaComponent } from './tabela-generica.component';

describe('TabelaGenericaComponent', () => {
  let component: TabelaGenericaComponent;
  let fixture: ComponentFixture<TabelaGenericaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabelaGenericaComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TabelaGenericaComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
