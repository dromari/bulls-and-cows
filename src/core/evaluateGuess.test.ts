import { evaluateGuess } from './evaluateGuess';

describe('evaluateGuess', () => {
  it('counts all bulls when guess matches secret exactly', () => {
    expect(evaluateGuess('0123', '0123')).toEqual({ bulls: 4, cows: 0 });
  });

  it('returns zero bulls and cows when no digits match', () => {
    expect(evaluateGuess('0123', '4567')).toEqual({ bulls: 0, cows: 0 });
  });

  it('counts all cows when digits are present but in wrong positions', () => {
    expect(evaluateGuess('0123', '3210')).toEqual({ bulls: 0, cows: 4 });
  });

  it('counts mixed bulls and cows', () => {
    expect(evaluateGuess('0123', '0213')).toEqual({ bulls: 2, cows: 2 });
  });

  it('ignores duplicate guess digits beyond those in secret', () => {
    expect(evaluateGuess('0123', '0000')).toEqual({ bulls: 1, cows: 0 });
    expect(evaluateGuess('1111', '1111')).toEqual({ bulls: 4, cows: 0 });
  });

  it('treats hex characters case-insensitively', () => {
    expect(evaluateGuess('AbCd', 'abcd')).toEqual({ bulls: 4, cows: 0 });
    expect(evaluateGuess('aB3f', 'Ab3F')).toEqual({ bulls: 4, cows: 0 });
  });

  it('works for short secrets and guesses', () => {
    expect(evaluateGuess('01', '10')).toEqual({ bulls: 0, cows: 2 });
  });
});
