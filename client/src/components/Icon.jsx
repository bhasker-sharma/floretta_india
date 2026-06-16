export default function Icon({ name, size = 18, color = 'currentColor', stroke = 1.4 }) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'leaf':   return <svg {...props}><path d="M5 19c0-9 7-14 14-14 0 9-5 14-14 14z"/><path d="M5 19c2-4 5-7 9-9"/></svg>;
    case 'bag':    return <svg {...props}><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>;
    case 'check':  return <svg {...props}><polyline points="4 12 10 18 20 6"/></svg>;
    case 'user':   return <svg {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>;
    case 'lock':   return <svg {...props}><rect x="5" y="11" width="14" height="10" rx="1"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>;
    case 'card':   return <svg {...props}><rect x="3" y="6" width="18" height="12" rx="1"/><path d="M3 10h18"/></svg>;
    case 'truck':  return <svg {...props}><path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>;
    case 'arrow':  return <svg {...props}><path d="M5 12h14"/><path d="M13 5l7 7-7 7"/></svg>;
    case 'plus':   return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case 'minus':  return <svg {...props}><path d="M5 12h14"/></svg>;
    case 'x':      return <svg {...props}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    case 'g':      return (
      <svg width={size} height={size} viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 5.1 29.3 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.3-.4-3.5z"/>
        <path fill="#FF3D00" d="M5.3 14.7l6.6 4.8C13.6 16.2 18.4 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 5.1 29.3 3 24 3 16 3 9.1 7.5 5.3 14.7z"/>
        <path fill="#4CAF50" d="M24 45c5.2 0 9.9-2 13.5-5.2l-6.2-5.3C29.3 36 24 36 24 36c-5.3 0-9.7-3.5-11.3-8.4l-6.5 5C9.1 40.5 16 45 24 45z"/>
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.7l6.2 5.3c-.4.4 6.6-4.8 6.6-14 0-1.2-.1-2.3-.4-3.5z"/>
      </svg>
    );
    default: return null;
  }
}
