import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/page-head";
import { eventConfig } from "@/config/event";

export const metadata: Metadata = {
  title: "Rules and policies — eligibility, timing, refunds and disqualification",
  description:
    "The rules for Yuva Shakti Run, Delhi: eligibility and age limits, guardian consent, timing and cut-offs, bib transfer, refunds and cancellation, medical disclaimer, photography consent and disqualification.",
  alternates: { canonical: "/rules" },
};

const SECTIONS = [
  {
    id: "eligibility",
    title: "Eligibility and age limits",
    body: [
      "Age limits are announced with the fee, before registration opens, and they are different per distance. We do not guess them now.",
      "Anyone taking part must be able to run 5 km without stopping. If you are unsure, start with the 3 km.",
      `A differently-abled category ${eventConfig.accessibilityCategory ? "is offered" : "is planned but not yet confirmed"} for this edition. If it is confirmed, it appears on the Races page before registration opens.`,
    ],
  },
  {
    id: "under-18",
    title: "Runners under 18",
    body: [
      "A runner under 18 needs a parent or guardian to complete the registration and to sign the consent on the waiver.",
      "The guardian must be contactable on the day. We carry a minor-safety plan for the start area and the finish.",
      "Age on race day decides the category, not the age at registration.",
    ],
  },
  {
    id: "timing",
    title: "Timing and cut-offs",
    body: [
      "The timing method for each distance is published before registration opens. A distance described as a fun run is not ranked and not chip-timed, and we will not market it as a timed race.",
      "Each distance may carry its own cut-off. If a cut-off closes, the runner is stopped and recorded as DNS at that checkpoint, and the fact is published.",
      "Timing is recorded at the finish. Provisional results go up first, then confirmed results after a manual check.",
    ],
  },
  {
    id: "bib",
    title: "Bib collection and transfer",
    body: [
      "Your bib is personal. It carries your registration ID and, on it, the medical helpline number.",
      "Bibs cannot be transferred. If you cannot run, another runner may take your place only with our written approval in advance.",
      "Running with someone else's bib means your time is void and both entries are flagged.",
    ],
  },
  {
    id: "refunds",
    title: "Refunds and cancellation",
    body: [
      "The full refund timeline is on its own page and is published before you pay, not after you ask.",
      "If we cancel or postpone the event, you get your fee back in full, minus any unavoidable third-party charge we can evidence.",
      "If you cancel, your refund follows the published timeline.",
    ],
  },
  {
    id: "medical",
    title: "Medical disclaimer and waiver",
    body: [
      "Running is a physical activity and carries a risk of injury. By entering you accept that risk.",
      "You confirm that you are fit to run the distance you have chosen. If you have a medical condition, speak to a doctor before you train, and tell us in the registration form so the medical team knows.",
      "The medical information you give us goes only to the medical team, only to help you on the course.",
      "Emergency treatment may be given to you if the medical team judges it necessary, and you will be billed for it at cost.",
      "This page is written in plain language and is not a substitute for advice from a lawyer. It must be reviewed by one before registration opens.",
    ],
  },
  {
    id: "photography",
    title: "Photography consent",
    body: [
      "Photographers work along the course and at the finish. By default we treat your appearance in those frames as consent to use them for the event's own promotion.",
      "The registration form asks for a separate photography choice, and an opt-out is honoured: tell the photographer and the frame is deleted.",
      "If you did not get the choice in the form, email us and we will fix it.",
    ],
  },
  {
    id: "conduct",
    title: "Conduct and disqualification",
    body: [
      "Follow the code of conduct in the participant guide. It is short: no vehicles on course, no dogs, bib visible, move aside when you stop.",
      "A runner can be disqualified for breaking a conduct rule, for a false registration, for taking someone else's bib, or for using performance-enhancing drugs.",
      "Where a rule is unclear, the race director decides before the event, not after a runner complains.",
    ],
  },
  {
    id: "changes",
    title: "Changes to these rules",
    body: [
      "We can change these rules when a safety or authority requirement forces it, and we will post the change on the updates page with a date.",
      "Anything that affects your entry, your fee or your refund is emailed to every affected runner before it takes effect.",
    ],
  },
];

export default function RulesPage() {
  return (
    <>
      <PageHead
        eyebrow="The small print, in plain language"
        title="Rules & policies"
        intro="Written to be read by a runner, not by a lawyer. It still has to be reviewed by one before registration opens, and we will say so when that has happened."
        trail={[
          { name: "Home", path: "/" },
          { name: "Rules & Policies", path: "/rules" },
        ]}
      />

      <section className="section">
        <div className="container">
          <div className="sidebar-layout">
            <nav aria-label="On this page" className="card card--flat sidebar-layout__nav">
              <h2 className="card__title" style={{ fontSize: "var(--step-1)" }}>
                On this page
              </h2>
              <ul className="onthispage">
                {SECTIONS.map((section) => (
                  <li key={section.id}>
                    <a className="link-arrow" href={`#${section.id}`}>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="sections">
              {SECTIONS.map((section) => (
                <section key={section.id} id={section.id} className="section-block">
                  <h2>{section.title}</h2>
                  <div className="prose" style={{ marginTop: "0.75rem" }}>
                    {section.body.map((paragraph) => (
                      <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}

              <div className="notice">
                <div>
                  <strong>Status: draft</strong>
                  This document is a draft written from the specification, not a
                  legal text. It must be reviewed by a lawyer familiar with events
                  held in Delhi before registration opens. Age limits, cut-offs and
                  the refund timeline are marked as open because they are genuinely
                  open.
                </div>
              </div>

              <p className="cluster">
                <Link className="link-arrow" href="/refund-policy">
                  Refund policy in full
                </Link>
                <Link className="link-arrow" href="/privacy">
                  Privacy policy
                </Link>
                <Link className="link-arrow" href="/terms">
                  Terms and waiver
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
