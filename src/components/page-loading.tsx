import { StudyBuddyAvatar } from "@/components/study-buddy-avatar";

type PageLoadingProps = {
  title?: string;
  subtitle?: string;
};

export function PageLoading({
  title = "Loading AI Study Buddy",
  subtitle = "Preparing your learning space...",
}: PageLoadingProps) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f0f9ff_0%,#ffffff_42%,#ecfdf5_100%)] text-slate-950">
      <div className="border-b border-sky-100 bg-white/85">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <div className="h-5 w-36 rounded-full bg-sky-100" />
          <div className="hidden items-center gap-3 sm:flex">
            <div className="h-4 w-16 rounded-full bg-slate-100" />
            <div className="h-4 w-16 rounded-full bg-slate-100" />
            <div className="h-8 w-20 rounded-full bg-sky-100" />
          </div>
        </div>
      </div>

      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center justify-center px-5 py-12 lg:px-8">
        <div className="w-full max-w-md rounded-[1.25rem] border border-white bg-white/80 p-8 text-center shadow-xl shadow-sky-100/80 backdrop-blur">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/50">
            <StudyBuddyAvatar size={56} />
          </div>
          <h1 className="mt-6 text-xl font-bold text-slate-950">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>
          <div className="mt-6 flex justify-center gap-2">
            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-sky-600 [animation-delay:-0.2s]" />
            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.1s]" />
            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-amber-400" />
          </div>
        </div>
      </main>
    </div>
  );
}
