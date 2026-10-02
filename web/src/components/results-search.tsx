"use client";

import { useState } from "react";
import { apiBase } from "@/lib/api";

const API_BASE = apiBase();

interface ResultRow {
  registrationId: string;
  name: string;
  bib: string;
  distance: string;
  finishTime: string | null;
  netTime: string | null;
  rank: number | null;
  categoryRank: number | null;
  status: "finished" | "dns" | "dnf";
  certificateUrl?: string;
}

export function ResultsSearch() {
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState(false);
  const [rows, setRows] = useState<ResultRow[] | null>(null);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(
    null,
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);
    setRows(null);

    try {
      const response = await fetch(
        `${API_BASE}/api/results?q=${encodeURIComponent(query.trim())}`,
      );
      const body = (await response.json()) as {
        data?: ResultRow[];
        message?: string;
      };

      if (!response.ok) {
        setMessage({ tone: "error", text: body.message ?? "Search failed." });
        return;
      }

      if (!body.data || body.data.length === 0) {
        setMessage({
          tone: "error",
          text: "No finisher matches that. Try the bib number from your bib, or check the spelling on your registration.",
        });
        return;
      }

      setRows(body.data);
    } catch {
      setMessage({
        tone: "error",
        text: "We could not reach the results server. Please try again in a moment.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="stack" onSubmit={onSubmit}>
      <div className="notify-form__row">
        <div className="field">
          <label className="label" htmlFor="result-query">
            Bib number or name
          </label>
          <input
            className="input"
            id="result-query"
            type="search"
            value={query}
            placeholder="YSR-00421 or your full name"
            onChange={(event) => setQuery(event.target.value)}
            required
          />
        </div>
        <button className="btn btn--primary notify-form__button" type="submit" disabled={pending}>
          {pending ? "Searching…" : "Search results"}
        </button>
      </div>

      {message ? (
        <div className="form-status" data-tone={message.tone} role="alert">
          {message.text}
        </div>
      ) : null}

      {rows ? (
        <ul className="stack" style={{ listStyle: "none", padding: 0 }}>
          {rows.map((row) => (
            <li className="result-card" key={row.registrationId}>
              <p className="text-muted" style={{ fontSize: "var(--step--1)" }}>
                {row.distance} · Bib {row.bib} · {row.registrationId}
              </p>
              <h3 style={{ textTransform: "none", fontFamily: "var(--font-body)", fontSize: "var(--step-1)", fontWeight: 700 }}>
                {row.name}
              </h3>
              {row.status === "finished" ? (
                <>
                  <p className="result-card__time">{row.finishTime}</p>
                  <p>
                    Overall rank {row.rank ?? "—"}
                    {row.categoryRank ? ` · Category rank ${row.categoryRank}` : ""} ·
                    Net time {row.netTime ?? "—"}
                  </p>
                  {row.certificateUrl ? (
                    <p>
                      <a
                        className="btn btn--green"
                        href={`${API_BASE}${row.certificateUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open certificate
                      </a>
                    </p>
                  ) : null}
                </>
              ) : (
                <p>
                  <span className="badge">
                    {row.status === "dns" ? "Did not start" : "Did not finish"}
                  </span>
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </form>
  );
}
