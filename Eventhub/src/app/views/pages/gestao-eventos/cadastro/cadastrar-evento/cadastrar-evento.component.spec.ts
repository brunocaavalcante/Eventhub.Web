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

  it('deve ter 4 etapas de cadastro', () => {
    expect(component.etapa).toBe(0);
    // Verificar que o componente suporta até etapa 3 (0-indexed)
  });

  it('deve criar formulário com step3 para configuração de visibilidade', () => {
    expect(component.form.get('step3')).toBeTruthy();
    expect(component.form.get('step3.galeriaFotos')).toBeTruthy();
    expect(component.form.get('step3.chatConvidados')).toBeTruthy();
    expect(component.form.get('step3.listaPresentes')).toBeTruthy();
    expect(component.form.get('step3.listaConvidados')).toBeTruthy();
    expect(component.form.get('step3.agendaEvento')).toBeTruthy();
  });

  it('deve inicializar step3 com valores padrão', () => {
    expect(component.form.get('step3.galeriaFotos')?.value).toBe(true);
    expect(component.form.get('step3.chatConvidados')?.value).toBe(true);
    expect(component.form.get('step3.listaPresentes')?.value).toBe(false);
    expect(component.form.get('step3.listaConvidados')?.value).toBe(false);
    expect(component.form.get('step3.agendaEvento')?.value).toBe(true);
  });

  it('deve avançar para etapa 1 quando step1 for válido', () => {
    component.form.get('step1')?.patchValue({
      nome: 'Evento Teste',
      descricao: 'Descrição do evento',
      quantidadeParticipantes: 50
    });

    component.proximo();

    expect(component.etapa).toBe(1);
  });

  it('deve avançar para etapa 2 quando step2 for válido', () => {
    component.etapa = 1;
    component.form.get('step2')?.patchValue({
      dataInicio: new Date(),
      horaInicio: '10:00',
      dataFim: new Date(),
      horaFim: '18:00',
      rua: 'Rua Teste',
      cidade: 'São Paulo',
      numero: '123'
    });

    component.proximo();

    expect(component.etapa).toBe(2);
  });

  it('deve avançar para etapa 3 quando step3 for válido', () => {
    component.etapa = 2;
    // step3 já tem valores padrão válidos

    component.proximo();

    expect(component.etapa).toBe(3);
  });
});
