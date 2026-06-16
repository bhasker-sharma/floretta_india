import Header from '../components/Header';
import Footer from '../components/Footer';
import Icon from '../components/Icon';
import Sprig from '../components/Sprig';

const pillars = [
  {
    n: '01',
    title: 'Glass over plastic',
    body: 'Every Glow Ubtan comes in a hand-finished glass jar — not plastic. Glass is endlessly recyclable, doesn\'t leach chemicals, and stays beautiful on your shelf for years after the product is gone. Our inner seals are paper-backed, not foil. Our outer labels are printed on recycled kraft paper with soy inks.',
    icon: 'leaf',
  },
  {
    n: '02',
    title: 'Local ingredient sourcing',
    body: 'Every botanical in our formula is sourced from farms within Rajasthan and Gujarat. Multani mitti from Jodhpur. Rose petals from Pushkar. Sandalwood from certified Karnataka growers. We work directly with small-scale farmers — no intermediary. This means fairer wages, fresher ingredients, and a shorter supply chain.',
    icon: 'leaf',
  },
  {
    n: '03',
    title: 'Small-batch, by design',
    body: 'We make in batches of under 500 units at a time. This is a deliberate choice — not a limitation. Small batches mean fresher product, lower waste, tighter quality control, and less unsold inventory going to landfill. We would rather sell out than overproduce.',
    icon: 'check',
  },
  {
    n: '04',
    title: 'No synthetic anything',
    body: 'No synthetic fragrances, no parabens, no SLS, no silicones, no synthetic dyes, no artificial preservatives. What you smell is the botanicals. What you feel is the botanicals. Everything in the formula has a name you can look up.',
    icon: 'check',
  },
  {
    n: '05',
    title: 'Cruelty-free, always',
    body: 'We have never tested on animals. We never will. Our manufacturing partner in Jaipur is Leaping Bunny compliant. We do not use any ingredients derived from animals or insect by-products.',
    icon: 'check',
  },
];

const roadmap = [
  ['2026', 'Ship in 100% recycled outer packaging — removing all virgin cardboard'],
  ['2026', 'Launch a jar refill programme — bring back your empty, get ₹50 off'],
  ['2027', 'Carbon-neutral shipping across all orders via certified offset'],
  ['2027', 'First zero-waste batch trial — all ingredient offcuts composted on-site'],
  ['2028', 'B-Corp certification application'],
];

export default function SustainabilityPage() {
  return (
    <div className="fl">
      <Header />

      {/* Hero */}
      <section className="ink-bg" style={{ padding: '96px 0' }}>
        <div className="container">
          <div className="fl-grid-two" style={{ display: 'grid', gridTemplateColumns: '1fr 0.6fr', gap: 80, alignItems: 'center' }}>
            <div>
              <div className="eyebrow" style={{ color: '#BFAE8F' }}>Our commitment</div>
              <h1 className="display-2" style={{ marginTop: 18, color: '#F1E6D2', fontWeight: 400 }}>
                The earth gave us<br />
                <em style={{ fontStyle: 'italic', fontWeight: 300, color: '#7A8A6F' }}>seven herbs.</em><br />
                We owe it back.
              </h1>
              <p className="body-lg" style={{ color: '#C7B8A2', marginTop: 28, maxWidth: 520 }}>
                Sustainability at Floretta is not a marketing word. It's a daily constraint we build around — in what we source, how we make, how we ship, and what we ship in.
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Sprig w={80} h={160} color="#7A8A6F" />
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section style={{ padding: '120px 0', background: 'var(--paper)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <div className="eyebrow eyebrow--sage">What we do</div>
            <h2 className="display-3" style={{ marginTop: 14 }}>
              Five things we hold<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>non-negotiable.</em>
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, borderTop: '1px solid var(--hairline)' }}>
            {pillars.map((p, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 48, padding: '48px 0', borderBottom: '1px solid var(--hairline)', alignItems: 'flex-start' }}>
                <span style={{ fontFamily: 'var(--f-display)', fontSize: 56, color: 'var(--maroon)', fontStyle: 'italic', fontWeight: 300, lineHeight: 1 }}>{p.n}</span>
                <div>
                  <h3 className="display-4" style={{ marginBottom: 16 }}>{p.title}</h3>
                  <p className="body-lg" style={{ maxWidth: 680 }}>{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section style={{ background: 'var(--cream)', borderTop: '1px solid var(--hairline)', borderBottom: '1px solid var(--hairline)', padding: '80px 0' }}>
        <div className="container">
          <div className="fl-grid-four" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {[
              ['100%', 'Glass packaging — zero plastic in the jar'],
              ['7', 'Botanicals, all India-sourced'],
              ['< 500', 'Units per batch — always small'],
              ['0', 'Synthetic additives, ever'],
            ].map(([n, d], i) => (
              <div key={i} style={{ paddingLeft: i ? 32 : 0, borderLeft: i ? '1px solid var(--hairline)' : 'none' }}>
                <div style={{ fontFamily: 'var(--f-display)', fontSize: 56, color: 'var(--maroon)', fontWeight: 400, lineHeight: 1 }}>{n}</div>
                <div className="body-sm" style={{ marginTop: 12 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section style={{ padding: '120px 0', background: 'var(--paper)' }}>
        <div className="container fl-grid-two" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 80 }}>
          <div>
            <div className="eyebrow eyebrow--maroon">What's next</div>
            <h2 className="display-3" style={{ marginTop: 14 }}>
              Our sustainability<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>roadmap.</em>
            </h2>
            <p className="body-lg" style={{ marginTop: 24 }}>
              We publish our commitments publicly so you can hold us to them. This is where we're going — and when.
            </p>
          </div>

          <div style={{ borderTop: '1px solid var(--hairline)' }}>
            {roadmap.map(([year, text], i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 28, padding: '28px 0', borderBottom: '1px solid var(--hairline)', alignItems: 'flex-start' }}>
                <span className="mono" style={{ color: 'var(--maroon)', fontSize: 13, fontWeight: 600 }}>{year}</span>
                <p className="body">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Honest statement */}
      <section className="ink-bg" style={{ padding: '96px 0' }}>
        <div className="container" style={{ maxWidth: 800, textAlign: 'center' }}>
          <div className="eyebrow" style={{ color: '#BFAE8F' }}>An honest note</div>
          <h2 className="display-3" style={{ color: '#F1E6D2', marginTop: 18, fontWeight: 400 }}>
            We are not perfect.<br />
            <em style={{ fontStyle: 'italic', fontWeight: 300, color: '#D8967C' }}>We are trying.</em>
          </h2>
          <p className="body-lg" style={{ color: '#C7B8A2', marginTop: 28, maxWidth: 640, margin: '28px auto 0' }}>
            We still use courier packaging that isn't fully recycled. Our shipping carbon footprint is something we're actively working to offset. We don't have every answer yet. But we're small enough to move fast — and honest enough to say where we fall short.
          </p>
          <p className="body-lg" style={{ color: '#C7B8A2', marginTop: 18 }}>
            If you have ideas, call us out, or want to collaborate on sustainability — write to us at <span style={{ color: '#D8967C' }}>sustainability@floretta.in</span>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
