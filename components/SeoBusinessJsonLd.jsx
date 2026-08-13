export default function SeoBusinessJsonLd() {
  const business = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://aquahaulktym.space/#business',
    name: 'Aqua Haul',
    url: 'https://aquahaulktym.space',
    logo: 'https://aquahaulktym.space/logo.jpg',
    image: [
      'https://aquahaulktym.space/gallery/wash_photo.webp',
      'https://aquahaulktym.space/gallery/truck.webp',
    ],
    description:
      'Doorstep mobile car wash and vehicle-care service in the Kottayam area. Aqua Haul brings its own water, power and professional equipment.',
    email: 'aquahaul360@gmail.com',
    telephone: '+918590914778',
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, UPI',
    openingHoursSpecification: [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
      opens: '08:00',
      closes: '21:00',
    }],
    geo: { '@type': 'GeoCoordinates', latitude: 9.7239929, longitude: 76.5471905 },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: { '@type': 'GeoCoordinates', latitude: 9.7239929, longitude: 76.5471905 },
      geoRadius: 20000,
    },
    sameAs: ['https://www.instagram.com/aqua_haul','https://youtube.com/@aquahaul'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Aqua Haul vehicle-care services',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Complete Care Wash', description: 'Doorstep foam wash, underbody wash and interior detailing.', areaServed: 'Kottayam, Kerala' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Vehicle Care Visit', description: 'Vehicle check, start-up, permitted short run, wash and photo/video update.', areaServed: 'Kottayam, Kerala' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Heavy Vehicle Wash', description: 'Mobile washing for trucks, tippers, JCB/Hitachi and mini excavators.', areaServed: 'Kottayam, Kerala' } },
      ],
    },
    potentialAction: {
      '@type': 'ReserveAction',
      target: { '@type': 'EntryPoint', urlTemplate: 'https://aquahaulktym.space/book' },
      result: { '@type': 'Reservation', name: 'Aqua Haul vehicle-care booking' },
    },
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://aquahaulktym.space/#website',
    url: 'https://aquahaulktym.space',
    name: 'Aqua Haul',
    publisher: { '@id': 'https://aquahaulktym.space/#business' },
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(business) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
  </>;
}
