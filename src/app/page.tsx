'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { HolidayPlan } from '@/types';
import { getHolidayPlans } from '@/utils/storage';
import { formatDate } from '@/utils/helpers';
import { Container } from '@/components/ui/Container';

export default function Home() {
  const [plans, setPlans] = useState<HolidayPlan[]>([]);
  const router = useRouter();

  useEffect(() => {
    // LocalStorageからデータを取得
    const storedPlans = getHolidayPlans();
    setPlans(storedPlans);
  }, []);

  return (
    <Container className="py-6 flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold mb-6">休日スケジュール</h1>
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
            className="bg-primary text-primary-foreground py-3 px-6 rounded-full font-medium shadow-md"
            onClick={() => router.push('/create')}
            whileTap={{ scale: 0.95 }}
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
          >
            新しい休日プランを作成
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.3 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href={`/plan/${plan.id}`}>
                <div className="bg-secondary rounded-xl p-4 shadow-sm">
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
              </Link>
            </motion.div>
          ))}

          <motion.div
            className="fixed bottom-6 right-6"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            <button
              onClick={() => router.push('/create')}
              className="bg-primary text-primary-foreground w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </motion.div>
        </div>
      )}
    </Container>
  );
}
