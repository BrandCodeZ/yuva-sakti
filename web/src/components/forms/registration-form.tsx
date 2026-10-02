"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { submitForm } from "@/lib/api";
import {
  INDIAN_STATES,
  TSHIRT_SIZES,
  ageOn,
  emailSchema,
  mobileSchema,
  normaliseMobile,
  registrationBaseSchema,
  registrationSchema,
  trimmed,
} from "@/lib/validation";
import {
  CheckboxField,
  FormStatus,
  Honeypot,
  SelectField,
  TextAreaField,
  TextField,
} from "./fields";

const DRAFT_KEY = "ysr-registration-draft";

const DISTANCES: { value: string; label: string }[] = [
  { value: "10k", label: "10 KM" },
  { value: "5k", label: "5 KM" },
  { value: "3k", label: "3 KM" },
 ];

const GENDERS = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "non-binary", label: "Non-binary" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => ({
  value: group,
  label: group,
}));

const HEARD_ABOUT = [
  { value: "instagram", label: "Instagram" },
  { value: "friend", label: "A friend or running club" },
  { value: "school", label: "School, college or university" },
  { value: "poster", label: "Poster or flyer" },
  { value: "search", label: "Search engine" },
  { value: "other", label: "Somewhere else" },
];

type Values = Record<string, string | boolean>;

interface RegistrationFormProps {
  mode: "interest" | "full";
  defaultDistance?: string;
  distances: { id: string; name: string }[];
}

function initialValues(defaultDistance?: string): Values {
  return {
    distance: defaultDistance ?? "",
    tshirtSize: "M",
    fullName: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    mobile: "",
    alternateMobile: "",
    city: "",
    state: "",
    emergencyName: "",
    emergencyMobile: "",
    bloodGroup: "",
    medicalConditions: "",
    club: "",
    hearAbout: "",
    acceptTerms: false,
    photographyConsent: true,
    guardianName: "",
    guardianConsent: false,
    companyWebsite: "",
  };
}

/** zod issues -> { fieldName: first message } */
function toFieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (key && !result[key]) result[key] = issue.message;
  }
  return result;
}

