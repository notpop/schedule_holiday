#!/bin/bash
set -e

# ビルド実行
echo "📦 Next.jsをビルドしています..."
npm run build

# Cloudflare用のアダプタを使用してビルドを最適化
echo "🔌 Cloudflare用にビルドを最適化しています..."
npx @cloudflare/next-on-pages

# キャッシュディレクトリを削除
echo "🧹 不要なキャッシュファイルを削除しています..."
rm -rf .next/cache

# 大きなファイルがないか確認（5MB以上）
echo "📏 サイズの大きなファイルを確認..."
LARGE_FILES=$(find .next -type f -size +5M | sort -n)
if [ -n "$LARGE_FILES" ]; then
  echo "⚠️ 以下の大きなファイルが見つかりました（削除対象）："
  ls -lah $LARGE_FILES
  
  # 大きなファイルを削除
  for file in $LARGE_FILES; do
    echo "🗑️ $fileを削除しています..."
    rm -f "$file"
  done
fi

# 不要なディレクトリを削除
echo "🧹 不要なファイルをクリーンアップしています..."
find .next -name "*.pack" -delete
find .next -name "*.gz" -delete

# Cloudflare用に生成されたディレクトリをチェック
if [ -d ".vercel/output/static" ]; then
  echo "🔍 Cloudflare用の最適化ビルドが見つかりました"
  DEPLOY_DIR=".vercel/output/static"
else
  echo "🔍 標準的なNext.jsビルドを使用します"
  DEPLOY_DIR=".next"
fi

# デプロイ用のディレクトリ作成
echo "🗂️ デプロイ用のディレクトリを準備しています..."
rm -rf .deploy
mkdir -p .deploy

# ビルドディレクトリのコンテンツをコピー
echo "📂 ビルドファイルをコピーしています..."
cp -r $DEPLOY_DIR/* .deploy/

# publicディレクトリをコピー
echo "📂 静的ファイルをコピーしています..."
cp -r public/* .deploy/

# _redirectsファイルを作成
echo "🔄 リダイレクト設定を作成..."
cat > .deploy/_redirects << EOL
/* /index.html 200
EOL

# 404.htmlを作成
echo "📄 404ページを準備しています..."
cat > .deploy/404.html << EOL
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ページが見つかりません - Holidays</title>
  <meta http-equiv="refresh" content="0;url=/" />
</head>
<body>
  <p>ページが見つかりませんでした。リダイレクトしています...</p>
  <script>
    window.location.href = '/';
  </script>
</body>
</html>
EOL

# デプロイ前の最終確認
echo "📊 デプロイサイズ計算中..."
DEPLOY_SIZE=$(du -sh .deploy | cut -f1)
echo "📦 デプロイサイズ: $DEPLOY_SIZE"

# Cloudflare Pagesにデプロイ
echo "🚀 Cloudflare Pagesにデプロイします..."
wrangler pages deploy .deploy --project-name holiday-schedule --branch main

# 一時ディレクトリを削除
echo "🧹 一時ファイルを削除しています..."
rm -rf .deploy

echo "✅ デプロイが完了しました！" 