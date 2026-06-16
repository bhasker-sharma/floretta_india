import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/floretta-logo.png';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';

export default function Header({ active = 'Shop' }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate   = useNavigate();
  const cartCount  = useCartStore(s => s.count());
  const user       = useAuthStore(s => s.user);

  const scrollToIngredients = (e) => {
    e.preventDefault();
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById('ingredients')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById('ingredients')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header style={{ borderBottom: '1px solid var(--hairline)', position: 'relative', zIndex: 100, background: 'var(--paper)' }}>
      {/* Announce bar */}
      <div style={{ background: 'var(--ink)', color: '#C7B8A2', padding: '10px 0', textAlign: 'center', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 500 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}>
          <i className="diamond" style={{ background: '#A88A4B' }}></i>
          Complimentary shipping on orders above ₹999
          <i className="diamond" style={{ background: '#A88A4B' }}></i>
        </span>
      </div>

      {/* Main header row */}
      <div className="container fl-header" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '20px 64px' }}>

        {/* Left nav */}
        <nav className="fl-header-nav" style={{ display: 'flex', gap: 36 }}>
          <Link to="/" className="caps" style={{ color: active === 'Home' ? 'var(--ink)' : 'var(--ink-soft)', borderBottom: active === 'Home' ? '1px solid var(--ink)' : '1px solid transparent', paddingBottom: 4 }}>Home</Link>
          <Link to="/shop" className="caps" style={{ color: active === 'Shop' ? 'var(--ink)' : 'var(--ink-soft)', borderBottom: active === 'Shop' ? '1px solid var(--ink)' : '1px solid transparent', paddingBottom: 4 }}>Shop</Link>
          <a href="#ingredients" onClick={scrollToIngredients} className="caps" style={{ color: 'var(--ink-soft)', borderBottom: '1px solid transparent', paddingBottom: 4, cursor: 'pointer' }}>Ingredients</a>
        </nav>

        {/* Logo */}
        <Link to="/" className="logo-row">
          <img src={logo} alt="Floretta India" />
          <div>
            <div className="wordmark">FLORETTA</div>
            <div style={{ fontSize: 9, letterSpacing: '0.40em', textAlign: 'center', color: 'var(--ink-soft)', marginTop: -2 }}>I N D I A</div>
          </div>
        </Link>

        {/* Right: account + bag + hamburger */}
        <div className="fl-header-right" style={{ display: 'flex', gap: 24, justifyContent: 'flex-end', alignItems: 'center' }}>
          <Link to={user ? '/account' : '/login'} className="caps fl-mobile-hide" style={{ color: 'var(--ink-soft)' }}>
            {user ? user.name.split(' ')[0] : 'Account'}
          </Link>
          <Link to="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--ink)' }}>
            <span className="caps">Bag</span>
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10, background: 'var(--maroon)', color: '#FBF7EE', width: 18, height: 18, borderRadius: 9, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              {cartCount > 9 ? '9+' : cartCount}
            </span>
          </Link>
          {/* Hamburger */}
          <button className="fl-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu" style={{ display: 'none', flexDirection: 'column', gap: 5, padding: 4 }}>
            <span style={{ width: 22, height: 1.5, background: 'var(--ink)', display: 'block', transition: 'transform .2s', transform: menuOpen ? 'rotate(45deg) translateY(4px)' : 'none' }}></span>
            <span style={{ width: 22, height: 1.5, background: 'var(--ink)', display: 'block', opacity: menuOpen ? 0 : 1 }}></span>
            <span style={{ width: 22, height: 1.5, background: 'var(--ink)', display: 'block', transition: 'transform .2s', transform: menuOpen ? 'rotate(-45deg) translateY(-4px)' : 'none' }}></span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div style={{ background: 'var(--paper)', borderTop: '1px solid var(--hairline)', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Link to="/" className="caps" style={{ color: 'var(--ink)' }} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/shop" className="caps" style={{ color: 'var(--ink)' }} onClick={() => setMenuOpen(false)}>Shop</Link>
          <a href="#ingredients" onClick={(e) => { scrollToIngredients(e); setMenuOpen(false); }} className="caps" style={{ color: 'var(--ink-soft)', cursor: 'pointer' }}>Ingredients</a>
          <Link to="/account" className="caps" style={{ color: 'var(--ink-soft)' }} onClick={() => setMenuOpen(false)}>Account</Link>
          <Link to="/contact" className="caps" style={{ color: 'var(--ink-soft)' }} onClick={() => setMenuOpen(false)}>Contact</Link>
          <Link to="/careers" className="caps" style={{ color: 'var(--ink-soft)' }} onClick={() => setMenuOpen(false)}>Careers</Link>
        </div>
      )}
    </header>
  );
}
