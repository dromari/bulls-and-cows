const CHARS = '0123456789abcdef';
export function generateSecret(length, base, random = Math.random) {
    if (length < 0) {
        throw new Error('Length must be non-negative');
    }
    if (length > base) {
        throw new Error('Length cannot exceed base');
    }
    const pool = CHARS.slice(0, base).split('');
    let result = '';
    for (let i = 0; i < length; i += 1) {
        const index = Math.floor(random() * pool.length);
        const [char] = pool.splice(index, 1);
        result += char;
    }
    return result;
}
//# sourceMappingURL=generateSecret.js.map