import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import * as db from "../db";
import { getTipsByResultLevel } from "../../shared/advisor-tips";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-11-20" as any,
});

export const advisorRouter = router({
  /**
   * Create subscription after payment
   */
  createSubscription: protectedProcedure
    .input(
      z.object({
        stripeSubscriptionId: z.string(),
        resultLevel: z.string(),
        pricePerMonth: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Create subscription record
      const now = new Date();
      const nextMonth = new Date(now);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const subscription = await db.createSubscriptionRecord({
        userId: ctx.user.id,
        stripeSubscriptionId: input.stripeSubscriptionId,
        resultLevel: input.resultLevel,
        status: "active",
        pricePerMonth: input.pricePerMonth,
        currentPeriodStart: now,
        currentPeriodEnd: nextMonth,
      });

      // Generate daily tips for this subscription
      const tips = getTipsByResultLevel(input.resultLevel);
      const tipsToInsert = tips.map((tip) => ({
        subscriptionId: subscription.id,
        dayNumber: tip.dayNumber,
        category: tip.category,
        title: tip.title,
        content: tip.content,
        actionOfDay: tip.actionOfDay,
        reflection: tip.reflection,
        motivation: tip.motivation,
      }));

      await db.createDailyTips(tipsToInsert);

      return subscription;
    }),

  /**
   * Get active subscription
   */
  getSubscription: protectedProcedure.query(async ({ ctx }) => {
    return db.getActiveSubscription(ctx.user.id);
  }),

  /**
   * Get today's tip
   */
  getTodaysTip: protectedProcedure.query(async ({ ctx }) => {
    const subscription = await db.getActiveSubscription(ctx.user.id);
    if (!subscription) return null;

    return db.getTodaysTip(subscription.id);
  }),

  /**
   * Get all tips for subscription
   */
  getAllTips: protectedProcedure.query(async ({ ctx }) => {
    const subscription = await db.getActiveSubscription(ctx.user.id);
    if (!subscription) return [];

    // Get all tips for this subscription
    const tips = getTipsByResultLevel(subscription.resultLevel);
    return tips;
  }),

  /**
   * Get progress entries
   */
  getProgress: protectedProcedure.query(async ({ ctx }) => {
    const subscription = await db.getActiveSubscription(ctx.user.id);
    if (!subscription) return [];

    return db.getProgressBySubscription(subscription.id);
  }),

  /**
   * Add progress entry
   */
  addProgress: protectedProcedure
    .input(
      z.object({
        situationUpdate: z.string(),
        emotionalState: z.enum(["melhorando", "estavel", "piorando"]),
        actionsTaken: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const subscription = await db.getActiveSubscription(ctx.user.id);
      if (!subscription) throw new Error("No active subscription");

      const dayNumber = Math.floor(
        (Date.now() - subscription.currentPeriodStart!.getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1;

      return db.createProgress({
        subscriptionId: subscription.id,
        dayNumber: Math.min(dayNumber, 30),
        situationUpdate: input.situationUpdate,
        emotionalState: input.emotionalState,
        actionsTaken: input.actionsTaken,
        notes: input.notes,
      });
    }),

  /**
   * Cancel subscription
   */
  cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    const subscription = await db.getActiveSubscription(ctx.user.id);
    if (!subscription) throw new Error("No active subscription");

    // Cancel in Stripe
    if (subscription.stripeSubscriptionId) {
      await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
    }

    // Update in database
    return db.updateSubscriptionRecord(subscription.id, {
      status: "canceled",
      canceledAt: new Date(),
    });
  }),

  /**
   * Get subscription status
   */
  getSubscriptionStatus: protectedProcedure.query(async ({ ctx }) => {
    const subscription = await db.getActiveSubscription(ctx.user.id);
    if (!subscription) return null;

    const now = new Date();
    const daysRemaining = Math.ceil(
      (subscription.currentPeriodEnd!.getTime() - now.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const dayNumber = Math.floor(
      (now.getTime() - subscription.currentPeriodStart!.getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1;

    return {
      id: subscription.id,
      status: subscription.status,
      resultLevel: subscription.resultLevel,
      dayNumber: Math.min(dayNumber, 30),
      daysRemaining: Math.max(daysRemaining, 0),
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
    };
  }),
});
