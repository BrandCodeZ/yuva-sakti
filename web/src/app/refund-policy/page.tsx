export const metadata = {
  title: "Refund policy",
  description:
    "When a Yuva Shakti Run entry fee is refunded, how long a refund takes, and what happens if the event is cancelled or postponed.",
  alternates: { canonical: "/refund-policy" },
};

const TIERS = [
  {
    when: "More than 30 days before race day",
    amount: "100% of the entry fee",
    note: "Cancelled from your own account. Admin fee, if any, is shown at payment.",
  },
  {
    when: "15 to 30 days before race day",
    amount: "75% of the entry fee",
    note: "Because the bib, timing chip and volunteer shifts are already committed.",
  },
  {
    when: "7 to 14 days before race day",
    amount: "50% of the entry fee",
    note: "Kit is usually manufactured by this point.",
  },
  {
    when: "Less than 7 days before race day",
    amount: "No refund",
    note: "The entry cannot be resold and the slot goes to the waitlist.",
  },
];

export default function RefundPolicyPage() {
  return (
    <>
      <header className="page-head">
        <div className="container page-head__inner">
          <p className="section-head__eyebrow">Legal</p>
          <h1>Refund policy</h1>
          <p className="lede">
            Published before you pay, not after you ask. If the event is cancelled
            or postponed by us, you get your fee back in full.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container--narrow prose">
          <div className="notice">
            <div>
              <strong>Status: draft, pending legal review and fee approval</strong>
              The percentages below are a proposal. The final table, including any
              admin fee, is published before registration opens and is what appears
              on your payment page.
            </div>
          </div>

          <h2>If we cancel or postpone the event</h2>
          <p>
            You get your entry fee back in full, minus only a third-party charge we
            can evidence and show you, such as a non-refundable payment gateway
            charge. If you want the entry moved to the next edition instead of a
            refund, tell us and we will transfer it.
          </p>

          <h2>If you cancel</h2>
          <p>
            Email us from the address on your registration with your registration
            ID. Cancellations are counted from the race date, in IST, and a
            cancellation is effective when we acknowledge it by email.
          </p>

          <div className="table-wrap" style={{ marginBlock: "1.5rem" }}>
            <table>
              <caption>Refund on your own cancellation, counted back from race day.</caption>
              <thead>
                <tr>
                  <th scope="col">When you cancel</th>
                  <th scope="col">You get back</th>
                  <th scope="col">Why</th>
                </tr>
              </thead>
              <tbody>
                {TIERS.map((tier) => (
                  <tr key={tier.when}>
                    <th scope="row">{tier.when}</th>
                    <td>{tier.amount}</td>
                    <td>{tier.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Transfers and name changes</h2>
          <p>
            You can change the name on an entry up to 7 days before race day if you
            need to, once, free of charge, because IDs are checked against the
            bib. After that we cannot change it.
          </p>
          <p>
            Passing your entry to another runner is a transfer, not a name change.
            Transfers need our written approval before the event and are not
            guaranteed, because the count affects bib allocation and catering.
          </p>

          <h2>How long a refund takes</h2>
          <ul>
            <li>Approved within 7 working days of our acknowledgement.</li>
            <li>
              Credited to the original payment method in 5 to 10 working days
              afterwards, depending on your bank.
            </li>
            <li>
              UPI refunds are usually faster. We do not refund to a different
              account, UPI ID or person.
            </li>
          </ul>
          <p>
            We will not respond to refund requests on social media. Email is the
            record.
          </p>

          <h2>What is never refunded</h2>
          <ul>
            <li>Duplicate registrations made by the same person.</li>
            <li>Entries withdrawn after the last cut-off, because the slot was filled.</li>
            <li>Travel and accommodation you booked yourself.</li>
            <li>Kit already manufactured, once kit has shipped.</li>
          </ul>

          <h2>Payment fees</h2>
          <p>
            Payment gateway charges are shown before you pay. If we cancel the
            event, we absorb them where we can and show you any amount we cannot.
          </p>
        </div>
      </section>
    </>
  );
}
