import { createDigitValidator } from './createDigitValidator';

describe('createDigitValidator', () => {
  it('returns a predicate function', () => {
    const validator = createDigitValidator(10);
    expect(typeof validator).toBe('function');
  });

  it('accepts decimal digits for base 10', () => {
    const isValid = createDigitValidator(10);
    expect(isValid('0')).toBe(true);
    expect(isValid('5')).toBe(true);
    expect(isValid('9')).toBe(true);
  });

  it('rejects non-decimal digits for base 10', () => {
    const isValid = createDigitValidator(10);
    expect(isValid('a')).toBe(false);
    expect(isValid('f')).toBe(false);
  });

  it('accepts hex digits for base 16', () => {
    const isValid = createDigitValidator(16);
    expect(isValid('a')).toBe(true);
    expect(isValid('f')).toBe(true);
  });

  it('treats hex characters case-insensitively', () => {
    const isValid = createDigitValidator(16);
    expect(isValid('A')).toBe(true);
    expect(isValid('F')).toBe(true);
    expect(isValid('B')).toBe(true);
  });

  it('rejects digits outside the base', () => {
    const isBinary = createDigitValidator(2);
    expect(isBinary('0')).toBe(true);
    expect(isBinary('1')).toBe(true);
    expect(isBinary('2')).toBe(false);
    expect(isBinary('a')).toBe(false);
  });

  it('rejects empty or multi-character strings', () => {
    const isValid = createDigitValidator(10);
    expect(isValid('')).toBe(false);
    expect(isValid('12')).toBe(false);
  });
});
