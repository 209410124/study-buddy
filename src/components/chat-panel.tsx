"use client";

import { FormEvent, useState } from "react";
import { StudyBuddyAvatar } from "@/components/study-buddy-avatar";
import type { ChatMessage, ChatResponse, ChatStep, PassageLanguage } from "@/lib/types";

const defaultPassages: Record<PassageLanguage, string> = {
  en: "From 1895 to 1945, Taiwan was ruled by Japan. During this period, the colonial government built railways, improved ports, and expanded public health programs. These changes made travel and trade easier, but they also helped Japan control Taiwan more closely. Schools taught many students Japanese language and values, while some Taiwanese families hoped education could bring better jobs. At the same time, many people faced unfair treatment and had limited political power. Taiwanese society changed in many ways, and people responded differently to colonial rule.",
  zh: "\u5f9e1895\u5e74\u52301945\u5e74\uff0c\u53f0\u7063\u53d7\u5230\u65e5\u672c\u7d71\u6cbb\u3002\u5728\u9019\u6bb5\u6642\u671f\uff0c\u6b96\u6c11\u653f\u5e9c\u8208\u5efa\u9435\u8def\u3001\u6539\u5584\u6e2f\u53e3\uff0c\u4e5f\u63a8\u52d5\u516c\u5171\u885b\u751f\u653f\u7b56\u3002\u9019\u4e9b\u6539\u8b8a\u8b93\u4ea4\u901a\u548c\u8cbf\u6613\u66f4\u65b9\u4fbf\uff0c\u4f46\u4e5f\u5e6b\u52a9\u65e5\u672c\u66f4\u6709\u6548\u5730\u63a7\u5236\u53f0\u7063\u3002\u5b78\u6821\u6559\u5c0e\u8a31\u591a\u5b78\u751f\u65e5\u8a9e\u548c\u65e5\u672c\u50f9\u503c\u89c0\uff0c\u6709\u4e9b\u53f0\u7063\u5bb6\u5ead\u5e0c\u671b\u6559\u80b2\u80fd\u5e36\u4f86\u8f03\u597d\u7684\u5de5\u4f5c\u6a5f\u6703\u3002\u53e6\u4e00\u65b9\u9762\uff0c\u8a31\u591a\u4eba\u4ecd\u7136\u9762\u5c0d\u4e0d\u516c\u5e73\u5f85\u9047\uff0c\u4e5f\u7f3a\u5c11\u653f\u6cbb\u6b0a\u529b\u3002\u53f0\u7063\u793e\u6703\u56e0\u6b64\u51fa\u73fe\u8a31\u591a\u8b8a\u5316\uff0c\u800c\u4e0d\u540c\u7684\u4eba\u4e5f\u7528\u4e0d\u540c\u65b9\u5f0f\u56de\u61c9\u6b96\u6c11\u7d71\u6cbb\u3002",
};

const starterPrompts: Record<PassageLanguage, string> = {
  en: "Let's start with the big idea. What do you think this passage is mostly about?",
  zh: "\u6211\u5011\u5148\u770b\u5927\u610f\u3002\u4f60\u89ba\u5f97\u9019\u7bc7\u6587\u7ae0\u4e3b\u8981\u5728\u8aaa\u4ec0\u9ebc\uff1f",
};

const completedPrompts: Record<PassageLanguage, string> = {
  en: "You can keep reflecting, or restart when you want to try another passage.",
  zh: "\u4f60\u53ef\u4ee5\u7e7c\u7e8c\u53cd\u601d\uff0c\u6216\u8005\u91cd\u65b0\u958b\u59cb\u7df4\u7fd2\u53e6\u4e00\u7bc7\u6587\u7ae0\u3002",
};

