import { countPossibleSecrets } from '../core/countPossibleSecrets.js';
import { formatDuration, getAllTopRecords } from '../storage/records.js';
import { createElement } from './createElement.js';
const BASE_OPTIONS = [
    { value: 2, label: 'Binary' },
    { value: 8, label: 'Octal' },
    { value: 10, label: 'Decimal' },
    { value: 16, label: 'Hexadecimal' },
];
export function renderSettings(initialSettings, records, onStart) {
    let length = initialSettings.length;
    let base = initialSettings.base;
    const possibleCount = createElement('span', {
        textContent: String(countPossibleSecrets(length, base)),
    });
    const lengthSelect = createElement('select', { id: 'length-select' });
    const baseSelect = createElement('select', { id: 'base-select' });
    BASE_OPTIONS.forEach((option) => {
        const optionElement = createElement('option', {
            value: String(option.value),
            textContent: option.label,
        });
        if (option.value === base) {
            optionElement.selected = true;
        }
        baseSelect.appendChild(optionElement);
    });
    function clearOptions(select) {
        while (select.firstChild) {
            select.removeChild(select.firstChild);
        }
    }
    function renderLengthOptions() {
        clearOptions(lengthSelect);
        const maxLength = base === 2 ? 2 : 6;
        if (length > maxLength) {
            length = maxLength;
        }
        for (let value = 2; value <= maxLength; value += 1) {
            const optionElement = createElement('option', {
                value: String(value),
                textContent: String(value),
            });
            if (value === length) {
                optionElement.selected = true;
            }
            lengthSelect.appendChild(optionElement);
        }
    }
    function updatePossibleCount() {
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
        type: 'button',
        className: 'start-button',
        textContent: 'Start',
        onClick: (event) => {
            event.preventDefault();
            onStart({ length, base });
        },
    });
    const viewLeaderboardButton = createElement('button', {
        type: 'button',
        className: 'view-leaderboard-button',
        textContent: 'View Leaderboard',
        onClick: (event) => {
            event.preventDefault();
            settingsScreen.appendChild(createLeaderboardModal(records));
        },
    });
    renderLengthOptions();
    const settingsScreen = createElement('div', { className: 'settings-screen' }, [
        createElement('h1', { textContent: 'Bulls and Cows' }),
        createElement('label', { textContent: 'Length:', htmlFor: 'length-select' }),
        lengthSelect,
        createElement('label', { textContent: 'Numeral system:', htmlFor: 'base-select' }),
        baseSelect,
        createElement('p', {}, ['Possible secrets: ', possibleCount]),
        startButton,
        viewLeaderboardButton,
    ]);
    return settingsScreen;
}
function createLeaderboardModal(records) {
    const topRecords = getAllTopRecords(records, 10);
    const recordsTable = topRecords.length > 0
        ? createElement('table', { className: 'leaderboard' }, [
            createElement('thead', {}, [
                createElement('tr', {}, [
                    createElement('th', { textContent: 'Length' }),
                    createElement('th', { textContent: 'Base' }),
                    createElement('th', { textContent: 'Attempts' }),
                    createElement('th', { textContent: 'Time' }),
                ]),
            ]),
            createElement('tbody', {}, topRecords.map((record) => createElement('tr', {}, [
                createElement('td', { textContent: String(record.length) }),
                createElement('td', { textContent: String(record.base) }),
                createElement('td', { textContent: String(record.attempts) }),
                createElement('td', { textContent: formatDuration(record.time) }),
            ]))),
        ])
        : createElement('p', { textContent: 'No records yet.' });
    const modalCard = createElement('div', { className: 'modal' }, [
        createElement('h2', { className: 'modal-title', textContent: '🏆 Leaderboard' }),
        recordsTable,
        createElement('button', {
            type: 'button',
            className: 'modal-button',
            textContent: 'Close',
            onClick: (event) => {
                event.preventDefault();
                overlay.remove();
            },
        }),
    ]);
    const overlay = createElement('div', { className: 'modal-overlay' }, [modalCard]);
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            overlay.remove();
        }
    });
    return overlay;
}
//# sourceMappingURL=renderSettings.js.map