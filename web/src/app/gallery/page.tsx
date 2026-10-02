import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/page-head";
import { PhotoFrame } from "@/components/photo-frame";
import { eventConfig } from "@/config/event";
import { launchPhotos } from "@/content/photos";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photographs from Yuva Shakti Run, Delhi: training runs, the launch meetup, and after the event, race-day photos searchable by bib number.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  const published = eventConfig.galleryPublished;

  return (
    <>
      <PageHead
        eyebrow="Photographs"
        title="Gallery"
        intro="Real photographs only. After the race this page becomes searchable by bib number so you can find your own finish-line frame."
        trail={[
          { name: "Home", path: "/" },
          { name: "Gallery", path: "/gallery" },
        ]}
      />

      <section className="section">
        <div className="container stack">
          <div className="notice">
            <div>
              <strong>
                {published
                  ? "Race-day photos are searchable by bib"
                  : "Pre-race photos only, for now"}
              </strong>
              {published
                ? "Search by bib number or name to find your photograph and download it."
                : "This is a first-year event, so the gallery holds training and launch photographs until race day. We do not use stock run photography to fill it."}
            </div>
          </div>

          <div className="gallery-grid">
            {launchPhotos.map((photo) => (
              <figure key={photo.caption}>
                <PhotoFrame photo={photo} ratio="4 / 3" />
              </figure>
            ))}
          </div>

          {published ? (
            <section aria-labelledby="search-heading">
              <h2 id="search-heading">Find your photograph</h2>
              <form className="notify-form" action="/results" method="get">
                <div className="notify-form__row">
                  <div className="field">
                    <label className="label" htmlFor="photo-bib">
                      Bib number or name
                    </label>
                    <input
                      className="input"
                      id="photo-bib"
                      name="bib"
                      type="search"
                      placeholder="e.g. YSR-00421"
                    />
                  </div>
                  <button className="btn btn--primary notify-form__button" type="submit">
                    Search photos
                  </button>
                </div>
              </form>
            </section>
          ) : null}

          <p className="cluster">
            <Link className="link-arrow" href="/updates">
              See the announcements
            </Link>
            <a
              className="link-arrow"
              href={eventConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              More on Instagram
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
