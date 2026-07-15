import type { PremiumArticle } from "./mockData";

const DATE_PATTERN = /\b(?:\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)|(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}|\d{4})\b/i;
const NUMBER_PATTERN = /(?:[$€£₹]\s?\d[\d,.]*(?:\s?(?:million|billion|trillion|%))?|\b\d[\d,.]*\s?(?:%|million|billion|trillion|km|years?|days?|hours?)\b)/gi;

function sentences(text: string) {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 20);
}

export function deriveArticleInsights(article: PremiumArticle) {
  const sourceText = `${article.title}. ${article.fullContent || article.description}`;
  const sourceSentences = sentences(sourceText);
  const unique = (items: string[]) => [...new Set(items.map((item) => item.trim()).filter(Boolean))];
  const namedTerms = unique(
    (sourceText.match(/\b(?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3}|[A-Z]{2,})\b/g) ?? [])
      .filter((term) => !["The", "This", "That", "Read", "Open", "Key"].includes(term))
  ).slice(0, 10);

  return {
    executiveSummary: sourceSentences.slice(0, 5).join(" ") || article.description,
    bulletSummary: sourceSentences.slice(0, 10),
    keyFacts: sourceSentences.slice(0, 5),
    numbers: unique(sourceText.match(NUMBER_PATTERN) ?? []).slice(0, 10),
    namedTerms,
    timeline: sourceSentences
      .filter((sentence) => DATE_PATTERN.test(sentence))
      .map((event) => ({ date: event.match(DATE_PATTERN)?.[0] ?? "Date mentioned", event }))
      .slice(0, 8),
  };
}
