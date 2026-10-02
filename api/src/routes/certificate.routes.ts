import { Router } from "express";
import { env } from "../config/env.js";
import { lookupLimiter } from "../middleware/rate-limit.js";
import { asyncHandler } from "../middleware/validate.js";
import { Result } from "../models/result.model.js";
import { escapeHtml } from "../services/mailer.js";

export const router = Router();

const DISTANCE_LABEL: Record<string, string> = {
  "10k": "10 KM",
  "5k": "5 KM",
  "3k": "3 KM",
};

/**
 * A printable certificate. Served as HTML with print CSS so a runner can hit
 * "Save as PDF" in the browser — no PDF library, and nothing pretends to be a
 * signed document.
 */
router.get(
  "/certificate/:registrationId",
  lookupLimiter,
  asyncHandler(async (req, res) => {
    // Certificates are only meaningful once the results are public.
    if (!env.resultsPublished) {
      res
        .status(404)
        .type("html")
        .send(
          page(
            "Certificate not available",
            "<p>Certificates go live with the results, within hours of the finish on race day.</p>",
          ),
        );
      return;
    }

    const registrationId = String(req.params.registrationId ?? "").toUpperCase();
    const result = await Result.findOne({ registrationId }).lean();

    if (!result || result.status !== "finished") {
      res
        .status(404)
        .type("html")
        .send(
          page(
            "Certificate not available",
            "<p>We could not find a finished result for that registration ID. Check the confirmation email for the correct reference, or contact the organisers.</p>",
          ),
        );
      return;
    }

    res.type("html").send(
      page(
        "Yuva Shakti Run — certificate",
        `<p class="kicker">Certificate of completion</p>
         <h1>${escapeHtml(result.name)}</h1>
         <p class="line">finished the <strong>${escapeHtml(
           DISTANCE_LABEL[result.distance] ?? result.distance,
         )}</strong> Yuva Shakti Run, Delhi</p>
         <p class="meta">${escapeHtml(result.grossTime ?? "")} gross ${
           result.netTime ? `&middot; ${escapeHtml(result.netTime)} net` : ""
         } ${result.rank ? `&middot; rank ${result.rank}` : ""}</p>
         <p class="meta">Bib ${escapeHtml(result.bib)} &middot; Registration ${
           result.registrationId
         }</p>`,
        true,
      ),
    );
  }),
);

function page(title: string, body: string, printable = false): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<title>${escapeHtml(title)}</title>
<style>
  :root { color-scheme: light; }
  body { margin: 0; padding: 32px; background: #FAF7F2; color: #161816;
         font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; }
  .sheet { max-width: 720px; margin: 0 auto; background: #fff; padding: 48px;
           border-top: 8px solid #F47B20; border-bottom: 8px solid #138808; }
  .kicker { margin: 0; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; color: #B85300; }
  h1 { margin: 16px 0 8px; font-size: 40px; line-height: 1.1; }
  .line { font-size: 18px; line-height: 1.6; }
  .meta { font-size: 14px; color: #5C625C; }
  .actions { max-width: 720px; margin: 16px auto 0; display: flex; gap: 8px; }
  button { font: inherit; font-weight: 700; padding: 10px 16px; border-radius: 4px;
           border: 2px solid #F47B20; background: #F47B20; color: #000; cursor: pointer; }
  @media print {
    body { background: #fff; padding: 0; }
    .actions { display: none; }
    .sheet { border: 1px solid #ddd; }
  }
</style>
</head>
<body>
  <div class="sheet">${body}</div>
  ${
    printable
      ? '<div class="actions"><button type="button" onclick="window.print()">Print or save as PDF</button></div>'
      : ""
  }
</body>
</html>`;
}
