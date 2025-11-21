import Stripe from "stripe";
import { ENV } from "./_core/env";

export const stripe = new Stripe(ENV.stripeSecretKey);

/**
 * Create a checkout session for a one-time payment
 */
export async function createCheckoutSession(
  userId: number,
  userEmail: string,
  userName: string,
  productType: "result" | "subscription",
  origin: string
) {
  const baseUrl = origin || "https://sera-que-ele-gosta.manus.space";

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    payment_method_types: ["card"],
    mode: productType === "result" ? "payment" : "subscription",
    customer_email: userEmail,
    client_reference_id: userId.toString(),
    metadata: {
      user_id: userId.toString(),
      customer_email: userEmail,
      customer_name: userName,
      product_type: productType,
    },
    success_url: `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/payment-canceled`,
    allow_promotion_codes: true,
  };

  if (productType === "result") {
    sessionParams.line_items = [
      {
        price_data: {
          currency: "brl",
          product_data: {
            name: "Resultado Completo - Será que Ele(a) Gosta de Mim?",
            description:
              "Acesso ao resultado completo do quiz com plano de ação personalizado",
          },
          unit_amount: 490, // R$ 4,90
        },
        quantity: 1,
      },
    ];
  } else if (productType === "subscription") {
    sessionParams.line_items = [
      {
        price_data: {
          currency: "brl",
          product_data: {
            name: "Assinatura Mensal - Será que Ele(a) Gosta de Mim?",
            description:
              "Dicas diárias personalizadas + resultado completo + acesso ilimitado",
          },
          unit_amount: 1490, // R$ 14,90
          recurring: {
            interval: "month",
          },
        },
        quantity: 1,
      },
    ];
  }

  const session = await stripe.checkout.sessions.create(sessionParams);

  return session;
}

/**
 * Retrieve a checkout session
 */
export async function getCheckoutSession(sessionId: string) {
  return stripe.checkout.sessions.retrieve(sessionId);
}

/**
 * Create a payment intent for manual payment handling
 */
export async function createPaymentIntent(
  amount: number,
  currency: string,
  userEmail: string,
  metadata: Record<string, string>
) {
  return stripe.paymentIntents.create({
    amount,
    currency,
    receipt_email: userEmail,
    metadata,
  });
}

/**
 * Retrieve a payment intent
 */
export async function getPaymentIntent(intentId: string) {
  return stripe.paymentIntents.retrieve(intentId);
}

/**
 * Retrieve a subscription
 */
export async function getSubscription(subscriptionId: string) {
  return stripe.subscriptions.retrieve(subscriptionId);
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  return stripe.subscriptions.cancel(subscriptionId);
}

/**
 * Retrieve a customer
 */
export async function getCustomer(customerId: string) {
  return stripe.customers.retrieve(customerId);
}

/**
 * Create a customer
 */
export async function createCustomer(email: string, name: string) {
  return stripe.customers.create({
    email,
    name,
  });
}
