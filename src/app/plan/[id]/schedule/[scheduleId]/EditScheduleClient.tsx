'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Schedule } from '@/types';
import { updateSchedule } from '@/utils/storage';
import { generateTimeSlots } from '@/utils/helpers';

interface EditScheduleClientProps {
    planId: string;
    schedule: Schedule;
}

export default function EditScheduleClient({ planId, schedule }: EditScheduleClientProps) {
    const router = useRouter();
    const [title, setTitle] = useState(schedule.title);
    const [startTime, setStartTime] = useState(schedule.startTime);
    const [endTime, setEndTime] = useState(schedule.endTime);
    const [memo, setMemo] = useState(schedule.memo);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 30分間隔のタイムスロットを生成
    const timeSlots = generateTimeSlots(30);

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

        // スケジュールを更新
        const updatedSchedule = {
            ...schedule,
            title: title.trim(),
            startTime,
            endTime,
            memo: memo.trim(),
        };

        // LocalStorageに保存
        updateSchedule(planId, updatedSchedule);

        // プラン詳細ページに戻る
        setTimeout(() => {
            router.push(`/plan/${planId}`);
        }, 300);
    };

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