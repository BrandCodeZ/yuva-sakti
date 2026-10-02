import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { OtpChallenge } from "../models/otp.model.js";
import { env } from "../config/env.js";
import { normaliseMobile } from "./ids.js";

/** Six digits, zero padded: 000000 to 999999. */
const CODE_LENGTH = 6;
const TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;

export type Channel = "email" | "mobile";

export interface IssuedOtp {
  code: string;
  expiresAt: Date;
  resendAvailableAt: Date;
}

/**
 * Brute-forcing six digits is 1,000,000 guesses, so a generous window is not
 * safe on its own. The HMAC secret plus per-challenge salt means an attacker
 * without OTP_SECRET cannot precompute hashes offline, and MAX_ATTEMPTS caps
 * live guessing regardless.
 */
function hmac(code: string, salt: string): string {
  return createHmac("sha256", env.otpSecret)
    .update(`${salt}:${code}`)
    .digest("hex");
}

function constantTimeEquals(a: string, b: string): boolean {
  const left = Buffer.from(a, "hex");
  const right = Buffer.from(b, "hex");
  if (left.length !== right.length || left.length === 0) return false;
  return timingSafeEqual(left, right);
}

export function normaliseTarget(channel: Channel, value: string): string {
  const trimmed = value.trim();
  if (channel === "email") return trimmed.toLowerCase();
  return normaliseMobile(trimmed);
}

/**
 * Issues a fresh code, replacing any existing challenge for this channel so a
 * previously sent code can never be replayed. Returns the code for delivery and
 * the timings the UI needs.
 */
export async function issueOtp(
  channel: Channel,
  rawTarget: string,
  purpose: string,
  ip: string | null,
): Promise<IssuedOtp> {
  const target = normaliseTarget(channel, rawTarget);
  const code = randomInt(0, 10 ** CODE_LENGTH).toString().padStart(CODE_LENGTH, "0");
  const salt = randomInt(0, 2 ** 31).toString(36);
  const now = Date.now();

  await OtpChallenge.updateOne(
    { channel, target },
    {
      $set: {
        purpose,
        codeHash: hmac(code, salt),
        salt,
        expiresAt: new Date(now + TTL_MS),
        resendAvailableAt: new Date(now + RESEND_COOLDOWN_MS),
        attemptsLeft: MAX_ATTEMPTS,
        verifiedAt: null,
        consumedAt: null,
        ip,
      },
      $inc: { sendCount: 1 },
    },
    { upsert: true },
  );

  return {
    code,
    expiresAt: new Date(now + TTL_MS),
    resendAvailableAt: new Date(now + RESEND_COOLDOWN_MS),
  };
}

/** Seconds until another code may be requested, or 0 if one can be sent now. */
export async function resendDelaySeconds(
  channel: Channel,
  rawTarget: string,
): Promise<number> {
  const target = normaliseTarget(channel, rawTarget);
  const existing = await OtpChallenge.findOne({ channel, target })
    .select("resendAvailableAt")
    .lean();

  if (!existing) return 0;
  const remaining = existing.resendAvailableAt.getTime() - Date.now();
  return remaining <= 0 ? 0 : Math.ceil(remaining / 1000);
}

export type VerifyResult =
  | { ok: true }
  | { ok: false; reason: "expired" | "mismatch" | "locked" | "not_found" };

/**
 * Checks a submitted code. Every failure path burns an attempt, and a locked
 * challenge deletes itself so the next request must send a new code.
 */
export async function verifyOtp(
  channel: Channel,
  rawTarget: string,
  code: string,
): Promise<VerifyResult> {
  const target = normaliseTarget(channel, rawTarget);
  const challenge = await OtpChallenge.findOne({ channel, target });

  if (!challenge) return { ok: false, reason: "not_found" };

  if (challenge.verifiedAt) return { ok: true };

  if (challenge.consumedAt || challenge.expiresAt.getTime() < Date.now()) {
    await OtpChallenge.deleteOne({ _id: challenge._id });
    return { ok: false, reason: "expired" };
  }

  if (!constantTimeEquals(hmac(code.trim(), challenge.salt), challenge.codeHash)) {
    challenge.attemptsLeft -= 1;
    if (challenge.attemptsLeft <= 0) {
      await OtpChallenge.deleteOne({ _id: challenge._id });
      return { ok: false, reason: "locked" };
    }
    await challenge.save();
    return { ok: false, reason: "mismatch" };
  }

  challenge.verifiedAt = new Date();
  challenge.consumedAt = new Date();
  await challenge.save();
  return { ok: true };
}

/**
 * True when this channel value was verified recently enough to still count.
 * The window is generous because the gap between verifying and submitting is
 * only the length of one form step.
 */
export async function isVerified(
  channel: Channel,
  rawTarget: string,
): Promise<boolean> {
  const target = normaliseTarget(channel, rawTarget);
  const challenge = await OtpChallenge.findOne({ channel, target });

  if (!challenge?.verifiedAt) return false;
  return challenge.verifiedAt.getTime() > Date.now() - VERIFICATION_TTL_MS;
}

const VERIFICATION_TTL_MS = 30 * 60 * 1000;

export function otpTtlSeconds(): number {
  return Math.floor(TTL_MS / 1000);
}

export function resendCooldownSeconds(): number {
  return Math.floor(RESEND_COOLDOWN_MS / 1000);
}
