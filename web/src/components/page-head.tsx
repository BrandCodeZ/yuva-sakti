import Link from "next/link";
import { BreadcrumbJsonLd } from "./json-ld";

export function PageHead({
  eyebrow,
  title,
  intro,
  trail,
  aside,
}: {
  eyebrow?: string;
  title: string;
  intro: React.ReactNode;
  trail: { name: string; path: string }[];
  aside?: React.ReactNode;
}) {
  return (
    <div className="page-head">
      <div className="container page-head__inner">
        <nav aria-label="Breadcrumb">
          <ol className="breadcrumb">
            {trail.map((item, index) => (
              <li key={item.path}>
                {index < trail.length - 1 ? (
                  <>
                    <Link href={item.path}>{item.name}</Link>
                    <span aria-hidden="true"> / </span>
                  </>
                ) : (
                  <span aria-current="page">{item.name}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <div>
          {eyebrow ? <p className="section-head__eyebrow">{eyebrow}</p> : null}
          <h1>{title}</h1>
          <div className="lede" style={{ marginTop: "1rem" }}>
            {intro}
          </div>
        </div>
        {aside}
      </div>
      <BreadcrumbJsonLd trail={trail} />
    </div>
  );
}
