"use client";

import type { ReactNode } from "react";

interface BaseProps {
  name: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  required?: boolean;
}

function FieldShell({
  id,
  label,
  hint,
  error,
  optional,
  required,
  children,
}: BaseProps & { id: string; children: ReactNode }) {
  return (
    <div className="field">
      <label className="label" htmlFor={id}>
        {label}
        {optional ? <span className="label__optional"> (optional)</span> : null}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {children}
      {hint ? (
        <span className="hint" id={`${id}-hint`}>
          {hint}
        </span>
      ) : null}
      {error ? (
        <span className="error-text" id={`${id}-error`} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}

export function TextField({
  value,
  onChange,
  type = "text",
  autoComplete,
  inputMode,
  maxLength,
  placeholder,
  ...props
}: BaseProps & {
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  inputMode?: "text" | "tel" | "email" | "numeric" | "decimal" | "search" | "url";
  maxLength?: number;
  placeholder?: string;
}) {
  const id = `f-${props.name}`;
  const describedBy =
    [props.hint ? `${id}-hint` : null, props.error ? `${id}-error` : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <FieldShell {...props} id={id}>
      <input
        className="input"
        id={id}
        name={props.name}
        type={type}
        value={value}
        required={props.required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.value)}
      />
    </FieldShell>
  );
}

export function SelectField({
  value,
  onChange,
  options,
  placeholder,
  ...props
}: BaseProps & {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  const id = `f-${props.name}`;
  const describedBy =
    [props.hint ? `${id}-hint` : null, props.error ? `${id}-error` : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <FieldShell {...props} id={id}>
      <select
        className="select"
        id={id}
        name={props.name}
        value={value}
        required={props.required}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">{placeholder ?? "Select an option"}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function TextAreaField({
  value,
  onChange,
  rows = 5,
  ...props
}: BaseProps & { value: string; onChange: (value: string) => void; rows?: number }) {
  const id = `f-${props.name}`;
  const describedBy =
    [props.hint ? `${id}-hint` : null, props.error ? `${id}-error` : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <FieldShell {...props} id={id}>
      <textarea
        className="textarea"
        id={id}
        name={props.name}
        rows={rows}
        value={value}
        required={props.required}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.value)}
      />
    </FieldShell>
  );
}

export function CheckboxField({
  name,
  checked,
  onChange,
  label,
  error,
  required,
}: {
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: ReactNode;
  error?: string;
  required?: boolean;
}) {
  const id = `f-${name}`;
  return (
    <div className="field">
      <label className="checkbox" htmlFor={id}>
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span>{label}</span>
      </label>
      {error ? (
        <span className="error-text" id={`${id}-error`} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}

/** Bots fill every field they find. Humans never see this one. */
export function Honeypot({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="honeypot" aria-hidden="true">
      <label htmlFor="f-company-website">Company website (leave blank)</label>
      <input
        id="f-company-website"
        name="companyWebsite"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

export function FormStatus({
  tone,
  children,
}: {
  tone: "error" | "success" | null;
  children: ReactNode;
}) {
  return (
    <div
      className="form-status"
      data-tone={tone ?? undefined}
      role={tone === "error" ? "alert" : "status"}
      aria-live={tone === "error" ? "assertive" : "polite"}
      hidden={!children}
    >
      {children}
    </div>
  );
}

export function SubmitButton({
  pending,
  children,
  className = "btn btn--primary btn--lg",
}: {
  pending: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button className={className} type="submit" disabled={pending}>
      {pending ? "Sending…" : children}
    </button>
  );
}
