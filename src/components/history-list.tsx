"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { LearningSummaryCard } from "@/components/learning-summary-card";
import { parseLearningSummary } from "@/lib/analyze-learning";
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
    completedTopics: "Completed topics",
    latestSummary: "Latest summary",
    recommendedNextPractice: "Recommended next practice",
    noSummaryYet: "Generate a learning summary after chat to see it here.",
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
    completedTopics: "完成主題",
    latestSummary: "最新摘要",
    recommendedNextPractice: "建議下一步練習",
    noSummaryYet: "在聊天結束後產生學習摘要，就會顯示在這裡。",
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

function localizeSummaryText(value: string, language: "en" | "zh") {
  if (language === "en") {
    return value;
  }

  const feedback: Record<string, string> = {
    "Clear reasoning": "推論清楚",
    "Used some evidence from the passage": "有使用文章中的證據",
    "Stayed focused on the topic": "能專注在主題上",
    "Answer too short": "答案太短",
    "Lack of evidence": "缺少證據",
    "Weak reasoning": "推論還不夠清楚",
    "Keep making connections clearer": "繼續把想法連結說得更清楚",
    "Write 2-3 complete sentences for each answer.": "每題試著寫 2 到 3 句完整句子。",
    "Add one detail from the passage before explaining your idea.":
      "先加入一個文章細節，再說明你的想法。",
    "Use 'This shows...' to explain how your evidence supports your answer.":
      "用「這顯示……」來說明證據如何支持你的答案。",
    "Try comparing two viewpoints about the same event.": "試著比較同一事件中的兩種不同觀點。",
  };

  return feedback[value] ?? value;
}

export function HistoryList({
  studentProfile,
  learningProfile,
  totalSessions,
  latestSessions,
}: HistoryListProps) {
  const { language } = useLanguage();
  const [showAllSessions, setShowAllSessions] = useState(false);
  const t = text[language];
  const visibleSessions = showAllSessions ? latestSessions : latestSessions.slice(0, 5);
  const toggleHistoryLabel = showAllSessions
    ? language === "zh"
      ? "收合"
      : "Show less"
    : language === "zh"
      ? "顯示更多"
      : "Show more";
  const commonWeakness = learningProfile?.common_weakness ?? t.commonWeaknessFallback;
  const recentlyPracticedSkill =
    learningProfile?.recently_practiced_skill ?? t.recentlyPracticedFallback;
  const supportLevel = formatSupportLevel(learningProfile?.support_level, language);
  const summaries = latestSessions
    .map((session) => session.learning_summary ?? parseLearningSummary(session.summary))
    .filter((summary) => summary !== null);
  const latestSummary = summaries[0] ?? null;
  const completedTopics = new Set(
    latestSessions.map((session) => session.topic ?? session.title).filter(Boolean),
  ).size;
  const mostCommonSummaryWeakness =
    summaries.length > 0
      ? summaries.reduce<Record<string, number>>((counts, summary) => {
          counts[summary.weakness] = (counts[summary.weakness] ?? 0) + 1;
          return counts;
        }, {})
      : null;
  const dashboardWeakness = mostCommonSummaryWeakness
    ? Object.entries(mostCommonSummaryWeakness).sort((a, b) => b[1] - a[1])[0]?.[0]
    : commonWeakness;
  const recommendedNextPractice = latestSummary?.next_step ?? recentlyPracticedSkill;

  return (
    <section className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">{t.totalCompleted}</p>
          <p className="mt-3 text-4xl font-bold text-sky-800">{totalSessions}</p>
        </article>
        <article className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">{t.completedTopics}</p>
          <p className="mt-3 text-4xl font-bold text-sky-800">{completedTopics}</p>
        </article>
        <article className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">{t.mostCommonWeakness}</p>
          <p className="mt-3 text-xl font-bold text-slate-950">
            {localizeSummaryText(dashboardWeakness, language)}
          </p>
        </article>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        {latestSummary ? (
          <LearningSummaryCard summary={latestSummary} language={language} />
        ) : (
          <article className="rounded-[1.25rem] border border-sky-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-700">
              {t.latestSummary}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{t.noSummaryYet}</p>
          </article>
        )}
        <article className="rounded-[1.25rem] border border-amber-100 bg-amber-50/70 p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-800">
            {t.recommendedNextPractice}
          </p>
          <h2 className="mt-3 text-2xl font-bold text-slate-950">
            {localizeSummaryText(recommendedNextPractice, language)}
          </h2>
          <p className="mt-4 text-sm font-semibold text-slate-600">
            {t.supportLevel}: {supportLevel}
          </p>
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
          {visibleSessions.length > 0 ? (
            visibleSessions.map((session) => (
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
                      {localizeSummaryText(
                        session.learning_summary?.next_step ??
                        parseLearningSummary(session.summary)?.next_step ??
                        session.summary ??
                          t.completedFallback,
                        language,
                      )}
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
        {latestSessions.length > 5 ? (
          <div className="mt-5 flex justify-center">
            <button
              type="button"
              aria-expanded={showAllSessions}
              onClick={() => setShowAllSessions((current) => !current)}
              className="rounded-full border border-sky-200 bg-white px-5 py-2 text-sm font-semibold text-sky-800 shadow-sm transition hover:border-sky-300 hover:bg-sky-50"
            >
              {toggleHistoryLabel}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
