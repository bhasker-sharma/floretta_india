import { Link } from 'react-router-dom';

const items = [
  ['Dashboard',     '/account'],
  ['Orders',        '/account/orders'],
  ['Track Order',   '/account/track'],
  ['Addresses',     '/account/profile'],
  ['Profile',       '/account/profile'],
  ['Wishlist',      '/account/wishlist'],
  ['Subscriptions', '/account/subscriptions'],
  ['Communication', '/account/communication'],
  ['Sign out',      '/login'],
];

export default function SideNav({ active }) {
  return (
    <aside style={{ width: 240 }}>
      <div className="eyebrow eyebrow--maroon" style={{ marginBottom: 18 }}>The Account</div>
      <div style={{ fontFamily: 'var(--f-display)', fontSize: 36, lineHeight: 1.05, marginBottom: 28, fontWeight: 400 }}>
        Aanya<br />
        <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--maroon)' }}>Rastogi</em>
      </div>
      <div className="mono" style={{ color: 'var(--ink-mute)', marginBottom: 32 }}>Member since · May 2024</div>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' }}>
        {items.map(([t, href]) => {
          const id = href.split('/').pop() || 'account';
          return (
            <li key={t} style={{ padding: '12px 0', borderBottom: '1px solid var(--hairline-soft)' }}>
              <Link to={href} className="caps" style={{ color: active === id ? 'var(--maroon)' : 'var(--ink-soft)', display: 'flex', justifyContent: 'space-between' }}>
                {t}
                {active === id && <span style={{ width: 4, height: 4, borderRadius: 2, background: 'var(--maroon)', alignSelf: 'center' }}></span>}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="card" style={{ marginTop: 32, padding: 20 }}>
        <div className="eyebrow eyebrow--sage">Member tier</div>
        <div className="display-5" style={{ marginTop: 6 }}>Devotee</div>
        <div className="body-sm" style={{ marginTop: 6 }}>2 more orders to Apothecary tier — free express shipping forever.</div>
        <div style={{ height: 4, background: 'var(--hairline)', borderRadius: 2, marginTop: 14, overflow: 'hidden' }}>
          <div style={{ width: '62%', height: '100%', background: 'var(--sage-deep)' }}></div>
        </div>
      </div>
    </aside>
  );
}
