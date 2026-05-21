import { NextResponse } from "next/server";
import {
  formatReadingPassageOptionForPrompt,
  getReadingPassageOptionById,
  getRandomTaiwanHistoryEntryForPrompt,
} from "@/lib/taiwan-history-knowledge";
import type { PassageLanguage } from "@/lib/types";

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

const localExamples = [
  "Taipei",
  "Tainan",
  "Taichung",
  "Kaohsiung",
  "Hualien",
  "Chiayi",
  "a sugar-producing town in southern Taiwan",
  "a mountain village",
  "a school in colonial Taiwan",
  "a railway station community",
];

const timeFrames = [
  "the early colonial period after 1895",
  "the 1910s",
  "the 1920s",
  "the 1930s",
  "the wartime years before 1945",
];

const readingAngles = [
  "show both modernization and colonial control",
  "focus on how ordinary students or families experienced change",
  "explain one policy and its effect on daily life",
  "compare benefits and limits of colonial modernization",
  "describe how Taiwanese people responded in different ways",
];

const validPassageLanguages: PassageLanguage[] = ["en", "zh"];

function pickRandom(items: string[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function isPassageLanguage(value: unknown): value is PassageLanguage {
  return (
    typeof value === "string" &&
    validPassageLanguages.includes(value as PassageLanguage)
  );
}

function extractText(data: OpenAIResponseBody) {
  // The Responses API can return text in output_text or inside nested output content.
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

  const body = (await request.json().catch(() => ({}))) as {
    passageLanguage?: unknown;
    passageOptionId?: unknown;
  };
  const passageLanguage = isPassageLanguage(body.passageLanguage)
    ? body.passageLanguage
    : "en";
  const selectedPassageOption =
    typeof body.passageOptionId === "string"
      ? getReadingPassageOptionById(body.passageOptionId)
      : null;

  const languageInstruction =
    passageLanguage === "zh"
      ? "Write 250 to 400 Traditional Chinese characters."
      : "Write 150 to 250 English words.";

  const punctuationInstruction =
    passageLanguage === "zh"
      ? "Use Traditional Chinese punctuation."
      : "Use plain ASCII punctuation.";

  const instructions = [
    "You generate short reading passages for junior high school students.",
    "The topic must ONLY be Taiwan during the Japanese colonial period from 1895 to 1945.",
    "Allowed topics include Japanese rule in Taiwan, education, infrastructure, modernization, public health, sugar industry, economy, colonial policies, Kominka movement, Taiwanese society, resistance movements, and local Taiwan history examples.",
    "Do NOT write about modern Taiwan after 1945, Qing dynasty Taiwan, general Japanese history unrelated to Taiwan, or unrelated world history.",
    languageInstruction,
    passageLanguage === "zh"
      ? "Use clear, factual, not-too-difficult Traditional Chinese."
      : "Use clear, factual, not-too-difficult English.",
    "Do not include a title, questions, bullet points, markdown, emoji, or citations.",
    punctuationInstruction,
  ].join("\n");

  // These random choices make each generated passage feel different while staying in scope.
  const randomLocalExample = pickRandom(localExamples);
  const randomTimeFrame = selectedPassageOption ? null : pickRandom(timeFrames);
  const randomAngle = pickRandom(readingAngles);
  const knowledgeContext = selectedPassageOption
    ? formatReadingPassageOptionForPrompt(selectedPassageOption, passageLanguage)
    : getRandomTaiwanHistoryEntryForPrompt(passageLanguage);

  let openAIResponse: Response;

  try {
    openAIResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      // This prevents the UI from waiting forever if OpenAI is slow.
      signal: AbortSignal.timeout(20000),
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-5-mini",
        instructions,
        input: [
          "Create one classroom reading passage about Taiwan under Japanese rule between 1895 and 1945.",
          passageLanguage === "zh"
            ? "The passage must be written in Traditional Chinese."
            : "The passage must be written in English.",
          selectedPassageOption
            ? "Use this selected event or topic as the factual source:"
            : "Use this fixed classroom knowledge base entry as the factual source. It may be a topic or a specific historical event:",
          knowledgeContext,
          `Local example: ${randomLocalExample}.`,
          randomTimeFrame ? `Time frame: ${randomTimeFrame}.` : "Use the time frame from the selected source.",
          `Reading angle: ${randomAngle}.`,
          "Make this passage different from a generic overview. Use specific but student-friendly historical details.",
        ].join("\n"),
        reasoning: { effort: "minimal" },
        text: { verbosity: "low" },
        max_output_tokens: 500,
      }),
    });
  } catch {
    return NextResponse.json(
      { error: "OpenAI took too long to generate a passage. Please try again." },
      { status: 504 },
    );
  }

  const data = (await openAIResponse.json()) as OpenAIResponseBody;

  if (!openAIResponse.ok) {
    return NextResponse.json(
      { error: data.error?.message ?? "OpenAI passage generation failed." },
      { status: openAIResponse.status },
    );
  }

  const passage = extractText(data);

  if (!passage) {
    return NextResponse.json(
      { error: "OpenAI returned an empty passage." },
      { status: 502 },
    );
  }

  return NextResponse.json({ passage });
}
