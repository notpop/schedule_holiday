'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { addHolidayPlan } from '@/utils/storage';
import { generateId, getTodayString } from '@/utils/helpers';

export default function CreatePlan() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(getTodayString());
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            alert('タイトルを入力してください');
            return;
        }

        setIsSubmitting(true);

        // 新しい休日プランを作成
        const newPlan = {
            id: generateId(),
            title: title.trim(),
            date,
            schedules: []
        };

        // LocalStorageに保存
        addHolidayPlan(newPlan);

        // 計画詳細ページに遷移
        setTimeout(() => {
            router.push(`/plan/${newPlan.id}`);
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
                <h1 className="text-2xl font-bold">新しい休日プラン</h1>
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
                        placeholder="例: GW、夏休み、誕生日など"
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        autoFocus
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="date" className="block text-sm font-medium text-muted-foreground">
                        日付
                    </label>
                    <input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <motion.button
                    type="submit"
                    className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-md"
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? '作成中...' : '休日プランを作成'}
                </motion.button>
            </motion.form>
        </Container>
    );
} 