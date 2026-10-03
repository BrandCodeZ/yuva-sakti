# Yuva Shakti Run — website

Multi-page Next.js site plus an Express/MongoDB API for the Yuva Shakti Run, Delhi. Built so the site stays fully usable while the date, venue and fees are unconfirmed.

The original brief is preserved in [`SPECIFICATION.md`](./SPECIFICATION.md).

## Requirements

- Node.js 20.9 or newer
- MongoDB running locally, or a reachable connection string

## Setup

```bash
npm install
cp .env.example api/.env
cp .env.example web/.env.local   # or edit only the NEXT_PUBLIC_* lines
```

Then start both apps:

```bash
npm run dev
```

- Web: https://yuva-sakti.onrender.com/
- API: http://localhost:4000 (`/health` confirms it is up)

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Runs the API and the web app together |
| `npm run build` | Production build of both workspaces |
| `npm run lint` | ESLint across both workspaces |
| `npm run typecheck` | `tsc --noEmit` across both workspaces |
| `npm run seed --workspace api` | Imports `api/sample-results.json` into MongoDB |

## Before launch

1. Confirm the event name spelling. The code uses **Shakti**; your first message said *Sakti*.
2. Set the date, venue, flag-off times, fees and age limits in `web/src/config/event.ts`. Every date-dependent element on the site reads from there, including the countdown.
3. Mirror the mode and date in the API environment:
   - `REGISTRATION_OPEN` matches `registrationOpen` in the event config. While it is `false`, interest, notify, contact, volunteer and partner submissions still work, and full registrations return `503`.
   - `RESULTS_PUBLISHED` stays `false` until a timing file is loaded.
   - `EVENT_DATE_ISO` drives the server-side age check and guardian rule.
4. Set `OTP_SECRET`. Generate one with the command in `.env.example` and keep it constant, or codes issued before a change stop verifying.
5. Choose an SMS relay and set `SMS_WEBHOOK_URL`. Without one, mobile verification codes are logged in development and mobile verification fails in production — a runner would wait for a text that never arrives.
6. Add `RESEND_API_KEY` and a real `MAIL_FROM`. Without a key, mail is logged in development and the API refuses to start in production.
7. On MongoDB Atlas, the database user must use SCRAM-SHA-256 and the server's public IP must be under Network Access. Both are documented in `.env.example`, including what to do when your network's DNS resolver refuses `_mongodb._tcp` lookups.
8. Drop real photographs into `web/public/photos/` and fill in `web/src/content/photos.ts`. The site shows labelled placeholders until you do.
9. Have the privacy, terms and refund pages reviewed by an Indian lawyer. They are drafts, not legal advice.

## Not built yet

- Payment (Razorpay) — deliberately deferred until fees are confirmed
- Hindi translation (phase 2)
- Admin interface for reviewing submissions

## Data handling

Registrations collect identity and health information. `/privacy` describes the retention policy. Nothing is logged to a third party other than the mail and SMS providers, and verification codes plus confirmation emails are the only automated messages sent.
