import { countPossibleSecrets } from './countPossibleSecrets';

describe('countPossibleSecrets', () => {
  it('returns 1 for length 0', () => {
    expect(countPossibleSecrets(0, 10)).toBe(1);
  });

  it('returns base for length 1', () => {
    expect(countPossibleSecrets(1, 10)).toBe(10);
    expect(countPossibleSecrets(1, 16)).toBe(16);
  });

  it('returns 2 for length 2 and base 2', () => {
    expect(countPossibleSecrets(2, 2)).toBe(2);
  });

  it('returns 5040 for length 4 and base 10', () => {
    expect(countPossibleSecrets(4, 10)).toBe(5040);
  });

  it('returns 240 for length 2 and base 16', () => {
    expect(countPossibleSecrets(2, 16)).toBe(240);
  });

  it('returns the same result on repeated calls', () => {
    const first = countPossibleSecrets(4, 10);
    const second = countPossibleSecrets(4, 10);
    expect(second).toBe(first);
  });

  it('throws when length exceeds base', () => {
    expect(() => countPossibleSecrets(5, 4)).toThrow();
  });

  it('throws when length is negative', () => {
    expect(() => countPossibleSecrets(-1, 10)).toThrow();
  });
});
