import { Schema, model } from "mongoose";

/** A Register Interest entry: name, email, phone and preferred distance. */
const interestSchema = new Schema(
  {
    /** Readable reference, same shape as a registration ID. Unique. */
    reference: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    mobile: { type: String, required: true },
    distance: { type: String, required: true, enum: ["10k", "5k", "3k"] },
    hearAbout: { type: String, default: null },
    // Converted to a full Registration once the date opens.
    convertedRegistrationId: { type: String, default: null },
    ip: { type: String, default: null },
  },
  { timestamps: true },
);

interestSchema.index({ email: 1, distance: 1 }, { unique: true });

export const Interest = model("Interest", interestSchema);
