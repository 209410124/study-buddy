export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ChatStep = "mainIdea" | "evidence" | "reasoning" | "reflection" | "completed";

export type PassageLanguage = "en" | "zh";

export type StudySession = {
  id: string;
  title: string;
  topic: string;
  summary: string;
  created_at: string;
};

export type HistoryRecord = {
  id: string;
  date: string;
  passageTitle: string;
  focusSkill: string;
  score: number;
  weakness: string;
  supportLevel: "Low" | "Medium" | "High";
};

export type LearningProfile = {
  studentName: string;
  readingLevel: string;
  totalSessions: number;
  commonWeakness: string;
  supportLevel: "Low" | "Medium" | "High";
  strengths: string[];
  currentNeeds: string[];
  suggestion: string;
};

export type ChatRequest = {
  message: string;
  step: ChatStep;
  passage: string;
  studentName: string;
  passageLanguage: PassageLanguage;
  history?: ChatMessage[];
};

export type ChatResponse = {
  reply: string;
  nextStep: ChatStep;
};
