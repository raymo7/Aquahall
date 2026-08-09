import PageShell from '../../components/PageShell';
import BookingForm from '../../components/BookingForm';
export const metadata={title:'Book a Wash | Aqua Haul'};
export default function BookPage(){return <PageShell><section className="page-banner"><span className="font-label">ONLINE BOOKING</span><h1 className="font-display">Book your doorstep wash</h1><p>Choose your service, exact location and an available route-aware slot.</p></section><BookingForm/></PageShell>}
