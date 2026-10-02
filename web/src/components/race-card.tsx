import Link from "next/link";
import type { Race } from "@/config/event";
import {
  formatDistance,
  formatDuration,
  formatElevation,
  formatFee,
  formatFlagOff,
} from "@/lib/event-state";
import { Placeholder } from "./placeholder";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <li>
      <span className="spec-list__key">{label}</span>
      <span>{value ?? "—"}</span>
    </li>
  );
}

/** "To be announced" only when it genuinely is. Never a guess. */
function Tba({ children }: { children: React.ReactNode }) {
  return <span className="text-muted">{children}</span>;
}

export function RaceSpecs({ race }: { race: Race }) {
  const age =
    race.minAge === null && race.maxAge === null
      ? null
      : race.maxAge === null
        ? `${race.minAge} years and above`
        : race.minAge === null
          ? `up to ${race.maxAge} years`
          : race.minAge === race.maxAge
            ? `${race.minAge} years`
            : `${race.minAge}–${race.maxAge} years`;

  return (
    <ul className="spec-list">
      <Row
        label="Distance"
        value={
          <>
            {formatDistance(race.distanceMetres)}
            {race.surface ? <Tba> · {race.surface}</Tba> : null}
          </>
        }
      />
      <Row
        label="Format"
        value={race.format ?? <Tba>Format to be announced</Tba>}
      />
      <Row
        label="Timing"
        value={
          race.timingMethod ? (
            race.timingMethod === "timed"
              ? "Chip-timed"
              : "Fun run — no chip, no ranking"
          ) : (
            <Tba>Timing method to be announced</Tba>
          )
        }
      />
      <Row label="Flag-off" value={formatFlagOff(race.flagOff) ?? <Tba>To be announced</Tba>} />
      <Row label="Eligibility" value={age ?? <Tba>Age rules to be announced</Tba>} />
      <Row
        label="Cut-off"
        value={formatDuration(race.cutOffMinutes) ?? <Tba>To be announced</Tba>}
      />
      <Row
        label="Elevation"
        value={formatElevation(race.elevationGainMetres) ?? <Tba>To be announced</Tba>}
      />
      <Row
        label="Fee"
        value={
          formatFee(race.fee) ??
          (race.fee === null ? <Tba>Fee not fixed yet</Tba> : null)
        }
      />
    </ul>
  );
}

export function RaceCard({ race, index }: { race: Race; index: number }) {
  const fee = formatFee(race.fee);

  return (
    <article className="card race-card">
      <div>
        <span className="race-card__distance">{formatDistance(race.distanceMetres)}</span>
        <p className="text-muted" style={{ marginTop: "0.5rem", fontSize: "var(--step--1)" }}>
          {race.summary}
        </p>
      </div>

      <RaceSpecs race={race} />

      <div className="card__foot cluster">
        <span className="race-card__price">
          {fee ?? <Placeholder>Fee to be announced</Placeholder>}
        </span>
      </div>

      <div className="card__foot">
        <Link
          className="btn btn--primary btn--block"
          href={`/registration?race=${race.id}`}
        >
          Register for {formatDistance(race.distanceMetres)}
          <span className="visually-hidden"> — option {index + 1}</span>
        </Link>
      </div>
    </article>
  );
}
