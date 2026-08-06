export const CORE_SERVICES = [
  { id: 'foam', name: 'Foam Wash', price: 100 },
  { id: 'steam', name: 'Steam Wash', price: 100 },
  { id: 'engine', name: 'Engine Cleaning', price: 100 },
  { id: 'interior', name: 'Interior Detailing', price: 100 },
  { id: 'ac', name: 'AC & Interior Steaming', price: 150 },
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
export const AC_STEAM_PRICE = 150;

export function categoryForVehicle(vehicleType) {
  return VEHICLE_TYPES.find((vehicle) => vehicle.value === vehicleType)?.category || 'car';
}

export function priceForPackage(vehicleType) {
  return VEHICLE_PACKAGE_PRICES[vehicleType]?.complete ?? 800;
}

export function addOnPrice(id) {
  return CORE_SERVICES.find((service) => service.id === id)?.price ?? ALACARTE_PRICE;
}

export function resolveBooking({ vehicleType, alacarte = [] }) {
  const category = categoryForVehicle(vehicleType);
  const cleanAlacarte = Array.isArray(alacarte)
    ? [...new Set(alacarte)].filter((id) => CORE_SERVICES.some((service) => service.id === id))
    : [];

  if (category === 'heavy') {
    return {
      category,
      packageId: null,
      services: ['heavy', ...cleanAlacarte],
      alacarte: cleanAlacarte,
      amount: HEAVY_VEHICLE_PRICE + cleanAlacarte.reduce((sum, id) => sum + addOnPrice(id), 0),
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
  };
}
