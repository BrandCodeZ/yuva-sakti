export const metadata = {
  title: "Privacy policy",
  description:
    "How Yuva Shakti Run collects, uses, stores and deletes your personal data, written to follow India's Digital Personal Data Protection Act, 2023.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <header className="page-head">
        <div className="container page-head__inner">
          <p className="section-head__eyebrow">Legal</p>
          <h1>Privacy policy</h1>
          <p className="lede">
            We collect the least we can, we tell you what it is for, and you can
            ask us to delete it. This policy follows India&rsquo;s Digital Personal
            Data Protection Act, 2023.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container--narrow prose">
          <div className="notice">
            <div>
              <strong>Status: draft, pending review</strong>
              This is written to the Act and to what the site actually does. It
              must be reviewed by a lawyer, and the data fiduciary&rsquo;s contact
              details filled in, before registration opens.
            </div>
          </div>

          <h2>1. Who is collecting your data</h2>
          <p>
            Yuva Shakti Run is the data fiduciary for the personal data described
            in this policy. The contact point for any data request is the official
            email published on the contact page.
          </p>

          <h2>2. What we collect</h2>
          <p>Only what a road race needs to run safely:</p>
          <ul>
            <li>
              <strong>Identity:</strong> name as on your ID, date of birth,
              gender, and a photograph of the ID you show at bib collection.
            </li>
            <li>
              <strong>Contact:</strong> email address, mobile number, city and
              state.
            </li>
            <li>
              <strong>Entry:</strong> distance, T-shirt size, running club or
              institution, registration ID and payment reference.
            </li>
            <li>
              <strong>Safety:</strong> emergency contact name and number, and
              optionally blood group and any medical condition you tell us about.
            </li>
            <li>
              <strong>Technical:</strong> IP address, user agent and timestamps,
              kept for fraud prevention and spam control.
            </li>
          </ul>
          <p>
            We do not collect special category data beyond the health information
            you choose to give us, and we do not collect biometric data.
          </p>

          <h2>3. Why we collect it, and on what basis</h2>
          <ul>
            <li>
              <strong>To enter you in the race</strong> — necessary to perform our
              contract with you under the Digital Personal Data Protection Act,
              2023.
            </li>
            <li>
              <strong>To keep you safe on the course</strong> — sharing your
              emergency contact and any medical information with the race medical
              team, so they can treat you. This is consent.
            </li>
            <li>
              <strong>To send race-day messages</strong> — flag-off times,
              weather decisions, reroutes and results. Consent, withdrawn any time.
            </li>
            <li>
              <strong>To prevent fraud and abuse</strong> — duplicate
              registrations, bots and spam. Legitimate interests.
            </li>
          </ul>

          <h2>4. Who we share it with</h2>
          <ul>
            <li>The race medical team, for your emergency contact and health data.</li>
            <li>Our payment gateway, which handles card or UPI details. We never see or store card numbers.</li>
            <li>
              Service providers who host the site, database and email delivery, on
              our instruction and under confidentiality.
            </li>
            <li>
              Government or police, where we are legally required to — for example,
              a closure permission list.
            </li>
          </ul>
          <p>
            We do not sell personal data, and we do not share it for anyone
            else&rsquo;s marketing.
          </p>

          <h2>5. How long we keep it</h2>
          <ul>
            <li>
              <strong>Registration records:</strong> kept for the race edition plus
              the statutory period required for event records.
            </li>
            <li>
              <strong>Medical information:</strong> held for the race edition only,
              then deleted on request.
            </li>
            <li>
              <strong>Notify-me list:</strong> until the date is announced, then
              either deleted or converted into a registration, whichever you choose.
            </li>
            <li>
              <strong>Contact and volunteer messages:</strong> 24 months.
            </li>
          </ul>

          <h2>6. Your rights</h2>
          <p>
            Under the Act you can ask us to give you a copy of your data, correct
            it, complete it, update it, erase it, or withdraw consent, and you can
            nominate someone to exercise these rights for you. Write to the
            official email with your registration ID. We respond within 30 days.
          </p>
          <p>
            If you are unhappy with our response you can complain to the Data
            Protection Board of India.
          </p>

          <h2>7. Cookies and analytics</h2>
          <p>
            We store your light or dark theme choice in your browser&rsquo;s local
            storage, which never leaves your device. Any analytics we use are
            privacy-friendly and do not build a profile of you across other
            websites. We do not run advertising cookies.
          </p>

          <h2>8. Security</h2>
          <p>
            Data is transmitted over HTTPS, stored in an access-controlled
            database, and reachable only by the organising team. No system is
            perfectly secure; if a breach affects your data we will tell you and
            the relevant authority as the Act requires.
          </p>

          <h2>9. Children</h2>
          <p>
            Runners under 18 need a parent or guardian to register and to consent.
            We collect only what the entry requires and do not knowingly collect
            data from a child without that consent.
          </p>

          <h2>10. Changes to this policy</h2>
          <p>
            If a change affects how we use your data, we email every affected
            runner before it takes effect and update the date at the top of this
            page.
          </p>
        </div>
      </section>
    </>
  );
}
