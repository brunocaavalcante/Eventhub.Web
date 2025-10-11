import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcessoNegadoComponent } from './acesso-negado.component';
import { By } from '@angular/platform-browser';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { of } from 'rxjs';

describe('AcessoNegadoComponent', () => {
  let component: AcessoNegadoComponent;
  let fixture: ComponentFixture<AcessoNegadoComponent>;
  let usuarioServiceSpy: jasmine.SpyObj<UsuarioService>;

  beforeEach(async () => {
    usuarioServiceSpy = jasmine.createSpyObj('UsuarioService', ['obterUsuarioLogado']);
    await TestBed.configureTestingModule({
      imports: [AcessoNegadoComponent],
      providers: [
        { provide: UsuarioService, useValue: usuarioServiceSpy }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AcessoNegadoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('deve exibir a mensagem padrão se não passar descrição', () => {
    fixture.detectChanges();
    const desc = fixture.nativeElement.querySelector('.acesso-negado-desc').textContent;
    expect(desc).toContain('Você não tem permissão para acessar esta página');
  });

  it('deve exibir a mensagem personalizada se passada', () => {
    component.descricao = 'Mensagem customizada de acesso negado';
    fixture.detectChanges();
    const desc = fixture.nativeElement.querySelector('.acesso-negado-desc').textContent;
    expect(desc).toContain('Mensagem customizada de acesso negado');
  });

  it('deve exibir o botão de login se não houver usuário logado', async () => {
    component.usuarioLogado.set(null);
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button[routerLink="/login"]'));
    expect(btn).toBeTruthy();
  });

  it('não deve exibir o botão de login se houver usuário logado', async () => {
    component.usuarioLogado.set({ uid: '123' });
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button[routerLink="/login"]'));
    expect(btn).toBeFalsy();
  });
});
