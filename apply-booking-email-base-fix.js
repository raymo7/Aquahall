const fs = require('fs');

const file = 'components/BookingForm.jsx';
let text = fs.readFileSync(file, 'utf8');

function replaceRequired(from, to, label) {
  if (!text.includes(from)) {
    throw new Error(`Could not find ${label}. Your BookingForm may have changed.`);
  }
  text = text.replace(from, to);
}

// 1) Add optional client-side email validation.
replaceRequired(
  "    if (!/^\\d{10}$/.test(form.phone)) nextErrors.phone = `Enter exactly 10 digits (${form.phone.length}/10 entered).`;\n",
  "    if (!/^\\d{10}$/.test(form.phone)) nextErrors.phone = `Enter exactly 10 digits (${form.phone.length}/10 entered).`;\n" +
  "    if (form.email && !/^[^\\\\s@]+@[^\\\\s@]+\\\\.[^\\\\s@]+$/.test(form.email)) nextErrors.email = 'Enter a valid email address or leave it blank.';\n",
  'phone validation'
);

// 2) Let error-focus target the optional email field when an invalid email is entered.
replaceRequired(
  "      phone: 'booking-phone',\n",
  "      phone: 'booking-phone',\n      email: 'booking-email',\n",
  'focus field map'
);

// 3) Add Email (optional) underneath name + phone.
// Keeps Name/Phone as the compact first row, with email as a full-width optional field.
replaceRequired(
  `                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <Field label="Full name" error={fieldErrors.name}><input id="booking-name" className="field" value={form.name} onChange={(event) => update('name', event.target.value)} /></Field>
                      <Field label="Phone" error={fieldErrors.phone}><input id="booking-phone" className="field" inputMode="numeric" maxLength={10} value={form.phone} onChange={(event) => update('phone', event.target.value.replace(/\\D/g, ''))} placeholder="10-digit mobile number" /></Field>
                    </div>
`,
  `                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <Field label="Full name" error={fieldErrors.name}><input id="booking-name" className="field" value={form.name} onChange={(event) => update('name', event.target.value)} /></Field>
                      <Field label="Phone" error={fieldErrors.phone}><input id="booking-phone" className="field" inputMode="numeric" maxLength={10} value={form.phone} onChange={(event) => update('phone', event.target.value.replace(/\\D/g, ''))} placeholder="10-digit mobile number" /></Field>
                    </div>
                    <div className="mt-4">
                      <Field label="Email (optional)" error={fieldErrors.email}>
                        <input
                          id="booking-email"
                          className="field"
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          value={form.email}
                          onChange={(event) => update('email', event.target.value)}
                          placeholder="For booking details, if you want"
                        />
                      </Field>
                    </div>
`,
  'name/phone fields'
);

// 4) Fix customer-facing base wording in WhatsApp availability enquiry.
replaceRequired(
  "    distance != null ? `Approximate distance from Kuravilangadu: ${distance} km` : null,\n",
  "    distance != null ? `Distance from Aqua Haul Base Station: ${distance} km` : null,\n",
  'WhatsApp distance wording'
);

// 5) Fix normal in-area distance display.
replaceRequired(
  `                    {distance != null && !outsideArea && <p className="font-body mt-4 rounded-xl bg-[var(--teal-100)] px-4 py-3 text-sm text-[var(--teal-900)]">Approximate road distance: <strong>{distance} km</strong>{distance > 15 ? ' · Extended service area' : ''}</p>}
`,
  `                    {distance != null && !outsideArea && <p className="font-body mt-4 rounded-xl bg-[var(--teal-100)] px-4 py-3 text-sm text-[var(--teal-900)]">Distance from Aqua Haul Base Station: <strong>{distance} km</strong>{distance > 15 ? ' · Extended service area' : ''}</p>}
`,
  'in-area distance label'
);

// 6) Fix outside-area wording.
replaceRequired(
  `                        <p className="font-body mt-2 text-sm">This location is about <strong>{distance} km</strong> from Kuravilangadu. We may still be able to serve it depending on the route.</p>
`,
  `                        <p className="font-body mt-2 text-sm">This location is about <strong>{distance} km</strong> from the Aqua Haul Base Station. We may still be able to serve it depending on the route.</p>
`,
  'outside-area distance label'
);

fs.writeFileSync(file, text);
console.log('Updated BookingForm.jsx: optional email + Aqua Haul Base Station wording.');
