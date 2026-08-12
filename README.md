# Aqua Haul

Aqua Haul is a mobile-first doorstep vehicle-care and mobile car-wash booking platform for the Kuravilangadu/Kottayam area. The production stack uses Next.js, React, Neon PostgreSQL, Google Maps Platform, Resend, Vercel, WhatsApp and UPI.

The application supports route-aware booking, multiple vehicles per booking, car and heavy-vehicle pricing, optional add-ons, a same-location 3-car offer, Vehicle Care Visit bookings, admin management, audit exports, real-media galleries, owner email notifications and WhatsApp confirmation.

---

## Production Overview

| Area | Service |
|---|---|
| Frontend / server | Next.js 16 + React 19 |
| Hosting / deployment | Vercel |
| Source control | GitHub |
| Database | Neon PostgreSQL |
| Address search | Google Places API (New) |
| Driving distance / travel time | Google Routes API |
| Email | Resend |
| Customer confirmation | WhatsApp `wa.me` |
| Payment | UPI / Google Pay deep links + Pay Onsite |
| Icons | Lucide React / React Icons |
| Styling | Tailwind CSS 4 |

Repository:

```text
https://github.com/raymo7/Aquahall.git
```

Production site:

```text
https://aquahaulktym.space
```

---

# Main Business Rules

## Complete Care Wash

Includes:

- Foam Wash
- Underbody Wash
- Interior Detailing

Current base prices:

| Vehicle | Price |
|---|---:|
| 5-Seater | ₹800 |
| 7-Seater | ₹900 |
| Luxury | ₹1,000 |

## Heavy Vehicle Wash

| Heavy vehicle | Price |
|---|---:|
| 6 Wheel Tipper | ₹2,000 |
| 10 Wheel Truck | ₹2,500 |
| 12 Wheel Truck | ₹2,800 |
| JCB / Hitachi | ₹3,000 |
| Mini Excavator | ₹2,000 |

Heavy vehicles are not eligible for Vehicle Care Visit or the 3-car group discount.

## Vehicle Care Visit

Price:

```text
₹1,000 per car
```

Designed for vehicles left unused or for customers away from home. The flow can include a basic visual check, start-up, short run/drive where safe and permitted, Complete Care Wash and a photo/video update.

## Same-location group offer

```text
3 or more cars at the same location → 10% off the Complete Care Wash base amount
```

Rules:

- All vehicles must be cars.
- Heavy vehicles are excluded.
- Vehicle Care Visit is excluded.
- The booking must contain at least 3 eligible cars.
- Server-side pricing is authoritative; client input cannot force the discount.

## Add-ons

| Add-on | Price |
|---|---:|
| Ceramic Wash | ₹100 |
| Engine Bay Cleaning | From ₹100 |
| AC Vent Steaming | ₹150 |
| Interior Steaming | ₹150 |
| Seat Cleaning | From ₹100 |
| Water Spot Removal | Price after inspection |
| Glossy Effect | ₹100 |

Condition-based services remain estimates until inspected.

## Booking fee

```text
₹60
```

Customers can also choose Pay Onsite.

---

# Booking Slots and Service Area

The application currently uses four booking slots:

```text
8:00 AM–10:00 AM
11:30 AM–1:30 PM
3:00 PM–5:00 PM
6:30 PM–8:30 PM
```

The normal online service radius is:

```text
20 km
```

Distance is calculated using the Google Routes API, not straight-line distance.

The base should be configured in:

```text
lib/scheduling.js
```

Desired business base:

```text
Aqua Haul Base Station
Google Maps: https://maps.app.goo.gl/M7a5JuUPiyfF3y736
Latitude: 9.7239929
Longitude: 76.5471905
```

Customer-facing wording should use:

```text
Distance from Aqua Haul Base Station: X km
```

rather than exposing internal coordinate or route logic.

Route-aware availability considers:

- distance from the Aqua Haul base station
- bookings already assigned to that date
- previous booking location
- next booking location
- blocked slots
- route travel time
- preparation / safety buffer
- whether a slot has already started
- last-minute WhatsApp-only situations

---

# Project Structure

The exact repository may evolve, but the important areas are:

