export default function Sprig({ w = 40, h = 80, color = 'var(--sage)' }) {
  return (
    <svg width={w} height={h} viewBox="0 0 40 80" fill="none" stroke={color} strokeWidth="1" strokeLinecap="round">
      <path d="M20 78 Q20 50 20 8" />
      <path d="M20 60 Q8 56 6 42" /><path d="M6 42 Q14 46 20 56" fill={color} fillOpacity=".18" />
      <path d="M20 48 Q32 44 34 30" /><path d="M34 30 Q26 34 20 44" fill={color} fillOpacity=".18" />
      <path d="M20 36 Q8 32 8 18" /><path d="M8 18 Q15 22 20 32" fill={color} fillOpacity=".18" />
      <path d="M20 24 Q30 20 30 8" /><path d="M30 8 Q23 14 20 22" fill={color} fillOpacity=".18" />
    </svg>
  );
}
