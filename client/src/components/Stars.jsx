export default function Stars({ value = 5, size = 14, color = 'var(--clay)' }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2, color }}>
      {[0, 1, 2, 3, 4].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i < value ? color : 'transparent'} stroke={color} strokeWidth="1">
          <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
        </svg>
      ))}
    </span>
  );
}
