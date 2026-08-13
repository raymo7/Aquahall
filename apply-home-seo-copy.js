const fs = require('fs');
const file = 'components/HomeSections.jsx';
let text = fs.readFileSync(file, 'utf8');

const replacements = [
  ['DOORSTEP VEHICLE CARE · KURAVILANGADU', 'MOBILE CAR WASH · KOTTAYAM'],
  ['Care for your car, even when life keeps you away.', 'Doorstep car wash in Kottayam — we bring the water and power.'],
  ['Serving Kuravilangadu and nearby areas', 'Mobile car wash across our Kottayam service area'],
];

for (const [from, to] of replacements) {
  if (text.includes(from)) text = text.replace(from, to);
  else console.warn('Could not find:', from);
}

fs.writeFileSync(file, text);
console.log('HomeSections SEO copy updated.');
