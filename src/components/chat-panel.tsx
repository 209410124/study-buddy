"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { LearningSummaryCard } from "@/components/learning-summary-card";
import { StudyBuddyAvatar } from "@/components/study-buddy-avatar";
import type { HistoryEvent } from "@/data/history-events";
import { analyzeLearning } from "@/lib/analyze-learning";
import { getLocalizedHistoryEventTitle } from "@/lib/history-event-title";
import { extractAnsweredItems, mergeAnsweredItems } from "@/lib/passage-memory";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { taiwanReadingPassageOptions } from "@/lib/taiwan-history-knowledge";
import type {
  ChatMessage,
  ChatResponse,
  ChatStep,
  LearningSummary,
  PassageLanguage,
  StudentProfile,
} from "@/lib/types";

const defaultPassages: Record<PassageLanguage, string> = {
  en: taiwanReadingPassageOptions[0].passageEn,
  zh: taiwanReadingPassageOptions[0].passageZh,
};

const starterPrompts: Record<PassageLanguage, string> = {
  en: "Let's check the reading. What is this passage mostly about?",
  zh: "\u6211\u5011\u5148\u78ba\u8a8d\u95b1\u8b80\u7406\u89e3\u3002\u4f60\u89ba\u5f97\u9019\u7bc7\u6587\u7ae0\u4e3b\u8981\u5728\u8aaa\u4ec0\u9ebc\uff1f",
};

const completedPrompts: Record<PassageLanguage, string> = {
  en: "Practice complete. Restart when you want to try another passage.",
  zh: "\u7df4\u7fd2\u5b8c\u6210\u3002\u5982\u679c\u60f3\u7df4\u7fd2\u53e6\u4e00\u7bc7\u6587\u7ae0\uff0c\u8acb\u6309\u91cd\u65b0\u958b\u59cb\u3002",
};

const stepLabels: Record<PassageLanguage, Record<ChatStep, string>> = {
  en: {
    mainIdea: "Main idea",
    evidence: "Evidence",
    reasoning: "Reasoning",
    organize_reasoning: "Organize idea",
    connect_location_to_reason: "Connect paragraph",
    reflection: "Reflection",
    completed: "Completed",
  },
  zh: {
    mainIdea: "\u4e3b\u65e8",
    evidence: "\u8b49\u64da",
    reasoning: "\u63a8\u8ad6",
    organize_reasoning: "\u6574\u7406\u60f3\u6cd5",
    connect_location_to_reason: "\u9023\u7d50\u6bb5\u843d",
    reflection: "\u53cd\u601d",
    completed: "\u5b8c\u6210",
  },
};

const uiText: Record<
  PassageLanguage,
  {
    studentName: string;
    studentNamePlaceholder: string;
    readingPassage: string;
    passagePlaceholder: string;
    generatePassage: string;
    generating: string;
    chatTitle: string;
    stepPractice: string;
    currentStep: string;
    thinking: string;
    inputPlaceholder: string;
    completedInputPlaceholder: string;
    send: string;
    sending: string;
    chatTimeoutError: string;
    passageTimeoutError: string;
    answerLimit: string;
    savedToHistory: string;
    generateSummary: string;
    generatingSummary: string;
    summarySaved: string;
    summarySaveFailed: string;
  }
