"use client";

import { FormEvent, useState } from "react";
import type { ChatMessage, ChatResponse, ChatStep, PassageLanguage } from "@/lib/types";

const defaultPassages: Record<PassageLanguage, string> = {
  en: "From 1895 to 1945, Taiwan was ruled by Japan. During this period, the colonial government built railways, improved ports, and expanded public health programs. These changes made travel and trade easier, but they also helped Japan control Taiwan more closely. Schools taught many students Japanese language and values, while some Taiwanese families hoped education could bring better jobs. At the same time, many people faced unfair treatment and had limited political power. Taiwanese society changed in many ways, and people responded differently to colonial rule.",
  zh: "\u5f9e1895\u5e74\u52301945\u5e74\uff0c\u53f0\u7063\u53d7\u5230\u65e5\u672c\u7d71\u6cbb\u3002\u5728\u9019\u6bb5\u6642\u671f\uff0c\u6b96\u6c11\u653f\u5e9c\u8208\u5efa\u9435\u8def\u3001\u6539\u5584\u6e2f\u53e3\uff0c\u4e5f\u63a8\u52d5\u516c\u5171\u885b\u751f\u653f\u7b56\u3002\u9019\u4e9b\u6539\u8b8a\u8b93\u4ea4\u901a\u548c\u8cbf\u6613\u66f4\u65b9\u4fbf\uff0c\u4f46\u4e5f\u5e6b\u52a9\u65e5\u672c\u66f4\u6709\u6548\u5730\u63a7\u5236\u53f0\u7063\u3002\u5b78\u6821\u6559\u5c0e\u8a31\u591a\u5b78\u751f\u65e5\u8a9e\u548c\u65e5\u672c\u50f9\u503c\u89c0\uff0c\u6709\u4e9b\u53f0\u7063\u5bb6\u5ead\u5e0c\u671b\u6559\u80b2\u80fd\u5e36\u4f86\u8f03\u597d\u7684\u5de5\u4f5c\u6a5f\u6703\u3002\u53e6\u4e00\u65b9\u9762\uff0c\u8a31\u591a\u4eba\u4ecd\u7136\u9762\u5c0d\u4e0d\u516c\u5e73\u5f85\u9047\uff0c\u4e5f\u7f3a\u5c11\u653f\u6cbb\u6b0a\u529b\u3002\u53f0\u7063\u793e\u6703\u56e0\u6b64\u51fa\u73fe\u8a31\u591a\u8b8a\u5316\uff0c\u800c\u4e0d\u540c\u7684\u4eba\u4e5f\u7528\u4e0d\u540c\u65b9\u5f0f\u56de\u61c9\u6b96\u6c11\u7d71\u6cbb\u3002",
};

const starterPrompts: Record<PassageLanguage, string> = {
  en: "What is the main idea of this passage? Try answering in one clear sentence.",
  zh: "\u9019\u7bc7\u6587\u7ae0\u7684\u4e3b\u65e8\u662f\u4ec0\u9ebc\uff1f\u8acb\u8a66\u8457\u7528\u4e00\u53e5\u6e05\u695a\u7684\u8a71\u56de\u7b54\u3002",
};

const completedPrompts: Record<PassageLanguage, string> = {
  en: "This practice is complete. Restart when you want to try another passage.",
  zh: "\u9019\u6b21\u7df4\u7fd2\u5b8c\u6210\u4e86\u3002\u60f3\u7df4\u7fd2\u53e6\u4e00\u7bc7\u6587\u7ae0\u6642\uff0c\u53ef\u4ee5\u91cd\u65b0\u958b\u59cb\u3002",
};

const stepLabels: Record<ChatStep, string> = {
  mainIdea: "Main idea",
  evidence: "Evidence",
  reasoning: "Reasoning",
  completed: "Completed",
};

