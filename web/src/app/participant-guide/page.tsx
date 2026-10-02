import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/page-head";
import { Placeholder } from "@/components/placeholder";
import { eventConfig } from "@/config/event";
import { TBA_PUBLISH_AFTER_VENUE, registrationOpen } from "@/lib/event-state";

export const metadata: Metadata = {
  title: "Participant guide — bib collection, race-day timeline and what to bring",
  description:
    "Everything a Yuva Shakti Run participant needs on race day: bib collection, documents to carry, race-day timeline, parking and metro access, baggage deposit, hydration, medical support and weather advice.",
  alternates: { canonical: "/participant-guide" },
};

const TIMELINE: { time: string; what: string; tba: boolean }[] = [
  { time: "05:00", what: "Venue gates open, baggage deposit opens", tba: true },
  { time: "05:30", what: "Bib collection desk opens (runners only after confirmation)", tba: true },
  { time: "06:00", what: "Warm-up and mobility session with the club coaches", tba: true },
  { time: "06:15", what: "3 KM wave", tba: true },
  { time: "06:30", what: "5 KM wave", tba: true },
  { time: "07:00", what: "10 KM wave", tba: true },
  { time: "07:45", what: "Course closes, sweepers start", tba: true },
  { time: "09:00", what: "Medals, photographs and refreshments at the finish", tba: true },
];

const BRING = [
  "Photo ID or any government photo ID, with the registration ID printed on it or written on a slip",
  "The confirmation email or SMS on your phone, in case the desk cannot find you by name",
  "Your own water bottle if you prefer one to the cups on course",
  "Running shoes you have already broken in, and a practice run in them beforehand",
  "A dry layer for after the finish if Delhi in the afternoon is its usual self",
];

const CODE_OF_CONDUCT = [
  "No vehicles, cycles or skates on the course. It is closed to runners.",
  "No dogs on the course.",
  "Keep your bib visible so marshals and the timing team can identify you.",
  "Move to the side before you walk, eat or take a photograph.",
  "If you are struggling, tell the nearest marshal. Sweepers stay with you to the finish.",
  "No doping. Medical teams may test any runner.",
];

export default function ParticipantGuidePage() {
  const published = Boolean(eventConfig.venueName);

  return (
    <>
      <PageHead
        eyebrow="Race day"
        title="Participant guide"
        intro="How race morning works, what to carry, where to park and what happens if the weather turns. Written to be read once, on a train, the week before."
        trail={[
          { name: "Home", path: "/" },
          { name: "Participant Guide", path: "/participant-guide" },
        ]}
      />

      <section className="section">
        <div className="container stack">
          {!published ? (
            <div className="notice">
              <div>
                <strong>{TBA_PUBLISH_AFTER_VENUE}</strong>
                Bib collection windows, parking and the race-day timeline all
                depend on which roads the authorities grant us. The structure of the
                morning is below; the times fill in as soon as they are booked.
              </div>
            </div>
          ) : null}

          <div className="grid grid--2" style={{ alignItems: "start" }}>
            <div className="prose">
              <h2>Collecting your bib</h2>
              <p>
                Collection is planned for the evening before and on race morning at
                the venue itself. You will need a photo ID and your registration ID.
                Proxy collection is allowed once, for a family member or club
                captain, with a written authorisation and copies of both IDs.
              </p>
              <ul className="tick-list tick-list--pending">
                <li>Collection dates and times — to be announced</li>
                <li>Exact desk location — {TBA_PUBLISH_AFTER_VENUE.toLowerCase()}</li>
                <li>Documents to carry — photo ID plus registration ID</li>
              </ul>
              <p>
                If you cannot collect in person, tell us before race week. It is
                easier to sort than to solve at the desk with 400 runners behind
                you.
              </p>

              <h2>Getting there</h2>
              <p>
                Most people should plan to arrive by metro. The nearest station,
                the walking route from it and the parking plan go into the
                participant guide PDF once the venue is fixed.
              </p>
              <p>
                <Placeholder>
                  Nearest metro station, exit number, and the parking plan
                </Placeholder>
              </p>

              <h2>Baggage deposit</h2>
              <p>
                We plan a marked baggage area near the start so you are not
                carrying a bag for 10 km. Bags are handed in at your own risk and
                must be collected by the time the course closes.
              </p>

              <h2>Hydration and medical support</h2>
              <p>
                Water and electrolytes are planned along the course and at the
                finish. First-aid points sit at fixed locations, and a medical team
                travels with the course by vehicle. The ambulance and medical
                helpline number is printed in the footer of this site and on your
                bib.
              </p>
              <p>
                {eventConfig.medicalPartner ? (
                  <>Medical partner: {eventConfig.medicalPartner}.</>
                ) : (
                  <Placeholder>Medical partner name</Placeholder>
                )}
              </p>

              <h2>Weather advice</h2>
              <p>
                Delhi in the run season is hot, and air quality decides whether a
                race is safe for a lot of people. We publish a go-ahead decision by
                6:00 am on race day by email, SMS and on this site, and we postpone
                rather than ask people to run in conditions we would not train in.
              </p>
              <ul className="tick-list">
                <li>Hydrate from the evening before, not only on the morning</li>
                <li>Check the AQIs for your own asthma or heart condition</li>
                <li>Do not train hard the day before</li>
                <li>Start slower than you think you need to on Indian roads</li>
              </ul>
            </div>

            <div className="stack">
              <div className="card">
                <h2 className="card__title">Race-day timeline</h2>
                <ol className="timeline" style={{ marginTop: "0.75rem" }}>
                  {TIMELINE.map((slot) => (
                    <li key={slot.time}>
                      <span className="timeline__time">{slot.time}</span>
                      <span>
                        {slot.what}
                        {slot.tba ? (
                          <>
                            {" "}
                            <span className="placeholder">Provisional</span>
                          </>
                        ) : null}
                      </span>
                    </li>
                  ))}
                </ol>
                <p className="hint">
                  Flag-off times are IST and apply to every wave unless we publish
                  otherwise.
                </p>
              </div>

              <div className="card">
                <h2 className="card__title">What to bring</h2>
                <ul className="tick-list" style={{ marginTop: "0.5rem" }}>
                  {BRING.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="card">
                <h2 className="card__title">Code of conduct</h2>
                <ul className="tick-list tick-list--pending" style={{ marginTop: "0.5rem" }}>
                  {CODE_OF_CONDUCT.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="hint">
                  Breaching the conduct rules can lead to disqualification. See{" "}
                  <Link href="/rules">rules &amp; policies</Link>.
                </p>
              </div>
            </div>
          </div>

          <section aria-labelledby="downloads">
            <h2 id="downloads">Downloads</h2>
            <div className="grid grid--3" style={{ marginTop: "1rem" }}>
              <div className="card card--flat">
                <h3 className="card__title" style={{ fontSize: "var(--step-1)" }}>
                  Participant guide PDF
                </h3>
                <Placeholder>Awaiting the final guide</Placeholder>
              </div>
              <div className="card card--flat">
                <h3 className="card__title" style={{ fontSize: "var(--step-1)" }}>
                  Route PDF
                </h3>
                <Placeholder>Awaiting venue confirmation</Placeholder>
              </div>
              <div className="card card--flat">
                <h3 className="card__title" style={{ fontSize: "var(--step-1)" }}>
                  Add race day to your calendar
                </h3>
                {registrationOpen && eventConfig.eventDate ? (
                  <a className="btn btn--primary" href="/add-to-calendar">
                    Download .ics
                  </a>
                ) : (
                  <Placeholder>Unlocks when the date is set</Placeholder>
                )}
              </div>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
