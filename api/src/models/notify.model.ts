import { Schema, model, type InferSchemaType } from "mongoose";

/** A "tell me when the date is set" signup, collected while registration is closed. */
const notifySchema = new Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    preferredRace: {
      type: String,
      enum: ["10k", "5k", "3k", null],
      default: null,
    },
    source: { type: String, default: "home-notify" },
    ip: { type: String, default: null },
    unsubscribedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

notifySchema.index({ email: 1, preferredRace: 1 }, { unique: true });

export type NotifyDocument = InferSchemaType<typeof notifySchema>;
export const NotifySubscriber = model("NotifySubscriber", notifySchema);
