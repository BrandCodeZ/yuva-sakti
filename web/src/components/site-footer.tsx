import Link from "next/link";
import { eventConfig } from "@/config/event";
import { footerNav } from "@/config/site";
import { Logo } from "./logo";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="brand">
              <Logo className="brand__mark" />
              <span className="brand__text">
                <span>{eventConfig.name}</span>
                <span className="brand__sub">{eventConfig.tagline}</span>
              </span>
            </Link>

            <p className="footer-blurb">
              A Delhi road race in three distances, organised by people who run
              here every week. {eventConfig.city}, {eventConfig.state}.
            </p>

            <div className="emergency">
              <span>
                <span className="emergency__label">Medical &amp; ambulance helpline</span>
                {eventConfig.emergencyNumber ? (
                  <a
                    className="emergency__number"
                    href={`tel:${eventConfig.emergencyNumber.replace(/\s/g, "")}`}
                  >
                    {eventConfig.emergencyNumber}
                  </a>
                ) : (
                  <span className="placeholder">
                    Helpline number published once our medical partner is signed
                  </span>
                )}
              </span>
              {eventConfig.medicalPartner ? (
                <span className="emergency__partner">
                  Medical partner: {eventConfig.medicalPartner}
                </span>
              ) : null}
            </div>
          </div>

          {footerNav.map((column) => (
            <div className="footer-col" key={column.title}>
              <h3>{column.title}</h3>
              <ul>
                {column.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {year} {eventConfig.name}. All rights reserved.
          </p>
          <div className="cluster">
            {eventConfig.email ? (
              <a href={`mailto:${eventConfig.email}`}>{eventConfig.email}</a>
            ) : (
              <span className="placeholder">Official email to be published</span>
            )}
            {eventConfig.phone ? <a href={`tel:${eventConfig.phone}`}>{eventConfig.phone}</a> : null}
            <a href={eventConfig.instagramUrl} target="_blank" rel="noopener noreferrer">
              Instagram {eventConfig.instagramHandle}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
