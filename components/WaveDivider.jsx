export default function WaveDivider({ color }) {
  return (
    <svg viewBox="0 0 1200 60" className="w-full h-12 block" preserveAspectRatio="none">
      <path d="M0,30 C150,60 350,0 600,25 C850,50 1050,10 1200,30 L1200,60 L0,60 Z" fill={color} />
    </svg>
  );
}
