import type { ChatMessage } from "@/lib/types";

const knownEvidencePhrases = [
  "破壞鐵軌",
  "減緩日軍前進",
  "掩護撤退中的士兵",
  "馬關條約",
  "台灣被割讓給日本",
  "臺灣被割讓給日本",
  "台灣民主國",
  "臺灣民主國",
  "抵抗日軍",
  "缺乏軍事力量",
  "國際支持",
  "日軍進入台灣",
  "日軍進入臺灣",
  "警察制度",
  "土地調查",
  "公共衛生",
  "日語教育",
  "課本改用日語",
  "學校教日語",
  "學習日語",
  "日式商品包裝",
  "價格標示",
  "車站變成",
  "運送軍隊",
  "運送物資",
  "重要據點",
  "衛生教育",
  "降低部分傳染病",
  "日本史",
  "生活方式",
  "縱貫鐵路",
  "糖業",
  "西來庵事件",
  "台灣文化協會",
  "臺灣文化協會",
  "霧社事件",
  "嘉南大圳",
  "蓬萊米",
  "皇民化",
  "戰爭動員",
  "空襲",
];

function normalizeText(value: string) {
  return value.toLowerCase().replace(/\s+/g, "");
}

function uniqueItems(items: string[]) {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

function isMissingDetailMessage(message: string) {
  const compact = normalizeText(message);

  return [
    "文章中沒有提到",
    "文章沒有提到",
    "文中沒有提到",
    "沒有提到細節",
    "沒有提到",
    "沒提到",
    "沒講",
    "沒有講",
  ].some((pattern) => compact.includes(normalizeText(pattern)));
}

function extractQuotedChineseChunks(message: string, passage: string) {
  const chunks = message
    .split(/[，。！？；、,.!?;:\s]+/)
    .map((chunk) => chunk.trim())
    .filter((chunk) => {
      const cjkLength = (chunk.match(/[\u3400-\u9fff]/g) ?? []).length;

      return cjkLength >= 4 && cjkLength <= 12 && /[\u3400-\u9fff]/.test(chunk);
    });

  return chunks.filter((chunk) => passage.includes(chunk));
}

function extractSharedEnglishWords(message: string, passage: string) {
  const stopWords = new Set([
    "about",
    "after",
    "also",
    "because",
    "before",
    "could",
    "from",
    "have",
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
  const passageWords = new Set(
    passage
      .toLowerCase()
      .match(/[a-z]{5,}/g)
      ?.filter((word) => !stopWords.has(word)) ?? [],
  );

  return (
    message
      .toLowerCase()
      .match(/[a-z]{5,}/g)
      ?.filter((word) => passageWords.has(word) && !stopWords.has(word)) ?? []
  );
}

export function extractAnsweredItems(message: string, passage: string) {
  if (isMissingDetailMessage(message)) {
    return [];
  }

  const normalizedMessage = normalizeText(message);
  const phraseMatches = knownEvidencePhrases.filter((phrase) =>
    normalizedMessage.includes(normalizeText(phrase)),
  );
  const quotedChunks = extractQuotedChineseChunks(message, passage);
  const englishWords = extractSharedEnglishWords(message, passage);

  // This intentionally uses simple visible rules so the memory behavior is explainable to teachers.
  return uniqueItems([...phraseMatches, ...quotedChunks, ...englishWords])
    .sort((firstItem, secondItem) => secondItem.length - firstItem.length)
    .slice(0, 4);
}

export function mergeAnsweredItems(currentItems: string[], newItems: string[]) {
  return uniqueItems([...currentItems, ...newItems]).slice(-20);
}

export function getAskedQuestions(history: ChatMessage[]) {
  return history
    .filter((message) => message.role === "assistant")
    .flatMap((message) => message.content.split(/[？?]/).slice(0, -1))
    .map((question) => question.trim())
    .filter(Boolean)
    .slice(-5);
}
