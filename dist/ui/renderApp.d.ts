import type { GameState } from '../core/gameState.js';
import type { LeaderboardRecord } from '../storage/records.js';
export type Handlers = {
    onStart: (settings: {
        length: number;
        base: number;
    }) => void;
    onSubmit: (guess: string) => void;
    onNewGame: () => void;
};
export declare function renderApp(root: HTMLElement, state: GameState, records: LeaderboardRecord[], handlers: Handlers): void;
//# sourceMappingURL=renderApp.d.ts.map