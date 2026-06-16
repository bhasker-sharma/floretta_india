import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Icon from '../components/Icon';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fl">
      <Header />

      <section style={{ background: 'var(--paper)', padding: '72px 0 120px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <div className="eyebrow eyebrow--maroon">We'd love to hear from you</div>
            <h1 className="display-3" style={{ marginTop: 14 }}>
              Get in touch.<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>We reply within 24 hours.</em>
            </h1>
          </div>

          <div className="fl-grid-contact" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 80, alignItems: 'flex-start' }}>

            {/* Form */}
            <div className="card" style={{ padding: 48 }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <Icon name="check" size={48} color="var(--sage-deep)" />
                  <h2 className="display-4" style={{ marginTop: 20 }}>Message received.</h2>
                  <p className="body-lg" style={{ marginTop: 12, maxWidth: 400, margin: '12px auto 0' }}>
                    Thank you for reaching out. We'll reply to your email within 24 hours.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn btn--outline" style={{ marginTop: 32 }}>Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div className="eyebrow eyebrow--maroon" style={{ marginBottom: 8 }}>Send us a message</div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="field">
                      <label className="field__label">First name</label>
                      <input className="field__input" placeholder="Your name" required />
                    </div>
                    <div className="field">
                      <label className="field__label">Last name</label>
                      <input className="field__input" placeholder="Last name" />
                    </div>
                  </div>

                  <div className="field">
                    <label className="field__label">Email address</label>
                    <input className="field__input" type="email" placeholder="you@email.com" required />
                  </div>

                  <div className="field">
                    <label className="field__label">Phone (optional)</label>
                    <input className="field__input" placeholder="+91 98200 00000" />
                  </div>

                  <div className="field">
                    <label className="field__label">Subject</label>
                    <select className="field__input" style={{ cursor: 'pointer' }}>
                      <option>Order enquiry</option>
                      <option>Product question</option>
                      <option>Return or exchange</option>
                      <option>Wholesale / B2B</option>
                      <option>Press / collaboration</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="field">
                    <label className="field__label">Message</label>
                    <textarea className="field__input" rows={5} placeholder="How can we help you?" required style={{ resize: 'vertical' }} />
                  </div>

                  <button type="submit" className="btn btn--maroon btn--block btn--lg" style={{ marginTop: 8 }}>
                    Send message
                    <Icon name="arrow" size={14} color="#FBF7EE" />
                  </button>
                </form>
              )}
            </div>

            {/* Company info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              <div>
                <div className="eyebrow eyebrow--sage">Contact details</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 24 }}>
                  {[
                    { icon: 'card', label: 'Email', val: 'hello@floretta.in', href: 'mailto:hello@floretta.in' },
                    { icon: 'truck', label: 'Phone', val: '+91 141 000 0000', href: 'tel:+911410000000' },
                  ].map(({ icon, label, val, href }) => (
                    <div key={label} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                      <div style={{ width: 40, height: 40, background: 'var(--cream)', border: '1px solid var(--hairline)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon name={icon} size={16} color="var(--maroon)" />
                      </div>
                      <div>
                        <div className="eyebrow" style={{ color: 'var(--ink-mute)' }}>{label}</div>
                        <a href={href} className="body" style={{ color: 'var(--ink)', marginTop: 4, display: 'block' }}>{val}</a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ padding: 28 }}>
                <div className="eyebrow eyebrow--maroon" style={{ marginBottom: 14 }}>Studio &amp; Works</div>
                <p className="body" style={{ color: 'var(--ink)', lineHeight: 1.7 }}>
                  Floretta India Pvt. Ltd.<br />
                  Sanganer Industrial Area,<br />
                  Jaipur, Rajasthan 302029<br />
                  India
                </p>
                <div style={{ marginTop: 18, paddingTop: 18, borderTop: '1px solid var(--hairline-soft)' }}>
                  <div className="eyebrow" style={{ color: 'var(--ink-mute)', marginBottom: 8 }}>Business hours</div>
                  <p className="body-sm">Monday – Friday: 10 AM – 6 PM IST</p>
                  <p className="body-sm" style={{ marginTop: 4 }}>Saturday: 10 AM – 2 PM IST</p>
                  <p className="body-sm" style={{ marginTop: 4 }}>Sunday: Closed</p>
                </div>
              </div>

              <div className="card" style={{ padding: 28 }}>
                <div className="eyebrow eyebrow--maroon" style={{ marginBottom: 12 }}>For orders &amp; shipping</div>
                <p className="body-sm">
                  For fastest support on orders, returns and shipping enquiries — email us at <strong>orders@floretta.in</strong> with your order number.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
