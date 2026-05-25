"use client";

import { ChatPanel } from "@/components/chat-panel";
import { useLanguage } from "@/components/language-provider";
import type { HistoryEvent } from "@/data/history-events";
import { getLocalizedHistoryEventTitle } from "@/lib/history-event-title";
import type { PassageLanguage, StudentProfile } from "@/lib/types";

const pageText: Record<
  PassageLanguage,
  {
    eyebrow: string;
    title: string;
    description: string;
    read: string;
    think: string;
    review: string;
    currentTopic: string;
  }
> = {
  en: {
    eyebrow: "Taiwan history reading room",
    title: "Chat with Hank",
    description:
      "Read a passage about Taiwan under Japanese rule, then practice main idea, evidence, reasoning, and reflection with guided feedback.",
    read: "Read",
    think: "Think",
    review: "Review",
    currentTopic: "Current Topic",
  },
  zh: {
    eyebrow: "台灣歷史閱讀教室",
    title: "和 Hank 聊天",
    description:
      "閱讀一篇關於日治時期台灣的文章，練習主旨、證據、推論與反思，並獲得引導式回饋。",
    read: "閱讀",
    think: "思考",
    review: "複習",
    currentTopic: "目前主題",
  },
};

type ChatRoomClientProps = {
  studentProfile: StudentProfile;
  selectedEvent: HistoryEvent;
};

export function ChatRoomClient({ studentProfile, selectedEvent }: ChatRoomClientProps) {
  const { language } = useLanguage();
  const text = pageText[language];
  const selectedEventTitle = getLocalizedHistoryEventTitle(selectedEvent, language);

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
            {text.currentTopic}: {selectedEvent.year} · {selectedEventTitle}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold text-slate-600">
          <span className="rounded-full bg-sky-50 px-3 py-2 text-sky-800">{text.read}</span>
          <span className="rounded-full bg-emerald-50 px-3 py-2 text-emerald-800">
            {text.think}
          </span>
          <span className="rounded-full bg-amber-50 px-3 py-2 text-amber-800">
            {text.review}
          </span>
        </div>
      </div>
      <ChatPanel
        studentProfile={studentProfile}
        passageLanguage={language}
        selectedEvent={selectedEvent}
      />
    </>
  );
}
