export type ArticleCategory =
  | "Technology"
  | "Science"
  | "Research"
  | "Finance"
  | "Economics"
  | "IAS Prep";

export type ApiArticle = {
  id: string;
  title: string;
  description: string;
  fullContent: string;
  summaryText: string;
  bulletPoints: string[];
  source: string;
  sourceHook: {
    provider: "arXiv API" | "NewsAPI Free Tier" | "Alpha Vantage Free Tier" | "RSS Feed";
    endpoint: string;
    rawTextField: "summary" | "description" | "content" | "abstract";
    notes: string;
  };
  publishedAt: string;
  category: ArticleCategory;
  url: string;
  readingTimeMinutes: number;
  tags: string[];
  relevance: "Investor" | "Research" | "Policy" | "Technology" | "Exam Prep";
};

type Feed = {
  name: string;
  url: string;
  category: ArticleCategory;
  relevance: ApiArticle["relevance"];
};

const FEEDS: Feed[] = [
  { name: "The Guardian", url: "https://www.theguardian.com/uk/technology/rss", category: "Technology", relevance: "Technology" },
  { name: "NASA", url: "https://www.nasa.gov/rss/dyn/breaking_news.rss", category: "Science", relevance: "Research" },
  { name: "The Guardian", url: "https://www.theguardian.com/business/markets/rss", category: "Finance", relevance: "Investor" },
  { name: "BBC News", url: "https://feeds.bbci.co.uk/news/business/rss.xml", category: "Economics", relevance: "Policy" },
  { name: "The Hindu", url: "https://www.thehindu.com/news/national/feeder/default.rss", category: "IAS Prep", relevance: "Exam Prep" },
];

const CACHE_MS = 10 * 60 * 1000;
let cached: ApiArticle[] = [];
let cachedAt = 0;

function decode(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function field(xml: string, name: string) {
  const match = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
  return match ? decode(match[1]) : "";
}

function makeReadingNotes(title: string, text: string) {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 24);
  const summary = sentences.slice(0, 2).join(" ") || text;
  const bulletPoints = [
    `Key development: ${title}`,
    ...sentences.slice(0, 2),
    "Open the original source for the supporting data and full context.",
  ];
  return { summary, bulletPoints: [...new Set(bulletPoints)].slice(0, 3) };
}

async function getText(url: string) {
  const response = await fetch(url, {
    headers: { "User-Agent": "Daily-Insight/1.0 (local development)" },
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.text();
}

function toArticle(feed: Feed, item: string): ApiArticle | null {
  const title = field(item, "title");
  const url = field(item, "link") || field(item, "guid");
  if (!title || !url.startsWith("http")) return null;

  const description = field(item, "description") || "Open the source for the complete update.";
  const notes = makeReadingNotes(title, description);
  const dateText = field(item, "pubDate") || field(item, "published") || field(item, "updated");
  const publishedAt = Number.isNaN(Date.parse(dateText)) ? new Date().toISOString() : new Date(dateText).toISOString();

  return {
    id: `rss-${feed.category}-${encodeURIComponent(url)}`,
    title,
    description,
    fullContent: description,
    summaryText: notes.summary,
    bulletPoints: notes.bulletPoints,
    source: feed.name,
    sourceHook: {
      provider: "RSS Feed",
      endpoint: feed.url,
      rawTextField: "description",
      notes: "Fetched by the local API proxy to avoid browser CORS restrictions.",
    },
    publishedAt,
    category: feed.category,
    url,
    readingTimeMinutes: Math.max(1, Math.ceil(description.split(/\s+/).length / 200)),
    tags: [feed.category, feed.name],
    relevance: feed.relevance,
  };
}

async function fetchRss(feed: Feed): Promise<ApiArticle[]> {
  const xml = await getText(feed.url);
  return [...xml.matchAll(/<item(?:\s[^>]*)?>[\s\S]*?<\/item>/gi)]
    .slice(0, 8)
    .map((match) => toArticle(feed, match[0]))
    .filter((article): article is ApiArticle => article !== null);
}

async function fetchArxiv(): Promise<ApiArticle[]> {
  const endpoint = "https://export.arxiv.org/api/query?search_query=cat%3Acs.AI+OR+cat%3Acs.LG&start=0&max_results=12&sortBy=submittedDate&sortOrder=descending";
  const xml = await getText(endpoint);
  return [...xml.matchAll(/<entry(?:\s[^>]*)?>[\s\S]*?<\/entry>/gi)]
    .map((match) => {
      const entry = match[0];
      const title = field(entry, "title");
      const summary = field(entry, "summary");
      const id = field(entry, "id");
      const published = field(entry, "published");
      return {
        id: `arxiv-${id}`,
        title,
        description: summary,
        fullContent: summary,
        summaryText: summary,
        bulletPoints: [
          "Research paper abstract from arXiv.",
          "Use the abstract to assess the paper's main contribution.",
          "Open the source for methods, results, and citations.",
        ],
        source: "arXiv",
        sourceHook: {
          provider: "arXiv API" as const,
          endpoint,
          rawTextField: "abstract" as const,
          notes: "The abstract is displayed without invented summarization.",
        },
        publishedAt: Number.isNaN(Date.parse(published)) ? new Date().toISOString() : new Date(published).toISOString(),
        category: "Research" as const,
        url: id,
        readingTimeMinutes: Math.max(1, Math.ceil(summary.split(/\s+/).length / 200)),
        tags: ["AI", "Research", "arXiv"],
        relevance: "Research" as const,
      };
    })
    .filter((article) => article.title && article.url.startsWith("http"));
}

export async function loadArticles(): Promise<ApiArticle[]> {
  if (cached.length && Date.now() - cachedAt < CACHE_MS) return cached;

  const results = await Promise.allSettled([...FEEDS.map(fetchRss), fetchArxiv()]);
  const articles = results.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
  if (!articles.length) throw new Error("All configured news sources were unavailable.");

  const seen = new Set<string>();
  cached = articles
    .filter((article) => {
      const key = `${article.category}:${article.title.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  cachedAt = Date.now();

  return cached;
}
