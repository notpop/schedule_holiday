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
const PlanDetailClientWrapper = dynamic(() => import('./PlanDetailClientWrapper'), {
    ssr: false,
});

// ローディングフォールバックコンポーネント
const LoadingFallback = () => (
    <div className="py-6 flex justify-center">読み込み中...</div>
);

export default function PlanPage({ params }: PageProps) {
    const { id } = params;

    return (
        <Suspense fallback={<LoadingFallback />}>
            <PlanDetailClientWrapper id={id} />
        </Suspense>
    );
}
