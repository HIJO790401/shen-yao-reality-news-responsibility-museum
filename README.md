# 沈耀國際實相新聞台 × 責任博物館

純靜態網站（HTML/CSS/JS）+ Decap CMS + DecapBridge + Netlify。
部署後可由 `/admin/` 登入管理內容，提交後自動回寫 GitHub 並觸發 Netlify 重佈署。

## 目錄結構
- `admin/`：Decap CMS 後台設定
- `content/reports/`：新聞報導內容
- `content/museum/`：博物館館藏內容
- `content/anchors/`：十四軸主播／編輯部名錄
- `content/founder/`：創辦人資料
- `data/site.json`、`data/home.json`：站點與首頁資料
- `assets/images/`：站內圖片（保留中文檔名）
- `public/assets/uploads/`：CMS 上傳圖片

## 1) 如何新增 Reports
1. 進 `/admin/index.html`，用 GitHub 登入。
2. 點 `Reports` collection。
3. 新增項目，填寫 `slug/title_zh/title_en/summary/date/category/cover/youtube/body_zh/body_en`。
4. 發布後列表頁 `reports.html` 會顯示，且可進 `article.html?slug=...` 詳細頁。

## 2) 如何新增 Museum 館藏
1. 進 `/admin/index.html`。
2. 點 `Museum` collection。
3. 填寫 `slug/id/title/subtitle/hall/guide/cover/youtube/body_zh/body_en`。
4. 發布後 `museum.html` 會顯示，且可進 `museum-item.html?slug=...` 詳細頁。

## 3) 如何修改 Anchors 介紹
1. 進 `/admin/index.html`。
2. 點 `Anchors` collection。
3. 可改 `order`（排序）、中英姓名、中英職位、bio、newsroom、museum、duty、image、youtube。
4. `anchors.html` 會按 `order` 自動排序。

## 4) 如何修改 Founder 資料
1. 進 `/admin/index.html`。
2. 點 `Founder` → `Founder Profile`。
3. 修改 identity/statement/mission/collaboration/contact/youtube 等欄位。

## 5) 如何上傳圖片
- 在 CMS 的 image 欄位上傳。
- 檔案會進 `public/assets/uploads/`，前端以 `/assets/uploads/...` 顯示。

## 6) 如何貼 YouTube URL
- 在 `youtube` 欄位貼 `https://www.youtube.com/watch?v=...` 或 `https://youtu.be/...`。
- 詳細頁與個人頁會自動轉 iframe。

## 7) 如何進 /admin/
- `https://你的網域/admin/index.html`
- 按 `Login with GitHub`。

## 8) Reports / Museum 詳細頁運作
- `article.html` 讀取 query `slug`，再到 `content/reports/*.md` 載入對應文章。
- `museum-item.html` 讀取 query `slug`，再到 `content/museum/*.md` 載入對應館藏。

## 9) Netlify / GitHub 部署注意事項
- `netlify.toml` 已設定 publish root、`/admin/*` fallback、security headers、cache headers。
- `robots.txt` 與 `sitemap.xml` 已補齊。
- 只要 CMS 發布成功，GitHub 會更新，Netlify 會自動重新部署。