const stepLabels: Record<PassageLanguage, Record<ChatStep, string>> = {
  en: {
    mainIdea: "Main idea",
    evidence: "Evidence",
    reasoning: "Reasoning",
    reflection: "Reflection",
    completed: "Completed",
  },
  zh: {
    mainIdea: "\u4e3b\u65e8",
    evidence: "\u8b49\u64da",
    reasoning: "\u63a8\u8ad6",
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
    restart: string;
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
  }
> = {
  en: {
    studentName: "Student name",
    studentNamePlaceholder: "Enter your name",
    readingPassage: "Reading passage",
    passagePlaceholder: "Paste a short reading passage",
    generatePassage: "Generate History Passage",
    generating: "Generating...",
    restart: "Restart practice",
    chatTitle: "Chat with Hank",
    stepPractice: "Step-by-step practice: main idea, evidence, reasoning, reflection.",
    currentStep: "Current step",
    thinking: "Thinking...",
    inputPlaceholder: "Type your thought here",
    completedInputPlaceholder: "Restart to practice again",
    send: "Send",
    sending: "Sending...",
    chatTimeoutError: "The AI response took too long. You can try again or keep practicing.",
    passageTimeoutError: "The history passage took too long to generate. Please try again.",
  },
  zh: {
    studentName: "\u5b78\u751f\u540d\u5b57",
    studentNamePlaceholder: "\u8f38\u5165\u4f60\u7684\u540d\u5b57",
    readingPassage: "\u95b1\u8b80\u6587\u7ae0",
    passagePlaceholder: "\u8cbc\u4e0a\u4e00\u7bc7\u77ed\u77ed\u7684\u95b1\u8b80\u6587\u7ae0",
    generatePassage: "\u7522\u751f\u6b77\u53f2\u6587\u7ae0",
    generating: "\u7522\u751f\u4e2d...",
    restart: "\u91cd\u65b0\u958b\u59cb\u7df4\u7fd2",
    chatTitle: "\u548c Hank \u804a\u5929",
    stepPractice: "\u4e00\u6b65\u4e00\u6b65\u7df4\u7fd2\uff1a\u4e3b\u65e8\u3001\u8b49\u64da\u3001\u63a8\u8ad6\u3001\u53cd\u601d\u3002",
    currentStep: "\u76ee\u524d\u6b65\u9a5f",
    thinking: "\u601d\u8003\u4e2d...",
    inputPlaceholder: "\u5728\u9019\u88e1\u8f38\u5165\u4f60\u7684\u60f3\u6cd5",
    completedInputPlaceholder: "\u91cd\u65b0\u958b\u59cb\u5f8c\u53ef\u4ee5\u7e7c\u7e8c\u7df4\u7fd2",
    send: "\u9001\u51fa",
    sending: "\u9001\u51fa\u4e2d...",
    chatTimeoutError: "\u9023\u7dda\u82b1\u4e86\u592a\u4e45\u6642\u9593\u3002\u4f60\u53ef\u4ee5\u518d\u8a66\u4e00\u6b21\uff0c\u6216\u7e7c\u7e8c\u7df4\u7fd2\u3002",
    passageTimeoutError: "\u6b77\u53f2\u6587\u7ae0\u7522\u751f\u82b1\u4e86\u592a\u4e45\u6642\u9593\u3002\u8acb\u518d\u8a66\u4e00\u6b21\u3002",
  },
};

const fallbackReplies: Record<PassageLanguage, Record<ChatStep, string>> = {
  en: {
    mainIdea: "Nice start. Which detail from the passage gives evidence for your answer?",
    evidence:
      "Good evidence. How does that detail support the main idea?",
    reasoning:
      "Nice thinking. What does this passage make you wonder about life in Taiwan from 1895 to 1945?",
    reflection:
      "That makes sense. Which idea from the passage feels most important to remember?",
    completed:
      "Great work. What is one idea from the passage that you want to remember?",
  },
  zh: {
    mainIdea: "\u5f88\u597d\u7684\u958b\u59cb\u3002\u6587\u7ae0\u4e2d\u54ea\u4e00\u500b\u7d30\u7bc0\u53ef\u4ee5\u652f\u6301\u4f60\u7684\u7b54\u6848\uff1f",
    evidence:
      "\u8b49\u64da\u627e\u5f97\u4e0d\u932f\u3002\u73fe\u5728\u8acb\u8aaa\u660e\u4f60\u7684\u63a8\u8ad6\uff1a\u9019\u500b\u7d30\u7bc0\u5982\u4f55\u652f\u6301\u4e3b\u65e8\uff1f",
    reasoning:
      "\u60f3\u5f97\u4e0d\u932f\u3002\u9019\u7bc7\u6587\u7ae0\u8b93\u4f60\u5c0d1895\u52301945\u5e74\u7684\u53f0\u7063\u60f3\u5230\u4ec0\u9ebc\uff1f",
    reflection:
      "\u9019\u6a23\u60f3\u5f88\u6709\u9053\u7406\u3002\u6587\u7ae0\u4e2d\u54ea\u500b\u60f3\u6cd5\u6700\u503c\u5f97\u8a18\u4f4f\uff1f",
    completed:
      "\u505a\u5f97\u5f88\u597d\u3002\u4f60\u6700\u60f3\u8a18\u4f4f\u6587\u7ae0\u4e2d\u7684\u54ea\u500b\u60f3\u6cd5\uff1f",
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

export function ChatPanel() {
  const [studentName, setStudentName] = useState("Maya");
  const [passageLanguage, setPassageLanguage] = useState<PassageLanguage>("en");
  const [passage, setPassage] = useState(defaultPassages.en);
  const [answer, setAnswer] = useState("");
  const [step, setStep] = useState<ChatStep>("mainIdea");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPassage, setIsGeneratingPassage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: starterPrompts.en,
    },
  ]);
  const text = uiText[passageLanguage];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedAnswer = answer.trim();

    if (!trimmedAnswer || isLoading || step === "completed") {
      return;
    }

    setMessages((current) => [...current, { role: "user", content: trimmedAnswer }]);
    setAnswer("");
    setErrorMessage("");
    setIsLoading(true);

    try {
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
          history: messages.slice(-6),
        }),
      });
      window.clearTimeout(timeoutId);

      const data = (await response.json()) as Partial<ChatResponse> & { error?: string };

      if (!response.ok || !data.reply || !data.nextStep) {
        throw new Error(data.error ?? "The chat request failed.");
      }

      setMessages((current) => [...current, { role: "assistant", content: data.reply ?? "" }]);
      setStep(data.nextStep);
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

  function restartPractice() {
    setStep("mainIdea");
    setAnswer("");
    setErrorMessage("");
    setMessages([{ role: "assistant", content: starterPrompts[passageLanguage] }]);
  }

  function handleLanguageChange(nextLanguage: PassageLanguage) {
    setPassageLanguage(nextLanguage);
    setPassage(defaultPassages[nextLanguage]);
    setStep("mainIdea");
    setAnswer("");
    setErrorMessage("");
    setIsLoading(false);
    setIsGeneratingPassage(false);
    setMessages([{ role: "assistant", content: starterPrompts[nextLanguage] }]);
  }

  async function generateHistoryPassage() {
    setIsGeneratingPassage(true);
    setErrorMessage("");

    try {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 25000);

      const response = await fetch("/api/generate-passage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({ passageLanguage }),
      });
      window.clearTimeout(timeoutId);

      const data = (await response.json()) as { passage?: string; error?: string };

      if (!response.ok || !data.passage) {
        throw new Error(data.error ?? "The passage request failed.");
      }

      setPassage(data.passage);
      setStep("mainIdea");
      setAnswer("");
      setMessages([{ role: "assistant", content: starterPrompts[passageLanguage] }]);
    } catch {
      setErrorMessage(text.passageTimeoutError);
    } finally {
      setIsGeneratingPassage(false);
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <aside className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm">
        <div>
          <label className="text-sm font-semibold text-slate-700" htmlFor="student-name">
            {text.studentName}
          </label>
          <input
            id="student-name"
            value={studentName}
            onChange={(event) => setStudentName(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-400 focus:bg-white"
            placeholder={text.studentNamePlaceholder}
          />
        </div>

        <div className="mt-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="text-sm font-semibold text-slate-700" htmlFor="reading-passage">
              {text.readingPassage}
            </label>
            <div className="grid grid-cols-2 rounded-full border border-sky-100 bg-sky-50 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleLanguageChange("en")}
                aria-pressed={passageLanguage === "en"}
                className={`rounded-full px-3 py-2 transition ${
                  passageLanguage === "en" ? "bg-white text-sky-800 shadow-sm" : "text-slate-600"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange("zh")}
                aria-pressed={passageLanguage === "zh"}
                className={`rounded-full px-3 py-2 transition ${
                  passageLanguage === "zh" ? "bg-white text-sky-800 shadow-sm" : "text-slate-600"
                }`}
              >
                {"\u4e2d\u6587"}
              </button>
            </div>
          </div>
          <textarea
            id="reading-passage"
            value={passage}
            onChange={(event) => setPassage(event.target.value)}
            rows={16}
            className="mt-3 min-h-[360px] w-full resize-y rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-base leading-7 text-slate-950 outline-none transition focus:border-sky-400 focus:bg-white"
            placeholder={text.passagePlaceholder}
          />
        </div>

        <button
          type="button"
          onClick={generateHistoryPassage}
          disabled={isGeneratingPassage}
          className="mt-5 w-full rounded-full bg-sky-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isGeneratingPassage ? text.generating : text.generatePassage}
        </button>

        <button
          type="button"
          onClick={restartPractice}
          className="mt-3 w-full rounded-full border border-sky-200 bg-white px-4 py-3 text-sm font-semibold text-sky-800 transition hover:bg-sky-50"
        >
          {text.restart}
        </button>
      </aside>

      <div className="overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-sm">
        <div className="border-b border-sky-100 bg-sky-50 px-5 py-4">
          <h2 className="text-lg font-bold text-slate-950">{text.chatTitle}</h2>
          <p className="mt-1 text-sm text-slate-600">
            {text.stepPractice}
          </p>
          <p className="mt-2 w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold text-sky-800">
            {text.currentStep}: {stepLabels[passageLanguage][step]}
          </p>
        </div>

        <div className="min-h-[420px] space-y-4 p-5">
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
                className={`rounded-3xl px-4 py-3 text-sm leading-6 ${
                  item.role === "user"
                    ? "bg-sky-700 text-white"
                    : "bg-emerald-50 text-slate-800"
                }`}
              >
                {item.content}
              </div>
            </div>
          ))}
          {isLoading ? (
            <div className="flex max-w-[88%] items-end gap-3">
              <StudyBuddyAvatar size={34} className="mb-1 shrink-0" />
              <div className="w-fit rounded-3xl bg-emerald-50 px-4 py-3 text-sm text-slate-600">
                {text.thinking}
              </div>
            </div>
          ) : null}
          {errorMessage ? (
            <div className="rounded-3xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}
          {step === "completed" && !isLoading ? (
            <div className="w-fit rounded-3xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {completedPrompts[passageLanguage]}
            </div>
          ) : null}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 border-t border-sky-100 p-4 sm:flex-row"
        >
          <input
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder={step === "completed" ? text.completedInputPlaceholder : text.inputPlaceholder}
            disabled={isLoading || step === "completed"}
            className="min-w-0 flex-1 rounded-full border border-sky-100 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-400"
          />
          <button
            type="submit"
            disabled={isLoading || step === "completed"}
            className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? text.sending : text.send}
          </button>
        </form>
      </div>
    </section>
  );
}
