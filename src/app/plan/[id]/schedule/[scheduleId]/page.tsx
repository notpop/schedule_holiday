'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// 静的モードで動作するように変更
// export const runtime = 'edge';

// 型定義
type PageProps = {
    params: {
        id: string;
        scheduleId: string;
    };
};

// クライアントコンポーネントを動的インポート（SSRを無効化）
const EditScheduleClientWrapper = dynamic(() => import('./EditScheduleClientWrapper'), {
    ssr: false,
});

// ローディングフォールバックコンポーネント
const LoadingFallback = () => (
    <div className="py-6 flex justify-center">読み込み中...</div>
);

export default function EditSchedulePage({ params }: PageProps) {
    const { id, scheduleId } = params;

    return (
        <Suspense fallback={<LoadingFallback />}>
            <EditScheduleClientWrapper planId={id} scheduleId={scheduleId} />
        </Suspense>
    );
}
