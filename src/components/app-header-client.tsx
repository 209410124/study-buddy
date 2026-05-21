"use client";

import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { StudyBuddyAvatar } from "@/components/study-buddy-avatar";
import { useLanguage } from "@/components/language-provider";

const navItems = {
  en: [
    { href: "/", label: "Home" },
    { href: "/chat", label: "Chat" },
    { href: "/role-play", label: "Role-play" },
    { href: "/history", label: "History" },
  ],
  zh: [
    { href: "/", label: "首頁" },
    { href: "/chat", label: "聊天" },
    { href: "/role-play", label: "角色扮演" },
    { href: "/history", label: "紀錄" },
  ],
};

type AppHeaderClientProps = {
  isLoggedIn: boolean;
};

export function AppHeaderClient({ isLoggedIn }: AppHeaderClientProps) {
  const { language, setLanguage } = useLanguage();

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
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <div
            className="grid grid-cols-2 rounded-full border border-slate-200 bg-white p-1 text-xs font-bold shadow-sm"
            aria-label={language === "zh" ? "頁面語言" : "Page language"}
          >
            <button
              type="button"
              onClick={() => setLanguage("en")}
              aria-pressed={language === "en"}
              className={`rounded-full px-4 py-2 transition ${
                language === "en" ? "bg-sky-700 text-white shadow-sm" : "text-slate-600"
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage("zh")}
              aria-pressed={language === "zh"}
              className={`rounded-full px-4 py-2 transition ${
                language === "zh" ? "bg-sky-700 text-white shadow-sm" : "text-slate-600"
              }`}
            >
              中文
            </button>
          </div>
          <nav
            className="flex flex-wrap items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1"
            aria-label={language === "zh" ? "主要導覽" : "Primary navigation"}
          >
            {navItems[language].map((item) => (
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
                {language === "zh" ? "登入" : "Login"}
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
