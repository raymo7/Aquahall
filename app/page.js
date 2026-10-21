import { isServicePaused } from '../lib/servicePause';
import ServicePauseNotice from '../components/ServicePauseNotice';
import PageShell from '../components/PageShell';
import HomeSections from '../components/HomeSections';
import SeoBusinessJsonLd from '../components/SeoBusinessJsonLd';

export const metadata = {
  title: 'Book Mobile Car Wash in Kottayam',
  description:
    'Book Aqua Haul mobile car wash at your doorstep in Kottayam. Complete Care Wash, underbody wash, interior detailing, steam cleaning, vehicle care and heavy vehicle washing.',
  alternates: { canonical: '/' },
};

export const dynamic = 'force-dynamic';
export default async function Home() {
  const paused = await isServicePaused();
  return <PageShell><SeoBusinessJsonLd />{paused && <ServicePauseNotice compact />}<HomeSections /></PageShell>;
}
