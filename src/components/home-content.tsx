"use client";

import Link from "next/link";
import { FeatureCard } from "@/components/feature-card";
import { useLanguage } from "@/components/language-provider";

const homeText = {
  en: {
    eyebrow: "Taiwan history reading practice",
    title: "AI Study Buddy",
    description:
      "Practice English reading with short passages about Taiwan under Japanese rule from 1895 to 1945.",
    start: "Start Learning",
    
    practiceLabel: "Today's practice",
    practiceTitle: "Schools in colonial Taiwan",
    practiceDescription:
      "Read a short Taiwan history passage, explain the main idea, find evidence, and connect your reasoning in your own words.",
    questionLabel: "Question 1",
    question: "What is the main idea of the passage?",
    supportLabel: "Support level",
    support: "Medium guidance with sentence starters.",
    features: [
      {
        label: "1",
        title: "Guided reading",
        description:
          "Move through main idea, evidence, and reasoning questions about Taiwan from 1895 to 1945.",
      },
      {
        label: "2",
        title: "Kind feedback",
        description: "Get short feedback that helps you think about colonial policies and society.",
      },
      {
        label: "3",
        title: "Learning history",
        description: "Review practice records focused on Taiwan during the Japanese colonial period.",
      },
    ],
  },
  zh: {
    eyebrow: "台灣歷史閱讀練習",
    title: "AI Study Buddy",
    description: "透過日治時期台灣的短篇文章，練習英文閱讀與歷史理解。",
    start: "開始學習",
    
    practiceLabel: "今日練習",
    practiceTitle: "殖民時期台灣的學校",
    practiceDescription:
      "閱讀一篇台灣歷史短文，說明主旨、找出證據，並用自己的話連結推論。",
    questionLabel: "問題 1",
    question: "這篇文章的主旨是什麼？",
    supportLabel: "支援程度",
    support: "中等引導，提供句型開頭協助。",
    features: [
      {
        label: "1",
        title: "引導式閱讀",
        description: "一步步練習日治時期台灣文章中的主旨、證據與推論問題。",
      },
      {
        label: "2",
        title: "友善回饋",
        description: "獲得簡短回饋，幫助你思考殖民政策與社會變化。",
      },
      {
        label: "3",
        title: "學習紀錄",
        description: "回顧關於台灣日治時期的閱讀練習紀錄。",
      },
    ],
  },
};

export function HomeContent() {
  const { language } = useLanguage();
  const text = homeText[language];

  return (
    <main>
      <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-20">
        <div className="rounded-[1.75rem] border border-sky-100 bg-white/80 p-7 shadow-xl shadow-sky-100/70 ring-1 ring-white/80 backdrop-blur sm:p-9">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-700">
            {text.eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
            {text.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            {text.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/select-event"
              className="rounded-full bg-sky-700 px-8 py-4 text-center text-base font-bold text-white shadow-lg shadow-sky-200 transition hover:-translate-y-0.5 hover:bg-sky-800 hover:shadow-xl hover:shadow-sky-200"
            >
              {text.start}
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-xl shadow-sky-100">
          <p className="text-sm font-semibold text-emerald-700">{text.practiceLabel}</p>
          <h2 className="mt-3 text-2xl font-bold text-slate-950">{text.practiceTitle}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">{text.practiceDescription}</p>
          <div className="mt-6 grid gap-3">
            <div className="rounded-2xl bg-sky-50 p-4">
              <p className="text-sm font-semibold text-sky-900">{text.questionLabel}</p>
              <p className="mt-1 text-sm text-slate-600">{text.question}</p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-900">{text.supportLabel}</p>
              <p className="mt-1 text-sm text-slate-600">{text.support}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white/75">
        <div className="mx-auto grid w-full max-w-6xl gap-4 px-6 py-12 md:grid-cols-3">
          {text.features.map((feature) => (
            <FeatureCard
              key={feature.label}
              label={feature.label}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
