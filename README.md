# 沈耀國際實相新聞台 × 責任博物館（Decap CMS-ready）

本專案為純靜態網站（HTML/CSS/JS），可由 Netlify 直接部署。
已整合 Decap CMS，部署後可從 `/admin/` 登入管理內容。

## 內容結構
- `content/reports/`：新聞報導（Markdown + front matter）
- `content/museum/`：館藏內容（Markdown + front matter）
- `content/anchors/`：十四軸角色資料（每位一檔）
- `content/founder/`：創辦人資料（單一檔）
- `data/site.json`：站點名稱與 Hero 字串
- `data/home.json`：首頁簡介與精選設定
- `assets/uploads/`：CMS 上傳圖檔位置
- `admin/`：Decap CMS 後台

## 如何新增文章（Reports）
1. 進入 `/admin/` 並登入。
2. 點選 `Reports` collection。
3. 新增項目，填寫：`slug_key`（檔名短代碼，英文小寫/數字/連字號，6-80 字元）、`title_zh`, `title_en`, `summary_zh`, `summary_en`, `date`, `category`, `cover`, `youtube`, `body_zh`, `body_en`。
4. 儲存後會寫入 `content/reports/*.md`。

## 如何新增館藏（Museum）
1. 進入 `/admin/`。
2. 點 `Museum` collection，新增條目。
3. 填寫 `slug_key`（檔名短代碼，英文小寫/數字/連字號，6-80 字元）、館藏編號、中英文標題/副標、導覽文、hall、封面與 YouTube。
4. 儲存後會寫入 `content/museum/*.md`。

## 如何修改十四軸角色資料
1. 進入 `/admin/` → `Anchors`。
2. 編輯對應 slug（yao, an, yan...pan）。
3. 可修改職位、雙語簡介、角色圖與 YouTube。

## 如何修改創辦人資料
1. 進入 `/admin/` → `Founder`。
2. 編輯 `content/founder/profile.md` 內容。

## 如何上傳圖片
- 在 CMS 的 image 欄位上傳後，檔案會進入 `assets/uploads/`。
- 前端會使用 `public_folder: /assets/uploads` 路徑顯示。

## 如何貼 YouTube
- 在 `youtube` 欄位貼入完整網址（例如 `https://www.youtube.com/watch?v=...`）。
- 前端會自動轉成 iframe embed 顯示。

## 如何進入 /admin/
- 部署後直接開 `https://你的網域/admin/`。
- 若 Netlify 已啟用 Identity + Git Gateway，可直接登入管理。

## 部署說明
- 本站維持 Netlify 直接部署模式（無 build framework）。
- 若 Netlify 已連 GitHub，CMS 或手動提交後會自動重新部署。
