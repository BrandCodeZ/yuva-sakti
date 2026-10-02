import Link from "next/link";
import { eventConfig } from "@/config/event";
import { site } from "@/config/site";
import {
  TBA_BADGE,
  eventStartInstant,
  formatIstDate,
  formatIstTime,
  registrationOpen,
} from "@/lib/event-state";
import { Countdown } from "./countdown";
import { Logo } from "./logo";
import { Nav } from "./nav";
import { ThemeToggle } from "./theme-toggle";

export function TopBar() {
  const start = eventStartInstant();
  const registerLabel = registrationOpen ? "Register now" : "Register interest";

  return (
    <div className={`topbar${start ? " topbar--live" : ""}`}>
      <div className="container topbar__inner">
        <p className="topbar__status">
          <span className="topbar__dot" aria-hidden="true" />
          {start ? (
            <>
              <span className="nowrap">
                {formatIstDate(start)} &middot; {formatIstTime(start)}
              </span>
              <Countdown targetMs={start.getTime()} variant="bar" />
            </>
          ) : (
            <span className="badge badge--tba">{TBA_BADGE}</span>
          )}
        </p>
        <div className="cluster">
          <a
            className="link-arrow"
            href={eventConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {eventConfig.instagramHandle}
          </a>
          <Link className="btn btn--sm btn--primary" href="/registration">
            {registerLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const registerLabel = registrationOpen ? "Register now" : "Register interest";

  return (
    <>
      <TopBar />
      <header className="site-header">
        <div className="container site-header__inner">
          <Link href="/" className="brand">
            <Logo className="brand__mark" />
            <span className="brand__text">
              <span>{site.name}</span>
              <span className="brand__sub">{site.tagline}</span>
            </span>
          </Link>

          <Nav />

          <div className="header-actions">
            <ThemeToggle />
            <Link className="btn btn--sm btn--primary btn--header" href="/registration">
              {registerLabel}
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
