import { Schema, model } from "mongoose";

/**
 * One row per finisher, populated after the event from the timing file.
 * The results page reads this and nothing else.
 */
const resultSchema = new Schema(
  {
    registrationId: { type: String, required: true, index: true },
    bib: { type: String, required: true, index: true },
    name: { type: String, required: true, index: true },
    distance: { type: String, required: true, enum: ["10k", "5k", "3k"], index: true },
    category: { type: String, default: null },
    /** ISO-8601 duration or hh:mm:ss string, kept as printed by the timing system. */
    grossTime: { type: String, default: null },
    netTime: { type: String, default: null },
    rank: { type: Number, default: null },
    categoryRank: { type: Number, default: null },
    status: {
      type: String,
      enum: ["finished", "dns", "dnf"],
      default: "finished",
      index: true,
    },
    lastCheckpoint: { type: String, default: null },
    provisional: { type: Boolean, default: true },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

resultSchema.index({ registrationId: 1 }, { unique: true });
resultSchema.index({ distance: 1, rank: 1 });

export const Result = model("Result", resultSchema);
