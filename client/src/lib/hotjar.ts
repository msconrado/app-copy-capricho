import hj from "@hotjar/browser";

let hjInitialized = false;

/**
 * Initialize Hotjar for heatmaps and session recordings
 * Requires VITE_HOTJAR_SITE_ID environment variable
 */
export function initializeHotjar() {
  const siteId = import.meta.env.VITE_HOTJAR_SITE_ID;
  const hjVersion = 6;

  if (!siteId) {
    console.warn("[Hotjar] Site ID not configured, skipping initialization");
    hjInitialized = false;
    return;
  }

  try {
    hj.init(parseInt(siteId), hjVersion);
    hjInitialized = true;
    console.log("[Hotjar] Hotjar initialized successfully");
  } catch (error) {
    console.warn("[Hotjar] Failed to initialize Hotjar:", error);
    hjInitialized = false;
  }
}

/**
 * Check if Hotjar is initialized
 */
function isHotjarReady(): boolean {
  return hjInitialized && typeof hj !== 'undefined' && hj && typeof hj.event === 'function';
}

/**
 * Track custom events in Hotjar
 */
export function trackHotjarEvent(eventName: string) {
  if (!isHotjarReady()) {
    console.debug(`[Hotjar] Skipping event tracking (not initialized): ${eventName}`);
    return;
  }

  try {
    hj.event(eventName);
    console.debug(`[Hotjar] Event tracked: ${eventName}`);
  } catch (error) {
    console.warn(`[Hotjar] Failed to track event: ${eventName}`, error);
  }
}

/**
 * Hotjar quiz tracking
 */
export const hotjarQuizEvents = {
  started: () => trackHotjarEvent("quiz_started"),
  completed: (score: number, resultLevel: string) =>
    trackHotjarEvent(`quiz_completed_${resultLevel}_${score}`),
  abandoned: (questionNumber: number) =>
    trackHotjarEvent(`quiz_abandoned_q${questionNumber}`),
};

/**
 * Hotjar payment tracking
 */
export const hotjarPaymentEvents = {
  resultPaymentViewed: () => trackHotjarEvent("result_payment_viewed"),
  resultPaymentClicked: () => trackHotjarEvent("result_payment_clicked"),
  subscriptionPaymentViewed: () =>
    trackHotjarEvent("subscription_payment_viewed"),
  subscriptionPaymentClicked: () =>
    trackHotjarEvent("subscription_payment_clicked"),
};
