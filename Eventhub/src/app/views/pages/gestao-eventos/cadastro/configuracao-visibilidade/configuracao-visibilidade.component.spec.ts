import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ConfiguracaoVisibilidadeComponent } from './configuracao-visibilidade.component';

describe('ConfiguracaoVisibilidadeComponent', () => {
  let component: ConfiguracaoVisibilidadeComponent;
  let fixture: ComponentFixture<ConfiguracaoVisibilidadeComponent>;
  let formBuilder: FormBuilder;
  let formGroup: FormGroup;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguracaoVisibilidadeComponent, NoopAnimationsModule]
    }).compileComponents();

    formBuilder = TestBed.inject(FormBuilder);
    formGroup = formBuilder.group({
      galeriaFotos: [true],
      chatConvidados: [true],
      listaPresentes: [false],
      listaConvidados: [false],
      agendaEvento: [true]
    });

    fixture = TestBed.createComponent(ConfiguracaoVisibilidadeComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('formGroup', formGroup);
    fixture.detectChanges();
  });

  it('deve criar componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve ter 5 features configuráveis', () => {
    expect(component.features.length).toBe(5);
  });

  it('deve inicializar com valores padrão', () => {
    const config = component.configuracoes();
    expect(config.galeriaFotos).toBeTruthy();
    expect(config.chatConvidados).toBeTruthy();
    expect(config.agendaEvento).toBeTruthy();
    expect(config.listaPresentes).toBeFalsy();
    expect(config.listaConvidados).toBeFalsy();
  });

  it('deve alternar configuração ao chamar alternarConfiguracao', () => {
    const valorInicial = component.obterValor('listaPresentes');
    
    component.alternarConfiguracao('listaPresentes');
    
    expect(component.obterValor('listaPresentes')).toBe(!valorInicial);
  });

  it('deve emitir evento ao alternar configuração', () => {
    const spy = jest.spyOn(component.configuracaoChange, 'emit');
    
    component.alternarConfiguracao('chatConvidados');
    
    expect(spy).toHaveBeenCalled();
  });

  it('deve atualizar formGroup ao alternar configuração', () => {
    component.alternarConfiguracao('listaConvidados');
    
    expect(formGroup.get('listaConvidados')?.value).toBeTruthy();
  });

  it('deve retornar valor correto para cada campo', () => {
    expect(component.obterValor('galeriaFotos')).toBeTruthy();
    expect(component.obterValor('listaPresentes')).toBeFalsy();
  });

  it('deve ter ícones e descrições para todas as features', () => {
    component.features.forEach(feature => {
      expect(feature.icon).toBeTruthy();
      expect(feature.titulo).toBeTruthy();
      expect(feature.descricao).toBeTruthy();
    });
  });
});
