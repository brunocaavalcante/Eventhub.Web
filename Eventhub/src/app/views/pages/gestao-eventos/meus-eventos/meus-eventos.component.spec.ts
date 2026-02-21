import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { MeusEventosComponent } from './meus-eventos.component';

describe('MeusEventosComponent', () => {
  let component: MeusEventosComponent;
  let fixture: ComponentFixture<MeusEventosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeusEventosComponent],
      providers: [provideHttpClient(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeusEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
