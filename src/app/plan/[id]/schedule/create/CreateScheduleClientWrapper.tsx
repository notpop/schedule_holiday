'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getHolidayPlanById } from '@/utils/storage';
import CreateScheduleClient from './CreateScheduleClient';

interface CreateScheduleClientWrapperProps {
    planId: string;
}

export default function CreateScheduleClientWrapper({ planId }: CreateScheduleClientWrapperProps) {
    const router = useRouter();
    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // クライアントサイドでのみlocalStorageにアクセス
        try {
            // プランが存在するか確認
            const planData = getHolidayPlanById(planId);
            if (planData) {
                setIsValid(true);
            } else {
                // 存在しないプランの場合はホームに戻る
                router.push('/');
            }
        } catch (error) {
            console.error('プランの読み込み中にエラーが発生しました:', error);
            router.push('/');
        } finally {
            setIsLoading(false);
        }
    }, [planId, router]);

    if (isLoading) {
        return <div>読み込み中...</div>;
    }

    if (!isValid) {
        return <div>プランが見つかりませんでした</div>;
    }

    return <CreateScheduleClient planId={planId} />;
} 