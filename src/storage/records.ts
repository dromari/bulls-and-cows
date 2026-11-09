export type LeaderboardRecord = {
  length: number;
  base: number;
  attempts: number;
  time: number;
  date: string;
};

const STORAGE_KEY = 'bulls-and-cows-records';

export function loadRecords(): LeaderboardRecord[] {
  if (typeof localStorage === 'undefined') {
    return [];
  }

  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as LeaderboardRecord[];
  } catch {
    return [];
  }
}

export function saveRecords(records: LeaderboardRecord[]): void {
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function addRecord(
  records: LeaderboardRecord[],
  record: LeaderboardRecord
): LeaderboardRecord[] {
  return [...records, record];
}

export function getTopRecords(
  records: LeaderboardRecord[],
  n: number,
  length: number,
  base: number
): LeaderboardRecord[] {
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

export function getAllTopRecords(records: LeaderboardRecord[], n: number): LeaderboardRecord[] {
  return [...records]
    .sort((a, b) => {
      if (a.attempts !== b.attempts) {
        return a.attempts - b.attempts;
      }

      return a.time - b.time;
    })
    .slice(0, n);
}
