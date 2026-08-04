export const CORE_SERVICES = [
  { id: 'foam', name: 'Foam Wash' },
  { id: 'steam', name: 'Steam Wash' },
  { id: 'engine', name: 'Engine Cleaning' },
  { id: 'interior', name: 'Interior Detailing' },
  { id: 'ac', name: 'AC & Interior Steaming' },
];

export const PACKAGES = {
  standard: {
    id: 'standard',
    name: 'Standard',
    includes: ['foam', 'interior'],
    description: 'A complete exterior wash and interior refresh.',
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    includes: ['foam', 'steam', 'engine', 'interior', 'ac'],
    description: 'Our most complete doorstep detailing package.',
  },
};

export const VEHICLE_TYPES = [
  { value: '5-Seater', category: 'car', description: 'Hatchback, sedan or 5-seat SUV' },
  { value: '7-Seater', category: 'car', description: 'Innova, Ertiga, Carens and similar' },
  { value: 'Luxury', category: 'luxury', description: 'Premium and luxury vehicles' },
  { value: 'Heavy Vehicle', category: 'heavy', description: 'Truck, bus or machinery' },
];

export const VEHICLE_PACKAGE_PRICES = {
  '5-Seater': { standard: 800, premium: 1000 },
  '7-Seater': { standard: 900, premium: 1100 },
  Luxury: { standard: 1000, premium: 1300 },
};

export const HEAVY_VEHICLE_PRICE = 1200;
export const ALACARTE_PRICE = 100;

export function categoryForVehicle(vehicleType) {
  return VEHICLE_TYPES.find((vehicle) => vehicle.value === vehicleType)?.category || 'car';
}

export function priceForPackage(vehicleType, packageId) {
  return VEHICLE_PACKAGE_PRICES[vehicleType]?.[packageId] ?? VEHICLE_PACKAGE_PRICES['5-Seater'][packageId] ?? 800;
}

export function resolveBooking({ vehicleType, packageId, alacarte = [] }) {
  const category = categoryForVehicle(vehicleType);
  const cleanAlacarte = Array.isArray(alacarte)
    ? [...new Set(alacarte)].filter((id) => CORE_SERVICES.some((service) => service.id === id))
    : [];

  if (category === 'heavy') {
    const services = ['heavy', ...cleanAlacarte];
    return {
      category,
      packageId: null,
      services,
      alacarte: cleanAlacarte,
      amount: HEAVY_VEHICLE_PRICE + cleanAlacarte.length * ALACARTE_PRICE,
    };
  }

  const pkg = PACKAGES[packageId] || PACKAGES.standard;
  const extras = cleanAlacarte.filter((id) => !pkg.includes.includes(id));
  const services = [...new Set([...pkg.includes, ...extras])];

  return {
    category,
    packageId: pkg.id,
    services,
    alacarte: extras,
    amount: priceForPackage(vehicleType, pkg.id) + extras.length * ALACARTE_PRICE,
  };
}
