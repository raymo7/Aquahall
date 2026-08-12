const fs = require('fs');

const file = 'components/BookingForm.jsx';
let text = fs.readFileSync(file, 'utf8');

const badVariants = [
  "/^[^\\\\s@]+@[^\\\\s@]+\\\\.[^\\\\s@]+$/",
  "/^[^\\\\\\\\s@]+@[^\\\\\\\\s@]+\\\\\\\\.[^\\\\\\\\s@]+$/",
];

let replaced = false;

for (const bad of badVariants) {
  if (text.includes(bad)) {
    text = text.replace(
      bad,
      "/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/",
    );
    replaced = true;
    break;
  }
}

// Also make validation tolerant of accidental leading/trailing spaces.
text = text.replace(
  "if (form.email && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(form.email))",
  "if (form.email?.trim() && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(form.email.trim()))",
);

if (!replaced && !text.includes("form.email?.trim()")) {
  throw new Error('Could not locate the email validation line. Check BookingForm.jsx manually.');
}

fs.writeFileSync(file, text);
console.log('Fixed BookingForm email validation.');
