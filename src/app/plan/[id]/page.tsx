'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getHolidayPlanById } from '@/utils/storage';
import PlanDetailClient from './PlanDetailClient';
import { HolidayPlan } from '@/types';

export const runtime = 'edge';

type PageProps = {
    params: {
        id: string;
    };
};

export default function PlanDetail({ params }: PageProps) {
    const id = params.id;
    const router = useRouter();
    const [plan, setPlan] = useState<HolidayPlan | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const planData = getHolidayPlanById(id);
        if (planData) {
            setPlan(planData);
        } else {
            router.push('/');
        }
        setIsLoading(false);
    }, [id, router]);

    if (isLoading) {
        return <div>読み込み中...</div>;
    }

    if (!plan) {
        return <div>プランが見つかりませんでした</div>;
    }

    return <PlanDetailClient plan={plan} id={id} />;
} 