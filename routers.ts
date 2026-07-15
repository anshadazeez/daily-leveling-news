import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router, adminProcedure } from "./_core/trpc";
import { COOKIE_NAME } from "../shared/const";
import * as db from "./db";
import { bookmarksRouter, preferencesRouter, readingHistoryRouter, trendingRouter, searchRouter } from "./routers-extended";
import { dataRouter, researchRouter, newsRouter, financeRouter } from "./routers-data";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Categories
  categories: router({
    list: publicProcedure.query(() => db.getCategories()),
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(({ input }) => db.getCategoryBySlug(input.slug)),
  }),

  // News Sources (Admin only for management)
  sources: router({
    list: publicProcedure
      .input(z.object({ categoryId: z.number().optional() }).optional())
      .query(({ input }) => db.getNewsSources(input?.categoryId)),
    
    active: publicProcedure
      .input(z.object({ categoryId: z.number().optional() }).optional())
      .query(({ input }) => db.getActiveNewsSources(input?.categoryId)),
    
    add: adminProcedure
      .input(z.object({
        name: z.string().min(1),
        url: z.string().url(),
        categoryId: z.number(),
        sourceType: z.enum(["rss", "api"]).default("rss"),
      }))
      .mutation(async ({ input }) => {
        return db.insertNewsSource({
          ...input,
          isActive: "true",
        });
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        url: z.string().url().optional(),
        isActive: z.enum(["true", "false"]).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateNewsSource(id, data);
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteNewsSource(input.id);
      }),
  }),

  // Articles
  articles: router({
    byCategory: publicProcedure
      .input(z.object({
        categoryId: z.number(),
        limit: z.number().default(10),
      }))
      .query(({ input }) => db.getArticlesByCategory(input.categoryId, input.limit)),
    
    recent: publicProcedure
      .input(z.object({
        hours: z.number().default(24),
        limit: z.number().default(50),
      }))
      .query(({ input }) => db.getRecentArticles(input.hours, input.limit)),
    
    byId: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getArticleById(input.id)),
  }),

  // Daily Digests
  digests: router({
    forDate: publicProcedure
      .input(z.object({ date: z.date() }))
      .query(({ input }) => db.getDailyDigestForDate(input.date)),
  }),

  // Admin operations
  admin: router({
    fetchNews: adminProcedure.mutation(async () => {
      const { fetchAndProcessNews } = await import("./procedures/fetch-news");
      return fetchAndProcessNews();
    }),
  }),

  // User features
  bookmarks: bookmarksRouter,
  preferences: preferencesRouter,
  readingHistory: readingHistoryRouter,
  trending: trendingRouter,
  search: searchRouter,

  // Data aggregation
  data: dataRouter,
  research: researchRouter,
  news: newsRouter,
  finance: financeRouter,
});

export type AppRouter = typeof appRouter;
