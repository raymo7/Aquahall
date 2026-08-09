import PageShell from '../../components/PageShell';
import BookingForm from '../../components/BookingForm';
export const metadata={title:'Book Vehicle Care | Aqua Haul'};
export default function BookPage(){return <PageShell><section className="page-banner"><span className="font-label">BOOK AQUA HAUL</span><h1 className="font-display">Tell us what your car needs.</h1><p>From a fresh doorstep wash to an away-from-home care visit, choose your service, exact location and available route-aware slot.</p></section><BookingForm/></PageShell>}
