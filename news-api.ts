import type { PremiumArticle } from "./mockData";

export async function getLiveArticles(signal?: AbortSignal): Promise<PremiumArticle[]> {
  const response = await fetch("/api/articles", { signal, headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`News request failed (${response.status})`);
  const body: unknown = await response.json();
  if (!body || typeof body !== "object" || !("articles" in body) || !Array.isArray(body.articles)) {
    throw new Error("News API returned an invalid response");
  }
  return body.articles as PremiumArticle[];
}
