import { renderGame } from './renderGame.js';
import { renderSettings } from './renderSettings.js';
export function renderApp(root, state, records, handlers) {
    const existingGameScreen = root.querySelector('.game-screen');
    if (existingGameScreen) {
        const timer = existingGameScreen.__timer;
        if (timer !== undefined) {
            clearInterval(timer);
        }
    }
    while (root.firstChild) {
        root.removeChild(root.firstChild);
    }
    if (state.status === 'idle') {
        root.appendChild(renderSettings(state.settings, records, handlers.onStart));
    }
    else {
        const gameScreen = renderGame(state, handlers.onSubmit, handlers.onNewGame);
        root.appendChild(gameScreen);
        if (state.status === 'playing') {
            const input = gameScreen.querySelector('#guess-input');
            if (input) {
                setTimeout(() => input.focus(), 0);
            }
        }
    }
}
//# sourceMappingURL=renderApp.js.map