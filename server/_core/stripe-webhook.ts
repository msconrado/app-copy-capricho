import { Request, Response } from "express";
import { stripe } from "../stripe";
import { ENV } from "./env";
import { getDb, createPayment, getUserByOpenId } from "../db";
import { payments } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Handle Stripe webhook events
 */
export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"] as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      ENV.stripeWebhookSecret
    );
  } catch (err: any) {
    console.error("[Stripe Webhook] Signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle test events
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({
      verified: true,
    });
  }

  console.log(`[Stripe Webhook] Processing event: ${event.type}`);

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as any);
        break;

      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as any);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object as any);
        break;

      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object as any);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as any);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as any);
        break;

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error("[Stripe Webhook] Error processing event:", error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * Handle checkout.session.completed event
 */
async function handleCheckoutSessionCompleted(session: any) {
  console.log("[Stripe] Checkout session completed:", session.id);

  const userId = parseInt(session.client_reference_id);
  const amount = session.amount_total;
  const productType = session.metadata?.product_type || "result";

  const db = await getDb();
  if (!db) {
    console.error("[Stripe] Database not available");
    return;
  }

  try {
    // Update payment status
    await db
      .update(payments)
      .set({
        status: "completed",
      })
      .where(eq(payments.stripePaymentId, session.payment_intent));

    console.log(
      `[Stripe] Payment completed for user ${userId}: ${amount} cents`
    );
  } catch (error) {
    console.error("[Stripe] Error updating payment:", error);
  }
}

/**
 * Handle payment_intent.succeeded event
 */
async function handlePaymentIntentSucceeded(paymentIntent: any) {
  console.log("[Stripe] Payment intent succeeded:", paymentIntent.id);

  const metadata = paymentIntent.metadata;
  const userId = parseInt(metadata?.user_id);

  if (!userId) {
    console.warn("[Stripe] No user_id in payment intent metadata");
    return;
  }

  const db = await getDb();
  if (!db) {
    console.error("[Stripe] Database not available");
    return;
  }

  try {
    // Update payment status
    await db
      .update(payments)
      .set({
        status: "completed",
      })
      .where(eq(payments.stripePaymentId, paymentIntent.id));

    console.log(
      `[Stripe] Payment succeeded for user ${userId}: ${paymentIntent.amount} cents`
    );
  } catch (error) {
    console.error("[Stripe] Error updating payment:", error);
  }
}

/**
 * Handle payment_intent.payment_failed event
 */
async function handlePaymentIntentFailed(paymentIntent: any) {
  console.log("[Stripe] Payment intent failed:", paymentIntent.id);

  const metadata = paymentIntent.metadata;
  const userId = parseInt(metadata?.user_id);

  if (!userId) {
    console.warn("[Stripe] No user_id in payment intent metadata");
    return;
  }

  const db = await getDb();
  if (!db) {
    console.error("[Stripe] Database not available");
    return;
  }

  try {
    // Update payment status
    await db
      .update(payments)
      .set({
        status: "failed",
      })
      .where(eq(payments.stripePaymentId, paymentIntent.id));

    console.log(`[Stripe] Payment failed for user ${userId}`);
  } catch (error) {
    console.error("[Stripe] Error updating payment:", error);
  }
}

/**
 * Handle customer.subscription.created event
 */
async function handleSubscriptionCreated(subscription: any) {
  console.log("[Stripe] Subscription created:", subscription.id);
  // Subscription handling will be implemented in the next phase
}

/**
 * Handle customer.subscription.updated event
 */
async function handleSubscriptionUpdated(subscription: any) {
  console.log("[Stripe] Subscription updated:", subscription.id);
  // Subscription handling will be implemented in the next phase
}

/**
 * Handle customer.subscription.deleted event
 */
async function handleSubscriptionDeleted(subscription: any) {
  console.log("[Stripe] Subscription deleted:", subscription.id);
  // Subscription handling will be implemented in the next phase
}
