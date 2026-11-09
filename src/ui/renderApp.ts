import type { GameState } from '../core/gameState';
import { renderGame } from './renderGame';
import { renderSettings } from './renderSettings';

export type Handlers = {
  onStart: (settings: { length: number; base: number }) => void;
  onSubmit: (guess: string) => void;
  onNewGame: () => void;
};

export function renderApp(root: HTMLElement, state: GameState, handlers: Handlers): void {
  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }

  if (state.status === 'idle') {
    root.appendChild(renderSettings(state.settings, handlers.onStart));
  } else {
    root.appendChild(renderGame(state, handlers.onSubmit, handlers.onNewGame));
  }
}
