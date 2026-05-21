"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { historyEvents } from "@/data/history-events";
import { useLanguage } from "@/components/language-provider";

const pageText = {
  en: {
    eyebrow: "Taiwan Japanese Colonial Period",
    title: "Choose an Event or Topic",
    subtitle:
      "Select a Taiwan Japanese colonial period topic before chatting with Study Buddy.",
    rolePlayTitle: "Choose an Event for Role-play",
    rolePlaySubtitle:
      "Select a Taiwan Japanese colonial period event before starting Historical Perspective Mode.",
    selectedTopic: "Selected topic",
    role: "Role",
  },
  zh: {
    eyebrow: "台灣日治時期",
    title: "選擇事件或主題",
    subtitle: "在開始和 Study Buddy 對話前，先選擇一個台灣日治時期的主題。",
    rolePlayTitle: "選擇角色扮演事件",
    rolePlaySubtitle: "在進入歷史觀點模式前，先選擇一個台灣日治時期事件。",
    selectedTopic: "已選擇主題",
    role: "角色",
  },
};

const zhEventDetails: Record<string, { description: string; category: string; role: string }> = {
  overview: {
    description: "從 1895 到 1945 年，認識台灣在日本統治下的整體變化。",
    category: "總覽",
    role: "日治時期的台灣學生",
  },
  education: {
    description: "理解學校、日語教育和身分認同之間的關係。",
    category: "教育",
    role: "在學校學日語的台灣學生",
  },
  treaty: {
    description: "了解台灣人在 1895 年得知台灣割讓給日本時的處境。",
    category: "政治變化",
    role: "聽到台灣被割讓給日本的台灣人",
  },
  "republic-formosa": {
    description: "認識 1895 年部分台灣人反抗日本接收台灣的原因。",
    category: "抵抗",
    role: "台灣民主國時期的地方台灣人",
  },
  infrastructure: {
    description: "比較鐵路帶來的便利，以及它在殖民統治中的作用。",
    category: "現代化",
    role: "殖民地台灣的鐵路工人",
  },
  "police-system": {
    description: "觀察警察權力如何進入地方社會與日常生活。",
    category: "控制",
    role: "殖民警察制度下的台灣村民",
  },
  sugar: {
    description: "學習糖業生產、工廠勞動和殖民經濟規劃。",
    category: "經濟",
    role: "殖民地台灣的糖廠工人",
  },
  "public-health": {
    description: "思考公共衛生改善和政府管理如何同時影響生活。",
    category: "公共衛生",
    role: "殖民地台灣的公共衛生人員",
  },
  "xilai-temple": {
    description: "理解地方抗日行動，以及武裝抗爭逐漸轉變的背景。",
    category: "抵抗",
    role: "西來庵事件時期的台灣居民",
  },
  "cultural-association": {
    description: "認識演講、報紙和文化活動如何成為社會運動的一部分。",
    category: "社會運動",
    role: "台灣文化協會會員",
  },
  "parliament-petition": {
    description: "探索台灣人如何透過合法請願爭取政治代表。",
    category: "政治運動",
    role: "支持議會請願運動的台灣知識分子",
  },
  "taisho-democracy": {
    description: "了解大正民主思想如何影響 1920 年代的台灣社會運動。",
    category: "政治思想",
    role: "1920 年代的台灣社會運動者",
  },
  wushe: {
    description: "理解 1930 年原住民族反抗與殖民統治之間的衝突。",
    category: "抵抗",
    role: "莫那魯道",
  },
  "musha-aftermath": {
    description: "思考一個事件如何改變政策、記憶和部落生活。",
    category: "後續影響",
    role: "霧社事件後的原住民族倖存者",
  },
  "rokusan-law": {
    description: "認識殖民法律如何集中總督府的權力。",
    category: "法律",
    role: "生活在殖民法律控制下的台灣居民",
  },
  "land-survey": {
    description: "連結土地紀錄、稅收、農業和殖民行政的關係。",
    category: "行政",
    role: "土地調查事業時期的台灣農民",
  },
  "goto-shinpei": {
    description: "了解早期改革如何推動現代化，也加強殖民統治。",
    category: "改革",
    role: "經歷早期殖民改革的台灣居民",
  },
  "trunk-railway": {
    description: "思考交通、貿易、訊息傳遞和殖民建設的關係。",
    category: "交通",
    role: "搭乘縱貫鐵路的乘客",
  },
  "jianan-canal": {
    description: "探索灌溉、農業技術和殖民經濟目標。",
    category: "農業",
    role: "嘉南平原的農民",
  },
  "penglai-rice": {
    description: "學習科學農業如何讓台灣農業連結到日本需求。",
    category: "農業",
    role: "種植蓬萊米的台灣農民",
  },
  "taiwan-peoples-party": {
    description: "認識有組織的政治運動，以及殖民政府的壓力。",
    category: "政治運動",
    role: "台灣民眾黨成員",
  },
  "local-autonomy-league": {
    description: "理解台灣人在殖民統治下爭取地方自治的訴求。",
    category: "地方自治",
    role: "支持地方自治的台灣人",
  },
  "taiwan-minpao": {
    description: "學習報紙和文字如何影響公共輿論。",
    category: "媒體",
    role: "台灣民報撰稿者",
  },
  "sun-moon-lake-power": {
    description: "連結電力、工業、地方變化和殖民規劃。",
    category: "工業",
    role: "參與日月潭水力發電工程的工人",
  },
  "air-raids": {
    description: "了解戰爭末期空襲如何影響普通人的生活。",
    category: "戰爭",
    role: "二戰末期空襲中的台灣平民",
  },
  "southward-policy": {
    description: "認識台灣如何被納入日本更大的戰時擴張政策。",
    category: "帝國",
    role: "受到日本南進政策影響的台灣人",
  },
  kominka: {
    description: "思考語言、身分、壓力和戰爭動員之間的關係。",
    category: "戰時政策",
    role: "皇民化運動時期的台灣學生",
  },
};

