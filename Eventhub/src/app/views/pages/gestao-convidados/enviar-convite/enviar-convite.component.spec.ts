import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviarConviteComponent } from './enviar-convite.component';

describe('EnviarConviteComponent', () => {
  let component: EnviarConviteComponent;
  let fixture: ComponentFixture<EnviarConviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnviarConviteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnviarConviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
