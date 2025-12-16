import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ItemTemplate } from '../template-convite.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltip } from "@angular/material/tooltip";

@Component({
  selector: 'app-modal-editar-item',
  imports: [MatInputModule, MatFormFieldModule, FormsModule, CommonModule, MatIconModule,
    MatButtonModule, MatTooltip],
  templateUrl: './modal-editar-item.component.html',
  styleUrl: './modal-editar-item.component.scss'
})
export class ModalEditarItemComponent {

  readonly item: ItemTemplate;
  fontSize: number;
  textColor: string;
  fontFamily: string;
  letterSpacing: number;
  lineHeight: number;
  textTransform: string;

  readonly fontOptions = [
    { label: 'Padrão (tema)', value: 'inherit' },
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Courier New', value: '"Courier New", monospace' },
    { label: 'Montserrat', value: 'Montserrat, sans-serif' }
  ];

  constructor(
    private readonly dialogRef: MatDialogRef<ModalEditarItemComponent>,
    @Inject(MAT_DIALOG_DATA) data: ModalEditarItemData
  ) {
    this.item = data.item;
    this.item.styles = this.item.styles?.trim() ?? '';
    this.fontSize = this.getNumericStyleValue('font-size') ?? 16;
    this.textColor = this.getStyleValue('color') ?? '#000000';
    this.fontFamily = this.getStyleValue('font-family') ?? 'inherit';
    this.letterSpacing = this.getNumericStyleValue('letter-spacing') ?? 0;
    this.lineHeight = this.getNumericStyleValue('line-height') ?? 1.5;
    this.textTransform = this.getStyleValue('text-transform') ?? 'none';
    this.setFontSize(this.fontSize);
    this.updateColor(this.textColor);
    this.setFontFamily(this.fontFamily);
    this.setLetterSpacing(this.letterSpacing);
    this.setLineHeight(this.lineHeight);
    this.setTextTransform(this.textTransform);
  }

  salvar() {
    this.dialogRef.close(this.item);
  }

  fecha() {
    this.dialogRef.close();
  }

  toggleStyle(prop: string, value: string) {
    const active = this.getStyleValue(prop);
    this.setStyleValue(prop, active === value ? undefined : value);
  }

  setAlignment(alignment: 'left' | 'center' | 'right') {
    const current = this.getStyleValue('text-align');
    this.setStyleValue('text-align', current === alignment ? undefined : alignment);
  }

  isStyleActive(prop: string, value: string) {
    return this.getStyleValue(prop) === value;
  }

  updateFontSize(delta: number) {
    this.setFontSize(this.fontSize + delta);
  }

  setFontSize(size: number) {
    const clamped = Math.min(72, Math.max(8, size));
    this.fontSize = clamped;
    const mobileSize = Math.round(clamped * 0.8);
    const desktopSize = clamped;
    const fluidSize = (clamped / 16).toFixed(2);
    this.setStyleValue('font-size', `clamp(${mobileSize}px, ${fluidSize}vw + 0.5rem, ${desktopSize}px)`);
  }

  updateColor(color: string) {
    this.textColor = color;
    this.setStyleValue('color', this.textColor);
  }

  setFontFamily(family: string) {
    this.fontFamily = family;
    if (family === 'inherit') {
      this.setStyleValue('font-family');
      return;
    }
    this.setStyleValue('font-family', family);
  }

  updateLetterSpacing(delta: number) {
    this.setLetterSpacing(this.letterSpacing + delta);
  }

  setLetterSpacing(spacing: number) {
    const clamped = Math.min(20, Math.max(-5, spacing));
    this.letterSpacing = Number(clamped.toFixed(1));

    const mobileSpacing = (clamped * 0.8).toFixed(1);
    const desktopSpacing = clamped.toFixed(1);

    this.setStyleValue('letter-spacing', `clamp(${mobileSpacing}px, ${(Math.abs(clamped) / 16).toFixed(2)}vw, ${desktopSpacing}px)`);
  }

  setLineHeight(height: number) {
    const clamped = Math.min(3, Math.max(1, height));
    this.lineHeight = Number(clamped.toFixed(1));

    const mobileHeight = (clamped * 0.9).toFixed(2);
    const desktopHeight = clamped.toFixed(2);

    this.setStyleValue('line-height', `clamp(${mobileHeight}, ${clamped}vw / 10 + 1, ${desktopHeight})`);
  }

  updateLineHeight(delta: number) {
    this.setLineHeight(this.lineHeight + delta);
  }

  setTextTransform(transform: string) {
    this.textTransform = transform;
    if (transform === 'none') {
      this.setStyleValue('text-transform');
      return;
    }
    this.setStyleValue('text-transform', transform);
  }

  private getNumericStyleValue(prop: string): number | undefined {
  const value = this.getStyleValue(prop);
  if (!value) {
    return undefined;
  }
  
  if (value.includes('clamp(')) {
    // Regex para capturar o terceiro valor do clamp (valor máximo)
    const match = value.match(/clamp\([^,]+,\s*[^,]+,\s*([0-9.]+)/);
    if (match && match[1]) {
      return parseFloat(match[1]);
    }
  }
  
  const parsed = parseFloat(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

  private getStyleValue(prop: string): string | undefined {
    const styles = this.parseStyles();
    return styles[prop];
  }

  private setStyleValue(prop: string, value?: string) {
    const styles = this.parseStyles();
    if (!value) {
      delete styles[prop];
    } else {
      styles[prop] = value;
    }
    this.item.styles = this.serializeStyles(styles);
  }

  private parseStyles() {
    return (this.item.styles || '')
      .split(';')
      .map((rule) => rule.trim())
      .filter(Boolean)
      .reduce<Record<string, string>>((acc, rule) => {
        const [prop, ...rest] = rule.split(':');
        if (!prop || !rest.length) {
          return acc;
        }
        acc[prop.trim()] = rest.join(':').trim();
        return acc;
      }, {});
  }

  private serializeStyles(styles: Record<string, string>) {
    const serialized = Object.entries(styles)
      .map(([prop, value]) => `${prop}: ${value}`)
      .join('; ')
      .trim();
    return serialized ? `${serialized};` : '';
  }
}

interface ModalEditarItemData {
  item: ItemTemplate;
}
