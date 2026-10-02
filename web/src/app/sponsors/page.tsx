import type { Metadata } from "next";
import Image from "next/image";
import { PartnerForm } from "@/components/forms/partner-form";
import { PageHead } from "@/components/page-head";
import { Placeholder } from "@/components/placeholder";
import { eventConfig } from "@/config/event";

export const metadata: Metadata = {
  title: "Sponsors and partners",
  description:
    "Partners of Yuva Shakti Run, Delhi, and how to become one: title, co, community and in-kind partnerships for a first-year road race.",
  alternates: { canonical: "/sponsors" },
};

const TIERS = [
  {
    id: "title",
    title: "Title partner",
    blurb:
      "The name on the event. One partner only, and only for a year that delivers what was promised.",
  },
  {
    id: "co",
    title: "Co-partner",
    blurb:
      "Named across the site and on race collateral. Two slots.",
  },
  {
    id: "community",
    title: "Community partner",
    blurb:
      "Running clubs, gymnasiums, schools and colleges. This tier is about reach, not logo size.",
  },
  {
    id: "support",
    title: "In-kind partner",
    blurb:
      "Water, medical, printing, photography, transport. Often the most useful partner of all.",
  },
] as const;

const BENEFITS = [
  "Your logo and link on this site, in light and dark variants",
  "Mention in the dated updates feed before race day",
  "A runner pack mention, if that suits you",
  "First look at the route and the race plan for your own team",
];

export default function SponsorsPage() {
  return (
    <>
      <PageHead
        eyebrow="Partners"
        title="Sponsors & partners"
        intro="This is our first edition, so the partner wall is empty on purpose. A logo appears here when the agreement is signed, not when it is promised."
        trail={[
          { name: "Home", path: "/" },
          { name: "Sponsors", path: "/sponsors" },
        ]}
      />

      <section className="section">
        <div className="container stack">
          <section aria-labelledby="wall-heading">
            <h2 id="wall-heading">Partner wall</h2>
            {eventConfig.sponsors.length === 0 ? (
              <div className="grid grid--4" style={{ marginTop: "1.25rem" }}>
                {Array.from({ length: 8 }).map((_, index) => (
                  <span className="logo-slot" key={index}>
                    <Placeholder block>
                      {index === 0
                        ? "Title partner logo, light and dark variants"
                        : "Partner logo"}
                    </Placeholder>
                  </span>
                ))}
              </div>
            ) : (
              <div className="logo-wall" style={{ marginTop: "1.25rem" }}>
                {eventConfig.sponsors.map((sponsor) => (
                  <a
                    className="logo-slot"
                    key={sponsor.name}
                    href={sponsor.url ?? "#"}
                    rel="noopener noreferrer"
                  >
                    {sponsor.logo ? (
                      <Image
                        src={sponsor.logo}
                        alt={sponsor.name ?? "Partner"}
                        width={160}
                        height={90}
                      />
                    ) : (
                      sponsor.name
                    )}
                  </a>
                ))}
              </div>
            )}
          </section>

          <section aria-labelledby="tiers-heading">
            <h2 id="tiers-heading">Partnership tiers</h2>
            <div className="grid grid--2" style={{ marginTop: "1.25rem" }}>
              {TIERS.map((tier) => (
                <article className="card" key={tier.id}>
                  <h3 className="card__title">{tier.title}</h3>
                  <p className="text-muted">{tier.blurb}</p>
                  <ul className="tick-list" style={{ marginTop: "0.5rem" }}>
                    {BENEFITS.map((benefit) => (
                      <li key={benefit}>{benefit}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
            <p className="text-muted" style={{ marginTop: "1rem", fontSize: "var(--step--1)" }}>
              Sponsorship rates are not published. We quote per edition once the
              budget is built, and we will send you the media plan before you sign
              anything.
            </p>
          </section>
        </div>
      </section>

      <section className="section section--surface">
        <div className="container">
          <div className="sidebar-layout">
            <div className="prose">
              <h2>Become a partner</h2>
              <p>
                Tell us what you have in mind. {eventConfig.responseTimeNote}
              </p>
              <p>
                If you would rather talk first, email{" "}
                {eventConfig.email ? (
                  <a href={`mailto:${eventConfig.email}`}>{eventConfig.email}</a>
                ) : (
                  <Placeholder>Sponsorship email address</Placeholder>
                )}
                .
              </p>
            </div>
            <PartnerForm />
          </div>
        </div>
      </section>
    </>
  );
}
