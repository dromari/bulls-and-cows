const memo = new Map();
export function countPossibleSecrets(length, base) {
    if (length < 0) {
        throw new Error('Length must be non-negative');
    }
    if (length > base) {
        throw new Error('Length cannot exceed base');
    }
    if (length === 0) {
        return 1;
    }
    if (length === 1) {
        return base;
    }
    const key = `${length},${base}`;
    if (memo.has(key)) {
        return memo.get(key);
    }
    const result = base * countPossibleSecrets(length - 1, base - 1);
    memo.set(key, result);
    return result;
}
//# sourceMappingURL=countPossibleSecrets.js.map