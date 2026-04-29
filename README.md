# study-buddy
# AI Study Buddy

AI Study Buddy is a Next.js, TypeScript, and Tailwind starter app with App Router pages for a study assistant chat and saved study history.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase JavaScript client
- Route Handlers for `/api/chat` and `/api/history`

## Project Structure

```text
src/
  app/
    api/
      chat/route.ts
      history/route.ts
    chat/page.tsx
    history/page.tsx
    globals.css
    layout.tsx
    page.tsx
  components/
    app-header.tsx
    chat-panel.tsx
    feature-card.tsx
    history-list.tsx
  lib/
    study-data.ts
    types.ts
    supabase/
      client.ts
      server.ts
```

## Setup

Install dependencies:

```bash
npm install
```

Create your local env file:

```bash
cp .env.example .env.local
```

Add Supabase values to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

`SUPABASE_SERVICE_ROLE_KEY` is used only by server route handlers. Keep it out of client components and never expose it in the browser.

Create the `study_sessions` table in Supabase:

```sql
create table if not exists public.study_sessions (
  id uuid primary key,
  title text not null,
  topic text not null,
  summary text not null,
  created_at timestamptz not null default now()
);
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Routes

- `/` shows the home page.
- `/chat` provides the study chat UI.
- `/history` lists recent study sessions.
- `/api/chat` accepts `POST` requests with `{ "message": "...", "topic": "..." }`.
- `/api/history` returns recent saved sessions.

When Supabase env vars are missing, the app still runs with sample history data so the UI can be developed locally.
