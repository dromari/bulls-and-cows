export function evaluateGuess(secret: string, guess: string): { bulls: number; cows: number } {
  const s = secret.toLowerCase().split('');
  const g = guess.toLowerCase().split('');

  const bulls = s.filter((char, index) => char === g[index]).length;

  const chars = new Set([...s, ...g]);
  const matches = [...chars].reduce((sum, char) => {
    const inSecret = s.filter((c) => c === char).length;
    const inGuess = g.filter((c) => c === char).length;
    return sum + Math.min(inSecret, inGuess);
  }, 0);

  return { bulls, cows: matches - bulls };
}
