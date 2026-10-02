import type { Metadata } from "next";
import { PageHead } from "@/components/page-head";
import { eventConfig } from "@/config/event";

export const metadata: Metadata = {
  title: "Updates and announcements",
  description:
    "Every dated announcement for Yuva Shakti Run, Delhi: venue and date confirmations, registration openings, route releases and race-week notices.",
  alternates: { canonical: "/updates" },
};

export default function UpdatesPage() {
  const updates = [...eventConfig.updates].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHead
        eyebrow="News"
        title="Updates"
        intro="Everything we announce, dated. If it is not on this page, we have not announced it."
        trail={[
          { name: "Home", path: "/" },
          { name: "Updates", path: "/updates" },
        ]}
      />

      <section className="section">
        <div className="container--narrow">
          {updates.length === 0 ? (
            <>
              <div className="notice">
                <div>
                  <strong>Nothing announced yet</strong>
                  The date and venue are being finalised with the authorities.
                  When they are locked, this page becomes the running record, and
                  the first entry will be the announcement itself.
                </div>
              </div>
              <div className="stack" style={{ marginTop: "2rem" }}>
                <h2>What we will post here</h2>
                <ul className="tick-list">
                  <li>Venue and date confirmation, with the approval details</li>
                  <li>Registration opening, with the fee for every distance</li>
                  <li>Route map release and any reroutes</li>
                  <li>Flag-off times, cut-offs and bib collection windows</li>
                  <li>Go / no-go decisions on race morning</li>
                  <li>Results publication and the post-event report</li>
                </ul>
              </div>
            </>
          ) : (
            <ol className="feed">
              {updates.map((update) => (
                <li key={`${update.date}-${update.title}`}>
                  <time dateTime={update.date}>
                    {new Date(update.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                  <div>
                    <h2 className="feed__title">{update.title}</h2>
                    <p>{update.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
    </>
  );
}
