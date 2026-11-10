const CHARS = '0123456789abcdef';

export function createDigitValidator(base: number): (char: string) => boolean {
  const allowed = new Set(CHARS.slice(0, base));
  return (char: string) => allowed.has(char.toLowerCase());
}
