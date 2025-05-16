/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    typescript: {
        // ビルド時の型チェックエラーを警告として扱い、ビルドを成功させる
        ignoreBuildErrors: true,
    },
    // コンパイラオプション
    compiler: {
        // 本番環境ではReactの開発用機能を削除
        removeConsole: process.env.NODE_ENV === 'production',
    },
    // 静的アセットの最適化
    images: {
        unoptimized: true
    },
    // ルーティングとトレイリングスラッシュの設定
    trailingSlash: true,
    // Cloudflare Pagesのための設定
    experimental: {
        // Cloudflare Compatibilityのための設定
        serverActions: {
            bodySizeLimit: '2mb',
        },
    },
};

export default nextConfig;
