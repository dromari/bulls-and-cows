import { createGameState, makeGuess, startGame } from './core/gameState';
import { renderApp, type Handlers } from './ui/renderApp';

let state = createGameState({ length: 4, base: 10 });

const root = document.body;

const handlers: Handlers = {
  onStart: (settings) => {
    state = startGame(createGameState(settings));
    renderApp(root, state, handlers);
  },
  onSubmit: (guess) => {
    state = makeGuess(state, guess);
    renderApp(root, state, handlers);
  },
  onNewGame: () => {
    state = createGameState(state.settings);
    renderApp(root, state, handlers);
  },
};

renderApp(root, state, handlers);
