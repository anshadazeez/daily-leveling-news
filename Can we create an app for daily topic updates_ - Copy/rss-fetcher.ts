import { parseStringPromise } from "xml2js";
import * as db from "../db";

interface RSSItem {
  title?: string[];
  description?: string[];
  link?: string[];
  pubDate?: string[];
}

interface RSSFeed {
  rss?: {
    channel?: Array<{
      item?: RSSItem[];
    }>;
  };
}

/**
 * Fetches and parses an RSS feed from a given URL
 */
export async function fetchRSSFeed(feedUrl: string): Promise<RSSItem[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(feedUrl, {
      headers: {
        "User-Agent": "Daily Insight News Aggregator",
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const xmlText = await response.text();
    const parsed = (await parseStringPromise(xmlText)) as RSSFeed;

    const items = parsed.rss?.channel?.[0]?.item || [];
    return items;
  } catch (error) {
    console.error(`[RSS] Failed to fetch ${feedUrl}:`, error);
    return [];
  }
}

/**
 * Processes a single RSS item and stores it as an article
 */
export async function processRSSItem(
  item: RSSItem,
  sourceId: number,
  categoryId: number,
  sourceName?: string
) {
  const title = item.title?.[0] || "Untitled";
  const description = item.description?.[0] || "";
  const url = item.link?.[0] || "";
  const publishedAt = item.pubDate?.[0]
    ? new Date(item.pubDate[0])
    : new Date();

  if (!url) {
    console.warn("[RSS] Skipping item without URL");
    return null;
  }

  try {
    const result = await db.insertArticle({
      title,
      description,
      url,
      sourceId,
      sourceName,
      categoryId,
      publishedAt,
    });
    return result;
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      console.log(`[RSS] Article already exists: ${url}`);
      return null;
    }
    throw error;
  }
}

/**
 * Fetches all active news sources and processes their feeds
 */
export async function fetchAllFeeds() {
  console.log("[RSS] Starting feed fetch...");

  const sources = await db.getActiveNewsSources();
  const results = {
    total: sources.length,
    successful: 0,
    failed: 0,
    articlesAdded: 0,
  };

  for (const source of sources) {
    if (source.sourceType !== "rss") {
      console.log(`[RSS] Skipping non-RSS source: ${source.name}`);
      continue;
    }

    console.log(`[RSS] Fetching from ${source.name} (${source.url})`);

      try {
        const items = await fetchRSSFeed(source.url);

        if (items.length === 0) {
          console.warn(`[RSS] No items found in ${source.name}`);
          results.failed++;
          continue;
        }

        let itemsAdded = 0;
        for (const item of items) {
          const result = await processRSSItem(
            item,
            source.id,
            source.categoryId,
            source.name
          );
        if (result) {
          itemsAdded++;
        }
      }

      console.log(
        `[RSS] Added ${itemsAdded}/${items.length} articles from ${source.name}`
      );
      results.successful++;
      results.articlesAdded += itemsAdded;
    } catch (error) {
      console.error(`[RSS] Error processing ${source.name}:`, error);
      results.failed++;
    }
  }

  console.log("[RSS] Feed fetch complete:", results);
  return results;
}
