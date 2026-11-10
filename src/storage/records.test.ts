import { describe, expect, it, vi } from 'vitest';
import {
  addRecord,
  getAllTopRecords,
  getTopRecords,
  loadRecords,
  saveRecords,
  type LeaderboardRecord,
} from './records';

describe('records', () => {
  describe('addRecord', () => {
    it('returns a new array with the record appended', () => {
      const records: LeaderboardRecord[] = [];
      const record: LeaderboardRecord = {
        length: 4,
        base: 10,
        attempts: 5,
        time: 1000,
        date: '2026-01-01T00:00:00.000Z',
      };

      const next = addRecord(records, record);

      expect(next).toEqual([record]);
      expect(records).toEqual([]);
    });
  });

  describe('getTopRecords', () => {
    it('returns top N records for the given length and base sorted by attempts then time', () => {
      const records: LeaderboardRecord[] = [
        { length: 4, base: 10, attempts: 5, time: 1000, date: '' },
        { length: 4, base: 10, attempts: 3, time: 2000, date: '' },
        { length: 4, base: 10, attempts: 3, time: 1500, date: '' },
        { length: 4, base: 16, attempts: 2, time: 500, date: '' },
        { length: 6, base: 10, attempts: 1, time: 100, date: '' },
      ];

      const top = getTopRecords(records, 2, 4, 10);

      expect(top).toEqual([
        { length: 4, base: 10, attempts: 3, time: 1500, date: '' },
        { length: 4, base: 10, attempts: 3, time: 2000, date: '' },
      ]);
    });
  });

  describe('getAllTopRecords', () => {
    it('returns top N records across all settings sorted by attempts then time', () => {
      const records: LeaderboardRecord[] = [
        { length: 4, base: 10, attempts: 5, time: 1000, date: '' },
        { length: 4, base: 10, attempts: 3, time: 2000, date: '' },
        { length: 6, base: 10, attempts: 1, time: 100, date: '' },
      ];

      const top = getAllTopRecords(records, 2);

      expect(top).toEqual([
        { length: 6, base: 10, attempts: 1, time: 100, date: '' },
        { length: 4, base: 10, attempts: 3, time: 2000, date: '' },
      ]);
    });
  });

  describe('saveRecords / loadRecords', () => {
    it('saves records to localStorage and loads them back', () => {
      const store: Record<string, string> = {};

      vi.stubGlobal('localStorage', {
        getItem: (key: string) => store[key] ?? null,
        setItem: (key: string, value: string) => {
          store[key] = value;
        },
      });

      const records: LeaderboardRecord[] = [
        { length: 4, base: 10, attempts: 3, time: 1500, date: '2026-01-01T00:00:00.000Z' },
      ];

      saveRecords(records);

      expect(loadRecords()).toEqual(records);
    });

    it('returns an empty array when localStorage is empty', () => {
      vi.stubGlobal('localStorage', {
        getItem: () => null,
        setItem: () => undefined,
      });

      expect(loadRecords()).toEqual([]);
    });

    it('returns an empty array when stored data is invalid JSON', () => {
      vi.stubGlobal('localStorage', {
        getItem: () => 'not-json',
        setItem: () => undefined,
      });

      expect(loadRecords()).toEqual([]);
    });
  });
});
