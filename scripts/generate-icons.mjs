import fs from 'fs';
import path from 'path';
import { createCanvas, loadImage } from 'canvas';
import { fileURLToPath } from 'url';

// Get the directory name of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Icon sizes
const sizes = [192, 512];

// SVG file path
const svgPath = path.join(__dirname, '../public/icons/icon.svg');
const outputDir = path.join(__dirname, '../public/icons');

// Create directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Generate PNG files
async function generateIcons() {
    try {
        const svg = fs.readFileSync(svgPath, 'utf8');
        const svgBuffer = Buffer.from(svg);

        for (const size of sizes) {
            const canvas = createCanvas(size, size);
            const ctx = canvas.getContext('2d');

            // Draw SVG
            const img = await loadImage(`data:image/svg+xml;base64,${svgBuffer.toString('base64')}`);
            ctx.drawImage(img, 0, 0, size, size);

            // Save as PNG
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