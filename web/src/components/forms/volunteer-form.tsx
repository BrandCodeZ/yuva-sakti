"use client";

import { useState } from "react";
import { normaliseMobile, submitForm } from "@/lib/api";
import {
  FormStatus,
  Honeypot,
  SelectField,
  SubmitButton,
  TextAreaField,
  TextField,
} from "./fields";

const ROLES = [
  { value: "aid-station", label: "Aid station / water point" },
  { value: "marshal", label: "Course marshal" },
  { value: "registration", label: "Registration and bib collection" },
  { value: "medical", label: "Medical support (trained responders only)" },
  { value: "photography", label: "Photography" },
  { value: "social", label: "Social media and content" },
  { value: "anything", label: "Happy to be useful anywhere" },
];

const AVAILABILITY = [
  { value: "full", label: "Both race day and the week before" },
  { value: "race-day", label: "Race day only" },
  { value: "pre-race", label: "The week before only" },
  { value: "remote", label: "Remote help (design, content, calls)" },
];

const EMPTY = {
  name: "",
  phone: "",
  email: "",
  city: "",
  availability: "",
  role: "",
  message: "",
};

export function VolunteerForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [trap, setTrap] = useState("");
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<{ tone: "error" | "success"; text: string } | null>(
    null,
  );

  function set<K extends keyof typeof EMPTY>(key: K, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setStatus(null);
    setErrors({});

    const result = await submitForm("/api/volunteers", {
      ...values,
      phone: normaliseMobile(values.phone),
      companyWebsite: trap,
    });
    setPending(false);

    if (result.ok) {
      setValues(EMPTY);
      setStatus({ tone: "success", text: result.message });
      return;
    }
    if (result.fieldErrors) setErrors(result.fieldErrors);
    setStatus({ tone: "error", text: result.message });
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="form-grid">
        <TextField
          name="name"
          label="Full name"
          autoComplete="name"
          value={values.name}
          onChange={(value) => set("name", value)}
          error={errors.name}
          required
        />
        <TextField
          name="phone"
          label="Mobile number"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="98765 43210"
          value={values.phone}
          onChange={(value) => set("phone", value)}
          error={errors.phone}
          required
        />
        <TextField
          name="email"
          label="Email address"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={values.email}
          onChange={(value) => set("email", value)}
          error={errors.email}
          optional
        />
        <TextField
          name="city"
          label="Which part of Delhi are you in?"
          placeholder="e.g. Saket"
          value={values.city}
          onChange={(value) => set("city", value)}
          error={errors.city}
          optional
        />
        <SelectField
          name="availability"
          label="When can you help?"
          value={values.availability}
          onChange={(value) => set("availability", value)}
          options={AVAILABILITY}
          error={errors.availability}
          required
        />
        <SelectField
          name="role"
          label="Preferred role"
          value={values.role}
          onChange={(value) => set("role", value)}
          options={ROLES}
          error={errors.role}
          required
        />
      </div>

      <TextAreaField
        name="message"
        label="Anything we should know?"
        rows={4}
        value={values.message}
        onChange={(value) => set("message", value)}
        error={errors.message}
        hint="Medical and marshal roles need training — tell us your experience."
        optional
      />

      <Honeypot value={trap} onChange={setTrap} />
      <FormStatus tone={status?.tone ?? null}>{status?.text}</FormStatus>

      <div>
        <SubmitButton pending={pending}>Sign up to volunteer</SubmitButton>
      </div>
    </form>
  );
}
