"use client";

import { useLanguage } from "@/components/language-provider";

const pageText = {
  en: {
    eyebrow: "Progress tracker",
    title: "Study History",
    description:
      "Review Taiwan Japanese colonial period reading records, current support level, and the next skill to practice.",
  },
  zh: {
    eyebrow: "學習進度紀錄",
    title: "學習紀錄",
    description: "查看台灣日治時期閱讀紀錄、目前輔助程度，以及下一個需要練習的能力。",
  },
};

export function HistoryPageHeading() {
  const { language } = useLanguage();
  const text = pageText[language];

  return (
    <div className="mb-8">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-700">
        {text.eyebrow}
      </p>
      <h1 className="mt-3 text-4xl font-bold">{text.title}</h1>
      <p className="mt-3 max-w-2xl text-slate-600">{text.description}</p>
    </div>
  );
}
