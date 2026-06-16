import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SideNav from '../components/SideNav';
import { useAuthStore } from '../stores/authStore';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, refreshMe } = useAuthStore();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    refreshMe();
  }, []);

  if (!user) return null;

  const [first, ...rest] = user.name.split(' ');
  const last = rest.join(' ');
  const addresses = user.addresses ?? [];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="fl">
      <Header />

      <section style={{ padding: '56px 0 120px', background: 'var(--paper)' }}>
        <div className="container fl-grid-account" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 80, alignItems: 'flex-start' }}>
          <SideNav active="profile" />

          <main>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, paddingBottom: 24, borderBottom: '1px solid var(--hairline)' }}>
              <div>
                <div className="eyebrow">Profile</div>
                <h1 className="display-3" style={{ marginTop: 10 }}>Your details.</h1>
              </div>
              <button onClick={handleLogout} className="btn btn--ghost btn--sm">Sign out</button>
            </div>

            <div className="card" style={{ padding: 36, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                <h3 className="display-4">Personal information</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {[['First name', first],['Last name', last || '—'],['Email', user.email],['Mobile', user.phone || '—']].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div className="eyebrow" style={{ color: 'var(--ink-mute)' }}>{k}</div>
                    <div className="body" style={{ color: 'var(--ink)', fontSize: 16 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: 36, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3 className="display-4">Address book</h3>
              </div>
              {addresses.length === 0
                ? <div className="body-sm" style={{ padding: 18, background: 'var(--paper)', borderRadius: 4, border: '1px dashed var(--hairline)' }}>No addresses saved yet.</div>
                : addresses.map((addr, i) => (
                    <div key={i} style={{ padding: 18, border: '1px solid var(--hairline)', borderRadius: 4, marginBottom: 12 }}>
                      <div className="caps" style={{ marginBottom: 6 }}>{addr.label || 'Address'}</div>
                      <div className="body">{addr.line1}{addr.line2 ? ', ' + addr.line2 : ''}, {addr.city} — {addr.pincode}</div>
                    </div>
                  ))
              }
            </div>

            <div className="card" style={{ padding: 36 }}>
              <div style={{ marginBottom: 24 }}>
                <h3 className="display-4">Security</h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[['Password','Update your account password','Update'],['Active sessions','View and manage active login sessions','Review']].map(([t, d, a], i) => (
                  <li key={t} style={{ display: 'grid', gridTemplateColumns: '1fr auto', padding: '20px 0', borderTop: i === 0 ? '1px solid var(--hairline-soft)' : 'none', borderBottom: '1px solid var(--hairline-soft)', alignItems: 'center' }}>
                    <div>
                      <div className="caps" style={{ color: 'var(--ink)' }}>{t}</div>
                      <div className="body-sm" style={{ marginTop: 4 }}>{d}</div>
                    </div>
                    <a className="btn btn--outline btn--sm">{a}</a>
                  </li>
                ))}
              </ul>
            </div>
          </main>
        </div>
      </section>

      <Footer />
    </div>
  );
}
