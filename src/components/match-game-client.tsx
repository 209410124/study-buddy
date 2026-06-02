"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { MatchPair, MatchQuestionSet } from "@/data/match-questions";

type MatchGameClientProps = {
  questionSet: MatchQuestionSet;
  selectedTopicId: string;
  selectedTopicTitle: string;
};

type Feedback = {
  kind: "ready" | "correct" | "incorrect";
  message: string;
};

function reorderMeanings(pairs: MatchPair[]) {
  // Keep the order stable for hydration while making the meanings different from term order.
  if (pairs.length <= 2) {
    return [...pairs].reverse();
  }

  const midpoint = Math.ceil(pairs.length / 2);
  return [...pairs.slice(midpoint), ...pairs.slice(0, midpoint)];
}

export function MatchGameClient({
  questionSet,
  selectedTopicId,
  selectedTopicTitle,
}: MatchGameClientProps) {
  const shuffledMeanings = useMemo(() => reorderMeanings(questionSet.pairs), [questionSet.pairs]);
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);
  const [selectedMeaningId, setSelectedMeaningId] = useState<string | null>(null);
  const [completedPairs, setCompletedPairs] = useState<string[]>([]);
  const [missedPairIds, setMissedPairIds] = useState<string[]>([]);
  const [attemptCount, setAttemptCount] = useState(0);
  const [showLearningSummary, setShowLearningSummary] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>({
    kind: "ready",
    message: "Choose one card from the left and one card from the right.",
  });

  const totalPairs = questionSet.pairs.length;
  const correctCount = completedPairs.length;
  const isComplete = correctCount === totalPairs;
  const firstTryCorrectCount = completedPairs.filter((id) => !missedPairIds.includes(id)).length;
  const scorePercentage = totalPairs === 0 ? 0 : Math.round((firstTryCorrectCount / totalPairs) * 100);

  function isMatched(pairId: string) {
    return completedPairs.includes(pairId);
  }

  function checkMatch(termId: string, meaningId: string) {
    setAttemptCount((currentCount) => currentCount + 1);

    if (termId === meaningId) {
      setCompletedPairs((currentIds) =>
        currentIds.includes(termId) ? currentIds : [...currentIds, termId],
      );
      setFeedback({
        kind: "correct",
        message: "Correct! Nice match.",
      });
    } else {
      // Remember missed terms so the final card can show first-try accuracy.
      setMissedPairIds((currentIds) =>
        currentIds.includes(termId) ? currentIds : [...currentIds, termId],
      );
      setFeedback({
        kind: "incorrect",
        message: "Not quite. Try again.",
      });
    }

    setSelectedTermId(null);
    setSelectedMeaningId(null);
  }

  function handleTermClick(pairId: string) {
    if (isMatched(pairId)) {
      return;
    }

    setSelectedTermId(pairId);

    if (selectedMeaningId) {
      checkMatch(pairId, selectedMeaningId);
    }
  }

  function handleMeaningClick(pairId: string) {
    if (isMatched(pairId)) {
      return;
    }

    setSelectedMeaningId(pairId);

    if (selectedTermId) {
      checkMatch(selectedTermId, pairId);
    }
  }

  function getCardClasses(pairId: string, selectedId: string | null, color: "sky" | "emerald") {
    const matched = isMatched(pairId);
    const selected = selectedId === pairId;

    if (matched) {
      return "border-emerald-300 bg-emerald-50 text-emerald-950 ring-4 ring-emerald-100";
    }

    if (selected) {
      return color === "sky"
        ? "border-sky-400 bg-sky-50 text-sky-950 ring-4 ring-sky-100"
        : "border-emerald-400 bg-emerald-50 text-emerald-950 ring-4 ring-emerald-100";
    }

    return "border-slate-200 bg-white text-slate-900 hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100";
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-8 lg:px-8 lg:py-10">
      <div className="mb-6 rounded-[1.25rem] border border-white bg-white/85 p-5 shadow-sm shadow-sky-100/70 backdrop-blur">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-sky-700">
              History Review
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Match Game
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
              Match the historical concept with the correct meaning.
            </p>
          </div>
          <span className="w-fit rounded-full bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-800 ring-1 ring-sky-100">
            Current topic: {selectedTopicTitle}
          </span>
        </div>
        <p className="mt-4 rounded-[1rem] bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 ring-1 ring-emerald-100">
          Choose one card from the left and one card from the right.
        </p>
      </div>

      <div className="mb-5 flex flex-col gap-3 rounded-[1rem] border border-slate-200 bg-white px-5 py-4 shadow-sm shadow-slate-100 sm:flex-row sm:items-center sm:justify-between">
        <p
          className={`text-sm font-bold ${
            feedback.kind === "incorrect"
              ? "text-amber-700"
              : feedback.kind === "correct"
                ? "text-emerald-700"
                : "text-slate-700"
          }`}
        >
          {isComplete ? "All matches completed. Nice work." : feedback.message}
        </p>
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-700">
            Progress: {correctCount} / {totalPairs}
          </span>
          <span className="rounded-full bg-sky-50 px-3 py-1.5 text-sky-800 ring-1 ring-sky-100">
            Attempts: {attemptCount}
          </span>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-base font-bold text-slate-950">Historical Terms</h2>
          <div className="grid gap-3">
            {questionSet.pairs.map((pair) => (
              <button
                key={pair.id}
                type="button"
                disabled={isMatched(pair.id)}
                onClick={() => handleTermClick(pair.id)}
                className={`min-h-[88px] rounded-[1rem] border px-5 py-4 text-left text-lg font-bold leading-7 shadow-sm transition disabled:cursor-default ${getCardClasses(
                  pair.id,
                  selectedTermId,
                  "sky",
                )}`}
              >
                {pair.term}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-base font-bold text-slate-950">Meanings</h2>
          <div className="grid gap-3">
            {shuffledMeanings.map((pair) => (
              <button
                key={pair.id}
                type="button"
                disabled={isMatched(pair.id)}
                onClick={() => handleMeaningClick(pair.id)}
                className={`min-h-[88px] rounded-[1rem] border px-5 py-4 text-left text-base font-semibold leading-7 shadow-sm transition disabled:cursor-default ${getCardClasses(
                  pair.id,
                  selectedMeaningId,
                  "emerald",
                )}`}
              >
                {pair.meaning}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isComplete ? (
        <div className="mt-6 rounded-[1.25rem] border border-emerald-100 bg-emerald-50/85 p-5 shadow-sm shadow-emerald-100">
          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-emerald-800 ring-1 ring-emerald-100">
            Score: {scorePercentage}%
          </span>
          <h2 className="mt-3 text-xl font-bold text-emerald-950">
            You matched {correctCount} / {totalPairs} pairs.
          </h2>
          <p className="mt-2 text-sm leading-6 text-emerald-900">
            First-try matches: {firstTryCorrectCount} / {totalPairs}. You reviewed key
            terms, meanings, causes, and historical ideas after chatting with Hank.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setShowLearningSummary(true)}
              className="rounded-full bg-sky-700 px-5 py-3 text-center text-sm font-bold text-white shadow-sm shadow-sky-200 transition hover:bg-sky-800"
            >
              Generate Learning Summary
            </button>
            <Link
              href={`/chat?topic=${encodeURIComponent(selectedTopicId)}`}
              className="rounded-full bg-white px-5 py-3 text-center text-sm font-bold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
            >
              Back to Chat
            </Link>
            <Link
              href="/select-event"
              className="rounded-full bg-white px-5 py-3 text-center text-sm font-bold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
            >
              Choose Another Event
            </Link>
          </div>
          {showLearningSummary ? (
            <div className="mt-4 rounded-[1rem] bg-white px-4 py-3 text-sm leading-6 text-slate-700 ring-1 ring-emerald-100">
              Learning summary: You reviewed {selectedTopicTitle} by matching important
              historical terms with short meanings. Next, try explaining one cause and one
              effect from this topic in your own words.
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
