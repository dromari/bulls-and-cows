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
export declare function createGameState(settings: GameSettings): GameState;
export declare function startGame(state: GameState, random?: () => number): GameState;
export declare function makeGuess(state: GameState, guess: string): GameState;
export declare function isGameWon(state: GameState): boolean;
export declare function getAttemptCount(state: GameState): number;
//# sourceMappingURL=gameState.d.ts.map