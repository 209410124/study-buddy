import type { HistoryRecord, LearningProfile } from "@/lib/types";

const profile: LearningProfile = {
  studentName: "Maya Chen",
  readingLevel: "Junior High - Level B1",
  totalSessions: 12,
  commonWeakness: "Explaining evidence clearly",
  supportLevel: "Medium",
  strengths: ["Finds main ideas", "Uses short text details"],
  currentNeeds: ["Connect evidence to reasoning", "Use complete sentences"],
  suggestion:
    "In the next Taiwan history passage, answer with this pattern: main idea, one text detail, then one sentence explaining why the detail matters.",
};

const records: HistoryRecord[] = [
  {
    id: "record-1",
    date: "2026-04-29",
    passageTitle: "Public Health in Colonial Taiwan",
    focusSkill: "Reasoning",
    score: 86,
    weakness: "Needs stronger explanation",
    supportLevel: "Medium",
  },
  {
    id: "record-2",
    date: "2026-04-27",
    passageTitle: "Railways and Modernization",
    focusSkill: "Evidence",
    score: 82,
    weakness: "Evidence was too general",
    supportLevel: "Medium",
  },
  {
    id: "record-3",
    date: "2026-04-25",
    passageTitle: "Schools Under Japanese Rule",
    focusSkill: "Main idea",
    score: 90,
    weakness: "Minor vocabulary confusion",
    supportLevel: "Low",
  },
  {
    id: "record-4",
    date: "2026-04-23",
    passageTitle: "The Kominka Movement",
    focusSkill: "Inference",
    score: 78,
    weakness: "Inference needs support",
    supportLevel: "High",
  },
  {
    id: "record-5",
    date: "2026-04-21",
    passageTitle: "Sugar Industry and Economy",
    focusSkill: "Cause and effect",
    score: 84,
    weakness: "Missed one cause",
    supportLevel: "Medium",
  },
];

export function HistoryList() {
  return (
    <section className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Total sessions</p>
          <p className="mt-3 text-4xl font-bold text-sky-800">{profile.totalSessions}</p>
        </article>
        <article className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Common weakness</p>
          <p className="mt-3 text-xl font-bold text-slate-950">{profile.commonWeakness}</p>
        </article>
        <article className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Support level</p>
          <p className="mt-3 text-xl font-bold text-emerald-700">{profile.supportLevel}</p>
        </article>
      </div>

      <article className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-700">
              Learning profile
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">{profile.studentName}</h2>
            <p className="mt-1 text-sm text-slate-600">{profile.readingLevel}</p>
          </div>
          <span className="w-fit rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            Current support: {profile.supportLevel}
          </span>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="font-semibold text-slate-950">Strengths</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {profile.strengths.map((strength) => (
                <li key={strength} className="rounded-2xl bg-sky-50 px-4 py-3">
                  {strength}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-950">Current needs</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {profile.currentNeeds.map((need) => (
                <li key={need} className="rounded-2xl bg-amber-50 px-4 py-3">
                  {need}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>

      <article className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6">
        <h2 className="text-xl font-bold text-slate-950">Improvement suggestion</h2>
        <p className="mt-3 text-sm leading-6 text-slate-700">{profile.suggestion}</p>
      </article>

      <div>
        <h2 className="text-2xl font-bold text-slate-950">Latest 5 records</h2>
        <div className="mt-4 grid gap-3">
          {records.map((record) => (
            <article
              key={record.id}
              className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm"
            >
              {/* Each record mirrors a future row from the reading_sessions and responses tables. */}
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-bold text-slate-950">{record.passageTitle}</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {record.date} - Focus: {record.focusSkill}
                  </p>
                  <p className="mt-2 text-sm text-amber-700">{record.weakness}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-800">
                    Score {record.score}
                  </span>
                  <span className="rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                    {record.supportLevel}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
