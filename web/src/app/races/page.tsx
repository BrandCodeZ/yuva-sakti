import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/page-head";
import { Placeholder } from "@/components/placeholder";
import { RaceSpecs } from "@/components/race-card";
import { Reveal } from "@/components/reveal";
import { eventConfig } from "@/config/event";
import { googleCalendarUrl } from "@/lib/calendar";
import { TBA_BADGE, eventStartInstant, formatDistance } from "@/lib/event-state";

export const metadata: Metadata = {
  title: "Races — 10 KM, 5 KM and 3 KM",
  description:
    "Three distances at Yuva Shakti Run, Delhi: 10 KM, 5 KM and 3 KM. Route summary, format, timing method, eligibility, cut-off and entry fee for each.",
  alternates: { canonical: "/races" },
};

export default function RacesPage() {
  const start = eventStartInstant();

  return (
    <>
      <PageHead
        eyebrow="The distances"
        title="Three races, one start line"
        intro="Pick the distance that matches where you are today, not where you think you should be. Every detail below is either confirmed or plainly marked as open."
        trail={[
          { name: "Home", path: "/" },
          { name: "Races", path: "/races" },
        ]}
      />

      <section className="section">
        <div className="container stack">
          <nav aria-label="Jump to a distance" className="cluster">
            {eventConfig.races.map((race) => (
              <a key={race.id} className="btn btn--sm btn--ghost" href={`#${race.id}`}>
                {formatDistance(race.distanceMetres)}
              </a>
            ))}
          </nav>

          {eventConfig.races.map((race) => (
            <Reveal as="article" key={race.id} id={race.id} className="race-detail">
              <div className="race-detail__head">
                <span className="race-card__distance">{formatDistance(race.distanceMetres)}</span>
                <p className="lede" style={{ marginTop: "0.75rem" }}>
                  {race.summary}
                </p>
              </div>

              <div className="race-detail__body">
                <RaceSpecs race={race} />

                <div className="card__foot cluster">
                  <Link
                    className="btn btn--primary"
                    href={`/registration?race=${race.id}`}
                  >
                    Register for {formatDistance(race.distanceMetres)}
                  </Link>
                  {start ? (
                    <a
                      className="btn btn--ghost"
                      href={googleCalendarUrl(start)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Add race day to calendar
                    </a>
                  ) : (
                    <button
                      className="btn btn--ghost"
                      type="button"
                      disabled
                      title="Available once the date is announced"
                    >
                      <span className="badge badge--tba">{TBA_BADGE}</span>
                    </button>
                  )}
                </div>

                {race.routeNote ? (
                  <p className="text-muted" style={{ marginTop: "0.5rem" }}>
                    Route: {race.routeNote}
                  </p>
                ) : (
                  <p style={{ marginTop: "0.75rem" }}>
                    <Placeholder>
                      Route description for {formatDistance(race.distanceMetres)}
                    </Placeholder>
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section section--surface section--tight">
        <div className="container">
          <div className="notice notice--ink">
            <div>
              <strong>About timing and prizes</strong>
              We state the timing method for every distance before registration
              opens, and we do not describe a fun run as a timed race. Prize
              money, if any is offered, appears here in full before you pay —
              never after the event.
            </div>
          </div>
          <p className="cluster" style={{ marginTop: "1.25rem" }}>
            <Link className="link-arrow" href="/rules">
              Read the rules and policies
            </Link>
            <Link className="link-arrow" href="/route-map">
              See the route map
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
