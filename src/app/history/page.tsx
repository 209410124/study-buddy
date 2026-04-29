import { AppHeader } from "@/components/app-header";
import { HistoryList } from "@/components/history-list";

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50 text-slate-950">
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-700">
            Progress tracker
          </p>
          <h1 className="mt-3 text-4xl font-bold">Study History</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Review Taiwan Japanese colonial period reading records, current support level, and
            the next skill to practice.
          </p>
        </div>
        <HistoryList />
      </main>
    </div>
  );
}
