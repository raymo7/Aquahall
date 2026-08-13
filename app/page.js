import PageShell from '../components/PageShell';
import HomeSections from '../components/HomeSections';
import SeoBusinessJsonLd from '../components/SeoBusinessJsonLd';

export const metadata = {
  title: 'Book Mobile Car Wash in Kottayam',
  description:
    'Book Aqua Haul mobile car wash at your doorstep in Kottayam. Complete Care Wash, underbody wash, interior detailing, steam cleaning, vehicle care and heavy vehicle washing.',
  alternates: { canonical: '/' },
};

export default function Home() {
  return <PageShell><SeoBusinessJsonLd /><HomeSections /></PageShell>;
}
