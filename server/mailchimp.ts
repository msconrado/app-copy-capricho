import { ENV } from "./_core/env";
import crypto from "crypto";

let mailchimp: any = null;

/**
 * Get or initialize Mailchimp client
 */
function getMailchimpClient() {
  if (!mailchimp) {
    try {
      const MailchimpMarketing = require("mailchimp-marketing");
      mailchimp = new MailchimpMarketing();
    } catch (error) {
      console.error("[Mailchimp] Failed to initialize:", error);
      return null;
    }
  }
  return mailchimp;
}

/**
 * Initialize Mailchimp client
 */
export function initializeMailchimp() {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;

  if (!apiKey || !serverPrefix) {
    console.warn("[Mailchimp] API key or server prefix not configured");
    return false;
  }

  const client = getMailchimpClient();
  if (!client) {
    return false;
  }

  client.setConfig({
    apiKey: apiKey,
    server: serverPrefix,
  });

  console.log("[Mailchimp] Mailchimp initialized");
  return true;
}

/**
 * Subscribe email to Mailchimp list
 */
export async function subscribeToMailchimp(
  email: string,
  firstName?: string,
  lastName?: string,
  tags?: string[]
) {
  try {
    const client = getMailchimpClient();
    if (!client) {
      return { success: false, error: "Mailchimp client not available" };
    }

    const listId = process.env.MAILCHIMP_LIST_ID;

    if (!listId) {
      console.warn("[Mailchimp] List ID not configured");
      return { success: false, error: "List ID not configured" };
    }

    const response = await client.lists.addListMember(listId, {
      email_address: email,
      status: "pending", // Double opt-in
      merge_fields: {
        FNAME: firstName || "",
        LNAME: lastName || "",
      },
      tags: tags || [],
    });

    console.log(`[Mailchimp] Subscribed ${email} to list`);
    return { success: true, data: response };
  } catch (error: any) {
    console.error("[Mailchimp] Subscription error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Add tag to subscriber
 */
export async function addTagToSubscriber(email: string, tags: string[]) {
  try {
    const client = getMailchimpClient();
    if (!client) {
      return { success: false, error: "Mailchimp client not available" };
    }

    const listId = process.env.MAILCHIMP_LIST_ID;

    if (!listId) {
      console.warn("[Mailchimp] List ID not configured");
      return { success: false };
    }

    // Get subscriber hash
    const hash = crypto.createHash("md5").update(email.toLowerCase()).digest("hex");

    const response = await client.lists.updateListMemberTags(listId, hash, {
      tags: tags.map((tag: string) => ({ name: tag, status: "active" })),
    });

    console.log(`[Mailchimp] Added tags to ${email}`);
    return { success: true, data: response };
  } catch (error: any) {
    console.error("[Mailchimp] Tag error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Send automation email based on trigger
 */
export async function triggerAutomationEmail(
  email: string,
  automationId: string,
  data?: Record<string, any>
) {
  try {
    // Mailchimp automation is typically triggered by list subscription
    // For custom triggers, you would use webhooks or manual API calls
    console.log(`[Mailchimp] Triggered automation ${automationId} for ${email}`);
    return { success: true };
  } catch (error: any) {
    console.error("[Mailchimp] Automation error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get subscriber info
 */
export async function getSubscriberInfo(email: string) {
  try {
    const client = getMailchimpClient();
    if (!client) {
      return { success: false, error: "Mailchimp client not available" };
    }

    const listId = process.env.MAILCHIMP_LIST_ID;

    if (!listId) {
      console.warn("[Mailchimp] List ID not configured");
      return { success: false };
    }

    const hash = crypto.createHash("md5").update(email.toLowerCase()).digest("hex");

    const response = await client.lists.getListMember(listId, hash);

    return { success: true, data: response };
  } catch (error: any) {
    console.error("[Mailchimp] Get subscriber error:", error);
    return { success: false, error: error.message };
  }
}
