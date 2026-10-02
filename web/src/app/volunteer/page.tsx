import type { Metadata } from "next";
import { VolunteerForm } from "@/components/forms/volunteer-form";
import { PageHead } from "@/components/page-head";
import { eventConfig } from "@/config/event";

export const metadata: Metadata = {
  title: "Volunteer with us",
  description:
    "Volunteer at Yuva Shakti Run, Delhi: aid stations, course marshalling, registration desk, medical support, photography and social media. Short form, two minutes.",
  alternates: { canonical: "/volunteer" },
};

const ROLES = [
  {
    title: "Aid stations",
    body: "Water, cups and a cheerful voice. The busiest two hours of our day, and the role runners remember.",
  },
  {
    title: "Course marshalling",
    body: "Standing at junctions, guiding runners, keeping the course clear of spectators and vehicles. Training provided.",
  },
  {
    title: "Registration desk",
    body: "Checking IDs, handing over bibs, and being the first friendly face a runner meets.",
  },
  {
    title: "Medical support",
    body: "Qualified responders only. If you are not medically trained, tell us and we will find you another role.",
  },
  {
    title: "Photography and social",
    body: "Photographs along the course, and the Instagram stories that carry the event through race week.",
  },
];

export default function VolunteerPage() {
  return (
    <>
      <PageHead
        eyebrow="Get involved"
        title="Volunteer"
        intro="A road race runs on volunteers, not on money. Two hours of your time on race morning decides whether four hundred people have a good day."
        trail={[
          { name: "Home", path: "/" },
          { name: "Volunteer", path: "/volunteer" },
        ]}
      />

      <section className="section">
        <div className="container stack">
          <div className="notice notice--green">
            <div>
              <strong>What you get</strong>
              A volunteer T-shirt, a food and water voucher for race day, a
              certificate of service, and first refusal on next year&rsquo;s entry.
              We confirm what is included before race week rather than on the
              morning.
            </div>
          </div>

          <div className="grid grid--3">
            {ROLES.map((role) => (
              <article className="card" key={role.title}>
                <h2 className="card__title" style={{ fontSize: "var(--step-1)" }}>
                  {role.title}
                </h2>
                <p className="text-muted">{role.body}</p>
              </article>
            ))}
          </div>

          <div className="sidebar-layout">
            <div className="prose">
              <h2>Sign up</h2>
              <p>
                Two minutes. We will email you a role, a briefing time and a
                contact number. {eventConfig.responseTimeNote}
              </p>
              <p>
                If you are under 18, mention it in the message and we will pair
                you with a team lead.
              </p>
            </div>
            <VolunteerForm />
          </div>
        </div>
      </section>
    </>
  );
}