type EventSelectionClientProps = {
  mode?: "chat" | "role-play";
};

export function EventSelectionClient({ mode = "chat" }: EventSelectionClientProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const text = pageText[language];
  const isRolePlayMode = mode === "role-play";
  const [selectedEventId, setSelectedEventId] = useState(historyEvents[0].id);
  const selectedEvent = historyEvents.find((event) => event.id === selectedEventId) ?? historyEvents[0];

  function startChat(eventId = selectedEventId) {
    const path = isRolePlayMode ? "/role-play" : "/chat";

    router.push(`${path}?topic=${encodeURIComponent(eventId)}`);
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-8 lg:px-8 lg:py-10">
      <div className="mb-6 rounded-[1.25rem] border border-white bg-white/75 p-5 shadow-sm shadow-sky-100/70 backdrop-blur">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-sky-700">
            {text.eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            {isRolePlayMode ? text.rolePlayTitle : text.title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
            {isRolePlayMode ? text.rolePlaySubtitle : text.subtitle}
          </p>
        </div>
      </div>

      <div className="mb-5 rounded-[1rem] border border-emerald-100 bg-emerald-50/70 px-5 py-4 text-sm font-semibold text-emerald-900">
        {text.selectedTopic}: {selectedEvent.title}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {historyEvents.map((event) => {
          const isSelected = event.id === selectedEventId;
          const localizedEvent =
            language === "zh" ? (zhEventDetails[event.id] ?? event) : event;

          return (
            <button
              key={event.id}
              type="button"
              onClick={() => startChat(event.id)}
              onMouseEnter={() => setSelectedEventId(event.id)}
              className={`group flex min-h-[210px] flex-col rounded-[1rem] border p-5 text-left transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-100 ${
                isSelected
                  ? "border-sky-400 bg-sky-50/80 ring-4 ring-sky-100"
                  : "border-slate-200 bg-white"
              }`}
            >
              <span className="w-fit rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 ring-1 ring-amber-100">
                {localizedEvent.category}
              </span>
              <h2 className="mt-4 text-lg font-bold leading-7 text-slate-950">{event.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {localizedEvent.description}
              </p>
              <p className="mt-auto pt-4 text-xs font-semibold text-emerald-800">
                {text.role}: {localizedEvent.role}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
