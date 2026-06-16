import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sprig from '../components/Sprig';

const values = [
  { n: '01', title: 'Small is intentional', body: 'We are a small team by choice, not by constraint. Every person here works across the whole product — from ingredient sourcing to customer experience.' },
  { n: '02', title: 'Honest over polished', body: 'We say what we mean and write what is true. No corporate language, no over-promising. The brand voice you see externally is how we communicate internally too.' },
  { n: '03', title: 'Roots matter', body: 'We are an Indian brand, proudly. We source from Indian farms, manufacture in Jaipur, and build for Indian skin. Context is everything.' },
  { n: '04', title: 'Slow and considered', body: 'We don\'t rush launches, don\'t chase trends, and don\'t overwork people to hit arbitrary deadlines. We make things carefully and release them when they are ready.' },
];

export default function CareersPage() {
  return (
    <div className="fl">
      <Header />

      {/* Hero */}
      <section className="ink-bg" style={{ padding: '96px 0' }}>
        <div className="container">
          <div className="fl-grid-two" style={{ display: 'grid', gridTemplateColumns: '1fr 0.5fr', gap: 80, alignItems: 'center' }}>
            <div>
              <div className="eyebrow" style={{ color: '#BFAE8F' }}>Careers at Floretta</div>
              <h1 className="display-2" style={{ marginTop: 18, color: '#F1E6D2', fontWeight: 400 }}>
                Build something<br />
                <em style={{ fontStyle: 'italic', fontWeight: 300, color: '#D8967C' }}>worth making.</em>
              </h1>
              <p className="body-lg" style={{ color: '#C7B8A2', marginTop: 28, maxWidth: 520 }}>
                We are a small team obsessed with doing one thing well — bringing honest, Ayurvedic skincare to people who care about what they put on their skin.
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Sprig w={80} h={160} color="#7A8A6F" />
            </div>
          </div>
        </div>
      </section>

      {/* No openings */}
      <section style={{ padding: '100px 0', background: 'var(--paper)' }}>
        <div className="container" style={{ maxWidth: 800, textAlign: 'center' }}>
          <div className="eyebrow eyebrow--maroon">Open positions</div>
          <h2 className="display-3" style={{ marginTop: 14 }}>
            No openings<br />
            <em style={{ fontStyle: 'italic', fontWeight: 300 }}>right now.</em>
          </h2>
          <p className="body-lg" style={{ marginTop: 24, maxWidth: 560, margin: '24px auto 0' }}>
            We are a small, intentional team and we hire slowly and carefully. There are no open positions at the moment — but we are always open to hearing from the right people.
          </p>
          <p className="body-lg" style={{ marginTop: 18 }}>
            If you believe you'd be a good fit — in branding, content, operations, or product development — write to us at{' '}
            <a href="mailto:careers@floretta.in" style={{ color: 'var(--maroon)', borderBottom: '1px solid var(--maroon)' }}>careers@floretta.in</a>{' '}
            with a short note about who you are and what you'd want to work on.
          </p>
          <a href="mailto:careers@floretta.in" className="btn btn--maroon btn--lg" style={{ marginTop: 40, display: 'inline-flex' }}>
            Send us a note
          </a>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '100px 0 120px', background: 'var(--cream)', borderTop: '1px solid var(--hairline)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <div className="eyebrow eyebrow--sage">How we work</div>
            <h2 className="display-3" style={{ marginTop: 14 }}>
              What it's like<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>to be here.</em>
            </h2>
          </div>
          <div style={{ borderTop: '1px solid var(--hairline)' }}>
            {values.map((v, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 48, padding: '48px 0', borderBottom: '1px solid var(--hairline)', alignItems: 'flex-start' }}>
                <span style={{ fontFamily: 'var(--f-display)', fontSize: 56, color: 'var(--maroon)', fontStyle: 'italic', fontWeight: 300, lineHeight: 1 }}>{v.n}</span>
                <div>
                  <h3 className="display-4" style={{ marginBottom: 14 }}>{v.title}</h3>
                  <p className="body-lg" style={{ maxWidth: 640 }}>{v.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Back to site */}
      <section style={{ padding: '72px 0', background: 'var(--paper)', borderTop: '1px solid var(--hairline)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="eyebrow eyebrow--maroon">In the meantime</div>
          <h2 className="display-4" style={{ marginTop: 14 }}>Try the product.</h2>
          <p className="body-lg" style={{ marginTop: 12 }}>The best way to understand what we're building is to use it.</p>
          <Link to="/shop" className="btn btn--maroon btn--lg" style={{ marginTop: 28, display: 'inline-flex' }}>
            Shop Glow Ubtan · ₹649
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
