import { notFound, redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { HistoryDetailClient } from "@/components/history-detail-client";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ChatMessage, StudentProfile } from "@/lib/types";

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

  const [{ data: profile }, { data: session }] = await Promise.all([
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
  ]);

  if (!profile) {
    redirect("/login");
  }

  if (!session) {
    notFound();
  }

  const conversation = normalizeConversation(session.conversation);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50 text-slate-950">
      <AppHeader />
      <HistoryDetailClient profile={profile} session={session} conversation={conversation} />
    </div>
  );
}
