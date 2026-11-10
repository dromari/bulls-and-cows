import { createDigitValidator } from '../core/createDigitValidator.js';
import { isValidGuess } from '../core/isValidGuess.js';
import type { GameState } from '../core/gameState.js';
import { formatDuration } from '../storage/records.js';
import { createElement } from './createElement.js';

export function renderGame(
  state: GameState,
  onSubmit: (guess: string) => void,
  onNewGame: () => void
): HTMLElement {
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
  }) as HTMLInputElement;

  const slots: HTMLElement[] = Array.from({ length }, () =>
    createElement('div', {
      className: 'slot',
      textContent: '',
      onClick: () => {
        input.focus();
      },
    })
  );

  const slotsContainer = createElement('div', { className: 'guess-slots' }, slots);

  function updateSlots(value: string): void {
    slots.forEach((slot, index) => {
      slot.textContent = value[index] ?? '';
      slot.classList.toggle('filled', index < value.length);
    });
  }

  // 1. Создаем контейнер ошибки с фиксированным местом, чтобы вёрстка не прыгала
  const errorMessage = createElement('div', {
    className: 'error-message',
    textContent: '',
  });
  errorMessage.style.minHeight = '20px';
  errorMessage.style.marginTop = '4px';
  errorMessage.style.color = 'red';
  errorMessage.style.visibility = 'hidden'; // Управляем через visibility вместо display, чтобы не было сдвигов

  function setError(message: string): void {
    errorMessage.textContent = message;
    errorMessage.style.visibility = 'visible';
  }

  function clearError(): void {
    errorMessage.textContent = '';
    errorMessage.style.visibility = 'hidden';
  }

  function validateInput(value: string): string | null {
    const hasInvalidChar = value.split('').some((char) => !isValidDigit(char));
    if (hasInvalidChar) {
      return 'Недопустимый символ для этой системы счисления';
    }

    const hasDuplicate = new Set(value.toLowerCase()).size !== value.length;
    if (hasDuplicate) {
      return 'Цифры в попытке не должны повторяться';
    }

    return null;
  }

  function keepUniqueChars(value: string): string {
    const seen = new Set<string>();
    return value
      .split('')
      .filter((char) => {
        if (seen.has(char)) {
          return false;
        }
        seen.add(char);
        return true;
      })
      .join('');
  }

  function validateAndUpdateUI(rawValue: string): void {
    // 1. Сначала проверяем на ошибки "сырое" значение (включая только что нажатый дубликат/символ)
    const error = validateInput(rawValue);
    if (error) {
      setError(error);
    } else {
      clearError();
    }

    // 2. А вот в сам инпут и слоты записываем ТОЛЬКО чистые данные,
    // отсекая недопустимые символы и дубликаты, чтобы они физически не вводились
    const normalized = rawValue.split('').filter(isValidDigit).join('').toLowerCase();
    const unique = keepUniqueChars(normalized).slice(0, length);

    input.value = unique;
    updateSlots(unique);
  }

  input.addEventListener('input', () => {
    validateAndUpdateUI(input.value);
  });

  function appendChar(char: string): void {
    if (isWon) {
      return;
    }

    // Приводим к нижнему регистру, так как вся логика ядра и валидатора ожидает строчные символы
    const lowerChar = char.toLowerCase();

    // Берем текущее значение, добавляем новый символ и передаем в валидатор
    const newValue = input.value + lowerChar;

    // Принудительно вызываем обновление UI с новым значением
    validateAndUpdateUI(newValue);

    // Возвращаем фокус на инпут
    input.focus();
  }

  function clearGuess(): void {
    validateAndUpdateUI('');
    input.focus();
  }

  function submitGuess(): void {
    const guess = input.value.toLowerCase(); // Гарантируем нижний регистр для ядра

    if (isValidGuess(guess, length, state.settings.base)) {
      validateAndUpdateUI('');
      onSubmit(guess);
    }
  }

  const digits = '0123456789abcdef'.slice(0, state.settings.base).split('');

  const keyButtons = digits.map((char) =>
    createElement('button', {
      type: 'button',
      className: 'key',
      textContent: char.toUpperCase(),
      disabled: isWon ? true : undefined,
      onClick: (event: Event) => {
        event.preventDefault();
        appendChar(char);
      },
    })
  );

  const clearButton = createElement('button', {
    type: 'button',
    className: 'key key-clear',
    textContent: 'Clear',
    disabled: isWon ? true : undefined,
    onClick: (event: Event) => {
      event.preventDefault();
      clearGuess();
    },
  });

  const submitButton = createElement('button', {
    type: 'button',
    className: 'key key-submit',
    textContent: 'Submit',
    disabled: isWon ? true : undefined,
    onClick: (event: Event) => {
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

  const historyList = createElement(
    'ul',
    { className: 'history-list' },
    state.history.map((entry) => {
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
    })
  );

  const newGameButton = createElement('button', {
    type: 'button',
    className: 'new-game-button',
    textContent: 'New Game',
    onClick: (event: Event) => {
      event.preventDefault();
      onNewGame();
    },
  });

  const timerDisplay = createElement('span', {
    className: 'game-timer',
    textContent: formatDuration(0),
  });

  const children: Array<HTMLElement | string> = [
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
    errorMessage,
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

    (gameScreen as HTMLElement & { __timer?: number }).__timer = timerInterval;
  }

  if (isWon) {
    const duration = Math.max(0, Date.now() - state.startTime);
    const modal = createWinModal(state.history.length, duration, onNewGame);
    gameScreen.appendChild(modal);
  }

  return gameScreen;
}

function createWinModal(attempts: number, duration: number, onNewGame: () => void): HTMLElement {
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
      onClick: (event: Event) => {
        event.preventDefault();
        onNewGame();
      },
    }),
  ]);

  return createElement('div', { className: 'modal-overlay' }, [modalCard]);
}
