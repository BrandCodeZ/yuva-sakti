import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/error.js";
import { router as formRouter } from "./routes/index.js";
import { router as resultsRouter } from "./routes/results.routes.js";
import { router as certificateRouter } from "./routes/certificate.routes.js";

export function createApp() {
  const app = express();

  // Trust exactly one proxy hop, so req.ip is the real client for rate limiting.
  app.set("trust proxy", 1);
  app.disable("x-powered-by");

  app.use(
    helmet({
      // The API serves JSON plus a printable certificate page; a CSP here would
      // only get in the way of the certificate's inline print button.
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
  );

  app.use(
    cors({
      origin(origin, callback) {
        // Same-origin and server-to-server calls arrive without an Origin header.
        if (!origin || env.corsOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error(`Origin ${origin} is not allowed`));
      },
      methods: ["GET", "POST"],
      maxAge: 86_400,
    }),
  );

  app.use(express.json({ limit: "64kb" }));

  app.get("/health", (_req, res) => {
    res.json({ ok: true, uptime: process.uptime() });
  });

  // Each router carries its own rate limit: forms and lookups have different
  // shapes and different limits.
  app.use("/api", formRouter);
  app.use("/api", resultsRouter);
  app.use("/", certificateRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
