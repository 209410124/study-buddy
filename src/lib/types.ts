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
  learningSessionId?: string;
  historyAnswerCount?: number;
  history?: ChatMessage[];
};

export type ChatResponse = {
  reply: string;
  nextStep: ChatStep;
  countsAsHistoryAnswer: boolean;
  historyAnswerCount: number;
  maxHistoryAnswers: number;
  isSessionComplete: boolean;
};

export type SavedChatSession = StudySession & {
  studentName: string;
  passage: string;
  messages: ChatMessage[];
  historyAnswerCount: number;
  passageLanguage: PassageLanguage;
};

export type StudentProfile = {
  id: string;
  display_name: string;
  username: string | null;
  email: string | null;
  grade_level: string;
  role: string;
  created_at: string;
  updated_at: string;
};

export type LearningProfileRow = {
  id: string;
  student_id: string;
  common_weakness: string | null;
  recently_practiced_skill: string | null;
  support_level: string | null;
  updated_at: string;
};

export type LearningHistoryRecord = {
  id: string;
  session_id: string;
  topic: string | null;
  question_type: string | null;
  student_answer: string | null;
  ai_feedback: string | null;
  detected_weakness: string | null;
  created_at: string;
};

export type ConversationHistorySession = {
  id: string;
  title: string | null;
  topic: string | null;
  summary: string | null;
  passage: string | null;
  conversation: ChatMessage[];
  reading_check_count: number | null;
  passage_language: PassageLanguage | null;
  created_at: string;
  completed_at: string | null;
};
