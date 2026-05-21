import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
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
  const countsAsHistoryAnswer =
    !studentWantsToEnd && step !== "completed" && isHistoryAnswer(message, passage);
  const nextHistoryAnswerCount = countsAsHistoryAnswer
    ? Math.min(historyAnswerCount + 1, maxHistoryAnswers)
    : historyAnswerCount;
  const isSessionComplete = studentWantsToEnd || nextHistoryAnswerCount >= maxHistoryAnswers;
  const nextStep = countsAsHistoryAnswer
    ? isSessionComplete
      ? "completed"
      : nextStepByCurrentStep[step]
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
          "Example style for a history answer: 很好，你抓到文章的重點了。可以再找一個細節來支持你的想法嗎？",
          "Example style for uncertainty or feelings: 聽起來有點卡住了，沒關係，我們慢慢來。你想先看文章中的哪一句？",
          "Example style for completion: 做得很好，今天你已經完成五次歷史思考回答了。我會把這次練習放進歷史紀錄，之後可以再回來查看。",
        ]
      : [
          "Example style for a history answer: Good start, you found the general topic. What detail from the passage supports that idea?",
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
    "Keep replies very short, about one or two sentences.",
    "Respond to the student's idea first before asking a question.",
    "If the student is chatting casually or sharing feelings, respond like a caring companion first.",
    "Casual chat or feelings should not force the reading-step pattern.",
    "For direct passage answers, use this pattern: short reaction, short passage-based question.",
    "Any follow-up question must be answerable from the reading passage shown to the student.",
    "Do not ask questions that require facts not found in the reading passage.",
    "Do not ask students to infer why a group made a choice unless the passage states the reason.",
    "Do not ask for deeper analysis after the student has already given a reasonable passage detail.",
    "Do not keep extending the conversation after the required practice steps are complete.",
    "Ask only one question at a time.",
    "Do not give the full answer directly.",
    "Do not include labels, scores, markdown, or bullet points.",
    countsAsHistoryAnswer
      ? `This message counts as history answer ${nextHistoryAnswerCount} of ${maxHistoryAnswers}.`
      : "This message does not count as a history answer. Do not advance the learning step.",
    isSessionComplete
      ? "The reading check is complete. Give a short warm closing and do not ask another practice question."
      : stepInstructions[step],
    ...exampleStyles,
  ].join("\n");

  const input = [
    `Student name: ${studentName}`,
    `Current step: ${step}`,
    `Next step to return: ${nextStep}`,
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

  const reply = extractReply(data);

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
