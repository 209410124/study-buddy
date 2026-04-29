"use client";

import { FormEvent, useState } from "react";
import type { ChatMessage, ChatResponse, ChatStep } from "@/lib/types";

const defaultPassage =
  "From 1895 to 1945, Taiwan was ruled by Japan. During this period, the colonial government built railways, improved ports, and expanded public health programs. These changes made travel and trade easier, but they also helped Japan control Taiwan more closely. Schools taught many students Japanese language and values, while some Taiwanese families hoped education could bring better jobs. At the same time, many people faced unfair treatment and had limited political power. Taiwanese society changed in many ways, and people responded differently to colonial rule.";

const starterPrompt =
  "What is the main idea of this passage? Try answering in one clear sentence.";

const completedPrompt =
  "This practice is complete. Restart when you want to try another passage.";

const stepLabels: Record<ChatStep, string> = {
  mainIdea: "Main idea",
  evidence: "Evidence",
  reasoning: "Reasoning",
  completed: "Completed",
};

const fallbackReplies: Record<ChatStep, string> = {
  mainIdea: "Nice start. Which detail from the passage gives evidence for your answer?",
  evidence:
    "Good evidence. Now explain your reasoning: how does that detail support the main idea?",
  reasoning:
    "Great work. You practiced main idea, evidence, and reasoning. Try using one clear text detail again next time.",
  completed:
    "Great work. You practiced the full reading chain: main idea, evidence, and reasoning. Keep using short evidence from the text, then explain it in your own words.",
};

export function ChatPanel() {
  const [studentName, setStudentName] = useState("Maya");
  const [passage, setPassage] = useState(defaultPassage);
  const [answer, setAnswer] = useState("");
  const [step, setStep] = useState<ChatStep>("mainIdea");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPassage, setIsGeneratingPassage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: starterPrompt,
    },
  ]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedAnswer = answer.trim();

    if (!trimmedAnswer || isLoading || step === "completed") {
      return;
    }

    // Add the student's message immediately so the chat feels responsive.
    setMessages((current) => [...current, { role: "user", content: trimmedAnswer }]);
    setAnswer("");
    setErrorMessage("");
    setIsLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 25000);

      // The browser calls our own API route. The OpenAI key stays on the server.
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          message: trimmedAnswer,
          step,
          passage,
          studentName,
        }),
      });
      window.clearTimeout(timeoutId);

      const data = (await response.json()) as Partial<ChatResponse> & { error?: string };

      if (!response.ok || !data.reply || !data.nextStep) {
        throw new Error(data.error ?? "The chat request failed.");
      }

      const assistantReply = data.reply;
      const nextStep = data.nextStep;

      setMessages((current) => [...current, { role: "assistant", content: assistantReply }]);
      setStep(nextStep);
    } catch {
      // A short fallback keeps the learning flow usable if the API has a temporary issue.
      setErrorMessage("The AI response took too long. You can try again or keep practicing.");
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "I had trouble connecting, but you can keep thinking. " + fallbackReplies[step],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function restartPractice() {
    // Reset only the conversation state; the student name and passage stay editable.
    setStep("mainIdea");
    setAnswer("");
    setErrorMessage("");
    setMessages([{ role: "assistant", content: starterPrompt }]);
  }

  async function generateHistoryPassage() {
    setIsGeneratingPassage(true);
    setErrorMessage("");

    try {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 25000);

      // The frontend calls our own route. The OpenAI API key remains on the server.
      const response = await fetch("/api/generate-passage", {
        method: "POST",
        signal: controller.signal,
      });
      window.clearTimeout(timeoutId);

      const data = (await response.json()) as { passage?: string; error?: string };

      if (!response.ok || !data.passage) {
        throw new Error(data.error ?? "The passage request failed.");
      }

      // Put the generated history passage into the textarea and restart the reading flow.
      setPassage(data.passage);
      setStep("mainIdea");
      setAnswer("");
      setMessages([{ role: "assistant", content: starterPrompt }]);
    } catch {
      setErrorMessage("The history passage took too long to generate. Please try again.");
    } finally {
      setIsGeneratingPassage(false);
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
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
          <label className="text-sm font-semibold text-slate-700" htmlFor="reading-passage">
            Reading passage
          </label>
          <textarea
            id="reading-passage"
            value={passage}
            onChange={(event) => setPassage(event.target.value)}
            rows={10}
            className="mt-2 w-full resize-none rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition focus:border-sky-400 focus:bg-white"
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
              {completedPrompt}
            </div>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 border-t border-sky-100 p-4 sm:flex-row">
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
