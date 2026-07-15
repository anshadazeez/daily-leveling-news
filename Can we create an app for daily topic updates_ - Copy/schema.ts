import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// News Categories - Expanded for comprehensive coverage
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }), // For UI display
  color: varchar("color", { length: 20 }), // For UI theming
  priority: int("priority").default(0), // Display order
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

// News Sources - Enhanced for multiple types
export const newsSources = mysqlTable("newsSources", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  url: varchar("url", { length: 500 }).notNull(),
  categoryId: int("categoryId").notNull(),
  isActive: mysqlEnum("isActive", ["true", "false"]).default("true").notNull(),
  sourceType: mysqlEnum("sourceType", ["rss", "api", "scrape"]).default("rss").notNull(),
  apiKey: varchar("apiKey", { length: 500 }), // For API-based sources
  logo: varchar("logo", { length: 500 }), // Source logo URL
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NewsSource = typeof newsSources.$inferSelect;
export type InsertNewsSource = typeof newsSources.$inferInsert;

// Articles - Enhanced with more metadata
export const articles = mysqlTable("articles", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  content: text("content"), // Full article content
  url: varchar("url", { length: 500 }).notNull().unique(),
  imageUrl: varchar("imageUrl", { length: 500 }), // Article image
  sourceId: int("sourceId").notNull(),
  sourceName: varchar("sourceName", { length: 255 }),
  categoryId: int("categoryId").notNull(),
  
  // Article metadata
  author: varchar("author", { length: 255 }),
  readingTimeMinutes: int("readingTimeMinutes"), // Estimated reading time
  
  // AI-generated summaries
  gist: text("gist"),
  whyItMatters: text("whyItMatters"),
  keyTakeaway: text("keyTakeaway"),
  
  // Engagement metrics
  viewCount: int("viewCount").default(0),
  isPopular: boolean("isPopular").default(false),
  isTrending: boolean("isTrending").default(false),
  
  // Timestamps
  publishedAt: timestamp("publishedAt"),
  fetchedAt: timestamp("fetchedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Article = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;

// User Bookmarks - Save favorite articles
export const bookmarks = mysqlTable("bookmarks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  articleId: int("articleId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Bookmark = typeof bookmarks.$inferSelect;
export type InsertBookmark = typeof bookmarks.$inferInsert;

// User Preferences - Customizable settings
export const userPreferences = mysqlTable("userPreferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  
  // Category preferences
  followedCategories: text("followedCategories"), // JSON array of category IDs
  
  // Display preferences
  theme: mysqlEnum("theme", ["light", "dark", "auto"]).default("auto").notNull(),
  fontSize: mysqlEnum("fontSize", ["small", "medium", "large"]).default("medium").notNull(),
  
  // Notification preferences
  emailNotifications: boolean("emailNotifications").default(true),
  notificationFrequency: mysqlEnum("notificationFrequency", ["instant", "daily", "weekly"]).default("daily").notNull(),
  
  // Reading preferences
  showImages: boolean("showImages").default(true),
  compactView: boolean("compactView").default(false),
  
  // Privacy
  trackReadingHistory: boolean("trackReadingHistory").default(true),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = typeof userPreferences.$inferInsert;

// Reading History - Track user activity
export const readingHistory = mysqlTable("readingHistory", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  articleId: int("articleId").notNull(),
  readAt: timestamp("readAt").defaultNow().notNull(),
  timeSpentSeconds: int("timeSpentSeconds"), // How long they read
  completed: boolean("completed").default(false), // Did they finish?
});

export type ReadingHistory = typeof readingHistory.$inferSelect;
export type InsertReadingHistory = typeof readingHistory.$inferInsert;

// Daily Digests - Track articles in daily summaries
export const dailyDigests = mysqlTable("dailyDigests", {
  id: int("id").autoincrement().primaryKey(),
  digestDate: timestamp("digestDate").notNull(),
  articleId: int("articleId").notNull(),
  categoryId: int("categoryId").notNull(),
  rank: int("rank"), // Position in the digest
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DailyDigest = typeof dailyDigests.$inferSelect;
export type InsertDailyDigest = typeof dailyDigests.$inferInsert;

// Trending Articles - Cache for trending calculations
export const trendingArticles = mysqlTable("trendingArticles", {
  id: int("id").autoincrement().primaryKey(),
  articleId: int("articleId").notNull(),
  categoryId: int("categoryId").notNull(),
  score: decimal("score", { precision: 10, scale: 2 }), // Trending score
  calculatedAt: timestamp("calculatedAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"), // When this trending entry expires
});

export type TrendingArticle = typeof trendingArticles.$inferSelect;
export type InsertTrendingArticle = typeof trendingArticles.$inferInsert;