export function RegistrationForm({
  mode,
  defaultDistance,
  distances,
}: RegistrationFormProps) {
  const steps = useMemo(
    () =>
      mode === "full"
        ? [
            { id: "race", label: "Race" },
            { id: "person", label: "You" },
            { id: "safety", label: "Safety" },
            { id: "extras", label: "Extras" },
            { id: "consent", label: "Consent" },
            { id: "review", label: "Review" },
          ]
        : [{ id: "interest", label: "Your interest" }],
    [mode],
  );

  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>(() => initialValues(defaultDistance));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState("");
  const [confirmation, setConfirmation] = useState<RegistrationFormReceipt | null>(
    null,
  );
  const [restored, setRestored] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const stepTopRef = useRef<HTMLDivElement>(null);

  // Autosave so a dropped connection or a closed tab does not lose the entry.
  useEffect(() => {
    if (confirmation) return;
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
    } catch {
      // Storage full or blocked: the form still works, it just will not resume.
    }
  }, [values, confirmation]);

  useEffect(() => {
    if (confirmation) return;
    // Reading localStorage has to happen after hydration: the server has no
    // access to it, and doing it during render would mismatch the markup.
    try {
      const saved = window.localStorage.getItem(DRAFT_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved) as Values;
      const hasContent = Object.values(parsed).some(
        (value) => value !== "" && value !== false,
      );
      if (!hasContent) return;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValues((current) => ({
        ...current,
        ...parsed,
        // The distance from the URL always wins over an old draft.
        distance: current.distance || String(parsed.distance ?? ""),
      }));
      setRestored(true);
    } catch {
      // A corrupt draft is not worth an error message. Start clean.
    }
  }, [confirmation]);

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key as string]) return current;
      const next = { ...current };
      delete next[key as string];
      return next;
    });
  }

  const age = useMemo(() => {
    if (!values.dateOfBirth) return null;
    const dob = new Date(String(values.dateOfBirth));
    if (Number.isNaN(dob.getTime())) return null;
    return ageOn(dob, new Date());
  }, [values.dateOfBirth]);

  const needsGuardian = age !== null && age < 18;

  const stepSchemas = useMemo(
    () => ({
      race: registrationBaseSchema.pick({ distance: true, tshirtSize: true }),
      person: registrationBaseSchema.pick({
        fullName: true,
        dateOfBirth: true,
        gender: true,
        email: true,
        mobile: true,
        alternateMobile: true,
        city: true,
        state: true,
      }),
      safety: registrationBaseSchema.pick({
        emergencyName: true,
        emergencyMobile: true,
        bloodGroup: true,
        medicalConditions: true,
      }),
      extras: registrationBaseSchema.pick({ club: true, hearAbout: true }),
      consent: registrationBaseSchema.pick({
        acceptTerms: true,
        photographyConsent: true,
        guardianName: true,
        guardianConsent: true,
      }),
      interest: z.object({
        fullName: trimmed.min(2, "Enter your full name").max(120),
        email: emailSchema,
        mobile: mobileSchema,
        distance: z.enum(["10k", "5k", "3k"]),
        hearAbout: trimmed.max(120).optional().or(z.literal("")),
        consent: z.literal(true, { message: "Please agree so we can email you" }),
      }),
    }),
    [],
  );

  const currentId = steps[step]?.id ?? "race";

  function validateCurrentStep(): boolean {
    const schema = stepSchemas[currentId as keyof typeof stepSchemas];
    if (!schema) return true;

    const slice: Record<string, unknown> = {};
    for (const key of Object.keys(schema.shape)) {
      slice[key] = values[key];
    }

    const parsed = schema.safeParse(slice);
    if (parsed.success) {
      setErrors({});
      return true;
    }

    const fieldErrors = toFieldErrors(parsed.error);

    // The under-18 guardian rule is enforced per step as well as on submit, so
    // the runner is told while they are on the consent screen.
    if (currentId === "consent" && needsGuardian) {
      if (!values.guardianConsent) {
        fieldErrors.guardianConsent =
          "A parent or guardian must consent for runners under 18";
      }
      if (String(values.guardianName ?? "").trim().length < 2) {
        fieldErrors.guardianName = "Enter the parent or guardian's name";
      }
    }

    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  }

  function goNext() {
    if (!validateCurrentStep()) {
      focusFirstError();
      return;
    }
    setStep((current) => Math.min(current + 1, steps.length - 1));
    moveFocus();
  }

  function goBack() {
    setStep((current) => Math.max(current - 1, 0));
    setErrors({});
    moveFocus();
  }

  function focusFirstError() {
    window.requestAnimationFrame(() => {
      const target = document.querySelector<HTMLElement>('[aria-invalid="true"]');
      target?.focus();
    });
  }

  function moveFocus() {
    window.requestAnimationFrame(() => {
      stepTopRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
      headingRef.current?.focus();
    });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    if (mode === "full") {
      const parsed = registrationSchema.safeParse(values);
      if (!parsed.success) {
        const fieldErrors = toFieldErrors(parsed.error);
        setErrors(fieldErrors);
        // Send the runner back to the step that owns the first bad field.
        const firstField = Object.keys(fieldErrors)[0] ?? "";
        const owning = [
          ["distance", "tshirtSize"],
          ["fullName", "dateOfBirth", "gender", "email", "mobile", "city", "state"],
          ["emergencyName", "emergencyMobile", "bloodGroup", "medicalConditions"],
          ["club", "hearAbout"],
          ["acceptTerms", "photographyConsent", "guardianName", "guardianConsent"],
        ];
        const index = owning.findIndex((group) =>
          group.some((field) => firstField.startsWith(field)),
        );
        if (index >= 0) setStep(index);
        focusFirstError();
        return;
      }
    } else if (!validateCurrentStep()) {
      focusFirstError();
      return;
    }

    setPending(true);

    const payload =
      mode === "full"
        ? {
            ...values,
            mobile: normaliseMobile(String(values.mobile)),
            emergencyMobile: normaliseMobile(String(values.emergencyMobile)),
          }
        : {
            fullName: values.fullName,
            email: values.email,
            mobile: normaliseMobile(String(values.mobile)),
            distance: values.distance,
            hearAbout: values.hearAbout,
            consent: true,
            companyWebsite: values.companyWebsite,
          };

    const result = await submitForm<RegistrationFormReceipt>(
      mode === "full" ? "/api/registrations" : "/api/interests",
      payload,
    );

    setPending(false);

    if (result.ok && result.data) {
      setConfirmation(result.data);
      try {
        window.localStorage.removeItem(DRAFT_KEY);
      } catch {
        // Nothing to clean up if storage is unavailable.
      }
      moveFocus();
      return;
    }

    if (result.fieldErrors) setErrors(result.fieldErrors);
    setFormError(result.message);
    focusFirstError();
  }

  const clearDraft = useCallback(() => {
    try {
      window.localStorage.removeItem(DRAFT_KEY);
    } catch {
      // Ignore.
    }
    setValues(initialValues(defaultDistance));
    setStep(0);
    setErrors({});
    setRestored(false);
  }, [defaultDistance]);

  if (confirmation) {
    return <Confirmation receipt={confirmation} onStartOver={clearDraft} />;
  }

  const isLast = step === steps.length - 1;

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <ol className="steps" aria-label="Registration steps">
        {steps.map((entry, index) => (
          <li
            key={entry.id}
            data-state={
              index === step ? "current" : index < step ? "done" : "todo"
            }
            aria-current={index === step ? "step" : undefined}
          >
            {entry.label}
          </li>
        ))}
      </ol>

      {restored ? (
        <div className="notice notice--ink">
          <div>
            <strong>We brought your answers back</strong>
            You started an entry on this device.{" "}
            <button
              type="button"
              className="btn btn--sm btn--quiet"
              onClick={clearDraft}
            >
              Start again
            </button>
          </div>
        </div>
      ) : null}

      <div ref={stepTopRef} />

      <h2 ref={headingRef} tabIndex={-1} className="visually-hidden">
        {steps[step]?.label}
      </h2>

      {currentId === "race" ? (
        <fieldset className="fieldset">
          <legend>Your race</legend>
          <div className="form-grid">
            <SelectField
              name="distance"
              label="Distance"
              value={String(values.distance)}
              onChange={(value) => set("distance", value)}
              options={distances.map((race) => ({
                value: race.id,
                label: race.name,
              }))}
              error={errors.distance}
              required
            />
            <SelectField
              name="tshirtSize"
              label="T-shirt size"
              value={String(values.tshirtSize)}
              onChange={(value) => set("tshirtSize", value)}
              options={TSHIRT_SIZES.map((size) => ({ value: size, label: size }))}
              error={errors.tshirtSize}
              hint="Unisex cut. Sizes are fitted loosely."
              required
            />
          </div>
          <p className="hint">
            Fee: we publish the fee for each distance before registration opens,
            and you see it on the payment screen before you pay anything.
          </p>
        </fieldset>
      ) : null}

      {currentId === "person" ? (
        <fieldset className="fieldset">
          <legend>About you</legend>
          <div className="form-grid">
            <TextField
              name="fullName"
              label="Full name"
              autoComplete="name"
              value={String(values.fullName)}
              onChange={(value) => set("fullName", value)}
              error={errors.fullName}
              hint="Exactly as printed on your photo ID."
              required
            />
            <TextField
              name="dateOfBirth"
              label="Date of birth"
              type="date"
              autoComplete="bday"
              value={String(values.dateOfBirth)}
              onChange={(value) => set("dateOfBirth", value)}
              error={errors.dateOfBirth}
              required
            />
            <SelectField
              name="gender"
              label="Gender"
              value={String(values.gender)}
              onChange={(value) => set("gender", value)}
              options={GENDERS}
              error={errors.gender}
              hint="Used only to allocate race categories."
              required
            />
            <TextField
              name="email"
              label="Email address"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={String(values.email)}
              onChange={(value) => set("email", value)}
              error={errors.email}
              hint="Your registration ID and results go here."
              required
            />
            <TextField
              name="mobile"
              label="Mobile number"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="98765 43210"
              value={String(values.mobile)}
              onChange={(value) => set("mobile", value)}
              error={errors.mobile}
              hint="Race-day messages and your SMS code go here."
              required
            />
            <TextField
              name="alternateMobile"
              label="Alternate mobile"
              type="tel"
              inputMode="tel"
              value={String(values.alternateMobile)}
              onChange={(value) => set("alternateMobile", value)}
              error={errors.alternateMobile}
              optional
            />
            <TextField
              name="city"
              label="City"
              autoComplete="address-level2"
              value={String(values.city)}
              onChange={(value) => set("city", value)}
              error={errors.city}
              required
            />
            <SelectField
              name="state"
              label="State"
              value={String(values.state)}
              onChange={(value) => set("state", value)}
              options={INDIAN_STATES.map((stateName) => ({
                value: stateName,
                label: stateName,
              }))}
              error={errors.state}
              required
            />
          </div>
        </fieldset>
      ) : null}

      {currentId === "safety" ? (
        <fieldset className="fieldset">
          <legend>Emergency and medical</legend>
          <div className="form-grid">
            <TextField
              name="emergencyName"
              label="Emergency contact name"
              autoComplete="off"
              value={String(values.emergencyName)}
              onChange={(value) => set("emergencyName", value)}
              error={errors.emergencyName}
              hint="Someone who will answer their phone on race morning."
              required
            />
            <TextField
              name="emergencyMobile"
              label="Emergency contact number"
              type="tel"
              inputMode="tel"
              placeholder="98765 43210"
              value={String(values.emergencyMobile)}
              onChange={(value) => set("emergencyMobile", value)}
              error={errors.emergencyMobile}
              required
            />
            <SelectField
              name="bloodGroup"
              label="Blood group"
              value={String(values.bloodGroup)}
              onChange={(value) => set("bloodGroup", value)}
              options={BLOOD_GROUPS}
              error={errors.bloodGroup}
              optional
            />
            <div className="field field--full">
              <TextAreaField
                name="medicalConditions"
                label="Medical conditions, allergies or medication"
                rows={4}
                value={String(values.medicalConditions)}
                onChange={(value) => set("medicalConditions", value)}
                error={errors.medicalConditions}
                hint="Goes only to the race medical team, only to help you on the course. Deleted on request after the event."
                optional
              />
            </div>
          </div>
          <div className="notice notice--green">
            <div>
              You confirm you are fit to run this distance. If you are unsure,
              speak to a doctor before you train.
            </div>
          </div>
        </fieldset>
      ) : null}

      {currentId === "extras" ? (
        <fieldset className="fieldset">
          <legend>Anything else</legend>
          <div className="form-grid">
            <TextField
              name="club"
              label="Running club, gym or institution"
              value={String(values.club)}
              onChange={(value) => set("club", value)}
              error={errors.club}
              hint="Club entries are grouped in the start area."
              optional
            />
            <SelectField
              name="hearAbout"
              label="How did you hear about us?"
              value={String(values.hearAbout)}
              onChange={(value) => set("hearAbout", value)}
              options={HEARD_ABOUT}
              error={errors.hearAbout}
              optional
            />
          </div>
        </fieldset>
      ) : null}

      {currentId === "consent" ? (
        <fieldset className="fieldset">
          <legend>Consent</legend>
          <CheckboxField
            name="acceptTerms"
            checked={Boolean(values.acceptTerms)}
            onChange={(checked) => set("acceptTerms", checked)}
            error={errors.acceptTerms}
            required
            label={
              <>
                I accept the{" "}
                <Link href="/terms" target="_blank">
                  terms and waiver
                </Link>
                , the{" "}
                <Link href="/refund-policy" target="_blank">
                  refund policy
                </Link>{" "}
                and the{" "}
                <Link href="/privacy" target="_blank">
                  privacy policy
                </Link>
                , and I confirm the details above are correct.
              </>
            }
          />
          <CheckboxField
            name="photographyConsent"
            checked={Boolean(values.photographyConsent)}
            onChange={(checked) => set("photographyConsent", checked)}
            label="You may photograph and video me during the event and use it to promote it. I know I can opt out at any time by emailing you."
          />

          {needsGuardian ? (
            <>
              <div className="notice">
                <div>
                  <strong>You are under 18 on race day</strong>
                  A parent or guardian completes this section for you.
                </div>
              </div>
              <TextField
                name="guardianName"
                label="Parent or guardian's full name"
                value={String(values.guardianName)}
                onChange={(value) => set("guardianName", value)}
                error={errors.guardianName}
                required
              />
              <CheckboxField
                name="guardianConsent"
                checked={Boolean(values.guardianConsent)}
                onChange={(checked) => set("guardianConsent", checked)}
                error={errors.guardianConsent}
                required
                label="I am the parent or guardian and I consent to this runner taking part."
              />
            </>
          ) : null}
        </fieldset>
      ) : null}

      {currentId === "interest" ? (
        <fieldset className="fieldset">
          <legend>Tell us you are interested</legend>
          <p className="hint">
            Registration is not open yet. Leave these four details and we will
            email you the moment the date and fee are fixed.
          </p>
          <div className="form-grid">
            <TextField
              name="fullName"
              label="Full name"
              autoComplete="name"
              value={String(values.fullName)}
              onChange={(value) => set("fullName", value)}
              error={errors.fullName}
              required
            />
            <TextField
              name="email"
              label="Email address"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={String(values.email)}
              onChange={(value) => set("email", value)}
              error={errors.email}
              required
            />
            <TextField
              name="mobile"
              label="Mobile number"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="98765 43210"
              value={String(values.mobile)}
              onChange={(value) => set("mobile", value)}
              error={errors.mobile}
              required
            />
            <SelectField
              name="distance"
              label="Distance you want to run"
              value={String(values.distance)}
              onChange={(value) => set("distance", value)}
              options={DISTANCES}
              error={errors.distance}
              required
            />
            <SelectField
              name="hearAbout"
              label="How did you hear about us?"
              value={String(values.hearAbout)}
              onChange={(value) => set("hearAbout", value)}
              options={HEARD_ABOUT}
              error={errors.hearAbout}
              optional
            />
          </div>
          <CheckboxField
            name="consent"
            checked={Boolean(values.acceptTerms)}
            onChange={(checked) => set("acceptTerms", checked)}
            error={errors.consent}
            required
            label="Yes, email me about Yuva Shakti Run. One email when the date is locked, one when registration opens. You can unsubscribe any time — see the privacy policy."
          />
        </fieldset>
      ) : null}

      {currentId === "review" ? (
        <fieldset className="fieldset">
          <legend>Check and confirm</legend>
          <div className="table-wrap">
            <table>
              <tbody>
                <ReviewRow label="Distance" value={String(values.distance).toUpperCase()} />
                <ReviewRow label="Name" value={String(values.fullName)} />
                <ReviewRow
                  label="Date of birth"
                  value={`${String(values.dateOfBirth)}${age !== null ? ` (age ${age})` : ""}`}
                />
                <ReviewRow label="Gender" value={String(values.gender)} />
                <ReviewRow label="Email" value={String(values.email)} />
                <ReviewRow label="Mobile" value={String(values.mobile)} />
                <ReviewRow label="City" value={`${String(values.city)}, ${String(values.state)}`} />
                <ReviewRow label="T-shirt" value={String(values.tshirtSize)} />
                <ReviewRow
                  label="Emergency"
                  value={`${String(values.emergencyName)} — ${String(values.emergencyMobile)}`}
                />
                <ReviewRow
                  label="Blood group"
                  value={String(values.bloodGroup) || "Not given"}
                />
                <ReviewRow
                  label="Medical"
                  value={String(values.medicalConditions) || "None given"}
                />
                <ReviewRow label="Club" value={String(values.club) || "None"} />
                <ReviewRow
                  label="Terms"
                  value={values.acceptTerms ? "Accepted" : "Not accepted"}
                />
                <ReviewRow
                  label="Photographs"
                  value={values.photographyConsent ? "Consent given" : "Opted out"}
                />
                {needsGuardian ? (
                  <ReviewRow
                    label="Guardian"
                    value={`${String(values.guardianName)} — ${
                      values.guardianConsent ? "consented" : "not consented"
                    }`}
                  />
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="notice notice--ink">
            <div>
              <strong>Payment is not enabled yet</strong>
              This entry is recorded as complete and you get a registration ID by
              email. Payment opens with the fee announcement, and you will be asked
              to pay before race day, not now.
            </div>
          </div>
        </fieldset>
      ) : null}

      <Honeypot value={String(values.companyWebsite)} onChange={(value) => set("companyWebsite", value)} />
      <FormStatus tone={formError ? "error" : null}>{formError}</FormStatus>

      <div className="form-actions">
        {step > 0 ? (
          <button type="button" className="btn btn--ghost" onClick={goBack} disabled={pending}>
            Back
          </button>
        ) : null}

        {!isLast ? (
          <button type="button" className="btn btn--primary btn--lg" onClick={goNext}>
            Continue
          </button>
        ) : (
          <button type="submit" className="btn btn--primary btn--lg" disabled={pending}>
            {pending
              ? "Submitting…"
              : mode === "full"
                ? "Confirm registration"
                : "Notify me"}
          </button>
        )}
      </div>

      <p className="hint">
        Your answers are saved on this device as you go, so a dropped connection
        will not lose your entry.
      </p>
    </form>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <th scope="row">{label}</th>
      <td>{value}</td>
    </tr>
  );
}

