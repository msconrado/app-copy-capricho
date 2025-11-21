/**
 * Stripe Products Configuration
 * Define all products and prices for the application
 */

export const STRIPE_PRODUCTS = {
  RESULT_UNLOCK: {
    name: "Resultado Completo",
    description: "Acesso ao resultado completo do quiz com plano de ação personalizado",
    priceInCents: 490, // R$ 4,90
    currency: "BRL",
    type: "one_time",
  },
  MONTHLY_SUBSCRIPTION: {
    name: "Assinatura Mensal",
    description: "Dicas diárias personalizadas + resultado completo + acesso ilimitado",
    priceInCents: 1490, // R$ 14,90
    currency: "BRL",
    interval: "month",
    type: "recurring",
  },
};

export type StripeProductKey = keyof typeof STRIPE_PRODUCTS;
