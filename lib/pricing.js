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
  { value: 'Heavy Vehicle', category: 'heavy', description: 'Truck, bus or machinery' },
];

export const VEHICLE_PACKAGE_PRICES = { '5-Seater': { complete: 800 }, '7-Seater': { complete: 900 }, Luxury: { complete: 1000 } };
export const HEAVY_VEHICLE_PRICE = 1200;
export const ALACARTE_PRICE = 100;

export function categoryForVehicle(vehicleType) { return VEHICLE_TYPES.find((vehicle) => vehicle.value === vehicleType)?.category || 'car'; }
export function priceForPackage(vehicleType) { return VEHICLE_PACKAGE_PRICES[vehicleType]?.complete ?? 800; }
export function addOnPrice(id) { const price = CORE_SERVICES.find((service) => service.id === id)?.price; return Number.isFinite(price) ? price : 0; }
export function addOnPriceLabel(id, prefix = '+') {
  const service = CORE_SERVICES.find((item) => item.id === id);
  if (!service) return `${prefix}₹${ALACARTE_PRICE}`;
  if (service.pricingType === 'from') return `From ₹${service.price}`;
  if (!Number.isFinite(service.price)) return service.priceText || 'Price after inspection';
  return `${prefix}₹${service.price}`;
}
export function hasVariablePriceAddon(alacarte = []) { return Array.isArray(alacarte) && alacarte.some((id) => CORE_SERVICES.find((service) => service.id === id)?.pricingType !== 'fixed'); }

export function resolveBooking({ vehicleType, vehicles, serviceType = 'complete', alacarte = [] }) {
  const vehicleList = Array.isArray(vehicles) && vehicles.length ? vehicles : [{ type: vehicleType || '5-Seater', model: '' }];
  const primaryType = vehicleList[0]?.type || vehicleType || '5-Seater';
  const category = categoryForVehicle(primaryType);
  const cleanAlacarte = Array.isArray(alacarte) ? [...new Set(alacarte)].filter((id) => CORE_SERVICES.some((service) => service.id === id && service.selectable)) : [];
  const fixedExtras = cleanAlacarte.filter((id) => CORE_SERVICES.find((service) => service.id === id)?.pricingType === 'fixed');
  const variablePricing = cleanAlacarte.some((id) => CORE_SERVICES.find((service) => service.id === id)?.pricingType !== 'fixed');

  if (category === 'heavy') {
    return { category, packageId: null, serviceType: 'heavy', services: ['heavy', ...cleanAlacarte], alacarte: cleanAlacarte, amount: HEAVY_VEHICLE_PRICE + fixedExtras.reduce((sum, id) => sum + addOnPrice(id), 0), variablePricing, vehicleCount: 1 };
  }

  const base = serviceType === 'vehicle-care'
    ? vehicleList.length * VEHICLE_CARE_PRICE
    : vehicleList.reduce((sum, vehicle) => sum + priceForPackage(vehicle.type), 0);
  const extrasTotal = fixedExtras.reduce((sum, id) => sum + addOnPrice(id), 0);
  const pkg = serviceType === 'vehicle-care' ? PACKAGES.vehicleCare : PACKAGES.complete;
  return { category, packageId: pkg.id, serviceType, services: [...pkg.includes, ...cleanAlacarte], alacarte: cleanAlacarte, amount: base + extrasTotal, variablePricing, vehicleCount: vehicleList.length };
}
