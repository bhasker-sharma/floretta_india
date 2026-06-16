import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SideNav from '../components/SideNav';
import api from '../lib/api';
import { useAuthStore } from '../stores/authStore';

const STATUS_COLOR = {
  confirmed:   'var(--maroon)',
  processing:  'var(--maroon)',
  shipped:     '#b45309',
  delivered:   'var(--sage-deep)',
  cancelled:   'var(--ink-mute)',
  refunded:    'var(--ink-mute)',
};

const fmt = (paise) => '₹' + (paise / 100).toLocaleString('en-IN');

export default function OrdersPage() {
  const navigate = useNavigate();
  const user     = useAuthStore(s => s.user);
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    api.get('/orders')
      .then(r => { setOrders(r.data.data ?? r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const totalSpent = orders.reduce((s, o) => s + o.total, 0);

  return (
    <div className="fl">
      <Header />

      <section style={{ padding: '56px 0 120px', background: 'var(--paper)' }}>
        <div className="container fl-grid-account" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 80, alignItems: 'flex-start' }}>
          <SideNav active="orders" />

          <main>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, paddingBottom: 24, borderBottom: '1px solid var(--hairline)' }}>
              <div>
                <div className="eyebrow eyebrow--maroon">Order history</div>
                <h1 className="display-3" style={{ marginTop: 10 }}>
                  {orders.length > 0
                    ? <><em style={{ fontStyle: 'italic', fontWeight: 300 }}>{orders.length} order{orders.length !== 1 ? 's' : ''}</em><br />on record.</>
                    : <>No orders<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>yet.</em></>
                  }
                </h1>
              </div>
            </div>

            {orders.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 32 }}>
                {[['Total orders', orders.length],['Total spent', fmt(totalSpent)],['Member since', new Date(user.created_at || Date.now()).getFullYear()]].map(([k, v]) => (
                  <div key={k} className="card" style={{ padding: 22 }}>
                    <div className="eyebrow" style={{ color: 'var(--ink-mute)' }}>{k}</div>
                    <div style={{ fontFamily: 'var(--f-display)', fontSize: 32, marginTop: 8, fontWeight: 400 }}>{v}</div>
                  </div>
                ))}
              </div>
            )}

            {loading && (
              <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--ink-mute)' }}>
                <span className="body-sm">Loading orders…</span>
              </div>
            )}

            {!loading && orders.length === 0 && (
              <div style={{ padding: '48px 0', textAlign: 'center' }}>
                <p className="body-lg" style={{ color: 'var(--ink-soft)' }}>You haven't placed any orders yet.</p>
                <Link to="/shop" className="btn btn--maroon" style={{ marginTop: 24, display: 'inline-flex' }}>Shop now</Link>
              </div>
            )}

            {!loading && orders.length > 0 && (
              <div className="card">
                <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 0.8fr 0.8fr 0.8fr', padding: '16px 28px', background: 'var(--paper)', borderBottom: '1px solid var(--hairline)', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                  {['Order','Date','Items','Total','Status'].map(h => <span key={h} className="caps" style={{ color: 'var(--ink-mute)' }}>{h}</span>)}
                </div>

                {orders.map((o, i) => (
                  <div key={o.id} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 0.8fr 0.8fr 0.8fr', padding: '24px 28px', borderBottom: i === orders.length - 1 ? 'none' : '1px solid var(--hairline-soft)', alignItems: 'center' }}>
                    <div>
                      <div className="mono" style={{ color: 'var(--ink)' }}>{o.order_number}</div>
                      <div className="body-sm" style={{ marginTop: 4, color: 'var(--ink-soft)' }}>
                        {o.items?.slice(0, 2).map(it => `${it.product_name} · ${it.variant_label}`).join(', ')}
                        {o.items?.length > 2 && ` +${o.items.length - 2} more`}
                      </div>
                    </div>
                    <span className="body">{new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span className="body">{o.items?.length ?? 0} item{(o.items?.length ?? 0) !== 1 ? 's' : ''}</span>
                    <span style={{ fontFamily: 'var(--f-display)', fontSize: 20 }}>{fmt(o.total)}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, color: STATUS_COLOR[o.status] || 'var(--ink-mute)' }}>
                      <span style={{ width: 6, height: 6, borderRadius: 3, background: 'currentColor' }}></span>
                      {o.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </section>

      <Footer />
    </div>
  );
}
