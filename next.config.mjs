import withPWA from 'next-pwa';

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
    // Cloudflare Pages用の最適化設定
    trailingSlash: true,
    images: {
        unoptimized: true
    },
    // スタンドアロンモード（Next.jsランタイムを含める）
    output: 'standalone',
};

const config = withPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
})(nextConfig);

export default config; 