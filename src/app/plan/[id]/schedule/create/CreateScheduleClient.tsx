'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { addSchedule } from '@/utils/storage';
import { generateId, generateTimeSlots } from '@/utils/helpers';

interface CreateScheduleClientProps {
    planId: string;
}

export default function CreateScheduleClient({ planId }: CreateScheduleClientProps) {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [startTime, setStartTime] = useState('00:00');
    const [endTime, setEndTime] = useState('00:10');
    const [memo, setMemo] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 10分間隔のタイムスロットを生成
    const timeSlots = generateTimeSlots(10);

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

        // 新しいスケジュールを作成
        const newSchedule = {
            id: generateId(),
            date: '', // プランの日付を使用するためここでは空欄
            title: title.trim(),
            startTime,
            endTime,
            memo: memo.trim(),
        };

        // LocalStorageに保存
        addSchedule(planId, newSchedule);

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
                    className="mr-4 p-2 rounded-full hover:bg-accent/10 transition-colors"
                    aria-label="戻る"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-2xl font-bold text-[#67A599]">予定を追加</h1>
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
                        placeholder="例: ジョギング、読書、買い物など"
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
                        placeholder="メモを入力"
                        className="w-full px-4 py-3 h-32 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                </div>

                <motion.button
                    type="submit"
                    className="w-full py-3 bg-[#67A599] text-white rounded-xl font-medium shadow-md hover:shadow-lg"
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? '作成中...' : '予定を追加'}
                </motion.button>
            </motion.form>
        </Container>
    );
} 