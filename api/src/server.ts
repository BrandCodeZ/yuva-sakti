import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./db/connect.js";

async function main(): Promise<void> {
  const app = createApp();

  try {
    await connectDatabase();
  } catch (error) {
    // The API is useless without a database, so fail loudly rather than
    // accepting registrations we cannot store.
    console.error("[api] could not connect to MongoDB:", error);
    process.exit(1);
  }

  app.listen(env.port, () => {
    console.info(`[api] listening on http://localhost:${env.port}`);
    console.info(`[api] accepting submissions from: ${env.corsOrigins.join(", ")}`);
    if (!env.resendApiKey) {
      console.warn(
        "[api] RESEND_API_KEY is not set. Confirmation emails will be logged, not sent.",
      );
    }
  });
}

void main();
