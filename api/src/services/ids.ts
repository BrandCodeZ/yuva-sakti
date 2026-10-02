import { randomInt } from "node:crypto";

/**
 * Human-readable reference a runner can read out over the phone:
 * YSR-2026-7K4Q2. Not sequential, so it does not leak how many entries exist.
 */
export function generateRegistrationId(year: number): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let index = 0; index < 5; index += 1) {
    suffix += alphabet[randomInt(0, alphabet.length)];
  }
  return `YSR-${year}-${suffix}`;
}

/** YSR-00421 style bib, allocated at race-week cut-off, not at registration. */
export function formatBib(sequence: number): string {
  return `YSR-${String(sequence).padStart(5, "0")}`;
}

export function ageOn(dateOfBirth: Date, on: Date): number {
  let age = on.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = on.getMonth() - dateOfBirth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && on.getDate() < dateOfBirth.getDate())) {
    age -= 1;
  }
  return age;
}

/**
 * The race day used for age checks and certificate wording.
 * Set EVENT_DATE_ISO in the API environment once the date is confirmed.
 */
export function raceDay(): Date {
  const configured = process.env.EVENT_DATE_ISO;
  if (configured) {
    const parsed = new Date(configured);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date();
}
