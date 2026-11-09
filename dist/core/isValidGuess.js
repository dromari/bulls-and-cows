import { createDigitValidator } from './createDigitValidator.js';
export function isValidGuess(guess, length, base) {
    if (guess.length !== length) {
        return false;
    }
    const normalized = guess.toLowerCase();
    const isValidDigit = createDigitValidator(base);
    const allDigitsValid = normalized.split('').every(isValidDigit);
    const allUnique = new Set(normalized).size === normalized.length;
    return allDigitsValid && allUnique;
}
//# sourceMappingURL=isValidGuess.js.map