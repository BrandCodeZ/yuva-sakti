const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
).replace(/\/$/, "");

export interface SubmitResult<T = unknown> {
  ok: boolean;
  /** Human-readable message, safe to show the visitor. */
  message: string;
  data?: T;
  /** Field name -> first error, from server-side validation. */
  fieldErrors?: Record<string, string>;
  /** True when the request never reached the API. */
  offline?: boolean;
}

const OFFLINE_MESSAGE =
  "We could not reach the registration server. Please check your connection and try again, or email us.";

export async function submitForm<T = unknown>(
  path: string,
  payload: unknown,
  signal?: AbortSignal,
): Promise<SubmitResult<T>> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal,
    });
  } catch {
    return { ok: false, message: OFFLINE_MESSAGE, offline: true };
  }

  let body: {
    message?: string;
    data?: T;
    errors?: Record<string, string>;
  } = {};

  try {
    body = (await response.json()) as typeof body;
  } catch {
    body = {};
  }

  if (!response.ok) {
    return {
      ok: false,
      message: body.message ?? "Something went wrong. Please try again.",
      fieldErrors: body.errors,
    };
  }

  return { ok: true, message: body.message ?? "Done.", data: body.data };
}

export function apiBase() {
  return API_BASE;
}

/** Indian mobile numbers, tolerant of spaces, +91 and 0 prefixes. */
export function normaliseMobile(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}
