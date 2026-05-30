import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const IMAGES_DIR = path.join(process.cwd(), 'docs', 'public', 'images');
const DOCS_DIR = path.join(process.cwd(), 'docs');

async function processDirectory(dir, fileAction, extFilter) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      await processDirectory(fullPath, fileAction, extFilter);
    } else if (fullPath.endsWith(extFilter)) {
      await fileAction(fullPath);
    }
  }
}

async function optimizeImages() {
  console.log('🔄 開始轉換 PNG 至 WebP...');
  let count = 0;
  
  await processDirectory(IMAGES_DIR, async (filePath) => {
    const webpPath = filePath.replace(/\.png$/i, '.webp');
    try {
      await sharp(filePath)
        .webp({ quality: 80 })
        .toFile(webpPath);
      
      // 刪除舊的 PNG
      fs.unlinkSync(filePath);
      console.log(`✅ 已轉換: ${path.basename(filePath)} -> ${path.basename(webpPath)}`);
      count++;
    } catch (err) {
      console.error(`❌ 轉換失敗 ${filePath}:`, err);
    }
  }, '.png');
  
  console.log(`🎉 圖片轉檔完成！總共處理了 ${count} 張圖片。\n`);
}

async function updateMarkdownFiles() {
  console.log('🔄 開始替換 Markdown 檔案中的圖片連結...');
  let count = 0;

  await processDirectory(DOCS_DIR, async (filePath) => {
    try {
      let content = fs.readFileSync(filePath, 'utf-8');
      
      // 簡單且安全的取代：將檔名後綴的 .png 轉為 .webp
      // 我們只替換網址或連結中的 .png，避免誤傷其他內文
      const regex = /(\/images\/[^\s")]*)\.png/gi;
      
      if (regex.test(content)) {
        content = content.replace(regex, '$1.webp');
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`📝 已更新: ${path.relative(process.cwd(), filePath)}`);
        count++;
      }
    } catch (err) {
      console.error(`❌ 更新失敗 ${filePath}:`, err);
    }
  }, '.md');

  console.log(`🎉 Markdown 更新完成！總共修改了 ${count} 份檔案。\n`);
}

async function run() {
  try {
    await optimizeImages();
    await updateMarkdownFiles();
    console.log('✨ 所有的圖片優化流程已完美結束！');
  } catch (error) {
    console.error('執行過程中發生錯誤：', error);
  }
}

run();
