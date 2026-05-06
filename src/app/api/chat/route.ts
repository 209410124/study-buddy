import { NextResponse } from "next/server";
import type { ChatMessage, ChatRequest, ChatResponse, ChatStep, PassageLanguage } from "@/lib/types";

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
    "The student is working on the main idea. React to their idea first, give a small hint if it is too general, then ask for one more specific detail from the passage.",
  evidence:
    "The student is working on evidence. If they gave evidence, react warmly, say why the detail is useful, then ask why that evidence matters.",
  reasoning:
    "The student is working on reasoning. If they explained well, encourage them, give one short comment, then ask one reflection question.",
  reflection:
    "The student is reflecting. React naturally, give one small encouraging study tip, then ask one gentle question that keeps them thinking about Taiwan from 1895 to 1945.",
  completed:
    "The practice is already complete. Give a short friendly wrap-up and ask one gentle question about what they remember from the passage.",
};

const encouragingOpeners: Record<PassageLanguage, string[]> = {
  en: [
    "Nice try.",
    "Good start.",
    "I see what you mean.",
    "That is a reasonable idea.",
    "You are getting close.",
  ],
  zh: [
    "不錯的嘗試。",
    "很好的開始。",
    "我懂你的意思。",
    "這個想法有道理。",
    "你快抓到重點了。",
  ],
};

const hintOpeners: Record<PassageLanguage, string[]> = {
  en: [
    "Let's look again.",
    "Here is a small hint.",
    "Try checking the passage one more time.",
    "Look for a sentence that gives a clue.",
  ],
  zh: [
    "我們再看一次。",
    "給你一個小提示。",
    "可以再回到文章找找看。",
    "找找看哪一句有線索。",
  ],
};

const celebrationOpeners: Record<PassageLanguage, string[]> = {
  en: [
    "Great job.",
    "That's a strong answer.",
    "Nice evidence.",
    "You explained that clearly.",
  ],
  zh: [
    "做得很好。",
    "這是很有力的回答。",
    "這個證據不錯。",
    "你說明得很清楚。",
  ],
};

const companionOpeners: Record<PassageLanguage, string[]> = {
  en: [
    "That sounds tough.",
    "I get that.",
    "Thanks for telling me.",
    "That makes sense.",
    "I'm here with you.",
  ],
  zh: [
    "聽起來真的不容易。",
    "我懂那種感覺。",
    "謝謝你跟我說。",
    "這樣想很正常。",
    "我在這裡陪你。",
  ],
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
  return (
    typeof value === "string" &&
    validPassageLanguages.includes(value as PassageLanguage)
  );
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
    .slice(-6)
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
    `Preferred reaction opener for this reply: ${preferredReaction}`,
    `Optional encouraging opener: ${selectedEncouragingOpener}`,
    `Optional hint opener: ${selectedHintOpener}`,
    `Optional celebration opener: ${selectedCelebrationOpener}`,
    `Optional companion opener for casual chat or feelings: ${selectedCompanionOpener}`,
  ].join("\n");
}

