/**
 * THE ONE FILE YOU EDIT WHEN THE DATE AND VENUE ARE CONFIRMED.
 * ---------------------------------------------------------------------------
 * Every date- or venue-dependent thing on the site reads from here, so turning
 * the announcement on is a single edit: set `eventDate` (ISO 8601 with the
 * +05:30 IST offset) and `venueName`, then fill `eventStartTime`,
 * `venueAddress` and flip `registrationOpen` to true.
 *
 * Hard rules for this file:
 *  - `null` means "not confirmed yet". The UI never invents a replacement.
 *  - No date, flag-off time, fee, prize, timing method or participant count
 *    may be written here unless it is confirmed by the organiser.
 *  - Keep the +05:30 offset. The countdown must run on IST regardless of where
 *    the visitor's browser is.
 */

export interface Organiser {
  name: string | null;
  role: string | null;
  photo: string | null;
}

export interface Sponsor {
  name: string | null;
  logo: string | null;
  /** "light" logos are for dark surfaces and vice versa. Both variants needed. */
  logoDark: string | null;
  url: string | null;
  tier: "title" | "co" | "community" | "support";
}

export interface Update {
  /** ISO date, e.g. "2026-09-14". */
  date: string;
  title: string;
  body: string;
}

export interface KitItem {
  label: string;
  /** false while an item is promised but not yet confirmed with the supplier. */
  confirmed: boolean;
}

export interface Race {
  id: "10k" | "5k" | "3k";
  name: string;
  /** Metres. Real distance, never rounded marketing numbers. */
  distanceMetres: number;
  summary: string;
  format: string | null;
  /** "timed" | "fun-run" | null while undecided. */
  timingMethod: "timed" | "fun-run" | null;
  minAge: number | null;
  maxAge: number | null;
  /** Rupees, or null until the fee is fixed. */
  fee: number | null;
  cutOffMinutes: number | null;
  /** null until the route is surveyed and published. */
  routeNote: string | null;
  startFinish: string | null;
  waterPoints: number | null;
  medicalPoints: number | null;
  elevationGainMetres: number | null;
  surface: string | null;
  /** Set once a separately-timed wave is agreed (e.g. "6:30 AM wave"). */
  flagOff: string | null;
}

export interface EventConfig {
  name: string;
  tagline: string;
  shortName: string;
  city: string;
  state: string;
  country: string;
  /** Absolute start instant in IST, or null until announced. */
  eventDate: string | null;
  /** Local IST clock time for the first flag-off, e.g. "06:30". Null until confirmed. */
  eventStartTime: string | null;
  venueName: string | null;
  venueAddress: string | null;
  venueMapUrl: string | null;
  /** Master switch for paid registration and the payment step. */
  registrationOpen: boolean;
  /** Master switch for everything after race day. */
  resultsPublished: boolean;
  galleryPublished: boolean;
  routePublished: boolean;
  pricingPublished: boolean;
  accessibilityCategory: boolean;
  domain: string;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  /** Ambulance / medical helpline printed on race bibs and the site footer. */
  emergencyNumber: string | null;
  medicalPartner: string | null;
  responseTimeNote: string;
  organisers: Organiser[];
  sponsors: Sponsor[];
  updates: Update[];
  kit: KitItem[];
  races: Race[];
  instagramHandle: string;
  instagramUrl: string;
}

export const eventConfig: EventConfig = {
  name: "Yuva Shakti Run",
  shortName: "Yuva Shakti",
  tagline: "Strong Youth, Strong Nation",
  city: "Delhi",
  state: "Delhi",
  country: "India",

  // ---------------------------------------------------------------- TBA ----
  eventDate: null,
  eventStartTime: null,
  venueName: null,
  venueAddress: null,
  venueMapUrl: null,
  registrationOpen: false,

  // ------------------------------------------------------- post-event -----
  resultsPublished: false,
  galleryPublished: false,
  routePublished: false,
  pricingPublished: false,

  // Set true only when a differently-abled category actually exists.
  accessibilityCategory: false,

  domain: "yuvashaktirun.in",
  email: null,
  phone: null,
  whatsapp: null,
  emergencyNumber: null,
  medicalPartner: null,
  responseTimeNote: "We reply to every message within 2 working days.",

  organisers: [],
  sponsors: [],
  updates: [],

  kit: [
    { label: "Race bib with your registration ID", confirmed: false },
    { label: "Event T-shirt", confirmed: false },
    { label: "Finisher medal", confirmed: false },
    { label: "Participation certificate", confirmed: false },
    { label: "Refreshments at the finish line", confirmed: false },
  ],

  races: [
    {
      id: "10k",
      name: "10 KM",
      distanceMetres: 10000,
      summary:
        "The full Yuva Shakti distance. Long enough to test you, short enough to run after work.",
      format: null,
      timingMethod: null,
      minAge: null,
      maxAge: null,
      fee: null,
      cutOffMinutes: null,
      routeNote: null,
      startFinish: null,
      waterPoints: null,
      medicalPoints: null,
      elevationGainMetres: null,
      surface: null,
      flagOff: null,
    },
    {
      id: "5k",
      name: "5 KM",
      distanceMetres: 5000,
      summary:
        "A fast, flat 5 km for first-timers and anyone chasing a personal best.",
      format: null,
      timingMethod: null,
      minAge: null,
      maxAge: null,
      fee: null,
      cutOffMinutes: null,
      routeNote: null,
      startFinish: null,
      waterPoints: null,
      medicalPoints: null,
      elevationGainMetres: null,
      surface: null,
      flagOff: null,
    },
    {
      id: "3k",
      name: "3 KM",
      distanceMetres: 3000,
      summary:
        "A fun, family-friendly 3 km. Walk, run, bring your parents, bring your kids.",
      format: null,
      timingMethod: null,
      minAge: null,
      maxAge: null,
      fee: null,
      cutOffMinutes: null,
      routeNote: null,
      startFinish: null,
      waterPoints: null,
      medicalPoints: null,
      elevationGainMetres: null,
      surface: null,
      flagOff: null,
    },
  ],

  instagramHandle: "@yuvashaktirun",
  instagramUrl: "https://www.instagram.com/yuvashaktirun/",
};

export const EVENT_TIME_ZONE = "Asia/Kolkata";
