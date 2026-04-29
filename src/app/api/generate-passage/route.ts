import { NextResponse } from "next/server";

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

const subtopics = [
  "education during Japanese rule",
  "railways and infrastructure",
  "public health campaigns",
  "the sugar industry and colonial economy",
  "colonial policies and daily life",
  "the Kominka movement",
  "Taiwanese society under Japanese rule",
  "resistance movements",
  "local government and police control",
  "modernization and its limits",
];

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

function pickRandom(items: string[]) {
  return items[Math.floor(Math.random() * items.length)];
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

export async function POST() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is missing from .env." },
      { status: 500 },
    );
  }

  const instructions = [
    "You generate short English reading passages for junior high school students.",
    "The topic must ONLY be Taiwan during the Japanese colonial period from 1895 to 1945.",
    "Allowed topics include Japanese rule in Taiwan, education, infrastructure, modernization, public health, sugar industry, economy, colonial policies, Kominka movement, Taiwanese society, resistance movements, and local Taiwan history examples.",
    "Do NOT write about modern Taiwan after 1945, Qing dynasty Taiwan, general Japanese history unrelated to Taiwan, or unrelated world history.",
    "Write 150 to 250 English words.",
    "Use clear, factual, not-too-difficult English.",
    "Do not include a title, questions, bullet points, markdown, emoji, or citations.",
    "Use plain ASCII punctuation.",
  ].join("\n");

  // These random choices make each generated passage feel different while staying in scope.
  const randomSubtopic = pickRandom(subtopics);
  const randomLocalExample = pickRandom(localExamples);
  const randomTimeFrame = pickRandom(timeFrames);
  const randomAngle = pickRandom(readingAngles);

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
          `Random subtopic: ${randomSubtopic}.`,
          `Local example: ${randomLocalExample}.`,
          `Time frame: ${randomTimeFrame}.`,
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
