function CarBody({ fill = 'var(--teal-700)' }) {
  return (
    <g>
      <path d="M20,130 C20,110 35,100 55,98 L70,80 C75,74 85,70 95,70 L130,70 C142,70 152,76 158,86 L168,100 C182,102 190,112 190,124 L190,138 L170,138 C170,148 162,156 152,156 C142,156 134,148 134,138 L76,138 C76,148 68,156 58,156 C48,156 40,148 40,138 L20,138 Z" fill={fill} />
      <circle cx="58" cy="138" r="14" fill="var(--ink)" />
      <circle cx="58" cy="138" r="6" fill="var(--cream-50)" />
      <circle cx="152" cy="138" r="14" fill="var(--ink)" />
      <circle cx="152" cy="138" r="6" fill="var(--cream-50)" />
      <path d="M78,98 L88,80 C90,76 94,74 98,74 L124,74 C130,74 136,78 140,84 L150,98 Z" fill="var(--cream-50)" opacity="0.35" />
    </g>
  );
}

export function FoamWashArt() {
  const bubbles = [[40, 60, 16], [65, 45, 20], [95, 38, 22], [128, 44, 19], [155, 58, 15], [50, 80, 10], [145, 82, 11]];
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <CarBody fill="var(--teal-700)" />
      {bubbles.map(([cx, cy, r], i) => (
        <circle key={i} className="bubble" style={{ animationDelay: `${i * 0.3}s` }} cx={cx} cy={cy} r={r} fill="var(--cream-50)" stroke="var(--teal-600)" strokeWidth="1.5" opacity="0.92" />
      ))}
    </svg>
  );
}

export function SteamWashArt() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <CarBody fill="var(--teal-700)" />
      {[50, 80, 110, 140].map((x, i) => (
        <path key={i} className="steam-line" style={{ animationDelay: `${i * 0.4}s` }} d={`M${x},70 C${x - 10},55 ${x + 10},45 ${x},30`} stroke="var(--gold-400)" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.7" />
      ))}
    </svg>
  );
}

export function EngineArt() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <path d="M35,150 L35,95 C35,85 43,78 53,78 L145,78 C155,78 163,85 163,95 L163,150 Z" fill="var(--teal-700)" />
      <rect x="55" y="60" width="30" height="24" rx="4" fill="var(--terracotta-500)" />
      <rect x="110" y="60" width="30" height="24" rx="4" fill="var(--terracotta-500)" />
      <rect x="50" y="100" width="100" height="14" rx="4" fill="var(--cream-50)" opacity="0.85" />
      <rect x="50" y="122" width="100" height="14" rx="4" fill="var(--cream-50)" opacity="0.6" />
      <g transform="translate(120,122) rotate(35)">
        <rect x="-6" y="-38" width="12" height="50" rx="6" fill="var(--gold-400)" />
        <circle cx="0" cy="-40" r="12" fill="none" stroke="var(--gold-400)" strokeWidth="7" />
      </g>
    </svg>
  );
}

export function InteriorArt() {
  const sparkles = [[45, 60], [150, 50], [100, 28], [160, 92], [35, 100]];
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <path d="M55,160 L55,110 C55,95 65,84 82,80 L82,55 C82,48 88,42 96,42 L104,42 C112,42 118,48 118,55 L118,80 C135,84 145,95 145,110 L145,160 Z" fill="var(--teal-700)" />
      <rect x="70" y="95" width="60" height="45" rx="10" fill="var(--cream-50)" opacity="0.3" />
      {sparkles.map(([x, y], i) => (
        <path key={i} className="bubble" style={{ animationDelay: `${i * 0.25}s` }} d={`M${x},${y} l4,10 l10,2 l-8,7 l2,10 l-8,-6 l-8,6 l2,-10 l-8,-7 l10,-2 Z`} fill="var(--gold-400)" />
      ))}
    </svg>
  );
}

export function AcArt() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <rect x="45" y="70" width="110" height="45" rx="10" fill="var(--teal-700)" />
      {[62, 82, 102, 122, 142].map((x, i) => (
        <rect key={i} x={x} y="80" width="6" height="25" rx="3" fill="var(--cream-50)" opacity="0.85" />
      ))}
      <g transform="translate(100,150)">
        <path d="M0,-20 L0,20 M-17,-10 L17,10 M17,-10 L-17,10" stroke="var(--teal-600)" strokeWidth="5" strokeLinecap="round" />
        <circle r="6" fill="var(--gold-400)" />
      </g>
      {[40, 150].map((x, i) => (
        <path key={i} className="steam-line" style={{ animationDelay: `${i * 0.5}s` }} d={`M${x},70 C${x - 8},55 ${x + 8},45 ${x},32`} stroke="var(--gold-400)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
      ))}
    </svg>
  );
}

export function HeavyVehicleArt() {
  const bubbles = [[30, 60], [55, 50], [80, 58]];
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <path d="M15,140 L15,90 C15,84 20,80 26,80 L95,80 L95,140 Z" fill="var(--terracotta-500)" />
      <path d="M95,95 L130,95 C138,95 145,100 149,108 L160,130 L160,140 L95,140 Z" fill="var(--teal-700)" />
      <rect x="105" y="105" width="24" height="18" rx="3" fill="var(--cream-50)" opacity="0.75" />
      <circle cx="45" cy="148" r="15" fill="var(--ink)" /><circle cx="45" cy="148" r="6" fill="var(--cream-50)" />
      <circle cx="140" cy="148" r="15" fill="var(--ink)" /><circle cx="140" cy="148" r="6" fill="var(--cream-50)" />
      {bubbles.map(([cx, cy], i) => (
        <circle key={i} className="bubble" style={{ animationDelay: `${i * 0.3}s` }} cx={cx} cy={cy} r={9} fill="var(--cream-50)" stroke="var(--teal-600)" strokeWidth="1.5" opacity="0.9" />
      ))}
    </svg>
  );
}
