import { BASE_LOCATION } from './scheduling';

function placesKey() {
  const value = process.env.GOOGLE_MAPS_API_KEY;
  if (!value) throw new Error('GOOGLE_MAPS_API_KEY is not configured.');
  return value;
}

function routesKey() {
  const value = process.env.GOOGLE_MAPS_ROUTES_API_KEY;
  if (!value) throw new Error('GOOGLE_MAPS_ROUTES_API_KEY is not configured.');
  return value;
}

async function readGoogleError(response) {
  let body = null;

  try {
    body = await response.clone().json();
  } catch {
    try {
      const text = await response.clone().text();
      body = text ? { message: text } : null;
    } catch {
      body = null;
    }
  }

  const googleError = body?.error || body || {};
  const status = googleError.status || null;
  const message = googleError.message || null;
  const details = Array.isArray(googleError.details)
    ? googleError.details.map((detail) => ({
        reason: detail?.reason || detail?.errorInfo?.reason || null,
        domain: detail?.domain || detail?.errorInfo?.domain || null,
        metadata: detail?.metadata || detail?.errorInfo?.metadata || null,
      }))
    : null;

  return {
    httpStatus: response.status,
    httpStatusText: response.statusText,
    status,
    message,
    details,
  };
}

async function throwGoogleApiError(response, apiName, publicMessage) {
  const diagnostic = await readGoogleError(response);

  console.error(`[${apiName}] Google API request failed`, diagnostic);

  const error = new Error(publicMessage);
  error.code = `${apiName.toUpperCase().replace(/\s+/g, '_')}_FAILED`;
  error.httpStatus = response.status;
  error.googleStatus = diagnostic.status;
  throw error;
}

export async function autocompletePlaces(input, sessionToken) {
  const response = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': placesKey(),
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

  if (!response.ok) {
    await throwGoogleApiError(
      response,
      'Places autocomplete',
      'We could not search Google Maps right now. Please try again.'
    );
  }

  const data = await response.json();

  return (data.suggestions || [])
    .map((item) => item.placePrediction)
    .filter(Boolean)
    .map((place) => ({
      placeId: place.placeId,
      text: place.text?.text || '',
      mainText: place.structuredFormat?.mainText?.text || place.text?.text || '',
      secondaryText: place.structuredFormat?.secondaryText?.text || '',
    }));
}

export async function getPlace(placeId, sessionToken) {
  const fields = 'id,displayName,formattedAddress,location';

  const response = await fetch(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
    {
      headers: {
        'X-Goog-Api-Key': placesKey(),
        'X-Goog-FieldMask': fields,
        ...(sessionToken ? { 'X-Goog-Session-Token': sessionToken } : {}),
      },
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    await throwGoogleApiError(
      response,
      'Place lookup',
      'We could not load that Google Maps location. Please try again.'
    );
  }

  return response.json();
}

export async function computeRoute(origin, destination) {
  const response = await fetch(
    'https://routes.googleapis.com/directions/v2:computeRoutes',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': routesKey(),
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
    }
  );

  if (!response.ok) {
    await throwGoogleApiError(
      response,
      'Routes API',
      'We could not calculate the travel route right now. Please try again.'
    );
  }

  const data = await response.json();
  const route = data.routes?.[0];

  if (!route) {
    throw new Error('No driving route was found.');
  }

  return {
    distanceKm: Math.round((route.distanceMeters / 1000) * 10) / 10,
    durationMinutes: Math.ceil(
      Number(String(route.duration || '0s').replace('s', '')) / 60
    ),
  };
}
