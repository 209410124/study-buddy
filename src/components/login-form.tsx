"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { isValidUsername, usernameToAuthEmail } from "@/lib/auth-username";
import { getSupabaseBrowserClient, getSupabaseSetupMessage } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

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

    // Supabase Auth checks the email and password, then stores a secure session cookie for this browser.
    const { error } = await supabase.auth.signInWithPassword({
      email: usernameToAuthEmail(username),
      password,
    });

    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push("/chat");
    router.refresh();
  }

  return (
    <form onSubmit={handleLogin} className="grid gap-4">
      <div>
        <label className="text-sm font-semibold text-slate-700" htmlFor="username">
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

      <div>
        <label className="text-sm font-semibold text-slate-700" htmlFor="password">
          密碼
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-400 focus:bg-white"
          placeholder="輸入密碼"
          required
        />
      </div>

      {errorMessage ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isLoading}
        className="rounded-full bg-sky-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "登入中..." : "登入"}
      </button>

      <p className="text-center text-sm text-slate-600">
        還沒有帳號？{" "}
        <Link href="/register" className="font-semibold text-sky-800 hover:text-sky-950">
          建立帳號
        </Link>
      </p>
    </form>
  );
}
