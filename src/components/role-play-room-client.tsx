"use client";

import { useLanguage } from "@/components/language-provider";
import { RolePlayPanel } from "@/components/role-play-panel";
import { getRolePlayEventOptionById } from "@/lib/taiwan-history-knowledge";

const pageText = {
  en: {
    eyebrow: "Taiwan history perspective room",
    title: "Historical Perspective Mode",
    description:
      "Choose an event from Taiwan under Japanese rule, then talk with a related historical figure or social actor to examine causes, pressure, and viewpoints.",
    choose: "Choose",
    ask: "Ask",
    reflect: "Reflect",
    currentTopic: "Current Topic",
  },
  zh: {
    eyebrow: "台灣歷史觀點教室",
    title: "歷史觀點模式",
    description:
      "選擇一個台灣日治時期事件，和相關的核心人物或社會行動者對話，理解原因、壓力與不同觀點。",
    choose: "選擇",
    ask: "提問",
    reflect: "反思",
    currentTopic: "目前主題",
  },
};

type RolePlayRoomClientProps = {
  initialEventId: string;
};

export function RolePlayRoomClient({ initialEventId }: RolePlayRoomClientProps) {
  const { language } = useLanguage();
  const text = pageText[language];
  const selectedEvent = getRolePlayEventOptionById(initialEventId);
  const selectedEventTitle = language === "zh" ? selectedEvent.titleZh : selectedEvent.titleEn;

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 rounded-[1.25rem] border border-white bg-white/75 p-5 shadow-sm shadow-sky-100/70 backdrop-blur md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-sky-700">
            {text.eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            {text.title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
            {text.description}
          </p>
          <p className="mt-3 w-fit rounded-full bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-800 ring-1 ring-sky-100">
            {text.currentTopic}: {selectedEventTitle}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold text-slate-600">
          <span className="rounded-full bg-sky-50 px-3 py-2 text-sky-800">{text.choose}</span>
          <span className="rounded-full bg-emerald-50 px-3 py-2 text-emerald-800">
            {text.ask}
          </span>
          <span className="rounded-full bg-amber-50 px-3 py-2 text-amber-800">
            {text.reflect}
          </span>
        </div>
      </div>
      <RolePlayPanel initialEventId={initialEventId} />
    </>
  );
}
