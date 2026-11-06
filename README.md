# Granitebrook Builders — Contractor Website Demo

**Project 03 of the Virellion Apex portfolio.** This is a complete, multi-page website for a fictional
general contractor. It shows how Virellion Apex helps construction companies attract customers,
capture qualified leads, and look professional online.

> **Demonstration disclaimer:** This website is a demonstration project developed by Virellion Apex.
> Company identity, project examples, testimonials, and business details are fictional.
> All forms run in **demo mode**. They validate input and show a confirmation, but **nothing is sent or stored on a server**.

- **Stack:** HTML5, CSS3, vanilla JavaScript. No frameworks, no build step, no npm, no paid APIs, no API keys.
- **Hosting target:** GitHub plus Cloudflare Pages (free tier).
- **Planned subdomain:** `contractor.virellionapex.com`. This is a placeholder; it is **not configured yet**.

---

## 1. What's included

| Page | Key features |
|---|---|
| `index.html` | Hero with CTAs, animated stats, company intro, 8 featured services, "why choose us", before/after slider, featured projects, service-area map and ZIP checker, testimonial carousel, CTA band |
| `about.html` | Company story, values, 4-step process, team (initials only, no fake headshots), placeholder credentials, **photo credits** |
| `services.html` | All 8 services (General Contracting, Residential, Commercial, Remodeling, Electrical, Plumbing, Roofing, Custom) with a sticky jump-nav, deep links, "Request a Quote" buttons that pre-fill the quote form, and an FAQ accordion |
| `projects.html` | 12 sample projects, category filtering (All / Residential / Commercial / Remodeling / Before & After) with live counts, shareable filter URLs (`projects.html#commercial`), lightbox gallery with keyboard, swipe and thumbnails, and 3 before/after sliders |
| `testimonials.html` | Rating summary computed from the data, service filter, 9 clearly labeled **fictional** testimonials, and a star-rating feedback form that shows a preview only |
| `quote.html` | 3-step quote wizard with every required field, validation, phone formatting, draft auto-save in this browser, URL pre-fill (`quote.html?service=roofing`), a ballpark cost estimator that can be added to the request, and a confirmation with a summary and reference number |
| `contact.html` | Business info, a live "Open now / Closed" status, hours table, service area, ZIP checker, tabbed **appointment scheduler** (calendar, simulated availability and time slots), and a contact form |
| `404.html` | Branded not-found page (Cloudflare Pages serves it automatically) |

Built in across the site: sticky header, accessible mobile menu, mobile call/estimate action bar, back-to-top button, reveal animations that respect `prefers-reduced-motion`, a disclaimer in every footer, and a "Request a Website" CTA that links to virellionapex.com.

## 2. File structure

```
contractor-demo/
├── index.html, about.html, services.html, projects.html,
│   testimonials.html, quote.html, contact.html, 404.html
├── css/style.css          # All styles. Design tokens are at the top (:root)
├── js/script.js           # All behavior. CONFIG, PROJECTS and TESTIMONIALS are at the top
├── images/
│   ├── logo.png           # Brand mark (512×512)
│   ├── hero.jpg           # Fallback hero graphic (shown if the hero photo can't load)
│   ├── og-image.jpg       # Social-sharing preview (1200×630)
│   └── projects/          # Put local project photos here (see its README)
├── assets/                # Favicons and apple-touch-icon
├── _headers               # Cloudflare Pages security and cache headers
├── robots.txt, sitemap.xml
└── README.md
```

All paths are relative except in `404.html`, which uses root-relative paths because it can be served at any URL depth. The site works from any folder or domain.

## 3. Run it locally

You can open `index.html` directly. A local server is closer to production, though (URL pre-fill and hash filters behave exactly the same):

```bash
cd contractor-demo
python3 -m http.server 8080
# open http://localhost:8080
```

## 4. Deploy: GitHub + Cloudflare Pages

**A. Push to GitHub**

```bash
cd contractor-demo
git init
git add .
git commit -m "Granitebrook Builders contractor demo"
git branch -M main
git remote add origin https://github.com/lilmoniisenterprise/contractor-demo.git
git push -u origin main
```

(Create the empty `contractor-demo` repository on github.com first: **New repository**, no README.)

**B. Connect Cloudflare Pages**

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Select `contractor-demo` → **Begin setup**.
3. Framework preset **None**, build command *(leave empty)*, build output directory `/`.
4. **Save and Deploy.** You get a URL like `https://contractor-demo.pages.dev`.

**C. Optional custom subdomain**

1. In the Pages project → **Custom domains** → **Set up a custom domain** → `contractor.virellionapex.com`.
2. If virellionapex.com's DNS is on Cloudflare, the CNAME record is created automatically. Otherwise, add a `CNAME contractor → contractor-demo.pages.dev` record at your DNS host.
3. Wait for SSL to show **Active**, then open the URL and test every page before announcing it.

**D. After the domain is live,** update the placeholder domain everywhere:
search the project for `contractor.virellionapex.com`, which appears in the canonical, `og:url`, `og:image`, `robots.txt` and `sitemap.xml`.

Every push to `main` redeploys automatically.

## 5. Content replacement guide (turning the demo into a real client site)

