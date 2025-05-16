import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas, loadImage } from 'canvas';

// ESMで__dirnameを取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// アイコンのサイズ
const sizes = [192, 512];

// SVGファイルのパス
const svgPath = path.join(__dirname, '../public/icons/icon.svg');
const outputDir = path.join(__dirname, '../public/icons');

// ディレクトリが存在しない場合は作成
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// PNGファイルの生成
async function generateIcons() {
    try {
        const svg = fs.readFileSync(svgPath, 'utf8');
        const svgBuffer = Buffer.from(svg);

        for (const size of sizes) {
            const canvas = createCanvas(size, size);
            const ctx = canvas.getContext('2d');

            // SVGを描画
            const img = await loadImage(`data:image/svg+xml;base64,${svgBuffer.toString('base64')}`);
            ctx.drawImage(img, 0, 0, size, size);

            // PNGとして保存
            const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(outputPath, buffer);

            console.log(`Generated ${outputPath}`);
        }

        console.log('All icons generated successfully');
    } catch (error) {
        console.error('Error generating icons:', error);
    }
}

generateIcons(); 