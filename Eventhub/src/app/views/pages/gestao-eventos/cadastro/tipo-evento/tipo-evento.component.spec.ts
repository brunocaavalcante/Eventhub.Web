import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { TipoEventoComponent } from './tipo-evento.component';

describe('TipoEventoComponent', () => {
  let component: TipoEventoComponent;
  let fixture: ComponentFixture<TipoEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoEventoComponent],
      providers: [provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
