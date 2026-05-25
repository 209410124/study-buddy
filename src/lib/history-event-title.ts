import { taiwanReadingPassageOptions } from "@/lib/taiwan-history-knowledge";
import type { HistoryEvent } from "@/data/history-events";
import type { PassageLanguage } from "@/lib/types";

export function getLocalizedHistoryEventTitle(
  event: HistoryEvent,
  language: PassageLanguage,
) {
  const passageOption = taiwanReadingPassageOptions.find((option) => option.id === event.id);

  if (!passageOption) {
    return event.title;
  }

  return language === "zh" ? passageOption.titleZh : passageOption.titleEn;
}
