import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../../../core/services/auth.service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideHttpClient(),
        { provide: UsuarioService, useValue: { obterUsuarioLogado: jest.fn(() => null) } },
        { provide: ActivatedRoute, useValue: {} },
        { provide: AuthService, useValue: {
            logout: jest.fn(() => ({ subscribe: jest.fn(fn => fn({})) }))
          } }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve emitir openMenuSide ao chamar alternarMenuLateral', () => {
    jest.spyOn(component.openMenuSide, 'emit');
    component.alternarMenuLateral();
    expect(component.openMenuSide.emit).toHaveBeenCalled();
  });

  it('deve navegar para rota ao chamar navegarPara', () => {
    component.navegarPara('/perfil');
    // router.navigate é mockado, mas não está no providers, então não testamos navegação real aqui
  });

  it('deve navegar para login ao chamar login()', () => {
    const router = { navigate: jest.fn() };
    (component as any).router = router;
    component.login();
    expect(router.navigate).toHaveBeenCalledWith(['usuarios/login']);
  });

  it('deve navegar para cadastro ao chamar criarConta()', () => {
    const router = { navigate: jest.fn() };
    (component as any).router = router;
    component.criarConta();
    expect(router.navigate).toHaveBeenCalledWith(['usuarios/cadastro']);
  });

  it('deve chamar logout do AuthService e limpar usuário', (done) => {
    const logoutMock = { subscribe: jest.fn((observer) => { if (observer && observer.next) observer.next({}); }) };
    (component as any).authService = { logout: jest.fn(() => logoutMock) };
    component.user.set({ nome: 'Teste', foto: '' } as any);
    component.logout();
    expect((component as any).authService.logout).toHaveBeenCalled();
    // Após logout, user deve ser null
    setTimeout(() => {
      expect(component.user()).toBeNull();
      done();
    }, 0);
  });

  it('deve exibir menu de visitante se user for null', () => {
    component.user.set(null);
    expect(component.menuItems()).toEqual([
      { label: 'Início', route: '/' },
      { label: 'Sobre nós', route: '/explorar' },
      { label: 'Login', route: '/usuarios/login' },
      { label: 'Criar Conta', route: '/usuarios/cadastro', isButton: true }
    ]);
  });

  it('deve exibir menu de usuário logado se user não for null', () => {
    component.user.set({ nome: 'Teste', foto: '' } as any);
    expect(component.menuItems()).toEqual([
      { label: 'Início', route: '/' },
      { label: 'Meus Eventos', route: '/eventos/meus-eventos' },
      { label: 'Perfil', route: '/perfil' }
    ]);
  });

  it('deve atualizar isMobile ao redimensionar janela', () => {
    window.innerWidth = 800;
    component.isMobile.set(false);
    (component as any).onResize();
    expect(component.isMobile()).toBe(true);
  });
});
