import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Source_Sans_3 } from "next/font/google";
import { OrganizationJsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeScript } from "@/components/theme-script";
import { eventConfig } from "@/config/event";
import { site } from "@/config/site";
import "@/styles/globals.css";

const display = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--next-font-display",
  display: "swap",
});

const body = Source_Sans_3({
  subsets: ["latin"],
  variable: "--next-font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} ${eventConfig.city} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "Delhi run",
    "road race Delhi",
    "10K Delhi",
    "5K Delhi",
    "3K Delhi",
    "Yuva Shakti Run",
    "running event Delhi",
  ],
  authors: [{ name: eventConfig.name }],
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: site.url,
    title: `${site.name} ${eventConfig.city} — ${site.tagline}`,
    description: site.description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "/" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF7F2" },
    { media: "(prefers-color-scheme: dark)", color: "#0F100F" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={site.lang} className={`${display.variable} ${body.variable}`}>
      <head>
        <ThemeScript />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <OrganizationJsonLd />
      </body>
    </html>
  );
}
