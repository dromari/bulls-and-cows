export function formatDuration(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':');
}
const STORAGE_KEY = 'bulls-and-cows-records';
export function loadRecords() {
    if (typeof localStorage === 'undefined') {
        return [];
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        return [];
    }
    try {
        return JSON.parse(raw);
    }
    catch {
        return [];
    }
}
export function saveRecords(records) {
    if (typeof localStorage === 'undefined') {
        return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}
export function addRecord(records, record) {
    return [...records, record];
}
export function getTopRecords(records, n, length, base) {
    return [...records]
        .filter((record) => record.length === length && record.base === base)
        .sort((a, b) => {
        if (a.attempts !== b.attempts) {
            return a.attempts - b.attempts;
        }
        return a.time - b.time;
    })
        .slice(0, n);
}
export function getAllTopRecords(records, n) {
    return [...records]
        .sort((a, b) => {
        if (a.attempts !== b.attempts) {
            return a.attempts - b.attempts;
        }
        return a.time - b.time;
    })
        .slice(0, n);
}
//# sourceMappingURL=records.js.map