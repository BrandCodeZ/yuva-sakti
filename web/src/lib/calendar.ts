import { eventConfig } from "@/config/event";
import { site } from "@/config/site";

function icsStamp(date: Date): string {
  return `${date.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
}

function escapeIcs(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/**
 * A real .ics file, served only once a date exists. The run block is three
 * hours long — a placeholder, and the finish time is confirmed in the guide.
 */
export function buildIcs(start: Date): string {
  const end = new Date(start.getTime() + 3 * 3_600_000);
  const location = eventConfig.venueName
    ? `${eventConfig.venueName}, ${eventConfig.venueAddress ?? eventConfig.city}`
    : `${eventConfig.city}, ${eventConfig.state}`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Yuva Shakti Run//Race Day//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${start.getTime()}@${eventConfig.domain}`,
    `DTSTAMP:${icsStamp(new Date())}`,
    `DTSTART:${icsStamp(start)}`,
    `DTEND:${icsStamp(end)}`,
    `SUMMARY:${escapeIcs(eventConfig.name)} — ${escapeIcs(eventConfig.city)}`,
    `DESCRIPTION:${escapeIcs(
      `${eventConfig.tagline}. Distances: ${eventConfig.races.map((r) => r.name).join(", ")}. Flag-off times, bib collection and venue directions: ${site.url}/participant-guide`,
    )}`,
    `LOCATION:${escapeIcs(location)}`,
    `URL:${site.url}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-PT3H",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeIcs(`${eventConfig.name} starts in 3 hours`)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return `${lines.join("\r\n")}\r\n`;
}

export function googleCalendarUrl(start: Date): string {
  const end = new Date(start.getTime() + 3 * 3_600_000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${eventConfig.name} — ${eventConfig.city}`,
    dates: `${icsStamp(start)}/${icsStamp(end)}`,
    details: `${eventConfig.tagline}. Distances: ${eventConfig.races
      .map((r) => r.name)
      .join(", ")}. Details: ${site.url}/participant-guide`,
    location: `${eventConfig.venueName ?? eventConfig.city}, ${eventConfig.city}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
