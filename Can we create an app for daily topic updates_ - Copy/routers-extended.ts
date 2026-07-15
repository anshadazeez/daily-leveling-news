import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import * as dbExt from "./db-extended";

// Bookmarks Router
export const bookmarksRouter = router({
  list: protectedProcedure
    .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }).optional())
    .query(async ({ ctx, input }) => {
      return dbExt.getUserBookmarks(ctx.user.id, input?.limit, input?.offset);
    }),

  add: protectedProcedure
    .input(z.object({ articleId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return dbExt.addBookmark(ctx.user.id, input.articleId);
    }),

  remove: protectedProcedure
    .input(z.object({ articleId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return dbExt.removeBookmark(ctx.user.id, input.articleId);
    }),

  isBookmarked: protectedProcedure
    .input(z.object({ articleId: z.number() }))
    .query(async ({ ctx, input }) => {
      return dbExt.isArticleBookmarked(ctx.user.id, input.articleId);
    }),
});

// User Preferences Router
export const preferencesRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    return dbExt.getUserPreferences(ctx.user.id);
  }),

  update: protectedProcedure
    .input(z.object({
      followedCategories: z.array(z.number()).optional(),
      theme: z.enum(["light", "dark", "auto"]).optional(),
      fontSize: z.enum(["small", "medium", "large"]).optional(),
      emailNotifications: z.boolean().optional(),
      notificationFrequency: z.enum(["instant", "daily", "weekly"]).optional(),
      showImages: z.boolean().optional(),
      compactView: z.boolean().optional(),
      trackReadingHistory: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return dbExt.updateUserPreferences(ctx.user.id, input);
    }),
});

// Reading History Router
export const readingHistoryRouter = router({
  list: protectedProcedure
    .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }).optional())
    .query(async ({ ctx, input }) => {
      return dbExt.getUserReadingHistory(ctx.user.id, input?.limit, input?.offset);
    }),

  track: protectedProcedure
    .input(z.object({
      articleId: z.number(),
      timeSpentSeconds: z.number().optional(),
      completed: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return dbExt.trackArticleRead(ctx.user.id, input.articleId, input.timeSpentSeconds, input.completed);
    }),
});

// Trending Articles Router
export const trendingRouter = router({
  list: protectedProcedure
    .input(z.object({
      categoryId: z.number().optional(),
      limit: z.number().default(10),
      timeWindow: z.enum(["24h", "7d", "30d"]).default("24h"),
    }))
    .query(async ({ input }) => {
      return dbExt.getTrendingArticles(input.categoryId, input.limit, input.timeWindow);
    }),
});

// Search Router
export const searchRouter = router({
  articles: protectedProcedure
    .input(z.object({
      query: z.string().min(1),
      categoryId: z.number().optional(),
      limit: z.number().default(20),
    }))
    .query(async ({ input }) => {
      return dbExt.searchArticles(input.query, input.categoryId, input.limit);
    }),
});
