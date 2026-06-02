# AI Study Buddy

AI Study Buddy 是一個給國中生使用的台灣歷史閱讀練習網站。學生可以閱讀日治時期相關短文，和 AI 學習夥伴 Hank 對話，完成五個閱讀理解檢查，並在練習結束後查看完整聊天紀錄與學習摘要。

## 組員

何書維 114524030、洪旭泰 113921006、張祐豪 113524013

## 目前功能

- 使用 Supabase Auth 註冊、登入與登出。
- 依學生帳號儲存個人學習資料。
- 選擇台灣日治時期歷史主題後開始閱讀練習。
- AI 產生或載入繁體中文、英文閱讀文章。
- Hank 會根據學生回答進行五個短篇閱讀檢查。
- 聊天 API 會依照學生語意判斷回答狀態，而不是只比對關鍵字。
- Hank 回覆會參考最近對話，避免一直使用同一套制式句型。
- 練習完成後會儲存完整對話、文章、題數與完成時間。
- 歷史紀錄頁預設顯示 5 筆紀錄，下方可按「顯示更多」查看所有完成的聊天紀錄。
- 單筆歷史紀錄可以查看完整對話內容。
- 完成練習後會產生學習摘要，包含練習主題、能力、優點、弱點、下一步建議與支援程度。
- 提供角色扮演練習與配對遊戲，幫助學生從不同角度理解歷史事件。

## 技術架構

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase Auth、Database、Row Level Security
- OpenAI Chat Completions API
- Next.js Route Handlers

## 專案結構

```text
src/
  app/
    api/
      chat/route.ts              # Hank 聊天與閱讀檢查 API
      generate-passage/route.ts  # 產生閱讀文章 API
      history/route.ts           # 歷史紀錄 API
      role-play/route.ts         # 角色扮演 API
    chat/page.tsx                # 閱讀聊天頁
    history/page.tsx             # 學習紀錄列表
    history/[sessionId]/page.tsx # 單筆完整對話紀錄
    login/page.tsx               # 登入
    register/page.tsx            # 註冊
    role-play/page.tsx           # 角色扮演
    match/page.tsx               # 配對遊戲
    select-event/page.tsx        # 主題選擇
  components/
    chat-panel.tsx               # 主要聊天 UI
    history-list.tsx             # 歷史紀錄列表與顯示更多
    history-detail-client.tsx    # 完整對話紀錄
    role-play-panel.tsx          # 角色扮演 UI
    match-game-client.tsx        # 配對遊戲 UI
  data/
    history-events.ts            # 歷史事件資料
    match-questions.ts           # 配對遊戲題目
  lib/
    analyze-learning.ts          # 學習摘要分析
    passage-memory.ts            # 已回答線索整理
    taiwan-history-knowledge.ts  # 台灣歷史文章與角色資料
    supabase/
      client.ts
      server.ts
database/
  schema.sql                     # Supabase 資料表、trigger、RLS policy
```

## 環境設定

安裝套件：

```bash
npm install
```

手動建立本機環境變數檔：

```text
.env.local
```

在 `.env.local` 加入 Supabase 與 OpenAI 設定：

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-5-mini
```

`SUPABASE_SERVICE_ROLE_KEY` 只能放在伺服器端使用，不可以放進 client component，也不要暴露在瀏覽器中。

## Supabase 資料庫

請到 Supabase SQL Editor 執行：

```text
database/schema.sql
```

目前程式使用的主要資料表：

- `student_profiles`：學生個人資料，連結 Supabase Auth 使用者。
- `learning_sessions`：每次閱讀練習的文章、完整對話、完成時間與題數。
- `learning_responses`：每次學生回答與 AI 回饋。
- `learning_profiles`：學生目前常見弱點、最近練習能力與支援程度。
- `learning_summaries`：單次練習結束後的學習摘要。

資料表已啟用 Row Level Security，學生只能讀寫自己的資料。

## 開發指令

啟動開發伺服器：

```bash
npm run dev
```

開啟：

```text
http://localhost:3000
```

檢查程式碼：

```bash
npm run lint
```

建立 production build：

```bash
npm run build
```

## 主要頁面

- `/`：首頁。
- `/register`：註冊學生帳號。
- `/login`：登入。
- `/select-event`：選擇歷史主題。
- `/chat`：閱讀文章並和 Hank 對話。
- `/history`：查看完成的聊天紀錄與學習狀態。
- `/history/[sessionId]`：查看單次練習的完整對話。
- `/role-play`：用角色觀點練習歷史理解。
- `/match`：歷史概念配對遊戲。

## API Routes

- `POST /api/chat`：根據學生回答、文章、目前步驟與聊天紀錄，回傳 Hank 的下一句回覆。
- `POST /api/generate-passage`：依主題與語言產生閱讀文章。
- `POST /api/role-play`：依角色觀點產生對話回覆。
- `GET /api/history`：取得近期學習紀錄。

## 最近更新

- 歷史紀錄頁改為預設顯示 5 筆，並提供「顯示更多 / 收合」按鈕查看所有聊天紀錄。
- 移除聊天 API 中過於固定的回答模板，讓 Hank 根據最近對話產生更自然、不重複的回覆。
- 歷史紀錄查詢會取得所有已完成練習，避免只看到部分紀錄。
