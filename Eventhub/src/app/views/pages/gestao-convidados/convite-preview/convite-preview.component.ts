import { CommonModule } from '@angular/common';
import { Component, Inject, Input, Optional } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-convite-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './convite-preview.component.html',
  styleUrls: ['./convite-preview.component.scss']
})
export class ConvitePreviewComponent {
  @Input() data: ConvitePreviewData | null = null;
  isBottomSheetContext = false;

  constructor(
    @Optional() private bottomSheetRef?: MatBottomSheetRef<ConvitePreviewComponent>,
    @Optional() @Inject(MAT_BOTTOM_SHEET_DATA) sheetData?: ConvitePreviewData
  ) {
    if (sheetData) {
      this.data = sheetData;
    }
    this.isBottomSheetContext = !!this.bottomSheetRef;
  }

  closeSheet() {
    this.bottomSheetRef?.dismiss();
  }
}

export interface ConvitePreviewData {
  eventType?: string;
  name1?: string;
  name2?: string;
  eventDate?: string;
  eventTime?: string;
  venueName?: string;
  venueAddress?: string;
  message?: string;
  themeColor?: string;
  fontStyle?: string;
  backgroundImage?: string;
  inviteText?: string;
}
