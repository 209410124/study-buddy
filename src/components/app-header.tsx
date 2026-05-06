import Link from "next/link";
import { StudyBuddyAvatar } from "@/components/study-buddy-avatar";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/chat", label: "Chat" },
  { href: "/history", label: "History" },
];

export function AppHeader() {
  return (
    <header className="border-b border-sky-100 bg-white/95">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-center gap-3 text-xl font-semibold text-slate-950">
          <StudyBuddyAvatar size={42} />
          <span>Hank</span>
        </Link>
        <nav className="flex gap-2" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-sky-50 hover:text-sky-800"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
