// Single source of truth for pricing. Imported by the booking form for the
// live total, and by the API route to recompute the price server-side —
// never trust a price submitted from the browser.

export const CORE_SERVICES = [
  { id: 'foam', name: 'Foam Wash' },
  { id: 'steam', name: 'Steam Wash' },
  { id: 'engine', name: 'Engine Cleaning' },
  { id: 'interior', name: 'Interior Detailing' },
  { id: 'ac', name: 'AC & Interior Steaming' },
];

export const PACKAGES = {
  standard: { id: 'standard', name: 'Standard', price: 800, includes: ['foam', 'interior'] },
  premium: { id: 'premium', name: 'Premium', price: 1000, includes: ['foam', 'steam', 'engine', 'interior', 'ac'] },
};

export const HEAVY_VEHICLE_PRICE = 1200;
export const ALACARTE_PRICE = 100;

export const VEHICLE_TYPES = [
  { value: 'Hatchback', category: 'car' },
  { value: 'Sedan', category: 'car' },
  { value: 'SUV / MUV', category: 'car' },
  { value: 'Pickup / Van', category: 'car' },
  { value: 'Heavy Vehicle (Truck / Bus / Machinery)', category: 'heavy' },
];

export function categoryForVehicle(vehicleType) {
  return VEHICLE_TYPES.find((v) => v.value === vehicleType)?.category || 'car';
}

/**
 * Resolve which core service ids are actually included, and the total price.
 * alacarte: array of core service ids the customer added on top.
 */
export function resolveBooking({ vehicleType, packageId, alacarte = [] }) {
  const category = categoryForVehicle(vehicleType);
  const cleanAlacarte = Array.isArray(alacarte) ? [...new Set(alacarte)].filter((id) => CORE_SERVICES.some((s) => s.id === id)) : [];

  if (category === 'heavy') {
    const services = ['heavy', ...cleanAlacarte];
    const amount = HEAVY_VEHICLE_PRICE + cleanAlacarte.length * ALACARTE_PRICE;
    return { category, packageId: null, services, alacarte: cleanAlacarte, amount };
  }

  const pkg = PACKAGES[packageId] || PACKAGES.standard;
  const extras = cleanAlacarte.filter((id) => !pkg.includes.includes(id));
  const services = [...new Set([...pkg.includes, ...extras])];
  const amount = pkg.price + extras.length * ALACARTE_PRICE;
  return { category, packageId: pkg.id, services, alacarte: extras, amount };
}
