import { Schema, model } from "mongoose";

const partnerSchema = new Schema(
  {
    organisation: { type: String, required: true, trim: true, maxlength: 160 },
    contactName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, default: null },
    tier: {
      type: String,
      required: true,
      enum: ["title", "co", "community", "support"],
    },
    message: { type: String, required: true, trim: true, maxlength: 4000 },
    repliedAt: { type: Date, default: null },
    ip: { type: String, default: null },
  },
  { timestamps: true },
);

export const PartnerEnquiry = model("PartnerEnquiry", partnerSchema);
