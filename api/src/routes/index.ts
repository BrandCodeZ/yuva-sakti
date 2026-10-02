import { Router } from "express";
import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { asyncHandler, clientIp, parsedBody, validateBody } from "../middleware/validate.js";
import { ApiError } from "../middleware/error.js";
import { notifyLimiter, submissionLimiter } from "../middleware/rate-limit.js";
import { Interest } from "../models/interest.model.js";
import { NotifySubscriber } from "../models/notify.model.js";
import { Registration } from "../models/registration.model.js";
import { ContactMessage } from "../models/contact.model.js";
import { VolunteerApplication } from "../models/volunteer.model.js";
import { PartnerEnquiry } from "../models/partner.model.js";
import { renderTemplate, sendMailQuietly } from "../services/mailer.js";
import { ageOn, generateRegistrationId, raceDay } from "../services/ids.js";
import {
  contactSchema,
  interestSchema,
  notifySchema,
  partnerSchema,
  registrationSchema,
  volunteerSchema,
  type ContactInput,
  type InterestInput,
  type NotifyInput,
  type PartnerInput,
  type RegistrationInput,
  type VolunteerInput,
} from "../validators/schemas.js";

export const router = Router();

const TERMS_VERSION = "draft-1";
const DISTANCE_LABEL: Record<string, string> = {
  "10k": "10 KM",
  "5k": "5 KM",
  "3k": "3 KM",
};

function requireOpen() {
  if (!env.acceptSubmissions) {
    throw new ApiError(
      503,
      "Registration is temporarily closed. Please check back shortly.",
    );
  }
}

/**
 * Separate from requireOpen: interest stays open right up to launch day, while
 * full registration closes when the fee and payment link are live.
 *
 * Deliberately a middleware that runs *before* validateBody, so a closed
 * registration returns 503 for any payload. Running the gate afterwards would
 * let a 400 leak the shape of a form nobody is allowed to fill in.
 */
function requireRegistrationOpen(
  _req: Request,
  _res: Response,
  next: NextFunction,
): void {
  if (!env.acceptSubmissions) {
    next(
      new ApiError(
        503,
        "Registration is temporarily closed. Please check back shortly.",
      ),
    );
    return;
  }
  if (!env.registrationOpen) {
    next(
      new ApiError(
        503,
        "Registration is not open yet. The date and fee are still being finalised — please register your interest instead.",
      ),
    );
    return;
  }
  next();
}

/** ------------------------------------------------------- register interest */

router.post(
  "/interests",
  submissionLimiter,
  validateBody(interestSchema),
  asyncHandler(async (req, res) => {
    requireOpen();
    const body = parsedBody<InterestInput>(res);

    // A short readable reference so someone who registered interest can quote
    // it back to us before they ever get a registration ID.
    const interest = await Interest.create({
      reference: generateRegistrationId(new Date().getFullYear()),
      fullName: body.fullName,
      email: body.email,
      mobile: body.mobile,
      distance: body.distance,
      hearAbout: body.hearAbout || null,
      ip: clientIp(req),
    });

    const message = renderTemplate({
      heading: "We have your interest",
      body: [
        `Thanks ${body.fullName.split(" ")[0]}, your interest in the ${DISTANCE_LABEL[body.distance]} is recorded.`,
        `Your reference: ${interest.reference}`,
        "The date and venue are being finalised. We will email you the moment registration opens, with the fee for every distance, and you will get a reserved place in your distance.",
        "You only need to confirm your details when registration opens. Nothing to pay now.",
      ],
      cta: { label: "See what is already confirmed", url: `${env.webUrl}/races` },
      footer: "Yuva Shakti Run, Delhi — Strong Youth, Strong Nation",
    });

    const interestMail = await sendMailQuietly({ to: interest.email, subject: "Yuva Shakti Run — interest recorded", ...message });

    res.status(201).json({
      message: interestMail
        ? "Interest recorded. Check your email — the date and fee will come to you first."
        : `Interest recorded as ${interest.reference}. We could not send the confirmation email just now, so please keep this reference.`,
      emailed: interestMail,
      data: {
        registrationId: interest.reference,
        bib: null,
        mode: "interest",
        name: interest.fullName,
        email: interest.email,
        distance: DISTANCE_LABEL[interest.distance],
        amountPaid: null,
        currency: null,
        createdAt: interest.createdAt.toISOString(),
      },
    });
  }),
);

/** ------------------------------------------------------------------ notify */

