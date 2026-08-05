# Aqua Haul

Aqua Haul is a mobile-first car wash booking website built with Next.js, Neon PostgreSQL, Resend, WhatsApp, and UPI payment support.

The platform allows customers to choose a vehicle category, select a wash package, schedule a service, choose between advance payment or onsite payment, and send the complete booking details to Aqua Haul through WhatsApp.

## Features

- Mobile-first responsive design
- Multi-step booking experience
- 5-seater and 7-seater pricing
- Standard and Premium packages
- Optional add-on services
- Live booking total
- Date and time slot selection
- Exact 10-digit phone validation
- Pay Advance or Pay Onsite
- Google Pay and UPI deep-link support
- Downloadable UPI QR code
- WhatsApp booking confirmation with full customer details
- Neon PostgreSQL booking storage
- Resend owner email notifications
- Booking reference generation
- Admin booking management
- Mark bookings as paid or completed
- Gallery, pricing, enquiry, payment, and contact sections
- Sticky mobile navigation
- Back-to-top navigation
- Responsive header and mobile menu

## Pricing

| Vehicle category | Standard | Premium |
|---|---:|---:|
| 5-Seater | ₹800 | ₹1,000 |
| 7-Seater | ₹900 | ₹1,100 |

Additional services may increase the final amount.

## Technology Stack

