export const metadata = {
  title: "Terms and waiver",
  description:
    "The terms of entry and participation waiver for Yuva Shakti Run, Delhi: eligibility, conduct, timing, medical risk and cancellation.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <header className="page-head">
        <div className="container page-head__inner">
          <p className="section-head__eyebrow">Legal</p>
          <h1>Terms & waiver</h1>
          <p className="lede">
            These are the terms you accept when you register. They are written to be
            read, and they will be reviewed by a lawyer before registration opens.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container--narrow prose">
          <div className="notice">
            <div>
              <strong>Status: draft, pending legal review</strong>
              Do not treat this page as the final contract. The version that applies
              to you is the one attached to your registration confirmation email on
              the day you register.
            </div>
          </div>

          <h2>1. The agreement</h2>
          <p>
            Registering for Yuva Shakti Run creates a contract with the organising
            team under these terms, the refund policy and the privacy policy. If
            you do not accept them, do not register.
          </p>

          <h2>2. Eligibility</h2>
          <p>
            You confirm you can run the distance you have chosen, and that you meet
            the age limit for that distance, which is published before registration
            opens. Entries under 18 require a parent or guardian to complete the
            registration and sign the consent.
          </p>

          <h2>3. Assumption of risk — the waiver</h2>
          <p>
            I understand that running involves a risk of serious injury or death.
            I voluntarily assume all risks associated with my entry, including
            injury to myself, arising from my own fitness or lack of fitness, from
            road and weather conditions, from other participants, from vehicles or
            pedestrians where the course is not closed, and from the actions and
            omissions of any other person.
          </p>
          <p>
            I confirm I am medically fit to run this distance. I have disclosed any
            medical condition, allergy or medication that the medical team should
            know about. I accept that the medical team may treat me in an emergency
            and that I will be billed for emergency treatment at cost.
          </p>

          <h2>4. Conduct</h2>
          <p>
            I agree to follow the code of conduct and the instructions of race
            marshals, medical staff and the race director. I accept that breaking
            the conduct rules may result in disqualification, removal from the
            course, or both, without refund where the breach endangers other
            runners.
          </p>

          <h2>5. Timing, ranking and cut-offs</h2>
          <p>
            The timing method for each distance is published before registration
            opens. I accept that a fun run is not ranked, that a closed cut-off ends
            my run at that checkpoint, and that the published result stands unless I
            query it within 7 days.
          </p>

          <h2>6. Bib and entry</h2>
          <p>
            My bib is personal and not transferable. I accept that using another
            runner&rsquo;s bib voids my time and that transferring an entry without
            written approval voids the entry.
          </p>

          <h2>7. Photographs and media</h2>
          <p>
            I grant the organisers a non-exclusive, royalty-free licence to use
            photographs and video in which I appear, for the promotion and reporting
            of this event, subject to the photography consent choice I make in the
            registration form. If I opt out, the organisers will delete frames on
            request.
          </p>

          <h2>8. Changes and cancellation by the organisers</h2>
          <p>
            We may change the route, timings or format for safety or regulatory
            reasons, or cancel the event entirely. If we cancel or postpone, the
            refund policy applies.
          </p>

          <h2>9. Liability</h2>
          <p>
            To the extent permitted by law, the organisers are not liable for loss
            or damage to personal property, for loss of expected prize or
            appearance fee, or for any indirect loss. Nothing here excludes
            liability that cannot lawfully be excluded.
          </p>

          <h2>10. Governing law</h2>
          <p>
            These terms are governed by the laws of India. Courts in Delhi have
            jurisdiction over any dispute.
          </p>
        </div>
      </section>
    </>
  );
}
