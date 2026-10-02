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

const TOPICS = [
  { value: "registration", label: "Registration or an existing entry" },
  { value: "race-day", label: "Race day logistics" },
  { value: "volunteer", label: "Volunteering" },
  { value: "sponsorship", label: "Sponsorship or partnership" },
  { value: "press", label: "Press or media" },
  { value: "medical", label: "Medical or accessibility support" },
  { value: "other", label: "Something else" },
];

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  topic: "",
  message: "",
};

export function ContactForm() {
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

    const result = await submitForm("/api/contact", {
      ...values,
      // The server only accepts a bare 10-digit number.
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
          name="name"
          label="Full name"
          autoComplete="name"
          value={values.name}
          onChange={(value) => set("name", value)}
          error={errors.name}
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
          optional
        />
        <SelectField
          name="topic"
          label="What is this about?"
          value={values.topic}
          onChange={(value) => set("topic", value)}
          options={TOPICS}
          error={errors.topic}
          required
        />
      </div>

      <TextAreaField
        name="message"
        label="Message"
        value={values.message}
        onChange={(value) => set("message", value)}
        error={errors.message}
        hint="Give us your registration ID if your question is about an entry."
        required
      />

      <Honeypot value={trap} onChange={setTrap} />
      <FormStatus tone={status?.tone ?? null}>{status?.text}</FormStatus>

      <div>
        <SubmitButton pending={pending}>Send message</SubmitButton>
      </div>
    </form>
  );
}
