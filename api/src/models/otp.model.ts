import { Schema, model } from "mongoose";

/**
 * One outstanding OTP per channel (email or mobile).
 *
 * Deliberately not a general token store: a runner verifies their own address
 * and number, then the registration records the fact. Codes are short-lived,
 * stored hashed, and overwritten rather than accumulated, so the collection
 * holds at most one row per channel value.
 */
const otpChallengeSchema = new Schema(
  {
    /** "email" or "mobile". */
    channel: {
      type: String,
      required: true,
      enum: ["email", "mobile"],
      index: true,
    },
    /** Lowercased email, or the bare 10-digit number. */
    target: { type: String, required: true, lowercase: true, trim: true, index: true },
    /** Which form asked for it: "registration", "interest", "contact". */
    purpose: { type: String, required: true, default: "registration" },

    /**
     * HMAC-SHA256 of the code, hex encoded. A database leak therefore does not
     * hand an attacker a list of live codes.
     */
    codeHash: { type: String, required: true },
    /** Random salt per challenge, so identical codes hash differently. */
    salt: { type: String, required: true },

    expiresAt: { type: Date, required: true },
    /** Wrong guesses before this challenge is destroyed. */
    attemptsLeft: { type: Number, default: 5 },
    verifiedAt: { type: Date, default: null },
    /** Set once the code is used or expired, to keep the collection clean. */
    consumedAt: { type: Date, default: null },
    /** When a new code may next be sent, for the resend cooldown. */
    resendAvailableAt: { type: Date, required: true },
    /** How many times we have sent a code here, to spot abuse. */
    sendCount: { type: Number, default: 0 },

    ip: { type: String, default: null },
  },
  { timestamps: true },
);

// One live challenge per channel value. The upsert in otp.service relies on it.
otpChallengeSchema.index({ channel: 1, target: 1 }, { unique: true });
// Mongo removes the document once expiresAt passes.
otpChallengeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OtpChallenge = model("OtpChallenge", otpChallengeSchema);
