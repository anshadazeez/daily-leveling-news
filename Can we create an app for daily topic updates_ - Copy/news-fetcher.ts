import axios from "axios";

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content?: string;
  source: string;
  url: string;
  imageUrl?: string;
  publishedAt: Date;
  author?: string;
  category: string;
}

/**
 * Fetch news from NewsAPI
 * Free tier: 100 requests/day, 250 articles/request
 * Categories: business, entertainment, general, health, science, sports, technology
 */
export async function fetchNewsFromNewsAPI(
  category: string = "technology",
  country: string = "us",
  maxResults: number = 20
): Promise<NewsArticle[]> {
  try {
    // Using a free/demo API key - in production, use environment variable
    const apiKey = process.env.NEWSAPI_KEY || "demo";
    const newsApiUrl = "https://newsapi.org/v2/top-headlines";

    const params = {
      category,
      country,
      pageSize: maxResults,
      apiKey,
    };

    const response = await axios.get(newsApiUrl, { params });

    if (response.data.status !== "ok") {
      console.warn("[NewsAPI] API returned non-ok status:", response.data);
      return [];
    }

    const articles: NewsArticle[] = (response.data.articles || []).map(
      (article: any, index: number) => ({
        id: `newsapi-${category}-${index}-${Date.now()}`,
        title: article.title,
        description: article.description || "",
        content: article.content,
        source: article.source.name,
        url: article.url,
        imageUrl: article.urlToImage,
        publishedAt: new Date(article.publishedAt),
        author: article.author,
        category,
      })
    );

    return articles;
  } catch (error) {
    console.error("[NewsAPI] Error fetching news:", error);
    return [];
  }
}

/**
 * Fetch from BBC News RSS (no API key needed)
 */
export async function fetchBBCNews(): Promise<NewsArticle[]> {
  try {
    const response = await axios.get("https://feeds.bbci.co.uk/news/rss.xml");
    // Parse RSS would go here
    return [];
  } catch (error) {
    console.error("[BBC] Error fetching news:", error);
    return [];
  }
}

/**
 * Fetch from Reuters
 */
export async function fetchReutersNews(): Promise<NewsArticle[]> {
  try {
    // Reuters has limited free API access
    // Would need proper API key and setup
    return [];
  } catch (error) {
    console.error("[Reuters] Error fetching news:", error);
    return [];
  }
}

/**
 * Fetch from Financial Times (requires subscription)
 */
export async function fetchFinancialTimesNews(): Promise<NewsArticle[]> {
  try {
    // FT requires API key and subscription
    return [];
  } catch (error) {
    console.error("[FT] Error fetching news:", error);
    return [];
  }
}

/**
 * Fetch from The Guardian API (free tier available)
 */
export async function fetchGuardianNews(
  section: string = "technology",
  maxResults: number = 20
): Promise<NewsArticle[]> {
  try {
    const apiKey = process.env.GUARDIAN_API_KEY || "demo";
    const guardianUrl = "https://open-platform.theguardian.com/search";

    const params = {
      section,
      "page-size": maxResults,
      "api-key": apiKey,
    };

    const response = await axios.get(guardianUrl, { params });

    const articles: NewsArticle[] = (response.data.response?.results || []).map(
      (article: any, index: number) => ({
        id: `guardian-${section}-${index}-${Date.now()}`,
        title: article.webTitle,
        description: "",
        source: "The Guardian",
        url: article.webUrl,
        publishedAt: new Date(article.webPublicationDate),
        category: section,
      })
    );

    return articles;
  } catch (error) {
    console.error("[Guardian] Error fetching news:", error);
    return [];
  }
}

/**
 * Aggregate news from multiple sources
 */
export async function aggregateNews(
  categories: string[] = ["technology", "science", "business"]
): Promise<NewsArticle[]> {
  try {
    const allArticles: NewsArticle[] = [];

    // Fetch from NewsAPI for each category
    for (const category of categories) {
      const articles = await fetchNewsFromNewsAPI(category, "us", 10);
      allArticles.push(...articles);
    }

    // Fetch from Guardian
    for (const category of categories) {
      const articles = await fetchGuardianNews(category, 5);
      allArticles.push(...articles);
    }

    // Sort by date (newest first)
    allArticles.sort(
      (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
    );

    // Remove duplicates by title
    const seen = new Set<string>();
    const unique = allArticles.filter((article) => {
      if (seen.has(article.title)) return false;
      seen.add(article.title);
      return true;
    });

    return unique;
  } catch (error) {
    console.error("[News Aggregator] Error aggregating news:", error);
    return [];
  }
}
