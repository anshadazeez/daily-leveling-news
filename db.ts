import { eq, and, desc, gte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, categories, newsSources, articles, dailyDigests, InsertCategory, InsertNewsSource, InsertArticle, InsertDailyDigest } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ CATEGORIES ============
export async function getCategories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(categories);
}

export async function getCategoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function insertCategory(data: InsertCategory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(categories).values(data);
  return result;
}

// ============ NEWS SOURCES ============
export async function getNewsSources(categoryId?: number) {
  const db = await getDb();
  if (!db) return [];
  
  if (categoryId) {
    return db
      .select()
      .from(newsSources)
      .where(eq(newsSources.categoryId, categoryId));
  }
  return db.select().from(newsSources);
}

export async function getActiveNewsSources(categoryId?: number) {
  const db = await getDb();
  if (!db) return [];
  
  if (categoryId) {
    return db
      .select()
      .from(newsSources)
      .where(and(
        eq(newsSources.isActive, "true"),
        eq(newsSources.categoryId, categoryId)
      ));
  }
  return db
    .select()
    .from(newsSources)
    .where(eq(newsSources.isActive, "true"));
}

export async function insertNewsSource(data: InsertNewsSource) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(newsSources).values(data);
  return result;
}

export async function updateNewsSource(id: number, data: Partial<InsertNewsSource>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.update(newsSources).set(data).where(eq(newsSources.id, id));
  return result;
}

export async function deleteNewsSource(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.delete(newsSources).where(eq(newsSources.id, id));
  return result;
}

// ============ ARTICLES ============
export async function insertArticle(data: InsertArticle) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    const result = await db.insert(articles).values(data);
    return result;
  } catch (error: any) {
    // Handle duplicate URL gracefully
    if (error.code === 'ER_DUP_ENTRY') {
      console.log("[DB] Article URL already exists, skipping");
      return null;
    }
    throw error;
  }
}

export async function getArticlesByCategory(categoryId: number, limit = 10) {
  const db = await getDb();
  if (!db) return [];
  
  return db
    .select()
    .from(articles)
    .where(eq(articles.categoryId, categoryId))
    .orderBy(desc(articles.publishedAt))
    .limit(limit);
}

export async function getRecentArticles(hours = 24, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);
  return db
    .select()
    .from(articles)
    .where(gte(articles.fetchedAt, since))
    .orderBy(desc(articles.fetchedAt))
    .limit(limit);
}

export async function getArticleById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateArticle(id: number, data: Partial<InsertArticle>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.update(articles).set(data).where(eq(articles.id, id));
  return result;
}

// ============ DAILY DIGESTS ============
export async function insertDailyDigest(data: InsertDailyDigest) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(dailyDigests).values(data);
  return result;
}

export async function getDailyDigestForDate(digestDate: Date) {
  const db = await getDb();
  if (!db) return [];
  
  const dateStr = digestDate.toISOString().split('T')[0];
  
  return db
    .select()
    .from(dailyDigests)
    .where(sql`DATE(${dailyDigests.digestDate}) = ${dateStr}`);
}
