import { z } from "zod";

/**
 * Shared field rules. The API re-validates everything with its own copy of
 * these rules — this file is for fast feedback in the browser, never for trust.
 */

export const trimmed = z.string().trim();

export const emailSchema = z.email("Enter a valid email address").max(254);

/** 10 digits, Indian mobile. Accepts spaces, +91 and a leading 0. */
export const mobileSchema = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, "Enter a 10-digit Indian mobile number");

export function normaliseMobile(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

export const distanceSchema = z.enum(["10k", "5k", "3k"]);

export const interestSchema = z.object({
  fullName: trimmed.min(2, "Enter your full name").max(120),
  email: emailSchema,
  mobile: mobileSchema,
  distance: distanceSchema,
  hearAbout: trimmed.max(120).optional().or(z.literal("")),
  consent: z.literal(true, { message: "Please agree so we can email you" }),
  companyWebsite: z.string().max(0).optional(),
});

export const registrationBaseSchema = z.object({
  distance: distanceSchema,
  tshirtSize: z.enum(["XS", "S", "M", "L", "XL", "XXL", "3XL"]),

  fullName: trimmed.min(2, "Enter your full name as on your ID").max(120),
  dateOfBirth: trimmed
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter your date of birth")
    .refine((value) => {
      const parsed = new Date(value);
      return !Number.isNaN(parsed.getTime()) && parsed < new Date();
    }, "Date of birth must be in the past"),
  gender: z.enum(["female", "male", "non-binary", "prefer-not-to-say"]),
  email: emailSchema,
  mobile: mobileSchema,
  alternateMobile: mobileSchema.optional().or(z.literal("")),
  city: trimmed.min(2, "Enter your city").max(80),
  state: trimmed.min(2, "Select your state").max(80),

  emergencyName: trimmed.min(2, "Enter an emergency contact name").max(120),
  emergencyMobile: mobileSchema,
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

  companyWebsite: z.string().max(0).optional(),
});

export const registrationSchema = registrationBaseSchema.superRefine((data, ctx) => {
  // Guardian consent is required for anyone under 18 on race day.
  const dob = new Date(data.dateOfBirth);
  if (Number.isNaN(dob.getTime())) return;

  if (ageOn(dob, raceDayDate()) < 18) {
    if (!data.guardianConsent) {
      ctx.addIssue({
        code: "custom",
        path: ["guardianConsent"],
        message: "A parent or guardian must consent for runners under 18",
      });
    }
    if ((data.guardianName ?? "").trim().length < 2) {
      ctx.addIssue({
        code: "custom",
        path: ["guardianName"],
        message: "Enter the parent or guardian's name",
      });
    }
  }
});

/** Age in whole years on a given date. */
export function ageOn(dateOfBirth: Date, on: Date): number {
  let age = on.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = on.getMonth() - dateOfBirth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && on.getDate() < dateOfBirth.getDate())) {
    age -= 1;
  }
  return age;
}


export type RegistrationInput = z.infer<typeof registrationSchema>;
export type InterestInput = z.infer<typeof interestSchema>;

/**
 * Race day, in IST. Falls back to today while the date is unannounced, so the
 * under-18 check still behaves sensibly instead of silently passing.
 */
function raceDayDate(): Date {
  const iso = process.env.NEXT_PUBLIC_EVENT_DATE;
  if (iso) {
    const parsed = new Date(iso);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date();
}

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Outside India",
];

export const TSHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"] as const;
