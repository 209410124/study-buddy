import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { extractAnsweredItems, getAskedQuestions, mergeAnsweredItems } from "@/lib/passage-memory";
import { formatKnowledgeBaseForPrompt } from "@/lib/taiwan-history-knowledge";
import type { ChatMessage, ChatRequest, ChatResponse, ChatStep, PassageLanguage } from "@/lib/types";

const maxHistoryAnswers = 5;
const validSteps: ChatStep[] = ["mainIdea", "evidence", "reasoning", "reflection", "completed"];
const validPassageLanguages: PassageLanguage[] = ["en", "zh"];

const nextStepByCurrentStep: Record<ChatStep, ChatStep> = {
  mainIdea: "evidence",
  evidence: "reasoning",
  reasoning: "reflection",
  reflection: "reflection",
  completed: "completed",
};

const stepInstructions: Record<ChatStep, string> = {
  mainIdea:
    "The student is working on the main idea. React briefly. Then ask them to find one simple detail that is clearly written in the passage.",
  evidence:
    "The student is working on evidence. React briefly. Ask one easy question about what that detail tells us in the passage. Do not ask for causes or outside background.",
  reasoning:
    "The student is working on a simple explanation. React briefly. Then ask for another simple detail from the passage, not a deeper analysis.",
  reflection:
    "The student is continuing the reading check. React briefly. Ask one more easy question that can be answered directly from the passage, unless the reading check is complete.",
  completed:
    "The practice is already complete. Give a short friendly wrap-up.",
};

type AnswerEvaluation = {
  label:
    | "good_with_evidence"
    | "general_but_correct"
    | "too_short"
    | "off_topic"
    | "passage_gap";
  evidenceTerms: string[];
};

const commonEnglishWords = new Set([
  "about",
  "after",
  "also",
  "because",
  "before",
  "became",
  "could",
  "from",
  "have",
  "help",
  "into",
  "made",
  "many",
  "more",
  "some",
  "that",
  "their",
  "them",
  "there",
  "these",
  "they",
  "this",
  "under",
  "were",
  "with",
]);

const knownChineseEvidenceTerms = [
  "馬關條約",
  "台灣民主國",
  "臺灣民主國",
  "六三法",
  "土地調查",
  "兒玉源太郎",
  "後藤新平",
  "縱貫鐵路",
  "西來庵",
  "台灣文化協會",
  "臺灣文化協會",
  "台灣議會",
  "臺灣議會",
  "大正民主",
  "台灣民報",
  "臺灣民報",
  "蓬萊米",
  "台灣民眾黨",
  "臺灣民眾黨",
  "嘉南大圳",
  "八田與一",
  "霧社事件",
  "莫那魯道",
  "地方自治",
  "日月潭",
  "南進",
  "皇民化",
  "空襲",
  "日語",
  "課本改用日語",
  "學校教日語",
  "學習日語",
  "日本史",
  "日式商品包裝",
  "價格標示",
  "車站變成",
  "運送軍隊",
  "運送物資",
  "重要據點",
  "衛生教育",
  "降低部分傳染病",
  "生活方式",
  "警察",
  "糖業",
  "公共衛生",
  "割讓",
  "日本統治",
  "殖民政府",
  "總督府",
];

const encouragingOpeners: Record<PassageLanguage, string[]> = {
  en: ["Nice try.", "Good start.", "I see what you mean.", "You are getting close."],
  zh: ["很好，這是一個好的開始。", "我懂你的想法。", "你正在慢慢接近重點。", "這個方向不錯。"],
};

const hintOpeners: Record<PassageLanguage, string[]> = {
  en: ["Let's look again.", "Here is a small hint.", "Try checking the passage one more time."],
  zh: ["我們再看一次文章。", "給你一個小提示。", "可以回到文章找線索。"],
};

const celebrationOpeners: Record<PassageLanguage, string[]> = {
  en: ["Great job.", "That's a strong answer.", "Nice evidence.", "You explained that clearly."],
  zh: ["做得很好。", "這是一個有力的回答。", "這個證據找得不錯。", "你解釋得很清楚。"],
};

const companionOpeners: Record<PassageLanguage, string[]> = {
  en: ["That sounds tough.", "I get that.", "Thanks for telling me.", "I'm here with you."],
  zh: ["聽起來真的有點辛苦。", "我懂你的感覺。", "謝謝你告訴我。", "我會陪你慢慢來。"],
};

type OpenAIResponseContent = {
  text?: string;
};

type OpenAIResponseOutput = {
  content?: OpenAIResponseContent[];
};

type OpenAIResponseBody = {
  output_text?: string;
  output?: OpenAIResponseOutput[];
  error?: {
    message?: string;
  };
};

function isChatStep(value: unknown): value is ChatStep {
  return typeof value === "string" && validSteps.includes(value as ChatStep);
}

