"use client";

import { useEffect, useMemo, useState } from "react";

interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const units: { key: keyof Remaining; label: string }[] = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Min" },
  { key: "seconds", label: "Sec" },
];

function remainingUntil(targetMs: number): Remaining {
  const diff = Math.max(0, targetMs - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export function Countdown({
  targetMs,
  variant = "block",
}: {
  /** Absolute epoch milliseconds. Computed on the server so the first paint is right. */
  targetMs: number;
  variant?: "block" | "bar";
}) {
  const [now, setNow] = useState(() => targetMs);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const state = useMemo(() => {
    const diffMs = now - targetMs;
    if (diffMs >= 0 && diffMs < 86_400_000) return "race-day" as const;
    if (diffMs >= 86_400_000) return "results" as const;
    return "counting" as const;
  }, [now, targetMs]);

  if (state === "race-day") {
    return (
      <p className={variant === "bar" ? "countdown-message" : "h2"}>
        Race day is here. See you on the start line.
      </p>
    );
  }

  if (state === "results") {
    return (
      <p className={variant === "bar" ? "countdown-message" : "h2"}>
        Results coming soon. Check the results page.
      </p>
    );
  }

  const left = remainingUntil(targetMs);

  return (
    <div>
      <div
        className="countdown"
        role="timer"
        aria-live="off"
        aria-label={`Time until the first flag-off: ${left.days} days, ${left.hours} hours, ${left.minutes} minutes`}
      >
        {units.map((unit) => (
          <div className="countdown__unit" key={unit.key}>
            <span className="countdown__value">
              {unit.key === "days" ? left.days : pad(left[unit.key])}
            </span>
            <span className="countdown__label">{unit.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
