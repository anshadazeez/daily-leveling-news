import axios from "axios";
import { parseStringPromise } from "xml2js";

interface ArxivPaper {
  id: string;
  title: string;
  authors: string[];
  summary: string;
  publishedAt: Date;
  url: string;
  category: string;
  source: "arXiv";
}

/**
 * Fetch research papers from arXiv API
 * arXiv provides free access to research papers in multiple categories
 */
export async function fetchArxivPapers(
  searchQuery: string,
  maxResults: number = 10
): Promise<ArxivPaper[]> {
  try {
    const arxivUrl = "http://export.arxiv.org/api/query";
    
    // arXiv search parameters
    const params = {
      search_query: searchQuery,
      start: 0,
      max_results: maxResults,
      sortBy: "submittedDate",
      sortOrder: "descending",
    };

    const response = await axios.get(arxivUrl, { params });
    
    // Parse XML response
    const parsed = await parseStringPromise(response.data);
    const entries = parsed.feed.entry || [];

    const papers: ArxivPaper[] = entries.map((entry: any) => {
      const authors = Array.isArray(entry.author)
        ? entry.author.map((a: any) => a.name[0]).join(", ")
        : entry.author?.[0]?.name?.[0] || "Unknown";

      const id = entry.id[0].split("/abs/")[1] || entry.id[0];
      const url = `https://arxiv.org/abs/${id}`;

      return {
        id,
        title: entry.title[0].trim(),
        authors: [authors],
        summary: entry.summary[0].trim(),
        publishedAt: new Date(entry.published[0]),
        url,
        category: entry.arxiv_primary_category?.[0]?.$.term || "General",
        source: "arXiv",
      };
    });

    return papers;
  } catch (error) {
    console.error("[arXiv] Error fetching papers:", error);
    return [];
  }
}

/**
 * Fetch papers by category
 */
export async function fetchArxivByCategory(
  category: "cs.AI" | "cs.LG" | "physics.bio-ph" | "q-bio" | "stat.ML",
  maxResults: number = 10
): Promise<ArxivPaper[]> {
  const query = `cat:${category}`;
  return fetchArxivPapers(query, maxResults);
}

/**
 * Search arXiv for specific topics
 */
export async function searchArxiv(
  topic: string,
  maxResults: number = 10
): Promise<ArxivPaper[]> {
  const query = `all:${topic}`;
  return fetchArxivPapers(query, maxResults);
}
