const fs = require('fs');

const file = 'components/BookingForm.jsx';
let text = fs.readFileSync(file, 'utf8');

const replacements = [
  [
    'Approximate distance from Kuravilangadu: ${distance} km',
    'Distance from Aqua Haul Base Station: ${distance} km',
  ],
  [
    'Approximate road distance: <strong>{distance} km</strong>',
    'Distance from Aqua Haul Base Station: <strong>{distance} km</strong>',
  ],
  [
    'This location is about <strong>{distance} km</strong> from Kuravilangadu.',
    'This location is about <strong>{distance} km</strong> from the Aqua Haul Base Station.',
  ],
];

for (const [from, to] of replacements) {
  if (!text.includes(from)) {
    console.warn(`Could not find: ${from}`);
    continue;
  }
  text = text.replace(from, to);
}

fs.writeFileSync(file, text);
console.log('BookingForm base-station labels updated.');
