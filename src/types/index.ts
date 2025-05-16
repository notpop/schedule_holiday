export interface Schedule {
    id: string;
    date: string; // YYYY-MM-DD
    title: string;
    startTime: string; // HH:MM
    endTime: string; // HH:MM
    memo: string;
    color?: string; // カラーコード
}

export interface HolidayPlan {
    id: string;
    title: string; // 休日の名前（例：「夏休み」「GW」など）
    date: string; // YYYY-MM-DD
    schedules: Schedule[];
} 