import type { MetadataRoute } from "next";
import { site } from "@/config/site";

/** Every indexable page has its own URL. Results stays listed but unindexed
 *  until published, via the route's own robots rule. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" | "yearly" }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/races", priority: 0.9, changeFrequency: "weekly" },
    { path: "/registration", priority: 0.9, changeFrequency: "weekly" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/route-map", priority: 0.7, changeFrequency: "weekly" },
    { path: "/participant-guide", priority: 0.8, changeFrequency: "weekly" },
    { path: "/rules", priority: 0.6, changeFrequency: "monthly" },
    { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
    { path: "/sponsors", priority: 0.5, changeFrequency: "monthly" },
    { path: "/gallery", priority: 0.5, changeFrequency: "weekly" },
    { path: "/volunteer", priority: 0.6, changeFrequency: "monthly" },
    { path: "/results", priority: 0.8, changeFrequency: "daily" },
    { path: "/updates", priority: 0.6, changeFrequency: "daily" },
    { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
    { path: "/refund-policy", priority: 0.3, changeFrequency: "yearly" },
  ];

  return pages.map((page) => ({
    url: `${site.url}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
