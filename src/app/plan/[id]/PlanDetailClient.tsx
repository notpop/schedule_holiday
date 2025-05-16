'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { HolidayPlan, Schedule } from '@/types';
import { deleteSchedule } from '@/utils/storage';
import { formatDate, getCurrentTimeString } from '@/utils/helpers';
import { useNavigation } from '@/utils/navigation-context';
import { PageTransition } from '@/components/PageTransition';

interface PlanDetailClientProps {
    plan: HolidayPlan;
    id: string;
}

export default function PlanDetailClient({ plan, id }: PlanDetailClientProps) {
    const router = useRouter();
    const [planData, setPlanData] = useState<HolidayPlan>(plan);
    const [now] = useState(new Date());
    const [activeSwipe, setActiveSwipe] = useState<string | null>(null);
    const { setDirection } = useNavigation();

    const sortSchedulesByTime = (schedules: Schedule[]) => {
        const planDate = new Date(planData.date);
        const currentAndFuture: Schedule[] = [];
        const past: Schedule[] = [];

        schedules.forEach(schedule => {
            const scheduleDate = new Date(planDate);
            const [endHours, endMinutes] = schedule.endTime.split(':').map(Number);
            scheduleDate.setHours(endHours, endMinutes, 0, 0);

            if (scheduleDate < now) {
                past.push(schedule);
            } else {
                currentAndFuture.push(schedule);
            }
        });

        // 時間順にソート
        currentAndFuture.sort((a, b) => {
            const [aHours, aMinutes] = a.startTime.split(':').map(Number);
            const [bHours, bMinutes] = b.startTime.split(':').map(Number);
            return (aHours * 60 + aMinutes) - (bHours * 60 + bMinutes);
        });

        past.sort((a, b) => {
            const [aHours, aMinutes] = a.startTime.split(':').map(Number);
            const [bHours, bMinutes] = b.startTime.split(':').map(Number);
            return (aHours * 60 + aMinutes) - (bHours * 60 + bMinutes);
        });

        return { currentAndFuture, past };
    };

    // スワイプ処理
    const handleSwipe = (scheduleId: string, info: PanInfo) => {
        // スワイプが十分に長い場合のみ処理（誤クリック防止）
        if (info.offset.x < -80 && Math.abs(info.offset.y) < 30) {
            setActiveSwipe(scheduleId);
        } else {
            setActiveSwipe(null);
        }
    };

    const handleDeleteSchedule = (scheduleId: string) => {
        deleteSchedule(planData.id, scheduleId);
        setPlanData({
            ...planData,
            schedules: planData.schedules.filter(s => s.id !== scheduleId)
        });
        setActiveSwipe(null);
    };

    const handleNavigateToSchedule = (scheduleId: string) => {
        // スワイプ中は画面遷移しない
        if (activeSwipe === null) {
            setDirection('forward');
            router.push(`/plan/${id}/schedule/${scheduleId}`);
        }
    };

    const handleBack = () => {
        setDirection('backward');
        router.push('/');
    };

    const { currentAndFuture, past } = sortSchedulesByTime(planData.schedules);

    return (
        <Container className="py-6 pb-24">
            {/* ヘッダー */}
            <PageTransition className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                        <button
                            onClick={handleBack}
                            className="mr-4 p-2 rounded-full hover:bg-accent/10 transition-colors"
                            aria-label="戻る"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-3xl font-bold text-[#67A599]">{planData.title}</h1>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground">{formatDate(planData.date, 'yyyy年MM月dd日 EEEE')} {getCurrentTimeString()}</p>
            </PageTransition>

            {/* スワイプのヒント表示 */}
            <motion.div
                className="mb-5 text-center text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <div className="bg-secondary/40 py-2 px-4 rounded-full inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="M14 9l-6 6 6 6" />
                    </svg>
                    <p>左にスワイプして削除</p>
                </div>
            </motion.div>

            {/* スケジュールリスト */}
            <div className="space-y-6 mb-20">
                {currentAndFuture.length === 0 && past.length === 0 ? (
                    <PageTransition className="text-center py-12">
                        <p className="text-muted-foreground">予定がまだありません</p>
                    </PageTransition>
                ) : (
                    <>
                        {/* 現在/未来の予定 */}
                        {currentAndFuture.length > 0 && (
                            <div>
                                <h2 className="text-xl font-medium mb-3 text-[#67A599]">予定</h2>
                                <AnimatePresence>
                                    <div className="space-y-3">
                                        {currentAndFuture.map((schedule) => (
                                            <ScheduleItem
                                                key={schedule.id}
                                                schedule={schedule}
                                                isPast={false}
                                                onDelete={handleDeleteSchedule}
                                                onSwipe={handleSwipe}
                                                isActiveSwipe={activeSwipe === schedule.id}
                                                onNavigate={handleNavigateToSchedule}
                                                planDate={planData.date}
                                            />
                                        ))}
                                    </div>
                                </AnimatePresence>
                            </div>
                        )}

                        {/* 過去の予定 */}
                        {past.length > 0 && (
                            <div className="mt-8">
                                <h2 className="text-xl font-medium mb-3 text-[#C17C74]">過去の予定</h2>
                                <AnimatePresence>
                                    <div className="space-y-3">
                                        {past.map((schedule) => (
                                            <ScheduleItem
                                                key={schedule.id}
                                                schedule={schedule}
                                                isPast={true}
                                                onDelete={handleDeleteSchedule}
                                                onSwipe={handleSwipe}
                                                isActiveSwipe={activeSwipe === schedule.id}
                                                onNavigate={handleNavigateToSchedule}
                                                planDate={planData.date}
                                            />
                                        ))}
                                    </div>
                                </AnimatePresence>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* フローティング追加ボタン */}
            <motion.div
                className="fixed bottom-6 right-6 z-50"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
            >
                <motion.button
                    onClick={() => {
                        setDirection('forward');
                        router.push(`/plan/${id}/schedule/create`);
                    }}
                    className="bg-[#67A599] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-none"
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="予定を追加"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </motion.button>
            </motion.div>
        </Container>
    );
}

// スケジュールアイテムを別コンポーネントとして分離
interface ScheduleItemProps {
    schedule: Schedule;
    isPast: boolean;
    onDelete: (id: string) => void;
    onSwipe: (id: string, info: PanInfo) => void;
    isActiveSwipe: boolean;
    onNavigate: (id: string) => void;
    planDate: string;
}

function ScheduleItem({ schedule, isPast, onDelete, onSwipe, isActiveSwipe, onNavigate, planDate }: ScheduleItemProps) {
    // ビンテージカラーを設定
    const itemColors = {
        bg: isPast ? 'bg-secondary/70' : 'bg-[#67A599]',
        text: 'text-white'
    };

    return (
        <PageTransition className="relative overflow-hidden rounded-2xl">
            {/* スワイプ可能なコンテナ */}
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                onDragEnd={(_, info) => onSwipe(schedule.id, info)}
                className="relative"
                layout
            >
                {/* スケジュールボタン */}
                <div
                    onClick={() => onNavigate(schedule.id)}
                    className={`w-full p-4 ${itemColors.bg} ${itemColors.text} rounded-2xl border-none transition-all text-left cursor-pointer shadow-md hover:shadow-lg`}
                >
                    <div>
                        <h3 className="font-medium">{schedule.title}</h3>
                        <p className="text-sm opacity-90 mt-1 font-medium">
                            {formatDate(planDate, 'yyyy年MM月dd日')} {schedule.startTime} - {schedule.endTime}
                        </p>
                        {schedule.memo && (
                            <p className="text-sm opacity-80 mt-2">{schedule.memo}</p>
                        )}
                    </div>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-90">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </div>
                </div>
            </motion.div>

            {/* 削除ボタン（スワイプで表示） */}
            <motion.div
                className="absolute top-0 right-0 h-full flex items-center"
                initial={{ opacity: 0, width: 0 }}
                animate={{
                    opacity: isActiveSwipe ? 1 : 0,
                    width: isActiveSwipe ? 80 : 0
                }}
                transition={{ duration: 0.2 }}
            >
                <button
                    onClick={() => onDelete(schedule.id)}
                    className="h-full w-full bg-[#C17C74] flex items-center justify-center text-white rounded-r-2xl"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                    <span className="ml-1">削除</span>
                </button>
            </motion.div>
        </PageTransition>
    );
} 