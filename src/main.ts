import { createGameState, getAttemptCount, makeGuess, startGame } from './core/gameState.js';
import { addRecord, loadRecords, saveRecords, type LeaderboardRecord } from './storage/records.js';
import { renderApp, type Handlers } from './ui/renderApp.js';

let state = createGameState({ length: 4, base: 10 });
let records: LeaderboardRecord[] = loadRecords();

const root = document.body;

const handlers: Handlers = {
  onStart: (settings) => {
    state = startGame(createGameState(settings));
    renderApp(root, state, records, handlers);
  },
  onSubmit: (guess) => {
    const previousStatus = state.status;
    state = makeGuess(state, guess);

    if (previousStatus !== 'won' && state.status === 'won') {
      const record: LeaderboardRecord = {
        length: state.settings.length,
        base: state.settings.base,
        attempts: getAttemptCount(state),
        time: Date.now() - state.startTime,
        date: new Date().toISOString(),
      };

      records = addRecord(records, record);
      saveRecords(records);
    }

    renderApp(root, state, records, handlers);
  },
  onNewGame: () => {
    state = createGameState(state.settings);
    renderApp(root, state, records, handlers);
  },
};

renderApp(root, state, records, handlers);
