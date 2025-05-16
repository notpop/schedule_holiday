'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { addHolidayPlan } from '@/utils/storage';
import { generateId, getTodayString } from '@/utils/helpers';
import { useNavigation } from '@/utils/navigation-context';
import { PageTransition } from '@/components/PageTransition';

export default function CreatePlanClient() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(getTodayString());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { setDirection } = useNavigation();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            alert('タイトルを入力してください');
            return;
        }

        setIsSubmitting(true);

        try {
            const newPlan = {
                id: generateId(),
                title: title.trim(),
                date,
                schedules: []
            };

            addHolidayPlan(newPlan);

            setTimeout(() => {
                router.push(`/plan/${newPlan.id}`);
            }, 300);
        } catch (error) {
            console.error('プラン作成中にエラーが発生しました:', error);
            setIsSubmitting(false);
            alert('プランの保存中にエラーが発生しました。もう一度お試しください。');
        }
    };

    return (
        <Container className="py-6">
            <PageTransition className="mb-6 flex items-center">
                <motion.button
                    onClick={() => {
                        setDirection('backward');
                        router.back();
                    }}
                    className="mr-4 p-2 rounded-full hover:bg-secondary/50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </motion.button>
                <h1 className="text-2xl font-bold text-[#67A599]">新しい休日プラン</h1>
            </PageTransition>

            <PageTransition delay={0.1} className="space-y-6">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
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
                            className="w-full py-3 bg-[#67A599] text-white rounded-lg font-medium shadow-md hover:bg-[#67A599]/90"
                            whileHover={{ scale: 1.01, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? '作成中...' : '休日プランを作成'}
                        </motion.button>
                    </div>
                </form>
            </PageTransition>
        </Container>
    );
} 