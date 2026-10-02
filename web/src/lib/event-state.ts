import { EVENT_TIME_ZONE, eventConfig } from "@/config/event";

export const dateAnnounced = Boolean(eventConfig.eventDate);
export const venueAnnounced = Boolean(eventConfig.venueName);
export const registrationOpen = eventConfig.registrationOpen;

/** Absolute start instant, or null while the date is unannounced. */
export function eventStartInstant(): Date | null {
  if (!eventConfig.eventDate) return null;
  const parsed = new Date(eventConfig.eventDate);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Live phase, safe to call on the server. The countdown component re-derives
 * this in the browser so it can flip to "race day" without a page reload.
 */
export type EventPhase =
  | "pre-announcement"
  | "announced"
  | "race-day"
  | "results-pending"
  | "results-published";

export function eventPhase(now: Date = new Date()): EventPhase {
  if (eventConfig.resultsPublished) return "results-published";
  const start = eventStartInstant();
  if (!start) return "pre-announcement";
  const diffMs = start.getTime() - now.getTime();
  const hoursToStart = diffMs / 3_600_000;
  if (hoursToStart > 0) return "announced";
  // A first-year Delhi run: results take a few hours to publish.
  if (hoursToStart > -24) return "race-day";
  return "results-pending";
}

const istDate = new Intl.DateTimeFormat("en-IN", {
  timeZone: EVENT_TIME_ZONE,
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const istDateShort = new Intl.DateTimeFormat("en-IN", {
  timeZone: EVENT_TIME_ZONE,
  day: "numeric",
  month: "short",
  year: "numeric",
});

const istTime = new Intl.DateTimeFormat("en-IN", {
  timeZone: EVENT_TIME_ZONE,
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

/** "Sunday, 29 November 2026" in IST. Null-safe. */
export function formatIstDate(date: Date | string | null): string | null {
  if (!date) return null;
  const d = typeof date === "string" ? new Date(date) : date;
  return Number.isNaN(d.getTime()) ? null : istDate.format(d);
}

export function formatIstDateShort(date: Date | string | null): string | null {
  if (!date) return null;
  const d = typeof date === "string" ? new Date(date) : date;
  return Number.isNaN(d.getTime()) ? null : istDateShort.format(d);
}

/** "6:30 am IST" regardless of the reader's own time zone. */
export function formatIstTime(date: Date | string | null): string | null {
  if (!date) return null;
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return null;
  return `${istTime.format(d)} IST`;
}

export function formatFlagOff(time: string | null): string | null {
  if (!time) return null;
  const [h = "0", m = "0"] = time.split(":");
  const hour = Number(h);
  if (Number.isNaN(hour)) return null;
  const suffix = hour >= 12 ? "pm" : "am";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:${m} ${suffix} IST`;
}

const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** Returns null when the fee is not fixed, so callers must handle the gap. */
export function formatFee(fee: number | null): string | null {
  if (fee === null) return null;
  return rupees.format(fee);
}

export function formatDistance(metres: number): string {
  return `${metres / 1000} KM`;
}

export function formatDuration(minutes: number | null): string | null {
  if (minutes === null) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}

export function formatElevation(metres: number | null): string | null {
  if (metres === null) return null;
  return `${metres} m`;
}

/** The one-line "when and where" used on cards, hero and structured data. */
export function eventWhenAndWhere(): string {
  const date = formatIstDate(eventConfig.eventDate);
  const where = eventConfig.venueName
    ? `${eventConfig.venueName}, ${eventConfig.city}`
    : null;
  if (date && where) return `${date} · ${where}`;
  if (date) return date;
  if (where) return where;
  return "Date & venue to be announced";
}

/** Badge shown anywhere the date or venue is still unknown. */
export const TBA_BADGE = "Date & venue to be announced";
export const TBA_PUBLISH_AFTER_VENUE = "Published after venue confirmation";
