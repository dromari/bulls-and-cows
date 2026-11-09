import { createDigitValidator } from '../core/createDigitValidator.js';
import { isValidGuess } from '../core/isValidGuess.js';
import { formatDuration } from '../storage/records.js';
import { createElement } from './createElement.js';
export function renderGame(state, onSubmit, onNewGame) {
    const isValidDigit = createDigitValidator(state.settings.base);
    const isWon = state.status === 'won';
    const { length } = state.settings;
    const input = createElement('input', {
        type: 'text',
        id: 'guess-input',
        className: 'hidden-input',
        maxLength: String(length),
        disabled: isWon ? true : undefined,
        autofocus: true,
    });
    const slots = Array.from({ length }, () => createElement('div', {
        className: 'slot',
        textContent: '',
        onClick: () => {
            input.focus();
        },
    }));
    const slotsContainer = createElement('div', { className: 'guess-slots' }, slots);
    function updateSlots(value) {
        slots.forEach((slot, index) => {
            slot.textContent = value[index] ?? '';
            slot.classList.toggle('filled', index < value.length);
        });
    }
    input.addEventListener('input', () => {
        const normalized = input.value.split('').filter(isValidDigit).join('').toLowerCase();
        input.value = normalized;
        updateSlots(normalized);
    });
    function appendChar(char) {
        if (input.value.length < length && !isWon) {
            input.value += char;
            updateSlots(input.value);
            input.focus();
        }
    }
    function clearGuess() {
        input.value = '';
        updateSlots('');
        input.focus();
    }
    function submitGuess() {
        const guess = input.value;
        if (isValidGuess(guess, length, state.settings.base)) {
            onSubmit(guess);
        }
    }
    const digits = '0123456789abcdef'.slice(0, state.settings.base).split('');
    const keyButtons = digits.map((char) => createElement('button', {
        type: 'button',
        className: 'key',
        textContent: char.toUpperCase(),
        disabled: isWon ? true : undefined,
        onClick: (event) => {
            event.preventDefault();
            appendChar(char);
        },
    }));
    const clearButton = createElement('button', {
        type: 'button',
        className: 'key key-clear',
        textContent: 'Clear',
        disabled: isWon ? true : undefined,
        onClick: (event) => {
            event.preventDefault();
            clearGuess();
        },
    });
    const submitButton = createElement('button', {
        type: 'button',
        className: 'key key-submit',
        textContent: 'Submit',
        disabled: isWon ? true : undefined,
        onClick: (event) => {
            event.preventDefault();
            submitGuess();
        },
    });
    const digitsRow = createElement('div', { className: 'keyboard-row digits-row' }, [
        ...keyButtons,
        clearButton,
    ]);
    const submitRow = createElement('div', { className: 'keyboard-row submit-row' }, [submitButton]);
    const keyboard = createElement('div', { className: 'keyboard' }, [digitsRow, submitRow]);
    const historyList = createElement('ul', { className: 'history-list' }, state.history.map((entry) => {
        const guessText = createElement('span', {
            className: 'history-guess',
            textContent: entry.guess.toUpperCase(),
        });
        const bullsBadge = createElement('span', {
            className: 'badge badge-bulls',
            title: 'Быки: число отгаданных цифр, стоящих на своих местах',
            textContent: `${entry.bulls} 🐂`,
        });
        const cowsBadge = createElement('span', {
            className: 'badge badge-cows',
            title: 'Коровы: число отгаданных цифр, стоящих не на своих местах',
            textContent: `${entry.cows} 🐄`,
        });
        return createElement('li', {}, [guessText, bullsBadge, cowsBadge]);
    }));
    const newGameButton = createElement('button', {
        type: 'button',
        className: 'new-game-button',
        textContent: 'New Game',
        onClick: (event) => {
            event.preventDefault();
            onNewGame();
        },
    });
    const timerDisplay = createElement('span', {
        className: 'game-timer',
        textContent: formatDuration(0),
    });
    const children = [
        createElement('h2', {
            className: 'game-title',
            textContent: `Guess the ${length}-digit secret`,
        }),
        createElement('p', {
            className: 'game-subtitle',
            textContent: `Base: ${state.settings.base}`,
        }),
        createElement('p', { className: 'game-timer-row' }, ['Time: ', timerDisplay]),
        slotsContainer,
        input,
        keyboard,
        historyList,
        newGameButton,
    ];
    const gameScreen = createElement('div', { className: 'game-screen' }, children);
    if (!isWon) {
        setTimeout(() => {
            input.focus();
        }, 0);
        const timerInterval = window.setInterval(() => {
            const elapsed = Math.max(0, Date.now() - state.startTime);
            timerDisplay.textContent = formatDuration(elapsed);
        }, 1000);
        gameScreen.__timer = timerInterval;
    }
    if (isWon) {
        const duration = Math.max(0, Date.now() - state.startTime);
        const modal = createWinModal(state.history.length, duration, onNewGame);
        gameScreen.appendChild(modal);
    }
    return gameScreen;
}
function createWinModal(attempts, duration, onNewGame) {
    const modalCard = createElement('div', { className: 'modal' }, [
        createElement('h2', { className: 'modal-title', textContent: '🎉 Congratulations!' }),
        createElement('p', {
            className: 'modal-text',
            textContent: `You guessed the secret in ${attempts} attempts.`,
        }),
        createElement('p', {
            className: 'modal-text',
            textContent: `Time: ${formatDuration(duration)}`,
        }),
        createElement('button', {
            type: 'button',
            className: 'modal-button',
            textContent: 'New Game',
            onClick: (event) => {
                event.preventDefault();
                onNewGame();
            },
        }),
    ]);
    return createElement('div', { className: 'modal-overlay' }, [modalCard]);
}
//# sourceMappingURL=renderGame.js.map