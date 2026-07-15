import { fetchArxivByCategory, searchArxiv } from "./arxiv-fetcher";
import { aggregateNews } from "./news-fetcher";
import { aggregateResearchFeeds } from "./research-feeds-fetcher";
import { aggregateFinanceNews } from "./finance-fetcher";
import { insertArticle } from "../db";
import type { InsertArticle } from "../../drizzle/schema";

interface UnifiedArticle {
  title: string;
  description: string;
  content?: string;
  url: string;
  imageUrl?: string;
  source: string;
  publishedAt: Date;
  category: "Science" | "Technology" | "Finance" | "Economics" | "Research";
  articleType: "news" | "research_paper" | "research_update" | "finance";
  authors?: string[];
}

/**
 * Map categories to database category IDs
 */
function getCategoryId(category: string): number {
  const categoryMap: Record<string, number> = {
    "Science": 1,
    "Technology": 2,
    "Finance": 3,
    "Economics": 4,
    "Research": 5,
  };
  return categoryMap[category] || 1;
}

/**
 * Normalize article data from different sources
 */
function normalizeArticle(article: any, category: string): UnifiedArticle {
  return {
    title: article.title || "Untitled",
    description: article.description || article.summary || "",
    content: article.content,
    url: article.url,
    imageUrl: article.imageUrl || article.image,
    source: article.source || "Unknown",
    publishedAt: article.publishedAt || new Date(),
    category: category as any,
    articleType: article.articleType || "news",
    authors: article.authors || [],
  };
}

/**
 * Fetch and aggregate all data from all sources
 */
export async function aggregateAllData(): Promise<UnifiedArticle[]> {
  try {
    console.log("[Aggregator] Starting data aggregation from all sources...");

    const allArticles: UnifiedArticle[] = [];

    // Fetch from different sources in parallel
    const [newsArticles, researchUpdates, financeArticles, arxivPapers] =
      await Promise.all([
        aggregateNews(["technology", "science", "business"]),
        aggregateResearchFeeds(),
        aggregateFinanceNews(),
        fetchArxivByCategory("cs.AI", 10),
      ]);

    console.log(`[Aggregator] Fetched ${newsArticles.length} news articles`);
    console.log(`[Aggregator] Fetched ${researchUpdates.length} research updates`);
    console.log(`[Aggregator] Fetched ${financeArticles.length} finance articles`);
    console.log(`[Aggregator] Fetched ${arxivPapers.length} arXiv papers`);

    // Normalize and categorize articles
    newsArticles.forEach((article) => {
      const category = article.category === "science" ? "Science" : "Technology";
      allArticles.push(normalizeArticle(article, category));
    });

    researchUpdates.forEach((update) => {
      allArticles.push(normalizeArticle(update, "Research"));
    });

    financeArticles.forEach((article) => {
      const category = article.category === "Economics" ? "Economics" : "Finance";
      allArticles.push(normalizeArticle(article, category));
    });

    arxivPapers.forEach((paper) => {
      allArticles.push({
        title: paper.title,
        description: paper.summary,
        url: paper.url,
        source: paper.source,
        publishedAt: paper.publishedAt,
        category: "Science",
        articleType: "research_paper",
        authors: paper.authors,
      });
    });

    // Sort by date (newest first)
    allArticles.sort(
      (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
    );

    console.log(`[Aggregator] Total articles aggregated: ${allArticles.length}`);

    return allArticles;
  } catch (error) {
    console.error("[Aggregator] Error aggregating data:", error);
    return [];
  }
}

/**
 * Fetch and store articles in database
 */
export async function fetchAndStoreArticles(): Promise<number> {
  try {
    console.log("[Aggregator] Fetching and storing articles...");

    const articles = await aggregateAllData();
    let stored = 0;

    for (const article of articles) {
      try {
        const insertData: InsertArticle = {
          title: article.title,
          description: article.description,
          content: article.content,
          url: article.url,
          imageUrl: article.imageUrl,
          sourceName: article.source,
          sourceId: 1,
          publishedAt: article.publishedAt,
          categoryId: getCategoryId(article.category),
          fetchedAt: new Date(),
        };

        const result = await insertArticle(insertData);
        if (result) {
          stored++;
        }
      } catch (error: any) {
        if (error.code !== "ER_DUP_ENTRY") {
          console.error("[Aggregator] Error storing article:", error);
        }
      }
    }

    console.log(`[Aggregator] Stored ${stored} new articles`);
    return stored;
  } catch (error) {
    console.error("[Aggregator] Error in fetch and store:", error);
    return 0;
  }
}

/**
 * Fetch articles by category
 */
export async function fetchArticlesByCategory(
  category: "Science" | "Technology" | "Finance" | "Economics" | "Research"
): Promise<UnifiedArticle[]> {
  try {
    const allArticles = await aggregateAllData();
    return allArticles.filter((article) => article.category === category);
  } catch (error) {
    console.error("[Aggregator] Error fetching by category:", error);
    return [];
  }
}

/**
 * Search articles across all sources
 */
export async function searchArticles(query: string): Promise<UnifiedArticle[]> {
  try {
    const allArticles = await aggregateAllData();

    // Simple text search
    return allArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.description.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error("[Aggregator] Error searching articles:", error);
    return [];
  }
}
