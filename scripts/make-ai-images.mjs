// AI 插圖轉檔：07_照片\AI插圖原檔\*.png → docs/public/images/ai/<名稱>.webp（1024 寬）＋ <名稱>-sm.webp（512 寬）
// 另外輸出一張總覽圖（每張縮圖加檔名）方便逐張檢查。
// 用法：node scripts/make-ai-images.mjs [總覽圖輸出路徑]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.resolve(ROOT, '../07_照片/AI插圖原檔');
const OUT = path.join(ROOT, 'docs/public/images/ai');
fs.mkdirSync(OUT, { recursive: true });

const names = fs.readdirSync(SRC).filter((f) => f.endsWith('.png') && !f.startsWith('參考')).map((f) => f.slice(0, -4)).sort();
for (const n of names) {
  const src = path.join(SRC, `${n}.png`);
  // 統一裁成 16:9，網站版面都照這個比例留空間
  const base = sharp(src).resize({ width: 1024, height: 576, fit: 'cover' });
  await base.clone().webp({ quality: 80 }).toFile(path.join(OUT, `${n}.webp`));
  await base.clone().resize({ width: 512 }).webp({ quality: 78 }).toFile(path.join(OUT, `${n}-sm.webp`));
}
console.log(`${names.length} 張 → ${path.relative(ROOT, OUT)}`);

const sheet = process.argv[2];
if (sheet && names.length) {
  const W = 400, H = 225, LABEL = 28, COLS = 4, rows = Math.ceil(names.length / COLS);
  const tiles = await Promise.all(names.map(async (n, i) => {
    const img = await sharp(path.join(SRC, `${n}.png`)).resize(W, H, { fit: 'cover' }).toBuffer();
    const label = Buffer.from(`<svg width="${W}" height="${LABEL}"><rect width="100%" height="100%" fill="#222"/><text x="8" y="20" font-size="18" fill="#fff" font-family="Arial">${n}</text></svg>`);
    return [
      { input: img, left: (i % COLS) * W, top: Math.floor(i / COLS) * (H + LABEL) + LABEL },
      { input: label, left: (i % COLS) * W, top: Math.floor(i / COLS) * (H + LABEL) },
    ];
  }));
  await sharp({ create: { width: W * COLS, height: rows * (H + LABEL), channels: 3, background: '#fff' } })
    .composite(tiles.flat()).png().toFile(sheet);
  console.log('總覽圖 →', sheet);
}