router.post(
  "/notify",
  notifyLimiter,
  validateBody(notifySchema),
  asyncHandler(async (req, res) => {
    requireOpen();
    const body = parsedBody<NotifyInput>(res);

    const existing = await NotifySubscriber.findOne({
      email: body.email,
      preferredRace: body.preferredRace ?? null,
    });

    // Re-subscribing is normal rather than an error: say so, but still let them
    // change which distance they want to hear about.
    if (existing) {
      if (body.preferredRace && existing.preferredRace !== body.preferredRace) {
        await NotifySubscriber.updateOne(
          { _id: existing._id },
          { $set: { preferredRace: body.preferredRace } },
        );
        res.status(200).json({
          message: `Updated. We will email you about the ${DISTANCE_LABEL[body.preferredRace]} when the date is locked.`,
        });
        return;
      }

      res.status(200).json({
        message: "You are already on the list for that distance. We will email you once.",
      });
      return;
    }

    await NotifySubscriber.create({
      email: body.email,
      preferredRace: body.preferredRace || null,
      source: "hero",
      ip: clientIp(req),
    });

    res.status(201).json({
      message: "Done. We will email you the moment the date is locked.",
    });
  }),
);

/** ------------------------------------------------------------ registration */

router.post(
  "/registrations",
  submissionLimiter,
  requireRegistrationOpen,
  validateBody(registrationSchema),
  asyncHandler(async (req, res) => {
    const body = parsedBody<RegistrationInput>(res);

    const dateOfBirth = new Date(body.dateOfBirth);
    const ageAtRaceDay = ageOn(dateOfBirth, raceDay());

    const registration = await Registration.create({
      registrationId: generateRegistrationId(new Date().getFullYear()),
      distance: body.distance,
      fullName: body.fullName,
      dateOfBirth,
      ageAtRaceDay,
      gender: body.gender,
      email: body.email,
      mobile: body.mobile,
      alternateMobile: body.alternateMobile || null,
      city: body.city,
      state: body.state,
      tshirtSize: body.tshirtSize,
      club: body.club || null,
      hearAbout: body.hearAbout || null,
      emergencyName: body.emergencyName,
      emergencyMobile: body.emergencyMobile,
      bloodGroup: body.bloodGroup || null,
      medicalConditions: body.medicalConditions || null,
      medicalConsentAt: body.medicalConditions ? new Date() : null,
      acceptTerms: true,
      acceptTermsAt: new Date(),
      termsVersion: TERMS_VERSION,
      photographyConsent: body.photographyConsent,
      guardianName: ageAtRaceDay < 18 ? (body.guardianName || null) : null,
      guardianConsent: ageAtRaceDay < 18 ? body.guardianConsent : false,
      ip: clientIp(req),
      userAgent: req.headers["user-agent"] ?? null,
    });

    const message = renderTemplate({
      heading: "Your Yuva Shakti Run entry is recorded",
      body: [
        `Thanks ${registration.fullName.split(" ")[0]}. Your ${DISTANCE_LABEL[registration.distance]} entry is recorded.`,
        `Registration ID: ${registration.registrationId}`,
        `T-shirt size: ${registration.tshirtSize}`,
        ageAtRaceDay < 18
          ? `Guardian consent recorded from ${registration.guardianName}.`
          : "Bring a photo ID and this reference to bib collection.",
        "The entry fee is confirmed before payment opens. You will get an email with the amount and a payment link, and nothing is charged until you pay.",
      ],
      cta: { label: "Participant guide", url: `${env.webUrl}/participant-guide` },
    });

    const registrationMail = await sendMailQuietly({
      to: registration.email,
      subject: `Yuva Shakti Run — registration ${registration.registrationId}`,
      ...message,
    });

    res.status(201).json({
      message: registrationMail
        ? "Registered. Your reference is in your inbox."
        : `Registered as ${registration.registrationId}. We could not send the confirmation email just now, so please save this reference.`,
      emailed: registrationMail,
      data: {
        registrationId: registration.registrationId,
        bib: registration.bib,
        mode: "registration",
        name: registration.fullName,
        email: registration.email,
        distance: DISTANCE_LABEL[registration.distance],
        amountPaid: registration.amountPaid,
        currency: registration.currency,
        createdAt: registration.createdAt.toISOString(),
      },
    });
  }),
);

/** ----------------------------------------------------------------- contact */

