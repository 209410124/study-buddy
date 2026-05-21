import Link from "next/link";
import type { ConversationHistorySession, LearningProfileRow, StudentProfile } from "@/lib/types";

type HistoryListProps = {
  studentProfile: StudentProfile;
  learningProfile: LearningProfileRow | null;
  totalSessions: number;
  latestSessions: ConversationHistorySession[];
};

function formatDate(value: string | null) {
  if (!value) {
    return "Not finished";
  }

  return new Date(value).toISOString().slice(0, 10);
}

function formatSupportLevel(value: string | null | undefined) {
  if (!value) {
    return "Medium";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function HistoryList({
  studentProfile,
  learningProfile,
  totalSessions,
  latestSessions,
}: HistoryListProps) {
  const commonWeakness = learningProfile?.common_weakness ?? "Keep practicing evidence and reasoning";
  const recentlyPracticedSkill =
    learningProfile?.recently_practiced_skill ?? "Taiwan history reading practice";
  const supportLevel = formatSupportLevel(learningProfile?.support_level);

  return (
    <section className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Total completed conversations</p>
          <p className="mt-3 text-4xl font-bold text-sky-800">{totalSessions}</p>
        </article>
        <article className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Most common weakness</p>
          <p className="mt-3 text-xl font-bold text-slate-950">{commonWeakness}</p>
        </article>
        <article className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Support level</p>
          <p className="mt-3 text-xl font-bold text-emerald-700">{supportLevel}</p>
        </article>
      </div>

      <article className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-700">
              Learning profile
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">
              {studentProfile.display_name}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {studentProfile.grade_level.replace("_", " ")} student
            </p>
          </div>
          <span className="w-fit rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            Current support: {supportLevel}
          </span>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-sky-50 p-4">
            <h3 className="font-semibold text-slate-950">Recently practiced skill</h3>
            <p className="mt-3 text-sm leading-6 text-slate-700">{recentlyPracticedSkill}</p>
          </div>
          <div className="rounded-3xl bg-amber-50 p-4">
            <h3 className="font-semibold text-slate-950">Current focus</h3>
            <p className="mt-3 text-sm leading-6 text-slate-700">{commonWeakness}</p>
          </div>
        </div>
      </article>

      <div>
        <h2 className="text-2xl font-bold text-slate-950">Conversation history</h2>
        <p className="mt-2 text-sm text-slate-600">
          Each card is one finished reading practice. Open it to review the full chat.
        </p>
        <div className="mt-4 grid gap-3">
          {latestSessions.length > 0 ? (
            latestSessions.map((session) => (
              <Link
                key={session.id}
                href={`/history/${session.id}`}
                className="block rounded-3xl border border-sky-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
              >
                {/* This card comes from learning_sessions, one completed session for the logged-in student. */}
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="font-bold text-slate-950">
                      {session.title ?? session.topic ?? "Taiwan history reading practice"}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {formatDate(session.completed_at)} - {session.reading_check_count ?? 0} reading checks
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-700">
                      {session.summary ?? "Completed reading practice with Hank."}
                    </p>
                  </div>
                  <span className="w-fit rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
                    View conversation
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <article className="rounded-3xl border border-sky-100 bg-white p-6 text-sm leading-6 text-slate-600 shadow-sm">
              No completed conversation yet. Finish five reading checks with Hank and the full
              chat will appear here.
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
