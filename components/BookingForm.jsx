'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Car,
  Check,
  CheckCircle2,
  Crown,
  Loader2,
  LocateFixed,
  MessageCircle,
  KeyRound,
  ShieldCheck,
  Truck,
  Users,
} from 'lucide-react';
import {
  CORE_SERVICES,
  HEAVY_VEHICLE_PRICE,
  PACKAGES,
  VEHICLE_TYPES,
  BOOKING_FEE,
  addOnPriceLabel,
  categoryForVehicle,
  priceForPackage,
  resolveBooking,
} from '../lib/pricing';
import PaymentPanel from './PaymentPanel';
import AddOnCard from './AddOnCard';
import WashMotionDivider from './WashMotionDivider';
import WaveDivider from './WaveDivider';

const WHATSAPP_NUMBER = '918921167141';
const STEPS = ['Vehicle', 'Service', 'Details', 'Payment'];
const ICONS = {
  '5-Seater': Car,
  '7-Seater': Users,
  Luxury: Crown,
  'Heavy Vehicle': Truck,
};

function serviceName(id) {
  if (id === 'heavy') return 'Heavy Vehicle Wash';
  return CORE_SERVICES.find((service) => service.id === id)?.name || id;
}

function formatDate(value) {
  if (!value) return '';
  const parsed = new Date(`${String(value).slice(0, 10)}T12:00:00+05:30`);
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(parsed);
}

function bookingRef(id) {
  return `AQ${String(id || '').replace(/[^a-z0-9]/gi, '').slice(-6).toUpperCase()}`;
}

function mapsLink(latitude, longitude) {
  if (!Number.isFinite(Number(latitude)) || !Number.isFinite(Number(longitude))) return '';
  return `https://www.google.com/maps/search/?api=1&query=${Number(latitude)},${Number(longitude)}`;
}

async function readJson(response) {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('The booking service returned an unexpected response. Refresh the page and try again.');
  }
  return response.json();
}

function bookingWhatsApp(booking, paid = false) {
  const lines = [
    '🚗 *Aqua Haul Booking*',
    '',
    `*Booking ID:* ${bookingRef(booking.id)}`,
    '',
    `Name: ${booking.name}`,
    `Phone: ${booking.phone}`,
    booking.email ? `Email: ${booking.email}` : null,
    `Vehicles: ${booking.vehicle_count || 1}${Array.isArray(booking.vehicles) && booking.vehicles.length ? ` · ${booking.vehicles.map((v, i) => `#${i + 1} ${v.type}${v.model ? ` (${v.model})` : ''}`).join(' · ')}` : ` · ${booking.vehicle_type}${booking.vehicle_model ? ` (${booking.vehicle_model})` : ''}`}`,
    `Service: ${booking.service_type === 'vehicle-care' ? 'Vehicle Care Visit' : booking.package_id ? 'Complete Care Wash' : 'Heavy Vehicle Wash'}`,
    booking.group_offer ? `Group offer: Eligible for 20–30% · ${booking.group_location_mode === 'within-3km' ? 'locations within 3 km' : 'same location'}` : null,
    `Add-ons: ${(booking.alacarte || []).length ? booking.alacarte.map(serviceName).join(', ') : 'None'}`,
    `Date: ${formatDate(booking.booking_date)}`,
    `Time: ${booking.booking_time}`,
    `House address: ${booking.address}`,
    booking.map_address ? `Place: ${booking.map_address}` : null,
    mapsLink(booking.latitude, booking.longitude) ? `Google Maps: ${mapsLink(booking.latitude, booking.longitude)}` : null,
    booking.landmark ? `Landmark: ${booking.landmark}` : null,
    booking.service_type === 'vehicle-care' ? `Vehicle care: starting ${booking.care_details?.starting || 'not stated'} · unused ${booking.care_details?.unusedDuration || 'not stated'} · drive permission ${booking.care_details?.drivePermission ? 'YES' : 'NO'}` : null,
    booking.service_type === 'vehicle-care' && booking.care_details?.keyInstructions ? `Key/access: ${booking.care_details.keyInstructions}` : null,
    `Estimated service total: ₹${booking.amount}${(booking.alacarte || []).some((id) => ['enginebay','seatclean','waterspot'].includes(id)) ? ' + condition-based extras to be confirmed' : ''}`,
    `Payment: ${booking.payment_method === 'advance' ? (paid ? `₹${BOOKING_FEE} booking fee paid` : `₹${BOOKING_FEE} booking fee selected`) : 'Pay Onsite'}`,
    booking.notes ? `Notes: ${booking.notes}` : null,
    '',
    'Please confirm my booking.',
  ].filter(Boolean);

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}

