'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getHolidayPlanById } from '@/utils/storage';
import PlanDetailClient from './PlanDetailClient';
import { HolidayPlan } from '@/types';

interface PlanDetailClientWrapperProps {
    id: string;
}

export default function PlanDetailClientWrapper({ id }: PlanDetailClientWrapperProps) {
    const router = useRouter();
    const [plan, setPlan] = useState<HolidayPlan | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // クライアントサイドでのみlocalStorageにアクセス
        try {
            const planData = getHolidayPlanById(id);
            if (planData) {
                setPlan(planData);
            } else {
                router.push('/');
            }
        } catch (error) {
            console.error('プランの読み込み中にエラーが発生しました:', error);
            router.push('/');
        } finally {
            setIsLoading(false);
        }
    }, [id, router]);

    if (isLoading) {
        return <div>読み込み中...</div>;
    }

    if (!plan) {
        return <div>プランが見つかりませんでした</div>;
    }

    return <PlanDetailClient plan={plan} id={id} />;
} 