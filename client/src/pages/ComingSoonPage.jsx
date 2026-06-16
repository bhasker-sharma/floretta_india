import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sprig from '../components/Sprig';

const upcoming = [
  { n: '02', name: 'Rose Water Toner', desc: 'A gentle, steam-distilled Pushkar rose hydrosol — balances, calms, and preps skin for ritual.', eta: 'Q3 2026', ph: 'ph--clay' },
  { n: '03', name: 'Saffron Face Oil', desc: '12 botanicals in a dry oil base. Kesar, brahmi, ashwagandha. No grease. All glow.', eta: 'Q4 2026', ph: 'ph--sage' },
  { n: '04', name: 'Kashmiri Walnut Scrub', desc: 'Cold-pressed walnut shell, Kashmiri honey, and neem. A weekly deep polish for face and body.', eta: '2027', ph: '' },
];

export default function ComingSoonPage() {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  const handleNotify = (e) => {
    e.preventDefault();
    if (email) setJoined(true);
  };

  return (
    <div className="fl">
      <Header />

      {/* Hero */}
      <section style={{ background: 'var(--paper)', padding: '96px 0 80px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="ornament" style={{ justifyContent: 'center', marginBottom: 24 }}>
            <span className="eyebrow eyebrow--maroon">The apothecary is growing</span>
          </div>
          <h1 className="display-2" style={{ fontWeight: 400 }}>
            New rituals,<br />
            <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--maroon)' }}>arriving soon.</em>
          </h1>
          <p className="body-lg" style={{ marginTop: 24, maxWidth: 520, margin: '24px auto 0' }}>
            We're formulating new additions to the Floretta family. Small-batch, Ayurvedic, honest. Be first to know when they arrive.
          </p>

          {joined ? (
            <div style={{ marginTop: 48, padding: '28px 40px', background: 'var(--cream)', border: '1px solid var(--hairline)', borderRadius: 8, display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div className="display-5" style={{ color: 'var(--sage-deep)' }}>You're on the list.</div>
              <div className="body">We'll email you as soon as the first new product is ready.</div>
            </div>
          ) : (
            <form onSubmit={handleNotify} style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 48, flexWrap: 'wrap' }}>
              <input
                className="field__input"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: 300 }}
                required
              />
              <button type="submit" className="btn btn--maroon btn--lg">Notify me first</button>
            </form>
          )}
        </div>
      </section>

      {/* Upcoming products */}
      <section style={{ padding: '80px 0 120px', background: 'var(--cream)', borderTop: '1px solid var(--hairline)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="eyebrow eyebrow--sage">In the lab</div>
            <h2 className="display-3" style={{ marginTop: 14 }}>
              What's being made<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>right now.</em>
            </h2>
          </div>

          <div className="fl-grid-three" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {upcoming.map((p, i) => (
              <div key={i} className="card" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className={'ph ' + p.ph} style={{ aspectRatio: '3/4', borderRadius: 4, position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 12, right: 12, background: 'var(--maroon)', color: '#FBF7EE', padding: '4px 10px', borderRadius: 2, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
                    Coming {p.eta}
                  </div>
                </div>
                <div>
                  <div className="mono" style={{ color: 'var(--ink-mute)' }}>N° {p.n}</div>
                  <div className="display-5" style={{ marginTop: 6 }}>{p.name}</div>
                  <p className="body-sm" style={{ marginTop: 8 }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA to current product */}
      <section style={{ padding: '80px 0', background: 'var(--paper)', borderTop: '1px solid var(--hairline)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
            <Sprig w={40} h={80} color="var(--sage)" />
          </div>
          <div className="eyebrow eyebrow--maroon">While you wait</div>
          <h2 className="display-3" style={{ marginTop: 14 }}>
            Start with<br />
            <em style={{ fontStyle: 'italic', fontWeight: 300 }}>Glow Ubtan.</em>
          </h2>
          <p className="body-lg" style={{ marginTop: 18, maxWidth: 460, margin: '18px auto 0' }}>
            Our N° 01 product — a seven-herb face and body polish, ₹649.
          </p>
          <Link to="/shop" className="btn btn--maroon btn--lg" style={{ marginTop: 36, display: 'inline-flex' }}>
            Shop now · ₹649
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
