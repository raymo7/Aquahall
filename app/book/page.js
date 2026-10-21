import { isServicePaused } from '../../lib/servicePause';
import ServicePauseNotice from '../../components/ServicePauseNotice';
import PageShell from '../../components/PageShell';
import BookingForm from '../../components/BookingForm';

export const metadata = { title: 'Book Vehicle Care | Aqua Haul' };

export const dynamic = 'force-dynamic';
export default async function BookPage() {
  const paused = await isServicePaused();
  return (
    <PageShell hideFooter>
      {paused ? <ServicePauseNotice /> : <BookingForm />}
    </PageShell>
  );
}
