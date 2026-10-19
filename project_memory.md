# Project Memory 日誌

- 2026-08-08: 確認 Google Drive 為檔案發布管道，並於 graphic-programming.md 新增 260808 一鍵安裝包更新提示。
- 2026-09-03: 落地 SEO 與 AI/GEO 優化：配置 Sitemap、robots.txt、llms.txt、JSON-LD、首頁關鍵字與 FAQ 專頁。
- 2026-09-11: 移除 config.mjs 中未包含報價的 Product 結構化資料，徹底修復 Search Console 缺漏 offers 重大錯誤。
- 2026-10-19: 教學改成「網頁版為主、安裝版改用自家 MBC 圖控編程（主程式＋匯入 jBot 積木包）」，OpenBlock 只留一句舊版說明。jBot 積木包 `docs/public/downloads/mbc_jbot.abpkz` 複製自正本 `09_圖控軟體\圖控軟體開發_外掛類別Gemini版\mbc_jbot.abpkz`（正本改版要重新複製）；網頁版範例 `scripts/make-web-examples.mjs` 產生，桌面版範例 `docs/public/example/desktop/*.abp` 與 `images/desktop/` 截圖是在獨立環境的桌面版（APPDATA／MBC_LIBRARIES_DIR 指到暫存區）匯入積木包後產生。桌面版安裝檔放 contactmbcrobot 的 Google 雲端硬碟公開資料夾，安裝頁連資料夾網址（換新版不用改網站）。
- 2026-10-19: 闖關冒險風改版：首頁出發方式三卡＋冒險地圖、課程頁任務卡＋「我過關了」（關卡資料在 `docs/.vitepress/theme/levels.js`，過關紀錄存瀏覽器 localStorage）、各頁頁首插圖（同檔 `BANNERS`）。插圖用 Gemini 網頁版生成（附小車實物照當參考），原檔與提示詞在 `../07_照片/AI插圖原檔`，`node scripts/make-ai-images.mjs` 轉成 `docs/public/images/ai/*.webp`（1024／512 寬）。
