import { buildIcs } from "@/lib/calendar";
import { eventStartInstant } from "@/lib/event-state";

export const dynamic = "force-dynamic";

export function GET() {
  const start = eventStartInstant();

  if (!start) {
    return new Response(
      "The race date is not announced yet, so there is nothing to add to a calendar yet.\n",
      { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } },
    );
  }

  return new Response(buildIcs(start), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="yuva-shakti-run.ics"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
