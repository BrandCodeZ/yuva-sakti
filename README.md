# Yuva Shakti Run: Website Resource Specification

**Version:** 1.0 draft · **Event:** Yuva Shakti Run, Delhi · **Tagline:** Strong Youth, Strong Nation **Races:** 10 KM · 5 KM · 3 KM · **Instagram:** [@yuvashaktirun](https://www.instagram.com/yuvashaktirun)

---

## 1. Purpose and scope

A multi-page website that gives participants one trustworthy place to learn about the run, register, and find race information. The reference site (faridabadhalfmarathon.in) is a single-page-style site with sub-pages; this project keeps its strong ideas (clear race cards, countdown, certificate/results flow, partner wall, emergency contact) and builds a distinct identity for Yuva Shakti.

### Decisions made from your brief

| Item | Decision |
| --- | --- |
| Event name | **Yuva Shakti Run**. Your message spelled it "Sakti" in one place; the uploaded file uses "Shakti". This spec uses *Shakti*. Confirm the final spelling before any printing or domain purchase. |
| Date and venue | **To be announced (TBA).** The site must work fully without them (see section 4). |
| Uploaded file | Your draft hardcodes *Sunday, 29 November 2026*, "Registrations Open", and flag-off times. Remove all of these until confirmed. Reuse its palette, race categories and "Why we run" content. |
| Theme | Tricolour (saffron/orange, black, green) with a light/dark toggle. |
| Languages | English first, Hindi toggle in phase 2 (your draft already has a हिंदी link). |

---

## 2. What to borrow, and what to change from the reference

**Borrow:** top-bar countdown, three-chapter "Why we run" story, race cards with flag-off and format, route map page, prize money page, rules and policies page, results and certificate pages, medical emergency number in the footer, sponsor logo wall.

**Do not copy:** its text, images, layout details, or claims (AIMS certification, RFID timing, participant counts, prize money). Use such claims only if they are true for your event and you have proof.

**Improve:** add an FAQ, a participant guide, volunteer sign-up, a mobile-first registration flow, and real photography instead of stock graphics.

---

## 3. Sitemap and page specifications

```
Home
About
 └ Our Story · Team · Cause/Charity (if any)
Races (10K · 5K · 3K)
Route Map
Participant Guide (race kit, bib collection, what to bring, parking)
Registration
Rules & Policies
FAQ
Sponsors & Partners
Gallery
Volunteer
Results & Certificate (locked until after race day)
Contact Us
Privacy · Terms · Refund Policy
```

### Home

1. **Top bar:** countdown (or "Date to be announced") and a Register button.
2. **Hero:** "Yuva Shakti Run", tagline "Strong Youth, Strong Nation", "Delhi · Date & venue to be announced", primary button Register Interest or Register Now, secondary button View Races. Use a real photograph of runners, not an illustration.
3. **Quick facts strip:** 3 distances · Delhi · Date TBA · Open to all ages (confirm age rules).
4. **Why we run:** three short chapters (Run for youth, Run together, Run stronger) from your draft.
5. **Race cards:** 10K, 5K, 3K with format, age eligibility, and fee (once set).
6. **What you get:** bib, t-shirt, finisher medal, certificate, refreshments (list only what is confirmed).
7. **Latest updates:** a dated news feed ("Venue announced", "Registration opens"). This shows people the event is active.
8. **Partners strip, Instagram feed, and a short FAQ preview.**
9. **Footer:** navigation, contact email, phone, emergency number, social links, copyright.

### About Us

Who is organising (name the organisation and people), why the run exists, what Yuva Shakti means, past events if any, and the impact goal. Include named organisers with photos and roles. Named people are the strongest trust signal for a first-year event.

### Races

One section per distance: route summary, flag-off time (TBA), timing method (timed or fun run), eligibility, cut-off, fee, add-to-calendar button (enabled once the date is set), and a **Register for this race** button that pre-selects the category.

### Route Map

Embedded map image plus downloadable PDF, start/finish, water points, medical points, toilets, and a per-distance elevation note. Show "Route will be published after venue confirmation" until ready.

### Participant Guide

Bib collection (date, place, documents to carry), race-day timeline, parking and metro access, baggage deposit, hydration and medical support, weather advice, and the code of conduct.

### Registration

See section 6.

### Rules & Policies

Eligibility, age limits and guardian consent, timing and cut-offs, bib transfer, refund and cancellation policy, medical disclaimer, photography consent, and disqualification rules. Write these in plain language and have a lawyer review them.

### FAQ

Grouped accordion: Registration, Race day, Kit, Safety, Results. Start with 12 to 15 real questions.

### Sponsors & Partners

Logo wall in tiers, plus a **Become a partner** form that goes to the sponsorship email.

### Gallery

Starts with launch/promo photos. After the event: bib-searchable photo links.

### Volunteer

Short form: name, phone, city, availability, role preference. Volunteers help with credibility and logistics.

### Results & Certificate

Hidden or shown as "Coming after race day" until the event. After the event: bib or name search, finish time, rank, and personalised downloadable certificate.

### Contact Us

Form (name, email, phone, topic dropdown, message), organiser email, phone/WhatsApp, Instagram link, venue address once known, map embed, and expected response time ("We reply within 2 working days").

---

## 4. Date and venue TBA logic

All date-dependent elements are controlled by **one config file**, so adding the date later is a single edit.

```json
{
  "eventDate": null,
  "eventStartTime": null,
  "venueName": null,
  "venueAddress": null,
  "registrationOpen": false
}
```

| Condition | Behaviour |
| --- | --- |
| `eventDate` is null | Countdown hidden. Show a badge: **"Date & venue to be announced"** and a "Notify me" email box. |
| `eventDate` is set | Countdown appears automatically (days, hours, minutes, seconds) in the top bar and on Home. Calendar buttons and the "Race Day" section unlock. |
| Countdown reaches zero | Switch to "Race day is here", then to "Results coming soon". |
| `registrationOpen` is false | Register buttons read **"Register Interest"** and collect name, email, phone and preferred distance. |
| `venueName` is null | Route, parking and directions show "Published after venue confirmation". |

The countdown must use the **Asia/Kolkata (IST)** time zone, and must display correctly for users in any time zone.

---

## 5. Visual design system

### 5.1 Colour tokens

Contrast note: white text on bright orange (#F47B20) is only about 2.9:1, which fails accessibility guidelines. Use **black text on orange buttons**, and use a deeper orange for orange text on white.

| Token | Light theme | Dark theme |
| --- | --- | --- |
| `--bg` | `#FAF7F2` (warm off-white) | `#0F100F` |
| `--surface` | `#FFFFFF` | `#181A18` |
| `--text` | `#161816` | `#F2EFE9` |
| `--muted` | `#5C625C` | `#A5ABA5` |
| `--saffron` (buttons, accents) | `#F47B20` | `#FF8F3A` |
| `--saffron-text` (text on white) | `#B85300` | `#FF9A4D` |
| `--green` | `#138808` | `#3DBB4C` |
| `--line` | `#E4DFD6` | `#2A2D2A` |

Use the three colours with purpose: saffron for calls to action, green for success states and secondary accents, black/ink for text and the footer. Do not paint every section in all three.

### 5.2 Typography

Your draft uses Anton, Inter and Poppins, which is a very common combination on generated sites. Suggested alternative: a strong condensed display face for headlines (for example *Bebas Neue* or *Oswald*) with a readable body face (for example *Source Sans 3* or *Mukta*, which also supports Devanagari for the Hindi version). Limit to two families.

### 5.3 How to avoid an "AI-made" look

- Use **real photographs** from running clubs, the organising team, and local landmarks. If none exist yet, commission a short shoot or use licensed photos.
- Write copy in a direct, local voice. Avoid generic phrases such as "unleash your potential" and "elevate your journey". Say who, where, and what.
- Vary section layouts. Avoid repeating the same three identical cards with icons on every page.
- Limit gradients, glow effects, and glassmorphism. Prefer flat colour, strong type, and photography.
- Use specific numbers and names (organiser names, real distances, real phone numbers).
- Keep animation light: a subtle reveal on scroll and a countdown. Nothing that loops constantly.
- Use hand-picked details that reflect Delhi and youth culture (a landmark silhouette, a local phrase).

---

## 6. Registration page specification

**Flow:** Choose race → Participant details → Emergency and medical → Review → Payment (when enabled) → Confirmation email with registration ID.

**Fields:**

| Group | Fields |
| --- | --- |
| Race | Distance (10K / 5K / 3K), t-shirt size |
| Person | Full name (as on ID), date of birth, gender, email, mobile, city, state |
| Safety | Emergency contact name and phone, blood group (optional), medical conditions (optional) |
| Extras | Running club or institution (optional), how did you hear about us |
| Consent | Terms and waiver, photography consent, guardian consent if under 18 |

**Rules:** one email and phone verification, duplicate detection, mobile-first single-column layout, autosave of progress, clear error messages, and a confirmation page with a downloadable receipt. Payment gateway (for example Razorpay) is to be added once fees are fixed. Until then, run the **Register Interest** mode.

---

## 7. Theme toggle specification

- Toggle button in the header (sun/moon icon) with an accessible label.
- Default to the user's system setting (`prefers-color-scheme`), then remember their choice in the browser.
- Apply the theme before first paint to avoid a white flash.
- All colours come from the tokens in 5.1. Photographs get a slight brightness reduction in dark mode, and logos need a light and a dark variant.

---

## 8. Features that build participant confidence

1. Named organisers and a visible "Official" contact (email, phone, WhatsApp).
2. Clear refund policy and timeline for announcements.
3. Medical partner and emergency number in the footer.
4. Dated updates feed and an Instagram feed that shows real activity.
5. Add-to-calendar and share buttons.
6. Downloadable participant guide and route PDFs.
7. A "Notify me" email capture while the date is TBA.
8. Post-event: results, certificate, and photo gallery.
9. Social proof: testimonials and photos from earlier events, if any.
10. Accessibility: category for differently-abled runners if you plan one.

---

## 9. Technical requirements

| Area | Requirement |
| --- | --- |
| Build | Static or server-rendered site (for example Next.js or Astro) so each page has its own URL and is indexable. Avoid a JavaScript-only single page. |
| Responsive | Mobile-first. Most participants will arrive from Instagram on a phone. |
| Performance | Largest Contentful Paint under 2.5 s on 4G. Compress images (WebP/AVIF), lazy-load below the fold. Avoid embedding multi-megabyte images in the HTML (your uploaded file is about 2.4 MB). |
| SEO | Unique title and description per page, Open Graph image, `sitemap.xml`, `robots.txt`, structured data (`SportsEvent`) once the date is set. |
| Accessibility | WCAG 2.1 AA: contrast, keyboard navigation, focus states, alt text, reduced-motion support. |
| Forms | Server-side validation, spam protection (CAPTCHA or honeypot), email confirmations. |
| Data | Store registrations securely and collect only what is needed. Publish a privacy policy that follows India's Digital Personal Data Protection Act, 2023. |
| Analytics | Privacy-friendly analytics, plus conversion tracking for registrations. |
| Hosting | CDN-backed hosting, HTTPS, and a custom domain (for example yuvashaktirun.in, if available). |
| Social | Instagram link in header/footer, feed embed (optional), share cards. |

---

## 10. Content and assets needed from you

**Brand:** final name spelling, logo (SVG/PNG, light and dark versions), brand colour confirmation. **Content:** organiser details, about/story text, charity or cause (if any), eligibility rules, fees, kit contents, contact email and phone, emergency/medical partner. **Media:** 10 to 20 real photographs, one short promo video (optional), sponsor logos. **Legal:** terms, waiver, refund policy, privacy policy, and any permissions required for events in Delhi (confirm requirements with the relevant authorities). **Open decisions:** domain name, payment gateway, timing method per distance, age limits, whether prize money is offered, and whether Hindi is needed at launch.

---

## 11. Delivery phases

| Phase | Deliverables |
| --- | --- |
| 1. Pre-announcement launch | Home, About, Races, Register Interest, Contact, FAQ, theme toggle, TBA mode |
| 2. Date and venue announced | Countdown, Route Map, Participant Guide, calendar buttons, full Registration and payment |
| 3. Race month | Rules finalised, Sponsors, Gallery teasers, Volunteer, Hindi version |
| 4. After the event | Results, Certificate, photo gallery, thank-you page |

---

## 12. Acceptance checklist

- [ ] All pages load on a mid-range phone in under 3 seconds.
- [ ] Light and dark themes both pass contrast checks.
- [ ] Setting `eventDate` in config turns on the countdown without code changes.
- [ ] No placeholder or invented claims appear anywhere.
- [ ] Registration and contact forms send confirmation emails.
- [ ] Every page has a unique title, description, and share image.
- [ ] Privacy, terms, and refund pages are published and linked in the footer.
- [ ] Instagram link opens the correct profile.
