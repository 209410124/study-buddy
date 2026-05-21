import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { StudyBuddyAvatar } from "@/components/study-buddy-avatar";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ChatMessage, StudentProfile } from "@/lib/types";

export const dynamic = "force-dynamic";

type HistoryDetailPageProps = {
  params: Promise<{
    sessionId: string;
  }>;
};

function formatDate(value: string | null) {
  if (!value) {
    return "Not finished";
  }

  return new Date(value).toLocaleString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

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
      <main className="mx-auto grid w-full max-w-5xl gap-6 px-6 py-10">
        <Link
          href="/history"
          className="w-fit rounded-full border border-sky-100 bg-white px-4 py-2 text-sm font-bold text-sky-800 shadow-sm transition hover:bg-sky-50"
        >
          Back to history
        </Link>

        <section className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-700">
            Conversation record
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">
            {session.title ?? "Taiwan history reading practice"}
          </h1>
          <div className="mt-4 flex flex-wrap gap-2 text-sm font-semibold">
            <span className="rounded-full bg-sky-50 px-3 py-1.5 text-sky-800">
              {profile.display_name}
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-800">
              {session.reading_check_count ?? 0} reading checks
            </span>
            <span className="rounded-full bg-amber-50 px-3 py-1.5 text-amber-800">
              {formatDate(session.completed_at)}
            </span>
          </div>
          {session.summary ? (
            <p className="mt-4 text-sm leading-6 text-slate-600">{session.summary}</p>
          ) : null}
        </section>

        <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Reading passage</h2>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">
              {session.passage ?? "No passage saved."}
            </p>
          </article>

          <article className="overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="text-xl font-bold text-slate-950">Full conversation</h2>
            </div>
            <div className="space-y-4 bg-slate-50/70 p-5">
              {conversation.length > 0 ? (
                conversation.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`flex items-end gap-3 ${
                      message.role === "user"
                        ? "ml-auto max-w-[88%] justify-end"
                        : "max-w-[88%] justify-start"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <StudyBuddyAvatar size={34} className="mb-1 shrink-0" />
                    ) : null}
                    <div
                      className={`rounded-[1.1rem] px-4 py-3 text-sm leading-6 shadow-sm ${
                        message.role === "user"
                          ? "bg-sky-700 text-white shadow-sky-100"
                          : "bg-white text-slate-800 ring-1 ring-emerald-100"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-2xl bg-white p-4 text-sm text-slate-600 ring-1 ring-slate-100">
                  No conversation was saved for this session.
                </p>
              )}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
