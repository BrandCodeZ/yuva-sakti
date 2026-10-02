import Link from "next/link";
import { primaryNav } from "@/config/site";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="section">
      <div className="container--narrow stack">
        <p className="section-head__eyebrow">404</p>
        <h1>That page is not here</h1>
        <p className="lede">
          The link may be old, or the page may have moved. Race information lives
          under a handful of pages, all linked below.
        </p>
        <nav aria-label="Site sections">
          <ul className="cluster" style={{ listStyle: "none", padding: 0 }}>
            {[{ href: "/", label: "Home" }, ...primaryNav, { href: "/contact", label: "Contact" }].map(
              (item) => (
                <li key={item.href}>
                  <Link className="btn btn--sm btn--ghost" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>
      </div>
    </section>
  );
}
