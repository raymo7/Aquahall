export default function WashMotionDivider({ label = 'Fresh care, one step at a time' }) {
  return <div className="wash-motion" aria-hidden="true"><div className="wash-water"><i/><i/><i/><i/></div><div className="wash-car">▱</div><div className="wash-brush"><span/></div><p>{label}</p></div>;
}
