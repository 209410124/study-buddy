import { NextResponse } from "next/server";
import type { ChatRequest, ChatResponse, ChatStep } from "@/lib/types";

const validSteps: ChatStep[] = ["mainIdea", "evidence", "reasoning", "completed"];

const nextStepByCurrentStep: Record<ChatStep, ChatStep> = {
  mainIdea: "evidence",
  evidence: "reasoning",
  reasoning: "completed",
  completed: "completed",
};

const stepInstructions: Record<ChatStep, string> = {
  mainIdea:
    "The student just tried to explain the main idea. Give one short encouraging comment, then ask them to find one detail from the passage as evidence.",
  evidence:
    "The student just gave evidence. Give one short encouraging comment, then ask them how the evidence supports the main idea.",
  reasoning:
    "The student just explained their reasoning. Give brief encouragement and one small suggestion for the next reading practice. Do not ask another question.",
  completed:
    "The practice is already complete. Give a short friendly wrap-up and invite the student to restart if they want more practice.",
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

  if (!message || !passage || !isChatStep(step)) {
    return NextResponse.json(
      { error: "message, passage, studentName, and a valid step are required." },
      { status: 400 },
    );
  }

  const nextStep = nextStepByCurrentStep[step];

  // This prompt keeps the teacher-facing learning flow predictable while OpenAI writes the wording.
  const instructions = [
    "You are AI Study Buddy, a friendly learning companion for junior high school students.",
    "The learning topic is only Taiwanese history during the Japanese colonial period from 1895 to 1945.",
    "If the student asks about an unrelated topic, gently guide them back to Taiwan under Japanese rule.",
    "Use simple English.",
    "Be encouraging.",
    "Ask one question at a time.",
    "Do not give the full answer directly.",
    "Guide the student to think.",
    "Use plain ASCII punctuation and no emoji.",
    "Keep the response short, about 1 to 3 sentences.",
  ].join("\n");

  const input = [
    `Student name: ${studentName}`,
    `Current step: ${step}`,
    `Next step to return: ${nextStep}`,
    `Reading passage: ${passage}`,
    `Student message: ${message}`,
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
