import { notFound, redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { HistoryDetailClient } from "@/components/history-detail-client";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ChatMessage, LearningSummary, LearningSummaryRow, StudentProfile } from "@/lib/types";

export const dynamic = "force-dynamic";

type HistoryDetailPageProps = {
  params: Promise<{
    sessionId: string;
  }>;
};

function normalizeConversation(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is ChatMessage => {
    if (!item || typeof item !== "object") {
      return false;
    }

    const message = item as Partial<ChatMessage>;
    return (
      (message.role === "user" || message.role === "assistant") &&
      typeof message.content === "string"
    );
  });
}

export default async function HistoryDetailPage({ params }: HistoryDetailPageProps) {
  const { sessionId } = await params;
  let supabase;

  try {
    supabase = await createSupabaseServerClient();
  } catch {
    redirect("/login");
  }

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    redirect("/login");
  }

  const [{ data: profile }, { data: session }, { data: summaryRow }] = await Promise.all([
    supabase
      .from("student_profiles")
      .select("id,display_name,username,email,grade_level,role,created_at,updated_at")
      .eq("id", user.id)
      .single<StudentProfile>(),
    supabase
      .from("learning_sessions")
      .select(
        "id,title,topic,summary,passage,conversation,reading_check_count,passage_language,created_at,completed_at",
      )
      .eq("id", sessionId)
      .eq("student_id", user.id)
      .maybeSingle(),
    supabase
      .from("learning_summaries")
      .select(
        "id,student_id,session_id,practiced_topic,practiced_skills,strength,weakness,next_step,support_level,simple_score,created_at,updated_at",
      )
      .eq("session_id", sessionId)
      .eq("student_id", user.id)
      .maybeSingle<LearningSummaryRow>(),
  ]);

  if (!profile) {
    redirect("/login");
  }

  if (!session) {
    notFound();
  }

  const conversation = normalizeConversation(session.conversation);
  const learningSummary: LearningSummary | null = summaryRow
    ? {
        practiced_topic: summaryRow.practiced_topic,
        practiced_skills: summaryRow.practiced_skills,
        strength: summaryRow.strength,
        weakness: summaryRow.weakness,
        next_step: summaryRow.next_step,
        support_level: summaryRow.support_level,
        simple_score: summaryRow.simple_score,
      }
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50 text-slate-950">
      <AppHeader />
      <HistoryDetailClient
        profile={profile}
        session={session}
        conversation={conversation}
        learningSummary={learningSummary}
      />
    </div>
  );
}
