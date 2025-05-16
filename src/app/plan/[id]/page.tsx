'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { HolidayPlan } from '@/types';
import {
    getHolidayPlanById,
    deleteHolidayPlan,
    deleteSchedule
} from '@/utils/storage';
import {
    formatDate,
    formatTimeRange,
    compareTimeStrings
} from '@/utils/helpers';

type PageProps = {
    params: {
        id: string;
    };
};

export default function PlanDetail({ params }: PageProps) {
    const router = useRouter();
    const [plan, setPlan] = useState<HolidayPlan | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        // プランデータの取得
        const planData = getHolidayPlanById(params.id);

        if (planData) {
            // スケジュールを時間順でソート
            const sortedSchedules = [...planData.schedules].sort((a, b) =>
                compareTimeStrings(a.startTime, b.startTime)
            );

            setPlan({
                ...planData,
                schedules: sortedSchedules
            });
        } else {
            // 存在しないプランの場合はホームに戻る
            router.push('/');
        }

        setIsLoading(false);
    }, [params.id, router]);

    // スケジュールの削除
    const handleDeleteSchedule = (scheduleId: string) => {
        if (!plan) return;

        // 確認ダイアログを表示
        if (deleteConfirm !== scheduleId) {
            setDeleteConfirm(scheduleId);
            return;
        }

        // 削除処理
        deleteSchedule(plan.id, scheduleId);

        // 状態を更新
        const updatedSchedules = plan.schedules.filter(s => s.id !== scheduleId);

        setPlan({
            ...plan,
            schedules: updatedSchedules
        });

        setDeleteConfirm(null);
    };

    // プラン全体の削除
    const handleDeletePlan = () => {
        if (!plan) return;

        if (deleteConfirm !== 'plan') {
            setDeleteConfirm('plan');
            return;
        }

        deleteHolidayPlan(plan.id);
        router.push('/');
    };

    if (isLoading) {
        return (
            <Container className="py-6 flex justify-center items-center h-screen">
                <div className="animate-pulse">読み込み中...</div>
            </Container>
        );
    }

    if (!plan) {
        return (
            <Container className="py-6">
                <div>プランが見つかりませんでした</div>
            </Container>
        );
    }

    return (
        <Container className="py-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-6"
            >
                <div className="flex items-center mb-4">
                    <button
                        onClick={() => router.back()}
                        className="mr-4 p-2 rounded-full"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-2xl font-bold flex-1">{plan.title}</h1>
                    <button
                        onClick={handleDeletePlan}
                        className={`p-2 rounded-full ${deleteConfirm === 'plan' ? 'text-accent' : 'text-muted-foreground'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                    </button>
                </div>
                <p className="text-muted-foreground">{formatDate(plan.date)}</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium">スケジュール</h2>
                    <motion.button
                        onClick={() => router.push(`/plan/${plan.id}/schedule/create`)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-full"
                    >
                        予定を追加
                    </motion.button>
                </div>

                {plan.schedules.length === 0 ? (
                    <motion.div
                        className="text-center py-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <p className="text-muted-foreground mb-4">
                            予定がまだありません
                        </p>
                        <motion.button
                            onClick={() => router.push(`/plan/${plan.id}/schedule/create`)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-md"
                        >
                            最初の予定を追加
                        </motion.button>
                    </motion.div>
                ) : (
                    <div className="space-y-3">
                        <AnimatePresence>
                            {plan.schedules.map((schedule, index) => (
                                <motion.div
                                    key={schedule.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ delay: index * 0.05, duration: 0.2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-secondary rounded-xl p-4 relative"
                                    onClick={() => router.push(`/plan/${plan.id}/schedule/${schedule.id}`)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium">{schedule.title}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {formatTimeRange(schedule.startTime, schedule.endTime)}
                                            </p>
                                            {schedule.memo && (
                                                <p className="text-sm mt-2 line-clamp-2">{schedule.memo}</p>
                                            )}
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteSchedule(schedule.id);
                                            }}
                                            className={`p-2 rounded-full ${deleteConfirm === schedule.id ? 'text-accent' : 'text-muted-foreground'}`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                            </svg>
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </motion.div>
        </Container>
    );
} 