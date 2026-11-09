import { createDigitValidator } from '../core/createDigitValidator.js';
import { isValidGuess } from '../core/isValidGuess.js';
import type { GameState } from '../core/gameState.js';
import type { LeaderboardRecord } from '../storage/records.js';
import { getTopRecords } from '../storage/records.js';
import { createElement } from './createElement.js';

export function renderGame(
  state: GameState,
  records: LeaderboardRecord[],
  onSubmit: (guess: string) => void,
  onNewGame: () => void
): HTMLElement {
  const isValidDigit = createDigitValidator(state.settings.base);
  const isWon = state.status === 'won';

  const input = createElement('input', {
    type: 'text',
    id: 'guess-input',
    maxLength: String(state.settings.length),
    disabled: isWon ? true : undefined,
    autofocus: true,
  }) as HTMLInputElement;

  input.addEventListener('input', () => {
    input.value = input.value.split('').filter(isValidDigit).join('').toLowerCase();
  });

  const submitButton = createElement('button', {
    textContent: 'Submit',
    disabled: isWon ? true : undefined,
    onClick: () => {
      const guess = input.value;

      if (isValidGuess(guess, state.settings.length, state.settings.base)) {
        onSubmit(guess);
      }
    },
  });

  const historyList = createElement(
    'ul',
    { className: 'history-list' },
    state.history.map((entry) =>
      createElement('li', {
        textContent: `${entry.guess}: ${entry.bulls} bulls, ${entry.cows} cows`,
      })
    )
  );

  const newGameButton = createElement('button', {
    textContent: 'New Game',
    onClick: onNewGame,
  });

  const children: Array<HTMLElement | string> = [
    createElement('h2', {
      textContent: `Guess the ${state.settings.length}-digit secret`,
    }),
    createElement('p', {
      textContent: `Numeral system: ${state.settings.base}`,
    }),
    input,
    submitButton,
    historyList,
    newGameButton,
  ];

  if (isWon) {
    const duration = Math.max(0, Date.now() - state.startTime);
    children.push(
      createElement('p', {
        className: 'win-message',
        textContent: `You won in ${state.history.length} attempts and ${duration} ms!`,
      })
    );
  }

  const topRecords = getTopRecords(records, 10, state.settings.length, state.settings.base);

  const recordsTable =
    topRecords.length > 0
      ? createElement('table', { className: 'leaderboard' }, [
          createElement('thead', {}, [
            createElement('tr', {}, [
              createElement('th', { textContent: 'Attempts' }),
              createElement('th', { textContent: 'Time (ms)' }),
            ]),
          ]),
          createElement(
            'tbody',
            {},
            topRecords.map((record) =>
              createElement('tr', {}, [
                createElement('td', { textContent: String(record.attempts) }),
                createElement('td', { textContent: String(record.time) }),
              ])
            )
          ),
        ])
      : createElement('p', { textContent: 'No records for these settings yet.' });

  children.push(createElement('h3', { textContent: 'Leaderboard' }), recordsTable);

  const gameScreen = createElement('div', { className: 'game-screen' }, children);

  if (!isWon) {
    setTimeout(() => {
      input.focus();
    }, 0);
  }

  return gameScreen;
}
