import Link from "next/link";
import { StudyBuddyAvatar } from "@/components/study-buddy-avatar";
import { LogoutButton } from "@/components/logout-button";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/chat", label: "Chat" },
  { href: "/history", label: "History" },
];

export async function AppHeader() {
  let isLoggedIn = false;

  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();

    isLoggedIn = Boolean(data.user);
  } catch {
    isLoggedIn = false;
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-xl font-bold text-slate-950">
          <span className="rounded-2xl bg-sky-50 p-1 ring-1 ring-sky-100">
            <StudyBuddyAvatar size={38} />
          </span>
          <span className="leading-none">
            Hank
            <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Study Buddy
            </span>
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-sky-800 hover:shadow-sm"
            >
              {item.label}
            </Link>
          ))}
          {isLoggedIn ? (
            <LogoutButton />
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-sky-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-800"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
