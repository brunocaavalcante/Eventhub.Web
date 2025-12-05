import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuSideComponent } from './menu-side.component';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { UsuarioInfoDTO } from '../../../../core/models/usuario.model';
import { By } from '@angular/platform-browser';
import { EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

class MockRouter {
  navigate = jest.fn();
  events = new EventEmitter();
}

class MockUsuarioService {
  obterUsuarioLogado(): UsuarioInfoDTO | null {
    return {
      id: 1,
      keycloakId: 'abc',
      nome: 'Olivia',
      email: 'olivia.smith@email.com',
      telefone: '',
      foto: '',
      dataCadastro: '',
      status: 'ativo'
    };
  }
}

describe('MenuSideComponent', () => {
  let component: MenuSideComponent;
  let fixture: ComponentFixture<MenuSideComponent>;
  let router: MockRouter;

  beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [MenuSideComponent],
        providers: [
          { provide: Router, useClass: MockRouter },
          { provide: UsuarioService, useClass: MockUsuarioService }
        ]
      }).compileComponents();
    fixture = TestBed.createComponent(MenuSideComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as any;
    component.open = true;
    fixture.detectChanges();
  });

  it('deve renderizar o menu side quando open=true', () => {
    const overlay = fixture.debugElement.query(By.css('.side-overlay'));
    expect(overlay).toBeTruthy();
  });

  it('deve exibir dados do usuário logado', () => {
    const nome = fixture.debugElement.query(By.css('.side-user-nome')).nativeElement.textContent;
    const email = fixture.debugElement.query(By.css('.side-user-email')).nativeElement.textContent;
    expect(nome).toContain('Olivia');
    expect(email).toContain('olivia.smith@email.com');
  });

  it('deve renderizar itens do menu de usuário logado', () => {
    const items = fixture.debugElement.queryAll(By.css('.side-nav-item'));
    expect(items.length).toBe(component.loggedInMenu.length);
    expect(items[1].nativeElement.textContent).toContain('Meus Eventos');
  });

  it('deve navegar e fechar ao clicar em item do menu', () => {
    jest.spyOn(component, 'fechar');
    const items = fixture.debugElement.queryAll(By.css('.side-nav-item'));
    items[0].nativeElement.click();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
    expect(component.fechar).toHaveBeenCalled();
  });

  it('deve emitir evento fecharMenuSide ao chamar fechar()', () => {
    jest.spyOn(component.fecharMenuSide, 'emit');
    component.fechar();
    expect(component.fecharMenuSide.emit).toHaveBeenCalled();
  });

  it('deve renderizar menu de visitante se usuario for null', () => {
    component.usuario.set(null);
    fixture.detectChanges();
    const items = fixture.debugElement.queryAll(By.css('.side-nav-item'));
    expect(items.length).toBe(component.loggedOutMenu.length);
    expect(items[2].nativeElement.textContent).toContain('Login');
  });
});
