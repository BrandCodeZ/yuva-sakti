import { env } from "../config/env.js";
import { escapeHtml } from "./mailer.js";

/**
 * SMS delivery, kept separate from the mailer because the providers are
 * different products with different failure modes.
 *
 * There is no bundled SMS provider: Indian runners are on a wide mix of
 * gateways and the account has not been chosen yet. Instead this posts to
 * whatever relay the organiser configures in SMS_WEBHOOK_URL, which covers
 * MSG91, Gupshup, Textlocal and similar HTTP APIs.
 *
 * Without a webhook, messages are logged in development. In production an
 * unconfigured relay is a hard failure, because silently dropping a verification
 * SMS would look to a runner like the site is broken.
 */
export async function sendSms(options: {
  to: string;
  body: string;
}): Promise<void> {
  const target = options.to.replace(/\D/g, "");

  if (!env.smsWebhookUrl) {
    if (env.isProduction) {
      throw new Error(
        "SMS_WEBHOOK_URL is not configured. Verification SMS cannot be sent in production.",
      );
    }

    console.info(`[sms:dev] to: ${target} | body: ${options.body}`);
    return;
  }

  const response = await fetch(env.smsWebhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(env.smsWebhookKey
        ? { Authorization: `Bearer ${env.smsWebhookKey}` }
        : {}),
    },
    body: JSON.stringify({
      to: target,
      message: options.body,
      route: "transactional",
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `SMS relay rejected the message: ${response.status} ${detail}`,
    );
  }
}

/** Kept for symmetry with renderOtpTemplate; the SMS body is plain text. */
export function smsOtpBody(code: string, minutes: number): string {
  return [
    `Yuva Shakti Run verification code: ${escapeHtml(code)}`,
    `Valid for ${minutes} minutes.`,
    "Ignore this if you did not ask to register.",
  ].join(" ");
}
