import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import MobileBottomNav from './MobileBottomNav';
import BackToTop from './BackToTop';

export default function PageShell({ children, hideFooter = false }) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      {!hideFooter && <SiteFooter />}
      <MobileBottomNav />
      <BackToTop />
    </>
  );
}
