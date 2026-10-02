import { env } from "../config/env.js";

interface MailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

/**
 * Dependency-free HTTP mailer.
 *
 * With RESEND_API_KEY set it sends through Resend. Without it, in development it
 * prints to the console; in production it throws, because silently swallowing a
 * confirmation email would be worse than failing loudly.
 */
/**
 * Fire-and-forget wrapper for mail sent *after* a record is already saved.
 *
 * The submission exists in Mongo whether or not the email arrives, so letting a
 * mail provider error propagate would return 500 and invite the runner to submit
 * a second, duplicate entry. We log loudly instead, and say so in the response.
 */
export async function sendMailQuietly(options: MailOptions): Promise<boolean> {
  try {
    await sendMail(options);
    return true;
  } catch (error) {
    console.error(
      `[mail] could not send "${options.subject}" to ${options.to}. The record was saved.`,
      error,
    );
    return false;
  }
}

export async function sendMail(options: MailOptions): Promise<void> {
  if (!env.resendApiKey) {
    if (env.isProduction) {
      throw new Error(
        "RESEND_API_KEY is not configured. Confirmation emails cannot be sent in production.",
      );
    }

    console.info("[mail:dev] to:", options.to, "| subject:", options.subject);
    console.info("[mail:dev] text:", options.text);
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.mailFrom,
      to: [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text,
      ...(options.replyTo ? { reply_to: options.replyTo } : {}),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Mail provider rejected the message: ${response.status} ${detail}`);
  }
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface TemplateOptions {
  heading: string;
  body: string[];
  cta?: { label: string; url: string };
  footer?: string;
}

/**
 * The code is the first thing a runner reads, so it is the largest element and
 * set in monospace with spacing, to make mistyping it less likely.
 */
export function renderOtpTemplate(options: {
  code: string;
  channel: "email" | "mobile";
  minutes: number;
}): { html: string; text: string } {
  const where =
    options.channel === "email"
      ? "We sent this code to your email address."
      : "We sent this SMS to your mobile number.";

  const text = [
    "Your Yuva Shakti Run verification code",
    "",
    `${options.code}`,
    "",
    where,
    `It stops working after ${options.minutes} minutes.`,
    "",
    "If you did not ask to register, you can ignore this email. Nothing has been",
    "registered and nobody will contact you about it.",
    "",
    "Yuva Shakti Run, Delhi — Strong Youth, Strong Nation",
  ].join("\n");

  const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:24px;background:#FAF7F2;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#161816">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:8px;border-top:6px solid #F47B20;padding:24px">
    <p style="margin:0 0 4px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#B85300">Yuva Shakti Run</p>
    <h1 style="margin:0 0 16px;font-size:22px;line-height:1.2">Your verification code</h1>
    <p style="margin:0 0 20px;font-size:24px;font-weight:700;letter-spacing:10px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;background:#FAF7F2;border:1px solid #E4DFD6;border-radius:6px;padding:16px 12px;text-align:center">${escapeHtml(options.code)}</p>
    <p style="margin:0 0 12px;font-size:15px;line-height:1.6">${escapeHtml(where)}</p>
    <p style="margin:0 0 12px;font-size:15px;line-height:1.6">It stops working after ${options.minutes} minutes.</p>
    <p style="margin:24px 0 0;padding-top:16px;border-top:1px solid #E4DFD6;font-size:12px;color:#5C625C">
      If you did not ask to register, ignore this email. Nothing has been registered and nobody will contact you about it.
    </p>
  </div>
</body>
</html>`;

  return { html, text };
}

export function renderTemplate(options: TemplateOptions): {
  html: string;
  text: string;
} {
  const footer = options.footer ?? "Yuva Shakti Run, Delhi";

  const text = [
    options.heading,
    "",
    ...options.body,
    ...(options.cta ? ["", `${options.cta.label}: ${options.cta.url}`] : []),
    "",
    footer,
  ].join("\n");

  const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:24px;background:#FAF7F2;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#161816">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:8px;border-top:6px solid #F47B20;padding:24px">
    <p style="margin:0 0 4px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#B85300">Yuva Shakti Run</p>
    <h1 style="margin:0 0 16px;font-size:22px;line-height:1.2">${escapeHtml(options.heading)}</h1>
    ${options.body.map((line) => `<p style="margin:0 0 12px;font-size:15px;line-height:1.6">${escapeHtml(line)}</p>`).join("\n")}
    ${
      options.cta
        ? `<p style="margin:20px 0"><a href="${escapeHtml(options.cta.url)}" style="display:inline-block;background:#F47B20;color:#000;font-weight:700;padding:12px 18px;border-radius:4px;text-decoration:none">${escapeHtml(options.cta.label)}</a></p>`
        : ""
    }
    <p style="margin:24px 0 0;padding-top:16px;border-top:1px solid #E4DFD6;font-size:12px;color:#5C625C">
      ${escapeHtml(footer)} &middot; Strong Youth, Strong Nation
    </p>
  </div>
</body>
</html>`;

  return { html, text };
}
