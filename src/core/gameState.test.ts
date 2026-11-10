import { createGameState, startGame, makeGuess, isGameWon, getAttemptCount } from './gameState';

describe('gameState', () => {
  const settings = { length: 4, base: 10 };

  describe('createGameState', () => {
    it('creates an idle state with empty secret and history', () => {
      const state = createGameState(settings);

      expect(state.settings).toEqual(settings);
      expect(state.secret).toBe('');
      expect(state.history).toEqual([]);
      expect(state.startTime).toBe(0);
      expect(state.status).toBe('idle');
    });
  });

  describe('startGame', () => {
    it('returns a new state with a generated secret and playing status', () => {
      const initial = createGameState(settings);
      const started = startGame(initial, () => 0);

      expect(started.status).toBe('playing');
      expect(started.secret).toBe('0123');
      expect(started.history).toEqual([]);
      expect(started.startTime).toBeGreaterThan(0);
      expect(started.settings).toEqual(settings);
    });

    it('clears previous history and secret when restarting', () => {
      const initial = createGameState(settings);
      const started = startGame(
        startGame(initial, () => 0.5),
        () => 0
      );

      expect(started.history).toEqual([]);
      expect(started.secret).toBe('0123');
    });
  });

  describe('makeGuess', () => {
    it('adds a valid guess to history', () => {
      const state = startGame(createGameState(settings), () => 0);
      const next = makeGuess(state, '4567');

      expect(next.history).toHaveLength(1);
      expect(next.history[0].guess).toBe('4567');
      expect(next.history[0].bulls).toBe(0);
      expect(next.history[0].cows).toBe(0);
    });

    it('does not mutate the original state', () => {
      const state = startGame(createGameState(settings), () => 0);
      makeGuess(state, '4567');

      expect(state.history).toEqual([]);
    });

    it('sets status to won when the guess matches the secret', () => {
      const state = startGame(createGameState(settings), () => 0);
      const next = makeGuess(state, '0123');

      expect(next.status).toBe('won');
      expect(next.history[0].bulls).toBe(4);
      expect(next.history[0].cows).toBe(0);
    });

    it('ignores duplicate guesses case-insensitively', () => {
      const state = startGame(createGameState({ length: 4, base: 16 }), () => 0);
      const afterFirst = makeGuess(state, '4567');
      const afterDuplicate = makeGuess(afterFirst, '4567');
      const afterCaseVariant = makeGuess(afterDuplicate, '4567');

      expect(afterDuplicate.history).toHaveLength(1);
      expect(afterCaseVariant.history).toHaveLength(1);
    });

    it('ignores invalid guesses', () => {
      const state = startGame(createGameState(settings), () => 0);
      const next = makeGuess(state, '01234');

      expect(next.history).toEqual([]);
    });

    it('does nothing when the game is idle', () => {
      const state = createGameState(settings);
      const next = makeGuess(state, '0123');

      expect(next.history).toEqual([]);
      expect(next.status).toBe('idle');
    });

    it('does nothing when the game is already won', () => {
      const state = startGame(createGameState(settings), () => 0);
      const won = makeGuess(state, '0123');
      const next = makeGuess(won, '4567');

      expect(next.history).toHaveLength(1);
      expect(next.status).toBe('won');
    });
  });

  describe('isGameWon', () => {
    it('returns true only for won status', () => {
      const idle = createGameState(settings);
      const playing = startGame(idle, () => 0);
      const won = makeGuess(playing, '0123');

      expect(isGameWon(idle)).toBe(false);
      expect(isGameWon(playing)).toBe(false);
      expect(isGameWon(won)).toBe(true);
    });
  });

  describe('getAttemptCount', () => {
    it('returns the number of history entries', () => {
      const state = startGame(createGameState(settings), () => 0);
      const afterGuess = makeGuess(state, '4567');

      expect(getAttemptCount(state)).toBe(0);
      expect(getAttemptCount(afterGuess)).toBe(1);
    });
  });
});