> = {
  en: {
    studentName: "Student name",
    studentNamePlaceholder: "Enter your name",
    readingPassage: "Reading passage",
    passagePlaceholder: "Paste a short reading passage",
    generatePassage: "Generate History Passage",
    generating: "Generating...",
    chatTitle: "Chat with Hank",
    stepPractice: "Five short reading checks using only the passage.",
    currentStep: "Current step",
    thinking: "Thinking...",
    inputPlaceholder: "Type your thought here",
    completedInputPlaceholder: "Practice complete",
    send: "Send",
    sending: "Sending...",
    chatTimeoutError: "The AI response took too long. You can try again or keep practicing.",
    passageTimeoutError: "The history passage took too long to generate. Please try again.",
    answerLimit: "Reading check",
    savedToHistory: "Saved to Study History.",
    generateSummary: "Generate My Learning Summary",
    generatingSummary: "Generating summary...",
    summarySaved: "Learning summary saved.",
    summarySaveFailed: "Summary is shown here, but it could not be saved to Supabase.",
  },
  zh: {
    studentName: "\u5b78\u751f\u540d\u5b57",
    studentNamePlaceholder: "\u8f38\u5165\u4f60\u7684\u540d\u5b57",
    readingPassage: "\u95b1\u8b80\u6587\u7ae0",
    passagePlaceholder: "\u8cbc\u4e0a\u4e00\u7bc7\u77ed\u77ed\u7684\u95b1\u8b80\u6587\u7ae0",
    generatePassage: "\u7522\u751f\u6b77\u53f2\u6587\u7ae0",
    generating: "\u7522\u751f\u4e2d...",
    chatTitle: "\u548c Hank \u804a\u5929",
    stepPractice: "\u4e94\u500b\u77ed\u7bc7\u95b1\u8b80\u6aa2\u67e5\uff0c\u53ea\u4f7f\u7528\u6587\u7ae0\u5167\u5bb9\u3002",
    currentStep: "\u76ee\u524d\u6b65\u9a5f",
    thinking: "\u601d\u8003\u4e2d...",
    inputPlaceholder: "\u5728\u9019\u88e1\u8f38\u5165\u4f60\u7684\u60f3\u6cd5",
    completedInputPlaceholder: "\u7df4\u7fd2\u5df2\u5b8c\u6210",
    send: "\u9001\u51fa",
    sending: "\u9001\u51fa\u4e2d...",
    chatTimeoutError: "\u9023\u7dda\u82b1\u4e86\u592a\u4e45\u6642\u9593\u3002\u4f60\u53ef\u4ee5\u518d\u8a66\u4e00\u6b21\uff0c\u6216\u7e7c\u7e8c\u7df4\u7fd2\u3002",
    passageTimeoutError: "\u6b77\u53f2\u6587\u7ae0\u7522\u751f\u82b1\u4e86\u592a\u4e45\u6642\u9593\u3002\u8acb\u518d\u8a66\u4e00\u6b21\u3002",
    answerLimit: "\u95b1\u8b80\u6aa2\u67e5",
    savedToHistory: "\u5df2\u5132\u5b58\u5230\u5b78\u7fd2\u6b77\u53f2\u3002",
    generateSummary: "產生我的學習摘要",
    generatingSummary: "摘要產生中...",
    summarySaved: "學習摘要已儲存。",
    summarySaveFailed: "摘要已顯示在這裡，但沒有成功儲存到 Supabase。",
  },
};

const fallbackReplies: Record<PassageLanguage, Record<ChatStep, string>> = {
  en: {
    mainIdea: "Nice start. You have the direction. How would you say that idea in one complete sentence?",
    evidence:
      "Good clue. Let's connect it to your idea: why would that detail matter to people's lives?",
    reasoning:
      "Nice thinking. What does this passage make you wonder about life in Taiwan from 1895 to 1945?",
    organize_reasoning:
      "Yes, your idea makes sense. Try putting it into one clear sentence, then choose which reason feels most important.",
    connect_location_to_reason:
      "Good, you found a useful place. What is that part mostly saying, in your own words?",
    reflection:
      "That makes sense. Which idea from the passage feels most important to remember?",
    completed:
      "Great work. This practice is complete and saved for review.",
  },
  zh: {
    mainIdea: "\u5f88\u597d\u7684\u958b\u59cb\u3002\u4f60\u5df2\u7d93\u6293\u5230\u65b9\u5411\u4e86\uff0c\u53ef\u4ee5\u8a66\u8457\u628a\u5b83\u6574\u7406\u6210\u4e00\u53e5\u5b8c\u6574\u7684\u8a71\u55ce\uff1f",
    evidence:
      "\u7dda\u7d22\u627e\u5f97\u4e0d\u932f\u3002\u6211\u5011\u628a\u5b83\u63a5\u56de\u4f60\u7684\u60f3\u6cd5\uff1a\u9019\u500b\u7d30\u7bc0\u5c0d\u7576\u6642\u4eba\u5011\u7684\u751f\u6d3b\u6703\u6709\u4ec0\u9ebc\u5f71\u97ff\uff1f",
    reasoning:
      "\u60f3\u5f97\u4e0d\u932f\u3002\u9019\u7bc7\u6587\u7ae0\u8b93\u4f60\u5c0d1895\u52301945\u5e74\u7684\u53f0\u7063\u60f3\u5230\u4ec0\u9ebc\uff1f",
    organize_reasoning:
      "\u5c0d\uff0c\u4f60\u7684\u60f3\u6cd5\u662f\u5408\u7406\u7684\u3002\u53ef\u4ee5\u8a66\u8457\u6574\u7406\u6210\u4e00\u53e5\u5b8c\u6574\u7684\u8a71\uff0c\u518d\u60f3\u60f3\u54ea\u4e00\u500b\u539f\u56e0\u5f71\u97ff\u6700\u5927\uff1f",
    connect_location_to_reason:
      "\u597d\uff0c\u4f60\u5df2\u7d93\u627e\u5230\u53ef\u80fd\u76f8\u95dc\u7684\u4f4d\u7f6e\u4e86\u3002\u90a3\u4e00\u90e8\u5206\u5927\u6982\u5728\u8aaa\u4ec0\u9ebc\uff1f\u7528\u81ea\u5df1\u7684\u8a71\u8aaa\u8aaa\u770b\u3002",
    reflection:
      "\u9019\u6a23\u60f3\u5f88\u6709\u9053\u7406\u3002\u6587\u7ae0\u4e2d\u54ea\u500b\u60f3\u6cd5\u6700\u503c\u5f97\u8a18\u4f4f\uff1f",
    completed:
      "\u505a\u5f97\u5f88\u597d\u3002\u9019\u6b21\u7df4\u7fd2\u5df2\u7d93\u5b8c\u6210\uff0c\u4e5f\u6703\u4fdd\u5b58\u7d66\u4f60\u4e4b\u5f8c\u8907\u7fd2\u3002",
  },
};

