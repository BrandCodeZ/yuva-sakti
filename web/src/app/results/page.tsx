import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/page-head";
import { ResultsSearch } from "@/components/results-search";
import { eventConfig } from "@/config/event";

export const metadata: Metadata = {
  title: "Results and certificate",
  description:
    "Search Yuva Shakti Run results by bib number or name, see your finish time and rank, and download your participation certificate.",
  alternates: { canonical: "/results" },
  robots: { index: true, follow: true },
};

export default function ResultsPage() {
  const published = eventConfig.resultsPublished;

  return (
    <>
      <PageHead
        eyebrow="After race day"
        title="Results & certificate"
        intro="On race morning, this page becomes the running record: search by bib or name, see your finish time and rank, and open your certificate."
        trail={[
          { name: "Home", path: "/" },
          { name: "Results", path: "/results" },
        ]}
      />

      <section className="section">
        <div className="container--narrow stack">
          {published ? (
            <>
              <ResultsSearch />
              <div className="notice notice--ink">
                <div>
                  <strong>Provisional, then confirmed</strong>
                  Times appear as provisional within a few hours of the finish.
                  They become confirmed after a manual check. A wrong time is
                  corrected and the correction is republished — email us your
                  registration ID and the time you expect.
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="notice">
                <div>
                  <strong>Coming after race day</strong>
                  There are no results to publish yet, so this page shows nothing
                  rather than an empty table. It opens within hours of the finish
                  on race day.
                </div>
              </div>

              <div className="card">
                <h2 className="card__title">What will be here</h2>
                <ul className="tick-list" style={{ marginTop: "0.5rem" }}>
                  <li>Search by bib number or by the name on your registration</li>
                  <li>Gross finish time and net time from the timing point</li>
                  <li>Overall rank and rank within your distance and category</li>
                  <li>DNS and DNF recorded honestly, with the checkpoint reached</li>
                  <li>Your certificate, openable and printable as a PDF</li>
                </ul>
                <p className="hint" style={{ marginTop: "0.75rem" }}>
                  We publish the timing method for each distance before registration
                  opens, so you always know whether a distance is ranked.
                </p>
              </div>

              <p className="cluster">
                <Link className="link-arrow" href="/races">
                  See the distances and timing methods
                </Link>
                <Link className="link-arrow" href="/participant-guide">
                  What happens on race morning
                </Link>
              </p>
            </>
          )}
        </div>
      </section>
    </>
  );
}
