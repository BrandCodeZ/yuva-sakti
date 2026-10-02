import { Router } from "express";
import { env } from "../config/env.js";
import { ApiError } from "../middleware/error.js";
import { lookupLimiter } from "../middleware/rate-limit.js";
import { asyncHandler } from "../middleware/validate.js";
import { Result } from "../models/result.model.js";
import { resultsQuerySchema } from "../validators/schemas.js";

export const router = Router();

/**
 * Search finished runners by bib number, registration ID or name.
 * Results only exist once the timing file has been imported after the event,
 * so an empty collection returns a clear "not published yet" message rather
 * than an empty array the page has to interpret.
 */
router.get(
  "/results",
  lookupLimiter,
  asyncHandler(async (req, res) => {
    // Pre-event this must not be reachable at all, even if a timing file has
    // been loaded for testing. Flip RESULTS_PUBLISHED only when results are
    // genuinely meant to be public.
    if (!env.resultsPublished) {
      throw new ApiError(
        503,
        "Results are not published yet. They go live within hours of the finish on race day.",
      );
    }

    const parsed = resultsQuerySchema.safeParse({ q: req.query.q });
    if (!parsed.success) {
      res.status(400).json({ message: "Enter a bib number or name to search." });
      return;
    }

    const raw = parsed.data.q.trim();
    const query = raw.startsWith("YSR-") || raw.startsWith("YSR")
      ? { $or: [{ bib: raw.toUpperCase() }, { registrationId: raw.toUpperCase() }] }
      : {
          $or: [
            { name: { $regex: escapeRegex(raw), $options: "i" } },
            { bib: raw.toUpperCase() },
            { registrationId: raw.toUpperCase() },
          ],
        };

    const rows = await Result.find(query).limit(25).lean();

    if (rows.length === 0) {
      const anyPublished = await Result.exists({ publishedAt: { $ne: null } });
      res.status(404).json({
        message: anyPublished
          ? "No finisher matches that. Try the bib number printed on your bib, or the spelling on your registration."
          : "Results are not published yet. They go live within hours of the finish on race day.",
      });
      return;
    }

    res.json({
      data: rows.map((row) => ({
        registrationId: row.registrationId,
        bib: row.bib,
        name: row.name,
        distance: row.distance,
        finishTime: row.grossTime,
        netTime: row.netTime,
        rank: row.rank,
        categoryRank: row.categoryRank,
        status: row.status,
        certificateUrl: `/certificate/${encodeURIComponent(row.registrationId)}`,
      })),
    });
  }),
);

/** A user-supplied string must never be able to inject regex syntax. */
function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
