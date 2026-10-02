import { Schema, model } from "mongoose";

const volunteerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    phone: { type: String, required: true, index: true },
    email: { type: String, default: null, lowercase: true, trim: true },
    city: { type: String, default: null, trim: true, maxlength: 80 },
    availability: {
      type: String,
      required: true,
      enum: ["full", "race-day", "pre-race", "remote"],
    },
    role: {
      type: String,
      required: true,
      enum: [
        "aid-station",
        "marshal",
        "registration",
        "medical",
        "photography",
        "social",
        "anything",
      ],
    },
    message: { type: String, default: null, maxlength: 2000 },
    assignedRole: { type: String, default: null },
    briefedAt: { type: Date, default: null },
    ip: { type: String, default: null },
  },
  { timestamps: true },
);

// One application per phone number, so a repeat submit updates rather than floods.
volunteerSchema.index({ phone: 1 }, { unique: true });

export const VolunteerApplication = model("VolunteerApplication", volunteerSchema);
