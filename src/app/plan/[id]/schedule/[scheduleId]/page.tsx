'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Schedule } from '@/types';
import { getHolidayPlanById, updateSchedule, deleteSchedule } from '@/utils/storage';
import { generateTimeSlots } from '@/utils/helpers';

type PageProps = {
    params: {
        id: string;
        scheduleId: string;
    };
};

export default function EditSchedule({ params }: PageProps) {
    const router = useRouter();
    const [schedule, setSchedule] = useState<Schedule | null>(null);
    const [title, setTitle] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [memo, setMemo] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // 30分間隔のタイムスロットを生成
    const timeSlots = generateTimeSlots(30);

    useEffect(() => {
        // プランとスケジュールデータの取得
        const planData = getHolidayPlanById(params.id);

        if (planData) {
            const scheduleData = planData.schedules.find(s => s.id === params.scheduleId);

            if (scheduleData) {
                setSchedule(scheduleData);
                setTitle(scheduleData.title);
                setStartTime(scheduleData.startTime);
                setEndTime(scheduleData.endTime);
                setMemo(scheduleData.memo);
            } else {
                // 存在しないスケジュールの場合はプラン詳細に戻る
                router.push(`/plan/${params.id}`);
            }
        } else {
            // 存在しないプランの場合はホームに戻る
            router.push('/');
        }

        setIsLoading(false);
    }, [params.id, params.scheduleId, router]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            alert('タイトルを入力してください');
            return;
        }

        // 開始時間と終了時間のバリデーション
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        const startMinutes = startHour * 60 + startMinute;
        const endMinutes = endHour * 60 + endMinute;

        if (startMinutes >= endMinutes) {
            alert('終了時間は開始時間より後に設定してください');
            return;
        }

        setIsSubmitting(true);

        if (schedule) {
            // スケジュールを更新
            const updatedSchedule = {
                ...schedule,
                title: title.trim(),
                startTime,
                endTime,
                memo: memo.trim(),
            };

            // LocalStorageに保存
            updateSchedule(params.id, updatedSchedule);

            // プラン詳細ページに戻る
            setTimeout(() => {
                router.push(`/plan/${params.id}`);
            }, 300);
        }
    };

    const handleDelete = () => {
        if (showDeleteConfirm) {
            // 削除処理
            deleteSchedule(params.id, params.scheduleId);

            // プラン詳細ページに戻る
            router.push(`/plan/${params.id}`);
        } else {
            // 確認ダイアログを表示
            setShowDeleteConfirm(true);
        }
    };

    if (isLoading) {
        return (
            <Container className="py-6 flex justify-center items-center h-screen">
                <div className="animate-pulse">読み込み中...</div>
            </Container>
        );
    }

    if (!schedule) {
        return (
            <Container className="py-6">
                <div>スケジュールが見つかりませんでした</div>
            </Container>
        );
    }

    return (
        <Container className="py-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-6 flex items-center"
            >
                <button
                    onClick={() => router.back()}
                    className="mr-4 p-2 rounded-full"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-2xl font-bold flex-1">予定を編集</h1>
                <button
                    onClick={handleDelete}
                    className={`p-2 rounded-full ${showDeleteConfirm ? 'text-accent' : 'text-muted-foreground'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                </button>
            </motion.div>

            <motion.form
                onSubmit={handleSubmit}
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
            >
                <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium text-muted-foreground">
                        タイトル
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        autoFocus
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="startTime" className="block text-sm font-medium text-muted-foreground">
                            開始時間
                        </label>
                        <select
                            id="startTime"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            {timeSlots.map((time) => (
                                <option key={`start-${time}`} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="endTime" className="block text-sm font-medium text-muted-foreground">
                            終了時間
                        </label>
                        <select
                            id="endTime"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            {timeSlots.map((time) => (
                                <option key={`end-${time}`} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="memo" className="block text-sm font-medium text-muted-foreground">
                        メモ（任意）
                    </label>
                    <textarea
                        id="memo"
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                        className="w-full px-4 py-3 h-32 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                </div>

                <motion.button
                    type="submit"
                    className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-md"
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? '更新中...' : '予定を更新'}
                </motion.button>
            </motion.form>
        </Container>
    );
} 