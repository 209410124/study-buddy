"use client";

import Link from "next/link";
import { StudyBuddyAvatar } from "@/components/study-buddy-avatar";
import { useLanguage } from "@/components/language-provider";
import type { ChatMessage, PassageLanguage, StudentProfile } from "@/lib/types";

type HistoryDetailSession = {
  id: string;
  title: string | null;
  topic: string | null;
  summary: string | null;
  passage: string | null;
  reading_check_count: number | null;
  completed_at: string | null;
  passage_language: PassageLanguage | null;
};

type HistoryDetailClientProps = {
  profile: StudentProfile;
  session: HistoryDetailSession;
  conversation: ChatMessage[];
};

const text = {
  en: {
    back: "Back to history",
    record: "Conversation record",
    fallbackTitle: "Taiwan history reading practice",
    readingChecks: "reading checks",
    notFinished: "Not finished",
    readingPassage: "Reading passage",
    noPassage: "No passage saved.",
    fullConversation: "Full conversation",
    noConversation: "No conversation was saved for this session.",
  },
  zh: {
    back: "回到學習紀錄",
    record: "對話紀錄",
    fallbackTitle: "台灣歷史閱讀練習",
    readingChecks: "次閱讀檢查",
    notFinished: "尚未完成",
    readingPassage: "閱讀文章",
    noPassage: "沒有儲存文章。",
    fullConversation: "完整對話",
    noConversation: "這次練習沒有儲存對話。",
  },
};

function formatDate(value: string | null, language: PassageLanguage, notFinished: string) {
  if (!value) {
    return notFinished;
  }

  return new Date(value).toLocaleString(language === "zh" ? "zh-TW" : "en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function HistoryDetailClient({
  profile,
  session,
  conversation,
}: HistoryDetailClientProps) {
  const { language } = useLanguage();
  const t = text[language];

  return (
    <main className="mx-auto grid w-full max-w-5xl gap-6 px-6 py-10">
      <Link
        href="/history"
        className="w-fit rounded-full border border-sky-100 bg-white px-4 py-2 text-sm font-bold text-sky-800 shadow-sm transition hover:bg-sky-50"
      >
        {t.back}
      </Link>

      <section className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-700">
          {t.record}
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">
          {session.title ?? session.topic ?? t.fallbackTitle}
        </h1>
        <div className="mt-4 flex flex-wrap gap-2 text-sm font-semibold">
          <span className="rounded-full bg-sky-50 px-3 py-1.5 text-sky-800">
            {profile.display_name}
          </span>
          <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-800">
            {session.reading_check_count ?? 0} {t.readingChecks}
          </span>
          <span className="rounded-full bg-amber-50 px-3 py-1.5 text-amber-800">
            {formatDate(session.completed_at, language, t.notFinished)}
          </span>
        </div>
        {session.summary ? (
          <p className="mt-4 text-sm leading-6 text-slate-600">{session.summary}</p>
        ) : null}
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">{t.readingPassage}</h2>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">
            {session.passage ?? t.noPassage}
          </p>
        </article>

        <article className="overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="text-xl font-bold text-slate-950">{t.fullConversation}</h2>
          </div>
          <div className="space-y-4 bg-slate-50/70 p-5">
            {conversation.length > 0 ? (
              conversation.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex items-end gap-3 ${
                    message.role === "user"
                      ? "ml-auto max-w-[88%] justify-end"
                      : "max-w-[88%] justify-start"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <StudyBuddyAvatar size={34} className="mb-1 shrink-0" />
                  ) : null}
                  <div
                    className={`rounded-[1.1rem] px-4 py-3 text-sm leading-6 shadow-sm ${
                      message.role === "user"
                        ? "bg-sky-700 text-white shadow-sky-100"
                        : "bg-white text-slate-800 ring-1 ring-emerald-100"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-2xl bg-white p-4 text-sm text-slate-600 ring-1 ring-slate-100">
                {t.noConversation}
              </p>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
