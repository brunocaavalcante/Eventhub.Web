import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarConvidadosComponent } from './consultar-convidados.component';
import { UsuarioService } from '../../../../core/services/usuario.service';

describe('ConsultarConvidadosComponent', () => {
  let component: ConsultarConvidadosComponent;
  let fixture: ComponentFixture<ConsultarConvidadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultarConvidadosComponent],
      providers: [UsuarioService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarConvidadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
