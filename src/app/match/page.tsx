import { AppHeader } from "@/components/app-header";
import { MatchGameClient } from "@/components/match-game-client";
import { findMatchQuestionSet } from "@/data/match-questions";

type MatchPageProps = {
  searchParams?: Promise<{
    topic?: string;
  }>;
};

export default async function MatchPage({ searchParams }: MatchPageProps) {
  const params = await searchParams;
  const selectedTopicId = params?.topic ?? "overview";
  const questionSet = findMatchQuestionSet(selectedTopicId);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f0f9ff_0%,#ffffff_42%,#ecfdf5_100%)] text-slate-950">
      <AppHeader />
      <main>
        <MatchGameClient
          questionSet={questionSet}
          selectedTopicId={selectedTopicId}
          selectedTopicTitle={questionSet.title}
        />
      </main>
    </div>
  );
}