```text
Aquahall/
├── app/
│   ├── api/
│   │   ├── admin/
│   │   ├── availability/
│   │   ├── booking/
│   │   ├── enquiry/
│   │   ├── mark-paid/
│   │   ├── payment-qr/
│   │   └── places/
│   ├── book/
│   ├── gallery/
│   ├── services/
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/
│   ├── AdminPanel.jsx
│   ├── BookingForm.jsx
│   ├── Gallery.jsx
│   ├── HomeSpotlight.jsx
│   ├── MobileBottomNav.jsx
│   ├── PageShell.jsx
│   ├── PricingSection.jsx
│   ├── SiteFooter.jsx
│   └── SiteHeader.jsx
├── lib/
│   ├── auth.js
│   ├── availability.js
│   ├── db.js
│   ├── email.js
│   ├── maps.js
│   ├── pricing.js
│   ├── scheduling.js
│   └── upi.js
├── public/
│   └── gallery/
├── schema.sql
├── package.json
└── README.md
```

---

# Environment Variables

Create `.env.local` for local development. In production, configure the same secrets in Vercel.

```env
# Database
DATABASE_URL=postgresql://...

# Google Maps Platform - server side
GOOGLE_MAPS_API_KEY=...
GOOGLE_MAPS_ROUTES_API_KEY=...

# Resend
RESEND_API_KEY=re_...
EMAIL_FROM=Aqua Haul <notifications@aquahaulktym.space>
OWNER_EMAILS=aquahaul360@gmail.com,rayrey311@gmail.com

# Admin
ADMIN_PASSWORD=...
SESSION_SECRET=use-a-long-random-secret-at-least-32-characters

# UPI
NEXT_PUBLIC_UPI_ID=your-upi-id
NEXT_PUBLIC_UPI_PAYEE_NAME=Aqua Haul
```

Never commit real secrets to GitHub.

## Vercel environment scope

For production, set each required variable for:

```text
Production
```

If Preview deployments need to work fully, also enable:

```text
Preview
```

After changing an environment variable, redeploy. An already-running deployment does not automatically rebuild with newly added values.

---

# Google Maps Platform

Aqua Haul uses two server-side Google API keys.

## `GOOGLE_MAPS_API_KEY`

Used for:

- Places Autocomplete (New)
- Place Details

The server calls Google Places endpoints from `lib/maps.js`.

## `GOOGLE_MAPS_ROUTES_API_KEY`

Used for:

- Google Routes API
- `directions/v2:computeRoutes`
- driving distance
- route-aware travel duration
- slot availability calculation

## Required Google Cloud services

At minimum, ensure these APIs are enabled in the same Google Cloud project used by the keys:

```text
Places API (New)
Routes API
```

Billing must be active on the Google Cloud project. A disabled or invalid billing account can cause:

```text
403 PERMISSION_DENIED
The caller does not have permission
```

even when the API key itself is correct.

## API-key security

The keys are used server-side and should stay in Vercel environment variables.

Recommended restrictions:

- restrict each key to only the APIs it requires
- do not expose the Routes key through `NEXT_PUBLIC_*`
- if application restrictions cause Vercel requests to fail, validate the restriction configuration before assuming the application code is broken

---

# API Routes

## `POST /api/booking`

Creates a customer booking.

Responsibilities include:

- request validation
- phone validation
- vehicle validation
- multiple vehicle handling
- heavy-vehicle rules
- group-offer eligibility
- server-side price calculation
- Google route-aware availability validation
- slot conflict protection
- Neon booking insertion
- owner booking email
- returning the created booking to the frontend

The server recalculates eligibility and pricing; browser values are not trusted as authoritative.

## `POST /api/availability`

Input includes:

```json
{
  "date": "YYYY-MM-DD",
  "latitude": 0,
  "longitude": 0
}
```

Returns route-aware slot availability, distance from base and whether the location is outside the normal service area.

## `POST /api/places/autocomplete`

Server-side proxy to Google Places Autocomplete (New).

Typical input:

```json
{
  "input": "Kuravilangadu",
  "sessionToken": "..."
}
```

## `POST /api/places/details`

Looks up the selected Google Place and returns its formatted address and coordinates.

## `POST /api/enquiry`

Stores a contact/enquiry record in Neon and sends an owner notification email.

## `POST /api/mark-paid`

Marks the ₹60 booking fee as paid and can trigger the owner payment email.

## `GET /api/payment-qr`

