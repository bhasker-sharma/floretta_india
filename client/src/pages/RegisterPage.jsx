import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/floretta-logo.png';
import Icon from '../components/Icon';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';

// view: 'form' | 'otp'
export default function RegisterPage() {
  const navigate  = useNavigate();
  const authStore = useAuthStore();
  const cartStore = useCartStore();

  const [view, setView] = useState('form');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });
  const [otp,  setOtp]  = useState('');
  const [err,  setErr]  = useState('');
  const [info, setInfo] = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleRegister = async (e) => {
    e.preventDefault();
    setErr(''); setInfo('');
    const res = await authStore.register({
      name:     form.firstName.trim() + ' ' + form.lastName.trim(),
      email:    form.email,
      phone:    form.phone,
      password: form.password,
    });
    if (res.ok) {
      setInfo('We sent a verification code to ' + form.email);
      setView('otp');
    } else {
      setErr(res.message);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setErr('');
    const res = await authStore.verifyEmail(form.email, otp);
    if (res.ok) {
      await cartStore.merge();
      navigate('/');
    } else {
      setErr(res.message);
    }
  };

  const handleResend = async () => {
    const res = await authStore.resendOtp(form.email);
    setInfo(res.ok ? 'New code sent.' : res.message);
  };

  return (
    <div className="fl" style={{ minHeight: '100vh' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>

        {/* Left */}
        <div style={{ background: 'var(--cream)', padding: '56px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Link to="/" className="logo-row">
            <img src={logo} alt="" />
            <div>
              <div className="wordmark">FLORETTA</div>
              <div style={{ fontSize: 9, letterSpacing: '0.40em', textAlign: 'center', color: 'var(--ink-soft)', marginTop: -2 }}>I N D I A</div>
            </div>
          </Link>
          <div>
            <div className="eyebrow eyebrow--maroon">Become a member</div>
            <h1 className="display-2" style={{ marginTop: 14, fontWeight: 400, fontSize: 64 }}>
              Join the<br /><em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--maroon)' }}>Apothecary.</em>
            </h1>
            <p className="body-lg" style={{ maxWidth: 420, marginTop: 24 }}>Free to join. Track every order, save addresses, and earn ten percent on refills.</p>
          </div>
          <div className="mono" style={{ color: 'var(--ink-mute)' }}>
            "It is the small herbs, taken slowly, that make the deepest change."
          </div>
        </div>

        {/* Right */}
        <div style={{ background: 'var(--paper)', padding: '56px 96px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ maxWidth: 440, width: '100%', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 56 }}>
              <Link to="/" className="body-sm" style={{ color: 'var(--ink-soft)' }}>← Back to shop</Link>
            </div>

            <div style={{ display: 'flex', gap: 32, borderBottom: '1px solid var(--hairline)', marginBottom: 36 }}>
              <Link to="/login" className="caps" style={{ color: 'var(--ink-mute)', paddingBottom: 14 }}>Sign in</Link>
              <span className="caps" style={{ color: 'var(--ink)', paddingBottom: 14, borderBottom: '1px solid var(--ink)', marginBottom: -1 }}>Create account</span>
            </div>

            {/* ── REGISTER FORM ── */}
            {view === 'form' && (
              <>
                <h2 className="display-3" style={{ fontWeight: 400 }}>
                  <em style={{ fontStyle: 'italic', fontWeight: 300 }}>Welcome to</em><br />the Apothecary.
                </h2>

                {err && <div style={{ marginTop: 20, padding: '12px 16px', background: '#fef2f2', borderRadius: 4, color: '#b91c1c', fontSize: 14 }}>{err}</div>}

                <form onSubmit={handleRegister} style={{ marginTop: 28 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="field">
                      <label className="field__label">First name</label>
                      <input className="field__input" required placeholder="First" value={form.firstName} onChange={e => set('firstName', e.target.value)} />
                    </div>
                    <div className="field">
                      <label className="field__label">Last name</label>
                      <input className="field__input" required placeholder="Last" value={form.lastName} onChange={e => set('lastName', e.target.value)} />
                    </div>
                    <div className="field" style={{ gridColumn: '1 / -1' }}>
                      <label className="field__label">Email</label>
                      <input className="field__input" type="email" required placeholder="you@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
                    </div>
                    <div className="field" style={{ gridColumn: '1 / -1' }}>
                      <label className="field__label">Mobile</label>
                      <input className="field__input" required placeholder="98200 00000" value={form.phone} onChange={e => set('phone', e.target.value)} />
                    </div>
                    <div className="field" style={{ gridColumn: '1 / -1' }}>
                      <label className="field__label">Create password</label>
                      <input className="field__input" type="password" required minLength={8} placeholder="••••••••••" value={form.password} onChange={e => set('password', e.target.value)} />
                      <span className="field__hint">At least 8 characters</span>
                    </div>
                  </div>
                  <button type="submit" disabled={authStore.loading} className="btn btn--maroon btn--block btn--lg" style={{ marginTop: 24 }}>
                    {authStore.loading ? 'Creating account…' : 'Create my account'}
                  </button>
                </form>
              </>
            )}

            {/* ── OTP VERIFY ── */}
            {view === 'otp' && (
              <>
                <h2 className="display-3" style={{ fontWeight: 400 }}>
                  Verify your<br /><em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--maroon)' }}>email.</em>
                </h2>
                <p className="body" style={{ marginTop: 16, color: 'var(--ink-soft)' }}>Enter the 6-digit code we sent to <strong>{form.email}</strong>.</p>

                {info && <div style={{ marginTop: 16, padding: '12px 16px', background: '#f0fdf4', borderRadius: 4, color: '#15803d', fontSize: 14 }}>{info}</div>}
                {err  && <div style={{ marginTop: 16, padding: '12px 16px', background: '#fef2f2', borderRadius: 4, color: '#b91c1c', fontSize: 14 }}>{err}</div>}

                <form onSubmit={handleVerify} style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div className="field">
                    <label className="field__label">Verification code</label>
                    <input className="field__input" required maxLength={6} placeholder="000000" value={otp} onChange={e => setOtp(e.target.value)} style={{ letterSpacing: '0.3em', fontSize: 28, textAlign: 'center' }} />
                  </div>
                  <button type="submit" disabled={authStore.loading} className="btn btn--maroon btn--block btn--lg">
                    {authStore.loading ? 'Verifying…' : 'Verify & continue'}
                  </button>
                  <button type="button" onClick={handleResend} className="btn btn--ghost btn--block">Resend code</button>
                </form>
              </>
            )}

            <p className="body-sm" style={{ textAlign: 'center', marginTop: 28, color: 'var(--ink-mute)' }}>
              By signing up you agree to our <a style={{ borderBottom: '1px solid var(--ink-mute)' }}>Terms</a> and <a style={{ borderBottom: '1px solid var(--ink-mute)' }}>Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
