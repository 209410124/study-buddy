"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { isValidUsername, normalizeUsername, usernameToAuthEmail } from "@/lib/auth-username";
import { getSupabaseBrowserClient, getSupabaseSetupMessage } from "@/lib/supabase/client";

export function RegisterForm() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function getFriendlyRegisterError(message: string) {
    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes("email rate limit") ||
      lowerMessage.includes("rate limit") ||
      message.includes("電子郵件發送速率限制")
    ) {
      return "Supabase 還在寄驗證 Email，而且已經超過寄信限制。請到 Supabase 關閉 Confirm email，等幾分鐘後再註冊。";
    }

    if (
      lowerMessage.includes("schema cache") ||
      lowerMessage.includes("student_profiles") ||
      message.includes("模式快取")
    ) {
      return "Supabase 還沒有 student_profiles 資料表。請到 Supabase SQL Editor 執行 database/schema.sql，然後重新註冊。";
    }

    return message;
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please check them again.");
      return;
    }

    if (!isValidUsername(username)) {
      setErrorMessage("帳號請使用 3 到 24 個英文字母、數字或底線。");
      return;
    }

    setIsLoading(true);
    let supabase;

    try {
      supabase = getSupabaseBrowserClient();
    } catch {
      setIsLoading(false);
      setErrorMessage(getSupabaseSetupMessage());
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: usernameToAuthEmail(username),
      password,
      options: {
        data: {
          display_name: displayName.trim(),
          username: normalizeUsername(username),
        },
      },
    });

    if (error) {
      setIsLoading(false);
      setErrorMessage(getFriendlyRegisterError(error.message));
      return;
    }

    if (!data.user) {
      setIsLoading(false);
      setErrorMessage(
        "註冊沒有完成。這個帳號可能已經有人使用，請改用其他帳號或直接登入。",
      );
      return;
    }

    if (!data.session) {
      setIsLoading(false);
      setErrorMessage(
        "帳號已建立，但 Supabase 目前要求 Email 驗證。請到 Supabase 關閉 Confirm email，這個帳號登入方式才會適合學生使用。",
      );
      return;
    }

    // The profile id is the same id from auth.users, so history rows can belong to this student.
    const { error: profileError } = await supabase.from("student_profiles").upsert({
      id: data.user.id,
      display_name: displayName.trim(),
      username: normalizeUsername(username),
      email: usernameToAuthEmail(username),
      grade_level: "junior_high",
      role: "student",
    });

    const { error: learningProfileError } = await supabase.from("learning_profiles").upsert({
      student_id: data.user.id,
      support_level: "medium",
      recently_practiced_skill: "Getting started",
    });

    setIsLoading(false);

    if (profileError || learningProfileError) {
      setErrorMessage(
        profileError?.message ??
          learningProfileError?.message ??
          "Your account was created, but the profile could not be saved.",
      );
      return;
    }

    router.push("/chat");
    router.refresh();
  }

  return (
    <form onSubmit={handleRegister} className="grid gap-4">
      <div>
        <label className="text-sm font-semibold text-slate-700" htmlFor="display-name">
          Student name
        </label>
        <input
          id="display-name"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-400 focus:bg-white"
          placeholder="Your name"
          required
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-700" htmlFor="email">
          帳號
        </label>
        <input
          id="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-400 focus:bg-white"
          placeholder="例如 student01"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-slate-700" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-400 focus:bg-white"
            placeholder="At least 6 characters"
            required
            minLength={6}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700" htmlFor="confirm-password">
            Confirm password
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-400 focus:bg-white"
            placeholder="Type it again"
            required
            minLength={6}
          />
        </div>
      </div>

      {errorMessage ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isLoading}
        className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Creating account..." : "Create account"}
      </button>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-sky-800 hover:text-sky-950">
          Log in
        </Link>
      </p>
    </form>
  );
}
