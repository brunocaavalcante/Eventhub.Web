import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvitePreviewComponent } from './convite-preview.component';

describe('ConvitePreviewComponent', () => {
  let component: ConvitePreviewComponent;
  let fixture: ComponentFixture<ConvitePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvitePreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConvitePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