- [Next.js](https://nextjs.org/)
- React
- Tailwind CSS
- Neon PostgreSQL
- Resend
- Vercel
- Lucide React
- React Icons
- WhatsApp `wa.me` links
- UPI deep links

## Project Structure

```text
Aquahall/
├── app/
│   ├── api/
│   │   ├── booking/
│   │   ├── enquiry/
│   │   ├── mark-paid/
│   │   └── payment-qr/
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/
│   ├── AdminPanel.jsx
│   ├── BackToTop.jsx
│   ├── BookingForm.jsx
│   ├── EnquiryForm.jsx
│   ├── Gallery.jsx
│   ├── Hero.jsx
│   ├── MobileBottomNav.jsx
│   ├── PaymentPanel.jsx
│   ├── PricingSection.jsx
│   ├── SiteFooter.jsx
│   ├── SiteHeader.jsx
│   └── StandalonePayment.jsx
├── lib/
│   ├── db.js
│   ├── email.js
│   ├── pricing.js
│   └── upi.js
├── public/
│   ├── gallery/
│   ├── icon.png
│   └── logo.jpg
├── schema.sql
├── package.json
├── postcss.config.mjs
└── README.md
```

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/raymo7/Aquahall.git
cd Aquahall
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create an environment file

Create:

```text
.env.local
```

Add:

```env
DATABASE_URL=your_neon_postgresql_connection_string
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=Aqua Haul <onboarding@resend.dev>
SESSION_SECRET=your_64_character_secret

NEXT_PUBLIC_UPI_ID=your_upi_id
NEXT_PUBLIC_UPI_PAYEE_NAME=Aqua Haul
```

Do not commit `.env.local`.

### 4. Configure the database

Create a Neon project, open the Neon SQL Editor, and run:

```text
schema.sql
```

This creates or updates the required booking and enquiry tables.

### 5. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Vercel Deployment

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Add all required environment variables.
4. Deploy the project.
5. Run `schema.sql` in the Neon database connected through `DATABASE_URL`.

Required Vercel environment variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `RESEND_API_KEY` | Resend API key |
| `EMAIL_FROM` | Resend sender address |
| `SESSION_SECRET` | Random 64-character session secret |
| `NEXT_PUBLIC_UPI_ID` | Business UPI ID |
| `NEXT_PUBLIC_UPI_PAYEE_NAME` | Payee name shown in UPI apps |

Recommended sender while using Resend's free test domain:

```env
EMAIL_FROM=Aqua Haul <onboarding@resend.dev>
```

## Changing Business Details

### Owner notification email

Edit:

```text
lib/email.js
```

Update:

```js
const OWNER_EMAILS = ['rayrey311@gmail.com'];
```

### WhatsApp booking number

Edit:

```text
components/BookingForm.jsx
```

Update the number using country code without `+`, spaces, or hyphens:

```js
const WHATSAPP_NUMBER = '918921167141';
```

### UPI ID

Recommended method:

```env
NEXT_PUBLIC_UPI_ID=yourname@upi
```

You can also change the fallback in:

```text
lib/upi.js
```

### Payee name

```env
NEXT_PUBLIC_UPI_PAYEE_NAME=Aqua Haul
```

### Gallery images

Upload real photos into:

```text
public/gallery/
```

Example:

```text
public/gallery/foam-wash.jpg
public/gallery/interior-detailing.jpg
public/gallery/engine-cleaning.jpg
```

Then update:

```text
components/Gallery.jsx
```

## Booking Flow

1. Customer selects vehicle type.
2. Customer chooses Standard or Premium.
3. Customer selects optional extras.
4. Customer enters personal, vehicle, schedule, and address details.
5. Customer selects:
   - Pay Onsite
   - Pay Advance
6. Booking is stored in Neon.
7. WhatsApp opens with the complete booking information.
8. Aqua Haul verifies the booking and payment manually.

## Payment Flow

The website supports UPI payment through:

- Google Pay deep links
- Android UPI intents
- iPhone Google Pay links
- Downloadable QR code
- Copyable UPI ID

Important:

The current implementation launches a UPI app but does not automatically verify whether payment succeeded. Payment confirmation remains manual unless a payment gateway with webhook support is integrated.

Suitable future gateways include:

- Razorpay
- Cashfree
- PhonePe Payment Gateway
- PayU

## WhatsApp Behaviour

The booking button saves the booking before opening WhatsApp.

The WhatsApp message can include:

- Booking reference
- Customer name
- Phone number
- Vehicle category
- Vehicle model
- Package
- Add-ons
- Date
- Time
- Address
- Amount
- Payment method
- Notes

A website cannot send a WhatsApp message automatically from the customer's account. The customer must press **Send** inside WhatsApp.

## Resend Limitation

When using:

```text
onboarding@resend.dev
```

Resend may only deliver emails to the email address registered with the Resend account.

To send confirmation emails to arbitrary customer addresses, verify a custom sending domain in Resend.

## Mobile UX

The mobile version includes:

- Sticky header
- Full-screen mobile menu
- Bottom navigation
- Central Book button
- Active section highlighting
- Back-to-top button
- Smooth section scrolling
- Safe-area spacing for iPhone
- Auto-scroll to the top of each booking step
- Reduced section spacing on mobile

## Useful Commands

Run development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Run production server:

```bash
npm start
```

Commit changes:

```bash
git add .
git commit -m "Update Aqua Haul"
git push origin main
```

## Troubleshooting

### Booking fails

Check:

- `DATABASE_URL` exists in Vercel
- `schema.sql` was run in the correct Neon project
- Required columns exist
- Vercel logs show no database errors

### Email is not received

Check:

- `RESEND_API_KEY`
- `EMAIL_FROM`
- Resend dashboard logs
- Spam and Promotions folders
- Recipient restrictions for `resend.dev`

### UPI app does not open

Try:

- Android Chrome
- iPhone with Google Pay installed
- Downloading the QR
- Copying the UPI ID manually

### Favicon does not update

Use:

```text
app/icon.png
```

Then redeploy and hard-refresh the browser because favicon files are often cached.

## Security Notes

- Never commit `.env.local`
- Never expose `DATABASE_URL`
- Never expose `RESEND_API_KEY`
- Rotate any secret accidentally posted publicly
- Keep all database writes inside server-side API routes
- Validate customer input on both client and server
- Verify payments manually until a payment gateway is integrated

## Future Improvements

- Dedicated `/book` route
- Dedicated `/gallery` route
- Customer booking status page
- Payment gateway webhook integration
- Admin authentication
- Booking filters and analytics
- Customer reviews
- Coupon codes
- Subscription wash plans
- Loyalty and referral programme
- Automated WhatsApp Business Platform notifications

## License

This project is intended for Aqua Haul business use.

## Contact

**Aqua Haul**

Mobile car wash service across Kottayam district.

Email:

```text
aquahaul360@gmail.com
```

WhatsApp booking number:

```text
+91 89211 67141
```
