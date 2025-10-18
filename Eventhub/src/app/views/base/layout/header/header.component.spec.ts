import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { ActivatedRoute } from '@angular/router';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  const mockAuth = {
    currentUser: null,
    signOut: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
  };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: Auth, useValue: mockAuth },
        { provide: UsuarioService, useValue: {} },
        { provide: ActivatedRoute, useValue: {} }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
