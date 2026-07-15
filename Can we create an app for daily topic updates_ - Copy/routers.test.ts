import { describe, it, expect, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import type { User } from "../drizzle/schema";

// Mock database module
vi.mock("./db", () => ({
  getCategories: vi.fn().mockResolvedValue([
    { id: 1, name: "science", slug: "science", createdAt: new Date(), updatedAt: new Date() },
    { id: 2, name: "technology", slug: "technology", createdAt: new Date(), updatedAt: new Date() },
  ]),
  getCategoryBySlug: vi.fn().mockResolvedValue({
    id: 1,
    name: "science",
    slug: "science",
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  getNewsSources: vi.fn().mockResolvedValue([
    {
      id: 1,
      name: "MIT News",
      url: "https://news.mit.edu/feed",
      categoryId: 1,
      sourceType: "rss",
      isActive: "true",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  getActiveNewsSources: vi.fn().mockResolvedValue([
    {
      id: 1,
      name: "MIT News",
      url: "https://news.mit.edu/feed",
      categoryId: 1,
      sourceType: "rss",
      isActive: "true",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  getArticlesByCategory: vi.fn().mockResolvedValue([
    {
      id: 1,
      title: "Test Article",
      description: "Test description",
      url: "https://example.com",
      sourceId: 1,
      sourceName: "MIT News",
      categoryId: 1,
      gist: "2-sentence summary",
      whyItMatters: "Impact explanation",
      keyTakeaway: "Key point",
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  getRecentArticles: vi.fn().mockResolvedValue([]),
  getArticleById: vi.fn().mockResolvedValue(null),
  getDailyDigestForDate: vi.fn().mockResolvedValue(null),
  insertNewsSource: vi.fn().mockResolvedValue({ id: 2 }),
  updateNewsSource: vi.fn().mockResolvedValue({ id: 1 }),
  deleteNewsSource: vi.fn().mockResolvedValue(true),
}));

function createAdminContext(): TrpcContext {
  const adminUser: User = {
    id: 1,
    openId: "admin-user",
    name: "Admin User",
    email: "admin@example.com",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user: adminUser,
    req: {
      headers: {},
      protocol: "https",
    } as any,
    res: {} as any,
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      headers: {},
      protocol: "https",
    } as any,
    res: {} as any,
  };
}

describe("Daily Insight API Routers", () => {
  describe("categories", () => {
    it("should list all categories", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      const categories = await caller.categories.list();

      expect(categories).toHaveLength(2);
      expect(categories[0]?.name).toBe("science");
      expect(categories[1]?.name).toBe("technology");
    });

    it("should get category by slug", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      const category = await caller.categories.getBySlug({ slug: "science" });

      expect(category).toBeDefined();
      expect(category?.name).toBe("science");
      expect(category?.slug).toBe("science");
    });
  });

  describe("sources", () => {
    it("should list all news sources", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      const sources = await caller.sources.list();

      expect(sources).toHaveLength(1);
      expect(sources[0]?.name).toBe("MIT News");
    });

    it("should list active news sources", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      const sources = await caller.sources.active();

      expect(sources).toHaveLength(1);
      expect(sources[0]?.isActive).toBe("true");
    });

    it("should add a news source (admin only)", async () => {
      const caller = appRouter.createCaller(createAdminContext());
      const result = await caller.sources.add({
        name: "New Source",
        url: "https://example.com/feed",
        categoryId: 1,
        sourceType: "rss",
      });

      expect(result).toBeDefined();
      expect(result.id).toBe(2);
    });

    it("should update a news source (admin only)", async () => {
      const caller = appRouter.createCaller(createAdminContext());
      const result = await caller.sources.update({
        id: 1,
        isActive: "false",
      });

      expect(result).toBeDefined();
    });

    it("should delete a news source (admin only)", async () => {
      const caller = appRouter.createCaller(createAdminContext());
      const result = await caller.sources.delete({ id: 1 });

      expect(result).toBe(true);
    });
  });

  describe("articles", () => {
    it("should get articles by category", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      const articles = await caller.articles.byCategory({
        categoryId: 1,
        limit: 10,
      });

      expect(articles).toHaveLength(1);
      expect(articles[0]?.title).toBe("Test Article");
      expect(articles[0]?.gist).toBe("2-sentence summary");
    });

    it("should get recent articles", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      const articles = await caller.articles.recent({
        hours: 24,
        limit: 50,
      });

      expect(Array.isArray(articles)).toBe(true);
    });

    it("should get article by ID", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      const article = await caller.articles.byId({ id: 1 });

      expect(article).toBeNull();
    });
  });

  describe("digests", () => {
    it("should get daily digest for a date", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      const digest = await caller.digests.forDate({
        date: new Date(),
      });

      expect(digest).toBeNull();
    });
  });

  describe("auth", () => {
    it("should get current user info", async () => {
      const caller = appRouter.createCaller(createAdminContext());
      const user = await caller.auth.me();

      expect(user).toBeDefined();
      expect(user?.role).toBe("admin");
    });

    it("should return null for unauthenticated user", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      const user = await caller.auth.me();

      expect(user).toBeNull();
    });
  });
});
