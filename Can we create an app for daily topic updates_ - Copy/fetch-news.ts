import * as db from "../db";
import { fetchAllFeeds } from "../services/rss-fetcher";
import { generateArticleSummary } from "../services/ai-summarizer";

/**
 * Main procedure to fetch news, process articles, and generate summaries
 */
export async function fetchAndProcessNews() {
  console.log("[Fetch] Starting news fetch and processing...");

  try {
    // Step 1: Fetch all RSS feeds
    const fetchResults = await fetchAllFeeds();
    console.log("[Fetch] Feed fetch results:", fetchResults);

    // Step 2: Get recent unsummarized articles
    const recentArticles = await db.getRecentArticles(24, 100);
    const unsummarizedArticles = recentArticles.filter(
      (a) => !a.gist || !a.whyItMatters || !a.keyTakeaway
    );

    console.log(
      `[Fetch] Found ${unsummarizedArticles.length} articles needing summaries`
    );

    // Step 3: Generate summaries for articles
    let summarizedCount = 0;
    for (const article of unsummarizedArticles) {
      try {
        const summary = await generateArticleSummary(
          article.title,
          article.description || ""
        );

        if (summary) {
          // Update article with summary
          await db.updateArticle(article.id, {
            gist: summary.gist,
            whyItMatters: summary.whyItMatters,
            keyTakeaway: summary.keyTakeaway,
          });
          summarizedCount++;
          console.log(`[Fetch] Summarized article: ${article.title}`);
        }
      } catch (error) {
        console.error(
          `[Fetch] Failed to summarize article ${article.id}:`,
          error
        );
      }
    }

    console.log(
      `[Fetch] Successfully summarized ${summarizedCount} articles`
    );

    return {
      success: true,
      feedsFetched: fetchResults.successful,
      feedsFailed: fetchResults.failed,
      articlesAdded: fetchResults.articlesAdded,
      articlesSummarized: summarizedCount,
    };
  } catch (error) {
    console.error("[Fetch] Error during news processing:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
