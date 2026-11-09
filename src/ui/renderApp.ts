import type { GameState } from '../core/gameState.js';
import type { LeaderboardRecord } from '../storage/records.js';
import { renderGame } from './renderGame.js';
import { renderSettings } from './renderSettings.js';

export type Handlers = {
  onStart: (settings: { length: number; base: number }) => void;
  onSubmit: (guess: string) => void;
  onNewGame: () => void;
};

export function renderApp(
  root: HTMLElement,
  state: GameState,
  records: LeaderboardRecord[],
  handlers: Handlers
): void {
  const existingGameScreen = root.querySelector('.game-screen') as HTMLElement | null;
  if (existingGameScreen) {
    const timer = (existingGameScreen as HTMLElement & { __timer?: number }).__timer;
    if (timer !== undefined) {
      clearInterval(timer);
    }
  }

  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }

  if (state.status === 'idle') {
    root.appendChild(renderSettings(state.settings, records, handlers.onStart));
  } else {
    const gameScreen = renderGame(state, handlers.onSubmit, handlers.onNewGame);
    root.appendChild(gameScreen);

    if (state.status === 'playing') {
      const input = gameScreen.querySelector<HTMLInputElement>('#guess-input');
      if (input) {
        setTimeout(() => input.focus(), 0);
      }
    }
  }
}
