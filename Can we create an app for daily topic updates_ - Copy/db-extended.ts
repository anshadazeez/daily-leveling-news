import { eq, desc, and, like, gte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { bookmarks, readingHistory, userPreferences, trendingArticles, InsertBookmark, InsertReadingHistory, InsertUserPreferences } from "../drizzle/schema";
import { getDb } from "./db";

// ============ BOOKMARKS ============
export async function getUserBookmarks(userId: number, limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  
  return db
    .select()
    .from(bookmarks)
    .where(eq(bookmarks.userId, userId))
    .orderBy(desc(bookmarks.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function addBookmark(userId: number, articleId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  try {
    const result = await db.insert(bookmarks).values({
      userId,
      articleId,
    });
    return result;
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.log("[DB] Bookmark already exists");
      return null;
    }
    throw error;
  }
}

export async function removeBookmark(userId: number, articleId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db
    .delete(bookmarks)
    .where(and(
      eq(bookmarks.userId, userId),
      eq(bookmarks.articleId, articleId)
    ));
}

export async function isArticleBookmarked(userId: number, articleId: number) {
  const db = await getDb();
  if (!db) return false;
  
  const result = await db
    .select()
    .from(bookmarks)
    .where(and(
      eq(bookmarks.userId, userId),
      eq(bookmarks.articleId, articleId)
    ))
    .limit(1);
  
  return result.length > 0;
}

// ============ USER PREFERENCES ============
export async function getUserPreferences(userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function createUserPreferences(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(userPreferences).values({
    userId,
    followedCategories: JSON.stringify([1, 2, 3]), // Default categories
    theme: "auto",
    fontSize: "medium",
    emailNotifications: true,
    notificationFrequency: "daily",
    showImages: true,
    compactView: false,
    trackReadingHistory: true,
  });
}

export async function updateUserPreferences(userId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Check if preferences exist
  const existing = await getUserPreferences(userId);
  
  if (!existing) {
    // Create new preferences
    return createUserPreferences(userId);
  }
  
  // Update existing preferences
  const updateData: any = { ...data };
  if (data.followedCategories && Array.isArray(data.followedCategories)) {
    updateData.followedCategories = JSON.stringify(data.followedCategories);
  }
  
  return db
    .update(userPreferences)
    .set(updateData)
    .where(eq(userPreferences.userId, userId));
}

// ============ READING HISTORY ============
export async function getUserReadingHistory(userId: number, limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  
  return db
    .select()
    .from(readingHistory)
    .where(eq(readingHistory.userId, userId))
    .orderBy(desc(readingHistory.readAt))
    .limit(limit)
    .offset(offset);
}

export async function trackArticleRead(userId: number, articleId: number, timeSpentSeconds?: number, completed?: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(readingHistory).values({
    userId,
    articleId,
    timeSpentSeconds,
    completed,
  });
}

// ============ TRENDING ARTICLES ============
export async function getTrendingArticles(categoryId?: number, limit = 10, timeWindow: "24h" | "7d" | "30d" = "24h") {
  const db = await getDb();
  if (!db) return [];
  
  const hoursMap = { "24h": 24, "7d": 168, "30d": 720 };
  const hours = hoursMap[timeWindow];
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);
  
  let query = db
    .select()
    .from(trendingArticles)
    .where(gte(trendingArticles.calculatedAt, since))
    .orderBy(desc(trendingArticles.score))
    .limit(limit);
  
  if (categoryId) {
    query = db
      .select()
      .from(trendingArticles)
      .where(and(
        gte(trendingArticles.calculatedAt, since),
        eq(trendingArticles.categoryId, categoryId)
      ))
      .orderBy(desc(trendingArticles.score))
      .limit(limit);
  }
  
  return query;
}

// ============ SEARCH ============
export async function searchArticles(query: string, categoryId?: number, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  
  const { articles } = await import("../drizzle/schema");
  
  let searchQuery = db
    .select()
    .from(articles)
    .where(like(articles.title, `%${query}%`))
    .orderBy(desc(articles.publishedAt))
    .limit(limit);
  
  if (categoryId) {
    searchQuery = db
      .select()
      .from(articles)
      .where(and(
        like(articles.title, `%${query}%`),
        eq(articles.categoryId, categoryId)
      ))
      .orderBy(desc(articles.publishedAt))
      .limit(limit);
  }
  
  return searchQuery;
}
