import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { ChatRoomClient } from "@/components/chat-room-client";
import { findHistoryEvent } from "@/data/history-events";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { StudentProfile } from "@/lib/types";

export const dynamic = "force-dynamic";

type ChatPageProps = {
  searchParams?: Promise<{
    topic?: string;
  }>;
};

export default async function ChatPage({ searchParams }: ChatPageProps) {
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

  let { data: profile } = await supabase
    .from("student_profiles")
    .select("id,display_name,username,email,grade_level,role,created_at,updated_at")
    .eq("id", user.id)
    .single<StudentProfile>();

  if (!profile) {
    const fallbackName = user.user_metadata.display_name ?? user.email?.split("@")[0] ?? "Student";

    const { data: createdProfile } = await supabase
      .from("student_profiles")
      .upsert({
        id: user.id,
        display_name: fallbackName,
        username: user.user_metadata.username ?? user.email?.split("@")[0] ?? null,
        email: user.email,
        grade_level: "junior_high",
        role: "student",
      })
      .select("id,display_name,username,email,grade_level,role,created_at,updated_at")
      .single<StudentProfile>();

    profile = createdProfile;
  }

  if (!profile) {
    redirect("/login");
  }

  const params = await searchParams;
  const selectedEvent = findHistoryEvent(params?.topic);

  if (!selectedEvent) {
    redirect("/select-event");
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f0f9ff_0%,#ffffff_42%,#ecfdf5_100%)] text-slate-950">
      <AppHeader />
      <main className="mx-auto w-full max-w-7xl px-5 py-8 lg:px-8 lg:py-10">
        <ChatRoomClient studentProfile={profile} selectedEvent={selectedEvent} />
      </main>
    </div>
  );
}
