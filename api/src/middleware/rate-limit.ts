import rateLimit from "express-rate-limit";

/**
 * Generous enough for a real runner filling a six-step form on mobile data,
 * tight enough to make automated abuse uninteresting.
 */
export const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 12,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    message:
      "Too many attempts from this connection. Please wait a few minutes and try again.",
  },
});

/** The notify box sits in the hero, so it gets its own softer budget. */
export const notifyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    message: "You have signed up several times already. Please check your inbox.",
  },
});

/** Result search is a lookup, not a submission. */
export const lookupLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many lookups. Please wait a minute." },
});

/**
 * Sending a code costs money and lets an attacker hammer a phone number, so
 * this is tighter than the registration budget. The per-number cooldown in the
 * OTP service is the second layer; this is the per-IP one.
 */
export const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    message:
      "You have asked for several codes already. Please wait before trying again.",
  },
});

/** Guessing is cheap for an attacker, so allow fewer attempts than a runner needs. */
export const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    message: "Too many code attempts. Please ask for a new code.",
  },
});
