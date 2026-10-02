"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { primaryNav } from "@/config/site";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".site-header");
    if (!header) return;
    const apply = () => {
      document.documentElement.style.setProperty(
        "--header-h",
        `${header.getBoundingClientRect().bottom}px`,
      );
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(header);
    window.addEventListener("resize", apply);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isCurrent = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <>
      <button
        type="button"
        className="btn btn--sm btn--ghost nav-toggle"
        aria-expanded={open}
        aria-controls="primary-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true">{open ? "Close" : "Menu"}</span>
      </button>

      <nav
        id="primary-navigation"
        className="nav"
        data-open={open}
        aria-label="Primary"
      >
        <ul className="nav__list">
          {primaryNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="nav__link"
                onClick={() => setOpen(false)}
                aria-current={isCurrent(item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/about"
              className="nav__link"
              onClick={() => setOpen(false)}
              aria-current={isCurrent("/about") ? "page" : undefined}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="nav__link"
              onClick={() => setOpen(false)}
              aria-current={isCurrent("/contact") ? "page" : undefined}
            >
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
