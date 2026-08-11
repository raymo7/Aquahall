import PageShell from '../../components/PageShell';
import BookingForm from '../../components/BookingForm';

export const metadata = { title: 'Book Vehicle Care | Aqua Haul' };

export default function BookPage() {
  return (
    <PageShell hideFooter>
      <BookingForm />
    </PageShell>
  );
}
