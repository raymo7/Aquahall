import { isServicePaused } from '../../lib/servicePause';
import ServicePauseNotice from '../../components/ServicePauseNotice';
import PageShell from '../../components/PageShell';
import PricingSection from '../../components/PricingSection';

export const metadata = { title: 'Services & Pricing | Aqua Haul' };

export const dynamic = 'force-dynamic';
export default async function ServicesPage() {
  const paused = await isServicePaused();
  return (
    <PageShell hideFooter>
      {paused && <ServicePauseNotice compact />}<div className={paused ? "[&_a[href*='/book']]:pointer-events-none [&_a[href*='/book']]:opacity-50" : ""}><PricingSection /></div>
    </PageShell>
  );
}
