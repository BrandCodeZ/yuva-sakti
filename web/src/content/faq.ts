export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqGroup {
  id: string;
  title: string;
  items: FaqItem[];
}

export const faqGroups: FaqGroup[] = [
  {
    id: "registration",
    title: "Registration",
    items: [
      {
        q: "How do I register for Yuva Shakti Run?",
        a: "Use the Register button in the header. While the date is being finalised the form records your interest in a distance; once registration opens it becomes the full registration with personal, emergency and consent details. You will get a registration ID by email either way.",
      },
      {
        q: "Can I register for more than one distance?",
        a: "One entry per person per distance. If you want to run both the 5 KM and the 10 KM, register twice with the same email and mobile so we can link the entries to one runner.",
      },
      {
        q: "I registered with the same email before. Is that a problem?",
        a: "No. We match on email and mobile and will merge your entries rather than create a duplicate. If the system flags a conflict, we email you before doing anything to your entry.",
      },
      {
        q: "Do I need to verify my email and mobile?",
        a: "Yes. We send a one-time code to your email and a one-time code by SMS to your mobile. We do not treat an entry as complete until both are verified, because race-day messages depend on both being right.",
      },
      {
        q: "What is the entry fee?",
        a: "Fees are not published yet. The moment the date and venue are locked, the fee for each distance appears on the Races page and in the registration flow before you pay anything.",
      },
      {
        q: "Can I pay by cash or UPI at the venue?",
        a: "Not planned. Online payment only, so that every runner has a confirmed entry and a bib before race morning. If that changes we will post an update.",
      },
    ],
  },
  {
    id: "race-day",
    title: "Race day",
    items: [
      {
        q: "What time do the races start?",
        a: "Flag-off times are not fixed yet. They will be published on the Races and Participant Guide pages at least four weeks before race day, and every runner gets them by email and SMS.",
      },
      {
        q: "Where do I collect my bib?",
        a: "There will be a collection desk, and we plan to keep it open on the evening before and on race morning. The exact dates, timings and what to carry are in the Participant Guide as soon as they are booked.",
      },
      {
        q: "Is there a cut-off time?",
        a: "Each distance will have its own cut-off, published with the route. If a cut-off closes early, we will say so on the results page as well as at the checkpoint.",
      },
      {
        q: "Can I run with my dog?",
        a: "No. Roads closed for the run are not safe for dogs, and we cannot be responsible for an animal on the course.",
      },
      {
        q: "Can I run wearing a costume?",
        a: "Yes, as long as it does not block your bib number, cover your face, or become loose enough to trip another runner. Anything obstructive is turned back at the start.",
      },
    ],
  },
  {
    id: "kit",
    title: "Kit and finish",
    items: [
      {
        q: "What do I get with my entry?",
        a: "A race bib, an event T-shirt, a finisher medal and a participation certificate are the plan. Refreshments at the finish are planned too. Nothing is listed as final until the supplier confirms it, and the kit list on the Participant Guide shows what is confirmed.",
      },
      {
        q: "Do I need to wear the event T-shirt to run?",
        a: "No. Run in whatever you normally run in. The T-shirt is for the finish-line photo and for afterwards.",
      },
      {
        q: "When do I get my certificate?",
        a: "After results are published. Search your bib or name on the Results page and download your certificate as a PDF.",
      },
      {
        q: "Are photos from the run free?",
        a: "Photos of you on the course and at the finish are for our own use and yours, subject to your consent choice in the registration form. If you opted out, tell the photographer and they will delete the frame.",
      },
    ],
  },
  {
    id: "safety",
    title: "Safety",
    items: [
      {
        q: "Is there medical support on the course?",
        a: "Yes. First-aid points are placed along the route and a medical team travels with the course. The ambulance and medical helpline number is printed in the footer of this site and on your bib.",
      },
      {
        q: "I have a medical condition. Can I still run?",
        a: "Tell us in the registration form, and speak to a doctor before you train for the distance. Your information goes only to the medical team, and only so they can help you if something happens on the course.",
      },
      {
        q: "What happens if it rains or is very hot?",
        a: "We publish a go-ahead decision and the revised timings by 6:00 AM on race day by email and SMS, and on this site. Heat and poor air quality are taken as seriously as rain.",
      },
      {
        q: "Is there a differently-abled category?",
        a: "We want one, and it depends on the route we are granted. If a wheelchair or visually impaired category is confirmed, it appears on the Races page before registration opens.",
      },
      {
        q: "Are roads closed during the run?",
        a: "We apply for the closures we need and publish the approved traffic plan with the Participant Guide. If a stretch cannot be closed, we reroute rather than run runners into traffic.",
      },
    ],
  },
  {
    id: "results",
    title: "Results",
    items: [
      {
        q: "When are results published?",
        a: "On race day, once timing is closed and verified. Provisional times go up first, confirmed results after the manual check. Both are on the Results page.",
      },
      {
        q: "How is my finish time measured?",
        a: "The timing method for each distance is published before registration opens, and we state plainly whether a distance is timed or a fun run. We do not describe a fun run as a timed race.",
      },
      {
        q: "My time is wrong. How do I query it?",
        a: "Email your registration ID and the time you think is correct. We re-check the timing sheet and publish a correction if we got it wrong.",
      },
    ],
  },
];

export const faqPreview = faqGroups[0]?.items.slice(0, 4) ?? [];
