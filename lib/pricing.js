export const BOOKING_FEE = 60;

export const CORE_SERVICES = [
  { id: 'foam', name: 'Foam Wash', price: 0, included: true, selectable: false },
  { id: 'interior', name: 'Interior Detailing', price: 0, included: true, selectable: false },
  { id: 'ceramic', name: 'Ceramic Wash', price: 100, selectable: true },
  { id: 'enginebay', name: 'Engine Bay Cleaning', price: 100, selectable: true },
  { id: 'acvent', name: 'AC Vent Steaming', price: 100, selectable: true },
  { id: 'interiorsteam', name: 'Interior Steaming', price: 100, selectable: true },
  { id: 'seatclean', name: 'Seat Cleaning', price: 100, selectable: true },
  { id: 'waterspot', name: 'Waterspot Removal', price: null, priceText: 'Subject to area', selectable: true },
  { id: 'glossy', name: 'Glossy Effect', price: 100, selectable: true },
  // Legacy IDs remain readable for older bookings, but are not shown as selectable add-ons.
  { id: 'steam', name: 'Steam Wash', price: 100, selectable: false },
  { id: 'engine', name: 'Engine Cleaning', price: 100, selectable: false },
  { id: 'ac', name: 'AC & Interior Steaming', price: 150, selectable: false },
];

export const PACKAGES = {
  complete: {
    id: 'complete',
    name: 'Complete Care Wash',
    includes: ['foam', 'interior'],
    description: 'Foam wash and interior detailing at your doorstep.',
  },
};

export const VEHICLE_TYPES = [
  { value: '5-Seater', category: 'car', description: 'Hatchback, sedan or 5-seat SUV' },
  { value: '7-Seater', category: 'car', description: 'Innova, Ertiga, Carens and similar' },
  { value: 'Luxury', category: 'luxury', description: 'Premium and luxury vehicles' },
  { value: 'Heavy Vehicle', category: 'heavy', description: 'Truck, bus or machinery' },
];

export const VEHICLE_PACKAGE_PRICES = {
  '5-Seater': { complete: 800 },
  '7-Seater': { complete: 900 },
  Luxury: { complete: 1000 },
};

export const HEAVY_VEHICLE_PRICE = 1200;
export const ALACARTE_PRICE = 100;

export function categoryForVehicle(vehicleType) {
  return VEHICLE_TYPES.find((vehicle) => vehicle.value === vehicleType)?.category || 'car';
}

export function priceForPackage(vehicleType) {
  return VEHICLE_PACKAGE_PRICES[vehicleType]?.complete ?? 800;
}

export function addOnPrice(id) {
  const price = CORE_SERVICES.find((service) => service.id === id)?.price;
  return Number.isFinite(price) ? price : 0;
}

export function addOnPriceLabel(id, prefix = '+') {
  const service = CORE_SERVICES.find((item) => item.id === id);
  if (!service) return `${prefix}₹${ALACARTE_PRICE}`;
  if (!Number.isFinite(service.price)) return service.priceText || 'Price on inspection';
  return `${prefix}₹${service.price}`;
}

export function hasVariablePriceAddon(alacarte = []) {
  return Array.isArray(alacarte) && alacarte.some((id) => !Number.isFinite(CORE_SERVICES.find((service) => service.id === id)?.price));
}

export function resolveBooking({ vehicleType, alacarte = [] }) {
  const category = categoryForVehicle(vehicleType);
  const cleanAlacarte = Array.isArray(alacarte)
    ? [...new Set(alacarte)].filter((id) => CORE_SERVICES.some((service) => service.id === id && service.selectable))
    : [];

  if (category === 'heavy') {
    return {
      category,
      packageId: null,
      services: ['heavy', ...cleanAlacarte],
      alacarte: cleanAlacarte,
      amount: HEAVY_VEHICLE_PRICE + cleanAlacarte.reduce((sum, id) => sum + addOnPrice(id), 0),
      variablePricing: hasVariablePriceAddon(cleanAlacarte),
    };
  }

  const pkg = PACKAGES.complete;
  const extras = cleanAlacarte.filter((id) => !pkg.includes.includes(id));
  return {
    category,
    packageId: pkg.id,
    services: [...pkg.includes, ...extras],
    alacarte: extras,
    amount: priceForPackage(vehicleType) + extras.reduce((sum, id) => sum + addOnPrice(id), 0),
    variablePricing: hasVariablePriceAddon(extras),
  };
}
