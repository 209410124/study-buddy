import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { HistoryPageHeading } from "@/components/history-page-heading";
import { HistoryList } from "@/components/history-list";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  ChatMessage,
  ConversationHistorySession,
  LearningProfileRow,
  StudentProfile,
} from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
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

  const { data: profile } = await supabase
    .from("student_profiles")
    .select("id,display_name,username,email,grade_level,role,created_at,updated_at")
    .eq("id", user.id)
    .single<StudentProfile>();

  if (!profile) {
    redirect("/login");
  }

  const [{ count: totalSessions }, { data: learningProfile }, { data: sessions }] =
    await Promise.all([
      supabase
        .from("learning_sessions")
        .select("id", { count: "exact", head: true })
        .eq("student_id", user.id)
        .not("completed_at", "is", null),
      supabase
        .from("learning_profiles")
        .select("id,student_id,common_weakness,recently_practiced_skill,support_level,updated_at")
        .eq("student_id", user.id)
        .maybeSingle<LearningProfileRow>(),
      supabase
        .from("learning_sessions")
        .select(
          "id,title,topic,summary,passage,conversation,reading_check_count,passage_language,created_at,completed_at",
        )
        .eq("student_id", user.id)
        .not("completed_at", "is", null)
        .order("completed_at", { ascending: false })
        .limit(10),
    ]);

  const latestSessions: ConversationHistorySession[] = (sessions ?? []).map((session) => ({
    id: session.id,
    title: session.title,
    topic: session.topic,
    summary: session.summary,
    passage: session.passage,
    conversation: Array.isArray(session.conversation)
      ? (session.conversation as ChatMessage[])
      : [],
    reading_check_count: session.reading_check_count,
    passage_language: session.passage_language === "zh" ? "zh" : "en",
    created_at: session.created_at,
    completed_at: session.completed_at,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50 text-slate-950">
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <HistoryPageHeading />
        <HistoryList
          studentProfile={profile}
          learningProfile={learningProfile}
          totalSessions={totalSessions ?? 0}
          latestSessions={latestSessions}
        />
      </main>
    </div>
  );
}
