import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-convite-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './convite-preview.component.html',
  styleUrls: ['./convite-preview.component.scss']
})
export class ConvitePreviewComponent {
  @Input() data: any;
}