function extractReply(data: OpenAIResponseBody) {
  // Responses API may return text as output_text or inside output content.
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

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is missing from .env." },
      { status: 500 },
    );
  }

  const body = (await request.json()) as Partial<ChatRequest>;
  const message = body.message?.trim();
  const passage = body.passage?.trim();
  const studentName = body.studentName?.trim() || "Student";
  const step = body.step;
  const history = normalizeHistory(body.history);
  const passageLanguage = isPassageLanguage(body.passageLanguage)
    ? body.passageLanguage
    : "en";

  if (!message || !passage || !isChatStep(step)) {
    return NextResponse.json(
      { error: "message, passage, studentName, and a valid step are required." },
      { status: 400 },
    );
  }

  const nextStep = nextStepByCurrentStep[step];
  const openerGuidance = getOpenerGuidance(step, passageLanguage);
  const languageRules =
    passageLanguage === "zh"
      ? [
          "Use simple Traditional Chinese suitable for junior high school students.",
          "The passage is written in Traditional Chinese. Reply only in Traditional Chinese.",
          "Use Traditional Chinese punctuation and no emoji.",
          "Do not use English opener phrases in the reply.",
        ]
      : [
          "Use simple English suitable for junior high school students.",
          "The passage is written in English. Reply only in simple English.",
          "If the student writes in Chinese, still reply in English.",
          "The follow-up question must be written in English.",
          "Use plain ASCII punctuation and no emoji.",
        ];
  const exampleStyles =
    passageLanguage === "zh"
      ? [
          "Example style for a general answer: 很好的開始，你抓到大方向了。我們可以再說得更明確一點。文章最常提到台灣的哪一種改變？",
          "Example style for uncertainty: 沒關係，我們一起找線索。可以看看哪一句提到人們日常生活的改變？",
          "Example style for evidence: 這個證據不錯，學校教日語確實和教育改變有關。你覺得語言在學校裡為什麼重要？",
          "Example style for feelings: 聽起來真的有點累。我們可以慢慢來。你想先一起看一句就好嗎？",
        ]
      : [
          "Example style for a general answer: Good start, you found the general topic. Let's make it a little more specific. What change in Taiwan does the passage talk about most?",
          "Example style for uncertainty: That's okay. Let's look for clues together. Which sentence tells us what changed in people's daily life?",
          "Example style for evidence: Nice, that is useful evidence. This shows how education changed under Japanese rule. Why do you think language was important in schools?",
          "Example style for feelings: That sounds tiring. We can take this slowly. Do you want to look at just one sentence together?",
        ];

  // This prompt keeps the learning flow predictable while the model writes like a warm study buddy.
  const instructions = [
    "Your name is Hank, and you are a friendly learning companion for junior high school students.",
    "The student is learning Taiwan history, especially Taiwan during the Japanese colonial period from 1895 to 1945.",
    "Your goal is not to give answers directly.",
    "Your goal is to help the student think, read, find evidence, and explain ideas.",
    "Sound warm, natural, and supportive, like a friendly study buddy.",
    "Do not sound like a formal exam question.",
    ...languageRules,
    "Keep replies short.",
    "Respond to the student's idea first before asking a question.",
    "If the student is chatting casually or sharing feelings like tiredness, stress, boredom, confusion, pride, sadness, or frustration, respond like a caring companion first.",
    "For casual chat or feelings, do not force the reading-step pattern.",
    "For casual chat or feelings, acknowledge the feeling, give one brief supportive comment, then ask at most one gentle question or suggest one tiny next step.",
    "Do not turn every emotional message into a history question immediately.",
    "After supporting the student, gently connect back to the passage only when it feels natural.",
    "Use conversational variation so replies do not start the same way every time.",
    "You may use the selected opener guidance, but keep it natural and do not force every opener into one reply.",
    "For direct reading answers, use this pattern:",
    "1. A short natural reaction.",
    "2. A short hint or comment.",
    "3. Ask only one follow-up question.",
    "Keep the whole reply under 3 short sentences.",
    "Ask only one question at a time.",
    "Do not write long explanations.",
    "Do not shame the student.",
    "Do not say wrong answer.",
    "Do not give the full answer directly.",
    "If the student gives a short answer, ask for more detail kindly.",
    "If the student gives evidence, ask why the evidence matters.",
    "If the student explains well, give encouragement and a reflection question.",
    "Stay within Taiwan Japanese colonial period history.",
    "If the student moves away from the topic, gently bring them back to Taiwan under Japanese rule.",
    "Always remember the current learning step: main idea, evidence, reasoning, or reflection.",
    "Do not include labels, scores, markdown, or bullet points.",
    ...exampleStyles,
  ].join("\n");

  const input = [
    `Student name: ${studentName}`,
    `Current step: ${step}`,
    `Next step to return: ${nextStep}`,
    `Reading passage: ${passage}`,
    `Recent chat history: ${JSON.stringify(history)}`,
    `Student message: ${message}`,
    `Conversational opener guidance: ${openerGuidance}`,
    `Tutor instruction: ${stepInstructions[step]}`,
  ].join("\n\n");

  let openAIResponse: Response;

  try {
    openAIResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      // Avoid a request that waits forever and makes the chat feel frozen.
      signal: AbortSignal.timeout(20000),
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-5-mini",
        instructions,
        input,
        // Keep latency and cost low, but leave enough room for GPT-5 mini to produce visible text.
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
  };

  return NextResponse.json(response);
}
