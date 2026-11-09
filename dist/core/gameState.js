import { evaluateGuess } from './evaluateGuess.js';
import { generateSecret } from './generateSecret.js';
import { isValidGuess } from './isValidGuess.js';
export function createGameState(settings) {
    return {
        settings,
        secret: '',
        history: [],
        startTime: 0,
        status: 'idle',
    };
}
export function startGame(state, random = Math.random) {
    return {
        ...state,
        secret: generateSecret(state.settings.length, state.settings.base, random),
        history: [],
        startTime: Date.now(),
        status: 'playing',
    };
}
export function makeGuess(state, guess) {
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
    const entry = { guess, bulls, cows };
    const isWon = bulls === state.settings.length;
    return {
        ...state,
        history: [...state.history, entry],
        status: isWon ? 'won' : state.status,
    };
}
export function isGameWon(state) {
    return state.status === 'won';
}
export function getAttemptCount(state) {
    return state.history.length;
}
//# sourceMappingURL=gameState.js.map