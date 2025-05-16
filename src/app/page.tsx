'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { HolidayPlan } from '@/types';
import { getHolidayPlans } from '@/utils/storage';
import { formatDate, isPastDate, isCurrentDate, isFutureDate } from '@/utils/helpers';
import { Container } from '@/components/ui/Container';

export default function Home() {
  const [plans, setPlans] = useState<HolidayPlan[]>([]);
  const [currentDateTime, setCurrentDateTime] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    // 現在の日時を設定
    const now = new Date();
    setCurrentDateTime(now.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }));

    // LocalStorageからデータを取得
    const storedPlans = getHolidayPlans();

    // 日付順にソート
    const sortedPlans = [...storedPlans].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    setPlans(sortedPlans);
  }, []);

  // 未来と今日のプラン
  const upcomingPlans = plans.filter(plan => isFutureDate(plan.date) || isCurrentDate(plan.date));

  // 過去のプラン
  const pastPlans = plans.filter(plan => isPastDate(plan.date));

  return (
    <Container className="py-6 flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-2"
      >
        <h1 className="text-2xl font-bold mb-1">休日スケジュール</h1>
        <p className="text-sm text-muted-foreground mb-4">{currentDateTime}</p>
      </motion.div>

      {plans.length === 0 ? (
        <motion.div
          className="flex flex-col items-center justify-center h-[60vh] text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="text-6xl mb-4">📅</div>
          <p className="text-lg mb-6 text-muted-foreground">
            休日プランがまだありません
          </p>
          <motion.button
            className="bg-primary text-primary-foreground py-3 px-8 rounded-full font-medium shadow-md border border-primary/20 hover:bg-primary/90 flex items-center gap-2"
            onClick={() => router.push('/create')}
            whileTap={{ scale: 0.95 }}
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            新しい休日プランを作成
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {upcomingPlans.length > 0 && (
            <div>
              <h2 className="text-lg font-medium mb-3">今後の休日</h2>
              <div className="space-y-3">
                {upcomingPlans.map((plan, index) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link href={`/plan/${plan.id}`}>
                      <div className="bg-secondary rounded-lg p-5 shadow-sm hover:shadow-md transition-all border border-secondary/50 relative">
                        <div className="pr-4">
                          <h2 className="text-lg font-semibold">{plan.title}</h2>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(plan.date)}
                          </p>
                          <div className="mt-2 text-sm">
                            {plan.schedules.length === 0 ? (
                              <p className="text-muted-foreground">予定なし</p>
                            ) : (
                              <p>{plan.schedules.length}個の予定</p>
                            )}
                          </div>
                        </div>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {pastPlans.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-medium mb-3 text-muted-foreground">過去の休日</h2>
              <div className="space-y-3">
                {pastPlans.map((plan, index) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 0.7, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link href={`/plan/${plan.id}`}>
                      <div className="bg-secondary/50 rounded-lg p-5 shadow-sm hover:shadow-md transition-all border border-secondary/30 opacity-75">
                        <h2 className="text-lg font-semibold text-muted-foreground">{plan.title}</h2>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(plan.date)}
                        </p>
                        <div className="mt-2 text-sm text-muted-foreground">
                          {plan.schedules.length === 0 ? (
                            <p>予定なし</p>
                          ) : (
                            <p>{plan.schedules.length}個の予定</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <motion.div
            className="fixed bottom-6 right-6"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            <motion.button
              onClick={() => router.push('/create')}
              className="bg-primary text-primary-foreground w-14 h-14 rounded-full flex items-center justify-center shadow-lg border border-primary/20"
              whileHover={{ scale: 1.1, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </motion.button>
          </motion.div>
        </div>
      )}
    </Container>
  );
}
