import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
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

export const quizzes = mysqlTable("quizzes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  score: int("score").notNull(),
  resultLevel: mysqlEnum("resultLevel", ["nao_gosta", "talvez", "provavelmente", "paixao_reciproca"]).notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const quizAnswers = mysqlTable("quizAnswers", {
  id: int("id").autoincrement().primaryKey(),
  quizId: int("quizId").notNull().references(() => quizzes.id),
  questionNumber: int("questionNumber").notNull(),
  answer: int("answer").notNull(), // 1-5 scale
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }).unique(),
  resultLevel: varchar("resultLevel", { length: 50 }).notNull(), // paixao_reciproca, sinais_positivos, incerteza, sem_interesse
  status: mysqlEnum("status", ["active", "canceled", "past_due", "unpaid"]).notNull(),
  pricePerMonth: int("pricePerMonth").notNull(), // in cents
  currentPeriodStart: timestamp("currentPeriodStart"),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  canceledAt: timestamp("canceledAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  stripePaymentId: varchar("stripePaymentId", { length: 255 }).unique(),
  amount: int("amount").notNull(), // in cents
  status: mysqlEnum("status", ["pending", "completed", "failed"]).notNull(),
  type: mysqlEnum("type", ["one_time", "subscription"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = typeof quizzes.$inferInsert;
export type QuizAnswer = typeof quizAnswers.$inferSelect;
export type InsertQuizAnswer = typeof quizAnswers.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

/**
 * Daily tips for subscribers
 */
export const dailyTips = mysqlTable("daily_tips", {
  id: int("id").autoincrement().primaryKey(),
  subscriptionId: int("subscriptionId").notNull().references(() => subscriptions.id),
  dayNumber: int("dayNumber").notNull(), // 1-30
  category: varchar("category", { length: 50 }).notNull(), // comunicacao, comportamento, emocoes, etc
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  actionOfDay: text("actionOfDay").notNull(),
  reflection: text("reflection").notNull(),
  motivation: text("motivation").notNull(),
  sentAt: timestamp("sentAt"),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DailyTip = typeof dailyTips.$inferSelect;
export type InsertDailyTip = typeof dailyTips.$inferInsert;

/**
 * User progress tracking
 */
export const userProgress = mysqlTable("user_progress", {
  id: int("id").autoincrement().primaryKey(),
  subscriptionId: int("subscriptionId").notNull().references(() => subscriptions.id),
  dayNumber: int("dayNumber").notNull(),
  situationUpdate: text("situationUpdate").notNull(),
  emotionalState: mysqlEnum("emotionalState", ["melhorando", "estavel", "piorando"]).notNull(),
  actionsTaken: text("actionsTaken"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = typeof userProgress.$inferInsert;