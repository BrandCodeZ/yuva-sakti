import { z } from "zod";
import { ageOn, normaliseMobile, raceDay } from "../services/ids.js";

/**
 * Server-side validation is the authority. The browser copy in web/src/lib
 * validation.ts is a convenience and can be bypassed by anyone.
 */

const trimmed = z.string().trim();

export const emailField = z.email("Enter a valid email address").max(254);

export const mobileField = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, "Enter a 10-digit Indian mobile number");

/** Bots fill every field they find. This one must arrive empty. */
export const honeypotField = z
  .string()
  .max(0, "Spam detected.")
  .optional()
  .or(z.literal(""));

export const distanceField = z.enum(["10k", "5k", "3k"]);

export const interestSchema = z.object({
  fullName: trimmed.min(2, "Enter your full name").max(120),
  email: emailField,
  mobile: mobileField,
  distance: distanceField,
  hearAbout: trimmed.max(120).optional().or(z.literal("")),
  consent: z.literal(true, { message: "Please agree so we can email you" }),
  companyWebsite: honeypotField,
});

export const notifySchema = z.object({
  email: emailField,
  preferredRace: distanceField.nullable().optional(),
  companyWebsite: honeypotField,
});

export type InterestInput = z.infer<typeof interestSchema>;
export type NotifyInput = z.infer<typeof notifySchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type VolunteerInput = z.infer<typeof volunteerSchema>;
export type PartnerInput = z.infer<typeof partnerSchema>;
export type RegistrationInput = z.infer<typeof registrationSchema>;

export const contactSchema = z.object({
  name: trimmed.min(2, "Enter your name").max(120),
  email: emailField,
  phone: mobileField.optional().or(z.literal("")),
  topic: z.enum([
    "registration",
    "race-day",
    "volunteer",
    "sponsorship",
    "press",
    "medical",
    "other",
  ]),
  message: trimmed.min(10, "Tell us a little more").max(4000),
  companyWebsite: honeypotField,
});

export const volunteerSchema = z.object({
  name: trimmed.min(2, "Enter your name").max(120),
  phone: mobileField,
  email: emailField.optional().or(z.literal("")),
  city: trimmed.max(80).optional().or(z.literal("")),
  availability: z.enum(["full", "race-day", "pre-race", "remote"]),
  role: z.enum([
    "aid-station",
    "marshal",
    "registration",
    "medical",
    "photography",
    "social",
    "anything",
  ]),
  message: trimmed.max(2000).optional().or(z.literal("")),
  companyWebsite: honeypotField,
});

export const partnerSchema = z.object({
  organisation: trimmed.min(2, "Enter your organisation").max(160),
  contactName: trimmed.min(2, "Enter your name").max(120),
  email: emailField,
  phone: mobileField.optional().or(z.literal("")),
  tier: z.enum(["title", "co", "community", "support"]),
  message: trimmed.min(10, "Tell us what you have in mind").max(4000),
  companyWebsite: honeypotField,
});

/** Which channel a code was sent to. */
export const otpChannelSchema = z.enum(["email", "mobile"]);

/** Six digits, sent as a string so leading zeros survive. */
export const otpCodeSchema = z
  .string()
  .trim()
  .regex(/^\d{6}$/, "Enter the 6-digit code");

export const otpRequestSchema = z.object({
  channel: otpChannelSchema,
  /** Email address or mobile number, depending on the channel. */
  target: trimmed.min(3, "Enter your email or mobile number").max(120),
  companyWebsite: honeypotField,
});

export const otpVerifySchema = z
  .object({
    channel: otpChannelSchema,
    target: trimmed.min(3, "Enter your email or mobile number").max(120),
    code: otpCodeSchema,
    companyWebsite: honeypotField,
  })
  .superRefine((value, ctx) => {
    // The channel decides which shape the target must have, so a mobile code
    // cannot be requested for a malformed email address and vice versa.
    if (value.channel === "email") {
      const parsed = emailField.safeParse(value.target);
      if (!parsed.success) {
        ctx.addIssue({
          code: "custom",
          path: ["target"],
          message: "Enter a valid email address",
        });
      }
      return;
    }

    const parsed = mobileField.safeParse(normaliseMobile(value.target));
    if (!parsed.success) {
      ctx.addIssue({
        code: "custom",
        path: ["target"],
        message: "Enter a 10-digit Indian mobile number",
      });
    }
  });

export type OtpRequestInput = z.infer<typeof otpRequestSchema>;
export type OtpVerifyInput = z.infer<typeof otpVerifySchema>;

export const registrationSchema = z.object({
  distance: distanceField,
  tshirtSize: z.enum(["XS", "S", "M", "L", "XL", "XXL", "3XL"]),

  fullName: trimmed.min(2, "Enter your full name as on your ID").max(120),
  dateOfBirth: trimmed
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter your date of birth")
    .refine((value) => {
      const parsed = new Date(value);
      return !Number.isNaN(parsed.getTime()) && parsed < new Date();
    }, "Date of birth must be in the past"),
  gender: z.enum(["female", "male", "non-binary", "prefer-not-to-say"]),
  email: emailField,
  mobile: mobileField,
  alternateMobile: mobileField.optional().or(z.literal("")),
  city: trimmed.min(2, "Enter your city").max(80),
  state: trimmed.min(2, "Select your state").max(80),

  emergencyName: trimmed.min(2, "Enter an emergency contact name").max(120),
  emergencyMobile: mobileField,
  bloodGroup: z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .optional()
    .or(z.literal("")),
  medicalConditions: trimmed.max(1000).optional().or(z.literal("")),

  club: trimmed.max(160).optional().or(z.literal("")),
  hearAbout: trimmed.max(160).optional().or(z.literal("")),

  acceptTerms: z.literal(true, { message: "You must accept the terms to register" }),
  photographyConsent: z.boolean(),
  guardianName: trimmed.max(120).optional().or(z.literal("")),
  guardianConsent: z.boolean(),

  companyWebsite: honeypotField,
}).superRefine((value, ctx) => {
  // Age is judged on race day, not today, so someone who turns 18 before the
  // event does not need a guardian, and someone who is 17 on race day does.
  // The browser applies the same rule; this is the authority.
  const dob = new Date(`${value.dateOfBirth}T00:00:00`);
  if (Number.isNaN(dob.getTime())) return;

  const age = ageOn(dob, raceDay());
  if (age >= 18) return;

  if ((value.guardianName ?? "").trim().length < 2) {
    ctx.addIssue({
      code: "custom",
      path: ["guardianName"],
      message: `You will be ${age} on race day, so a parent or guardian's name is required`,
    });
  }
  if (!value.guardianConsent) {
    ctx.addIssue({
      code: "custom",
      path: ["guardianConsent"],
      message: "A parent or guardian must agree for you to enter",
    });
  }
});

export const resultsQuerySchema = z.object({
  q: trimmed.min(2, "Enter a bib number or name").max(80),
});

/** { fieldName: firstMessage } */
export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (key && !result[key]) result[key] = issue.message;
  }
  return result;
}

