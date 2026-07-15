import axios from "axios";

interface FinanceArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: Date;
  category: "Markets" | "Economics" | "Business" | "Crypto";
  imageUrl?: string;
  sentiment?: "positive" | "negative" | "neutral";
}

/**
 * Fetch from Bloomberg Finance (requires API key)
 */
export async function fetchBloombergNews(): Promise<FinanceArticle[]> {
  try {
    // Bloomberg has a limited free API
    console.log("[Bloomberg] Fetching finance news...");
    return [];
  } catch (error) {
    console.error("[Bloomberg] Error fetching news:", error);
    return [];
  }
}

/**
 * Fetch from Financial Times (requires subscription)
 */
export async function fetchFTNews(): Promise<FinanceArticle[]> {
  try {
    // FT requires API key and subscription
    console.log("[FT] Fetching finance news...");
    return [];
  } catch (error) {
    console.error("[FT] Error fetching news:", error);
    return [];
  }
}

/**
 * Fetch from Reuters Finance
 */
export async function fetchReutersFinance(): Promise<FinanceArticle[]> {
  try {
    // Reuters has limited free API access
    console.log("[Reuters] Fetching finance news...");
    return [];
  } catch (error) {
    console.error("[Reuters] Error fetching news:", error);
    return [];
  }
}

/**
 * Fetch from CoinGecko API (free, no key needed) for crypto news
 */
export async function fetchCryptoNews(): Promise<FinanceArticle[]> {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/news",
      { timeout: 5000 }
    );

    const articles: FinanceArticle[] = (response.data.data || [])
      .slice(0, 10)
      .map((item: any, index: number) => ({
        id: `crypto-${index}-${Date.now()}`,
        title: item.title,
        description: item.description || "",
        url: item.url,
        source: item.source,
        publishedAt: new Date(item.published_at),
        category: "Crypto",
        imageUrl: item.image?.small,
      }));

    return articles;
  } catch (error) {
    console.error("[Crypto] Error fetching news:", error);
    return [];
  }
}

/**
 * Fetch from World Bank Open Data (economics)
 */
export async function fetchWorldBankEconomics(): Promise<FinanceArticle[]> {
  try {
    // World Bank provides economic data and reports
    console.log("[World Bank] Fetching economic data...");
    return [];
  } catch (error) {
    console.error("[World Bank] Error fetching data:", error);
    return [];
  }
}

/**
 * Fetch from IMF (International Monetary Fund)
 */
export async function fetchIMFEconomics(): Promise<FinanceArticle[]> {
  try {
    // IMF publishes economic reports and analysis
    console.log("[IMF] Fetching economic data...");
    return [];
  } catch (error) {
    console.error("[IMF] Error fetching data:", error);
    return [];
  }
}

/**
 * Fetch from Federal Reserve (US Economics)
 */
export async function fetchFedNews(): Promise<FinanceArticle[]> {
  try {
    // Federal Reserve publishes economic data and press releases
    console.log("[Fed] Fetching economic data...");
    return [];
  } catch (error) {
    console.error("[Fed] Error fetching data:", error);
    return [];
  }
}

/**
 * Fetch from OECD (Organization for Economic Co-operation and Development)
 */
export async function fetchOECDEconomics(): Promise<FinanceArticle[]> {
  try {
    // OECD publishes economic reports and statistics
    console.log("[OECD] Fetching economic data...");
    return [];
  } catch (error) {
    console.error("[OECD] Error fetching data:", error);
    return [];
  }
}

/**
 * Aggregate all finance and economics sources
 */
export async function aggregateFinanceNews(): Promise<FinanceArticle[]> {
  try {
    const allArticles: FinanceArticle[] = [];

    // Fetch from all sources
    const [
      bloomberg,
      ft,
      reuters,
      crypto,
      worldbank,
      imf,
      fed,
      oecd,
    ] = await Promise.all([
      fetchBloombergNews(),
      fetchFTNews(),
      fetchReutersFinance(),
      fetchCryptoNews(),
      fetchWorldBankEconomics(),
      fetchIMFEconomics(),
      fetchFedNews(),
      fetchOECDEconomics(),
    ]);

    allArticles.push(
      ...bloomberg,
      ...ft,
      ...reuters,
      ...crypto,
      ...worldbank,
      ...imf,
      ...fed,
      ...oecd
    );

    // Sort by date (newest first)
    allArticles.sort(
      (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
    );

    return allArticles;
  } catch (error) {
    console.error("[Finance Aggregator] Error aggregating news:", error);
    return [];
  }
}