const fallbackReplies: Record<PassageLanguage, Record<ChatStep, string>> = {
  en: {
    mainIdea: "Nice start. Which detail from the passage gives evidence for your answer?",
    evidence:
      "Good evidence. Now explain your reasoning: how does that detail support the main idea?",
    reasoning:
      "Great work. You practiced main idea, evidence, and reasoning. Try using one clear text detail again next time.",
    completed:
      "Great work. You practiced the full reading chain: main idea, evidence, and reasoning. Keep using short evidence from the text, then explain it in your own words.",
  },
  zh: {
    mainIdea: "\u5f88\u597d\u7684\u958b\u59cb\u3002\u6587\u7ae0\u4e2d\u54ea\u4e00\u500b\u7d30\u7bc0\u53ef\u4ee5\u652f\u6301\u4f60\u7684\u7b54\u6848\uff1f",
    evidence:
      "\u8b49\u64da\u627e\u5f97\u4e0d\u932f\u3002\u73fe\u5728\u8acb\u8aaa\u660e\u4f60\u7684\u63a8\u8ad6\uff1a\u9019\u500b\u7d30\u7bc0\u5982\u4f55\u652f\u6301\u4e3b\u65e8\uff1f",
    reasoning:
      "\u505a\u5f97\u5f88\u597d\u3002\u4f60\u5df2\u7d93\u7df4\u7fd2\u4e86\u4e3b\u65e8\u3001\u8b49\u64da\u548c\u63a8\u8ad6\u3002\u4e0b\u6b21\u4e5f\u8a66\u8457\u5f15\u7528\u4e00\u500b\u6e05\u695a\u7684\u6587\u7ae0\u7d30\u7bc0\u3002",
    completed:
      "\u505a\u5f97\u5f88\u597d\u3002\u4f60\u5b8c\u6210\u4e86\u4e3b\u65e8\u3001\u8b49\u64da\u548c\u63a8\u8ad6\u7684\u95b1\u8b80\u7df4\u7fd2\u3002\u8a18\u5f97\u7528\u6587\u7ae0\u7d30\u7bc0\u652f\u6301\u81ea\u5df1\u7684\u60f3\u6cd5\u3002",
  },
};

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
      setErrorMessage(
        passageLanguage === "zh"
          ? "\u9023\u7dda\u82b1\u4e86\u592a\u4e45\u6642\u9593\u3002\u4f60\u53ef\u4ee5\u518d\u8a66\u4e00\u6b21\uff0c\u6216\u7e7c\u7e8c\u7df4\u7fd2\u3002"
          : "The AI response took too long. You can try again or keep practicing.",
      );
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            (passageLanguage === "zh"
              ? "\u9023\u7dda\u6709\u9ede\u554f\u984c\uff0c\u4f46\u4f60\u53ef\u4ee5\u7e7c\u7e8c\u601d\u8003\u3002"
              : "I had trouble connecting, but you can keep thinking. ") +
            fallbackReplies[passageLanguage][step],
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
      setErrorMessage(
        passageLanguage === "zh"
          ? "\u6b77\u53f2\u6587\u7ae0\u7522\u751f\u82b1\u4e86\u592a\u4e45\u6642\u9593\u3002\u8acb\u518d\u8a66\u4e00\u6b21\u3002"
          : "The history passage took too long to generate. Please try again.",
      );
    } finally {
      setIsGeneratingPassage(false);
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <aside className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm">
        <div>
          <label className="text-sm font-semibold text-slate-700" htmlFor="student-name">
            Student name
          </label>
          <input
            id="student-name"
            value={studentName}
            onChange={(event) => setStudentName(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-400 focus:bg-white"
            placeholder="Enter your name"
          />
        </div>

        <div className="mt-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="text-sm font-semibold text-slate-700" htmlFor="reading-passage">
              Reading passage
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
            placeholder="Paste a short reading passage"
          />
        </div>

        <button
          type="button"
          onClick={generateHistoryPassage}
          disabled={isGeneratingPassage}
          className="mt-5 w-full rounded-full bg-sky-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isGeneratingPassage ? "Generating..." : "Generate History Passage"}
        </button>

        <button
          type="button"
          onClick={restartPractice}
          className="mt-3 w-full rounded-full border border-sky-200 bg-white px-4 py-3 text-sm font-semibold text-sky-800 transition hover:bg-sky-50"
        >
          Restart practice
        </button>
      </aside>

      <div className="overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-sm">
        <div className="border-b border-sky-100 bg-sky-50 px-5 py-4">
          <h2 className="text-lg font-bold text-slate-950">Reading Coach Chat</h2>
          <p className="mt-1 text-sm text-slate-600">
            Step-by-step practice: main idea, evidence, reasoning, completed.
          </p>
          <p className="mt-2 w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold text-sky-800">
            Current step: {stepLabels[step]}
          </p>
        </div>

        <div className="min-h-[420px] space-y-4 p-5">
          {messages.map((item, index) => (
            <div
              key={`${item.role}-${index}`}
              className={`max-w-[88%] rounded-3xl px-4 py-3 text-sm leading-6 ${
                item.role === "user"
                  ? "ml-auto bg-sky-700 text-white"
                  : "bg-emerald-50 text-slate-800"
              }`}
            >
              {item.content}
            </div>
          ))}
          {isLoading ? (
            <div className="w-fit rounded-3xl bg-emerald-50 px-4 py-3 text-sm text-slate-600">
              Thinking...
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
            placeholder={step === "completed" ? "Restart to practice again" : "Type your answer here"}
            disabled={isLoading || step === "completed"}
            className="min-w-0 flex-1 rounded-full border border-sky-100 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-400"
          />
          <button
            type="submit"
            disabled={isLoading || step === "completed"}
            className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Sending..." : "Send Answer"}
          </button>
        </form>
      </div>
    </section>
  );
}
