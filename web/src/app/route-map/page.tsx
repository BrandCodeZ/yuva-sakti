import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/page-head";
import { Placeholder } from "@/components/placeholder";
import { eventConfig } from "@/config/event";
import { eventWhenAndWhere, formatDistance } from "@/lib/event-state";

export const metadata: Metadata = {
  title: "Route map — start, finish, water and medical points",
  description:
    "The Yuva Shakti Run route map for 10 KM, 5 KM and 3 KM, with start and finish, water points, medical points, toilets and an elevation note per distance.",
  alternates: { canonical: "/route-map" },
};

const FACILITIES = [
  "Start and finish line",
  "Water points",
  "Medical and first-aid points",
  "Toilets",
  "Baggage deposit",
  "Parking and metro access",
];

export default function RouteMapPage() {
  const published = eventConfig.routePublished && Boolean(eventConfig.venueName);

  return (
    <>
      <PageHead
        eyebrow="Route"
        title="Route map"
        intro="The map is published once the venue is confirmed and the route has been walked end to end. We do not publish a rough sketch and call it a course."
        trail={[
          { name: "Home", path: "/" },
          { name: "Route Map", path: "/route-map" },
        ]}
      />

      <section className="section">
        <div className="container stack">
          {!published ? (
            <div className="notice">
              <div>
                <strong>Route will be published after venue confirmation</strong>
                The venue application determines the start, finish and the roads
                we are permitted to close. Once that is granted we walk the route,
                survey the water and medical point positions, and publish the map
                here with a downloadable PDF at least four weeks before race day.
              </div>
            </div>
          ) : (
            <div className="grid grid--2">
              <div className="photo-frame" style={{ aspectRatio: "4 / 3" }}>
                <div className="photo-missing">
                  <span className="placeholder">
                    <strong>Route map needed:</strong> embedded map image of the
                    approved course
                  </span>
                </div>
              </div>
              <div className="card">
                <h2 className="card__title">Course overview</h2>
                <p>{eventWhenAndWhere()}</p>
                <p className="placeholder" style={{ marginTop: "0.5rem" }}>
                  <strong>Needs input:</strong> route PDF to upload to{" "}
                  <code>public/route/</code>
                </p>
              </div>
            </div>
          )}

          <section aria-labelledby="facilities-heading">
            <h2 id="facilities-heading">Facilities on the course</h2>
            <div className="table-wrap" style={{ marginTop: "1rem" }}>
              <table>
                <caption>
                  Published with the map once the route is approved.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Facility</th>
                    {eventConfig.races.map((race) => (
                      <th scope="col" key={race.id}>
                        {formatDistance(race.distanceMetres)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FACILITIES.map((facility) => (
                    <tr key={facility}>
                      <th scope="row">{facility}</th>
                      {eventConfig.races.map((race) => (
                        <td key={race.id}>
                          <Placeholder>To be published</Placeholder>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section aria-labelledby="elevation-heading">
            <h2 id="elevation-heading">Elevation note per distance</h2>
            <div className="table-wrap" style={{ marginTop: "1rem" }}>
              <table>
                <caption>
                  Measured on the final route, not estimated from a map.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Distance</th>
                    <th scope="col">Elevation gain</th>
                    <th scope="col">Surface</th>
                    <th scope="col">Cut-off</th>
                  </tr>
                </thead>
                <tbody>
                  {eventConfig.races.map((race) => (
                    <tr key={race.id}>
                      <th scope="row">{formatDistance(race.distanceMetres)}</th>
                      <td>
                        {race.elevationGainMetres !== null ? (
                          `${race.elevationGainMetres} m`
                        ) : (
                          <Placeholder>After the walk</Placeholder>
                        )}
                      </td>
                      <td>
                        {race.surface ?? <Placeholder>After the walk</Placeholder>}
                      </td>
                      <td>
                        {race.cutOffMinutes !== null ? (
                          `${race.cutOffMinutes} min`
                        ) : (
                          <Placeholder>To be announced</Placeholder>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="cluster">
            <Link className="link-arrow" href="/participant-guide">
              How to reach the venue on race morning
            </Link>
            <Link className="link-arrow" href="/races">
              Compare the three distances
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
