import { Schema, model } from "mongoose";

const contactSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, default: null },
    topic: {
      type: String,
      required: true,
      enum: [
        "registration",
        "race-day",
        "volunteer",
        "sponsorship",
        "press",
        "medical",
        "other",
      ],
    },
    message: { type: String, required: true, trim: true, maxlength: 4000 },
    registrationId: { type: String, default: null },
    handledAt: { type: Date, default: null },
    ip: { type: String, default: null },
  },
  { timestamps: true },
);

export const ContactMessage = model("ContactMessage", contactSchema);
