export const BASE_LOCATION = {
  name: 'Aqua Haul Base Station',
  latitude: 9.7239929,
  longitude: 76.5471905,
};

export const SERVICE_RADIUS_KM = 20;
export const MAX_TRAVEL_MINUTES = 60;
export const PREP_MINUTES = 30;
export const SAFETY_MINUTES = 15;

export const BOOKING_SLOTS = [
  { id: 'slot-1', label: '8:00 AM–10:00 AM', start: '08:00', end: '10:00' },
  { id: 'slot-2', label: '11:30 AM–1:30 PM', start: '11:30', end: '13:30' },
  { id: 'slot-3', label: '3:00 PM–5:00 PM', start: '15:00', end: '17:00' },
  { id: 'slot-4', label: '6:30 PM–8:30 PM', start: '18:30', end: '20:30' },
];

export function getSlot(slotId) {
  return BOOKING_SLOTS.find((slot) => slot.id === slotId);
}

export function istDateTime(date, time) {
  return new Date(`${date}T${time}:00+05:30`);
}
