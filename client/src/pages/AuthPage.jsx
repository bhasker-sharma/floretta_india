import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/floretta-logo.png';
import Icon from '../components/Icon';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';

// ── view states: 'login' | 'forgot' | 'forgot_otp' | 'reset'
export default function AuthPage() {
  const navigate  = useNavigate();
  const authStore = useAuthStore();
  const cartStore = useCartStore();

  const [view, setView]   = useState('login');
  const [form, setForm]   = useState({ email: '', password: '', otp: '', newPassword: '' });
  const [err,  setErr]    = useState('');
  const [info, setInfo]   = useState('');
  const [resetToken, setResetToken] = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr(''); setInfo('');
    const res = await authStore.login(form.email, form.password);
    if (res.ok) {
      await cartStore.merge();
      navigate('/');
    } else {
      setErr(res.message);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setErr(''); setInfo('');
    const res = await authStore.forgotPassword(form.email);
    if (res.ok) {
      setInfo('We sent a 6-digit code to ' + form.email);
      setView('forgot_otp');
    } else {
      setErr(res.message);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErr(''); setInfo('');
    const res = await authStore.verifyResetOtp(form.email, form.otp);
    if (res.ok) {
      setResetToken(res.reset_token);
      setView('reset');
    } else {
      setErr(res.message);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setErr(''); setInfo('');
    const res = await authStore.resetPassword(form.email, resetToken, form.newPassword);
    if (res.ok) {
      setInfo('Password updated. Please sign in.');
      setView('login');
    } else {
      setErr(res.message);
    }
  };

  return (
    <div className="fl" style={{ minHeight: '100vh' }}>
      <div className="fl-grid-auth" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>

        {/* Left brand panel */}
        <div className="fl-auth-brand ink-bg" style={{ padding: '56px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
          <div className="logo-row" style={{ position: 'relative', zIndex: 1 }}>
            <img src={logo} alt="" />
            <div>
              <div className="wordmark" style={{ color: '#F1E6D2' }}>FLORETTA</div>
              <div style={{ fontSize: 9, letterSpacing: '0.40em', textAlign: 'center', color: '#BFAE8F', marginTop: -2 }}>I N D I A</div>
            </div>
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="eyebrow" style={{ color: '#BFAE8F' }}>The Apothecary</div>
            <h1 className="display-1" style={{ color: '#F1E6D2', marginTop: 14, fontSize: 88, lineHeight: 1.02, fontWeight: 400 }}>
              Skin-care<br />as a <em style={{ fontStyle: 'italic', fontWeight: 300, color: '#D8967C' }}>quiet ritual</em>,<br />for everyone.
            </h1>
            <p className="body-lg" style={{ color: '#C7B8A2', maxWidth: 460, marginTop: 32 }}>
              Sign in to track your orders, save your favourites and receive monthly notes on the slow art of glow.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '48px 0 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {['Early access to new launches','Subscribe & save 10% on refills','Free shipping on every order over ₹999','Birthday gift — a hand-selected herbal sample'].map(t => (
                <li key={t} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <Icon name="check" size={18} color="#D8967C" />
                  <span style={{ fontFamily: 'var(--f-display)', fontSize: 22, color: '#F1E6D2', fontStyle: 'italic', fontWeight: 300 }}>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div className="mono" style={{ color: '#A88A4B' }}>
              EST. MMXXIII · JAIPUR, IN<br /><span style={{ color: '#7A6B55' }}>N° 0001 · GLOW UBTAN</span>
            </div>
            <div className="seal" style={{ background: 'transparent', borderColor: '#A88A4B', color: '#F1E6D2' }}>
              <span className="seal__n" style={{ color: '#F1E6D2' }}>07</span>
              <span className="seal__t" style={{ color: '#A88A4B' }}>Sacred Herbs</span>
            </div>
          </div>
          <div style={{ position: 'absolute', right: -120, top: 80, opacity: 0.04 }}>
            <svg width="500" height="500" viewBox="0 0 500 500">
              <circle cx="250" cy="250" r="180" fill="none" stroke="#F1E6D2" strokeWidth="1"/>
              <circle cx="250" cy="250" r="240" fill="none" stroke="#F1E6D2" strokeWidth="1"/>
            </svg>
          </div>
        </div>

        {/* Right: form panel */}
        <div style={{ background: 'var(--paper)', padding: '56px 96px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ maxWidth: 440, width: '100%', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 56 }}>
              <Link to="/" className="body-sm" style={{ color: 'var(--ink-soft)' }}>← Back to shop</Link>
            </div>

            <div style={{ display: 'flex', gap: 32, borderBottom: '1px solid var(--hairline)', marginBottom: 36 }}>
              <span className="caps" style={{ color: 'var(--ink)', paddingBottom: 14, borderBottom: '1px solid var(--ink)', marginBottom: -1 }}>Sign in</span>
              <Link to="/register" className="caps" style={{ color: 'var(--ink-mute)', paddingBottom: 14 }}>Create account</Link>
            </div>

            {/* ── LOGIN ── */}
            {view === 'login' && (
              <>
                <div className="eyebrow eyebrow--maroon">Welcome back</div>
                <h2 className="display-3" style={{ marginTop: 14 }}>Pick up where<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>you left off.</em></h2>

                {err  && <div style={{ marginTop: 20, padding: '12px 16px', background: '#fef2f2', borderRadius: 4, color: '#b91c1c', fontSize: 14 }}>{err}</div>}
                {info && <div style={{ marginTop: 20, padding: '12px 16px', background: '#f0fdf4', borderRadius: 4, color: '#15803d', fontSize: 14 }}>{info}</div>}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 32 }}>
                  <div className="field">
                    <label className="field__label">Email</label>
                    <input className="field__input" type="email" required placeholder="you@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
                  </div>
                  <div className="field">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <label className="field__label">Password</label>
                      <button type="button" onClick={() => { setErr(''); setView('forgot'); }} className="body-sm" style={{ color: 'var(--maroon)', fontSize: 11, letterSpacing: '0.10em', textTransform: 'uppercase', background: 'none', border: 'none', borderBottom: '1px solid var(--maroon)', cursor: 'pointer', padding: 0 }}>Forgot?</button>
                    </div>
                    <input className="field__input" type="password" required placeholder="••••••••••" value={form.password} onChange={e => set('password', e.target.value)} />
                  </div>
                  <button type="submit" disabled={authStore.loading} className="btn btn--maroon btn--block btn--lg" style={{ marginTop: 12 }}>
                    {authStore.loading ? 'Signing in…' : 'Sign in'}
                  </button>
                </form>
              </>
            )}

            {/* ── FORGOT ── */}
            {view === 'forgot' && (
              <>
                <h2 className="display-3" style={{ marginTop: 14 }}>Reset your<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>password.</em></h2>
                {err && <div style={{ marginTop: 20, padding: '12px 16px', background: '#fef2f2', borderRadius: 4, color: '#b91c1c', fontSize: 14 }}>{err}</div>}
                <form onSubmit={handleForgot} style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 32 }}>
                  <div className="field">
                    <label className="field__label">Email address</label>
                    <input className="field__input" type="email" required placeholder="you@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
                  </div>
                  <button type="submit" disabled={authStore.loading} className="btn btn--maroon btn--block btn--lg" style={{ marginTop: 12 }}>
                    {authStore.loading ? 'Sending…' : 'Send reset code'}
                  </button>
                  <button type="button" onClick={() => setView('login')} className="btn btn--ghost btn--block">← Back to sign in</button>
                </form>
              </>
            )}

            {/* ── FORGOT OTP ── */}
            {view === 'forgot_otp' && (
              <>
                <h2 className="display-3" style={{ marginTop: 14 }}>Enter the<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>code we sent.</em></h2>
                {info && <div style={{ marginTop: 20, padding: '12px 16px', background: '#f0fdf4', borderRadius: 4, color: '#15803d', fontSize: 14 }}>{info}</div>}
                {err  && <div style={{ marginTop: 20, padding: '12px 16px', background: '#fef2f2', borderRadius: 4, color: '#b91c1c', fontSize: 14 }}>{err}</div>}
                <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 32 }}>
                  <div className="field">
                    <label className="field__label">6-digit code</label>
                    <input className="field__input" required maxLength={6} placeholder="000000" value={form.otp} onChange={e => set('otp', e.target.value)} style={{ letterSpacing: '0.3em', fontSize: 24 }} />
                  </div>
                  <button type="submit" disabled={authStore.loading} className="btn btn--maroon btn--block btn--lg">
                    {authStore.loading ? 'Verifying…' : 'Verify code'}
                  </button>
                </form>
              </>
            )}

            {/* ── RESET ── */}
            {view === 'reset' && (
              <>
                <h2 className="display-3" style={{ marginTop: 14 }}>Choose a new<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>password.</em></h2>
                {err && <div style={{ marginTop: 20, padding: '12px 16px', background: '#fef2f2', borderRadius: 4, color: '#b91c1c', fontSize: 14 }}>{err}</div>}
                <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 32 }}>
                  <div className="field">
                    <label className="field__label">New password</label>
                    <input className="field__input" type="password" required minLength={8} placeholder="••••••••" value={form.newPassword} onChange={e => set('newPassword', e.target.value)} />
                    <span className="field__hint">At least 8 characters</span>
                  </div>
                  <button type="submit" disabled={authStore.loading} className="btn btn--maroon btn--block btn--lg">
                    {authStore.loading ? 'Updating…' : 'Update password'}
                  </button>
                </form>
              </>
            )}

            <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--hairline-soft)' }}>
              <p className="body-sm" style={{ textAlign: 'center' }}>
                New to Floretta? <Link to="/register" style={{ color: 'var(--ink)', borderBottom: '1px solid var(--ink)' }}>Create an account</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
