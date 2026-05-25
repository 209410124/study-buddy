"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { PassageLanguage } from "@/lib/types";

type LanguageContextValue = {
  language: PassageLanguage;
  setLanguage: (language: PassageLanguage) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const storageKey = "ai-study-buddy-language";
const cookieKey = "ai-study-buddy-language";
const defaultLanguage: PassageLanguage = "en";
const languageListeners = new Set<() => void>();

type LanguageProviderProps = {
  children: ReactNode;
};

function getStoredLanguage(): PassageLanguage {
  if (typeof window === "undefined") {
    return defaultLanguage;
  }

  const languageFromUrl = new URLSearchParams(window.location.search).get("lang");

  if (languageFromUrl === "en" || languageFromUrl === "zh") {
    return languageFromUrl;
  }

  const storedLanguage = window.localStorage.getItem(storageKey);

  if (storedLanguage === "en" || storedLanguage === "zh") {
    return storedLanguage;
  }

  const storedCookie = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${cookieKey}=`))
    ?.split("=")[1];

  return storedCookie === "en" || storedCookie === "zh" ? storedCookie : defaultLanguage;
}

function subscribeToLanguage(callback: () => void) {
  languageListeners.add(callback);

  function handleStorage(event: StorageEvent) {
    if (event.key === storageKey) {
      callback();
    }
  }

  window.addEventListener("storage", handleStorage);

  return () => {
    languageListeners.delete(callback);
    window.removeEventListener("storage", handleStorage);
  };
}

function notifyLanguageListeners() {
  languageListeners.forEach((callback) => callback());
}

function persistLanguage(language: PassageLanguage) {
  window.localStorage.setItem(storageKey, language);
  document.cookie = `${cookieKey}=${language}; path=/; max-age=31536000; samesite=lax`;
}

function syncLanguageQuery(language: PassageLanguage) {
  const url = new URL(window.location.href);

  url.searchParams.set("lang", language);
  window.history.replaceState(window.history.state, "", url);
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const language = useSyncExternalStore(
    subscribeToLanguage,
    getStoredLanguage,
    () => defaultLanguage,
  );

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-Hant" : "en";
    persistLanguage(language);
  }, [language]);

  function setLanguage(nextLanguage: PassageLanguage) {
    persistLanguage(nextLanguage);
    syncLanguageQuery(nextLanguage);
    notifyLanguageListeners();
  }

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider.");
  }

  return context;
}
