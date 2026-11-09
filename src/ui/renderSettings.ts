import { countPossibleSecrets } from '../core/countPossibleSecrets';
import { createElement } from './createElement';

const BASE_OPTIONS = [
  { value: 2, label: 'Binary' },
  { value: 8, label: 'Octal' },
  { value: 10, label: 'Decimal' },
  { value: 16, label: 'Hexadecimal' },
];

export function renderSettings(
  initialSettings: { length: number; base: number },
  onStart: (settings: { length: number; base: number }) => void
): HTMLElement {
  let length = initialSettings.length;
  let base = initialSettings.base;

  const possibleCount = createElement('span', {
    textContent: String(countPossibleSecrets(length, base)),
  });

  const lengthSelect = createElement('select', { id: 'length-select' }) as HTMLSelectElement;
  const baseSelect = createElement('select', { id: 'base-select' }) as HTMLSelectElement;

  BASE_OPTIONS.forEach((option) => {
    const optionElement = createElement('option', {
      value: String(option.value),
      textContent: option.label,
    }) as HTMLOptionElement;

    if (option.value === base) {
      optionElement.selected = true;
    }

    baseSelect.appendChild(optionElement);
  });

  function clearOptions(select: HTMLSelectElement): void {
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }
  }

  function renderLengthOptions(): void {
    clearOptions(lengthSelect);

    const maxLength = base === 2 ? 2 : 6;

    if (length > maxLength) {
      length = maxLength;
    }

    for (let value = 2; value <= maxLength; value += 1) {
      const optionElement = createElement('option', {
        value: String(value),
        textContent: String(value),
      }) as HTMLOptionElement;

      if (value === length) {
        optionElement.selected = true;
      }

      lengthSelect.appendChild(optionElement);
    }
  }

  function updatePossibleCount(): void {
    possibleCount.textContent = String(countPossibleSecrets(length, base));
  }

  lengthSelect.addEventListener('change', () => {
    length = Number(lengthSelect.value);
    updatePossibleCount();
  });

  baseSelect.addEventListener('change', () => {
    base = Number(baseSelect.value);
    renderLengthOptions();
    updatePossibleCount();
  });

  const startButton = createElement('button', {
    textContent: 'Start',
    onClick: () => {
      onStart({ length, base });
    },
  });

  renderLengthOptions();

  return createElement('div', { className: 'settings-screen' }, [
    createElement('h1', { textContent: 'Bulls and Cows' }),
    createElement('label', { textContent: 'Length:', htmlFor: 'length-select' }),
    lengthSelect,
    createElement('label', { textContent: 'Numeral system:', htmlFor: 'base-select' }),
    baseSelect,
    createElement('p', {}, ['Possible secrets: ', possibleCount]),
    startButton,
  ]);
}
