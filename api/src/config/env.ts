import { config } from "dotenv";

config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. Copy .env.example to .env and fill it in.`,
    );
  }
  return value;
}

function optional(name: string, fallback = ""): string {
  return process.env[name] ?? fallback;
}

export const env = {
  nodeEnv: optional("NODE_ENV", "development"),
  port: Number(optional("PORT", "4000")),
  mongoUri: required("MONGODB_URI", "mongodb://127.0.0.1:27017/yuva_shakti_run"),
  /** Comma-separated list of origins allowed to post from the browser. */
  corsOrigins: optional("CORS_ORIGINS", "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  /** Optional HTTP mail provider. Without it, mail is logged, never sent. */
  resendApiKey: optional("RESEND_API_KEY"),
  mailFrom: optional("MAIL_FROM", "Yuva Shakti Run <no-reply@example.com>"),
  /** Where confirmation emails point. The web app's public origin. */
  webUrl: optional("WEB_URL", "http://localhost:3000"),
  organiserEmail: optional("ORGANISER_EMAIL"),
  /** Turn on to drop submissions from local development entirely. */
  acceptSubmissions: optional("ACCEPT_SUBMISSIONS", "true") !== "false",
  /**
   * Mirrors eventConfig.registrationOpen in web/src/config/event.ts. While
   * false, the API accepts interest, notify, contact, volunteer and partner
   * submissions but rejects full registrations, so the interest-only mode
   * cannot be bypassed by posting straight to this endpoint.
   */
  registrationOpen: optional("REGISTRATION_OPEN", "false") === "true",
  /** Keeps the results endpoint closed until a timing file is actually loaded. */
  resultsPublished: optional("RESULTS_PUBLISHED", "false") === "true",
  /**
   * HMAC key for OTP codes. Generate one with:
   *   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   * Must stay constant, or codes issued before a change stop verifying.
   */
  otpSecret: required(
    "OTP_SECRET",
    // No development default on purpose. A fixed fallback would ship to
    // production by accident, and a generated-per-boot one would invalidate
    // every outstanding code each restart.
    undefined,
  ),
  /**
   * HTTP relay for verification SMS (MSG91, Gupshup, Textlocal and similar).
   * Leave blank in development to log codes instead of sending them.
   */
  smsWebhookUrl: optional("SMS_WEBHOOK_URL"),
  smsWebhookKey: optional("SMS_WEBHOOK_KEY"),
  isProduction: optional("NODE_ENV", "development") === "production",
} as const;
