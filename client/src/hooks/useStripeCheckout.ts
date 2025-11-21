import { useCallback } from "react";
import { toast } from "sonner";

export function useStripeCheckout() {
  const createCheckoutSession = useCallback(
    async (productType: "result" | "subscription") => {
      try {
        toast.loading("Redirecionando para checkout...");

        // In production, this would call a tRPC procedure to create the checkout session
        // For now, we'll simulate the checkout URL
        const checkoutUrl = `https://checkout.stripe.com/pay/cs_test_${Math.random().toString(36).substring(7)}`;

        // Open checkout in a new tab
        window.open(checkoutUrl, "_blank");

        toast.dismiss();
        toast.success("Redirecionado para o checkout!");
      } catch (error) {
        toast.error("Erro ao abrir checkout. Tente novamente.");
        console.error("Erro no checkout:", error);
      }
    },
    []
  );

  return { createCheckoutSession };
}
