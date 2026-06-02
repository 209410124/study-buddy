import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ChatMessage, ChatRequest, ChatResponse, ChatStep, PassageLanguage } from "@/lib/types";

const maxHistoryAnswers = 5;
const validSteps: ChatStep[] = [
  "mainIdea",
  "evidence",
  "reasoning",
  "organize_reasoning",
  "connect_location_to_reason",
  "reflection",
  "completed",
];
const validPassageLanguages: PassageLanguage[] = ["en", "zh"];
const validEvaluationLabels = [
  "good_with_evidence",
  "reasonable_paraphrase",
  "location_given",
  "general_but_correct",
  "needs_more_detail",
  "off_topic",
  "completion_requested",
] as const;

type EvaluationLabel = (typeof validEvaluationLabels)[number];

type TutorDecision = {
  evaluation_label: EvaluationLabel;
  detected_evidence: string[];
  next_step: ChatStep;
  ai_reply: string;
};

type OpenAIChatCompletionBody = {
  choices?: {
    message?: {
      content?: string | null;
      refusal?: string | null;
    };
  }[];
  error?: {
    message?: string;
  };
};

const tutorDecisionSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    evaluation_label: {
      type: "string",
      enum: validEvaluationLabels,
      description: "Semantic evaluation of the student's latest message.",
    },
    detected_evidence: {
      type: "array",
      description:
        "Specific words, phrases, or concise details from the student's answer that can be tied to the passage.",
      items: { type: "string" },
    },
    next_step: {
      type: "string",
      enum: validSteps,
      description:
        "The best next teaching phase. Choose flexibly from the valid app steps instead of following a fixed order.",
    },
    ai_reply: {
      type: "string",
      description:
        "The exact warm study-buddy reply to show the student. It should naturally acknowledge useful evidence when present.",
    },
  },
  required: ["evaluation_label", "detected_evidence", "next_step", "ai_reply"],
} as const;

function isChatStep(value: unknown): value is ChatStep {
  return typeof value === "string" && validSteps.includes(value as ChatStep);
}

