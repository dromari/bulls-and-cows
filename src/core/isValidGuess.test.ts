import { isValidGuess } from './isValidGuess';

describe('isValidGuess', () => {
  it('accepts a guess of the correct length with valid unique digits', () => {
    expect(isValidGuess('0123', 4, 10)).toBe(true);
  });

  it('rejects a guess that is too short', () => {
    expect(isValidGuess('012', 4, 10)).toBe(false);
  });

  it('rejects a guess that is too long', () => {
    expect(isValidGuess('01234', 4, 10)).toBe(false);
  });

  it('rejects an empty guess', () => {
    expect(isValidGuess('', 4, 10)).toBe(false);
  });

  it('rejects digits outside the chosen base', () => {
    expect(isValidGuess('89', 2, 2)).toBe(false);
    expect(isValidGuess('abcdef', 4, 10)).toBe(false);
  });

  it('rejects repeated digits', () => {
    expect(isValidGuess('0012', 4, 10)).toBe(false);
    expect(isValidGuess('1210', 4, 10)).toBe(false);
  });

  it('accepts hex digits in lower case', () => {
    expect(isValidGuess('cafe', 4, 16)).toBe(true);
  });

  it('accepts hex digits in upper case', () => {
    expect(isValidGuess('BEAD', 4, 16)).toBe(true);
  });

  it('accepts mixed-case hex digits', () => {
    expect(isValidGuess('AbCd', 4, 16)).toBe(true);
  });

  it('treats repeated hex digits case-insensitively', () => {
    expect(isValidGuess('Aa', 2, 16)).toBe(false);
    expect(isValidGuess('aA', 2, 16)).toBe(false);
  });

  it('rejects invalid hex characters', () => {
    expect(isValidGuess('ghij', 4, 16)).toBe(false);
  });

  it('works for binary length 2', () => {
    expect(isValidGuess('01', 2, 2)).toBe(true);
    expect(isValidGuess('00', 2, 2)).toBe(false);
    expect(isValidGuess('10', 2, 2)).toBe(true);
  });

  it('allows leading zeros when length matches', () => {
    expect(isValidGuess('0123', 4, 10)).toBe(true);
  });
});
