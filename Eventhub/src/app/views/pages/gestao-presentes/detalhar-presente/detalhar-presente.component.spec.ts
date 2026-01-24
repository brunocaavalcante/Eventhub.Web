import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalharPresenteComponent } from './detalhar-presente.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { PresenteService } from '../../../../core/services/presente.service';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { Location } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DetalharPresenteComponent', () => {
  let component: DetalharPresenteComponent;
  let fixture: ComponentFixture<DetalharPresenteComponent>;

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: (key: string) => {
          if (key === 'idEvento') return '1';
          if (key === 'id') return '1';
          return null;
        }
      }
    }
  };

  const mockPresenteService = {
    obterDetalhesPorId: jest.fn()
  };

  const mockSpinnerService = {
    show: jest.fn(),
    hide: jest.fn()
  };

  const mockLocation = {
    back: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DetalharPresenteComponent,
        NoopAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: PresenteService, useValue: mockPresenteService },
        { provide: SpinnerService, useValue: mockSpinnerService },
        { provide: Location, useValue: mockLocation }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetalharPresenteComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    mockPresenteService.obterDetalhesPorId.mockReturnValue(of({
      executouComSucesso: true,
      data: {
        id: 1,
        nome: 'Presente Teste',
        valor: 1000,
        contribuicoes: []
      }
    }));
    
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