function isEvaluationLabel(value: unknown): value is EvaluationLabel {
  return (
    typeof value === "string" &&
    validEvaluationLabels.includes(value as EvaluationLabel)
  );
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

function getDetectedWeakness(step: ChatStep) {
  const weaknessByStep: Record<ChatStep, string> = {
    mainIdea: "Finding the main idea",
    evidence: "Using specific evidence",
    reasoning: "Explaining why evidence matters",
    organize_reasoning: "Organizing a reasonable answer",
    connect_location_to_reason: "Connecting paragraph location to reasoning",
    reflection: "Connecting history to a bigger idea",
    completed: "Review completed",
  };

  return weaknessByStep[step];
}

function getGentleFallbackReply(passageLanguage: PassageLanguage) {
  if (passageLanguage === "zh") {
    return "我有看到你的想法。你可以先用自己的話整理成一句：原因是什麼、造成什麼影響？";
  }

  return "I can see your idea. Try putting it into one sentence: what was the reason, and what effect did it have?";
}

function getGentlePrematureCompletionReply(
  passageLanguage: PassageLanguage,
  nextHistoryAnswerCount: number,
) {
  if (passageLanguage === "zh") {
    return `你已經完成 ${nextHistoryAnswerCount}/${maxHistoryAnswers} 題閱讀檢查，還差一點點。你剛剛的想法可以保留，我們把它整理清楚：這個原因對當時的人有什麼影響？`;
  }

  return `You have completed ${nextHistoryAnswerCount}/${maxHistoryAnswers} reading checks, so we have a little more to do. Keep your idea and organize it: what effect would that reason have on people's lives?`;
}

function getContinuationStep(currentStep: ChatStep) {
  if (currentStep === "completed") {
    return "completed";
  }

  const continuationStepByCurrentStep: Record<Exclude<ChatStep, "completed">, ChatStep> = {
    mainIdea: "organize_reasoning",
    evidence: "reasoning",
    reasoning: "organize_reasoning",
    organize_reasoning: "reflection",
    connect_location_to_reason: "organize_reasoning",
    reflection: "reflection",
  };

  return continuationStepByCurrentStep[currentStep];
}

function getSystemPrompt(passageLanguage: PassageLanguage) {
  const languageGuidance =
    passageLanguage === "zh"
      ? "Reply to the student only in simple Traditional Chinese, with Traditional Chinese punctuation."
      : "Reply to the student only in simple English. If the student writes in Chinese, still reply in English.";

  return [
    "You are Hank, a warm AI study buddy for junior high school students learning Taiwan history.",
    "Your job is to understand the student's latest answer semantically, compare it with the passage, decide the most helpful next teaching move, and write the final reply.",
    "Do not rely on keyword matching. Treat paraphrases, partial answers, uncertainty, and casual messages by meaning.",
    "Keep replies suitable for junior high school students: short, warm, natural, and not too academic.",
    "Usually use one acknowledgement, one explanation or clearer restatement, and one simple follow-up question, but vary the shape of the reply based on the recent chat.",
    "Read the recent chat history before writing ai_reply. Do not repeat the same opening, sentence pattern, praise phrase, or follow-up question used in the last few assistant messages.",
    "Avoid formulaic frames such as 'You already found ... these clues' followed by 'use your own words' every time. If the student's answer is clear, move the conversation forward with a fresh, specific coaching move.",
    "For Chinese replies, sound like a patient teacher talking naturally: concise, varied, and specific to the student's exact words.",
    "Any follow-up question must be answerable from the passage unless the student is only chatting or asking to stop.",
    "When the student gives useful evidence, weave the evidence into your praise naturally. Do not prepend a fixed label.",
    "Do not give the student new answer content. Never introduce historical reasons, examples, terms, or details that the student has not already named.",
    "When organizing a student's idea, restate only the student's own evidence and very general connective language. Do not add extra causes or examples from the passage.",
    "If the student needs another reason or example, ask them to look back at the passage and choose one clue in their own words.",
    "For junior high students, do not over-ask for exact textual evidence if the student has already given a reasonable reason or paraphrased evidence.",
    "If the student gives a partially correct answer with clear meaning, first accept it, restate it in clearer historical language, and ask only one light follow-up question.",
    "Use evaluation_label reasonable_paraphrase when the student does not quote the passage exactly but gives a reasonable reason, reasonable evidence, or close-to-correct understanding in their own words.",
    "For reasonable_paraphrase, set next_step to organize_reasoning. Do not use evidence or ask_quote behavior.",
    "When the student identifies a paragraph or line location instead of copying a sentence, use evaluation_label location_given and set next_step to connect_location_to_reason.",
    "Treat paragraph or line locations as useful evidence. Help the student connect that location to their answer instead of asking them to extract the sentence again.",
    "Do not ask the student to quote exact sentences unless the student gives an unsupported claim, the student is preparing for evidence-based writing, or the teacher mode explicitly requires citation practice.",
    "Ask guiding questions only when the student's answer is unclear, unsupported, or off-topic.",
    "If the student already gives a reasonable answer, acknowledge it and help them organize the idea.",
    "Avoid repeated questions about the same evidence.",
    `Do not set next_step to completed until the student has completed ${maxHistoryAnswers} meaningful reading-check answers, unless the student clearly asks to stop.`,
    "The next_step may jump to any valid phase when that better serves the student: mainIdea, evidence, reasoning, organize_reasoning, connect_location_to_reason, reflection, completed.",
    
    languageGuidance,
    "",
    "Few-shot examples:",
    "",
    "Example 1, strong answer with evidence:",
    'Student answer: "The passage says schools and railways changed daily life, so Japanese rule affected how people learned and moved around."',
    'JSON: {"evaluation_label":"good_with_evidence","detected_evidence":["schools","railways changed daily life"],"next_step":"reasoning","ai_reply":"Nice work. You used schools and railways as clear clues from the passage, and that helps show how rule affected daily life. What does that change tell us about people\'s everyday experience?"}',
    "",
    "Example 2, general but on topic:",
    'Student answer: "It is about Japan changing Taiwan."',
    'JSON: {"evaluation_label":"general_but_correct","detected_evidence":[],"next_step":"mainIdea","ai_reply":"Good start. You found the general direction. Look back at the passage and choose one change it mentions. You can say it in your own words."}',
    "",
    "Example 3, needs support or off topic:",
    'Student answer: "I do not know, this is hard."',
    'JSON: {"evaluation_label":"needs_more_detail","detected_evidence":[],"next_step":"mainIdea","ai_reply":"That is okay. Let us make it smaller. Which paragraph do you think might tell us the main point?"}',
    "",
    "Example 4, reasonable paraphrase:",
    'Student answer: "因為長期被當牛馬，失去傳統獵場"',
    'JSON: {"evaluation_label":"reasonable_paraphrase","detected_evidence":["長期被當牛馬","失去傳統獵場"],"next_step":"organize_reasoning","ai_reply":"對，你已經抓到「長期被當牛馬」和「失去傳統獵場」這兩個線索了。可以先整理成：他們長期受到壓迫，原本的生活空間也被限制。接下來請回到文章，再找一個你覺得也會造成反抗的線索，用自己的話說就好。"}',
    "",
    "Example 5, paragraph location only:",
    'Student answer: "第一行段段跟第二行頭段"',
    'JSON: {"evaluation_label":"location_given","detected_evidence":["第一行段段","第二行頭段"],"next_step":"connect_location_to_reason","ai_reply":"好，你已經找到可能相關的位置了。先不要急著抄原句，請看那幾段，用自己的話說出一個你看到的原因就好。"}',
  ].join("\n");
}

function getUserPrompt(params: {
  studentName: string;
  message: string;
  passage: string;
  step: ChatStep;
  history: ChatMessage[];
  answeredItems: string[];
  historyAnswerCount: number;
  passageLanguage: PassageLanguage;
  selectedTopic: string;
  currentRole: string;
}) {
  return [
    `Student name: ${params.studentName}`,
    `Current app step: ${params.step}`,
    `History answers completed before this message: ${params.historyAnswerCount} of ${maxHistoryAnswers}`,
    `Selected topic: ${params.selectedTopic}`,
    `Related role or perspective: ${params.currentRole}`,
    `Previously detected evidence from the client/session: ${params.answeredItems.join(", ") || "none"}`,
    `Recent chat history: ${JSON.stringify(params.history)}`,
    `Reading passage:\n${params.passage}`,
    `Latest student message:\n${params.message}`,
    "",
    "Return one JSON object. Decide evaluation_label, detected_evidence, next_step, and ai_reply together.",
    "Before writing ai_reply, compare it with the assistant messages in Recent chat history and make sure it does not reuse the same wording or structure.",
    "If the latest message is a reasonable paraphrase, use evaluation_label reasonable_paraphrase and next_step organize_reasoning.",
    "If the latest message gives only paragraph or line location, use evaluation_label location_given and next_step connect_location_to_reason.",
    "Do not ask for exact sentences after reasonable_paraphrase or location_given.",
    "Do not provide additional causes, examples, or answers that are not already in the student's latest message. Let the student find new clues from the passage.",
    "Use completion_requested with next_step completed if the student clearly wants to stop or finish.",
    `If the current count is ${maxHistoryAnswers - 1} and the latest message is a meaningful history answer, set next_step to completed and make ai_reply a warm closing with no new practice question.`,
  ].join("\n\n");
}

function parseTutorDecision(data: OpenAIChatCompletionBody): TutorDecision | null {
  const message = data.choices?.[0]?.message;
  const content = message?.content;

  if (!content || message.refusal) {
    return null;
  }

  try {
    const parsed = JSON.parse(content) as Partial<TutorDecision>;

    if (
      !isEvaluationLabel(parsed.evaluation_label) ||
      !Array.isArray(parsed.detected_evidence) ||
      !isChatStep(parsed.next_step) ||
      typeof parsed.ai_reply !== "string"
    ) {
      return null;
    }

    return {
      evaluation_label: parsed.evaluation_label,
      detected_evidence: parsed.detected_evidence.filter(
        (item): item is string => typeof item === "string" && item.trim().length > 0,
      ),
      next_step: parsed.next_step,
      ai_reply: parsed.ai_reply.trim(),
    };
  } catch {
    return null;
  }
}

function normalizeTutorDecision(decision: TutorDecision): TutorDecision {
  if (decision.evaluation_label === "reasonable_paraphrase") {
    return {
      ...decision,
      next_step: "organize_reasoning",
    };
  }

  if (decision.evaluation_label === "location_given") {
    return {
      ...decision,
      next_step: "connect_location_to_reason",
    };
  }

  return decision;
}

function shouldCountAsHistoryAnswer(decision: TutorDecision, currentStep: ChatStep) {
  if (currentStep === "completed") {
    return false;
  }

  return (
    decision.evaluation_label === "good_with_evidence" ||
    decision.evaluation_label === "reasonable_paraphrase" ||
    decision.evaluation_label === "location_given" ||
    decision.evaluation_label === "general_but_correct"
  );
}

function getWeaknessForDecision(decision: TutorDecision, step: ChatStep) {
  if (decision.evaluation_label === "off_topic") {
    return "Off-topic response";
  }

  if (decision.evaluation_label === "needs_more_detail") {
    return "Needs more detail";
  }

  if (decision.evaluation_label === "completion_requested") {
    return "Student ended practice";
  }

  if (decision.evaluation_label === "reasonable_paraphrase") {
    return "Organizing a reasonable paraphrase";
  }

  if (decision.evaluation_label === "location_given") {
    return "Connecting paragraph location to reasoning";
  }

  return getDetectedWeakness(step);
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
  const selectedTopic =
    body.selectedTopic?.trim().slice(0, 120) ||
    "Taiwan history during the Japanese colonial period";
  const currentRole =
    body.currentRole?.trim().slice(0, 160) ||
    "A Taiwanese student living during the Japanese colonial period";

  if (!message || !passage || !isChatStep(step)) {
    return NextResponse.json(
      { error: "message, passage, studentName, and a valid step are required." },
      { status: 400 },
    );
  }

  let openAIResponse: Response;

  try {
    openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: AbortSignal.timeout(20000),
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-5-mini",
        reasoning_effort: "minimal",
        messages: [
          { role: "system", content: getSystemPrompt(passageLanguage) },
          {
            role: "user",
            content: getUserPrompt({
              studentName,
              message,
              passage,
              step,
              history,
              answeredItems: clientAnsweredItems,
              historyAnswerCount,
              passageLanguage,
              selectedTopic,
              currentRole,
            }),
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "study_buddy_tutor_decision",
            strict: true,
            schema: tutorDecisionSchema,
          },
        },
        max_completion_tokens: 1200,
      }),
    });
  } catch {
    return NextResponse.json(
      { error: "OpenAI took too long to respond. Please try again." },
      { status: 504 },
    );
  }

  const data = (await openAIResponse.json()) as OpenAIChatCompletionBody;

  if (!openAIResponse.ok) {
    return NextResponse.json(
      { error: data.error?.message ?? "OpenAI request failed." },
      { status: openAIResponse.status },
    );
  }

  const parsedDecision = parseTutorDecision(data);

  if (!parsedDecision) {
    return NextResponse.json(
      { error: "OpenAI returned an invalid structured response." },
      { status: 502 },
    );
  }

  const decision = normalizeTutorDecision(parsedDecision);
  const countsAsHistoryAnswer = shouldCountAsHistoryAnswer(decision, step);
  const nextHistoryAnswerCount = countsAsHistoryAnswer
    ? Math.min(historyAnswerCount + 1, maxHistoryAnswers)
    : historyAnswerCount;
  const studentRequestedCompletion = decision.evaluation_label === "completion_requested";
  const reachedRequiredAnswerCount = nextHistoryAnswerCount >= maxHistoryAnswers;
  const isPrematureModelCompletion =
    decision.next_step === "completed" && !studentRequestedCompletion && !reachedRequiredAnswerCount;
  const isSessionComplete = studentRequestedCompletion || reachedRequiredAnswerCount;
  const nextStep: ChatStep = isSessionComplete
    ? "completed"
    : isPrematureModelCompletion
      ? getContinuationStep(step)
      : decision.next_step;
  const reply = isPrematureModelCompletion
    ? getGentlePrematureCompletionReply(passageLanguage, nextHistoryAnswerCount)
    : decision.ai_reply || getGentleFallbackReply(passageLanguage);

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
      question_type: nextStep === "completed" ? "completed" : step,
      student_answer: message,
      ai_feedback: reply,
      detected_weakness: getWeaknessForDecision(decision, step),
    });
  }

  return NextResponse.json(response);
}
