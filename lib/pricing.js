export const BOOKING_FEE = 60;
export const VEHICLE_CARE_PRICE = 1000;

export const CORE_SERVICES = [
  { id: 'foam', name: 'Foam Wash', price: 0, included: true, selectable: false },
  { id: 'interior', name: 'Interior Detailing', price: 0, included: true, selectable: false },
  { id: 'ceramic', name: 'Ceramic Wash', price: 100, pricingType: 'fixed', selectable: true, animation: 'bead', description: 'A slick finishing wash that helps water bead beautifully.' },
  { id: 'enginebay', name: 'Engine Bay Cleaning', price: 100, pricingType: 'from', selectable: true, animation: 'engine', description: 'Careful cleaning based on grease, dust and overall condition.' },
  { id: 'acvent', name: 'AC Vent Steaming', price: 100, pricingType: 'fixed', selectable: true, animation: 'steam', description: 'Focused steam treatment around the AC vents.' },
  { id: 'interiorsteam', name: 'Interior Steaming', price: 100, pricingType: 'fixed', selectable: true, animation: 'steam', description: 'A refreshing steam pass across key interior surfaces.' },
  { id: 'seatclean', name: 'Seat Cleaning', price: 100, pricingType: 'from', selectable: true, animation: 'scrub', description: 'Deep cleaning priced according to stains, material and condition.' },
  { id: 'waterspot', name: 'Water Spot Removal', price: null, pricingType: 'inspection', priceText: 'Price after inspection', selectable: true, animation: 'spots', description: 'Quoted after checking the affected panels and severity.' },
  { id: 'glossy', name: 'Glossy Effect', price: 100, pricingType: 'fixed', selectable: true, animation: 'shine', description: 'A finishing touch for a cleaner, brighter-looking surface.' },
  { id: 'steam', name: 'Steam Wash', price: 100, selectable: false },
  { id: 'engine', name: 'Engine Cleaning', price: 100, selectable: false },
  { id: 'ac', name: 'AC & Interior Steaming', price: 150, selectable: false },
];

export const PACKAGES = {
  complete: { id: 'complete', name: 'Complete Care Wash', includes: ['foam', 'interior'], description: 'A doorstep reset for the outside and inside of your car.' },
  vehicleCare: { id: 'vehicle-care', name: 'Vehicle Care Visit', includes: ['foam', 'interior'], description: 'For vehicles left unused or owners away from home: a basic visual check, start-up, short run/drive where safe, wash and photo/video update.' },
};

export const VEHICLE_TYPES = [
  { value: '5-Seater', category: 'car', description: 'Hatchback, sedan or 5-seat SUV' },
  { value: '7-Seater', category: 'car', description: 'Innova, Ertiga, Carens and similar' },
  { value: 'Luxury', category: 'luxury', description: 'Premium and luxury vehicles' },
  { value: 'Heavy Vehicle', category: 'heavy', description: 'Truck or machinery' },
];

export const VEHICLE_PACKAGE_PRICES = {
  '5-Seater': { complete: 800 },
  '7-Seater': { complete: 900 },
  Luxury: { complete: 1000 },
};

export const HEAVY_VEHICLE_TYPES = [
  { value: '6-wheel-tipper', label: '6 Wheel Tipper', price: 2000 },
  { value: '10-wheel-truck', label: '10 Wheel Truck', price: 2500 },
  { value: '12-wheel-truck', label: '12 Wheel Truck', price: 2800 },
  { value: 'jcb-hitachi', label: 'JCB / Hitachi', price: 3000 },
  { value: 'mini-excavator', label: 'Mini Excavator', price: 2000 },
];

export const HEAVY_VEHICLE_PRICE = 2000;
export const ALACARTE_PRICE = 100;

export function categoryForVehicle(vehicleType) {
  return VEHICLE_TYPES.find((vehicle) => vehicle.value === vehicleType)?.category || 'car';
}

