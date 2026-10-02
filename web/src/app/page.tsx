import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Countdown } from "@/components/countdown";
import { EventJsonLd } from "@/components/json-ld";
import { NotifyForm } from "@/components/forms/notify-form";
import { PhotoFrame } from "@/components/photo-frame";
import { Placeholder } from "@/components/placeholder";
import { RaceCard } from "@/components/race-card";
import { Reveal } from "@/components/reveal";
import { ShareRow } from "@/components/share-row";
import { eventConfig } from "@/config/event";
import { site } from "@/config/site";
import { faqPreview } from "@/content/faq";
import { heroPhoto, chapterPhotos } from "@/content/photos";
import { whyWeRun } from "@/content/why-we-run";
import { googleCalendarUrl } from "@/lib/calendar";
import {
  TBA_BADGE,
  eventStartInstant,
  formatIstDate,
  formatIstTime,
  registrationOpen,
} from "@/lib/event-state";

export const metadata: Metadata = {
  title: `${site.name} ${eventConfig.city} — ${site.tagline}`,
  description: site.description,
  alternates: { canonical: "/" },
};

const quickFacts = [
  { value: "3", label: "Distances: 10 KM, 5 KM, 3 KM" },
  { value: eventConfig.city, label: `${eventConfig.state}, ${eventConfig.country}` },
  { value: "TBA", label: "Date and venue" },
  { value: "All ages", label: "Age rules published before registration" },
];

