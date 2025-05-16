#!/bin/bash
set -e

# ビルド実行
echo "📦 Next.jsをビルドしています..."
npm run build

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

# デプロイ用のディレクトリ作成
echo "🗂️ デプロイ用のディレクトリを準備しています..."
mkdir -p .deploy
cp -r .next/* .deploy/

# publicディレクトリを.deployにコピー（オーバーライドあり）
echo "📂 静的ファイルをコピーしています..."
cp -r public/* .deploy/

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