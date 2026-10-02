import type { Metadata } from "next";
import Link from "next/link";
import { RegistrationForm } from "@/components/forms/registration-form";
import { PageHead } from "@/components/page-head";
import { eventConfig } from "@/config/event";
import { formatFee, registrationOpen } from "@/lib/event-state";

export const metadata: Metadata = {
  title: "Registration",
  description: registrationOpen
    ? `Register for Yuva Shakti Run, Delhi. Choose 10 KM, 5 KM or 3 KM, enter your details and get your registration ID by email.`
    : `Register your interest in Yuva Shakti Run, Delhi. Leave your details and we will email you the moment the date and fee are fixed.`,
  alternates: { canonical: "/registration" },
};

const RACE_OPTIONS = eventConfig.races.map((race) => ({
  id: race.id,
  name: race.name,
}));

export default async function RegistrationPage({
  searchParams,
}: {
  searchParams: Promise<{ race?: string }>;
}) {
  const params = await searchParams;
  const requested = RACE_OPTIONS.find((race) => race.id === params.race)?.id;
  const mode = registrationOpen ? "full" : "interest";

  return (
    <>
      <PageHead
        eyebrow={registrationOpen ? "Registration open" : "Registration not open yet"}
        title={registrationOpen ? "Register" : "Register your interest"}
        intro={
          registrationOpen
            ? "Six short steps. Your answers are saved on this device as you go, and you get a registration reference by email at the end."
            : `The date and venue are being finalised, so paid registration is not open. Leave your details for ${"10 KM, 5 KM or 3 KM"} and we will email you the moment it is.`
        }
        trail={[
          { name: "Home", path: "/" },
          { name: "Registration", path: "/registration" },
        ]}
      />

      <section className="section">
        <div className="container">
          <div className="sidebar-layout">
            <aside className="stack">
              <div className="card card--flat">
                <h2 className="card__title" style={{ fontSize: "var(--step-1)" }}>
                  Fees
                </h2>
                <ul className="spec-list" style={{ marginTop: "0.5rem" }}>
                  {eventConfig.races.map((race) => (
                    <li key={race.id}>
                      <span className="spec-list__key">{race.name}</span>
                      <span>{formatFee(race.fee) ?? "Not fixed yet"}</span>
                    </li>
                  ))}
                </ul>
                <p className="hint">
                  Fees are published here and shown on the payment screen before
                  you pay. We do not collect money for an entry we cannot confirm.
                </p>
              </div>

              <div className="card card--flat">
                <h2 className="card__title" style={{ fontSize: "var(--step-1)" }}>
                  Before you start
                </h2>
                <ul className="tick-list" style={{ marginTop: "0.5rem" }}>
                  <li>Have a photo ID to hand</li>
                  <li>One entry per person per distance</li>
                  <li>A mobile number you will answer on race morning</li>
                  <li>An emergency contact who picks up their phone</li>
                </ul>
                <p className="hint">
                  <Link href="/refund-policy">Read the refund policy</Link> before
                  you pay. <Link href="/rules">Read the rules</Link>.
                </p>
              </div>

              <div className="card card--flat">
                <h2 className="card__title" style={{ fontSize: "var(--step-1)" }}>
                  Need help?
                </h2>
                <p className="text-muted" style={{ fontSize: "var(--step--1)" }}>
                  {eventConfig.responseTimeNote}
                </p>
                <p>
                  <Link className="link-arrow" href="/contact">
                    Contact the organisers
                  </Link>
                </p>
              </div>
            </aside>

            <div>
              <RegistrationForm
                mode={mode}
                defaultDistance={requested}
                distances={RACE_OPTIONS}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
