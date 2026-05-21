"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import type { ConversationHistorySession, LearningProfileRow, StudentProfile } from "@/lib/types";

type HistoryListProps = {
  studentProfile: StudentProfile;
  learningProfile: LearningProfileRow | null;
  totalSessions: number;
  latestSessions: ConversationHistorySession[];
};

const text = {
  en: {
    notFinished: "Not finished",
    medium: "Medium",
    commonWeaknessFallback: "Keep practicing evidence and reasoning",
    recentlyPracticedFallback: "Taiwan history reading practice",
    totalCompleted: "Total completed conversations",
    mostCommonWeakness: "Most common weakness",
    supportLevel: "Support level",
    learningProfile: "Learning profile",
    student: "student",
    currentSupport: "Current support",
    recentlyPracticedSkill: "Recently practiced skill",
    currentFocus: "Current focus",
    conversationHistory: "Conversation history",
    historyDescription:
      "Each card is one finished reading practice. Open it to review the full chat.",
    readingChecks: "reading checks",
    completedFallback: "Completed reading practice with Hank.",
    viewConversation: "View conversation",
    empty:
      "No completed conversation yet. Finish five reading checks with Hank and the full chat will appear here.",
  },
  zh: {
    notFinished: "尚未完成",
    medium: "中等",
    commonWeaknessFallback: "繼續練習找證據和說明推理",
    recentlyPracticedFallback: "台灣歷史閱讀練習",
    totalCompleted: "已完成對話總數",
    mostCommonWeakness: "最常需要加強",
    supportLevel: "輔助程度",
    learningProfile: "學習資料",
    student: "學生",
    currentSupport: "目前輔助",
    recentlyPracticedSkill: "最近練習能力",
    currentFocus: "目前重點",
    conversationHistory: "對話紀錄",
    historyDescription: "每張卡片是一次完成的閱讀練習。點開可以查看完整對話。",
    readingChecks: "次閱讀檢查",
    completedFallback: "已完成和 Hank 的閱讀練習。",
    viewConversation: "查看對話",
    empty: "目前還沒有完成的對話。和 Hank 完成五次閱讀檢查後，完整聊天會出現在這裡。",
  },
};

function formatDate(value: string | null, notFinished: string) {
  if (!value) {
    return notFinished;
  }

  return new Date(value).toISOString().slice(0, 10);
}

function formatSupportLevel(value: string | null | undefined, language: "en" | "zh") {
  if (!value) {
    return text[language].medium;
  }

  if (language === "zh") {
    const supportText: Record<string, string> = {
      low: "低",
      medium: "中等",
      high: "高",
    };

    return supportText[value] ?? value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function HistoryList({
  studentProfile,
  learningProfile,
  totalSessions,
  latestSessions,
}: HistoryListProps) {
  const { language } = useLanguage();
  const t = text[language];
  const commonWeakness = learningProfile?.common_weakness ?? t.commonWeaknessFallback;
  const recentlyPracticedSkill =
    learningProfile?.recently_practiced_skill ?? t.recentlyPracticedFallback;
  const supportLevel = formatSupportLevel(learningProfile?.support_level, language);

  return (
    <section className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">{t.totalCompleted}</p>
          <p className="mt-3 text-4xl font-bold text-sky-800">{totalSessions}</p>
        </article>
        <article className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">{t.mostCommonWeakness}</p>
          <p className="mt-3 text-xl font-bold text-slate-950">{commonWeakness}</p>
        </article>
        <article className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">{t.supportLevel}</p>
          <p className="mt-3 text-xl font-bold text-emerald-700">{supportLevel}</p>
        </article>
      </div>

      <article className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-700">
              {t.learningProfile}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">
              {studentProfile.display_name}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {studentProfile.grade_level.replace("_", " ")} {t.student}
            </p>
          </div>
          <span className="w-fit rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            {t.currentSupport}: {supportLevel}
          </span>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-sky-50 p-4">
            <h3 className="font-semibold text-slate-950">{t.recentlyPracticedSkill}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-700">{recentlyPracticedSkill}</p>
          </div>
          <div className="rounded-3xl bg-amber-50 p-4">
            <h3 className="font-semibold text-slate-950">{t.currentFocus}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-700">{commonWeakness}</p>
          </div>
        </div>
      </article>

      <div>
        <h2 className="text-2xl font-bold text-slate-950">{t.conversationHistory}</h2>
        <p className="mt-2 text-sm text-slate-600">
          {t.historyDescription}
        </p>
        <div className="mt-4 grid gap-3">
          {latestSessions.length > 0 ? (
            latestSessions.map((session) => (
              <Link
                key={session.id}
                href={`/history/${session.id}`}
                className="block rounded-3xl border border-sky-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
              >
                {/* This card comes from learning_sessions, one completed session for the logged-in student. */}
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="font-bold text-slate-950">
                      {session.title ?? session.topic ?? t.recentlyPracticedFallback}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {formatDate(session.completed_at, t.notFinished)} -{" "}
                      {session.reading_check_count ?? 0} {t.readingChecks}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-700">
                      {session.summary ?? t.completedFallback}
                    </p>
                  </div>
                  <span className="w-fit rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
                    {t.viewConversation}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <article className="rounded-3xl border border-sky-100 bg-white p-6 text-sm leading-6 text-slate-600 shadow-sm">
              {t.empty}
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
