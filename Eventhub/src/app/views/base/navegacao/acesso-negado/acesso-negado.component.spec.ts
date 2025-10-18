import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcessoNegadoComponent } from './acesso-negado.component';
import { By } from '@angular/platform-browser';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('AcessoNegadoComponent', () => {
  let component: AcessoNegadoComponent;
  let fixture: ComponentFixture<AcessoNegadoComponent>;

  const mockUsuarioService = {
    obterUsuarioLogado: jest.fn().mockResolvedValue(null)
  };

  const mockActivatedRoute = {
    snapshot: {
      queryParamMap: {
        get: (key: string) => {
          if (key === 'descricao') {
            return '';
          }
          return null;
        }
      }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcessoNegadoComponent],
      providers: [
        { provide: UsuarioService, useValue: mockUsuarioService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AcessoNegadoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeDefined();
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
    await component.ngOnInit();
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button[routerLink="/usuarios/login"]'));
    expect(btn).not.toBeNull();
  });

  it('não deve exibir o botão de login se houver usuário logado', async () => {
    component.usuarioLogado.set({ uid: '123' });
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button[routerLink="/usuarios/login"]'));
    expect(btn).toBeFalsy();
  });
});
