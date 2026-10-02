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

const TIERS = [
  { value: "title", label: "Title partner" },
  { value: "co", label: "Co-partner" },
  { value: "community", label: "Community partner" },
  { value: "support", label: "In-kind / support partner" },
];

const EMPTY = {
  organisation: "",
  contactName: "",
  email: "",
  phone: "",
  tier: "",
  message: "",
};

export function PartnerForm() {
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

    const result = await submitForm("/api/partners", {
      ...values,
      phone: values.phone ? normaliseMobile(values.phone) : "",
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
          name="organisation"
          label="Organisation"
          autoComplete="organization"
          value={values.organisation}
          onChange={(value) => set("organisation", value)}
          error={errors.organisation}
          required
        />
        <TextField
          name="contactName"
          label="Your name"
          autoComplete="name"
          value={values.contactName}
          onChange={(value) => set("contactName", value)}
          error={errors.contactName}
          required
        />
        <TextField
          name="email"
          label="Work email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={values.email}
          onChange={(value) => set("email", value)}
          error={errors.email}
          required
        />
        <TextField
          name="phone"
          label="Phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={(value) => set("phone", value)}
          error={errors.phone}
          optional
        />
        <SelectField
          name="tier"
          label="Partnership tier you have in mind"
          value={values.tier}
          onChange={(value) => set("tier", value)}
          options={TIERS}
          error={errors.tier}
          required
        />
      </div>

      <TextAreaField
        name="message"
        label="What would you like to do with the event?"
        rows={5}
        value={values.message}
        onChange={(value) => set("message", value)}
        error={errors.message}
        required
      />

      <Honeypot value={trap} onChange={setTrap} />
      <FormStatus tone={status?.tone ?? null}>{status?.text}</FormStatus>

      <div>
        <SubmitButton pending={pending}>Send partnership enquiry</SubmitButton>
      </div>
    </form>
  );
}
