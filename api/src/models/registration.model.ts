import { Schema, model, type InferSchemaType } from "mongoose";

const registrationSchema = new Schema(
  {
    registrationId: { type: String, required: true, unique: true, index: true },
    bib: { type: String, default: null, index: true },

    distance: {
      type: String,
      required: true,
      enum: ["10k", "5k", "3k"],
      index: true,
    },

    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    dateOfBirth: { type: Date, required: true },
    ageAtRaceDay: { type: Number, required: true },
    gender: {
      type: String,
      required: true,
      enum: ["female", "male", "non-binary", "prefer-not-to-say"],
    },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    emailVerified: { type: Boolean, default: false },
    mobile: { type: String, required: true, index: true },
    mobileVerified: { type: Boolean, default: false },
    alternateMobile: { type: String, default: null },
    city: { type: String, required: true, trim: true, maxlength: 80 },
    state: { type: String, required: true, trim: true, maxlength: 80 },

    tshirtSize: {
      type: String,
      required: true,
      enum: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
    },
    club: { type: String, default: null, trim: true, maxlength: 160 },
    hearAbout: { type: String, default: null, trim: true, maxlength: 160 },

    emergencyName: { type: String, required: true, trim: true, maxlength: 120 },
    emergencyMobile: { type: String, required: true },
    bloodGroup: { type: String, default: null },
    // Never mixed into analytics or exports. Medical team only.
    medicalConditions: { type: String, default: null, maxlength: 1000 },
    medicalConsentAt: { type: Date, default: null },

    acceptTerms: { type: Boolean, required: true },
    acceptTermsAt: { type: Date, required: true },
    termsVersion: { type: String, required: true },
    photographyConsent: { type: Boolean, default: true },
    guardianName: { type: String, default: null },
    guardianConsent: { type: Boolean, default: false },

    amountPaid: { type: Number, default: null },
    currency: { type: String, default: "INR" },
    paymentReference: { type: String, default: null },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded", "failed"],
      default: "pending",
    },
    registrationStatus: {
      type: String,
      enum: ["recorded", "confirmed", "withdrawn", "dnf"],
      default: "recorded",
    },

    source: { type: String, default: "web" },
    ip: { type: String, default: null },
    userAgent: { type: String, default: null },
  },
  { timestamps: true },
);

// One entry per person per distance. Catches the double-click and the
// "register two friends with one phone" mistakes at the database level.
registrationSchema.index(
  { email: 1, mobile: 1, distance: 1 },
  { unique: true, name: "one_entry_per_person_per_distance" },
);
registrationSchema.index({ createdAt: -1 });

export type RegistrationDocument = InferSchemaType<typeof registrationSchema>;

export const Registration = model("Registration", registrationSchema);