export default function HomePage() {
  const start = eventStartInstant();
  const registerLabel = registrationOpen ? "Register now" : "Register interest";

  return (
    <>
      <EventJsonLd />

      {/* ------------------------------------------------------------ hero */}
      <section className="hero">
        <div className="hero__media" aria-hidden="true">
          {heroPhoto.src ? (
            <Image
              src={heroPhoto.src}
              alt=""
              fill
              priority
              fetchPriority="high"
              sizes="100vw"
              style={{ objectFit: "cover" }}
            />
          ) : null}
        </div>
        <div className="container hero__inner">
          <p className="hero__tagline">{site.tagline}</p>
          <h1>{eventConfig.name}</h1>

          {start ? (
            <div className="hero__meta">
              <p className="lede">
                {formatIstDate(start)} · {formatIstTime(start)}
                {eventConfig.venueName ? ` · ${eventConfig.venueName}` : ""}
              </p>
            </div>
          ) : (
            <p className="lede">
              {eventConfig.city}, {eventConfig.state}.{" "}
              <span className="badge badge--tba">{TBA_BADGE}</span>
            </p>
          )}

          <div className="cluster">
            <Link className="btn btn--primary btn--lg" href="/registration">
              {registerLabel}
            </Link>
            <Link className="btn btn--ghost btn--lg" href="/races">
              View races
            </Link>
          </div>

          {start ? (
            <div style={{ marginTop: "2.25rem" }}>
              <p className="section-head__eyebrow" style={{ color: "inherit" }}>
                Counting down to flag-off
              </p>
              <Countdown targetMs={start.getTime()} />
              <div className="cluster" style={{ marginTop: "1.25rem" }}>
                <a
                  className="btn btn--sm btn--ghost"
                  href={googleCalendarUrl(start)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Add to calendar
                </a>
                <a className="btn btn--sm btn--ghost" href="/add-to-calendar">
                  Download .ics
                </a>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: "2.5rem", maxWidth: "30rem" }}>
              <p
                className="label"
                style={{ marginBottom: "0.6rem", color: "var(--on-ink)" }}
              >
                Get the date by email
              </p>
              <NotifyForm />
            </div>
          )}

          <div style={{ marginTop: "2rem" }}>
            <ShareRow title={`${site.name} — ${site.tagline}`} />
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- quick facts */}
      <section className="section section--tight">
        <div className="container">
          <Reveal className="stat-strip">
            {quickFacts.map((fact) => (
              <div className="stat" key={fact.label}>
                <span className="stat__value">{fact.value}</span>
                <span className="stat__label">{fact.label}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------ why we run */}
      <section className="section section--surface" id="why-we-run">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="section-head__eyebrow">Why we run</p>
              <h2>Three reasons this race exists</h2>
            </div>
            <p>
              Yuva Shakti means the strength of the young. This run is a Delhi
              street event first and a race second.
            </p>
          </div>

          {whyWeRun.map((chapter, index) => {
            const photo = chapterPhotos[chapter.index];
            return (
              <Reveal
                key={chapter.index}
                as="article"
                className={`chapter ${index === 1 ? "chapter--split" : ""}`}
              >
                <span className="chapter__index" aria-hidden="true">
                  {chapter.index}
                </span>
                <div>
                  <h3>{chapter.title}</h3>
                  <p className="text-muted" style={{ marginTop: "0.75rem", maxWidth: "58ch" }}>
                    {chapter.body}
                  </p>
                </div>
                {photo ? (
                  <PhotoFrame photo={photo} sizes="(max-width: 768px) 100vw, 40vw" />
                ) : null}
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* -------------------------------------------------------- races */}
      <section className="section" id="races">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="section-head__eyebrow">The distances</p>
              <h2>Pick your distance</h2>
            </div>
            <p>
              Every card shows what is confirmed and what is still open. We would
              rather show a gap than fill it with a guess.
            </p>
          </div>

          <div className="grid grid--3">
            {eventConfig.races.map((race, index) => (
              <Reveal key={race.id}>
                <RaceCard race={race} index={index} />
              </Reveal>
            ))}
          </div>

          <p className="text-muted" style={{ marginTop: "1.5rem", fontSize: "var(--step--1)" }}>
            <Link className="link-arrow" href="/races">
              Full race details, timing method and eligibility
            </Link>
          </p>
        </div>
      </section>

      {/* ----------------------------------------------------- what you get */}
      <section className="section section--ink">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="section-head__eyebrow">Race kit</p>
              <h2>What you get</h2>
            </div>
            <p>
              Items are marked as confirmed only once the supplier has confirmed
              them in writing.
            </p>
          </div>

          <div className="grid grid--2">
            <div>
              <ul className="tick-list">
                {eventConfig.kit.map((item) => (
                  <li key={item.label}>{item.label}</li>
                ))}
              </ul>
            </div>
            <div>
              <ul className="tick-list tick-list--pending">
                {eventConfig.kit.map((item) => (
                  <li key={item.label}>{item.label}</li>
                ))}
              </ul>
              <p className="hint" style={{ marginTop: "0.75rem" }}>
                Left: planned kit. Right: confirmed kit. The list grows from the
                right as suppliers sign off.
              </p>
            </div>
          </div>

          <div className="cluster" style={{ marginTop: "2rem" }}>
            <Link className="btn btn--primary" href="/participant-guide">
              Read the participant guide
            </Link>
            <Link className="btn btn--ghost" href="/rules">
              Rules &amp; policies
            </Link>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- updates */}
      <section className="section" id="updates">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="section-head__eyebrow">Latest updates</p>
              <h2>What is happening</h2>
            </div>
            <Link className="link-arrow" href="/updates">
              All updates
            </Link>
          </div>

          {eventConfig.updates.length === 0 ? (
            <div className="notice">
              <div>
                <strong>No announcements yet</strong>
                The date and venue are being finalised. The moment they are
                locked, this feed carries the announcement, and everyone on the
                notify list gets it by email first.
              </div>
            </div>
          ) : (
            <ol className="feed">
              {eventConfig.updates.map((update) => (
                <li key={`${update.date}-${update.title}`}>
                  <time dateTime={update.date}>
                    {new Date(update.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                  <div>
                    <h3 className="feed__title">{update.title}</h3>
                    <p>{update.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      {/* ------------------------------------- partners, instagram, faq */}
      <section className="section section--surface">
        <div className="container">
          <div className="grid grid--2">
            <div>
              <p className="section-head__eyebrow">Partners</p>
              <h2>Who backs the run</h2>
              {eventConfig.sponsors.length === 0 ? (
                <p style={{ marginTop: "1rem" }}>
                  <Placeholder block>
                    Sponsor and partner logos. We publish a partner name only
                    after they sign the agreement.
                  </Placeholder>
                </p>
              ) : (
                <div className="logo-wall" style={{ marginTop: "1.5rem" }}>
                  {eventConfig.sponsors.map((sponsor) => (
                    <span className="logo-slot" key={sponsor.name}>
                      {sponsor.name}
                    </span>
                  ))}
                </div>
              )}
              <p style={{ marginTop: "1.25rem" }}>
                <Link className="link-arrow" href="/sponsors">
                  Partner with us
                </Link>
              </p>
            </div>

            <div>
              <p className="section-head__eyebrow">Instagram</p>
              <h2>{eventConfig.instagramHandle}</h2>
              <p className="text-muted" style={{ marginTop: "0.75rem" }}>
                Training routes, volunteer calls and race-week updates go up on
                Instagram first.
              </p>
              <p style={{ marginTop: "1.25rem" }}>
                <a
                  className="btn btn--ink"
                  href={eventConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Follow {eventConfig.instagramHandle}
                </a>
              </p>
            </div>
          </div>

          <div style={{ marginTop: "clamp(2.5rem, 2rem + 3vw, 4rem)" }}>
            <p className="section-head__eyebrow">Questions</p>
            <h2 style={{ marginBottom: "1.5rem" }}>Before you ask</h2>
            <div className="accordion">
              {faqPreview.map((item) => (
                <details key={item.q}>
                  <summary>{item.q}</summary>
                  <div className="accordion__body">
                    <p>{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
            <p style={{ marginTop: "1.25rem" }}>
              <Link className="link-arrow" href="/faq">
                All questions
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
