const CHARS = '0123456789abcdef';
export function createDigitValidator(base) {
    const allowed = new Set(CHARS.slice(0, base));
    return (char) => allowed.has(char.toLowerCase());
}
//# sourceMappingURL=createDigitValidator.js.map