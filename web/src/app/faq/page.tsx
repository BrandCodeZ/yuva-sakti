import type { Metadata } from "next";
import Link from "next/link";
import { FaqJsonLd } from "@/components/json-ld";
import { PageHead } from "@/components/page-head";
import { ContactForm } from "@/components/forms/contact-form";
import { faqGroups } from "@/content/faq";
import { eventConfig } from "@/config/event";

export const metadata: Metadata = {
  title: "FAQ — registration, race day, kit, safety and results",
  description:
    "Answers about Yuva Shakti Run registration, bib collection, race-day timings, race kit, safety and medical support, and how results and certificates work.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <>
      <PageHead
        eyebrow="Questions"
        title="Frequently asked questions"
        intro="Grouped by what you are trying to find out. If your question is not here, ask us and we will add the answer."
        trail={[
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ]}
      />

      <section className="section">
        <div className="container">
          <nav aria-label="Jump to a section" className="cluster" style={{ marginBottom: "2rem" }}>
            {faqGroups.map((group) => (
              <a key={group.id} className="btn btn--sm btn--ghost" href={`#${group.id}`}>
                {group.title}
              </a>
            ))}
          </nav>

          <div className="grid grid--2" style={{ alignItems: "start" }}>
            {faqGroups.map((group) => (
              <section key={group.id} id={group.id} style={{ scrollMarginTop: "7rem" }}>
                <h2>{group.title}</h2>
                <div className="accordion" style={{ marginTop: "0.75rem" }}>
                  {group.items.map((item) => (
                    <details key={item.q}>
                      <summary>{item.q}</summary>
                      <div className="accordion__body">
                        <p>{item.a}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--surface">
        <div className="container">
          <div className="grid grid--2">
            <div className="prose">
              <h2>Still stuck?</h2>
              <p>
                {eventConfig.responseTimeNote} If your question is about an
                existing entry, put your registration ID in the message and we can
                answer it in one go.
              </p>
              <p>
                <Link className="link-arrow" href="/contact">
                  Contact the organisers
                </Link>
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      <FaqJsonLd groups={faqGroups} />
    </>
  );
}
