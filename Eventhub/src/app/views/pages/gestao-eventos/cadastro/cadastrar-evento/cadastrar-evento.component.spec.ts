import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { CadastrarEventoComponent } from './cadastrar-evento.component';

describe('CadastrarEventoComponent', () => {
  let component: CadastrarEventoComponent;
  let fixture: ComponentFixture<CadastrarEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarEventoComponent],
      providers: [provideHttpClient(), provideRouter([]), provideEnvironmentNgxMask()]
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