function enquiryWhatsApp({ form, resolved, distance, requestedSlot }) {
  const enquiryVehicles = Array.isArray(form.vehicles) && form.vehicles.length
    ? form.vehicles
    : [{ type: form.vehicleType || '5-Seater' }];
  const enquiryHasHeavy = enquiryVehicles.some(
    (vehicle) => categoryForVehicle(vehicle.type) === 'heavy',
  );
  const enquiryAllHeavy = enquiryVehicles.every(
    (vehicle) => categoryForVehicle(vehicle.type) === 'heavy',
  );
  const service = enquiryAllHeavy
    ? 'Heavy Vehicle Wash'
    : form.serviceType === 'vehicle-care'
      ? 'Vehicle Care Visit'
      : enquiryHasHeavy
        ? 'Complete Care Wash + Heavy Vehicle Wash'
        : 'Complete Care Wash';
  const lines = [
    '📍 *Aqua Haul Service Availability Enquiry*',
    '',
    form.name ? `Name: ${form.name}` : null,
    form.phone ? `Phone: ${form.phone}` : null,
    `Vehicles: ${form.vehicleCount} · ${form.vehicles.map((v, i) => `#${i + 1} ${v.type}${v.model ? ` (${v.model})` : ''}`).join(' · ')}`,
    form.groupOffer ? `Group offer: 20–30% eligible · ${form.groupLocationMode === 'within-3km' ? 'within 3 km' : 'same location'}` : null,
    `Service: ${service}`,
    `Add-ons: ${form.alacarte.length ? form.alacarte.map(serviceName).join(', ') : 'None'}`,
    form.date ? `Preferred date: ${formatDate(form.date)}` : null,
    requestedSlot ? `Preferred slot: ${requestedSlot.label}` : null,
    form.address ? `House address: ${form.address}` : null,
    form.mapAddress ? `Place: ${form.mapAddress}` : null,
    mapsLink(form.latitude, form.longitude) ? `Google Maps: ${mapsLink(form.latitude, form.longitude)}` : null,
    form.landmark ? `Landmark: ${form.landmark}` : null,
    distance != null ? `Approximate distance from Kuravilangadu: ${distance} km` : null,
    `Estimated service total: ₹${resolved.amount}${resolved.variablePricing ? ' + variable-priced add-on' : ''}`,
    form.notes ? `Notes: ${form.notes}` : null,
    '',
    'Please let me know whether service is possible for this location/time.',
  ].filter(Boolean);

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}