function Confirmation({
  receipt,
  onStartOver,
}: {
  receipt: RegistrationFormReceipt;
  onStartOver: () => void;
}) {
  const handleDownload = () => {
    const html = receiptHtml(receipt);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `yuva-shakti-run-${receipt.registrationId}.html`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="stack" id="confirmation">
      <div className="notice notice--green">
        <div>
          <strong>You are on the list.</strong>
          We have emailed your reference to {receipt.email}. Keep it — you will
          need it for bib collection and for querying your result.
        </div>
      </div>

      <div className="result-card">
        <p className="text-muted" style={{ fontSize: "var(--step--1)" }}>
          Registration reference
        </p>
        <p className="result-card__time">{receipt.registrationId}</p>
        <ul className="spec-list">
          <li>
            <span className="spec-list__key">Name</span>
            <span>{receipt.name}</span>
          </li>
          <li>
            <span className="spec-list__key">Distance</span>
            <span>{receipt.distance}</span>
          </li>
          {receipt.bib ? (
            <li>
              <span className="spec-list__key">Bib</span>
              <span>{receipt.bib}</span>
            </li>
          ) : null}
          <li>
            <span className="spec-list__key">Email</span>
            <span>{receipt.email}</span>
          </li>
          <li>
            <span className="spec-list__key">Status</span>
            <span>
              {receipt.mode === "interest"
                ? "Interest recorded — registration opens soon"
                : "Registered — payment pending"}
            </span>
          </li>
          <li>
            <span className="spec-list__key">Recorded on</span>
            <span>
              {new Date(receipt.createdAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          </li>
        </ul>
      </div>

      <div className="cluster">
        <button type="button" className="btn btn--primary" onClick={handleDownload}>
          Download receipt
        </button>
        <Link className="btn btn--ghost" href="/participant-guide">
          Read the participant guide
        </Link>
        <Link className="btn btn--quiet" href="/updates">
          Follow the updates
        </Link>
      </div>

      <div className="cluster">
        <button type="button" className="btn btn--sm btn--quiet" onClick={onStartOver}>
          Register another runner
        </button>
      </div>
    </div>
  );
}

type RegistrationFormReceipt = {
  registrationId: string;
  bib: string | null;
  mode: string;
  email: string;
  distance: string;
  name: string;
  amountPaid: number | null;
  currency: string | null;
  createdAt: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function receiptHtml(receipt: RegistrationFormReceipt): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Yuva Shakti Run — receipt ${escapeHtml(receipt.registrationId)}</title>
<style>
  body { font-family: system-ui, sans-serif; margin: 2rem auto; max-width: 40rem; color: #161816; }
  h1 { font-size: 1.5rem; }
  dl { display: grid; grid-template-columns: 12rem 1fr; gap: .4rem 1rem; }
  dt { color: #5c625c; } dd { margin: 0; }
  .note { border-top: 2px solid #138808; margin-top: 2rem; padding-top: 1rem; color: #5c625c; font-size: .875rem; }
</style>
</head>
<body>
  <h1>Yuva Shakti Run — registration receipt</h1>
  <dl>
    <dt>Reference</dt><dd><strong>${escapeHtml(receipt.registrationId)}</strong></dd>
    <dt>Name</dt><dd>${escapeHtml(receipt.name)}</dd>
    <dt>Distance</dt><dd>${escapeHtml(receipt.distance)}</dd>
    <dt>Bib</dt><dd>${escapeHtml(receipt.bib ?? "Allocated before race day")}</dd>
    <dt>Email</dt><dd>${escapeHtml(receipt.email)}</dd>
    <dt>Status</dt><dd>${receipt.mode === "interest" ? "Interest recorded" : "Registered — payment pending"}</dd>
    <dt>Recorded on</dt><dd>${escapeHtml(new Date(receipt.createdAt).toLocaleString("en-IN"))}</dd>
  </dl>
  <p class="note">
    Print this page or save it as a PDF. Bring it with a photo ID to bib
    collection. This is a computer-generated receipt and does not need a
    signature.
  </p>
</body>
</html>`;
}
