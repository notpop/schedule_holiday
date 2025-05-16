'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { HolidayPlan } from '@/types';
import { getHolidayPlans, deleteHolidayPlan } from '@/utils/storage';
import { formatDate, isPastDate, isCurrentDate, isFutureDate } from '@/utils/helpers';
import { Container } from '@/components/ui/Container';
import { useNavigation } from '@/utils/navigation-context';
import { PageTransition } from '@/components/PageTransition';

export default function Home() {
  const [plans, setPlans] = useState<HolidayPlan[]>([]);
  const [currentDateTime, setCurrentDateTime] = useState<string>('');
  const [activeSwipe, setActiveSwipe] = useState<string | null>(null);
  const router = useRouter();
  const { setDirection } = useNavigation();

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

  // スワイプ処理
  const handleSwipe = (planId: string, info: PanInfo) => {
    // スワイプが十分に長い場合のみ処理（誤クリック防止）
    if (info.offset.x < -80 && Math.abs(info.offset.y) < 30) {
      setActiveSwipe(planId);
    } else {
      setActiveSwipe(null);
    }
  };

  const handleDeletePlan = (planId: string) => {
    deleteHolidayPlan(planId);
    setPlans(prevPlans => prevPlans.filter(plan => plan.id !== planId));
    setActiveSwipe(null);
  };

  const handleNavigateToPlan = (planId: string) => {
    // スワイプ中は画面遷移しない
    if (activeSwipe === null) {
      setDirection('forward');
      router.push(`/plan/${planId}`);
    }
  };

  // 未来と今日のプラン
  const upcomingPlans = plans.filter(plan => isFutureDate(plan.date) || isCurrentDate(plan.date));

  // 過去のプラン
  const pastPlans = plans.filter(plan => isPastDate(plan.date));

  return (
    <Container className="py-6 flex flex-col">
      <PageTransition className="mb-2">
        <h1 className="text-3xl font-bold mb-1 text-[#67A599]">休日スケジュール</h1>
        <p className="text-sm text-muted-foreground mb-4">{currentDateTime}</p>
      </PageTransition>

      {/* スワイプのヒント表示 */}
      {plans.length > 0 && (
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
      )}

      {plans.length === 0 ? (
        <PageTransition delay={0.2} className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="text-6xl mb-4">📅</div>
          <p className="text-lg mb-6 text-muted-foreground">
            休日プランがまだありません
          </p>
          <motion.button
            className="bg-[#67A599] text-white py-4 px-8 rounded-full font-medium shadow-lg border-none hover:opacity-90 flex items-center gap-2"
            onClick={() => {
              setDirection('forward');
              router.push('/create');
            }}
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
        </PageTransition>
      ) : (
        <div className="space-y-4">
          {upcomingPlans.length > 0 && (
            <div>
              <h2 className="text-xl font-medium mb-3 text-[#67A599]">今後の休日</h2>
              <AnimatePresence>
                <div className="space-y-3">
                  {upcomingPlans.map((plan, index) => (
                    <PlanItem
                      key={plan.id}
                      plan={plan}
                      index={index}
                      isPast={false}
                      onSwipe={handleSwipe}
                      onDelete={handleDeletePlan}
                      onNavigate={handleNavigateToPlan}
                      isActiveSwipe={activeSwipe === plan.id}
                    />
                  ))}
                </div>
              </AnimatePresence>
            </div>
          )}

          {pastPlans.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-medium mb-3 text-[#C17C74]">過去の休日</h2>
              <AnimatePresence>
                <div className="space-y-3">
                  {pastPlans.map((plan, index) => (
                    <PlanItem
                      key={plan.id}
                      plan={plan}
                      index={index}
                      isPast={true}
                      onSwipe={handleSwipe}
                      onDelete={handleDeletePlan}
                      onNavigate={handleNavigateToPlan}
                      isActiveSwipe={activeSwipe === plan.id}
                    />
                  ))}
                </div>
              </AnimatePresence>
            </div>
          )}
        </div>
      )}

      {/* フローティング追加ボタン - 条件分岐の外に移動 */}
      {plans.length > 0 && (
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          <motion.button
            onClick={() => {
              setDirection('forward');
              router.push('/create');
            }}
            className="bg-[#67A599] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-none"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            aria-label="新しい休日プランを作成"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </motion.button>
        </motion.div>
      )}
    </Container>
  );
}

interface PlanItemProps {
  plan: HolidayPlan;
  index: number;
  isPast: boolean;
  onSwipe: (id: string, info: PanInfo) => void;
  onDelete: (id: string) => void;
  onNavigate: (id: string) => void;
  isActiveSwipe: boolean;
}

function PlanItem({ plan, index, isPast, onSwipe, onDelete, onNavigate, isActiveSwipe }: PlanItemProps) {
  // 共通のカラー
  const bgColor = isPast ? 'bg-secondary/70' : 'bg-[#67A599]';

  // 最初の予定を取得（あれば）
  const firstSchedule = plan.schedules.length > 0
    ? plan.schedules.sort((a, b) => {
      const [aHours, aMinutes] = a.startTime.split(':').map(Number);
      const [bHours, bMinutes] = b.startTime.split(':').map(Number);
      return (aHours * 60 + aMinutes) - (bHours * 60 + bMinutes);
    })[0]
    : null;

  return (
    <PageTransition
      delay={0.1 * index}
      className="relative overflow-hidden rounded-2xl"
    >
      {/* スワイプ可能なコンテナ */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={(_, info) => onSwipe(plan.id, info)}
        className="relative"
        layout
      >
        {/* プラン表示 */}
        <div
          onClick={() => onNavigate(plan.id)}
          className={`w-full p-5 ${bgColor} text-white rounded-2xl border-none transition-all cursor-pointer shadow-md hover:shadow-lg`}
        >
          <div className="pr-4">
            <h2 className="text-lg font-semibold">{plan.title}</h2>
            <p className="text-sm opacity-90">
              {formatDate(plan.date)}
            </p>
            <div className="mt-2 text-sm">
              {plan.schedules.length === 0 ? (
                <p className="opacity-80">予定なし</p>
              ) : firstSchedule ? (
                <div>
                  <p className="font-medium">{firstSchedule.title} {firstSchedule.startTime}～</p>
                  <p className="opacity-80">{plan.schedules.length > 1 ? `他${plan.schedules.length - 1}件の予定` : ''}</p>
                </div>
              ) : (
                <p>{plan.schedules.length}個の予定</p>
              )}
            </div>
          </div>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
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
          onClick={() => onDelete(plan.id)}
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
