'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getHolidayPlanById } from '@/utils/storage';
import EditScheduleClient from './EditScheduleClient';
import { Schedule } from '@/types';

type PageProps = {
    params: {
        id: string;
        scheduleId: string;
    };
};

export default function EditSchedule({ params }: PageProps) {
    const { id, scheduleId } = params;
    const router = useRouter();
    const [schedule, setSchedule] = useState<Schedule | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // プランとスケジュールデータの取得
        const planData = getHolidayPlanById(id);

        if (planData) {
            const scheduleData = planData.schedules.find(s => s.id === scheduleId);

            if (scheduleData) {
                setSchedule(scheduleData);
            } else {
                // 存在しないスケジュールの場合はプラン詳細に戻る
                router.push(`/plan/${id}`);
            }
        } else {
            // 存在しないプランの場合はホームに戻る
            router.push('/');
        }

        setIsLoading(false);
    }, [id, scheduleId, router]);

    if (isLoading) {
        return <div>読み込み中...</div>;
    }

    if (!schedule) {
        return <div>スケジュールが見つかりませんでした</div>;
    }

    return <EditScheduleClient planId={id} schedule={schedule} />;
} 