'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getHolidayPlanById } from '@/utils/storage';
import EditScheduleClient from './EditScheduleClient';
import { Schedule } from '@/types';

interface EditScheduleClientWrapperProps {
    planId: string;
    scheduleId: string;
}

export default function EditScheduleClientWrapper({ planId, scheduleId }: EditScheduleClientWrapperProps) {
    const router = useRouter();
    const [schedule, setSchedule] = useState<Schedule | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // クライアントサイドでのみlocalStorageにアクセス
        try {
            // プランとスケジュールデータの取得
            const planData = getHolidayPlanById(planId);

            if (planData) {
                const scheduleData = planData.schedules.find(s => s.id === scheduleId);

                if (scheduleData) {
                    setSchedule(scheduleData);
                } else {
                    // 存在しないスケジュールの場合はプラン詳細に戻る
                    router.push(`/plan/${planId}`);
                }
            } else {
                // 存在しないプランの場合はホームに戻る
                router.push('/');
            }
        } catch (error) {
            console.error('スケジュールの読み込み中にエラーが発生しました:', error);
            router.push('/');
        } finally {
            setIsLoading(false);
        }
    }, [planId, scheduleId, router]);

    if (isLoading) {
        return <div>読み込み中...</div>;
    }

    if (!schedule) {
        return <div>スケジュールが見つかりませんでした</div>;
    }

    return <EditScheduleClient planId={planId} schedule={schedule} />;
} 