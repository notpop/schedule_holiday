import { HolidayPlan, Schedule } from '../types';

const HOLIDAY_PLANS_KEY = 'holiday-plans';

// 休日プラン一覧を取得
export const getHolidayPlans = (): HolidayPlan[] => {
    if (typeof window === 'undefined') return [];

    const plans = localStorage.getItem(HOLIDAY_PLANS_KEY);
    return plans ? JSON.parse(plans) : [];
};

// 休日プラン一覧を保存
export const saveHolidayPlans = (plans: HolidayPlan[]): void => {
    if (typeof window === 'undefined') return;

    localStorage.setItem(HOLIDAY_PLANS_KEY, JSON.stringify(plans));
};

// 特定の休日プランを取得
export const getHolidayPlanById = (id: string): HolidayPlan | null => {
    const plans = getHolidayPlans();
    return plans.find(plan => plan.id === id) || null;
};

// 新しい休日プランを追加
export const addHolidayPlan = (plan: HolidayPlan): void => {
    const plans = getHolidayPlans();
    plans.push(plan);
    saveHolidayPlans(plans);
};

// 休日プランを更新
export const updateHolidayPlan = (updatedPlan: HolidayPlan): void => {
    const plans = getHolidayPlans();
    const index = plans.findIndex(plan => plan.id === updatedPlan.id);

    if (index !== -1) {
        plans[index] = updatedPlan;
        saveHolidayPlans(plans);
    }
};

// 休日プランを削除
export const deleteHolidayPlan = (id: string): void => {
    const plans = getHolidayPlans();
    const filteredPlans = plans.filter(plan => plan.id !== id);
    saveHolidayPlans(filteredPlans);
};

// スケジュールを追加
export const addSchedule = (holidayPlanId: string, schedule: Schedule): void => {
    const plans = getHolidayPlans();
    const planIndex = plans.findIndex(plan => plan.id === holidayPlanId);

    if (planIndex !== -1) {
        plans[planIndex].schedules.push(schedule);
        saveHolidayPlans(plans);
    }
};

// スケジュールを更新
export const updateSchedule = (holidayPlanId: string, updatedSchedule: Schedule): void => {
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
};

// スケジュールを削除
export const deleteSchedule = (holidayPlanId: string, scheduleId: string): void => {
    const plans = getHolidayPlans();
    const planIndex = plans.findIndex(plan => plan.id === holidayPlanId);

    if (planIndex !== -1) {
        plans[planIndex].schedules = plans[planIndex].schedules.filter(
            schedule => schedule.id !== scheduleId
        );
        saveHolidayPlans(plans);
    }
}; 