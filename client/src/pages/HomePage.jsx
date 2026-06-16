import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Stars from '../components/Stars';
import Icon from '../components/Icon';
import Sprig from '../components/Sprig';

export default function HomePage() {
  return (
    <div className="fl">
      <Header active="Shop" />

      {/* Hero */}
      <section style={{ background: 'var(--paper)', position: 'relative', overflow: 'hidden' }}>
        <div className="container fl-hero-section fl-grid-two" style={{ padding: '72px 64px 96px', display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 80, alignItems: 'center' }}>
          <div>
            <div className="ornament" style={{ marginBottom: 28 }}>
              <span className="eyebrow eyebrow--maroon">Est. 2023 · Jaipur, India</span>
            </div>
            <h1 className="display-1" style={{ fontWeight: 400 }}>
              The seven-herb<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--maroon)' }}>face polish</em><br />
              ritual.
            </h1>
            <p className="body-lg" style={{ maxWidth: 460, marginTop: 32 }}>
              A small-batch ubtan ground from seven Ayurvedic botanicals — Multani mitti, sandalwood, rose, manjistha, mulethi, orange peel and rice. Quietly brightens. Honestly herbal. Made for everyone.
            </p>
            <div style={{ display: 'flex', gap: 16, marginTop: 44, alignItems: 'center' }}>
              <Link to="/shop" className="btn btn--maroon btn--lg">
                Shop the Ubtan
                <span style={{ fontWeight: 400, opacity: 0.7 }}>· ₹649</span>
              </Link>
              <a className="btn btn--link">Discover the ritual</a>
            </div>
            <div style={{ display: 'flex', gap: 28, marginTop: 56, alignItems: 'center' }}>
              {['100% Herbal', 'Paraben-free', 'Vegan', 'Unisex'].map(t => (
                <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--ink-soft)' }}>
                  <Icon name="leaf" size={14} color="var(--sage-deep)" />
                  <span className="caps">{t}</span>
                </span>
              ))}
            </div>
          </div>

          <div style={{ position: 'relative', aspectRatio: '4/5' }}>
            <div className="ph ph--sage" style={{ position: 'absolute', inset: 0, borderRadius: 4 }}>
              <span style={{ fontSize: 11 }}>product hero · 1200×1500</span>
              <div className="ph__tag">drop product image here</div>
            </div>
            <div className="seal" style={{ position: 'absolute', top: -28, right: -28, transform: 'rotate(8deg)' }}>
              <span className="seal__n">07</span>
              <span className="seal__t">Sacred Herbs</span>
            </div>
            <div className="mono" style={{ position: 'absolute', left: -56, top: '50%', transform: 'rotate(-90deg) translateY(0)', transformOrigin: 'left center', whiteSpace: 'nowrap' }}>
              N° 01 — GLOW UBTAN · 100g
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--hairline)', borderBottom: '1px solid var(--hairline)', padding: '18px 0', overflow: 'hidden', background: 'var(--cream)' }}>
          <div style={{ display: 'flex', gap: 56, justifyContent: 'center', whiteSpace: 'nowrap' }}>
            {['Multani Mitti', 'Sandalwood', 'Rose Petal', 'Manjistha', 'Mulethi Root', 'Orange Peel', 'Rice Flour'].map((h, i) => (
              <span key={h} className="caps" style={{ color: i === 3 ? 'var(--maroon)' : 'var(--ink-soft)', display: 'inline-flex', alignItems: 'center', gap: 14 }}>
                {h} <i className="diamond" style={{ color: 'var(--clay)' }}></i>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* The Product */}
      <section style={{ background: 'var(--paper)', padding: '120px 0' }}>
        <div className="container fl-grid-two" style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 96, alignItems: 'center' }}>
          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div className="ph" style={{ aspectRatio: '3/4', borderRadius: 4 }}>
              <span>jar · front</span>
              <div className="ph__tag">product · front</div>
            </div>
            <div className="ph ph--clay" style={{ aspectRatio: '3/4', borderRadius: 4, marginTop: 56 }}>
              <span>powder · top</span>
              <div className="ph__tag">texture shot</div>
            </div>
            <Sprig w={48} h={96} color="var(--sage-deep)" />
          </div>

          <div>
            <div className="eyebrow eyebrow--sage">N° 01 — Hero Product</div>
            <h2 className="display-2" style={{ marginTop: 18 }}>
              Glow Ubtan<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--maroon)' }}>Seven-Herb Face &amp; Body Polish</em>
            </h2>
            <p className="body-lg" style={{ marginTop: 28, maxWidth: 540 }}>
              Crafted in Jaipur and stone-milled to a fine, fragrant powder. Mix a teaspoon with raw milk or rosewater into a paste — let it rest, then rinse to reveal skin that feels softer, brighter and lit from within.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '40px 0', borderTop: '1px solid var(--hairline)' }}>
              {[
                ['Skin brightening', 'Multani mitti & manjistha lift dullness'],
                ['Gentle exfoliation', 'Rice flour & orange peel buff away dead cells'],
                ['Calms & softens', 'Sandalwood & mulethi soothe sensitivity'],
                ['For every skin', 'Unisex · all skin types · oil-free finish'],
              ].map(([t, s], i) => (
                <li key={t} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr', gap: 20, padding: '18px 0', borderBottom: '1px solid var(--hairline)' }}>
                  <span className="medallion">{(i + 1).toString().padStart(2, '0')}</span>
                  <span className="display-5">{t}</span>
                  <span className="body">{s}</span>
                </li>
              ))}
            </ul>
            <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
              <Link to="/shop" className="btn btn--primary">Add to Bag — ₹649</Link>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Stars value={5} color="var(--clay)" />
                <span className="body-sm" style={{ marginTop: 4 }}>4.9 / 5 — from 312 reviews</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ingredient gallery */}
      <section id="ingredients" style={{ background: 'var(--cream)', borderTop: '1px solid var(--hairline)', borderBottom: '1px solid var(--hairline)', padding: '120px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 64 }}>
            <div>
              <div className="eyebrow eyebrow--maroon">The Botanicals</div>
              <h2 className="display-3" style={{ marginTop: 18 }}>
                Seven ingredients,<br />
                <em style={{ fontStyle: 'italic', fontWeight: 300 }}>one quiet ritual.</em>
              </h2>
            </div>
            <a className="btn btn--link" style={{ marginBottom: 12 }}>Read the ingredient journal →</a>
          </div>
          <div className="fl-grid-seven" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 16 }}>
            {[['Multani Mitti','Detoxifies'],['Rice Flour','Polishes'],['Sandalwood','Brightens'],['Orange Peel','Refreshes'],['Rose Petal','Calms'],['Manjistha','Evens tone'],['Mulethi','Soothes']].map(([n, role], i) => (
              <div key={n} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className={'ph ' + (i % 3 === 0 ? 'ph--sage' : i % 3 === 1 ? 'ph--clay' : '')} style={{ aspectRatio: '3/4', borderRadius: 4 }}>
                  <span style={{ fontSize: 10 }}>ingredient {i + 1}</span>
                </div>
                <div>
                  <div className="mono" style={{ color: 'var(--ink-mute)' }}>0{i + 1}</div>
                  <div className="display-5" style={{ fontSize: 22, marginTop: 4 }}>{n}</div>
                  <div className="body-sm" style={{ marginTop: 4 }}>{role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Ritual */}
      <section className="ink-bg" style={{ padding: '120px 0', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <div className="eyebrow" style={{ color: '#BFAE8F' }}>The Ritual</div>
            <h2 className="display-3" style={{ marginTop: 18, color: '#F1E6D2' }}>
              Three slow steps,<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: '#D8967C' }}>ten honest minutes.</em>
            </h2>
          </div>
          <div className="fl-grid-ritual" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 64 }}>
            {[['01','Mix','One teaspoon ubtan, with raw milk for dry skin or rose water for oily. Stir to a smooth paste.'],['02','Apply','Pat on cleansed face & neck in upward motions. Avoid the eyes. Rest, breathe, ten minutes.'],['03','Reveal','Wet fingertips and gently massage in circles before rinsing with cool water. Pat dry, moisturise.']].map(([n, t, body]) => (
              <div key={n} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <span style={{ fontFamily: 'var(--f-display)', fontSize: 72, color: '#D8967C', fontStyle: 'italic', lineHeight: 1, fontWeight: 300 }}>{n}</span>
                <div style={{ height: 1, background: '#C7B8A2', opacity: 0.4, width: 64 }}></div>
                <div className="display-5" style={{ color: '#F1E6D2' }}>{t}</div>
                <p className="body" style={{ color: '#C7B8A2', maxWidth: 320 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '120px 0', background: 'var(--paper)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="eyebrow eyebrow--sage">Words from the ritual</div>
            <h2 className="display-3" style={{ marginTop: 18 }}>
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>"Soft, fragrant,</em><br />
              honestly herbal."
            </h2>
          </div>
          <div className="fl-grid-testimonials" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { q: "I've tried every brightening mask under the sun. This is the only one that doesn't strip my skin. Genuinely better in two weeks.", n: 'Aanya R.', c: 'Mumbai · sensitive skin' },
              { q: "Smells like my grandmother's haldi room. My beard area looks even-toned for the first time in years.", n: 'Vikram S.', c: 'Delhi · combination skin' },
              { q: 'The texture is incredibly fine — feels nothing like the gritty ubtans I grew up with. Pure luxury for ₹649.', n: 'Nikita G.', c: 'Bengaluru · dry skin' },
            ].map((r, i) => (
              <div key={i} className="card" style={{ padding: 36, display: 'flex', flexDirection: 'column', gap: 20 }}>
                <Stars value={5} />
                <p style={{ fontFamily: 'var(--f-display)', fontSize: 22, lineHeight: 1.35, color: 'var(--ink)', fontWeight: 400, fontStyle: 'italic' }}>"{r.q}"</p>
                <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid var(--hairline)' }}>
                  <div className="caps" style={{ color: 'var(--ink)' }}>{r.n}</div>
                  <div className="body-sm" style={{ marginTop: 4 }}>{r.c}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promise band */}
      <section style={{ padding: '100px 0', background: 'var(--cream)', borderTop: '1px solid var(--hairline)' }}>
        <div className="container fl-grid-promise" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
          {[['Free shipping','On every order over ₹999'],['Cash on delivery','Available across India'],['7-day returns','On unopened products'],['Made in India','Small-batch, Jaipur']].map(([t, s], i) => (
            <div key={t} style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: i ? 32 : 0, borderLeft: i ? '1px solid var(--hairline)' : 'none' }}>
              <div className="display-5">{t}</div>
              <div className="body-sm">{s}</div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
