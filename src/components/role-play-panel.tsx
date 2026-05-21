"use client";

import { FormEvent, useMemo, useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { StudyBuddyAvatar } from "@/components/study-buddy-avatar";
import {
  getRoleForEvent,
  getRolePlayEventOptionById,
  resolveRolePlayEventId,
} from "@/lib/taiwan-history-knowledge";
import type { ChatMessage, RolePlayResponse } from "@/lib/types";

type RolePlayPanelProps = {
  initialEventId: string;
};

type LocalizedRole = {
  roleName: string;
  perspective: string;
  background: string;
  guidingFocus: string;
};

const zhRoleDetails: Record<string, LocalizedRole> = {
  overview: {
    roleName: "日治時期的台灣學生",
    perspective: "我看到台灣有新的建設和學校，但也感受到殖民統治帶來的不平等。",
    background: "這個角色代表生活在 1895 到 1945 年日本統治下的台灣年輕人。",
    guidingFocus: "現代化、不平等權力、日常生活、對殖民統治的不同回應",
  },
  education: {
    roleName: "殖民學校裡的台灣學生",
    perspective: "我希望讀書能帶來機會，但學校也要求我們學日語和服從帝國。",
    background: "這個角色代表在日治時期接受殖民教育的台灣學生。",
    guidingFocus: "教育、語言政策、身分認同、機會、不平等待遇",
  },
  treaty: {
    roleName: "聽到馬關條約消息的台灣居民",
    perspective: "我很震驚，因為一份離我們很遠的條約竟然改變了台灣的統治者。",
    background: "這個角色代表 1895 年面對台灣突然被割讓給日本的普通台灣人。",
    guidingFocus: "政治變化、不安、殖民開始、為何有人選擇反抗",
  },
  "republic-formosa": {
    roleName: "台灣民主國時期的唐景崧",
    perspective: "我希望用新的政治行動抵抗日本接收台灣，但局勢非常不穩定。",
    background: "這個角色代表台灣民主國時期試圖回應割讓危機的政治人物。",
    guidingFocus: "政治不確定、抵抗、為何有人不願沉默接受統治轉移",
  },
  infrastructure: {
    roleName: "殖民政府鐵路工程師",
    perspective: "我認為鐵路能讓交通更快，但它也幫助政府更有效地管理台灣。",
    background: "這個角色代表參與殖民地交通建設的人員。",
    guidingFocus: "現代化、交通、經濟規劃、殖民控制",
  },
  "police-system": {
    roleName: "地方派出所的日本警察",
    perspective: "我負責維持秩序和推動政策，但地方居民可能感到被監視和控制。",
    background: "這個角色代表日治時期深入地方社會的警察制度。",
    guidingFocus: "秩序、監視、地方控制、政策執行、日常壓力",
  },
  sugar: {
    roleName: "台灣蔗農",
    perspective: "我種甘蔗維持生活，但糖業規劃常常優先服務日本帝國的需求。",
    background: "這個角色代表殖民經濟下受糖業政策影響的農民。",
    guidingFocus: "殖民經濟、農業、工廠、不平等利益、日本帝國需求",
  },
  "public-health": {
    roleName: "殖民地台灣的公共衛生醫師",
    perspective: "我推動衛生改善，但公共衛生也讓政府更能管理人民生活。",
    background: "這個角色代表日治時期公共衛生政策中的專業人員。",
    guidingFocus: "健康改善、國家控制、衛生、勞動力、都市穩定",
  },
  "xilai-temple": {
    roleName: "與西來庵事件相關的余清芳",
    perspective: "我看到地方人民的不滿，也知道反抗會面對強大的殖民政府。",
    background: "這個角色代表西來庵事件中結合地方社會與宗教網絡的抗爭者。",
    guidingFocus: "宗教、地方社會、抵抗、鎮壓、後來運動方式的轉變",
  },
  "cultural-association": {
    roleName: "台灣文化協會運動者蔣渭水",
    perspective: "我相信提高民眾知識和公共討論，是爭取權利的重要方法。",
    background: "這個角色代表透過文化、教育和演講推動社會改變的人。",
    guidingFocus: "公民意識、教育、公共討論、權利、非武裝抵抗",
  },
  "parliament-petition": {
    roleName: "台灣議會請願運動者林獻堂",
    perspective: "我希望台灣人能有政治代表，用合法方式表達意見。",
    background: "這個角色代表支持設置台灣議會請願運動的知識分子。",
    guidingFocus: "政治代表、法律改革、政治參與、殖民統治的限制",
  },
  "taisho-democracy": {
    roleName: "受大正民主影響的台灣運動者",
    perspective: "我受到民主思想鼓舞，希望台灣社會能有更多發聲和改革空間。",
    background: "這個角色代表 1920 年代參與社會與政治運動的台灣人。",
    guidingFocus: "民主、公民聲音、改革方式、報紙、政治參與",
  },
  wushe: {
    roleName: "與霧社事件相關的賽德克族領袖莫那魯道",
    perspective: "我面對殖民壓力，也想保護族人的尊嚴和生活方式。",
    background: "這個角色代表與 1930 年霧社事件相關的賽德克族觀點。",
    guidingFocus: "原住民族經驗、身分、壓力、抵抗、殖民統治的不平等影響",
  },
  "musha-aftermath": {
    roleName: "霧社事件後的賽德克族倖存者",
    perspective: "事件後，我感受到更強的控制，也思考部落如何繼續生活。",
    background: "這個角色代表霧社事件後受到政策和社群關係改變影響的人。",
    guidingFocus: "後續影響、記憶、更強控制、社群關係、長期影響",
  },
  "rokusan-law": {
    roleName: "使用六三法的台灣總督府官員",
    perspective: "我認為集中權力能快速治理，但台灣人民很少有參與決定的機會。",
    background: "這個角色代表殖民法律權力集中在總督府的制度。",
    guidingFocus: "法律權力、集中統治、有限參與、殖民權威",
  },
  "land-survey": {
    roleName: "土地調查事業時期的台灣農民",
    perspective: "土地紀錄變得更清楚，但我也擔心稅收和土地權利會改變。",
    background: "這個角色代表面對土地調查、稅收與行政改變的農民。",
    guidingFocus: "土地所有權、稅收、地方習慣、資源控制、現代行政",
  },
  "goto-shinpei": {
    roleName: "殖民地台灣民政長官後藤新平",
    perspective: "我推動改革和現代化，但這些改革也讓殖民政府更有效統治。",
    background: "這個角色代表日治初期制度改革和行政建設的重要官員。",
    guidingFocus: "改革、現代化、警察權力、公共衛生、殖民行政",
  },
  "trunk-railway": {
    roleName: "使用縱貫鐵路的台灣商人",
    perspective: "鐵路讓買賣和移動更方便，但也讓殖民經濟連結更緊密。",
    background: "這個角色代表受縱貫鐵路通車影響的台灣民間商業活動。",
    guidingFocus: "貿易、移動、通訊、糖業、基礎建設的混合影響",
  },
  "jianan-canal": {
    roleName: "嘉南大圳工程師八田與一",
    perspective: "我重視灌溉工程改善農業，但工程也連結到殖民地的經濟目標。",
    background: "這個角色代表參與嘉南大圳與農業水利建設的人。",
    guidingFocus: "技術、灌溉、農業、稻米、糖業、殖民經濟目標",
  },
  "penglai-rice": {
    roleName: "推廣蓬萊米的農業專家",
    perspective: "我相信新品種能提高產量，但農業改變也服務日本市場需求。",
    background: "這個角色代表日治時期農業技術改良與蓬萊米推廣者。",
    guidingFocus: "科學、農業、出口、生產、殖民經濟連結",
  },
  "taiwan-peoples-party": {
    roleName: "台灣民眾黨組織者蔣渭水",
    perspective: "我希望透過政黨組織爭取權利，但殖民政府對運動有很多限制。",
    background: "這個角色代表台灣民眾黨與有組織的政治社會運動。",
    guidingFocus: "組織運動、勞工、地方自治、權利、殖民壓力",
  },
  "local-autonomy-league": {
    roleName: "地方自治運動者",
    perspective: "我希望台灣地方能有更多自治和代表，而不是所有決定都由殖民政府掌握。",
    background: "這個角色代表支持地方自治聯盟與政治改革的人。",
    guidingFocus: "地方政府、代表權、法律改革、公民意識、有限殖民權利",
  },
  "taiwan-minpao": {
    roleName: "台灣民報編輯",
    perspective: "我相信報紙能讓更多人理解社會問題，但言論也可能受到限制。",
    background: "這個角色代表透過媒體、文章和公共輿論參與社會運動的人。",
    guidingFocus: "媒體、公共輿論、審查、社會運動、政治溝通",
  },
  "sun-moon-lake-power": {
    roleName: "日月潭水力發電工程師",
    perspective: "我參與電力建設，看到工業發展，也看到地方環境和生活被改變。",
    background: "這個角色代表參與日月潭水力發電工程的人員。",
    guidingFocus: "工業化、電力、地景改變、地方社群、殖民經濟目標",
  },
  "air-raids": {
    roleName: "二戰空襲中的台灣平民",
    perspective: "我只是普通人，卻在戰爭末期承受空襲、物資不足和不安。",
    background: "這個角色代表二戰末期台灣民眾在戰爭體制下的生活經驗。",
    guidingFocus: "戰時苦難、軍事目標、日常生活、物資短缺、台灣在日本戰爭體制中的角色",
  },
  "southward-policy": {
    roleName: "把台灣作為南進基地的日本軍事規劃者",
    perspective: "我把台灣視為帝國南進的重要基地，用來支援戰爭與資源調度。",
    background: "這個角色代表日本南進政策中將台灣納入軍事與經濟規劃的人。",
    guidingFocus: "南進政策、軍事規劃、資源、港口、戰爭動員",
  },
  kominka: {
    roleName: "戰爭動員時期的台灣學生",
    perspective: "我感到生活被改變，政府要求我們使用日語、支持帝國和配合戰爭。",
    background: "這個角色代表 1937 到 1945 年戰時政策下的台灣年輕人。",
    guidingFocus: "語言、身分、壓力、合作、抵抗、戰爭動員",
  },
};

const uiText = {
  en: {
    mode: "Historical Perspective Mode",
    selectedEvent: "Selected event",
    intro:
      "The AI will speak from a related historical perspective so you can compare causes, choices, and viewpoints.",
    eventLabel: "Taiwan Japanese colonial period event",
    currentRole: "Current role",
    event: "Event",
    conversation: "Role-play conversation",
    conversationIntro:
      "Ask about the event. The role will answer briefly and ask one guiding question at a time.",
    thinking: "Thinking from the role...",
    timeout: "The AI response took too long. You can try again or reflect on what you heard.",
    fallback:
      "I am having trouble responding right now. From my role, the key issue is how power shaped daily choices. What pressure do you notice in this event?",
    inputPlaceholder: "Ask this role about choices, pressure, or viewpoints",
    sending: "Sending...",
    send: "Send",
    hideReflection: "Hide reflection",
    finishReflection: "Finish with reflection",
    reflectionQuestion: "What did you learn from this role's perspective?",
    reflectionPlaceholder: "Write one or two sentences about the viewpoint you heard.",
  },
  zh: {
    mode: "歷史觀點模式",
    selectedEvent: "已選擇事件",
    intro: "AI 會從相關歷史觀點發言，幫助你比較原因、選擇與不同立場。",
    eventLabel: "台灣日治時期事件",
    currentRole: "目前角色",
    event: "事件",
    conversation: "角色扮演對話",
    conversationIntro: "詢問這個事件。角色會簡短回答，並一次只問一個引導問題。",
    thinking: "正在以角色觀點思考...",
    timeout: "AI 回應花太久了。你可以再試一次，或先反思剛剛聽到的內容。",
    fallback:
      "我現在回應有點困難。以我的角色來看，關鍵是權力如何影響日常選擇。你在這個事件中看到什麼壓力？",
    inputPlaceholder: "詢問這個角色的選擇、壓力或觀點",
    sending: "送出中...",
    send: "送出",
    hideReflection: "隱藏反思",
    finishReflection: "用反思結束",
    reflectionQuestion: "你從這個角色的觀點學到了什麼？",
    reflectionPlaceholder: "用一到兩句話寫下你聽到的觀點。",
  },
};

function buildStarterMessage(roleName: string, eventName: string, language: "en" | "zh") {
  if (language === "zh") {
    return `我會扮演 ${roleName}。我和「${eventName}」有關。你想從我的觀點理解什麼？`;
  }

  return `I will speak as a ${roleName}. I am connected to ${eventName}. What would you like to understand from my point of view?`;
}

export function RolePlayPanel({ initialEventId }: RolePlayPanelProps) {
  const { language } = useLanguage();
  const text = uiText[language];
  const resolvedInitialEventId = resolveRolePlayEventId(initialEventId);
  const selectedEvent = useMemo(
    () => getRolePlayEventOptionById(resolvedInitialEventId),
    [resolvedInitialEventId],
  );
  const selectedRole = useMemo(
    () => getRoleForEvent(resolvedInitialEventId),
    [resolvedInitialEventId],
  );
  const localizedRole =
    language === "zh" ? (zhRoleDetails[resolvedInitialEventId] ?? selectedRole) : selectedRole;
  const selectedEventTitle = language === "zh" ? selectedEvent.titleZh : selectedEvent.titleEn;
  const selectedEventPassage =
    language === "zh" ? selectedEvent.passageZh : selectedEvent.passageEn;
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: buildStarterMessage(localizedRole.roleName, selectedEventTitle, language),
    },
  ]);
  const [message, setMessage] = useState("");
  const [reflection, setReflection] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isReflectionOpen, setIsReflectionOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || isLoading) {
      return;
    }

    const userMessage: ChatMessage = { role: "user", content: trimmedMessage };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setMessage("");
    setErrorMessage("");
    setIsLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 25000);

      const response = await fetch("/api/role-play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          message: trimmedMessage,
          eventId: selectedEvent.id,
          roleName: localizedRole.roleName,
          perspective: localizedRole.perspective,
          background: localizedRole.background,
          guidingFocus: localizedRole.guidingFocus,
          eventSummary: `${selectedEventTitle}: ${selectedEventPassage}`,
          passageLanguage: language,
          history: messages.slice(-8),
        }),
      });

      window.clearTimeout(timeoutId);

      const data = (await response.json()) as Partial<RolePlayResponse> & { error?: string };

      if (!response.ok || !data.reply) {
        throw new Error(data.error ?? "The role-play request failed.");
      }

      setMessages((current) => [...current, { role: "assistant", content: data.reply ?? "" }]);
    } catch {
      setErrorMessage(text.timeout);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: text.fallback,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(360px,0.82fr)_minmax(560px,1.18fr)]">
      <aside className="overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-lg shadow-sky-100/70">
        <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-700">
            {text.mode}
          </p>
          <h2 className="mt-1 text-lg font-bold text-slate-950">{text.selectedEvent}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{text.intro}</p>
        </div>

        <div className="space-y-5 p-5">
          <div className="rounded-[1rem] border border-emerald-100 bg-emerald-50/70 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-800">
              {text.currentRole}
            </p>
            <h3 className="mt-2 text-xl font-bold text-slate-950">{localizedRole.roleName}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-700">{localizedRole.perspective}</p>
            <div className="mt-4 rounded-[0.9rem] bg-white/80 p-3 text-sm leading-6 text-slate-600 ring-1 ring-emerald-100">
              {localizedRole.background}
            </div>
          </div>

          <div className="rounded-[1rem] border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              {text.event}
            </p>
            <h3 className="mt-2 text-lg font-bold text-slate-950">{selectedEventTitle}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{selectedEventPassage}</p>
          </div>
        </div>
      </aside>

      <div className="overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-lg shadow-emerald-100/60">
        <div className="border-b border-slate-100 bg-white px-5 py-4">
          <div className="flex items-start gap-3">
            <StudyBuddyAvatar size={42} className="shrink-0 rounded-full bg-emerald-50" />
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-slate-950">{text.conversation}</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">{text.conversationIntro}</p>
            </div>
          </div>
        </div>

        <div className="min-h-[460px] space-y-4 bg-slate-50/60 p-5">
          {messages.map((item, index) => (
            <div
              key={`${item.role}-${index}`}
              className={`flex items-end gap-3 ${
                item.role === "user"
                  ? "ml-auto max-w-[88%] justify-end"
                  : "max-w-[88%] justify-start"
              }`}
            >
              {item.role === "assistant" ? (
                <StudyBuddyAvatar size={34} className="mb-1 shrink-0" />
              ) : null}
              <div
                className={`rounded-[1.1rem] px-4 py-3 text-sm leading-6 shadow-sm ${
                  item.role === "user"
                    ? "bg-sky-700 text-white shadow-sky-100"
                    : "bg-white text-slate-800 ring-1 ring-emerald-100"
                }`}
              >
                {item.content}
              </div>
            </div>
          ))}
          {isLoading ? (
            <div className="flex max-w-[88%] items-end gap-3">
              <StudyBuddyAvatar size={34} className="mb-1 shrink-0" />
              <div className="w-fit rounded-[1.1rem] bg-white px-4 py-3 text-sm text-slate-600 ring-1 ring-emerald-100">
                {text.thinking}
              </div>
            </div>
          ) : null}
          {errorMessage ? (
            <div className="rounded-[1rem] bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-100">
              {errorMessage}
            </div>
          ) : null}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 border-t border-slate-100 bg-white p-4 sm:flex-row"
        >
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={text.inputPlaceholder}
            disabled={isLoading}
            className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm shadow-emerald-200 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? text.sending : text.send}
          </button>
        </form>

        <div className="border-t border-slate-100 bg-amber-50/70 p-5">
          <button
            type="button"
            onClick={() => setIsReflectionOpen((current) => !current)}
            className="rounded-full border border-amber-200 bg-white px-5 py-3 text-sm font-bold text-amber-900 transition hover:bg-amber-100"
          >
            {isReflectionOpen ? text.hideReflection : text.finishReflection}
          </button>
          {isReflectionOpen ? (
            <div className="mt-4 rounded-[1rem] bg-white p-4 ring-1 ring-amber-100">
              <label className="text-sm font-bold text-slate-950" htmlFor="role-reflection">
                {text.reflectionQuestion}
              </label>
              <textarea
                id="role-reflection"
                value={reflection}
                onChange={(event) => setReflection(event.target.value)}
                rows={4}
                className="mt-3 w-full resize-y rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-amber-300 focus:bg-white focus:ring-4 focus:ring-amber-100"
                placeholder={text.reflectionPlaceholder}
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