export function heavyVehiclePrice(heavyType) {
  return HEAVY_VEHICLE_TYPES.find((item) => item.value === heavyType)?.price || HEAVY_VEHICLE_PRICE;
}

export function heavyVehicleLabel(heavyType) {
  return HEAVY_VEHICLE_TYPES.find((item) => item.value === heavyType)?.label || 'Heavy Vehicle';
}

export function priceForPackage(vehicleType) {
  return categoryForVehicle(vehicleType) === 'heavy'
    ? HEAVY_VEHICLE_PRICE
    : (VEHICLE_PACKAGE_PRICES[vehicleType]?.complete ?? 800);
}

export function priceForVehicle(vehicle = {}) {
  return categoryForVehicle(vehicle.type) === 'heavy'
    ? heavyVehiclePrice(vehicle.heavyType)
    : priceForPackage(vehicle.type);
}

export function addOnPrice(id) {
  const price = CORE_SERVICES.find((service) => service.id === id)?.price;
  return Number.isFinite(price) ? price : 0;
}

export function addOnPriceLabel(id, prefix = '+') {
  const service = CORE_SERVICES.find((item) => item.id === id);
  if (!service) return `${prefix}₹${ALACARTE_PRICE}`;
  if (service.pricingType === 'from') return `From ₹${service.price}`;
  if (!Number.isFinite(service.price)) return service.priceText || 'Price after inspection';
  return `${prefix}₹${service.price}`;
}

export function hasVariablePriceAddon(alacarte = []) {
  return Array.isArray(alacarte) && alacarte.some(
    (id) => CORE_SERVICES.find((service) => service.id === id)?.pricingType !== 'fixed',
  );
}

export function resolveBooking({ vehicleType, vehicles, serviceType = 'complete', alacarte = [] }) {
  const vehicleList = Array.isArray(vehicles) && vehicles.length
    ? vehicles
    : [{ type: vehicleType || '5-Seater', model: '' }];

  const categories = vehicleList.map((vehicle) => categoryForVehicle(vehicle.type));
  const hasHeavyVehicle = categories.includes('heavy');
  const allHeavyVehicles = categories.every((category) => category === 'heavy');

  const cleanAlacarte = Array.isArray(alacarte)
    ? [...new Set(alacarte)].filter((id) =>
        CORE_SERVICES.some((service) => service.id === id && service.selectable),
      )
    : [];

  const fixedExtras = cleanAlacarte.filter(
    (id) => CORE_SERVICES.find((service) => service.id === id)?.pricingType === 'fixed',
  );
  const variablePricing = cleanAlacarte.some(
    (id) => CORE_SERVICES.find((service) => service.id === id)?.pricingType !== 'fixed',
  );

  const effectiveServiceType =
    serviceType === 'vehicle-care' && hasHeavyVehicle ? 'complete' : serviceType;

  const base = effectiveServiceType === 'vehicle-care'
    ? vehicleList.length * VEHICLE_CARE_PRICE
    : vehicleList.reduce((sum, vehicle) => sum + priceForVehicle(vehicle), 0);

  const extrasTotal = fixedExtras.reduce((sum, id) => sum + addOnPrice(id), 0);

  if (allHeavyVehicles) {
    return {
      category: 'heavy',
      packageId: null,
      serviceType: 'heavy',
      services: ['heavy', ...cleanAlacarte],
      alacarte: cleanAlacarte,
      amount: base + extrasTotal,
      variablePricing,
      vehicleCount: vehicleList.length,
    };
  }

  const pkg = effectiveServiceType === 'vehicle-care' ? PACKAGES.vehicleCare : PACKAGES.complete;
  return {
    category: hasHeavyVehicle ? 'mixed' : 'car',
    packageId: pkg.id,
    serviceType: effectiveServiceType,
    services: [
      ...pkg.includes,
      ...(hasHeavyVehicle ? ['heavy'] : []),
      ...cleanAlacarte,
    ],
    alacarte: cleanAlacarte,
    amount: base + extrasTotal,
    variablePricing,
    vehicleCount: vehicleList.length,
  };
}
