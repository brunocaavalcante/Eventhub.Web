import { CurrencyBrPipe } from './currency-br.pipe';

describe('CurrencyBrPipe', () => {
  let pipe: CurrencyBrPipe;

  beforeEach(() => {
    pipe = new CurrencyBrPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format number to Brazilian currency', () => {
    expect(pipe.transform(3000)).toBe('R$\u00A03.000,00');
  });

  it('should format decimal values correctly', () => {
    expect(pipe.transform(1500.50)).toBe('R$\u00A01.500,50');
  });

  it('should format values with cents', () => {
    expect(pipe.transform(100.99)).toBe('R$\u00A0100,99');
  });

  it('should format large values', () => {
    expect(pipe.transform(1000000)).toBe('R$\u00A01.000.000,00');
  });

  it('should format string numbers', () => {
    expect(pipe.transform('2500')).toBe('R$\u00A02.500,00');
  });

  it('should handle null values', () => {
    expect(pipe.transform(null)).toBe('R$\u00A00,00');
  });

  it('should handle undefined values', () => {
    expect(pipe.transform(undefined)).toBe('R$\u00A00,00');
  });

  it('should handle empty string', () => {
    expect(pipe.transform('')).toBe('R$\u00A00,00');
  });

  it('should handle zero', () => {
    expect(pipe.transform(0)).toBe('R$\u00A00,00');
  });

  it('should handle negative values', () => {
    expect(pipe.transform(-500)).toBe('-R$\u00A0500,00');
  });

  it('should handle invalid string values', () => {
    expect(pipe.transform('abc')).toBe('R$\u00A00,00');
  });

  it('should format small decimal values', () => {
    expect(pipe.transform(0.50)).toBe('R$\u00A00,50');
  });

  it('should always show 2 decimal places', () => {
    expect(pipe.transform(150)).toBe('R$\u00A0150,00');
    expect(pipe.transform(150.5)).toBe('R$\u00A0150,50');
  });
});
