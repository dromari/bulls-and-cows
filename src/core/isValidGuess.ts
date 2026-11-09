import { createDigitValidator } from './createDigitValidator';

export function isValidGuess(guess: string, length: number, base: number): boolean {
  if (guess.length !== length) {
    return false;
  }

  const normalized = guess.toLowerCase();
  const isValidDigit = createDigitValidator(base);

  const allDigitsValid = normalized.split('').every(isValidDigit);
  const allUnique = new Set(normalized).size === normalized.length;

  return allDigitsValid && allUnique;
}