export default function BookingForm() {
  const wizardRef = useRef(null);
  const sessionToken = useRef(globalThis.crypto?.randomUUID?.() || String(Date.now()));

  const [step, setStep] = useState(0);
  const [slideDirection, setSlideDirection] = useState('forward');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [booking, setBooking] = useState(null);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [addressBusy, setAddressBusy] = useState(false);
  const [availabilityBusy, setAvailabilityBusy] = useState(false);
  const [slots, setSlots] = useState([]);
  const [distance, setDistance] = useState(null);
  const [outsideArea, setOutsideArea] = useState(false);
  const [lockedService, setLockedService] = useState(null);

  const [form, setForm] = useState({
    vehicleCount: 1,
    vehicles: [{ type: '5-Seater', model: '' }],
    vehicleType: '5-Seater',
    vehicleModel: '',
    serviceType: 'complete',
    groupOffer: false,
    groupLocationMode: 'same',
    careStarting: 'yes',
    unusedDuration: 'less-than-1-month',
    drivePermission: false,
    keyInstructions: '',
    alacarte: [],
    name: '',
    phone: '',
    email: '',
    address: '',
    mapAddress: '',
    landmark: '',
    placeId: '',
    latitude: null,
    longitude: null,
    date: '',
    slotId: '',
    notes: '',
    paymentMethod: 'onsite',
    website: '',
  });

  const vehicleList = Array.isArray(form.vehicles) && form.vehicles.length
    ? form.vehicles
    : [{ type: form.vehicleType || '5-Seater', model: form.vehicleModel || '' }];

  const hasHeavyVehicle = vehicleList.some(
    (vehicle) => categoryForVehicle(vehicle.type) === 'heavy',
  );
  const allHeavyVehicles = vehicleList.every(
    (vehicle) => categoryForVehicle(vehicle.type) === 'heavy',
  );
  const category = allHeavyVehicles ? 'heavy' : hasHeavyVehicle ? 'mixed' : 'car';
  const resolved = useMemo(
    () => resolveBooking({
      vehicleType: form.vehicleType,
      vehicles: Array.isArray(form.vehicles) && form.vehicles.length
        ? form.vehicles
        : [{ type: form.vehicleType || '5-Seater', model: form.vehicleModel || '' }],
      serviceType: form.serviceType,
      alacarte: form.alacarte,
    }),
    [form.vehicleType, form.vehicleModel, form.vehicles, form.serviceType, form.alacarte],
  );
  const extras = CORE_SERVICES.filter((service) => service.selectable);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requested = Math.max(1, Math.min(4, Number(params.get('vehicles')) || 1));
    const requestedService = params.get('service');
    const service = requestedService === 'vehicle-care' ? 'vehicle-care' : 'complete';
    const hasPreselectedService = requestedService === 'vehicle-care' || requestedService === 'complete';
    const group = params.get('offer') === 'group' || requested >= 3;

    setLockedService(hasPreselectedService ? service : null);
    setForm((current) => {
      const vehicles = Array.from(
        { length: requested },
        (_, index) => current.vehicles[index] || { type: '5-Seater', model: '' },
      );
      return {
        ...current,
        vehicleCount: requested,
        vehicles,
        vehicleType: vehicles[0].type,
        vehicleModel: vehicles[0].model || '',
        serviceType:
          service === 'vehicle-care' &&
          vehicles.some((vehicle) => categoryForVehicle(vehicle.type) === 'heavy')
            ? 'complete'
            : service,
        groupOffer: group,
      };
    });
  }, []);

  useEffect(() => {
    if (!form.mapAddress || form.mapAddress.length < 3 || form.placeId) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setAddressBusy(true);
      try {
        const response = await fetch('/api/places/autocomplete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: form.mapAddress, sessionToken: sessionToken.current }),
        });
        const data = await readJson(response);
        if (!response.ok) throw new Error(data.message || data.error || 'Could not search addresses.');
        setSuggestions(data.suggestions || []);
      } catch (requestError) {
        setError(requestError.message);
        setSuggestions([]);
      } finally {
        setAddressBusy(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [form.mapAddress, form.placeId]);

  useEffect(() => {
    if (!form.date || !Number.isFinite(Number(form.latitude)) || !Number.isFinite(Number(form.longitude))) {
      setSlots([]);
      setDistance(null);
      setOutsideArea(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setAvailabilityBusy(true);
      setError('');
      try {
        const response = await fetch('/api/availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: form.date,
            latitude: form.latitude,
            longitude: form.longitude,
          }),
        });
        const data = await readJson(response);
        if (!response.ok) throw new Error(data.message || data.error || 'Could not check availability.');

        if (!cancelled) {
          setSlots(data.slots || []);
          setDistance(data.distanceFromBaseKm);
          setOutsideArea(Boolean(data.outsideArea));
          setForm((current) => ({ ...current, slotId: '' }));
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError.message);
          setSlots([]);
          setOutsideArea(false);
        }
      } finally {
        if (!cancelled) setAvailabilityBusy(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [form.date, form.latitude, form.longitude]);

  const update = (key, value) => {
    setError('');
    setFieldErrors((current) => ({ ...current, [key]: '' }));
    setForm((current) => ({ ...current, [key]: value }));
  };

  const toggle = (id) => {
    setForm((current) => ({
      ...current,
      alacarte: current.alacarte.includes(id)
        ? current.alacarte.filter((item) => item !== id)
        : [...current.alacarte, id],
    }));
  };

  function setVehicleCount(count) {
    const nextCount = Math.max(1, Math.min(4, Number(count) || 1));
    setForm((current) => {
      const currentVehicles = Array.isArray(current.vehicles) ? current.vehicles : [];
      const vehicles = Array.from(
        { length: nextCount },
        (_, index) => currentVehicles[index] || { type: '5-Seater', model: '' },
      );

      const nextHasHeavy = vehicles.some(
        (vehicle) => categoryForVehicle(vehicle.type) === 'heavy',
      );

      return {
        ...current,
        vehicleCount: nextCount,
        vehicles,
        vehicleType: vehicles[0]?.type || '5-Seater',
        vehicleModel: vehicles[0]?.model || '',
        serviceType:
          current.serviceType === 'vehicle-care' && nextHasHeavy
            ? 'complete'
            : current.serviceType,
        groupOffer: nextCount >= 3,
      };
    });
  }

  function updateVehicle(index, key, value) {
    setForm((current) => {
      const currentVehicles = Array.isArray(current.vehicles) && current.vehicles.length
        ? current.vehicles
        : [{ type: current.vehicleType || '5-Seater', model: current.vehicleModel || '' }];

      const vehicles = currentVehicles.map((vehicle, vehicleIndex) =>
        vehicleIndex === index ? { ...vehicle, [key]: value } : vehicle,
      );

      const nextHasHeavy = vehicles.some(
        (vehicle) => categoryForVehicle(vehicle.type) === 'heavy',
      );

      return {
        ...current,
        vehicles,
        vehicleType: vehicles[0]?.type || '5-Seater',
        vehicleModel: vehicles[0]?.model || '',
        serviceType:
          current.serviceType === 'vehicle-care' && nextHasHeavy
            ? 'complete'
            : current.serviceType,
      };
    });
  }

  async function chooseAddress(item) {
    setAddressBusy(true);
    setError('');
    try {
      const response = await fetch('/api/places/details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placeId: item.placeId, sessionToken: sessionToken.current }),
      });
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.message || data.error || 'Could not select address.');
      const place = data.place;
      setForm((current) => ({
        ...current,
        mapAddress: place.formattedAddress || item.text,
        placeId: place.id,
        latitude: place.location?.latitude,
        longitude: place.location?.longitude,
        slotId: '',
      }));
      setFieldErrors((current) => ({ ...current, mapAddress: '' }));
      setSuggestions([]);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setAddressBusy(false);
    }
  }

  function useCurrentLocation() {
    setError('');
    setFieldErrors((current) => ({ ...current, mapAddress: '' }));

    if (!navigator.geolocation) {
      setFieldErrors((current) => ({ ...current, mapAddress: 'Current location is not supported on this device.' }));
      return;
    }

    setAddressBusy(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = Number(position.coords.latitude.toFixed(7));
        const longitude = Number(position.coords.longitude.toFixed(7));
        setForm((current) => ({
          ...current,
          mapAddress: `Current location (${latitude}, ${longitude})`,
          placeId: 'current-location',
          latitude,
          longitude,
          slotId: '',
        }));
        setSuggestions([]);
        setAddressBusy(false);
      },
      (locationError) => {
        const message = locationError.code === 1
          ? 'Location permission was denied. Search for a nearby place instead.'
          : 'We could not get your current location. Search for a nearby place instead.';
        setFieldErrors((current) => ({ ...current, mapAddress: message }));
        setAddressBusy(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    );
  }

  function validateDetails() {
    const nextErrors = {};
    if (form.name.trim().length < 2) nextErrors.name = 'Enter your full name.';
    if (!/^\d{10}$/.test(form.phone)) nextErrors.phone = `Enter exactly 10 digits (${form.phone.length}/10 entered).`;
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Enter a valid email address or leave it blank.';
    if (form.address.trim().length < 5) nextErrors.address = 'Enter your house name or exact address.';
    if (!Number.isFinite(Number(form.latitude)) || !Number.isFinite(Number(form.longitude))) nextErrors.mapAddress = 'Select a place from Google suggestions or use your current location.';
    if (form.serviceType === 'vehicle-care' && !form.drivePermission) nextErrors.drivePermission = 'Please confirm owner permission for the short vehicle run/drive.';
    if (!form.date) nextErrors.date = 'Choose a service date.';
    if (!outsideArea && !availabilityBusy && !form.slotId) {
      nextErrors.slotId = slots.some((slot) => slot.available)
        ? 'Choose one available time slot.'
        : 'No online booking slot is available for this date and location.';
    }

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setError(Object.values(nextErrors)[0]);
      return false;
    }
    if (outsideArea) {
      setError('This address is outside our normal online booking area. Use WhatsApp to check service availability.');
      return false;
    }
    return true;
  }

  function goToStep(targetStep, direction = 'forward') {
    setSlideDirection(direction);
    setStep(Math.max(0, Math.min(3, targetStep)));
  }

  function next() {
    if (step === 2 && !validateDetails()) return;
    goToStep(step + 1, 'forward');
  }

  async function submit() {
    if (!validateDetails()) return;
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.message || data.error || 'Booking failed.');

      setBooking(data.booking);

      // Preserve the successful booking screen as a fallback, then open
      // WhatsApp automatically with the saved booking details.
      const whatsappUrl = bookingWhatsApp(data.booking, false);
      window.setTimeout(() => {
        window.location.assign(whatsappUrl);
      }, 350);
    } catch (requestError) {
      setError(requestError.message);
      if (/slot/i.test(requestError.message)) {
        setForm((current) => ({ ...current, slotId: '' }));
        setSlideDirection('back');
        setStep(2);
      }
    } finally {
      setBusy(false);
    }
  }

  if (booking) {
    return (
      <Success
        booking={booking}
        paid={paymentSubmitted}
        onPaid={() => setPaymentSubmitted(true)}
        onReset={() => location.reload()}
      />
    );
  }

  const selectedSlot = slots.find((slot) => slot.id === form.slotId);

  const completeBaseTotal = vehicleList.reduce(
    (sum, vehicle) => sum + priceForPackage(vehicle.type),
    0,
  );

  const vehiclePriceBreakdown = vehicleList
    .map((vehicle) => `${vehicle.type} ₹${priceForPackage(vehicle.type)}`)
    .join(' + ');

  const multipleVehicles = vehicleList.length > 1;

  return (
    <section id="booking" className="relative overflow-hidden bg-[var(--cream-100)] px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-9 max-w-2xl text-center">
          <span className="font-label text-xs text-[var(--terracotta-600)]">BOOK YOUR SLOT</span>
          <h2 className="font-display mt-3 text-3xl text-[var(--teal-900)] sm:text-4xl">
            A little care goes a long way
          </h2>
          <p className="font-body mt-3 text-sm leading-6 text-[var(--ink-muted)]">
            Choose a wash, an away-from-home care visit, or a group booking. We’ll match your location with an available route-aware slot.
          </p>
        </div>

        <WashMotionDivider label="A smoother way to book your car care" />

        <div ref={wizardRef} className="mx-auto scroll-mt-24 overflow-hidden rounded-[28px] border border-[var(--teal-100)] bg-white shadow-[0_24px_70px_rgba(18,49,48,0.12)]">
          <div className="border-b border-[var(--teal-100)] px-5 py-5 sm:px-8">
            <div className="grid grid-cols-4 gap-2">
              {STEPS.map((label, index) => (
                <div key={label}>
                  <div className={`mb-2 h-1.5 rounded-full ${index <= step ? 'bg-[var(--terracotta-600)]' : 'bg-[var(--teal-100)]'}`} />
                  <span className="font-body text-[11px] font-bold text-[var(--teal-900)]">{index + 1}. {label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_320px]">
            <div className="overflow-x-hidden p-5 sm:p-8 md:p-10">
              <div
                key={`${step}-${slideDirection}`}
                className={`booking-step-slide ${slideDirection === 'back' ? 'is-back' : 'is-forward'}`}
              >
              {step === 0 && (
                <div>
                  <span className="font-label text-[10px] text-[var(--terracotta-600)]">YOUR VEHICLES</span>
                  <h3 className="font-display mt-2 text-2xl text-[var(--teal-900)]">How many cars are we caring for?</h3>
                  <p className="font-body mt-2 text-sm text-[var(--ink-muted)]">One car or a family fleet—tell us what is waiting at the location.</p>
                  <div className="mt-5 grid grid-cols-4 gap-2">{[1,2,3,4].map((count)=><button key={count} type="button" onClick={()=>setVehicleCount(count)} className={`vehicle-count ${form.vehicleCount===count?'active':''}`}>{count}{count===4?'+':''}</button>)}</div>
                  {form.vehicleCount >= 3 && <div className="booking-offer mt-5"><strong>Family & Friends saving unlocked</strong><p>Your group booking is eligible for 20–30% off when the cars are together at one location or within 3 km. We’ll confirm the exact saving before the service.</p><div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={()=>update('groupLocationMode','same')} className={`chip ${form.groupLocationMode==='same'?'active':''}`}>Same location</button><button type="button" onClick={()=>update('groupLocationMode','within-3km')} className={`chip ${form.groupLocationMode==='within-3km'?'active':''}`}>Within 3 km</button></div></div>}
                  <div className="mt-6 space-y-4">{form.vehicles.map((vehicle,index)=><div key={index} className="vehicle-row"><div><span className="font-label text-[9px] text-[var(--terracotta-600)]">VEHICLE {index+1}</span><select className="field mt-2" value={vehicle.type} onChange={(e)=>updateVehicle(index,'type',e.target.value)}>{VEHICLE_TYPES.filter((item) => form.serviceType !== 'vehicle-care' || item.category !== 'heavy').map((item)=><option key={item.value} value={item.value}>{item.value} · {item.description}</option>)}</select></div><div><span className="font-body text-xs font-bold text-[var(--teal-900)]">Model (optional)</span><input className="field mt-2" value={vehicle.model || ''} onChange={(e)=>updateVehicle(index,'model',e.target.value)} placeholder="e.g. Baleno"/></div></div>)}</div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <span className="font-label text-[10px] text-[var(--terracotta-600)]">
                    {lockedService ? 'YOUR SELECTED SERVICE' : 'CHOOSE YOUR CARE'}
                  </span>
                  <h3 className="font-display mt-2 text-2xl text-[var(--teal-900)]">
                    {lockedService ? 'We kept the service you selected.' : 'What would you like us to do?'}
                  </h3>

                  {category === 'heavy' ? (
                    <div className="mt-5 rounded-3xl bg-[var(--teal-900)] p-6 text-white">
                      <h4 className="font-display text-3xl">Heavy Vehicle Wash</h4>
                      <p className="font-body mt-2 text-sm text-[var(--teal-100)]">
                        Dedicated cleaning for trucks, buses and machinery at your location.
                      </p>
                      <div className="mt-5 border-t border-white/15 pt-4">
                        <span className="font-body text-xs text-[var(--teal-100)]">
                          {multipleVehicles ? 'Estimated base total' : 'Base wash'}
                        </span>
                        <strong className="font-display mt-1 block text-3xl text-[var(--gold-400)]">
                          ₹{completeBaseTotal}
                        </strong>
                        {multipleVehicles && (
                          <p className="font-body mt-2 text-xs leading-5 text-[var(--teal-100)]">
                            {vehiclePriceBreakdown}
                          </p>
                        )}
                        <p className="font-body mt-2 text-[11px] text-[var(--teal-100)]">
                          Add-ons are calculated separately.
                        </p>
                      </div>
                    </div>
                  ) : lockedService ? (
                    <div className={`service-choice selected-service-summary mt-5 ${form.serviceType === 'vehicle-care' ? 'care active' : 'active'}`}>
                      <span className="service-choice-icon">
                        {form.serviceType === 'vehicle-care' ? <KeyRound size={24}/> : <Car size={24}/>}
                      </span>
                      <span className="font-label text-[9px]">
                        {form.serviceType === 'vehicle-care' ? 'VEHICLE CARE VISIT' : 'COMPLETE CARE WASH'}
                      </span>
                      <strong>
                        {form.serviceType === 'vehicle-care'
                          ? 'Away from home? We’ll check in on your car.'
                          : 'A fresh start, inside and out.'}
                      </strong>
                      <small>
                        {form.serviceType === 'vehicle-care'
                          ? 'Visual check, start-up, short run/drive up to 5 km where safe, wash + photo/video update.'
                          : 'Foam Wash + Interior Detailing at your doorstep.'}
                      </small>
                      {form.serviceType === 'vehicle-care' ? (
                        <>
                          <b>₹1000 per vehicle</b>
                          <span className="selected-service-note">
                            {vehicleList.length} {vehicleList.length === 1 ? 'vehicle' : 'vehicles'} selected
                          </span>
                        </>
                      ) : (
                        <>
                          <b>
                            {multipleVehicles
                              ? `Estimated base total ₹${completeBaseTotal}`
                              : `From ₹${completeBaseTotal}`}
                          </b>

                          {multipleVehicles && (
                            <small className="selected-service-breakdown">
                              {vehiclePriceBreakdown}
                            </small>
                          )}

                          <span className="selected-service-note">
                            {vehicleList.length} {vehicleList.length === 1 ? 'vehicle' : 'vehicles'} selected
                          </span>

                          <small className="selected-service-price-note">
                            Add-ons are calculated separately.
                          </small>

                          {form.vehicleCount >= 3 && (
                            <small className="selected-service-offer-note">
                              Group discount eligibility: 20–30% · final saving confirmed after review.
                            </small>
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <button type="button" onClick={()=>update('serviceType','complete')} className={`service-choice ${form.serviceType==='complete'?'active':''}`}>
                        <span className="service-choice-icon"><Car size={24}/></span>
                        <span className="font-label text-[9px]">COMPLETE CARE WASH</span>
                        <strong>A fresh start, inside and out.</strong>
                        <small>Foam Wash + Interior Detailing at your doorstep.</small>
                        <b>
                          {multipleVehicles
                            ? `Estimated base total ₹${completeBaseTotal}`
                            : `From ₹${completeBaseTotal}`}
                        </b>
                        {multipleVehicles && (
                          <small className="selected-service-breakdown">
                            {vehiclePriceBreakdown}
                          </small>
                        )}
                        <small className="selected-service-price-note">
                          Add-ons calculated separately.
                        </small>
                      </button>
                      {!hasHeavyVehicle && (
                        <button type="button" onClick={()=>update('serviceType','vehicle-care')} className={`service-choice care ${form.serviceType==='vehicle-care'?'active':''}`}>
                          <span className="service-choice-icon"><KeyRound size={24}/></span>
                          <span className="font-label text-[9px]">VEHICLE CARE VISIT</span>
                          <strong>Away from home? We’ll check in on your car.</strong>
                          <small>Visual check, start-up, short run/drive up to 5 km where safe, wash + photo/video update.</small>
                          <b>₹1000 per vehicle</b>
                        </button>
                      )}
                    </div>
                  )}

                  {form.serviceType === 'vehicle-care' && !hasHeavyVehicle && <div className="care-questions mt-6"><h4 className="font-display text-xl text-[var(--teal-900)]">A few details before we visit</h4><div className="mt-4 grid gap-4 sm:grid-cols-2"><Field label="Is the vehicle currently starting?"><select className="field" value={form.careStarting} onChange={(e)=>update('careStarting',e.target.value)}><option value="yes">Yes</option><option value="not-sure">Not sure</option><option value="no">No</option></select></Field><Field label="How long has it been unused?"><select className="field" value={form.unusedDuration} onChange={(e)=>update('unusedDuration',e.target.value)}><option value="less-than-1-month">Less than 1 month</option><option value="1-3-months">1–3 months</option><option value="3-plus-months">3+ months</option></select></Field></div><div className="mt-4"><Field label="Key handover / access instructions"><input className="field" value={form.keyInstructions} onChange={(e)=>update('keyInstructions',e.target.value)} placeholder="Who has the key, security/gate instructions, etc."/></Field></div><label className={`permission-card mt-4 ${fieldErrors.drivePermission?'error':''}`}><input type="checkbox" checked={form.drivePermission} onChange={(e)=>update('drivePermission',e.target.checked)}/><span><strong>I authorise Aqua Haul to take the vehicle for a short run/drive of up to 5 km.</strong><small>Only where the vehicle appears safe and legally permitted to be driven. Aqua Haul will contact me if there is any concern before proceeding.</small></span></label>{fieldErrors.drivePermission&&<p className="font-body mt-2 text-xs font-bold text-[var(--terracotta-600)]">{fieldErrors.drivePermission}</p>}</div>}

                  <div className="mt-8 flex items-end justify-between gap-3"><div><span className="font-label text-[10px] text-[var(--terracotta-600)]">OPTIONAL EXTRAS</span><h4 className="font-display mt-1 text-xl text-[var(--teal-900)]">Finishing touches, priced fairly.</h4></div></div>
                  <p className="font-body mt-2 text-sm text-[var(--ink-muted)]">Some services depend on dirt, stains or affected area. We’ll confirm any condition-based price before starting.</p>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">{extras.map((service)=><AddOnCard key={service.id} service={service} selected={form.alacarte.includes(service.id)} onClick={()=>toggle(service.id)}/>)}</div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h3 className="font-display text-2xl text-[var(--teal-900)]">Details and available slot</h3>
                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <Field label="Full name" error={fieldErrors.name}>
                      <input className="field" value={form.name} onChange={(event) => update('name', event.target.value)} />
                    </Field>
                    <Field label="Phone" error={fieldErrors.phone}>
                      <input
                        className="field"
                        inputMode="numeric"
                        maxLength={15}
                        value={form.phone}
                        onChange={(event) => update('phone', event.target.value.replace(/\D/g, ''))}
                        placeholder="Exact 10-digit number"
                      />
                    </Field>
                    <Field label="Email (optional)" error={fieldErrors.email}>
                      <input className="field" type="email" value={form.email} onChange={(event) => update('email', event.target.value)} />
                    </Field>
                    <div className="rounded-2xl bg-[var(--cream-100)] p-4 text-sm text-[var(--ink-muted)]"><strong className="text-[var(--teal-900)]">{form.vehicleCount} vehicle{form.vehicleCount>1?'s':''}</strong><br/>{form.groupOffer ? 'Group offer eligibility will be confirmed with your final service price.' : 'Vehicle details saved from the first step.'}</div>
                  </div>

                  <div className="mt-5">
                    <Field label="House address" error={fieldErrors.address}>
                      <textarea
                        className="field"
                        rows={2}
                        value={form.address}
                        onChange={(event) => update('address', event.target.value)}
                        placeholder="House name, building, road and locality"
                      />
                    </Field>
                  </div>

                  <div className="relative mt-5">
                    <Field label="Place / map location" error={fieldErrors.mapAddress}>
                      <input
                        className="field pr-12"
                        value={form.mapAddress}
                        onChange={(event) => {
                          setFieldErrors((current) => ({ ...current, mapAddress: '' }));
                          setError('');
                          setForm((current) => ({
                            ...current,
                            mapAddress: event.target.value,
                            placeId: '',
                            latitude: null,
                            longitude: null,
                            slotId: '',
                          }));
                        }}
                        placeholder="Search a road, junction, church, shop or nearby place"
                      />
                    </Field>
                    {addressBusy && <Loader2 className="absolute right-4 top-10 animate-spin" size={18} />}
                    {!!suggestions.length && (
                      <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border bg-white shadow-xl">
                        {suggestions.map((item) => (
                          <button key={item.placeId} type="button" onClick={() => chooseAddress(item)} className="block w-full border-b px-4 py-3 text-left font-body text-sm hover:bg-[var(--cream-100)]">
                            <strong>{item.mainText}</strong>
                            <span className="block text-xs text-[var(--ink-muted)]">{item.secondaryText}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={useCurrentLocation}
                      disabled={addressBusy}
                      className="btn-ghost-teal mt-3 inline-flex items-center gap-2 text-sm disabled:opacity-60"
                    >
                      <LocateFixed size={16} /> Use my current location
                    </button>
                    {Number.isFinite(Number(form.latitude)) && Number.isFinite(Number(form.longitude)) && (
                      <a
                        href={mapsLink(form.latitude, form.longitude)}
                        target="_blank"
                        rel="noreferrer"
                        className="font-body ml-3 inline-block text-xs font-bold text-[var(--teal-700)] underline"
                      >
                        Preview on Google Maps
                      </a>
                    )}
                  </div>

                  <div className="mt-5">
                    <Field label="Landmark / directions (optional)">
                      <input
                        className="field"
                        value={form.landmark}
                        onChange={(event) => update('landmark', event.target.value)}
                        placeholder="Near a church, junction, shop, gate or other clear landmark"
                      />
                    </Field>
                  </div>

                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <Field label="Date" error={fieldErrors.date}>
                      <input className="field" type="date" min={new Date().toISOString().slice(0, 10)} value={form.date} onChange={(event) => update('date', event.target.value)} />
                    </Field>
                    <Field label="Service notes (optional)">
                      <input className="field" placeholder="Vehicle condition, gate instructions or service requests" value={form.notes} onChange={(event) => update('notes', event.target.value)} />
                    </Field>
                  </div>

                  {distance != null && !outsideArea && (
                    <p className="font-body mt-4 rounded-xl bg-[var(--teal-100)] px-4 py-3 text-sm text-[var(--teal-900)]">
                      Approximate road distance from Kuravilangadu: <strong>{distance} km</strong>
                      {distance > 15 ? ' · Extended service area; final confirmation may be required.' : ''}
                    </p>
                  )}

                  {outsideArea ? (
                    <div className="mt-6 rounded-3xl border-2 border-[var(--terracotta-500)] bg-[var(--terracotta-100)] p-5 sm:p-6">
                      <h4 className="font-display text-xl text-[var(--teal-900)]">Check service availability on WhatsApp</h4>
                      <p className="font-body mt-2 text-sm leading-6 text-[var(--ink)]">
                        This address is approximately <strong>{distance} km</strong> from Kuravilangadu and is outside our normal online booking area. We may still be able to serve it depending on the day’s route.
                      </p>
                      <a
                        href={enquiryWhatsApp({ form, resolved, distance })}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-primary mt-4 flex w-full items-center justify-center gap-2 text-center"
                      >
                        <MessageCircle size={18} /> Check availability on WhatsApp
                      </a>
                    </div>
                  ) : (
                    <>
                      <h4 className="font-display mt-6 text-xl text-[var(--teal-900)]">Available slots</h4>
                      {availabilityBusy ? (
                        <p className="font-body mt-3 flex items-center gap-2 text-sm"><Loader2 size={16} className="animate-spin" /> Checking route and availability…</p>
                      ) : (
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          {slots.map((slot) => (
                            <div key={slot.id} className={`rounded-2xl border-2 p-4 ${form.slotId === slot.id ? 'border-[var(--teal-700)] bg-[var(--teal-100)]' : slot.available ? 'border-[var(--teal-100)] bg-white' : 'border-gray-200 bg-gray-100 text-gray-400'}`}>
                              <button
                                type="button"
                                disabled={!slot.available}
                                onClick={() => update('slotId', slot.id)}
                                className={`block w-full text-left ${slot.available ? '' : 'cursor-not-allowed'}`}
                              >
                                <strong className="font-body block text-sm">{slot.label}</strong>
                                <span className="font-body mt-1 block text-xs">{slot.available ? 'Available' : slot.reason}</span>
                              </button>
                              {slot.whatsappOnly && (
                                <a
                                  href={enquiryWhatsApp({ form, resolved, distance, requestedSlot: slot })}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="font-body mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[var(--terracotta-600)] underline"
                                >
                                  <MessageCircle size={14} /> Check this slot on WhatsApp
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {fieldErrors.slotId && <p className="font-body mt-3 text-xs font-bold text-[var(--terracotta-600)]">{fieldErrors.slotId}</p>}
                    </>
                  )}
                </div>
              )}

              {step === 3 && (
                <div>
                  <h3 className="font-display text-2xl text-[var(--teal-900)]">Booking payment</h3>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <button type="button" onClick={() => update('paymentMethod', 'onsite')} className={`pick-card p-6 text-left ${form.paymentMethod === 'onsite' ? 'active' : ''}`}>
                      <strong className="font-display text-xl">Pay Onsite</strong>
                      <p className="font-body mt-2 text-sm text-[var(--ink-muted)]">Pay after the service by cash or UPI.</p>
                    </button>
                    <button type="button" onClick={() => update('paymentMethod', 'advance')} className={`pick-card p-6 text-left ${form.paymentMethod === 'advance' ? 'active' : ''}`}>
                      <strong className="font-display text-xl">₹{BOOKING_FEE} Booking Fee</strong>
                      <p className="font-body mt-2 text-sm text-[var(--ink-muted)]">Reserve your slot with a fixed ₹{BOOKING_FEE} fee. The remaining amount is paid after service.</p>
                    </button>
                  </div>
                </div>
              )}

              {error && !outsideArea && (
                <p className="font-body mt-5 rounded-xl bg-[var(--terracotta-100)] px-4 py-3 text-sm font-bold text-[var(--terracotta-600)]">{error}</p>
              )}

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <button type="button" disabled={step === 0 || busy} onClick={() => goToStep(step - 1, 'back')} className="btn-ghost-teal disabled:invisible">
                  <ArrowLeft size={17} /> Back
                </button>
                {step < 3 ? (
                  <button type="button" onClick={next} disabled={step === 2 && outsideArea} className="btn-primary flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50">
                    Continue <ArrowRight size={17} />
                  </button>
                ) : (
                  <button type="button" onClick={submit} disabled={busy} className="btn-primary flex items-center justify-center gap-2">
                    {busy ? <><Loader2 size={17} className="animate-spin" /> Saving…</> : <>Confirm booking <ArrowRight size={17} /></>}
                  </button>
                )}
              </div>
              </div>
            </div>

            <aside className="bg-[var(--teal-900)] p-6 text-white lg:p-8">
              <span className="font-label text-[10px] text-[var(--gold-400)]">YOUR BOOKING</span>
              <h4 className="font-display mt-3 text-2xl">Estimated price</h4>
              <div className="font-body mt-6 space-y-3 text-sm">
                <Summary label="Vehicles" value={`${form.vehicleCount} · ${form.vehicles.map((v)=>v.type).join(", ")}`} />
                <Summary label="Service" value={allHeavyVehicles ? 'Heavy Vehicle Wash' : form.serviceType === 'vehicle-care' ? 'Vehicle Care Visit' : hasHeavyVehicle ? 'Complete Care Wash + Heavy Vehicle Wash' : 'Complete Care Wash'} />
                <Summary label="Extras" value={form.alacarte.length ? form.alacarte.map(serviceName).join(', ') : 'None'} />
                <Summary label="Slot" value={selectedSlot?.label || (outsideArea ? 'WhatsApp enquiry' : 'Not selected')} />
                <Summary label="Payment" value={form.paymentMethod === 'advance' ? `₹${BOOKING_FEE} booking fee` : 'Pay Onsite'} />
              </div>
              <div className="mt-8 border-t border-white/15 pt-6">
                <span className="font-body text-xs text-[var(--teal-100)]">Estimated service total</span>
                <strong className="font-display mt-1 block text-4xl">₹{resolved.amount}{resolved.variablePricing ? '+' : ''}</strong>
                {resolved.variablePricing && <p className="font-body mt-2 text-xs leading-5 text-[var(--teal-100)]">Condition-based extras are not fully included in this estimate. We’ll confirm their price before work begins.</p>}
                {form.groupOffer && <p className="font-body mt-2 rounded-xl bg-white/10 p-3 text-xs leading-5 text-[var(--teal-100)]">20–30% group saving eligible · final discount confirmed by Aqua Haul.</p>}
              </div>
            </aside>
          </div>
        </div>
      </div>
      <style jsx>{`
        .booking-step-slide {
          width: 100%;
          will-change: transform, opacity;
          animation-duration: 260ms;
          animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
          animation-fill-mode: both;
        }

        .booking-step-slide.is-forward {
          animation-name: bookingStepForward;
        }

        .booking-step-slide.is-back {
          animation-name: bookingStepBack;
        }

        @keyframes bookingStepForward {
          from {
            opacity: 0;
            transform: translate3d(34px, 0, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes bookingStepBack {
          from {
            opacity: 0;
            transform: translate3d(-34px, 0, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        @media (min-width: 768px) {
          @keyframes bookingStepForward {
            from {
              opacity: 0;
              transform: translate3d(46px, 0, 0);
            }
            to {
              opacity: 1;
              transform: translate3d(0, 0, 0);
            }
          }

          @keyframes bookingStepBack {
            from {
              opacity: 0;
              transform: translate3d(-46px, 0, 0);
            }
            to {
              opacity: 1;
              transform: translate3d(0, 0, 0);
            }
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .booking-step-slide {
            animation: none !important;
          }
        }
      `}</style>

      <WaveDivider color="var(--teal-700)" />
    </section>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="font-body mb-1.5 block text-sm font-extrabold text-[var(--teal-900)]">{label}</span>
      {children}
      {error && <span className="font-body mt-1.5 block text-xs font-bold text-[var(--terracotta-600)]">{error}</span>}
    </label>
  );
}

function Summary({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
      <span className="text-[var(--teal-100)]">{label}</span>
      <strong className="text-right">{value}</strong>
    </div>
  );
}

function Success({ booking, paid, onPaid, onReset }) {
  const advance = booking.payment_method === 'advance';
  return (
    <section id="booking" className="bg-[var(--cream-100)] px-4 py-16">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-[28px] bg-white shadow-xl">
        <div className="bg-[var(--teal-900)] p-8 text-center text-white">
          <CheckCircle2 className="mx-auto" size={44} />
          <h3 className="font-display mt-3 text-3xl">Booking received</h3>
          <p className="font-body mt-2 text-sm">Reference {bookingRef(booking.id)} · Pending confirmation</p>
        </div>
        <div className="grid md:grid-cols-2">
          <div className="p-7">
            <h4 className="font-display text-2xl text-[var(--teal-900)]">Summary</h4>
            <div className="font-body mt-5 space-y-2 text-sm">
              <p><strong>{booking.name}</strong> · {booking.phone}</p>
              <p>{booking.vehicle_count || 1} vehicle{(booking.vehicle_count || 1) > 1 ? 's' : ''} · {Array.isArray(booking.vehicles) && booking.vehicles.length ? booking.vehicles.map((v)=>v.type).join(', ') : booking.vehicle_type}</p>
              <p><strong>{booking.service_type === 'vehicle-care' ? 'Vehicle Care Visit' : booking.package_id ? 'Complete Care Wash' : 'Heavy Vehicle Wash'}</strong></p><p>{(booking.alacarte || []).length ? `Extras: ${(booking.alacarte || []).map(serviceName).join(', ')}` : 'No extras selected'}</p>{booking.group_offer && <p><strong>Group offer:</strong> 20–30% eligible</p>}
              <p>{formatDate(booking.booking_date)} · {booking.booking_time}</p>
              <p><strong>House:</strong> {booking.address}</p>
              {booking.map_address && <p><strong>Place:</strong> {booking.map_address}</p>}
              {booking.landmark && <p><strong>Landmark:</strong> {booking.landmark}</p>}
              {mapsLink(booking.latitude, booking.longitude) && (
                <a href={mapsLink(booking.latitude, booking.longitude)} target="_blank" rel="noreferrer" className="font-body text-sm font-bold text-[var(--teal-700)] underline">Open in Google Maps</a>
              )}
              <p className="font-body mt-3 text-xs font-bold uppercase tracking-wide text-[var(--ink-muted)]">Estimated service total</p>
              <p className="font-display text-3xl text-[var(--terracotta-600)]">₹{booking.amount}{(booking.alacarte || []).some((id)=>['enginebay','seatclean','waterspot'].includes(id)) ? '+' : ''}</p>
              {(booking.alacarte || []).some((id)=>['enginebay','seatclean','waterspot'].includes(id)) && <p className="font-body text-xs text-[var(--ink-muted)]">Condition-based extras are confirmed before work begins.</p>}
            </div>
          </div>
          <div className="border-t bg-[var(--cream-50)] p-7 md:border-l md:border-t-0">
            {advance && (
              <>
                <div className="mb-3 rounded-2xl bg-white p-4"><p className="font-label text-[10px] text-[var(--terracotta-600)]">SLOT RESERVATION</p><p className="font-display mt-1 text-2xl text-[var(--teal-900)]">₹{BOOKING_FEE} booking fee</p><p className="font-body mt-1 text-xs text-[var(--ink-muted)]">This reserves your booking. Pay the remaining service amount after the wash.</p></div>
                <PaymentPanel amount={String(BOOKING_FEE)} note={`Aqua Haul booking fee ${bookingRef(booking.id)}`} />
                <button type="button" onClick={onPaid} className="btn-ghost-teal mt-4 w-full">I have completed the payment</button>
              </>
            )}
            <a href={bookingWhatsApp(booking, paid)} target="_blank" rel="noreferrer" className="btn-primary mt-4 flex w-full items-center justify-center gap-2">
              <MessageCircle size={18} /> Send booking on WhatsApp
            </a>
            <button type="button" onClick={onReset} className="btn-ghost-teal mt-3 w-full">Book another wash</button>
          </div>
        </div>
      </div>
    </section>
  );
}
