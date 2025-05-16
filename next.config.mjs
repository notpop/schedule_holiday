import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    typescript: {
        // ビルド時の型チェックエラーを警告として扱い、ビルドを成功させる
        ignoreBuildErrors: true,
    },
};

const config = withPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
})(nextConfig);

export default config; 