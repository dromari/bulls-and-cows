import type { GameState } from '../core/gameState';
import type { LeaderboardRecord } from '../storage/records';
import { renderGame } from './renderGame';
import { renderSettings } from './renderSettings';

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
  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }

  if (state.status === 'idle') {
    root.appendChild(renderSettings(state.settings, records, handlers.onStart));
  } else {
    root.appendChild(renderGame(state, records, handlers.onSubmit, handlers.onNewGame));
  }
}
