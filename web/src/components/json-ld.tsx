import { EVENT_TIME_ZONE, eventConfig } from "@/config/event";
import { site } from "@/config/site";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        // Escape "<" so no string can close the script tag early.
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/**
 * SportsEvent is emitted only once the date exists. Structured data with an
 * invented startDate is worse than none.
 */
export function EventJsonLd() {
  if (!eventConfig.eventDate) return null;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        name: eventConfig.name,
        description: site.description,
        url: site.url,
        image: `${site.url}/opengraph-image`,
        inLanguage: "en",
        sport: "Running",
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: {
          "@type": "Place",
          name: eventConfig.venueName ?? eventConfig.city,
          address: {
            "@type": "PostalAddress",
            ...(eventConfig.venueAddress
              ? { streetAddress: eventConfig.venueAddress }
              : {}),
            addressLocality: eventConfig.city,
            addressRegion: eventConfig.state,
            addressCountry: "IN",
          },
        },
        startDate: eventConfig.eventDate,
        // Finish time is not decided, so we do not claim an endDate.
        timezone: EVENT_TIME_ZONE,
        organizer: {
          "@type": "Organization",
          name: eventConfig.name,
          url: site.url,
          ...(eventConfig.email ? { email: eventConfig.email } : {}),
          ...(eventConfig.phone ? { telephone: eventConfig.phone } : {}),
        },
      }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: eventConfig.name,
        url: site.url,
        slogan: eventConfig.tagline,
        ...(eventConfig.email ? { email: eventConfig.email } : {}),
        ...(eventConfig.phone ? { telephone: eventConfig.phone } : {}),
        sameAs: [eventConfig.instagramUrl],
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  trail,
}: {
  trail: { name: string; path: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: trail.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: `${site.url}${item.path}`,
        })),
      }}
    />
  );
}

export function FaqJsonLd({
  groups,
}: {
  groups: { items: { q: string; a: string }[] }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: groups.flatMap((group) =>
          group.items.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        ),
      }}
    />
  );
}
