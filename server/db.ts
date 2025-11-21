import { and, eq, isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, quizzes, quizAnswers, subscriptions, payments, InsertSubscription, dailyTips, InsertDailyTip, userProgress, InsertUserProgress } from "../drizzle/schema";
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

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createQuiz(userId: number, score: number, resultLevel: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(quizzes).values({
    userId,
    score,
    resultLevel: resultLevel as any,
  });
}

export async function saveQuizAnswers(quizId: number, answers: Array<{ questionNumber: number; answer: number }>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(quizAnswers).values(
    answers.map(a => ({
      quizId,
      questionNumber: a.questionNumber,
      answer: a.answer,
    }))
  );
}

export async function getUserQuizzes(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.select().from(quizzes).where(eq(quizzes.userId, userId));
}

export async function getQuizById(quizId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const quiz = await db.select().from(quizzes).where(eq(quizzes.id, quizId)).limit(1);
  if (!quiz.length) return null;
  
  const answers = await db.select().from(quizAnswers).where(eq(quizAnswers.quizId, quizId));
  
  return { ...quiz[0], answers };
}

export async function getUserSubscription(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createPayment(userId: number, amount: number, stripePaymentId: string, type: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(payments).values({
    userId,
    amount,
    stripePaymentId,
    status: "pending",
    type: type as any,
  });
}

/**
 * Subscription queries for Conselheiro Amoroso
 */
export async function createSubscriptionRecord(data: {
  userId: number;
  stripeSubscriptionId: string;
  resultLevel: string;
  status: string;
  pricePerMonth: number;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(subscriptions).values(data as any);
  const inserted = await db.select().from(subscriptions).where(eq(subscriptions.userId, data.userId)).limit(1);
  return inserted[0];
}

export async function getActiveSubscription(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(subscriptions)
    .where(and(eq(subscriptions.userId, userId), eq(subscriptions.status, "active")))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateSubscriptionRecord(id: number, data: Partial<InsertSubscription>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(subscriptions).set(data as any).where(eq(subscriptions.id, id));
  const updated = await db.select().from(subscriptions).where(eq(subscriptions.id, id)).limit(1);
  return updated[0];
}

export async function createDailyTips(tips: InsertDailyTip[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(dailyTips).values(tips as any);
}

export async function getDailyTip(subscriptionId: number, dayNumber: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(dailyTips)
    .where(and(eq(dailyTips.subscriptionId, subscriptionId), eq(dailyTips.dayNumber, dayNumber)))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function getTodaysTip(subscriptionId: number) {
  const db = await getDb();
  if (!db) return null;

  const sub = await db.select().from(subscriptions).where(eq(subscriptions.id, subscriptionId)).limit(1);
  if (!sub || !sub[0].currentPeriodStart) return null;

  const dayNumber = Math.floor((Date.now() - sub[0].currentPeriodStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const cappedDay = Math.min(dayNumber, 30);

  return getDailyTip(subscriptionId, cappedDay);
}

export async function markTipAsSent(tipId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(dailyTips).set({ sentAt: new Date() }).where(eq(dailyTips.id, tipId));
}

export async function createProgress(data: InsertUserProgress) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(userProgress).values(data as any);
}

export async function getProgressBySubscription(subscriptionId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(userProgress).where(eq(userProgress.subscriptionId, subscriptionId)).orderBy(userProgress.createdAt);
}

export async function getAllUnsentTips() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(dailyTips).where(isNull(dailyTips.sentAt));
}
