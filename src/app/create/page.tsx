'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Container } from '@/components/ui/Container';

// 静的モードで動作するように変更
// export const runtime = 'edge';

// クライアントコンポーネントを動的インポート（SSRを無効化）
const CreatePlanClient = dynamic(() => import('./CreatePlanClient'), {
    ssr: false,
});

// ローディングフォールバックコンポーネント
const LoadingFallback = () => (
    <Container className="py-6 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
            <div className="text-2xl mb-4">読み込み中...</div>
        </div>
    </Container>
);

export default function CreatePlanPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <CreatePlanClient />
        </Suspense>
    );
}
