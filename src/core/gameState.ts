import { evaluateGuess } from './evaluateGuess';
import { generateSecret } from './generateSecret';
import { isValidGuess } from './isValidGuess';

export type GameSettings = {
  length: number;
  base: number;
};

export type GameHistoryEntry = {
  guess: string;
  bulls: number;
  cows: number;
};

export type GameStatus = 'idle' | 'playing' | 'won';

export type GameState = {
  settings: GameSettings;
  secret: string;
  history: GameHistoryEntry[];
  startTime: number;
  status: GameStatus;
};

export function createGameState(settings: GameSettings): GameState {
  return {
    settings,
    secret: '',
    history: [],
    startTime: 0,
    status: 'idle',
  };
}

export function startGame(state: GameState, random: () => number = Math.random): GameState {
  return {
    ...state,
    secret: generateSecret(state.settings.length, state.settings.base, random),
    history: [],
    startTime: Date.now(),
    status: 'playing',
  };
}

export function makeGuess(state: GameState, guess: string): GameState {
  if (state.status !== 'playing') {
    return state;
  }

  if (!isValidGuess(guess, state.settings.length, state.settings.base)) {
    return state;
  }

  const normalizedGuess = guess.toLowerCase();
  const isDuplicate = state.history.some((entry) => entry.guess.toLowerCase() === normalizedGuess);

  if (isDuplicate) {
    return state;
  }

  const { bulls, cows } = evaluateGuess(state.secret, guess);
  const entry: GameHistoryEntry = { guess, bulls, cows };
  const isWon = bulls === state.settings.length;

  return {
    ...state,
    history: [...state.history, entry],
    status: isWon ? 'won' : state.status,
  };
}

export function isGameWon(state: GameState): boolean {
  return state.status === 'won';
}

export function getAttemptCount(state: GameState): number {
  return state.history.length;
}
