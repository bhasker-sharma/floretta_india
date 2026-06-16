import Header from '../components/Header';
import Footer from '../components/Footer';
import SideNav from '../components/SideNav';
import Icon from '../components/Icon';

const steps = [
  { t: 'Order placed',      d: 'Sat, May 14 · 11:42 AM',              st: 'done' },
  { t: 'Crafted & packed',  d: 'Sun, May 15 · 3:18 PM',               st: 'done' },
  { t: 'Shipped',           d: 'Mon, May 16 · 9:04 AM',               st: 'done' },
  { t: 'Out for delivery',  d: 'Wed, May 18 · expected by 2 PM',       st: 'active' },
  { t: 'Delivered',         d: 'Estimated Wed, May 18',                st: 'pending' },
];

export default function TrackingPage() {
  return (
    <div className="fl">
      <Header showAccount />

      <section style={{ padding: '56px 0 120px', background: 'var(--paper)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 80, alignItems: 'flex-start' }}>
          <SideNav active="track" />

          <main>
            <div style={{ marginBottom: 40, paddingBottom: 24, borderBottom: '1px solid var(--hairline)' }}>
              <div className="eyebrow eyebrow--maroon">Order tracking</div>
              <h1 className="display-3" style={{ marginTop: 10 }}>
                Out for delivery —<br />
                <em style={{ fontStyle: 'italic', fontWeight: 300 }}>arriving today.</em>
              </h1>
            </div>

            <div className="card" style={{ padding: 28, marginBottom: 32, display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: 32, alignItems: 'center' }}>
              <div className="ph ph--sage" style={{ width: 96, height: 96, borderRadius: 4 }}><span style={{ fontSize: 9 }}>jar</span></div>
              <div>
                <div className="mono" style={{ color: 'var(--ink-mute)' }}>ORDER · #FL-2026-04287</div>
                <div className="display-5" style={{ marginTop: 6 }}>Glow Ubtan · 100g + Duo 200g</div>
                <div className="body-sm" style={{ marginTop: 4 }}>2 items · Placed 14 May 2026</div>
              </div>
              <div>
                <div className="eyebrow">Total</div>
                <div style={{ fontFamily: 'var(--f-display)', fontSize: 28, marginTop: 6 }}>₹1,663</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <a className="btn btn--ghost btn--sm">Invoice</a>
                <a className="btn btn--outline btn--sm">Need help?</a>
              </div>
            </div>

            <div className="card" style={{ padding: 36, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
                <div>
                  <div className="eyebrow eyebrow--maroon">Live status</div>
                  <h2 className="display-4" style={{ marginTop: 8 }}>Out for delivery</h2>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="mono">AWB · BD-998273-IN</div>
                  <div className="body-sm">Carrier: BlueDart Express</div>
                </div>
              </div>

              <div style={{ position: 'relative', padding: '40px 0' }}>
                <div style={{ position: 'absolute', left: '5%', right: '5%', top: 64, height: 2, background: 'var(--hairline)' }}></div>
                <div style={{ position: 'absolute', left: '5%', width: 'calc(75% - 5%)', top: 64, height: 2, background: 'var(--maroon)' }}></div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' }}>
                  {steps.map((s, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 8px' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 22, background: s.st === 'pending' ? 'var(--paper)' : s.st === 'active' ? 'var(--maroon)' : 'var(--ink)', border: s.st === 'pending' ? '1px solid var(--hairline)' : 'none', color: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, boxShadow: s.st === 'active' ? '0 0 0 6px rgba(107,31,42,0.10)' : 'none' }}>
                        {s.st === 'done' ? <Icon name="check" size={18} color="var(--cream)" />
                          : s.st === 'active' ? <Icon name="truck" size={18} color="var(--cream)" />
                          : <span style={{ color: 'var(--ink-mute)', fontFamily: 'var(--f-display)', fontStyle: 'italic', fontSize: 18 }}>{i + 1}</span>}
                      </div>
                      <div className="caps" style={{ marginTop: 18, color: s.st === 'pending' ? 'var(--ink-mute)' : 'var(--ink)' }}>{s.t}</div>
                      <div className="body-sm" style={{ marginTop: 6, maxWidth: 180 }}>{s.d}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 24, padding: 20, background: 'var(--paper)', border: '1px solid var(--hairline)', borderRadius: 4, display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 18, alignItems: 'center' }}>
                <span style={{ width: 36, height: 36, borderRadius: 18, background: 'rgba(107,31,42,0.10)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="truck" size={18} color="var(--maroon)" />
                </span>
                <div>
                  <div className="caps" style={{ color: 'var(--maroon)' }}>● Live · 14 mins ago</div>
                  <div className="body" style={{ color: 'var(--ink)', marginTop: 4 }}>Your parcel is with the rider · expected between 1:30 — 2:00 PM.</div>
                </div>
                <a className="btn btn--outline btn--sm">Track on map →</a>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div className="card" style={{ padding: 28 }}>
                <div className="eyebrow eyebrow--maroon">Delivery address</div>
                <div className="display-5" style={{ marginTop: 10, fontSize: 20 }}>—</div>
                <div className="body-sm" style={{ marginTop: 8 }}>Address will appear here once an order is placed.</div>
              </div>
              <div className="card" style={{ padding: 28 }}>
                <div className="eyebrow eyebrow--maroon">Activity</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 0' }}>
                  {[['Out for delivery · Mumbai hub','Today · 12:08 PM'],['Arrived at delivery centre','Today · 06:31 AM'],['In transit — Jaipur → Mumbai','Tue, May 17 · 9:14 PM'],['Picked up by courier','Mon, May 16 · 3:42 PM'],['Order shipped from Jaipur','Mon, May 16 · 9:04 AM']].map(([t, d], i) => (
                    <li key={t} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 14, padding: '12px 0', borderBottom: i === 4 ? 'none' : '1px solid var(--hairline-soft)', alignItems: 'center' }}>
                      <span style={{ width: 8, height: 8, borderRadius: 4, background: i === 0 ? 'var(--maroon)' : 'var(--ink-mute)' }}></span>
                      <span className="body" style={{ color: 'var(--ink)' }}>{t}</span>
                      <span className="mono" style={{ color: 'var(--ink-mute)' }}>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </main>
        </div>
      </section>

      <Footer />
    </div>
  );
}
