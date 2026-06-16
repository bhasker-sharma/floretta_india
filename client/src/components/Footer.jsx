import { Link } from 'react-router-dom';
import logo from '../assets/floretta-logo.png';

export default function Footer() {
  return (
    <footer className="ink-bg">
      <div className="container" style={{ padding: '96px 64px 32px' }}>

        {/* Newsletter band */}
        <div className="fl-grid-two" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 80, paddingBottom: 64, borderBottom: '1px solid rgba(239,231,214,0.14)' }}>
          <div>
            <div className="eyebrow" style={{ color: '#BFAE8F' }}>The Apothecary Letter</div>
            <h2 className="display-3" style={{ color: '#F1E6D2', marginTop: 14, fontWeight: 400 }}>
              Rituals, recipes <em style={{ color: '#D8967C', fontStyle: 'italic', fontWeight: 300 }}>&amp;</em><br />
              the slow art of glow.
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 20 }}>
            <p className="body" style={{ color: '#C7B8A2' }}>A monthly letter on Ayurvedic skincare, ingredient stories and quiet rituals — no noise, ever.</p>
            <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #C7B8A2', paddingBottom: 10 }}>
              <input placeholder="your@email" style={{ flex: 1, background: 'transparent', border: 0, color: '#F1E6D2', fontSize: 16, outline: 'none', padding: '8px 0' }} />
              <span className="caps" style={{ color: '#F1E6D2', alignSelf: 'center', cursor: 'pointer' }}>Subscribe →</span>
            </div>
          </div>
        </div>

        {/* Link columns */}
        <div className="fl-grid-footer-cols" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1fr', gap: 56, padding: '64px 0' }}>
          <div>
            <div className="logo-row" style={{ marginBottom: 24 }}>
              <img src={logo} alt="" style={{ filter: 'brightness(1.05)' }} />
              <div className="wordmark" style={{ color: '#F1E6D2' }}>FLORETTA</div>
            </div>
            <p className="body-sm" style={{ color: '#A8957A', maxWidth: 320 }}>Premium herbal skincare crafted with Ayurvedic discipline — clean, gentle, made in small batches in India.</p>
            <div style={{ display: 'flex', gap: 14, marginTop: 28 }}>
              {['IG', 'FB', 'YT', 'Pin'].map(s => (
                <a key={s} style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(239,231,214,0.20)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, letterSpacing: '0.05em', color: '#C7B8A2', cursor: 'pointer' }}>{s}</a>
              ))}
            </div>
          </div>

          {/* Shop column */}
          <div>
            <div className="eyebrow" style={{ color: '#BFAE8F', marginBottom: 18 }}>Shop</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li><Link to="/shop" className="body-sm" style={{ color: '#E5DDCC' }}>Glow Ubtan</Link></li>
              <li><Link to="/coming-soon" className="body-sm" style={{ color: '#E5DDCC' }}>Coming soon</Link></li>
              <li><Link to="/account/giftcards" className="body-sm" style={{ color: '#E5DDCC' }}>Gift cards</Link></li>
              <li><Link to="/account/track" className="body-sm" style={{ color: '#E5DDCC' }}>Track order</Link></li>
            </ul>
          </div>

          {/* Discover column */}
          <div>
            <div className="eyebrow" style={{ color: '#BFAE8F', marginBottom: 18 }}>Discover</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li><a href="/#ingredients" className="body-sm" style={{ color: '#E5DDCC' }}>The Seven Herbs</a></li>
              <li><Link to="/shop#how-to-use" className="body-sm" style={{ color: '#E5DDCC' }}>Skin guide</Link></li>
              <li><Link to="/shop#reviews" className="body-sm" style={{ color: '#E5DDCC' }}>Reviews</Link></li>
            </ul>
          </div>

          {/* Support column */}
          <div>
            <div className="eyebrow" style={{ color: '#BFAE8F', marginBottom: 18 }}>Support</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li><Link to="/contact" className="body-sm" style={{ color: '#E5DDCC' }}>Contact us</Link></li>
              <li><Link to="/shipping" className="body-sm" style={{ color: '#E5DDCC' }}>Shipping</Link></li>
              <li><Link to="/returns" className="body-sm" style={{ color: '#E5DDCC' }}>Returns</Link></li>
              <li><Link to="/faq" className="body-sm" style={{ color: '#E5DDCC' }}>FAQ</Link></li>
            </ul>
          </div>

          {/* Company column */}
          <div>
            <div className="eyebrow" style={{ color: '#BFAE8F', marginBottom: 18 }}>Company</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li><Link to="/sustainability" className="body-sm" style={{ color: '#E5DDCC' }}>Sustainability</Link></li>
              <li><Link to="/careers" className="body-sm" style={{ color: '#E5DDCC' }}>Careers</Link></li>
            </ul>
          </div>
        </div>

        {/* Trust strip */}
        <div className="fl-grid-four" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24, padding: '32px 0', borderTop: '1px solid rgba(239,231,214,0.14)', borderBottom: '1px solid rgba(239,231,214,0.14)' }}>
          {[['Cruelty Free','no animal testing, ever'],['100% Herbal','no parabens or sulphates'],['Made in India','small-batch, Jaipur'],['Secure Checkout','Razorpay · UPI · cards']].map(([t, s]) => (
            <div key={t}>
              <div className="caps" style={{ color: '#F1E6D2' }}>{t}</div>
              <div className="body-sm" style={{ color: '#A8957A', marginTop: 4 }}>{s}</div>
            </div>
          ))}
        </div>

        {/* Legal row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 28, gap: 24, flexWrap: 'wrap' }}>
          <div className="mono" style={{ color: '#A8957A' }}>© 2026 Floretta India Pvt. Ltd.</div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
            <Link to="/privacy" className="body-sm" style={{ color: '#C7B8A2' }}>Privacy</Link>
            <Link to="/shipping" className="body-sm" style={{ color: '#C7B8A2' }}>Shipping</Link>
            <Link to="/returns" className="body-sm" style={{ color: '#C7B8A2' }}>Returns</Link>
            <Link to="/faq" className="body-sm" style={{ color: '#C7B8A2' }}>FAQ</Link>
            <span style={{ width: 1, height: 12, background: 'rgba(239,231,214,0.20)' }}></span>
            <Link to="/admin" className="mono" title="Admin portal" style={{ color: '#7A6B55', fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 6, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              <span style={{ width: 4, height: 4, borderRadius: 4, background: '#A88A4B' }}></span>
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
