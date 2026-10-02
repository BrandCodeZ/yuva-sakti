import { Router } from "express";
import { ApiError } from "../middleware/error.js";
import { otpLimiter, otpVerifyLimiter } from "../middleware/rate-limit.js";
import { asyncHandler, clientIp, parsedBody, validateBody } from "../middleware/validate.js";
import { renderOtpTemplate, sendMailQuietly } from "../services/mailer.js";
import { sendSms, smsOtpBody } from "../services/sms.js";
import {
  isVerified,
  issueOtp,
  normaliseTarget,
  resendCooldownSeconds,
  otpTtlSeconds,
  resendDelaySeconds,
  verifyOtp,
  type Channel,
} from "../services/otp.js";
import {
  otpRequestSchema,
  otpVerifySchema,
  type OtpRequestInput,
  type OtpVerifyInput,
} from "../validators/schemas.js";

export const router = Router();

/**
 * Sends a code to whichever channel the form asked about. Deliberately says
 * nothing about whether the address exists: this endpoint is not a way to test
 * whether someone has an account here.
 */
router.post(
  "/otp/request",
  otpLimiter,
  validateBody(otpRequestSchema),
  asyncHandler(async (req, res) => {
    const body = parsedBody<OtpRequestInput>(res);
    const channel = body.channel as Channel;
    const target = normaliseTarget(channel, body.target);

    const delay = await resendDelaySeconds(channel, target);
    if (delay > 0) {
      // 429 with the wait time, so the UI can show a live countdown rather
      // than a dead error.
      res.setHeader("Retry-After", String(delay));
      throw new ApiError(
        429,
        `Wait ${delay} second${delay === 1 ? "" : "s"} before asking for another code.`,
      );
    }

    const issued = await issueOtp(channel, target, "registration", clientIp(req));

    const minutes = Math.ceil(otpTtlSeconds() / 60);
    if (channel === "email") {
      await sendMailQuietly({
        to: target,
        subject: `${issued.code} is your Yuva Shakti Run verification code`,
        ...renderOtpTemplate({ code: issued.code, channel, minutes }),
      });
    } else {
      try {
        await sendSms({ to: target, body: smsOtpBody(issued.code, minutes) });
      } catch (error) {
        // A challenge that cannot be delivered is worse than none: the runner
        // would wait on a code that never arrives. Remove it.
        console.error(`[otp] SMS to ${target} failed, discarding challenge`, error);
        throw new ApiError(
          502,
          "We could not send the text message. Please check the number, or use email verification instead.",
        );
      }
    }

    res.status(201).json({
      message:
        channel === "email"
          ? `We sent a 6-digit code to ${maskEmail(target)}.`
          : `We sent a 6-digit code by SMS to ${maskMobile(target)}.`,
      data: {
        channel,
        expiresInSeconds: otpTtlSeconds(),
        resendInSeconds: resendCooldownSeconds(),
      },
    });
  }),
);

/**
 * Confirms a code. Retrying a correct code after a network hiccup succeeds
 * rather than confusing the runner with "wrong code".
 */
router.post(
  "/otp/verify",
  otpVerifyLimiter,
  validateBody(otpVerifySchema),
  asyncHandler(async (req, res) => {
    const body = parsedBody<OtpVerifyInput>(res);
    const result = await verifyOtp(body.channel as Channel, body.target, body.code);

    if (result.ok) {
      res.json({ message: "Verified.", data: { channel: body.channel } });
      return;
    }

    const messages: Record<typeof result.reason, string> = {
      not_found:
        "We have no code waiting for that. Ask for a new one and try again.",
      expired: "That code has expired. Ask for a new one.",
      locked:
        "Too many wrong guesses. Ask for a new code to start again.",
      mismatch: "That code is not right. Check it and try again.",
    };

    throw new ApiError(400, messages[result.reason]);
  }),
);

/** Lets the form re-check on reload without forcing the runner to re-verify. */
router.get(
  "/otp/status",
  asyncHandler(async (req, res) => {
    const channel = String(req.query.channel ?? "");
    const target = String(req.query.target ?? "");

    if (channel !== "email" && channel !== "mobile") {
      res.status(400).json({ message: "Unknown channel." });
      return;
    }

    const verified = await isVerified(channel, target);
    res.json({
      data: { channel, verified },
    });
  }),
);

/** maskEmail keeps enough to recognise the address without echoing it back. */
function maskEmail(value: string): string {
  const [name = "", domain = ""] = value.split("@");
  if (!domain) return "your email address";
  const head = name.slice(0, Math.min(2, name.length));
  return `${head}${"*".repeat(Math.max(2, Math.min(5, name.length - head.length)))}@${domain}`;
}

/** Keeps the first two and last four digits, the usual Indian convention. */
function maskMobile(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 6) return "your number";
  return `${digits.slice(0, 2)}*****${digits.slice(-4)}`;
}
