import { CommonModule } from '@angular/common';
import { Component, Inject, Input, Optional } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Base64ImageUtil } from '../../../../core/utils/base64-image.util';

const PREVIEW_DEFAULT_THEME_COLOR = '#D16BA5';

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

  get cardStyle(): Record<string, string> {
    return {
      'background-image': this.getBackgroundImage(),
      '--convite-theme': this.themeColor,
      '--convite-theme-soft': this.themeColorSoft,
      '--convite-theme-dark': this.themeColorDark
    };
  }

  private get themeColor(): string {
    return this.normalizeColor(this.data?.themeColor);
  }

  private get themeColorSoft(): string {
    return this.adjustColor(this.themeColor, 30);
  }

  private get themeColorDark(): string {
    return this.adjustColor(this.themeColor, -35);
  }

  private getBackgroundImage(): string {
    const source = Base64ImageUtil.resolveImageSource(this.data?.backgroundImage);
    return source ? `url(${source})` : 'none';
  }

  private normalizeColor(color?: string | null): string {
    if (!color) {
      return PREVIEW_DEFAULT_THEME_COLOR;
    }
    const trimmed = color.trim();
    if (!trimmed) {
      return PREVIEW_DEFAULT_THEME_COLOR;
    }
    if (trimmed.startsWith('#')) {
      if (trimmed.length === 4) {
        return `#${trimmed[1]}${trimmed[1]}${trimmed[2]}${trimmed[2]}${trimmed[3]}${trimmed[3]}`.toUpperCase();
      }
      if (trimmed.length === 7) {
        return trimmed.toUpperCase();
      }
    }
    return PREVIEW_DEFAULT_THEME_COLOR;
  }

  private adjustColor(color: string, delta: number): string {
    if (!color.startsWith('#') || (color.length !== 7)) {
      return color;
    }
    const num = parseInt(color.slice(1), 16);
    const r = this.clampColor((num >> 16) + delta);
    const g = this.clampColor(((num >> 8) & 0x00ff) + delta);
    const b = this.clampColor((num & 0x0000ff) + delta);
    return `#${this.toHex(r)}${this.toHex(g)}${this.toHex(b)}`;
  }

  private clampColor(value: number): number {
    return Math.max(0, Math.min(255, value));
  }

  private toHex(value: number): string {
    return value.toString(16).padStart(2, '0').toUpperCase();
  }
}

export interface ConvitePreviewData {
  eventType?: string;
  name1?: string;
  name2?: string;
  eventDate?: string;
  eventTime?: string;
  eventEndDate?: string;
  eventEndTime?: string;
  venueName?: string;
  venueAddress?: string;
  message?: string;
  themeColor?: string;
  fontStyle?: string;
  backgroundImage?: string;
  inviteText?: string;
}
