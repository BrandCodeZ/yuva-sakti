"use client";

import { useState } from "react";
import { submitForm } from "@/lib/api";
import { FormStatus, Honeypot, TextField } from "./fields";

/**
 * The "Notify me" capture used while the date is still TBA (spec section 4).
 * Collects the minimum: an email address and the distance the visitor cares about.
 */
export function NotifyForm() {
  const [email, setEmail] = useState("");
  const [race, setRace] = useState("");
  const [trap, setTrap] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(
    null,
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);

    const result = await submitForm("/api/notify", { email, preferredRace: race });
    setPending(false);

    if (result.ok) {
      setEmail("");
      setRace("");
      setMessage({ tone: "success", text: result.message });
      return;
    }
    setMessage({
      tone: "error",
      text: result.fieldErrors?.email ?? result.message,
    });
  }

  return (
    <form className="notify-form" onSubmit={onSubmit} noValidate>
      <div className="notify-form__row">
        <TextField
          name="email"
          label="Email address"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={setEmail}
          required
        />
        <button className="btn btn--primary notify-form__button" type="submit" disabled={pending}>
          {pending ? "Saving…" : "Notify me"}
        </button>
      </div>
      <p className="hint">
        One email when the date is locked. No follow-up spam — see the{" "}
        <a href="/privacy">privacy policy</a>.
      </p>
      <Honeypot value={trap} onChange={setTrap} />
      <FormStatus tone={message?.tone ?? null}>{message?.text}</FormStatus>
    </form>
  );
}