Generates or returns UPI payment QR data used by the payment UI.

## Admin APIs

Admin routes are protected using a signed HTTP-only session cookie.

Important routes include:

```text
POST /api/admin/login
GET  /api/admin/bookings
POST /api/admin/slots
```

Depending on the currently applied admin patch, the project may also include routes for manual bookings and recording the final audited amount.

Admin sessions are signed using:

```text
SESSION_SECRET
```

Admin password comparison uses:

```text
ADMIN_PASSWORD
```

The session lifetime in `lib/auth.js` is 12 hours.

---

# Database

Database provider:

```text
Neon PostgreSQL
```

Connection:

```env
DATABASE_URL=...
```

Database operations are server-side through:

```text
@neondatabase/serverless
```

## `bookings`

The bookings table stores operational and audit data including:

- booking ID
- customer name
- phone
- optional legacy email
- vehicle type
- vehicle model
- vehicle category
- multiple vehicles JSON
- vehicle count
- service type
- package
- selected add-ons
- calculated services
- group-offer status
- Vehicle Care metadata
- house address
- map address
- landmark / legacy location details
- Google place ID
- latitude / longitude
- booking date
- booking time
- slot ID
- notes
- amount
- payment method
- paid status / paid time
- booking status
- distance from base
- travel time from previous job
- travel time to next job
- location status
- created time

## `enquiries`

Stores contact-form enquiries.

## `blocked_slots`

Stores slots manually blocked from the admin dashboard.

A partial unique index prevents two active bookings from occupying the same date/slot while allowing cancelled bookings to release the slot.

## Schema installation / upgrade

Run:

```text
schema.sql
```

inside the Neon SQL Editor connected to the same database referenced by `DATABASE_URL`.

The schema file uses `create table if not exists` and `add column if not exists` for several migrations, so it is intended to be safe for incremental application. Always back up important production data before manually changing production schema.

---

# Email / Resend

Email logic is in:

```text
lib/email.js
```

Notifications are used for:

- new booking
- booking fee marked paid
- new enquiry

## Multiple owner recipients

Use:

```env
OWNER_EMAILS=aquahaul360@gmail.com,rayrey311@gmail.com
```

The updated `lib/email.js` included with this README sends to each configured owner individually and logs the exact recipient if delivery fails.

This is preferable operationally because one bad recipient does not prevent the other owner from receiving the notification.

## Important: `onboarding@resend.dev` limitation

This is the likely reason a second owner email does not receive notifications.

If you use:

```env
EMAIL_FROM=Aqua Haul <onboarding@resend.dev>
```

Resend treats it as a testing sender. Resend only permits the testing domain to send to the email address associated with the Resend account.

Adding a second address to the JavaScript `to` array does not remove that restriction.

### Production fix

Verify a domain you control in the Resend dashboard.

Since the Aqua Haul website is hosted at:

```text
aquahaulktym.space
```

a suitable sender after verification would be:

```env
EMAIL_FROM=Aqua Haul <notifications@aquahaulktym.space>
```

The mailbox does not necessarily need to exist for Resend to send from a verified domain, although a real reply-capable address is recommended.

### Domain verification

In Resend:

1. Open **Domains**.
2. Add your sending domain or a dedicated subdomain.
3. Resend will provide DNS records.
4. Add those records in the DNS provider managing `aquahaulktym.space`.
5. Wait until Resend reports the domain as verified.
6. Change `EMAIL_FROM` in Vercel.
7. Redeploy.
8. Test a booking.
9. Check the Resend **Emails / Logs** screen for delivery status to both recipients.

For email isolation, a subdomain such as:

```text
mail.aquahaulktym.space
```

can also be used if preferred.

---

# Local Development

## Clone

```bash
git clone https://github.com/raymo7/Aquahall.git
cd Aquahall
```

## Install

```bash
npm install
```

Node version expected by `package.json`:

```text
>=20 <25
```

## Create local environment

Create:

```text
.env.local
```

and populate the environment variables documented above.

## Database

Run `schema.sql` in Neon.

## Start development

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Production build check

Before pushing important changes:

```bash
npm run build
```

Do not rely only on `npm run dev`; Vercel performs a production build and can detect prerender, CSS and server-component errors that may not appear during normal development.

---

# Deployment to Vercel

## Initial deployment

