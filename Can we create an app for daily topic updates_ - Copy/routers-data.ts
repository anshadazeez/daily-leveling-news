import { z } from "zod";
import { publicProcedure, protectedProcedure, router, adminProcedure } from "./_core/trpc";
import { aggregateAllData, fetchAndStoreArticles, fetchArticlesByCategory, searchArticles } from "./services/data-aggregator";
import { fetchArxivByCategory, searchArxiv } from "./services/arxiv-fetcher";
import { aggregateNews } from "./services/news-fetcher";
import { aggregateResearchFeeds } from "./services/research-feeds-fetcher";
import { aggregateFinanceNews } from "./services/finance-fetcher";
import * as db from "./db";

export const dataRouter = router({
  // Get all aggregated data
  all: publicProcedure
    .query(async () => {
      return aggregateAllData();
    }),

  // Get articles by category
  byCategory: publicProcedure
    .input(z.object({
      category: z.enum(["Science", "Technology", "Finance", "Economics", "Research"]),
    }))
    .query(async ({ input }) => {
      return fetchArticlesByCategory(input.category);
    }),

  // Search articles across all sources
  search: publicProcedure
    .input(z.object({
      query: z.string().min(1),
    }))
    .query(async ({ input }) => {
      return searchArticles(input.query);
    }),

  // Fetch and store articles in database (admin only)
  fetch: adminProcedure
    .mutation(async () => {
      const stored = await fetchAndStoreArticles();
      return { success: true, stored };
    }),
});

export const researchRouter = router({
  // Get arXiv papers by category
  arxiv: publicProcedure
    .input(z.object({
      category: z.enum(["cs.AI", "cs.LG", "physics.bio-ph", "q-bio", "stat.ML"]).default("cs.AI"),
      limit: z.number().default(10),
    }))
    .query(async ({ input }) => {
      return fetchArxivByCategory(input.category as any, input.limit);
    }),

  // Search arXiv
  searchArxiv: publicProcedure
    .input(z.object({
      query: z.string().min(1),
      limit: z.number().default(10),
    }))
    .query(async ({ input }) => {
      return searchArxiv(input.query, input.limit);
    }),

  // Get research feeds from major institutions
  feeds: publicProcedure
    .query(async () => {
      return aggregateResearchFeeds();
    }),
});

export const newsRouter = router({
  // Get aggregated news
  all: publicProcedure
    .query(async () => {
      return aggregateNews(["technology", "science", "business"]);
    }),

  // Get news by category
  byCategory: publicProcedure
    .input(z.object({
      category: z.enum(["technology", "science", "business", "health"]).default("technology"),
    }))
    .query(async ({ input }) => {
      return aggregateNews([input.category]);
    }),
});

export const financeRouter = router({
  // Get aggregated finance news
  all: publicProcedure
    .query(async () => {
      return aggregateFinanceNews();
    }),

  // Get trending financial articles
  trending: publicProcedure
    .query(async () => {
      const articles = await db.getArticlesByCategory(3, 20); // Category 3 = Finance
      return articles.filter((a) => a.isTrending);
    }),

  // Get market insights
  markets: publicProcedure
    .query(async () => {
      const articles = await db.getArticlesByCategory(3, 10);
      return articles;
    }),
});
