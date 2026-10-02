import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/page-head";
import { PhotoFrame } from "@/components/photo-frame";
import { Placeholder } from "@/components/placeholder";
import { eventConfig } from "@/config/event";
import { heroPhoto } from "@/content/photos";

export const metadata: Metadata = {
  title: "About us — who organises Yuva Shakti Run",
  description:
    "Who organises Yuva Shakti Run in Delhi, why the run exists, what the name means, and the impact the organisers are aiming for.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHead
        eyebrow="About the run"
        title="Strong Youth, Strong Nation"
        intro="Yuva Shakti means the strength of the young. Yuva Shakti Run is a first-year Delhi road race built by people who train on these streets every week."
        trail={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]}
      />

      <section className="section">
        <div className="container">
          <div className="grid grid--2">
            <div className="prose">
              <h2>Why this run exists</h2>
              <p>
                Most of Delhi&rsquo;s roads are built for vehicles. This run takes
                one morning back for the people already on them &mdash; the ones
                training at 5 am because that is the only cool hour, the ones who
                run with a club because training alone is harder, and the ones
                who have never run a lap but would start if the start line felt
                reachable.
              </p>
              <p>
                We picked three distances deliberately. A 3 km that a whole family
                can finish, a 5 km that a first-timer can be proud of, and a 10 km
                that rewards the people already training. Nobody is asked to
                stretch further than they planned to.
              </p>

              <h2>What we commit to</h2>
              <ul>
                <li>Publish every result, with the timing method stated in advance.</li>
                <li>Issue a certificate you can actually download and use.</li>
                <li>
                  Print the ambulance and medical helpline number on every bib.
                </li>
                <li>
                  State a refund timeline before you pay, not after you ask.
                </li>
              </ul>
              <p>
                What we will not do is publish a claim we cannot prove. No
                certification badges we have not earned, no participant count we
                have not hit, no prize money we cannot pay.
              </p>
            </div>

            <div className="stack">
              <PhotoFrame photo={heroPhoto} sizes="(max-width: 768px) 100vw, 45vw" />
              <p className="hint">
                Our first year has no archive yet. Once we have run, this space
                carries the photos, the numbers and the honest post-mortem.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--surface">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="section-head__eyebrow">The people</p>
              <h2>Who organises this</h2>
            </div>
            <p>
              Named organisers with real roles are the strongest trust signal a
              first-year event has. Ours are being added as they are confirmed.
            </p>
          </div>

          {eventConfig.organisers.length === 0 ? (
            <div className="grid grid--3">
              {[0, 1, 2].map((slot) => (
                <div className="card" key={slot}>
                  <div className="photo-frame" style={{ aspectRatio: "1 / 1" }}>
                    <div className="photo-missing">
                      <span className="placeholder">
                        <strong>Organiser {slot + 1}:</strong> name, photo and role
                      </span>
                    </div>
                  </div>
                  <h3 className="card__title">
                    <Placeholder>Full name</Placeholder>
                  </h3>
                  <p>
                    <Placeholder>Role in the organising team</Placeholder>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid--3">
              {eventConfig.organisers.map((person) => (
                <div className="card" key={person.name}>
                  {person.photo ? (
                    <PhotoFrame
                      photo={{
                        src: person.photo,
                        alt: `${person.name}, ${person.role ?? "organiser"}`,
                        caption: "",
                        credit: null,
                      }}
                      ratio="1 / 1"
                    />
                  ) : null}
                  <h3 className="card__title">{person.name}</h3>
                  <p>{person.role}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid--2">
            <div className="prose">
              <h2>Our story so far</h2>
              <p>
                This is our first event. There is no history to tell yet, only a
                plan: put on one road race that Delhi runners can trust, publish
                everything we promise, and come back next year with better
                marshalling than we had this time.
              </p>
              <h2>Cause and charity</h2>
              <p>
                We have not committed a percentage of the entry fee to a charity.
                If we do, we will name the partner and publish the amount raised
                after the event.
              </p>
              <Placeholder block>
                Charity partner, cause, or a plain statement that this is a
                for-profit community event with no charity component.
              </Placeholder>
            </div>

            <div className="card">
              <h3 className="card__title">Impact we are aiming for</h3>
              <ul className="spec-list">
                <li>
                  <span className="spec-list__key">Target runners</span>
                  <Placeholder>Number, once set</Placeholder>
                </li>
                <li>
                  <span className="spec-list__key">First-time finishers</span>
                  <Placeholder>Number, once set</Placeholder>
                </li>
                <li>
                  <span className="spec-list__key">Clubs involved</span>
                  <Placeholder>Number, once set</Placeholder>
                </li>
                <li>
                  <span className="spec-list__key">Volunteers</span>
                  <Placeholder>Number, once set</Placeholder>
                </li>
              </ul>
              <p className="hint">
                Targets, not results. We publish what we actually achieved after
                the event, whatever it is.
              </p>
              <div className="card__foot cluster">
                <Link className="btn btn--primary" href="/volunteer">
                  Volunteer with us
                </Link>
                <Link className="btn btn--ghost" href="/contact">
                  Ask us something
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
