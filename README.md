# Aqua Haul — booking site

Mobile car wash booking site for Kottayam district. Booking, pricing, enquiries,
a Google Pay / UPI QR payment flow, and an admin dashboard — with real email
confirmations and no customer data exposed publicly.

## Stack

- **Next.js 16** (App Router) — site + API routes in one project
- **Neon Postgres** — stores bookings and enquiries (nothing client-readable)
- **Resend** — sends booking and payment confirmation emails
- **Vercel** — hosting

## 1. Install

```bash
npm install
```

## 2. Set up the database

1. Push this project to GitHub first (see step 6), then in the Vercel dashboard:
   Project → Storage → Marketplace Database Providers → **Neon** → Connect.
   This auto-fills `DATABASE_URL` in your Vercel project's environment variables.
   (Building locally first? Create a free project at https://neon.tech instead and
   copy its connection string into `.env.local`.)
2. Open the Neon SQL editor (via Vercel's Storage tab, or neon.tech directly) and
   run everything in `schema.sql` once — this creates the `bookings` and
   `enquiries` tables.

## 3. Set up email (Resend)

1. Create a free account at https://resend.com — 3,000 emails/month, 100/day,
   no card required.
2. Copy your API key into `RESEND_API_KEY`.
3. To start, `EMAIL_FROM` can stay as `Aqua Haul <onboarding@resend.dev>` —
   Resend's own shared sender, works immediately. Once you register a real
   domain (see the domain note below), verify it in Resend and switch
   `EMAIL_FROM` to something like `Aqua Haul <bookings@yourdomain.in>` for
   better deliverability and a more trustworthy sender name.

## 4. Set the admin password and session secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use the output as `SESSION_SECRET`. Pick your own `ADMIN_PASSWORD` — this is
what gates the "View bookings" screen in the site footer.

## 5. Environment variables

Copy `.env.example` to `.env.local` for local development and fill in the
values from steps 2–4. For production, add the same variables in Vercel:
Project Settings → Environment Variables. Never commit `.env.local`.

```bash
npm run dev
```

## 6. Push to GitHub

This project already has a local git commit included (`git log` to see it).
Create an empty repository on GitHub (github.com/new — don't initialize it
with a README, so there's nothing to conflict with), then from inside the
project folder:

```bash
git remote add origin https://github.com/YOUR_USERNAME/aqua-haul.git
git branch -M main
git push -u origin main
```

## 7. Deploy

Import the GitHub repo at https://vercel.com/new, add the environment
variables from step 5, and deploy. Every future `git push` redeploys
automatically.

## 8. Domain

`kerala.com` is not a subdomain host (checked — no such business-subdomain
service exists, unlike blogspot.com or vercel.app). Register a real domain
— e.g. `aquahaulktym.in` or `.com` — through any registrar (GoDaddy, BigRock,
Zybosys, or others), then point it at the Vercel project under Project
Settings → Domains.

## How payment confirmation actually works

The Google Pay QR is a direct UPI transfer — the same as someone scanning a
personal QR code — not a payment gateway. **The site cannot verify that a
payment actually happened.** "Marked as paid" (customer button, or you doing
it from the dashboard) is a notification trigger, not proof of payment.
Before relying on a booking as paid, check the transaction actually landed
in your own Google Pay / bank statement.

## Security notes

- Customer and booking data lives only in Postgres, read only by API routes
  running on the server. The browser never receives it unless the admin
  password check on `/api/admin/login` succeeds.
- The admin session is a signed, httpOnly, `secure`, `sameSite=strict`
  cookie — it can't be read or forged from the browser without knowing
  `SESSION_SECRET`, and expires automatically after 12 hours.
- Prices are recalculated server-side from the fixed price list in
  `lib/pricing.js` on every booking — a tampered request from the browser
  can't set an arbitrary amount.
- Booking and enquiry forms include a honeypot field and basic server-side
  validation to cut down on spam; there's no CAPTCHA or rate limiting yet —
  worth adding (e.g. Vercel's built-in Bot Protection, or Upstash Ratelimit)
  if the public forms start attracting abuse.
- All secrets (`DATABASE_URL`, `RESEND_API_KEY`, `ADMIN_PASSWORD`,
  `SESSION_SECRET`) stay server-side — only variables prefixed
  `NEXT_PUBLIC_` are ever sent to the browser, and none of the secrets
  above are.

## SMS

Left out deliberately. Sending transactional SMS to Indian numbers requires
TRAI DLT registration first (business PAN, GST/address proof, sender ID and
message templates all pre-approved) before any provider — Twilio included —
will deliver. Email covers the same confirmations without that hurdle; SMS
can be added later once DLT registration is done.
