import { BASE_LOCATION } from './scheduling';

function key() {
  const value = process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_ROUTES_API_KEY;
  if (!value) throw new Error('GOOGLE_MAPS_API_KEY is not configured.');
  return value;
}

export async function autocompletePlaces(input, sessionToken) {
  const response = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': key(),
    },
    body: JSON.stringify({
      input,
      sessionToken,
      includedRegionCodes: ['in'],
      locationBias: {
        circle: {
          center: { latitude: BASE_LOCATION.latitude, longitude: BASE_LOCATION.longitude },
          radius: 30000,
        },
      },
    }),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Places autocomplete failed (${response.status}).`);
  const data = await response.json();
  return (data.suggestions || []).map((item) => item.placePrediction).filter(Boolean).map((place) => ({
    placeId: place.placeId,
    text: place.text?.text || '',
    mainText: place.structuredFormat?.mainText?.text || place.text?.text || '',
    secondaryText: place.structuredFormat?.secondaryText?.text || '',
  }));
}

export async function getPlace(placeId, sessionToken) {
  const fields = 'id,displayName,formattedAddress,location';
  const response = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
    headers: {
      'X-Goog-Api-Key': key(),
      'X-Goog-FieldMask': fields,
      ...(sessionToken ? { 'X-Goog-Session-Token': sessionToken } : {}),
    },
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Place lookup failed (${response.status}).`);
  return response.json();
}

export async function computeRoute(origin, destination) {
  const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': key(),
      'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters',
    },
    body: JSON.stringify({
      origin: { location: { latLng: origin } },
      destination: { location: { latLng: destination } },
      travelMode: 'DRIVE',
      routingPreference: 'TRAFFIC_AWARE',
      computeAlternativeRoutes: false,
      languageCode: 'en-IN',
      units: 'METRIC',
    }),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Routes API failed (${response.status}).`);
  const data = await response.json();
  const route = data.routes?.[0];
  if (!route) throw new Error('No driving route was found.');
  return {
    distanceKm: Math.round((route.distanceMeters / 1000) * 10) / 10,
    durationMinutes: Math.ceil(Number(String(route.duration || '0s').replace('s', '')) / 60),
  };
}
