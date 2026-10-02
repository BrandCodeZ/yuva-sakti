import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { PageHead } from "@/components/page-head";
import { Placeholder } from "@/components/placeholder";
import { eventConfig } from "@/config/event";
import { eventWhenAndWhere } from "@/lib/event-state";

export const metadata: Metadata = {
  title: "Contact the organisers",
  description: `Contact Yuva Shakti Run, Delhi: official email, phone, WhatsApp, Instagram and a contact form. ${eventConfig.responseTimeNote}`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHead
        eyebrow="Talk to a person"
        title="Contact us"
        intro="Registration questions, race-day logistics, volunteering, press or medical access: one form reaches the person who can actually answer it."
        trail={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />

      <section className="section">
        <div className="container">
          <div className="sidebar-layout">
            <div className="prose">
              <h2>Official channels</h2>
              <ul className="spec-list">
                <li>
                  <span className="spec-list__key">Email</span>
                  {eventConfig.email ? (
                    <a href={`mailto:${eventConfig.email}`}>{eventConfig.email}</a>
                  ) : (
                    <Placeholder>Official email address</Placeholder>
                  )}
                </li>
                <li>
                  <span className="spec-list__key">Phone</span>
                  {eventConfig.phone ? (
                    <a href={`tel:${eventConfig.phone.replace(/\s/g, "")}`}>
                      {eventConfig.phone}
                    </a>
                  ) : (
                    <Placeholder>Official phone number</Placeholder>
                  )}
                </li>
                <li>
                  <span className="spec-list__key">WhatsApp</span>
                  {eventConfig.whatsapp ? (
                    <a
                      href={`https://wa.me/${eventConfig.whatsapp.replace(/[^\d]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {eventConfig.whatsapp}
                    </a>
                  ) : (
                    <Placeholder>WhatsApp number</Placeholder>
                  )}
                </li>
                <li>
                  <span className="spec-list__key">Emergency</span>
                  {eventConfig.emergencyNumber ? (
                    <a
                      href={`tel:${eventConfig.emergencyNumber.replace(/\s/g, "")}`}
                    >
                      {eventConfig.emergencyNumber}
                    </a>
                  ) : (
                    <Placeholder>Ambulance and medical helpline</Placeholder>
                  )}
                </li>
                <li>
                  <span className="spec-list__key">Instagram</span>
                  <a
                    href={eventConfig.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {eventConfig.instagramHandle}
                  </a>
                </li>
                <li>
                  <span className="spec-list__key">Venue</span>
                  {eventConfig.venueName ? (
                    <span>{eventConfig.venueAddress ?? eventConfig.venueName}</span>
                  ) : (
                    <Placeholder>Venue address and map</Placeholder>
                  )}
                </li>
              </ul>

              <p style={{ marginTop: "1.25rem" }}>{eventConfig.responseTimeNote}</p>
              <p className="text-muted" style={{ fontSize: "var(--step--1)" }}>
                When we are: {eventWhenAndWhere()}. The emergency number is
                printed on every bib as well.
              </p>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