function isPassageLanguage(value: unknown): value is PassageLanguage {
  return typeof value === "string" && validPassageLanguages.includes(value as PassageLanguage);
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Partial<ChatMessage>;

  return (
    (item.role === "user" || item.role === "assistant") &&
    typeof item.content === "string" &&
    item.content.trim().length > 0
  );
}

function normalizeHistory(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(isChatMessage)
    .slice(-8)
    .map((item) => ({
      role: item.role,
      content: item.content.trim().slice(0, 500),
    }));
}

function normalizeAnsweredItems(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(-20);
}

function pickRandom(items: string[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function getOpenerGuidance(step: ChatStep, passageLanguage: PassageLanguage) {
  const selectedEncouragingOpener = pickRandom(encouragingOpeners[passageLanguage]);
  const selectedHintOpener = pickRandom(hintOpeners[passageLanguage]);
  const selectedCelebrationOpener = pickRandom(celebrationOpeners[passageLanguage]);
  const selectedCompanionOpener = pickRandom(companionOpeners[passageLanguage]);

  const preferredReaction =
    step === "evidence" || step === "reasoning" || step === "reflection"
      ? selectedCelebrationOpener
      : selectedEncouragingOpener;

  return [
    `Preferred reaction opener for a history answer: ${preferredReaction}`,
    `Optional hint opener: ${selectedHintOpener}`,
    `Optional companion opener for casual chat or feelings: ${selectedCompanionOpener}`,
  ].join("\n");
}

function extractReply(data: OpenAIResponseBody) {
  const directText = data.output_text?.trim();

  if (directText) {
    return directText;
  }

  return (
    data.output
      ?.flatMap((item) => item.content ?? [])
      .map((content) => content.text)
      .find((text) => text && text.trim())
      ?.trim() ?? ""
  );
}

function getHistoryKeywords(passage: string) {
  const words = passage
    .toLowerCase()
    .match(/[a-z]{4,}/g)
    ?.filter((word) => !["this", "that", "with", "from", "were", "they", "also"].includes(word));

  return new Set([
    ...(words ?? []),
    "taiwan",
    "japan",
    "japanese",
    "colonial",
    "railway",
    "railways",
    "school",
    "schools",
    "education",
    "public health",
    "1895",
    "1945",
    "台灣",
    "臺灣",
    "日本",
    "殖民",
    "統治",
    "鐵路",
    "港口",
    "公共衛生",
    "學校",
    "教育",
    "日語",
    "政治",
    "權力",
    "社會",
    "文章",
    "證據",
    "主旨",
    "推論",
    "原因",
    "影響",
  ]);
}

function getWordCount(value: string) {
  const englishWords = value.match(/[a-zA-Z]+/g) ?? [];
  const cjkCharacters = value.match(/[\u3400-\u9fff]/g) ?? [];

  return englishWords.length + Math.ceil(cjkCharacters.length / 2);
}

function extractEvidenceTerms(passage: string) {
  const normalizedPassage = passage.toLowerCase();
  const terms = new Set<string>();

  for (const term of knownChineseEvidenceTerms) {
    if (passage.includes(term)) {
      terms.add(term);
    }
  }

  const years = passage.match(/\b(18|19|20)\d{2}\b/g) ?? [];
  years.forEach((year) => terms.add(year));

  const englishTerms =
    normalizedPassage
      .match(/[a-z]{4,}/g)
      ?.filter((word) => !commonEnglishWords.has(word))
      .slice(0, 80) ?? [];

  englishTerms.forEach((term) => terms.add(term));

  return Array.from(terms);
}

function getSharedEvidenceTerms(message: string, passage: string, selectedTopic: string) {
  const normalizedMessage = message.toLowerCase();
  const evidenceTerms = extractEvidenceTerms(`${selectedTopic}\n${passage}`);
  const answeredItems = extractAnsweredItems(message, passage);

  return preferSpecificEvidenceTerms([
    ...evidenceTerms.filter((term) => normalizedMessage.includes(term.toLowerCase())),
    ...answeredItems,
  ]);
}

function preferSpecificEvidenceTerms(terms: string[]) {
  const uniqueTerms = Array.from(new Set(terms.map((term) => term.trim()).filter(Boolean)));

  return uniqueTerms
    .map((term) => term.replace(/[，。！？；、,.!?;:]+$/g, "").trim())
    .filter((term) => term.length >= 2)
    .filter((term) => {
      const cjkLength = (term.match(/[\u3400-\u9fff]/g) ?? []).length;
      const englishWordLength = term.split(/\s+/).filter(Boolean).length;

      // Avoid highlighting a whole sentence. We only want compact evidence labels.
      return cjkLength <= 12 && englishWordLength <= 5;
    })
    .filter((term) => {
      const normalizedTerm = term.toLowerCase().replace(/\s+/g, "");

      return !uniqueTerms.some((otherTerm) => {
        const normalizedOtherTerm = otherTerm.toLowerCase().replace(/\s+/g, "");

        return (
          normalizedOtherTerm !== normalizedTerm &&
          normalizedOtherTerm.includes(normalizedTerm) &&
          normalizedOtherTerm.length > normalizedTerm.length
        );
      });
    })
    .sort((firstTerm, secondTerm) => {
      const firstIsKnown = knownChineseEvidenceTerms.includes(firstTerm) ? 1 : 0;
      const secondIsKnown = knownChineseEvidenceTerms.includes(secondTerm) ? 1 : 0;

      if (firstIsKnown !== secondIsKnown) {
        return secondIsKnown - firstIsKnown;
      }

      return secondTerm.length - firstTerm.length;
    })
    .slice(0, 2);
}

function answerHasPassageOverlap(message: string, passage: string, selectedTopic: string) {
  const normalizedMessage = message.toLowerCase();
  const historyKeywords = getHistoryKeywords(`${selectedTopic}\n${passage}`);

  return Array.from(historyKeywords).some((keyword) =>
    normalizedMessage.includes(keyword.toLowerCase()),
  );
}

function evaluateStudentAnswer(
  message: string,
  passage: string,
  selectedTopic: string,
): AnswerEvaluation {
  const normalized = message.trim().toLowerCase();
  const compact = normalized.replace(/\s+/g, "");
  const wordCount = getWordCount(message);
  const sharedEvidenceTerms = getSharedEvidenceTerms(message, passage, selectedTopic);
  const hasPassageOverlap = answerHasPassageOverlap(message, passage, selectedTopic);
  const hasBecauseStyleExplanation = includesAny(normalized, [
    "because",
    "so",
    "therefore",
    "this shows",
    "that means",
    "因為",
    "所以",
    "因此",
    "代表",
    "顯示",
    "說明",
  ]);
  const pointsOutMissingPassageDetail = includesAny(compact, [
    "文章中沒有提到",
    "文章沒有提到",
    "文中沒有提到",
    "沒有提到細節",
    "沒有講",
    "沒講",
    "沒提到",
    "文中沒提",
  ]);
  const casualOrUncertainPatterns = [
    "hi",
    "hello",
    "thanks",
    "thank you",
    "i don't know",
    "i dont know",
    "不知道",
    "不會",
    "看不懂",
    "好難",
    "嗨",
    "你好",
    "謝謝",
  ];

  if (pointsOutMissingPassageDetail) {
    return {
      label: "passage_gap",
      evidenceTerms: ["文章沒有明確提到細節"],
    };
  }

  if (includesAny(compact, casualOrUncertainPatterns) && !hasPassageOverlap) {
    return { label: "off_topic", evidenceTerms: [] };
  }

  // A short answer can still be useful if it names a clear passage detail such as "馬關條約".
  if (wordCount < 3 && sharedEvidenceTerms.length === 0) {
    return { label: "too_short", evidenceTerms: [] };
  }

  if (sharedEvidenceTerms.length > 0) {
    return {
      label: hasBecauseStyleExplanation || wordCount >= 5 ? "good_with_evidence" : "general_but_correct",
      evidenceTerms: sharedEvidenceTerms.slice(0, 3),
    };
  }

  if (hasPassageOverlap) {
    return { label: "general_but_correct", evidenceTerms: [] };
  }

  return { label: "off_topic", evidenceTerms: [] };
}

function getNextStepFromEvaluation(step: ChatStep, evaluation: AnswerEvaluation) {
  if (step === "completed") {
    return "completed";
  }

  if (evaluation.label === "too_short" || evaluation.label === "off_topic") {
    return step;
  }

  if (evaluation.label === "passage_gap") {
    return step === "mainIdea" ? "evidence" : "reflection";
  }

  if (step === "mainIdea" && evaluation.label === "good_with_evidence") {
    return "reasoning";
  }

  if (step === "mainIdea" && evaluation.label === "general_but_correct") {
    return "evidence";
  }

  if (step === "evidence" && evaluation.label === "good_with_evidence") {
    return "reasoning";
  }

  if (step === "reasoning" && evaluation.label === "good_with_evidence") {
    return "reflection";
  }

  return nextStepByCurrentStep[step];
}

function getEvaluationPromptGuidance(
  evaluation: AnswerEvaluation,
  step: ChatStep,
  passageLanguage: PassageLanguage,
) {
  const evidenceText = evaluation.evidenceTerms.length > 0
    ? evaluation.evidenceTerms.map((term) => `「${term}」`).join("、")
    : "";

  if (passageLanguage === "zh") {
    if (evaluation.label === "good_with_evidence") {
      return [
        `Answer evaluation: good_with_evidence. The student already used passage evidence: ${evidenceText}.`,
        `In your reply, clearly show the detected evidence using this phrase: 我抓到的線索是：${evidenceText}。`,
        "Do not ask the student to find another detail or evidence.",
        step === "mainIdea"
          ? "Acknowledge the key detail, then move naturally to a reasoning question about a cause, difficulty, or effect that is stated in the passage."
          : "Ask one natural follow-up that builds on the evidence they already gave.",
      ].join("\n");
    }

    if (evaluation.label === "general_but_correct") {
      return "Answer evaluation: general_but_correct. The idea is on topic, but it needs one clear phrase or sentence from the passage as evidence.";
    }

    if (evaluation.label === "too_short") {
      return "Answer evaluation: too_short. Stay on the same step and ask the student to add a little more detail.";
    }

    if (evaluation.label === "passage_gap") {
      return [
        "Answer evaluation: passage_gap. The student correctly noticed that the passage does not give that missing detail.",
        "Acknowledge that careful reading.",
        "Do not ask for the same missing detail again.",
        "Ask a safer question about a sentence or phrase that is explicitly written in the passage, or move to a short reflection question.",
      ].join("\n");
    }

    return "Answer evaluation: off_topic. Gently redirect the student back to the reading passage.";
  }

  if (evaluation.label === "good_with_evidence") {
    return [
      `Answer evaluation: good_with_evidence. The student already used passage evidence: ${evidenceText}.`,
      `In your reply, clearly show the detected evidence using this phrase: I noticed this evidence: ${evidenceText}.`,
      "Do not ask the student to find another detail or evidence.",
      step === "mainIdea"
        ? "Acknowledge the key detail, then move naturally to a reasoning question about a cause, difficulty, or effect that is stated in the passage."
        : "Ask one natural follow-up that builds on the evidence they already gave.",
    ].join("\n");
  }

  if (evaluation.label === "general_but_correct") {
    return "Answer evaluation: general_but_correct. The idea is on topic, but it needs one clear phrase or sentence from the passage as evidence.";
  }

  if (evaluation.label === "too_short") {
    return "Answer evaluation: too_short. Stay on the same step and ask the student to add a little more detail.";
  }

  if (evaluation.label === "passage_gap") {
    return [
      "Answer evaluation: passage_gap. The student correctly noticed that the passage does not give that missing detail.",
      "Acknowledge that careful reading.",
      "Do not ask for the same missing detail again.",
      "Ask a safer question about a sentence or phrase that is explicitly written in the passage, or move to a short reflection question.",
    ].join("\n");
  }

  return "Answer evaluation: off_topic. Gently redirect the student back to the reading passage.";
}

function getConversationMemoryGuidance(
  answeredItems: string[],
  previousAiQuestions: string[],
  passageLanguage: PassageLanguage,
) {
  const answeredText = answeredItems.length > 0 ? answeredItems.join("、") : "none";
  const questionText = previousAiQuestions.length > 0 ? previousAiQuestions.join(" / ") : "none";

  if (passageLanguage === "zh") {
    return [
      `學生已經提過的文章線索: ${answeredText}`,
      `AI 最近已經問過的問題: ${questionText}`,
      "不要再要求學生找出已經提過的線索。",
      "如果學生已經提到兩個以上證據，請簡短整理這些證據，然後問更深入但仍可從文章回答的推論或反思問題。",
      "新問題不能和上一個 AI 問題意思太像，也不能要求學生重複已回答內容。",
    ].join("\n");
  }

  return [
    `Passage details the student already mentioned: ${answeredText}`,
    `Recent AI questions already asked: ${questionText}`,
    "Do not ask the student to find or repeat details they already mentioned.",
    "If the student has already given two or more evidence details, briefly summarize them and ask a deeper reasoning or reflection question that is still answerable from the passage.",
    "The new question must not be too similar to the previous AI question or the student's answered items.",
  ].join("\n");
}

function getQuestionTail(reply: string) {
  const questionParts = reply.split(/[？?]/);

  if (questionParts.length < 2) {
    return "";
  }

  return questionParts[questionParts.length - 2]?.trim() ?? "";
}

function isQuestionTooSimilar(reply: string, answeredItems: string[], previousAiQuestions: string[]) {
  const question = getQuestionTail(reply);
  const normalizedQuestion = question.toLowerCase().replace(/\s+/g, "");

  if (!normalizedQuestion) {
    return false;
  }

  const repeatsAnsweredItem = answeredItems.some((item) => {
    const normalizedItem = item.toLowerCase().replace(/\s+/g, "");
    return normalizedItem.length >= 3 && normalizedQuestion.includes(normalizedItem);
  });

  if (repeatsAnsweredItem && /還|再|what else|another|find|找|做了什麼|什麼/.test(question)) {
    return true;
  }

  return previousAiQuestions.some((previousQuestion) => {
    const previousWords = new Set(
      previousQuestion
        .toLowerCase()
        .match(/[\p{L}\p{N}]+/gu)
        ?.filter((word) => word.length >= 2) ?? [],
    );
    const currentWords =
      question
        .toLowerCase()
        .match(/[\p{L}\p{N}]+/gu)
        ?.filter((word) => word.length >= 2) ?? [];

    if (previousWords.size === 0 || currentWords.length === 0) {
      return false;
    }

    const overlap = currentWords.filter((word) => previousWords.has(word)).length;
    return overlap / Math.max(currentWords.length, 1) >= 0.65;
  });
}

function asksForUnstatedDetails(reply: string) {
  const question = getQuestionTail(reply);

  return /有哪些改變|哪些改變|什麼改變|如何改變|怎麼改變|哪些細節|什麼細節|what changes|which changes|what details/i.test(
    question,
  );
}

function getNonRepeatingReply(
  answeredItems: string[],
  passageLanguage: PassageLanguage,
  step: ChatStep,
) {
  const listedItems = answeredItems.slice(-3);

  if (passageLanguage === "zh") {
    if (listedItems.length >= 2) {
      return `很好，你已經找到${listedItems.map((item) => `「${item}」`).join("和")}這些具體細節。那我們往下一步想：這些行動最能說明當時人們面臨什麼壓力？`;
    }

    if (listedItems.length === 1) {
      return `對，${listedItems[0]}是一個很關鍵的細節。那這個細節可以幫助我們理解文章中的哪個重點？`;
    }

    return step === "reasoning"
      ? "很好，我們不要重複找同一個細節了。你覺得這段文章最想讓我們理解的是什麼？"
      : "很好，我們往下一步想。這個細節可以支持文章的哪個重點？";
  }

  if (listedItems.length >= 2) {
    return `Good work. You already found ${listedItems.map((item) => `"${item}"`).join(" and ")} as details. What do these actions show about the pressure people faced?`;
  }

  if (listedItems.length === 1) {
    return `Yes, "${listedItems[0]}" is an important detail. What main idea does that detail support?`;
  }

  return "Good work. Let's move forward instead of repeating the same detail. What does this part of the passage help us understand?";
}

function getPassageGapReply(passageLanguage: PassageLanguage) {
  if (passageLanguage === "zh") {
    return "你觀察得很仔細，這個細節文中確實沒有明講，所以不能把它當作證據。請改從文章中選一個明確寫出的句子或詞語，說說它能支持哪個重點？";
  }

  return "Good catch. The passage does not clearly state that detail, so we should not use it as evidence. Choose one phrase or sentence that is clearly written in the passage, and tell me what idea it supports.";
}

function addDetectedEvidenceLabel(
  reply: string,
  evaluation: AnswerEvaluation,
  passageLanguage: PassageLanguage,
) {
  if (evaluation.label !== "good_with_evidence" || evaluation.evidenceTerms.length === 0) {
    return reply;
  }

  const evidenceText = evaluation.evidenceTerms.map((term) => `「${term}」`).join("、");
  const zhLabel = `我抓到的線索是：${evidenceText}。`;
  const enLabel = `I noticed this evidence: ${evidenceText}.`;
  const label = passageLanguage === "zh" ? zhLabel : enLabel;

  if (reply.includes(evidenceText) || reply.includes("我抓到的線索") || reply.includes("I noticed this evidence")) {
    return reply;
  }

  return `${label}${passageLanguage === "zh" ? "" : " "}${reply}`;
}

function includesAny(value: string, patterns: string[]) {
  return patterns.some((pattern) => value.includes(pattern));
}

function getDetectedWeakness(step: ChatStep) {
  const weaknessByStep: Record<ChatStep, string> = {
    mainIdea: "Finding the main idea",
    evidence: "Using specific evidence",
    reasoning: "Explaining why evidence matters",
    reflection: "Connecting history to a bigger idea",
    completed: "Review completed",
  };

  return weaknessByStep[step];
}

function isEndRequest(message: string) {
  const normalized = message.trim().toLowerCase();
  const compact = normalized.replace(/\s+/g, "");
  const readableEndPatterns = ["完成", "結束", "不用了", "先這樣", "到這裡", "不想聊了", "我要結束"];

  if (readableEndPatterns.some((pattern) => normalized.includes(pattern) || compact.includes(pattern))) {
    return true;
  }

  const endPatterns = [
    "done",
    "finish",
    "finished",
    "stop",
    "end",
    "that's all",
    "thats all",
    "no more",
    "i want to stop",
    "完成",
    "結束",
    "不用了",
    "先這樣",
    "到這裡",
    "不想聊了",
    "我要結束",
  ];

  return endPatterns.some((pattern) => normalized.includes(pattern) || compact.includes(pattern));
}

function getManualCompletionReply(passageLanguage: PassageLanguage) {
  if (passageLanguage === "zh") {
    return "做得很好，今天的練習先到這裡。我已經幫你保存這次學習紀錄，之後可以到歷史紀錄複習。";
  }

  return "Great work. We can stop here for today. I saved this practice so you can review it later in your history page.";
}

function getAutomaticCompletionReply(passageLanguage: PassageLanguage) {
  if (passageLanguage === "zh") {
    return "做得很好，你已經完成今天的五次閱讀檢查了。我會把這次練習保存到歷史紀錄，之後可以再回來複習。";
  }

  return "Great work. You completed today's five reading checks. I will save this practice so you can review it later.";
}

function isHistoryAnswer(message: string, passage: string) {
  const normalized = message.trim().toLowerCase();
  const compact = normalized.replace(/\s+/g, "");
  const simpleNonAnswerPatterns = [
    "hi",
    "hello",
    "thanks",
    "thank you",
    "ok",
    "okay",
    "你好",
    "嗨",
    "謝謝",
    "感謝",
    "不知道",
    "不會",
    "看不懂",
    "好難",
    "很難",
    "累",
    "壓力",
  ];
  const hasSimpleNonAnswer = simpleNonAnswerPatterns.some(
    (pattern) => normalized.includes(pattern) || compact.includes(pattern),
  );

  if (hasSimpleNonAnswer) {
    return false;
  }

  if (/[\u3400-\u9fff]/.test(normalized)) {
    return compact.length >= 2;
  }

  if (normalized.length >= 4) {
    return true;
  }

  const historyKeywords = getHistoryKeywords(passage);
  const hasHistoryKeyword = Array.from(historyKeywords).some((keyword) =>
    normalized.includes(keyword.toLowerCase()),
  );
  const hasYear = /\b(18|19|20)\d{2}\b/.test(normalized);
  const emotionalOnlyPatterns = [
    "tired",
    "stress",
    "stressed",
    "sad",
    "bored",
    "frustrated",
    "confused",
    "hard",
    "difficult",
    "i don't know",
    "i dont know",
    "累",
    "壓力",
    "難過",
    "無聊",
    "煩",
    "焦慮",
    "挫折",
    "好難",
    "不懂",
    "不知道",
    "不想",
  ];
  const casualOnlyPatterns = [
    "hi",
    "hello",
    "thanks",
    "thank you",
    "ok",
    "okay",
    "哈哈",
    "嗨",
    "你好",
    "謝謝",
    "好喔",
    "好哦",
    "嗯",
  ];
  const hasFeeling = includesAny(normalized, emotionalOnlyPatterns);
  const hasCasualOnly = includesAny(compact, casualOnlyPatterns);

  if (hasHistoryKeyword || hasYear) {
    return true;
  }

  if (hasFeeling || hasCasualOnly || normalized.length < 4) {
    return false;
  }

  return normalized.length >= 8;
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is missing from .env." },
      { status: 500 },
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    return NextResponse.json({ error: "Please log in before chatting." }, { status: 401 });
  }

  const body = (await request.json()) as Partial<ChatRequest>;
  const message = body.message?.trim();
  const passage = body.passage?.trim();
  const studentName = body.studentName?.trim() || "Student";
  const learningSessionId = body.learningSessionId?.trim();
  const step = body.step;
  const history = normalizeHistory(body.history);
  const clientAnsweredItems = normalizeAnsweredItems(body.answeredItems);
  const historyAnswerCount = Math.max(0, Math.min(body.historyAnswerCount ?? 0, maxHistoryAnswers));
  const passageLanguage = isPassageLanguage(body.passageLanguage) ? body.passageLanguage : "en";
  const selectedTopic = body.selectedTopic?.trim().slice(0, 120) || "Taiwan history during the Japanese colonial period";
  const currentRole = body.currentRole?.trim().slice(0, 160) || "A Taiwanese student living during the Japanese colonial period";

  if (!message || !passage || !isChatStep(step)) {
    return NextResponse.json(
      { error: "message, passage, studentName, and a valid step are required." },
      { status: 400 },
    );
  }

  const studentWantsToEnd = isEndRequest(message);
  const historyAnsweredItems = history
    .filter((item) => item.role === "user")
    .flatMap((item) => extractAnsweredItems(item.content, passage));
  const answeredItems = mergeAnsweredItems(
    mergeAnsweredItems(clientAnsweredItems, historyAnsweredItems),
    extractAnsweredItems(message, passage),
  );
  const previousAiQuestions = getAskedQuestions(history);
  const answerEvaluation = evaluateStudentAnswer(message, passage, selectedTopic);
  const countsAsHistoryAnswer =
    !studentWantsToEnd &&
    step !== "completed" &&
    answerEvaluation.label !== "too_short" &&
    answerEvaluation.label !== "off_topic" &&
    answerEvaluation.label !== "passage_gap" &&
    isHistoryAnswer(message, passage);
  const nextHistoryAnswerCount = countsAsHistoryAnswer
    ? Math.min(historyAnswerCount + 1, maxHistoryAnswers)
    : historyAnswerCount;
  const isSessionComplete = studentWantsToEnd || nextHistoryAnswerCount >= maxHistoryAnswers;
  const nextStep = countsAsHistoryAnswer
    ? isSessionComplete
      ? "completed"
      : getNextStepFromEvaluation(step, answerEvaluation)
    : studentWantsToEnd
      ? "completed"
      : step;

  if (studentWantsToEnd) {
    const reply = getManualCompletionReply(passageLanguage);
    const response: ChatResponse = {
      reply,
      nextStep: "completed",
      countsAsHistoryAnswer: false,
      historyAnswerCount,
      maxHistoryAnswers,
      isSessionComplete: true,
    };

    if (learningSessionId) {
      await supabase.from("learning_responses").insert({
        session_id: learningSessionId,
        student_id: user.id,
        question_type: "completed",
        student_answer: message,
        ai_feedback: reply,
        detected_weakness: "Student ended practice",
      });
    }

    return NextResponse.json(response);
  }

  if (isSessionComplete) {
    const reply = getAutomaticCompletionReply(passageLanguage);
    const response: ChatResponse = {
      reply,
      nextStep: "completed",
      countsAsHistoryAnswer,
      historyAnswerCount: nextHistoryAnswerCount,
      maxHistoryAnswers,
      isSessionComplete: true,
    };

    if (learningSessionId) {
      await supabase.from("learning_responses").insert({
        session_id: learningSessionId,
        student_id: user.id,
        question_type: "completed",
        student_answer: message,
        ai_feedback: reply,
        detected_weakness: getDetectedWeakness(step),
      });
    }

    return NextResponse.json(response);
  }

  const openerGuidance = getOpenerGuidance(step, passageLanguage);
  const evaluationGuidance = getEvaluationPromptGuidance(answerEvaluation, step, passageLanguage);
  const memoryGuidance = getConversationMemoryGuidance(
    answeredItems,
    previousAiQuestions,
    passageLanguage,
  );
  const knowledgeBaseContext = formatKnowledgeBaseForPrompt(passageLanguage);
  const languageRules =
    passageLanguage === "zh"
      ? [
          "Use simple Traditional Chinese suitable for junior high school students.",
          "The passage is written in Traditional Chinese. Reply only in Traditional Chinese.",
          "Use Traditional Chinese punctuation and no emoji.",
        ]
      : [
          "Use simple English suitable for junior high school students.",
          "The passage is written in English. Reply only in simple English.",
          "If the student writes in Chinese, still reply in English.",
          "Use plain ASCII punctuation and no emoji.",
        ];
  const exampleStyles =
    passageLanguage === "zh"
      ? [
          "Example style for good_with_evidence: 很好，你已經抓到文章的核心，也提到了「馬關條約」這個關鍵線索。那我們再往下想：文章中還說台灣民主國成立後遇到什麼困難？",
          "Example style for general_but_correct: 很好，你抓到大方向了。可以從文章中找一句話或一個詞，說明台灣為什麼會受到日本統治嗎？",
          "Example style for uncertainty or feelings: 聽起來有點卡住了，沒關係，我們慢慢來。你想先看文章中的哪一句？",
          "Example style for completion: 做得很好，今天你已經完成五次歷史思考回答了。我會把這次練習放進歷史紀錄，之後可以再回來查看。",
        ]
      : [
          "Example style for good_with_evidence: Nice work, you already named a key detail from the passage. What does that detail help explain about the event?",
          "Example style for general_but_correct: Good start, you found the general topic. What phrase or sentence from the passage supports that idea?",
          "Example style for uncertainty or feelings: That sounds tiring. We can take this slowly. Do you want to look at just one sentence together?",
          "Example style for completion: Great work, you completed five history-thinking answers today. I will save this practice so you can review it later.",
        ];

  const instructions = [
    "Your name is Hank, and you are a friendly learning companion for junior high school students.",
    "The student is learning Taiwan history, especially Taiwan during the Japanese colonial period from 1895 to 1945.",
    `The selected topic for this chat is: ${selectedTopic}.`,
    `The related historical perspective or role is: ${currentRole}.`,
    "Use the fixed Taiwan Japanese Colonial Period Knowledge Base below as background knowledge.",
    "Do not mention the knowledge base by name to the student.",
    "Your main job is reading comprehension, not deep historical discussion.",
    "Only check whether the student understands the reading passage shown to them.",
    "Keep the response focused on the selected topic and the reading passage.",
    "Do not drift to unrelated Taiwan history topics unless the student clearly asks for a comparison.",
    "Do not ask about causes, motives, long-term effects, or broader historical background unless those ideas are explicitly written in the passage.",
    "If the student asks beyond the passage, answer briefly and return to the passage.",
    "Your goal is not to give answers directly.",
    "Your goal is to help the student identify the main idea and simple evidence from the passage.",
    "Sound warm, natural, and supportive, like a + study buddy.",
    ...languageRules,
    "Keep replies short, about two or three sentences.",
    "Respond to the student's idea first before asking a question.",
    "If the student is chatting casually or sharing feelings, respond like a caring companion first.",
    "Casual chat or feelings should not force the reading-step pattern.",
    "For direct passage answers, use this pattern: short reaction, short passage-based question.",
    "Any follow-up question must be answerable from the reading passage shown to the student.",
    "Do not ask questions that require facts not found in the reading passage.",
    "If the passage only gives a broad phrase such as 'changed young people's lifestyle' but does not list examples, do not ask the student to name those examples.",
    "If the student says the passage does not mention a detail, accept that as careful reading and switch to a detail that is explicitly written.",
    "Do not ask students to infer why a group made a choice unless the passage states the reason.",
    "Do not ask for deeper analysis after the student has already given a reasonable passage detail.",
    "Do not ask the same evidence question again if the student's latest answer already includes a key detail from the passage.",
    "Use the conversation memory to avoid repeated questions.",
    "If the student already gave evidence, move the conversation forward instead of asking for the same evidence again.",
    "Reply structure: first acknowledge what the student did well, second connect to the passage, third ask one natural follow-up question.",
    "Do not keep extending the conversation after the required practice steps are complete.",
    "Ask only one question at a time.",
    "Do not give the full answer directly.",
    "Do not include labels, scores, markdown, or bullet points.",
    countsAsHistoryAnswer
      ? `This message counts as history answer ${nextHistoryAnswerCount} of ${maxHistoryAnswers}.`
      : "This message does not count as a history answer. Do not advance the learning step.",
    isSessionComplete
      ? "The reading check is complete. Give a short warm closing and do not ask another practice question."
      : evaluationGuidance,
    `Conversation memory guidance:\n${memoryGuidance}`,
    `Default step guidance if it does not conflict with the answer evaluation: ${stepInstructions[step]}`,
    ...exampleStyles,
  ].join("\n");

  const input = [
    `Student name: ${studentName}`,
    `Current step: ${step}`,
    `Next step to return: ${nextStep}`,
    `Answer evaluation: ${answerEvaluation.label}`,
    `Detected evidence terms: ${answerEvaluation.evidenceTerms.join(", ") || "none"}`,
    `Answered items already covered: ${answeredItems.join(", ") || "none"}`,
    `Previous AI questions: ${previousAiQuestions.join(" / ") || "none"}`,
    `History answers used before this message: ${historyAnswerCount}`,
    `History answers used after this message: ${nextHistoryAnswerCount}`,
    `Selected topic: ${selectedTopic}`,
    `Related role: ${currentRole}`,
    `Reading passage: ${passage}`,
    `Taiwan Japanese Colonial Period Knowledge Base:\n${knowledgeBaseContext}`,
    `Recent chat history: ${JSON.stringify(history)}`,
    `Student message: ${message}`,
    `Conversational opener guidance: ${openerGuidance}`,
  ].join("\n\n");

  let openAIResponse: Response;

  try {
    openAIResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: AbortSignal.timeout(20000),
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-5-mini",
        instructions,
        input,
        reasoning: { effort: "minimal" },
        text: { verbosity: "low" },
        max_output_tokens: 300,
      }),
    });
  } catch {
    return NextResponse.json(
      { error: "OpenAI took too long to respond. Please try again." },
      { status: 504 },
    );
  }

  const data = (await openAIResponse.json()) as OpenAIResponseBody;

  if (!openAIResponse.ok) {
    return NextResponse.json(
      { error: data.error?.message ?? "OpenAI request failed." },
      { status: openAIResponse.status },
    );
  }

  const generatedReply = extractReply(data);
  const memorySafeReply =
    answerEvaluation.label === "passage_gap" || asksForUnstatedDetails(generatedReply)
      ? getPassageGapReply(passageLanguage)
      : isQuestionTooSimilar(generatedReply, answeredItems, previousAiQuestions)
        ? getNonRepeatingReply(answeredItems, passageLanguage, nextStep)
        : generatedReply;
  const reply = addDetectedEvidenceLabel(memorySafeReply, answerEvaluation, passageLanguage);

  if (!reply) {
    return NextResponse.json(
      { error: "OpenAI returned an empty response." },
      { status: 502 },
    );
  }

  const response: ChatResponse = {
    reply,
    nextStep,
    countsAsHistoryAnswer,
    historyAnswerCount: nextHistoryAnswerCount,
    maxHistoryAnswers,
    isSessionComplete,
  };

  if (learningSessionId) {
    // Learning responses are linked to both the session and the student's auth.users id.
    await supabase.from("learning_responses").insert({
      session_id: learningSessionId,
      student_id: user.id,
      question_type: step,
      student_answer: message,
      ai_feedback: reply,
      detected_weakness: countsAsHistoryAnswer ? getDetectedWeakness(step) : "Casual conversation",
    });
  }

  return NextResponse.json(response);
}
