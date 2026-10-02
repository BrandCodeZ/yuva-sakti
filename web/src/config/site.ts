import { eventConfig } from "@/config/event";

export const site = {
  /** Absolute origin. Set NEXT_PUBLIC_SITE_URL in production. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  name: eventConfig.name,
  tagline: eventConfig.tagline,
  description:
    "Yuva Shakti Run is a Delhi road race across 10 KM, 5 KM and 3 KM, organised by and for the city's running community. Race details, route, kit and registration.",
  locale: "en_IN",
  lang: "en",
} as const;

export interface NavItem {
  href: string;
  label: string;
  /** Shown in the primary bar. Extra items move into the "More" menu. */
  primary?: boolean;
}

export const primaryNav: NavItem[] = [
  { href: "/races", label: "Races", primary: true },
  { href: "/route-map", label: "Route Map", primary: true },
  { href: "/participant-guide", label: "Participant Guide", primary: true },
  { href: "/results", label: "Results", primary: true },
  { href: "/faq", label: "FAQ", primary: true },
  { href: "/registration", label: "Registration", primary: true },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Run",
    items: [
      { href: "/races", label: "Race distances" },
      { href: "/route-map", label: "Route map" },
      { href: "/participant-guide", label: "Participant guide" },
      { href: "/registration", label: "Registration" },
      { href: "/rules", label: "Rules & policies" },
    ],
  },
  {
    title: "About",
    items: [
      { href: "/about", label: "About us" },
      { href: "/updates", label: "Updates" },
      { href: "/gallery", label: "Gallery" },
      { href: "/sponsors", label: "Sponsors & partners" },
      { href: "/volunteer", label: "Volunteer" },
    ],
  },
  {
    title: "Help",
    items: [
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact us" },
      { href: "/results", label: "Results & certificate" },
    ],
  },
  {
    title: "Legal",
    items: [
      { href: "/privacy", label: "Privacy policy" },
      { href: "/terms", label: "Terms & waiver" },
      { href: "/refund-policy", label: "Refund policy" },
    ],
  },
];
