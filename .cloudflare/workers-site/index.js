import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

/**
 * The DEBUG flag will do two things that help during development:
 * 1. we will skip caching on the edge, which makes it easier to
 *    debug.
 * 2. we will return more detailed error messages to the client
 *    when they happen.
 */
const DEBUG = false

/**
 * Cloudflare Pagesのハンドラ関数
 */
export default {
    async fetch(request, env, ctx) {
        try {
            // エッジでのキャッシュを使用
            return await getAssetFromKV(
                {
                    request,
                    waitUntil: ctx.waitUntil.bind(ctx),
                },
                {
                    cacheControl: {
                        // 静的アセットに対する適切なキャッシュルール
                        browserTTL: 60 * 60 * 24 * 365, // 1年
                        edgeTTL: 60 * 60 * 24 * 30, // 30日
                        bypassCache: false,
                    },
                    // キャッシュ・キーの名前空間
                    ASSET_NAMESPACE: env.__STATIC_CONTENT,
                    // HTMLページを返す場合のカスタムエラー
                    mapRequestToAsset: req => req,
                },
            )
        } catch (e) {
            // エラーハンドリング
            if (DEBUG) {
                return new Response(e.message || e.toString(), {
                    status: 500,
                })
            }
            return new Response('Internal Error', { status: 500 })
        }
    },
} 