1. Push the repository to GitHub.
2. Import the GitHub repository into Vercel.
3. Confirm the framework is detected as Next.js.
4. Add production environment variables.
5. Connect the correct Neon `DATABASE_URL`.
6. Run `schema.sql` against that Neon database.
7. Enable the required Google Cloud APIs and billing.
8. Verify the Resend sending domain.
9. Deploy.

## Normal deployment workflow

```bash
git add .
git commit -m "Update Aqua Haul"
git push origin main
```

Vercel automatically builds and deploys the configured production branch.

## After changing environment variables

Redeploy from Vercel.

## After database changes

Run the necessary SQL in Neon first, then deploy application code that depends on the new fields.

---

# Production Checklist

Before considering a release healthy, test:

- Home page loads without layout shifts
- Services page
- Gallery photos
- Gallery video playback
- mobile browser Back behavior inside gallery viewer
- Booking: 1 car
- Booking: 3 eligible cars
- Booking: mixed cars + heavy vehicle
- Heavy vehicle pricing
- Vehicle Care Visit
- Add-ons
- Google Places search
- Use Current Location
- base-station distance
- available slots
- route conflict handling
- outside 20 km handling
- booking insertion in Neon
- WhatsApp confirmation
- owner email 1
- owner email 2
- ₹60 payment-fee flow
- admin login
- admin booking list
- admin status changes
- audit / export features currently installed

---

# Troubleshooting

## Google Maps returns 403 / `PERMISSION_DENIED`

Check:

- Google Cloud billing is active
- Places API (New) is enabled
- Routes API is enabled
- correct project
- correct API key in Vercel
- key API restrictions
- environment-variable spelling
- redeployment after environment changes

## Places search works but route calculation fails

Check `GOOGLE_MAPS_ROUTES_API_KEY` separately. Places and Routes use separate environment variables in the current code.

## Booking succeeds but email does not arrive

The booking route deliberately catches email errors after storing the booking, so a Resend failure should not normally delete a successful booking.

Check:

- Vercel function logs
- Resend delivery logs
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `OWNER_EMAILS`
- Resend domain verification
- spam folder

If the sender is `onboarding@resend.dev`, only the Resend account owner's email can receive normal test messages. Verify your own domain for multiple real recipients.

## Database error

Check:

- `DATABASE_URL`
- Neon project is active
- `schema.sql` has been applied
- latest required columns exist
- Vercel uses the same database you updated

## Slot appears unavailable

Possible reasons include:

- already booked
- admin blocked
- slot already started
- location outside service area
- insufficient travel time from previous/next booking
- last-minute request requiring WhatsApp

---

# Security

- Never commit `.env.local`.
- Never expose `DATABASE_URL`.
- Never expose `RESEND_API_KEY`.
- Never expose `GOOGLE_MAPS_ROUTES_API_KEY`.
- Never expose `ADMIN_PASSWORD`.
- Never expose `SESSION_SECRET`.
- Rotate a secret immediately if it is posted publicly.
- Keep privileged database and third-party API operations in server-side code.
- Keep admin session cookies HTTP-only.
- Validate pricing and discounts server-side.
- Continue treating UPI payment as manually verified until a real payment gateway/webhook is added.

---

# Media / Gallery

Real media is stored under:

```text
public/gallery/
```

Current optimized gallery media may use:

```text
public/gallery/real/
public/gallery/real/thumbs/
```

Video posters should be valid non-empty JPG files. Gallery video cards can safely use direct poster images such as:

```text
/gallery/real/featured-aqua-haul.jpg
```

rather than depending on generated thumbnail files that may be empty.

YouTube:

```text
https://youtube.com/@aquahaul
```

---

# Useful Commands

```bash
npm install
npm run dev
npm run build
npm start
```

Git:

```bash
git status
git add .
git commit -m "Update Aqua Haul"
git push origin main
```

---

# Contact

**Aqua Haul**

Clean and Go.

Owner/business email:

```text
aquahaul360@gmail.com
```

The public contact numbers and WhatsApp number should be maintained in the relevant site component/configuration used by the current deployment.

---

## Maintenance note

This README should be updated whenever any of the following change:

- pricing
- service radius
- base station
- booking slots
- Google APIs
- database schema
- environment-variable names
- Resend sender domain
- owner recipients
- admin workflow
- payment workflow
