'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// 静的モードで動作するように変更
// export const runtime = 'edge';

// 型定義
type PageProps = {
    params: {
        id: string;
    };
};

// クライアントコンポーネントを動的インポート（SSRを無効化）
const CreateScheduleClientWrapper = dynamic(() => import('./CreateScheduleClientWrapper'), {
    ssr: false,
});

// ローディングフォールバックコンポーネント
const LoadingFallback = () => (
    <div className="py-6 flex justify-center">読み込み中...</div>
);

export default function CreateSchedulePage({ params }: PageProps) {
    const { id } = params;

    return (
        <Suspense fallback={<LoadingFallback />}>
            <CreateScheduleClientWrapper planId={id} />
        </Suspense>
    );
}
