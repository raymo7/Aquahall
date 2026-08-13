import './globals.css';
import './home-blend.css';
import WaterInteraction from '../components/WaterInteraction';

const SITE_URL = 'https://aquahaulktym.space';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Aqua Haul | Book Mobile Car Wash in Kottayam',
    template: '%s | Aqua Haul',
  },
  description:
    'Book Aqua Haul doorstep mobile car wash in Kottayam. Foam wash, underbody wash, interior detailing, steam cleaning and heavy vehicle washing at your location. We bring our own water and power.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'Aqua Haul',
    title: 'Aqua Haul | Book Mobile Car Wash in Kottayam',
    description:
      'Doorstep car wash and vehicle care in the Kottayam area. Book online — we bring our own water and power.',
    images: [{ url: '/gallery/wash_photo.webp', width: 1200, height: 900, alt: 'Aqua Haul doorstep mobile car wash in Kottayam' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aqua Haul | Book Mobile Car Wash in Kottayam',
    description: 'Book doorstep car wash in Kottayam. Aqua Haul brings its own water, power and equipment.',
    images: ['/gallery/wash_photo.webp'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}<WaterInteraction /></body></html>;
}
