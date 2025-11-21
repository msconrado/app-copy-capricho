import ReactGA from "react-ga4";

/**
 * Initialize Google Analytics 4
 * Requires VITE_GA_MEASUREMENT_ID environment variable
 */
export function initializeAnalytics() {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (!measurementId) {
    console.warn("[Analytics] Google Analytics measurement ID not configured");
    return;
  }

  ReactGA.initialize(measurementId);
  console.log("[Analytics] Google Analytics initialized");
}

/**
 * Track page view
 */
export function trackPageView(path: string, title?: string) {
  ReactGA.send({
    hitType: "pageview",
    page: path,
    title: title || document.title,
  });
}

/**
 * Track custom event
 */
export function trackEvent(
  category: string,
  action: string,
  label?: string,
  value?: number
) {
  ReactGA.event({
    category,
    action,
    label,
    value,
  });
}

/**
 * Track quiz events
 */
export const quizEvents = {
  start: () => trackEvent("Quiz", "Started"),
  progress: (questionNumber: number) =>
    trackEvent("Quiz", "Progress", `Question ${questionNumber}`, questionNumber),
  completed: (score: number, resultLevel: string) =>
    trackEvent("Quiz", "Completed", resultLevel, score),
  abandoned: (questionNumber: number) =>
    trackEvent("Quiz", "Abandoned", `At question ${questionNumber}`),
};

/**
 * Track payment events
 */
export const paymentEvents = {
  resultPaymentViewed: () =>
    trackEvent("Payment", "Result Payment Viewed", "R$ 4,90"),
  resultPaymentClicked: () =>
    trackEvent("Payment", "Result Payment Clicked", "R$ 4,90"),
  resultPaymentCompleted: () =>
    trackEvent("Payment", "Result Payment Completed", "R$ 4,90"),
  subscriptionPaymentViewed: () =>
    trackEvent("Payment", "Subscription Payment Viewed", "R$ 14,90/mês"),
  subscriptionPaymentClicked: () =>
    trackEvent("Payment", "Subscription Payment Clicked", "R$ 14,90/mês"),
  subscriptionPaymentCompleted: () =>
    trackEvent("Payment", "Subscription Payment Completed", "R$ 14,90/mês"),
};

/**
 * Track user engagement
 */
export const engagementEvents = {
  shareResult: (resultLevel: string) =>
    trackEvent("Engagement", "Shared Result", resultLevel),
  visitedHome: () => trackEvent("Engagement", "Visited Home"),
  startedQuiz: () => trackEvent("Engagement", "Started Quiz"),
  viewedResult: () => trackEvent("Engagement", "Viewed Result"),
};