| What | Where |
|---|---|
| Company name, tagline, phone, email, address, hours | Header/footer in each HTML file, `contact.html`, and `CONFIG.hours` in `js/script.js` |
| Colors and fonts | `:root` tokens at the top of `css/style.css` and the Google Fonts `<link>` in each `<head>` |
| Logo and favicons | Replace `images/logo.png` and the files in `assets/` (keep the file names) |
| Service area and ZIP checker | `CONFIG.serviceTowns` / `CONFIG.serviceZips` in `js/script.js`, plus the list and map on `index.html` |
| Projects | The `PROJECTS` array in `js/script.js`. Each entry has `cats`, `images`, and optional `before`/`after` |
| Testimonials | The `TESTIMONIALS` array in `js/script.js`. **Use only genuine, verifiable reviews.** Remove the "sample" badges and notes when you do |
| Stats and credentials | `index.html` stats strip and `about.html` credentials (real license and insurance numbers) |
| Cost estimator ranges | `RATES` in `initEstimator()`. Replace them with the contractor's real pricing logic or remove the estimator |
| Demo notices | Remove the `.demo-bar` and the `.demo-note` blocks, and update the confirmation text, **only after** forms are connected to a real backend |
| Search indexing | Delete `<meta name="robots" content="noindex, follow">` from every page once the business is real |

**Replacing photos.** Project images are Unsplash photo IDs that go through the `img()` helper. To use local files, put them in `images/projects/` and write the path directly in the `images` array, for example `"images/projects/kitchen-1.jpg"`. The helper detects paths automatically. Page-level images are ordinary `<img src>` / `background-image` URLs in the HTML.

## 6. Connecting real lead capture (secure options)

All form submissions go through **one function**, `submitLead(type, data)` in `js/script.js`. It is controlled by:

```js
var CONFIG = { demoMode: true, formEndpoint: "" , ... };
```

**Never put API keys, SMTP passwords or CRM tokens in `script.js`.** Anything in front-end code is public.

**Option A: Cloudflare Pages Function (recommended, free tier).**
Create `functions/api/lead.js` in the repository. The function receives the JSON, validates it again on the server, verifies a spam token, and forwards it to email or a CRM using secrets stored in **Pages → Settings → Environment variables (encrypted)**. Then set `demoMode: false` and `formEndpoint: "/api/lead"`.

```js
// functions/api/lead.js (outline)
export async function onRequestPost({ request, env }) {
  const body = await request.json();
  // 1. validate required fields server-side
  // 2. verify Cloudflare Turnstile token with env.TURNSTILE_SECRET
  // 3. send via an email API (e.g. Resend/Postmark) using env.EMAIL_API_KEY,
  //    or store in Cloudflare D1, or POST to a CRM webhook
  return Response.json({ ok: true });
}
```

**Option B: hosted form service** (Formspree, Basin, Getform). Point `formEndpoint` at the service's public endpoint. These endpoints are designed to be public, so no secret is exposed. Free tiers are limited, and paid plans are usually needed for higher volume or file uploads.

**Spam protection:** every form already has a hidden honeypot field (`company_website`). For production, add **Cloudflare Turnstile** (free) and verify the token server-side.

**Privacy:** add a privacy policy page and a consent statement before collecting real customer data.

## 7. Connecting real appointment scheduling

The scheduler on `contact.html` simulates availability. For real bookings, choose one:

1. **Embed a scheduling service** (Calendly, Cal.com, Acuity, Google Calendar appointment schedules). Replace the `#scheduler` block with the provider's embed and add its domain to `_headers` (`script-src`, `frame-src`, `connect-src`). Cal.com and Google appointment schedules have free tiers. Calendly's free plan allows one event type.
2. **Keep this custom UI** and back it with a Pages Function that reads free/busy times from the contractor's calendar API (Google Calendar or Microsoft Graph) using server-side OAuth credentials, returns open slots, and creates the event. This takes more work, but the branded experience stays the same.

In both cases, send a confirmation email from the server. Never trust the client's chosen slot without checking availability again on the server.

## 8. Accessibility, SEO and performance notes

- Semantic landmarks, skip link, one `<h1>` per page, labeled form controls, `aria-invalid` and linked error messages, keyboard-operable gallery, sliders, tabs, accordion, calendar and star rating, a focus trap in the lightbox, and visible focus states.
- Each page has its own `<title>`, meta description, canonical URL, Open Graph and Twitter tags. The homepage has `GeneralContractor` JSON-LD (labeled as a demonstration).
- No JS libraries. CSS and JS are each one file. Images lazy-load with explicit dimensions. `_headers` adds caching and a strict Content-Security-Policy.

## 9. Testing checklist (completed in headless Chrome before delivery)

- [x] All 7 pages load with no JavaScript errors. All internal links and anchors resolve.
- [x] Mobile menu opens and closes (button, backdrop, Escape) and its links navigate.
- [x] Project filters show the correct counts (12 / 5 / 4 / 3 / 3), and `#hash` filters work.
- [x] Lightbox opens and handles next/previous, arrow keys and Escape. Before/after sliders respond.
- [x] Quote wizard blocks invalid steps, shows field errors, formats phone, pre-fills from `?service=`, adds the estimator result, and shows a confirmation with a summary.
- [x] Scheduler requires a date and time, disables Sundays, past dates and booked slots, and confirms.
- [x] Contact and feedback forms validate and confirm. ZIP checker accepts and rejects correctly.
- [x] No horizontal overflow at 320, 390, 768 and 1440 px widths.

Re-test on the live Cloudflare URL after deployment, including real photo loading. The build sandbox could not reach Unsplash.

## 10. Photo licensing

Photos are hotlinked from Unsplash under the [Unsplash License](https://unsplash.com/license). Photographer credits are on `about.html#credits`. Photos illustrate the kind of work a contractor might show. **They are not real Granitebrook projects.** Before-and-after pairs do not show the same property.

---

© Virellion Apex · https://virellionapex.com
