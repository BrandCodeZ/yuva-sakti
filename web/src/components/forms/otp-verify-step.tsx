"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { normaliseMobile, submitForm } from "@/lib/api";

type Channel = "email" | "mobile";

interface OtpState {
  /** Null until a code has been sent at least once. */
  sentAt: number | null;
  expiresAt: number;
  resendAt: number;
  verified: boolean;
}

const CODE_LENGTH = 6;

interface OtpVerifyStepProps {
  email: string;
  mobile: string;
  onVerified: (channel: Channel) => void;
  onEmailChange: (value: string) => void;
  onMobileChange: (value: string) => void;
  emailError?: string;
  mobileError?: string;
}

/**
 * Verifies the runner's own email address and mobile number before the form is
 * allowed to submit. One component covers both channels because the runner has
 * to clear them in sequence and the interaction is identical.
 *
 * Two details matter for mobile data in India: the code input is numeric with
 * autocomplete hints so the OS keyboard offers digits, and a wrong code keeps
 * the focus in the field so the runner can just retype it.
 */
export function OtpVerifyStep({
  email,
  mobile,
  onVerified,
  onEmailChange,
  onMobileChange,
  emailError,
  mobileError,
}: OtpVerifyStepProps) {
  const [state, setState] = useState<Record<Channel, OtpState>>({
    email: { sentAt: null, expiresAt: 0, resendAt: 0, verified: false },
    mobile: { sentAt: null, expiresAt: 0, resendAt: 0, verified: false },
  });
  const [codes, setCodes] = useState<Record<Channel, string>>({
    email: "",
    mobile: "",
  });
  const [busy, setBusy] = useState<Channel | null>(null);
  const [message, setMessage] = useState<Record<Channel, string>>({
    email: "",
    mobile: "",
  });
  const [ticked, setTicked] = useState(0);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const bothVerified = state.email.verified && state.mobile.verified;

  // One shared interval drives every countdown on the step. Reading it during
  // render is the point: the label has to update as the seconds pass.
  useEffect(() => {
    const timer = window.setInterval(() => setTicked((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);
  void ticked;

  // The parent passes a fresh callback each render, so keep it in a ref rather
  // than listing it as an effect dependency. Read inside the effect below.
  const notifyParent = useRef(onVerified);
  useEffect(() => {
    notifyParent.current = onVerified;
  }, [onVerified]);

  // Tell the parent once both channels clear, so it can allow the step to end.
  useEffect(() => {
    if (bothVerified) notifyParent.current("email");
  }, [bothVerified]);

  const update = useCallback(
    (channel: Channel, patch: Partial<OtpState>) => {
      setState((current) => ({
        ...current,
        [channel]: { ...current[channel], ...patch },
      }));
    },
    [],
  );

  async function request(channel: Channel) {
    const target = channel === "email" ? email.trim() : normaliseMobile(mobile);
    setBusy(channel);
    setMessage((current) => ({ ...current, [channel]: "" }));

    const result = await submitForm<{
      expiresInSeconds: number;
      resendInSeconds: number;
    }>("/api/otp/request", { channel, target });

    setBusy(null);

    if (!result.ok) {
      setMessage((current) => ({ ...current, [channel]: result.message }));
      return;
    }

    const now = Date.now();
    update(channel, {
      sentAt: now,
      expiresAt: now + (result.data?.expiresInSeconds ?? 600) * 1000,
      resendAt: now + (result.data?.resendInSeconds ?? 60) * 1000,
      verified: false,
    });
    setCodes((current) => ({ ...current, [channel]: "" }));

    // Focus the code box so the runner can type straight away.
    window.requestAnimationFrame(() => {
      const ref = channel === "email" ? emailInputRef : mobileInputRef;
      ref.current?.focus();
    });
  }

  async function verify(channel: Channel) {
    const code = codes[channel].trim();
    if (code.length !== CODE_LENGTH) {
      setMessage((current) => ({
        ...current,
        [channel]: `Enter all ${CODE_LENGTH} digits.`,
      }));
      return;
    }

    const target = channel === "email" ? email.trim() : normaliseMobile(mobile);
    setBusy(channel);
    setMessage((current) => ({ ...current, [channel]: "" }));

    const result = await submitForm(`/api/otp/verify`, { channel, target, code });

    setBusy(null);

    if (!result.ok) {
      setMessage((current) => ({ ...current, [channel]: result.message }));
      // An expired or locked challenge cannot be rescued by retyping.
      if (/expired|new code|start again|no code waiting/i.test(result.message)) {
        update(channel, { sentAt: null });
        setCodes((current) => ({ ...current, [channel]: "" }));
      }
      return;
    }

    update(channel, { verified: true });
    setMessage((current) => ({
      ...current,
      [channel]:
        channel === "email"
          ? "Email verified. Your confirmation will go here."
          : "Mobile verified. We will use this for race-day updates.",
    }));
  }

  function secondsLeft(until: number): number {
    return Math.max(0, Math.ceil((until - Date.now()) / 1000));
  }

  return (
    <div className="otp">
      <p className="otp__intro">
        We verify your email address and mobile number before your entry is
        recorded. The confirmation and your race-day updates go to the address
        you give here, so it is worth checking both.
      </p>

      <OtpRow
        channel="email"
        label="Email address"
        value={email}
        valueError={emailError}
        onValueChange={onEmailChange}
        state={state.email}
        code={codes.email}
        onCodeChange={(value) =>
          setCodes((current) => ({ ...current, email: value }))
        }
        message={message.email}
        busy={busy === "email"}
        inputRef={emailInputRef}
        secondsLeft={secondsLeft}
        onRequest={request}
        onVerify={verify}
      />

      <OtpRow
        channel="mobile"
        label="Mobile number"
        value={mobile}
        valueError={mobileError}
        onValueChange={onMobileChange}
        state={state.mobile}
        code={codes.mobile}
        onCodeChange={(value) =>
          setCodes((current) => ({ ...current, mobile: value }))
        }
        message={message.mobile}
        busy={busy === "mobile"}
        inputRef={mobileInputRef}
        secondsLeft={secondsLeft}
        onRequest={request}
        onVerify={verify}
      />

      <p className="otp__note" role="status">
        {bothVerified
          ? "Both verified. You can continue."
          : "Verify both to continue. Codes expire after 10 minutes."}
      </p>
    </div>
  );
}

interface OtpRowProps {
  channel: Channel;
  label: string;
  value: string;
  valueError?: string;
  onValueChange: (value: string) => void;
  state: OtpState;
  code: string;
  onCodeChange: (value: string) => void;
  message: string;
  busy: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  secondsLeft: (until: number) => number;
  onRequest: (channel: Channel) => void;
  onVerify: (channel: Channel) => void;
}

function OtpRow({
  channel,
  label,
  value,
  valueError,
  onValueChange,
  state,
  code,
  onCodeChange,
  message,
  busy,
  inputRef,
  secondsLeft,
  onRequest,
  onVerify,
}: OtpRowProps) {
  const id = `otp-${channel}`;
  const codeId = `${id}-code`;
  const hintId = `${id}-hint`;

  const resendIn = state.sentAt === null ? 0 : secondsLeft(state.resendAt);
  const expiresIn = state.sentAt === null ? 0 : secondsLeft(state.expiresAt);
  const codeExpired = state.sentAt !== null && expiresIn === 0 && !state.verified;

  return (
    <fieldset className="otp__row" data-verified={state.verified || undefined}>
      <legend>{label}</legend>

      <div className="field">
        <label htmlFor={id} className="field__label">
          {label}
        </label>
        <input
          id={id}
          className="field__input"
          type={channel === "email" ? "email" : "tel"}
          inputMode={channel === "email" ? "email" : "numeric"}
          autoComplete={channel === "email" ? "email" : "tel-national"}
          value={value}
          disabled={state.verified}
          aria-invalid={valueError ? true : undefined}
          aria-describedby={valueError ? hintId : undefined}
          onChange={(event) => onValueChange(event.target.value)}
        />
        {valueError ? (
          <p className="field__error" id={hintId}>
            {valueError}
          </p>
        ) : null}
      </div>

      {state.verified ? (
        <p className="otp__done">
          <span aria-hidden="true">✓</span> Verified
        </p>
      ) : state.sentAt === null ? (
        <button
          type="button"
          className="btn btn--green"
          onClick={() => onRequest(channel)}
          disabled={busy || Boolean(valueError) || value.trim().length < 3}
        >
          {busy
            ? "Sending…"
            : channel === "email"
              ? "Send code by email"
              : "Send code by SMS"}
        </button>
      ) : (
        <div className="otp__entry">
          <div className="field">
            <label htmlFor={codeId} className="field__label">
              6-digit code
            </label>
            <input
              id={codeId}
              ref={inputRef}
              className="field__input otp__input"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={CODE_LENGTH}
              pattern="[0-9]{6}"
              value={code}
              disabled={busy || codeExpired}
              aria-invalid={message ? true : undefined}
              aria-describedby={message ? `${codeId}-msg` : undefined}
              onChange={(event) =>
                onCodeChange(event.target.value.replace(/\D/g, "").slice(0, CODE_LENGTH))
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void onVerify(channel);
                }
              }}
            />
          </div>

          {message ? (
            <p className="field__error" id={`${codeId}-msg`} role="alert">
              {message}
            </p>
          ) : null}

          <div className="otp__actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => onVerify(channel)}
              disabled={busy || codeExpired || code.length !== CODE_LENGTH}
            >
              {busy ? "Checking…" : "Verify"}
            </button>

            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => onRequest(channel)}
              disabled={busy || resendIn > 0}
            >
              {resendIn > 0
                ? `Send again in ${resendIn}s`
                : codeExpired
                  ? "Send a new code"
                  : "Send again"}
            </button>
          </div>

          <p className="otp__note">
            {codeExpired
              ? "That code has expired. Send a new one to continue."
              : `Code expires in ${Math.floor(expiresIn / 60)}m ${expiresIn % 60}s.`}
          </p>
        </div>
      )}
    </fieldset>
  );
}
