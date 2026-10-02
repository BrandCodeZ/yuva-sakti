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
 * Indian mobile numbers to a bare 10-digit form, tolerating the ways people
 * type them: with spaces, with +91, or with the old 0 prefix.
 *
 * This lives in one place on purpose. When four copies drifted apart, a runner
 * who typed 09876543210 got a verification challenge keyed to the untrimmed
 * number while their registration was stored against the trimmed one, so
 * verification silently failed. One definition, imported everywhere.
 */
export function normaliseMobile(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
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
