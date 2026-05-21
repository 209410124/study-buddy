import { AppHeader } from "@/components/app-header";
import { LoginForm } from "@/components/login-form";
import { StudyBuddyAvatar } from "@/components/study-buddy-avatar";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50 text-slate-950">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-6xl items-center justify-center px-6 py-12">
        <section className="w-full max-w-md rounded-3xl border border-sky-100 bg-white p-6 shadow-xl shadow-sky-100">
          <div className="mb-6 flex items-center gap-3">
            <StudyBuddyAvatar size={48} />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-700">
                Welcome back
              </p>
              <h1 className="text-2xl font-bold text-slate-950">Log in</h1>
            </div>
          </div>
          <LoginForm />
        </section>
      </main>
    </div>
  );
}
