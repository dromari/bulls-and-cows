export type LeaderboardRecord = {
    length: number;
    base: number;
    attempts: number;
    time: number;
    date: string;
};
export declare function formatDuration(ms: number): string;
export declare function loadRecords(): LeaderboardRecord[];
export declare function saveRecords(records: LeaderboardRecord[]): void;
export declare function addRecord(records: LeaderboardRecord[], record: LeaderboardRecord): LeaderboardRecord[];
export declare function getTopRecords(records: LeaderboardRecord[], n: number, length: number, base: number): LeaderboardRecord[];
export declare function getAllTopRecords(records: LeaderboardRecord[], n: number): LeaderboardRecord[];
//# sourceMappingURL=records.d.ts.map