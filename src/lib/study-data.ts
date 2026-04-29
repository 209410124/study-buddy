import type { StudySession } from "@/lib/types";

export const starterSessions: StudySession[] = [
  {
    id: "sample-1",
    title: "Photosynthesis Review",
    topic: "Biology",
    summary: "Compared light reactions, the Calvin cycle, and common exam traps.",
    created_at: "2026-04-20T09:30:00.000Z",
  },
  {
    id: "sample-2",
    title: "Derivative Practice",
    topic: "Calculus",
    summary: "Worked through product rule, chain rule, and a short practice plan.",
    created_at: "2026-04-21T14:10:00.000Z",
  },
];

export function buildStudyReply(message: string, topic = "General study") {
  const trimmed = message.trim();

  return [
    `Let's tackle "${trimmed}" as a ${topic} study question.`,
    "First, write the concept in one sentence using your own words.",
    "Then solve one easy example and one exam-style example.",
    "Finally, make a flashcard for the mistake you are most likely to repeat.",
  ].join("\n\n");
}

export function createSessionFromMessage(message: string, topic = "General study"): StudySession {
  const cleaned = message.trim();
  const title = cleaned.length > 42 ? `${cleaned.slice(0, 39)}...` : cleaned;

  return {
    id: crypto.randomUUID(),
    title,
    topic,
    summary: `Asked for help with ${topic.toLowerCase()}: ${cleaned}`,
    created_at: new Date().toISOString(),
  };
}