router.post(
  "/contact",
  submissionLimiter,
  validateBody(contactSchema),
  asyncHandler(async (req, res) => {
    requireOpen();
    const body = parsedBody<ContactInput>(res);

    await ContactMessage.create({
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      topic: body.topic,
      message: body.message,
      ip: clientIp(req),
    });

    const message = renderTemplate({
      heading: "We have your message",
      body: [
        `Thanks ${body.name}, your message about "${body.topic}" has reached the organising team.`,
        "We reply within 2 working days. If it is urgent, call the number in the footer of the site.",
      ],
      footer: "Yuva Shakti Run, Delhi",
    });

    const contactMail = await sendMailQuietly({ to: body.email, subject: "Yuva Shakti Run — we have your message", ...message });

    if (env.organiserEmail) {
      const notice = renderTemplate({
        heading: `New contact message: ${body.topic}`,
        body: [`From: ${body.name} <${body.email}>`, body.message],
      });
      await sendMailQuietly({
        to: env.organiserEmail,
        subject: `[Yuva Shakti Run] Contact — ${body.topic}`,
        ...notice,
        replyTo: body.email,
      });
    }

    res.status(201).json({
      message: contactMail
        ? "Message sent. We reply within 2 working days."
        : "Message received and saved. We could not send the confirmation email, but your message is with the organising team.",
      emailed: contactMail,
    });
  }),
);

/** --------------------------------------------------------------- volunteer */

router.post(
  "/volunteers",
  submissionLimiter,
  validateBody(volunteerSchema),
  asyncHandler(async (req, res) => {
    requireOpen();
    const body = parsedBody<VolunteerInput>(res);

    const existing = await VolunteerApplication.findOne({ phone: body.phone });
    if (existing) {
      await VolunteerApplication.updateOne(
        { _id: existing._id },
        {
          $set: {
            name: body.name,
            email: body.email || null,
            city: body.city || null,
            availability: body.availability,
            role: body.role,
            message: body.message || null,
          },
        },
      );
      res.status(200).json({
        message:
          "You are already on the volunteer list — we have updated your details and will be in touch.",
      });
      return;
    }

    await VolunteerApplication.create({
      name: body.name,
      phone: body.phone,
      email: body.email || null,
      city: body.city || null,
      availability: body.availability,
      role: body.role,
      message: body.message || null,
      ip: clientIp(req),
    });

    const message = renderTemplate({
      heading: "You are on the volunteer list",
      body: [
        `Thanks ${body.name}. We have your preference for "${body.role}" and your availability "${body.availability}".`,
        body.email
          ? "You will get a role, a briefing time and a contact number at least one week before race day. If you picked a medical role, we will ask for your certification."
          : "You did not leave an email, so we will call you on the number you gave to confirm your role and briefing time.",
      ],
      cta: { label: "Participant guide", url: `${env.webUrl}/participant-guide` },
    });

    if (body.email) {
      await sendMailQuietly({
        to: body.email,
        subject: "Yuva Shakti Run — volunteer signup confirmed",
        ...message,
      });
    }

    res.status(201).json({
      message: "Signed up. We will email your role and briefing time before race day.",
    });
  }),
);

/** ----------------------------------------------------------------- partner */

router.post(
  "/partners",
  submissionLimiter,
  validateBody(partnerSchema),
  asyncHandler(async (req, res) => {
    requireOpen();
    const body = parsedBody<PartnerInput>(res);

    await PartnerEnquiry.create({
      organisation: body.organisation,
      contactName: body.contactName,
      email: body.email,
      phone: body.phone || null,
      tier: body.tier,
      message: body.message,
      ip: clientIp(req),
    });

    const message = renderTemplate({
      heading: "Partnership enquiry received",
      body: [
        `Thanks ${body.contactName}. We have your enquiry from ${body.organisation} about the "${body.tier}" tier.`,
        "We reply within 2 working days with our media plan and what each tier includes. Nothing is binding until both sides sign.",
      ],
      cta: { label: "Sponsorship tiers", url: `${env.webUrl}/sponsors` },
    });

    const partnerMail = await sendMailQuietly({
      to: body.email,
      subject: "Yuva Shakti Run — partnership enquiry",
      ...message,
    });

    if (env.organiserEmail) {
      const notice = renderTemplate({
        heading: `New partnership enquiry: ${body.tier}`,
        body: [`${body.organisation} — ${body.contactName} <${body.email}>`, body.message],
      });
      await sendMailQuietly({
        to: env.organiserEmail,
        subject: `[Yuva Shakti Run] Partnership — ${body.organisation}`,
        ...notice,
        replyTo: body.email,
      });
    }

    res.status(201).json({
      message: partnerMail
        ? "Enquiry sent. We will reply within 2 working days with the media plan."
        : "Enquiry received and saved. We could not send the confirmation email, but your enquiry is with the organising team.",
      emailed: partnerMail,
    });
  }),
);
