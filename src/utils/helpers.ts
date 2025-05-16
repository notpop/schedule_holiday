import { format, parse, isAfter, isToday, isBefore } from 'date-fns';
import { ja } from 'date-fns/locale';

// 文字列形式の日付(YYYY-MM-DD)をフォーマットする
export const formatDate = (dateStr: string, formatStr: string = 'yyyy年MM月dd日'): string => {
    const date = new Date(dateStr);
    return format(date, formatStr, { locale: ja });
};

// 時間文字列(HH:MM)をフォーマットする
export const formatTime = (timeStr: string, formatStr: string = 'HH:mm'): string => {
    const date = parse(timeStr, 'HH:mm', new Date());
    return format(date, formatStr);
};

// 時間帯の文字列を生成（例：「13:00 - 15:00」）
export const formatTimeRange = (startTime: string, endTime: string): string => {
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};

// 一意のIDを生成
export const generateId = (): string => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// スケジュールの時間を比較するための関数 (HH:MM形式の文字列)
export const compareTimeStrings = (time1: string, time2: string): number => {
    const [hour1, minute1] = time1.split(':').map(Number);
    const [hour2, minute2] = time2.split(':').map(Number);

    if (hour1 !== hour2) {
        return hour1 - hour2;
    }

    return minute1 - minute2;
};

// 今日の日付を取得 (YYYY-MM-DD形式)
export const getTodayString = (): string => {
    return format(new Date(), 'yyyy-MM-dd');
};

// 現在時刻を取得 (HH:MM形式)
export const getCurrentTimeString = (): string => {
    return format(new Date(), 'HH:mm');
};

// タイムスロットの配列を生成（例：["00:00", "00:30", "01:00", ...）
export const generateTimeSlots = (interval: number = 30): string[] => {
    const slots: string[] = [];

    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += interval) {
            const hourStr = hour.toString().padStart(2, '0');
            const minuteStr = minute.toString().padStart(2, '0');
            slots.push(`${hourStr}:${minuteStr}`);
        }
    }

    return slots;
};

// 日付がすでに過去かどうかをチェック
export const isPastDate = (dateStr: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 時間をリセット
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0); // 時間をリセット

    return isBefore(date, today);
};

// 日付が現在（今日）かどうかをチェック
export const isCurrentDate = (dateStr: string): boolean => {
    const date = new Date(dateStr);
    return isToday(date);
};

// 日付が未来かどうかをチェック
export const isFutureDate = (dateStr: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 時間をリセット
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0); // 時間をリセット

    return isAfter(date, today);
}; 