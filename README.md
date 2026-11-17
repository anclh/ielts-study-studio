# IELTS 練習室

一個繁體中文學習 App，包含 IELTS 聽力／閱讀練習、主題單字，以及 Collocation Bank 搭配詞課堂。IELTS 題目與單字例句為原創樣本；搭配詞課堂沿用原有 27 篇內容。

## 開始使用

```bash
npm install
npm run dev
```

開啟 Vite 顯示的本機網址。執行 `npm test` 檢查進度邏輯，`npm run build` 建立正式版檔案。

IELTS 練習與單字進度儲存在目前瀏覽器的 localStorage；搭配詞課程沿用 Collocation Bank 原有的 `collocation-bank-progress` 儲存鍵，保留完成狀態、最後開啟課堂及待複習標記。課堂內容由 `src/content/collocations.json` 提供。聽力示範題使用裝置的英文語音朗讀；若沒有語音功能，可顯示文字稿作答。這不是正式雅思模擬考或分數估計。
