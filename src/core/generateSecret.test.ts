import { generateSecret } from './generateSecret';

describe('generateSecret', () => {
  it('returns a predictable result with a deterministic random source', () => {
    const random = () => 0;
    expect(generateSecret(4, 10, random)).toBe('0123');
  });

  it('returns a string of the requested length', () => {
    expect(generateSecret(3, 10, () => 0.5)).toHaveLength(3);
    expect(generateSecret(6, 10, () => 0.5)).toHaveLength(6);
  });

  it('returns only unique digits', () => {
    const secret = generateSecret(4, 10, () => 0.5);
    expect(new Set(secret).size).toBe(secret.length);
  });

  it('uses only characters valid for the chosen base', () => {
    const decimalSecret = generateSecret(4, 10, () => 0.5);
    expect(decimalSecret).toMatch(/^[0-9]+$/);

    const hexSecret = generateSecret(4, 16, () => 0.5);
    expect(hexSecret).toMatch(/^[0-9a-f]+$/i);

    const binarySecret = generateSecret(2, 2, () => 0.5);
    expect(binarySecret).toMatch(/^[01]+$/);
  });

  it('can produce leading zeros', () => {
    const random = () => 0;
    expect(generateSecret(4, 10, random)).toBe('0123');
  });

  it('returns all available characters when length equals base', () => {
    const secret = generateSecret(2, 2, () => 0);
    expect(secret).toBe('01');
  });

  it('returns an empty string when length is 0', () => {
    expect(generateSecret(0, 10, () => 0.5)).toBe('');
  });

  it('throws when length exceeds base', () => {
    expect(() => generateSecret(5, 4, () => 0.5)).toThrow();
  });

  it('throws when length is negative', () => {
    expect(() => generateSecret(-1, 10, () => 0.5)).toThrow();
  });
});
