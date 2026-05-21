import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  getRoleForEvent,
  getRolePlayEventOptionById,
  resolveRolePlayEventId,
} from "@/lib/taiwan-history-knowledge";
import type { ChatMessage, RolePlayRequest, RolePlayResponse } from "@/lib/types";

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

  if (!userData.user) {
    return NextResponse.json({ error: "Please log in before role-playing." }, { status: 401 });
  }

  const body = (await request.json()) as Partial<RolePlayRequest>;
  const message = body.message?.trim();
  const eventId = resolveRolePlayEventId(body.eventId);
  const event = getRolePlayEventOptionById(eventId);
  const role = getRoleForEvent(eventId);
  const history = normalizeHistory(body.history);
  const passageLanguage = body.passageLanguage === "zh" ? "zh" : "en";

  if (!message) {
    return NextResponse.json({ error: "message is required." }, { status: 400 });
  }

  const instructions = [
    "You are the Historical Perspective Mode inside AI Study Buddy.",
    "This is for learning, not entertainment.",
    "Role-play as the selected core historical figure, or the closest core social actor when the topic has no single named figure.",
    "Do not claim to be the real historical person. Speak as a representative perspective.",
    "Help a junior high school student understand historical perspective, cause and effect, and different viewpoints.",
    passageLanguage === "zh"
      ? "Use simple Traditional Chinese suitable for junior high school students."
      : "Use simple English suitable for junior high school students.",
    passageLanguage === "zh"
      ? "Reply only in Traditional Chinese."
      : "Reply only in simple English.",
    "Keep the response short: two to four sentences.",
    "Ask exactly one guiding question at the end.",
    "Do not ask more than one question.",
    "Do not use markdown, bullets, labels, scores, or emoji.",
    "Stay within Taiwan during the Japanese colonial period from 1895 to 1945.",
    "If the student asks about facts outside the role, answer briefly and return to this event perspective.",
    "Avoid graphic detail. Be careful and respectful with violence, Indigenous communities, and colonial pressure.",
  ].join("\n");

  const input = [
    `Selected event or topic: ${event.titleEn}`,
    `Event summary: ${event.passageEn}`,
    `Role name: ${role.roleName}`,
    `Role perspective: ${role.perspective}`,
    `Role background: ${role.background}`,
    `Guiding focus: ${role.guidingFocus}`,
    `Recent chat history: ${JSON.stringify(history)}`,
    `Student message: ${message}`,
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
        max_output_tokens: 260,
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

  const response: RolePlayResponse = { reply };

  return NextResponse.json(response);
}
