"use client";

import type { LearningSummary, PassageLanguage } from "@/lib/types";

type LearningSummaryCardProps = {
  summary: LearningSummary;
  language?: PassageLanguage;
};

const text = {
  en: {
    title: "My Learning Summary",
    subtitle: "A quick look at what you practiced today.",
    today: "Today's Practice",
    skills: "Skills",
    strength: "What You Did Well",
    improve: "What to Improve",
    next: "Next Step",
    support: "Support Level",
    score: "Score",
  },
  zh: {
    title: "我的學習摘要",
    subtitle: "快速看看今天練習了什麼。",
    today: "今日練習",
    skills: "練習能力",
    strength: "做得好的地方",
    improve: "需要加強",
    next: "下一步",
    support: "輔助程度",
    score: "分數",
  },
};

function localizeSkill(skill: string, language: PassageLanguage) {
  if (language === "en") {
    return skill;
  }

  const skills: Record<string, string> = {
    "Main idea": "主旨",
    Evidence: "證據",
    Reasoning: "推論",
    Reflection: "反思",
  };

  return skills[skill] ?? skill;
}

function localizeSupport(level: LearningSummary["support_level"], language: PassageLanguage) {
  if (language === "en") {
    return level;
  }

  return level === "Low" ? "低" : level === "Medium" ? "中等" : "高";
}

function localizeFeedback(value: string, language: PassageLanguage) {
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

export function LearningSummaryCard({ summary, language = "en" }: LearningSummaryCardProps) {
  const t = text[language];
  const scoreDots = Array.from({ length: 3 }, (_, index) => index < summary.simple_score);

  return (
    <section className="rounded-[1.25rem] border border-sky-100 bg-white p-5 shadow-lg shadow-sky-100/70">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-700">{t.title}</p>
          <h2 className="mt-1 text-xl font-bold text-slate-950">{summary.practiced_topic}</h2>
          <p className="mt-1 text-sm text-slate-600">{t.subtitle}</p>
        </div>
        <div className="flex gap-1" aria-label={`${t.score}: ${summary.simple_score}/3`}>
          {scoreDots.map((filled, index) => (
            <span
              key={index}
              className={`h-3 w-3 rounded-full ${filled ? "bg-emerald-500" : "bg-slate-200"}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <article className="rounded-2xl bg-sky-50 p-4 ring-1 ring-sky-100">
          <p className="text-2xl" aria-hidden="true">📘</p>
          <h3 className="mt-2 text-sm font-bold text-sky-950">{t.today}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">{summary.practiced_topic}</p>
        </article>
        <article className="rounded-2xl bg-indigo-50 p-4 ring-1 ring-indigo-100">
          <p className="text-2xl" aria-hidden="true">🧠</p>
          <h3 className="mt-2 text-sm font-bold text-indigo-950">{t.skills}</h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {summary.practiced_skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-indigo-800 ring-1 ring-indigo-100"
              >
                {localizeSkill(skill, language)}
              </span>
            ))}
          </div>
        </article>
        <article className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
          <p className="text-2xl" aria-hidden="true">🌟</p>
          <h3 className="mt-2 text-sm font-bold text-emerald-950">{t.strength}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {localizeFeedback(summary.strength, language)}
          </p>
        </article>
        <article className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-100">
          <p className="text-2xl" aria-hidden="true">🎯</p>
          <h3 className="mt-2 text-sm font-bold text-amber-950">{t.improve}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {localizeFeedback(summary.weakness, language)}
          </p>
        </article>
        <article className="rounded-2xl bg-rose-50 p-4 ring-1 ring-rose-100">
          <p className="text-2xl" aria-hidden="true">➡️</p>
          <h3 className="mt-2 text-sm font-bold text-rose-950">{t.next}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {localizeFeedback(summary.next_step, language)}
          </p>
          <span className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold text-rose-800 ring-1 ring-rose-100">
            {t.support}: {localizeSupport(summary.support_level, language)}
          </span>
        </article>
      </div>
    </section>
  );
}
