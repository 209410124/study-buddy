import type { ChatMessage, LearningSummary } from "@/lib/types";

const summaryPrefix = "LEARNING_SUMMARY_JSON:";

function getStudentAnswers(messages: ChatMessage[]) {
  return messages
    .filter((message) => message.role === "user")
    .map((message) => message.content.trim())
    .filter(Boolean);
}

function hasEvidence(answer: string) {
  const lowerAnswer = answer.toLowerCase();
  const evidenceWords = [
    "because",
    "for example",
    "the passage says",
    "according to",
    "evidence",
    "detail",
    "shows",
    "因為",
    "例如",
    "文章",
    "提到",
    "證據",
    "細節",
    "顯示",
    "說明",
  ];

  return evidenceWords.some((word) => lowerAnswer.includes(word));
}

function hasReasoning(answer: string) {
  const lowerAnswer = answer.toLowerCase();
  const reasoningWords = [
    "this means",
    "so",
    "therefore",
    "that means",
    "it shows",
    "I think",
    "means",
    "所以",
    "因此",
    "代表",
    "表示",
    "我認為",
    "可以看出",
    "這說明",
  ];

  return reasoningWords.some((word) => lowerAnswer.includes(word));
}

function getAverageAnswerLength(answers: string[]) {
  if (answers.length === 0) {
    return 0;
  }

  const totalWords = answers.reduce((total, answer) => {
    const wordLikeParts = answer.match(/[\p{L}\p{N}]+/gu) ?? [];
    return total + wordLikeParts.length;
  }, 0);

  return totalWords / answers.length;
}

export function encodeLearningSummary(summary: LearningSummary) {
  return `${summaryPrefix}${JSON.stringify(summary)}`;
}

export function parseLearningSummary(value: string | null | undefined): LearningSummary | null {
  if (!value?.startsWith(summaryPrefix)) {
    return null;
  }

  try {
    const parsed = JSON.parse(value.slice(summaryPrefix.length)) as Partial<LearningSummary>;

    if (
      typeof parsed.practiced_topic === "string" &&
      Array.isArray(parsed.practiced_skills) &&
      typeof parsed.strength === "string" &&
      typeof parsed.weakness === "string" &&
      typeof parsed.next_step === "string" &&
      (parsed.support_level === "Low" ||
        parsed.support_level === "Medium" ||
        parsed.support_level === "High") &&
      (parsed.simple_score === 1 || parsed.simple_score === 2 || parsed.simple_score === 3)
    ) {
      return parsed as LearningSummary;
    }
  } catch {
    return null;
  }

  return null;
}

export function analyzeLearning(messages: ChatMessage[], selectedTopic: string): LearningSummary {
  const answers = getStudentAnswers(messages);
  const averageLength = getAverageAnswerLength(answers);
  const evidenceCount = answers.filter(hasEvidence).length;
  const reasoningCount = answers.filter(hasReasoning).length;

  // This rule-based analyzer is intentionally simple so students and teachers can understand it.
  const shortAnswers = averageLength < 8;
  const lacksEvidence = evidenceCount < Math.max(1, Math.ceil(answers.length / 3));
  const weakReasoning = reasoningCount < Math.max(1, Math.ceil(answers.length / 3));
  const goodExplanation = !shortAnswers && evidenceCount >= 2 && reasoningCount >= 2;

  const practicedSkills = ["Main idea", "Evidence", "Reasoning", "Reflection"];
  const strength = goodExplanation
    ? "Clear reasoning"
    : evidenceCount > 0
      ? "Used some evidence from the passage"
      : "Stayed focused on the topic";
  const weakness = shortAnswers
    ? "Answer too short"
    : lacksEvidence
      ? "Lack of evidence"
      : weakReasoning
        ? "Weak reasoning"
        : "Keep making connections clearer";
  const nextStep = shortAnswers
    ? "Write 2-3 complete sentences for each answer."
    : lacksEvidence
      ? "Add one detail from the passage before explaining your idea."
      : weakReasoning
        ? "Use 'This shows...' to explain how your evidence supports your answer."
        : "Try comparing two viewpoints about the same event.";
  const simpleScore: 1 | 2 | 3 = goodExplanation ? 3 : shortAnswers || lacksEvidence ? 1 : 2;
  const supportLevel: LearningSummary["support_level"] =
    simpleScore === 3 ? "Low" : simpleScore === 2 ? "Medium" : "High";

  return {
    practiced_topic: selectedTopic,
    practiced_skills: practicedSkills,
    strength,
    weakness,
    next_step: nextStep,
    support_level: supportLevel,
    simple_score: simpleScore,
  };
}
