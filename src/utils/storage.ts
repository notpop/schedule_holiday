import { HolidayPlan, Schedule } from '../types';

const HOLIDAY_PLANS_KEY = 'holiday-plans';

// クライアントサイドかどうか確認する関数（Edgeランタイム対応）
const isClient = () => {
    // typeof windowの判定だけではEdgeでエラーになる可能性があるため、以下の方法で確認
    try {
        return typeof window !== 'undefined' &&
            typeof window.localStorage !== 'undefined' &&
            window.localStorage !== null;
    } catch {
        // Edgeランタイムでエラーが発生した場合はfalseを返す
        return false;
    }
};

// 安全にlocalStorageにアクセスする関数
const safeLocalStorage = {
    getItem: (key: string): string | null => {
        try {
            if (!isClient()) return null;
            return localStorage.getItem(key);
        } catch (error) {
            console.error('LocalStorage getItem error:', error);
            return null;
        }
    },
    setItem: (key: string, value: string): void => {
        try {
            if (!isClient()) return;
            localStorage.setItem(key, value);
        } catch (error) {
            console.error('LocalStorage setItem error:', error);
        }
    }
};

// 休日プラン一覧を取得
export const getHolidayPlans = (): HolidayPlan[] => {
    // Edgeランタイムではクライアントサイドのみ実行
    if (!isClient()) return [];

    try {
        const plans = safeLocalStorage.getItem(HOLIDAY_PLANS_KEY);
        return plans ? JSON.parse(plans) : [];
    } catch (e) {
        console.error('Error parsing holiday plans:', e);
        return [];
    }
};

// 休日プラン一覧を保存
export const saveHolidayPlans = (plans: HolidayPlan[]): void => {
    if (!isClient()) return;

    try {
        safeLocalStorage.setItem(HOLIDAY_PLANS_KEY, JSON.stringify(plans));
    } catch (e) {
        console.error('Error saving holiday plans:', e);
    }
};

// 特定の休日プランを取得
export const getHolidayPlanById = (id: string): HolidayPlan | null => {
    if (!isClient()) return null;

    try {
        const plans = getHolidayPlans();
        return plans.find(plan => plan.id === id) || null;
    } catch (e) {
        console.error('Error getting holiday plan by id:', e);
        return null;
    }
};

// 新しい休日プランを追加
export const addHolidayPlan = (plan: HolidayPlan): void => {
    if (!isClient()) return;

    try {
        const plans = getHolidayPlans();
        plans.push(plan);
        saveHolidayPlans(plans);
    } catch (e) {
        console.error('Error adding holiday plan:', e);
    }
};

// 休日プランを更新
export const updateHolidayPlan = (updatedPlan: HolidayPlan): void => {
    if (!isClient()) return;

    try {
        const plans = getHolidayPlans();
        const index = plans.findIndex(plan => plan.id === updatedPlan.id);

        if (index !== -1) {
            plans[index] = updatedPlan;
            saveHolidayPlans(plans);
        }
    } catch (e) {
        console.error('Error updating holiday plan:', e);
    }
};

// 休日プランを削除
export const deleteHolidayPlan = (id: string): void => {
    if (!isClient()) return;

    try {
        const plans = getHolidayPlans();
        const filteredPlans = plans.filter(plan => plan.id !== id);
        saveHolidayPlans(filteredPlans);
    } catch (e) {
        console.error('Error deleting holiday plan:', e);
    }
};

// スケジュールを追加
export const addSchedule = (holidayPlanId: string, schedule: Schedule): void => {
    if (!isClient()) return;

    try {
        const plans = getHolidayPlans();
        const planIndex = plans.findIndex(plan => plan.id === holidayPlanId);

        if (planIndex !== -1) {
            plans[planIndex].schedules.push(schedule);
            saveHolidayPlans(plans);
        }
    } catch (e) {
        console.error('Error adding schedule:', e);
    }
};

// スケジュールを更新
export const updateSchedule = (holidayPlanId: string, updatedSchedule: Schedule): void => {
    if (!isClient()) return;

    try {
        const plans = getHolidayPlans();
        const planIndex = plans.findIndex(plan => plan.id === holidayPlanId);

        if (planIndex !== -1) {
            const scheduleIndex = plans[planIndex].schedules.findIndex(
                schedule => schedule.id === updatedSchedule.id
            );

            if (scheduleIndex !== -1) {
                plans[planIndex].schedules[scheduleIndex] = updatedSchedule;
                saveHolidayPlans(plans);
            }
        }
    } catch (e) {
        console.error('Error updating schedule:', e);
    }
};

// スケジュールを削除
export const deleteSchedule = (holidayPlanId: string, scheduleId: string): void => {
    if (!isClient()) return;

    try {
        const plans = getHolidayPlans();
        const planIndex = plans.findIndex(plan => plan.id === holidayPlanId);

        if (planIndex !== -1) {
            plans[planIndex].schedules = plans[planIndex].schedules.filter(
                schedule => schedule.id !== scheduleId
            );
            saveHolidayPlans(plans);
        }
    } catch (e) {
        console.error('Error deleting schedule:', e);
    }
}; 