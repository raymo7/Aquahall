import PageShell from '../../components/PageShell';
import EnquiryForm from '../../components/EnquiryForm';
import StandalonePayment from '../../components/StandalonePayment';
export const metadata={title:'Contact | Aqua Haul'};
export default function ContactPage(){return <PageShell><section className="page-banner"><span className="font-label">CONTACT AQUA HAUL</span><h1 className="font-display">Questions or special requests?</h1><p>Send an enquiry, contact us on WhatsApp, or complete an existing payment.</p></section><EnquiryForm/><StandalonePayment/></PageShell>}
