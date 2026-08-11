import PageShell from '../../components/PageShell';
import PricingSection from '../../components/PricingSection';

export const metadata = { title: 'Services & Pricing | Aqua Haul' };

export default function ServicesPage() {
  return (
    <PageShell>
      <PricingSection />
    </PageShell>
  );
}
