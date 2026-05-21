import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { ChatPanel } from "@/components/chat-panel";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { StudentProfile } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ChatPage() {
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

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f0f9ff_0%,#ffffff_42%,#ecfdf5_100%)] text-slate-950">
      <AppHeader />
      <main className="mx-auto w-full max-w-7xl px-5 py-8 lg:px-8 lg:py-10">
        <div className="mb-6 flex flex-col gap-4 rounded-[1.25rem] border border-white bg-white/75 p-5 shadow-sm shadow-sky-100/70 backdrop-blur md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-sky-700">
              Taiwan history reading room
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Chat with Hank
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
              Read a passage about Taiwan under Japanese rule, then practice main idea,
              evidence, reasoning, and reflection with guided feedback.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold text-slate-600">
            <span className="rounded-full bg-sky-50 px-3 py-2 text-sky-800">Read</span>
            <span className="rounded-full bg-emerald-50 px-3 py-2 text-emerald-800">Think</span>
            <span className="rounded-full bg-amber-50 px-3 py-2 text-amber-800">Review</span>
          </div>
        </div>
        <ChatPanel studentProfile={profile} />
      </main>
    </div>
  );
}
