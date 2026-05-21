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
const defaultLanguage: PassageLanguage = "en";
const languageListeners = new Set<() => void>();

type LanguageProviderProps = {
  children: ReactNode;
};

function getStoredLanguage(): PassageLanguage {
  if (typeof window === "undefined") {
    return defaultLanguage;
  }

  const storedLanguage = window.localStorage.getItem(storageKey);

  return storedLanguage === "en" || storedLanguage === "zh"
    ? storedLanguage
    : defaultLanguage;
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

export function LanguageProvider({ children }: LanguageProviderProps) {
  const language = useSyncExternalStore(
    subscribeToLanguage,
    getStoredLanguage,
    () => defaultLanguage,
  );

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-Hant" : "en";
    window.localStorage.setItem(storageKey, language);
  }, [language]);

  function setLanguage(nextLanguage: PassageLanguage) {
    window.localStorage.setItem(storageKey, nextLanguage);
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