const fallbackConnectionOpeners: Record<PassageLanguage, string[]> = {
  en: [
    "I had trouble connecting, but you can keep thinking.",
    "The connection paused, but your idea still matters.",
    "Something slowed down, so let's keep going gently.",
  ],
  zh: [
    "\u9023\u7dda\u6709\u9ede\u554f\u984c\uff0c\u4f46\u4f60\u53ef\u4ee5\u7e7c\u7e8c\u601d\u8003\u3002",
    "\u9023\u7dda\u66ab\u6642\u505c\u4e86\u4e00\u4e0b\uff0c\u4f46\u4f60\u7684\u60f3\u6cd5\u9084\u662f\u5f88\u91cd\u8981\u3002",
    "\u56de\u61c9\u6162\u4e86\u4e00\u9ede\uff0c\u6211\u5011\u7e7c\u7e8c\u6162\u6162\u60f3\u3002",
  ],
};

function pickRandom(items: string[]) {
  return items[Math.floor(Math.random() * items.length)];
}

type ChatPanelProps = {
  studentProfile: StudentProfile;
  passageLanguage: PassageLanguage;
  selectedEvent: HistoryEvent;
};

export function ChatPanel({ studentProfile, passageLanguage, selectedEvent }: ChatPanelProps) {
  const studentName = studentProfile.display_name;
  const previousLanguageRef = useRef(passageLanguage);
  const hasGeneratedInitialPassageRef = useRef(false);
  const initialPassageOption =
    taiwanReadingPassageOptions.find((option) => option.id === selectedEvent.id) ??
    taiwanReadingPassageOptions[0];
  const selectedPassageId = initialPassageOption.id;
  const [passage, setPassage] = useState(
    passageLanguage === "zh" ? initialPassageOption.passageZh : initialPassageOption.passageEn,
  );
  const [learningSessionId, setLearningSessionId] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [step, setStep] = useState<ChatStep>("mainIdea");
  const [historyAnswerCount, setHistoryAnswerCount] = useState(0);
  const [answeredItems, setAnsweredItems] = useState<string[]>([]);
  const [maxHistoryAnswers, setMaxHistoryAnswers] = useState(5);
  const [isSavedToHistory, setIsSavedToHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPassage, setIsGeneratingPassage] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [learningSummary, setLearningSummary] = useState<LearningSummary | null>(null);
  const [summaryStatus, setSummaryStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: starterPrompts[passageLanguage],
    },
  ]);
  const text = uiText[passageLanguage];
  const selectedEventTitle = getLocalizedHistoryEventTitle(selectedEvent, passageLanguage);

  function getSelectedPassageTitle() {
    const selectedPassage = taiwanReadingPassageOptions.find(
      (option) => option.id === selectedPassageId,
    );

    if (!selectedPassage) {
      return selectedEventTitle;
    }

    return passageLanguage === "zh" ? selectedPassage.titleZh : selectedPassage.titleEn;
  }

  async function saveCompletedConversation(
    sessionId: string,
    finalMessages: ChatMessage[],
    finalHistoryAnswerCount: number,
  ) {
    const supabase = getSupabaseBrowserClient();
    const summary =
      passageLanguage === "zh"
        ? `完成 ${finalHistoryAnswerCount} 題閱讀檢查。`
        : `Completed ${finalHistoryAnswerCount} reading checks.`;

    // The full conversation is stored on learning_sessions, so History can show one complete record.
    const { error } = await supabase
      .from("learning_sessions")
      .update({
        title: getSelectedPassageTitle(),
        summary,
        passage,
        conversation: finalMessages,
        reading_check_count: finalHistoryAnswerCount,
        passage_language: passageLanguage,
        completed_at: new Date().toISOString(),
      })
      .eq("id", sessionId)
      .eq("student_id", studentProfile.id);

    if (error) {
      setErrorMessage(
        passageLanguage === "zh"
          ? "練習已完成，但沒有成功儲存到資料庫。請確認 Supabase 已套用最新的 database/schema.sql。"
          : "Practice is complete, but it was not saved to the database. Please run the latest database/schema.sql in Supabase.",
      );
      return;
    }

    setIsSavedToHistory(true);
  }

  async function ensureLearningSession() {
    if (learningSessionId) {
      return learningSessionId;
    }

    const supabase = getSupabaseBrowserClient();

    // A learning session belongs to the logged-in student's auth.users id through student_profiles.id.
    const { data, error } = await supabase
      .from("learning_sessions")
      .insert({
        student_id: studentProfile.id,
        title: getSelectedPassageTitle(),
        topic: selectedEventTitle,
        passage,
        passage_language: passageLanguage,
        reading_check_count: 0,
        conversation: messages,
      })
      .select("id")
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? "Could not start a learning session.");
    }

    setLearningSessionId(data.id);
    return data.id as string;
  }

  async function updateLearningProfile(practicedSkill: string) {
    const supabase = getSupabaseBrowserClient();

    await supabase.from("learning_profiles").upsert({
      student_id: studentProfile.id,
      common_weakness: "Explaining evidence clearly",
      recently_practiced_skill: practicedSkill,
      support_level: "medium",
      updated_at: new Date().toISOString(),
    });
  }

  async function saveLearningSummary(summary: LearningSummary, sessionId = learningSessionId) {
    if (!sessionId) {
      return false;
    }

    const supabase = getSupabaseBrowserClient();
    const { data: existingSummary } = await supabase
      .from("learning_summaries")
      .select("id")
      .eq("student_id", studentProfile.id)
      .eq("session_id", sessionId)
      .maybeSingle<{ id: string }>();

    const summaryPayload = {
      student_id: studentProfile.id,
      session_id: sessionId,
      practiced_topic: summary.practiced_topic,
      practiced_skills: summary.practiced_skills,
      strength: summary.strength,
      weakness: summary.weakness,
      next_step: summary.next_step,
      support_level: summary.support_level,
      simple_score: summary.simple_score,
      updated_at: new Date().toISOString(),
    };

    const { error: summaryError } = existingSummary
      ? await supabase
          .from("learning_summaries")
          .update(summaryPayload)
          .eq("id", existingSummary.id)
          .eq("student_id", studentProfile.id)
      : await supabase.from("learning_summaries").insert(summaryPayload);

    const { error: profileError } = await supabase.from("learning_profiles").upsert({
      student_id: studentProfile.id,
      common_weakness: summary.weakness,
      recently_practiced_skill: summary.practiced_skills.join(", "),
      support_level: summary.support_level.toLowerCase(),
      updated_at: new Date().toISOString(),
    });

    return !summaryError && !profileError;
  }

  async function handleGenerateSummary() {
    setIsGeneratingSummary(true);
    setSummaryStatus("");

    // Rule-based feedback keeps the feature explainable for students and teachers.
    const summary = analyzeLearning(messages, selectedEventTitle);
    setLearningSummary(summary);

    try {
      const didSave = await saveLearningSummary(summary);
      setSummaryStatus(didSave ? text.summarySaved : text.summarySaveFailed);
    } catch {
      setSummaryStatus(text.summarySaveFailed);
    } finally {
      setIsGeneratingSummary(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedAnswer = answer.trim();

    if (!trimmedAnswer || isLoading || step === "completed") {
      return;
    }

    const nextAnsweredItems = mergeAnsweredItems(
      answeredItems,
      extractAnsweredItems(trimmedAnswer, passage),
    );

    setMessages((current) => [...current, { role: "user", content: trimmedAnswer }]);
    setAnsweredItems(nextAnsweredItems);
    setAnswer("");
    setErrorMessage("");
    setIsLoading(true);

    try {
      const currentLearningSessionId = await ensureLearningSession();
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 25000);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          message: trimmedAnswer,
          step,
          passage,
          studentName,
          passageLanguage,
          learningSessionId: currentLearningSessionId,
          historyAnswerCount,
          selectedTopic: selectedEventTitle,
          currentRole: selectedEvent.role,
          history: messages.slice(-10),
          answeredItems: nextAnsweredItems,
        }),
      });
      window.clearTimeout(timeoutId);

      const data = (await response.json()) as Partial<ChatResponse> & { error?: string };

      if (
        !response.ok ||
        !data.reply ||
        !data.nextStep ||
        typeof data.historyAnswerCount !== "number" ||
        typeof data.maxHistoryAnswers !== "number" ||
        typeof data.isSessionComplete !== "boolean"
      ) {
        throw new Error(data.error ?? "The chat request failed.");
      }

      const assistantMessage: ChatMessage = { role: "assistant", content: data.reply ?? "" };
      const finalMessages = [...messages, { role: "user" as const, content: trimmedAnswer }, assistantMessage];

      setMessages((current) => [...current, assistantMessage]);
      setStep(data.nextStep);
      setHistoryAnswerCount(data.historyAnswerCount);
      setMaxHistoryAnswers(data.maxHistoryAnswers);

      if (data.isSessionComplete) {
        await saveCompletedConversation(
          currentLearningSessionId,
          finalMessages,
          data.historyAnswerCount,
        );
        const summary = analyzeLearning(finalMessages, selectedEventTitle);
        setLearningSummary(summary);

        const didSaveSummary = await saveLearningSummary(summary, currentLearningSessionId);
        setSummaryStatus(didSaveSummary ? text.summarySaved : text.summarySaveFailed);

        await updateLearningProfile(stepLabels[passageLanguage][data.nextStep]);
      }
    } catch {
      setErrorMessage(text.chatTimeoutError);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: `${pickRandom(fallbackConnectionOpeners[passageLanguage])} ${
            fallbackReplies[passageLanguage][step]
          }`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function resetPracticeState(nextLanguage: PassageLanguage) {
    setStep("mainIdea");
    setHistoryAnswerCount(0);
    setMaxHistoryAnswers(5);
    setAnsweredItems([]);
    setLearningSessionId(null);
    setIsSavedToHistory(false);
    setAnswer("");
    setErrorMessage("");
    setIsLoading(false);
    setIsGeneratingSummary(false);
    setLearningSummary(null);
    setSummaryStatus("");
    setMessages([{ role: "assistant", content: starterPrompts[nextLanguage] }]);
  }

  const generatePassageForOption = useCallback(async (passageOptionId: string, language: PassageLanguage) => {
    setIsGeneratingPassage(true);
    setErrorMessage("");

    const selectedPassage = taiwanReadingPassageOptions.find(
      (option) => option.id === passageOptionId,
    );

    if (selectedPassage) {
      setPassage(language === "zh" ? selectedPassage.passageZh : selectedPassage.passageEn);
    }

    try {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 25000);

      const response = await fetch("/api/generate-passage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          passageLanguage: language,
          passageOptionId,
        }),
      });
      window.clearTimeout(timeoutId);

      const data = (await response.json()) as { passage?: string; error?: string };

      if (!response.ok || !data.passage) {
        throw new Error(data.error ?? "The passage request failed.");
      }

      setPassage(data.passage);
    } catch {
      setErrorMessage(text.passageTimeoutError);
    } finally {
      setIsGeneratingPassage(false);
    }
  }, [text.passageTimeoutError]);

  useEffect(() => {
    const languageChanged = previousLanguageRef.current !== passageLanguage;

    previousLanguageRef.current = passageLanguage;

    if (languageChanged) {
      const selectedPassage = taiwanReadingPassageOptions.find(
        (option) => option.id === selectedPassageId,
      );

      setPassage(
        selectedPassage
          ? passageLanguage === "zh"
            ? selectedPassage.passageZh
            : selectedPassage.passageEn
          : defaultPassages[passageLanguage],
      );
      resetPracticeState(passageLanguage);
    }

    if (!hasGeneratedInitialPassageRef.current || languageChanged) {
      hasGeneratedInitialPassageRef.current = true;
      void generatePassageForOption(selectedPassageId, passageLanguage);
    }
  }, [generatePassageForOption, passageLanguage, selectedPassageId]);

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(560px,1fr)_minmax(430px,0.76fr)]">
      <aside className="overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-lg shadow-sky-100/70">
        <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-700">
              {text.readingPassage}
            </p>
            <h2 className="mt-1 text-lg font-bold text-slate-950">
              {selectedEvent.year} · {selectedEventTitle}
            </h2>
          </div>
        </div>
        <div className="p-5">
        <div>
          <label className="sr-only" htmlFor="reading-passage">
            {text.readingPassage}
          </label>
          <textarea
            id="reading-passage"
            value={passage}
            onChange={(event) => setPassage(event.target.value)}
            rows={22}
            className="min-h-[540px] w-full resize-y rounded-[1rem] border border-slate-200 bg-white px-5 py-5 text-lg leading-9 text-slate-900 shadow-inner shadow-slate-100 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            placeholder={isGeneratingPassage ? text.generating : text.passagePlaceholder}
          />
        </div>

        </div>
      </aside>

      <div className="overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-lg shadow-emerald-100/60">
        <div className="border-b border-slate-100 bg-white px-5 py-4">
          <div className="flex items-start gap-3">
            <StudyBuddyAvatar size={42} className="shrink-0 rounded-full bg-emerald-50" />
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-slate-950">{text.chatTitle}</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">{text.stepPractice}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <p className="w-fit rounded-full bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-800 ring-1 ring-sky-100">
              {text.currentStep}: {stepLabels[passageLanguage][step]}
            </p>
            <p className="w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 ring-1 ring-emerald-100">
              {text.answerLimit}: {historyAnswerCount}/{maxHistoryAnswers}
            </p>
          </div>
          {isSavedToHistory ? (
            <p className="mt-2 text-xs font-semibold text-emerald-700">{text.savedToHistory}</p>
          ) : null}
        </div>

        <div className="min-h-[480px] space-y-4 bg-slate-50/60 p-5">
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
          {step === "completed" && !isLoading ? (
            <div className="w-fit rounded-[1rem] bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 ring-1 ring-amber-100">
              {completedPrompts[passageLanguage]}
            </div>
          ) : null}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 border-t border-slate-100 bg-white p-4 sm:flex-row"
        >
          <input
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder={step === "completed" ? text.completedInputPlaceholder : text.inputPlaceholder}
            disabled={isLoading || step === "completed"}
            className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
          />
          <button
            type="submit"
            disabled={isLoading || step === "completed"}
            className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm shadow-emerald-200 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? text.sending : text.send}
          </button>
        </form>

        {step === "completed" ? (
          <div className="border-t border-slate-100 bg-white p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href={`/match?topic=${encodeURIComponent(selectedEvent.id)}`}
                className="rounded-full bg-emerald-600 px-5 py-3 text-center text-sm font-bold text-white shadow-sm shadow-emerald-200 transition hover:bg-emerald-700"
              >
                Practice Match Game
              </Link>
              <button
                type="button"
                onClick={handleGenerateSummary}
                disabled={isGeneratingSummary}
                className="rounded-full bg-sky-700 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-sky-200 transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isGeneratingSummary ? text.generatingSummary : text.generateSummary}
              </button>
            </div>
            {summaryStatus ? (
              <p className="mt-2 text-center text-xs font-semibold text-emerald-700">
                {summaryStatus}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      {learningSummary ? (
        <div className="xl:col-span-2">
          <LearningSummaryCard summary={learningSummary} language={passageLanguage} />
        </div>
      ) : null}
    </section>
  );
}
