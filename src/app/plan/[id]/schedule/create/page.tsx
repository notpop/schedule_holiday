'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getHolidayPlanById } from '@/utils/storage';
import CreateScheduleClient from './CreateScheduleClient';

export const runtime = 'edge';

type PageProps = {
    params: {
        id: string;
    };
};

export default function CreateSchedule({ params }: PageProps) {
    const { id } = params;
    const router = useRouter();
    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // プランが存在するか確認
        const planData = getHolidayPlanById(id);
        if (planData) {
            setIsValid(true);
        } else {
            // 存在しないプランの場合はホームに戻る
            router.push('/');
        }
        setIsLoading(false);
    }, [id, router]);

    if (isLoading) {
        return <div>読み込み中...</div>;
    }

    if (!isValid) {
        return <div>プランが見つかりませんでした</div>;
    }

    return <CreateScheduleClient planId={id} />;
} 