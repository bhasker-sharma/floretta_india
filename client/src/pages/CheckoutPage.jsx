import { Fragment } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Icon from '../components/Icon';

export default function CheckoutPage() {
  return (
    <div className="fl">
      <Header active="Bag" />

      <section style={{ padding: '56px 0 120px', background: 'var(--paper)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, marginBottom: 56 }}>
            {[['Bag', true, false], ['Details', true, false], ['Payment', true, true]].map(([s, done, active], i) => (
              <Fragment key={s}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="medallion" style={
                    active ? { borderColor: 'var(--maroon)', color: 'var(--maroon)', background: 'rgba(107,31,42,0.06)' }
                    : done ? { borderColor: 'var(--ink)', background: 'var(--ink)', color: 'var(--cream)' } : {}}>
                    {done && !active ? <Icon name="check" size={14} color="var(--cream)" /> : <span style={{ fontStyle: 'italic' }}>{i + 1}</span>}
                  </span>
                  <span className="caps" style={{ color: active ? 'var(--maroon)' : done ? 'var(--ink)' : 'var(--ink-mute)' }}>{s}</span>
                </div>
                {i < 2 && <span style={{ width: 32, height: 1, background: 'var(--hairline)' }}></span>}
              </Fragment>
            ))}
          </div>

          <div className="fl-grid-checkout" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 64 }}>
            <div>
              {/* Contact */}
              <div className="card" style={{ padding: 36, marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                  <div>
                    <div className="eyebrow eyebrow--maroon">01 · Contact</div>
                    <h3 className="display-4" style={{ marginTop: 8 }}>Where can we reach you?</h3>
                  </div>
                  <a className="body-sm" style={{ borderBottom: '1px solid var(--ink-soft)', color: 'var(--ink-soft)', alignSelf: 'center' }}>Already a member? Sign in</a>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="field" style={{ gridColumn: '1 / -1' }}>
                    <label className="field__label">Email address</label>
                    <input className="field__input" placeholder="you@email.com" />
                  </div>
                  <div className="field">
                    <label className="field__label">Mobile (for delivery updates)</label>
                    <input className="field__input" placeholder="+91 98200 00000" />
                  </div>
                  <div className="field" style={{ justifyContent: 'flex-end' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--ink-soft)' }}>
                      <span style={{ width: 16, height: 16, border: '1px solid var(--ink)', background: 'var(--ink)', borderRadius: 3, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="check" size={10} color="var(--cream)" />
                      </span>
                      <span className="body-sm">Send me WhatsApp updates</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Shipping */}
              <div className="card" style={{ padding: 36, marginBottom: 24 }}>
                <div style={{ marginBottom: 24 }}>
                  <div className="eyebrow eyebrow--maroon">02 · Shipping</div>
                  <h3 className="display-4" style={{ marginTop: 8 }}>Where should we send it?</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="field"><label className="field__label">Full name</label><input className="field__input" placeholder="Your name" /></div>
                  <div className="field"><label className="field__label">Phone</label><input className="field__input" placeholder="+91 98200 00000" /></div>
                  <div className="field" style={{ gridColumn: '1 / -1' }}><label className="field__label">Address line 1</label><input className="field__input" placeholder="House/flat, street" /></div>
                  <div className="field" style={{ gridColumn: '1 / -1' }}><label className="field__label">Address line 2 (optional)</label><input className="field__input" placeholder="Area, landmark" /></div>
                  <div className="field"><label className="field__label">City</label><input className="field__input" placeholder="City" /></div>
                  <div className="field"><label className="field__label">Pincode</label><input className="field__input" placeholder="302001" /></div>
                </div>
                <div style={{ height: 1, background: 'var(--hairline-soft)', margin: '24px 0' }}></div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 16, height: 16, border: '1px solid var(--ink-soft)', borderRadius: 3 }}></span>
                  <span className="body-sm" style={{ color: 'var(--ink)' }}>I have a GSTIN (B2B invoice)</span>
                </label>
              </div>

              {/* Delivery */}
              <div className="card" style={{ padding: 36, marginBottom: 24 }}>
                <div style={{ marginBottom: 24 }}>
                  <div className="eyebrow eyebrow--maroon">03 · Delivery</div>
                  <h3 className="display-4" style={{ marginTop: 8 }}>How soon?</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[['Standard delivery','Free · Tue, May 19 — Fri, May 22','FREE',true],['Express delivery','Mon, May 18 (via BlueDart)','₹149',false]].map(([t, d, p, sel], i) => (
                    <label key={i} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 16, padding: 18, border: sel ? '1px solid var(--ink)' : '1px solid var(--hairline)', background: sel ? 'var(--paper)' : 'transparent', borderRadius: 4, cursor: 'pointer', alignItems: 'center' }}>
                      <span style={{ width: 16, height: 16, borderRadius: 8, border: '1px solid var(--ink)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        {sel && <span style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--ink)' }}></span>}
                      </span>
                      <div>
                        <div className="caps" style={{ color: 'var(--ink)' }}>{t}</div>
                        <div className="body-sm" style={{ marginTop: 4 }}>{d}</div>
                      </div>
                      <span style={{ fontFamily: 'var(--f-display)', fontSize: 20 }}>{p}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div className="card" style={{ padding: 36 }}>
                <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div className="eyebrow eyebrow--maroon">04 · Payment</div>
                    <h3 className="display-4" style={{ marginTop: 8 }}>Pay securely.</h3>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--ink-soft)' }}>
                    <Icon name="lock" size={14} />
                    <span className="caps">Razorpay 256-bit</span>
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 28 }}>
                  {[['UPI', true], ['Cards', false], ['Net banking', false], ['COD', false]].map(([m, sel]) => (
                    <div key={m} style={{ padding: 16, border: sel ? '1px solid var(--maroon)' : '1px solid var(--hairline)', background: sel ? 'rgba(107,31,42,0.04)' : 'transparent', borderRadius: 4, cursor: 'pointer', textAlign: 'center' }}>
                      <div className="caps" style={{ color: sel ? 'var(--maroon)' : 'var(--ink-soft)' }}>{m}</div>
                    </div>
                  ))}
                </div>
                <div className="field" style={{ marginBottom: 14 }}>
                  <label className="field__label">UPI ID</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <input className="field__input" placeholder="yourname@bank" style={{ flex: 1 }} />
                    <a className="btn btn--ghost">Verify</a>
                  </div>
                  <span className="field__hint">A request will appear in your UPI app.</span>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
                  {['GPay','PhonePe','Paytm','BHIM','Amazon Pay'].map(a => (
                    <span key={a} style={{ padding: '8px 14px', border: '1px solid var(--hairline)', borderRadius: 4, fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--ink-soft)' }}>{a}</span>
                  ))}
                </div>
              </div>
            </div>

            <aside>
              <div className="card" style={{ padding: 32, position: 'sticky', top: 0 }}>
                <div className="eyebrow eyebrow--maroon">Order summary</div>
                <h3 className="display-4" style={{ marginTop: 12, marginBottom: 24 }}>2 items · ₹1,663</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                  {[{n:'Glow Ubtan · 100g',q:1,p:'₹649',ph:'',},{n:'Glow Ubtan · Duo 200g',q:1,p:'₹1,199',ph:' ph--sage'}].map((it, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '56px 1fr auto', gap: 14, alignItems: 'center' }}>
                      <div className={'ph' + it.ph} style={{ width: 56, height: 70, borderRadius: 4 }}><span style={{ fontSize: 9 }}></span></div>
                      <div>
                        <div className="caps" style={{ color: 'var(--ink)' }}>{it.n}</div>
                        <div className="body-sm" style={{ marginTop: 2 }}>Qty {it.q}</div>
                      </div>
                      <span style={{ fontFamily: 'var(--f-display)', fontSize: 16 }}>{it.p}</span>
                    </div>
                  ))}
                </div>

                <div className="hr--soft"></div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '20px 0' }}>
                  {[['Subtotal','₹1,848'],['Promo · FLORA10','−₹185'],['Shipping','Free'],['GST (incl.)','₹252']].map(([k, v], i) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span className="body-sm">{k}</span>
                      <span className="body-sm" style={{ color: i === 1 ? 'var(--sage-deep)' : 'var(--ink)', fontWeight: 500 }}>{v}</span>
                    </div>
                  ))}
                </div>

                <div className="hr"></div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '20px 0 0' }}>
                  <span className="display-5">Total</span>
                  <span style={{ fontFamily: 'var(--f-display)', fontSize: 36 }}>₹1,663</span>
                </div>

                <a className="btn btn--maroon btn--block btn--lg" style={{ marginTop: 24 }}>Pay ₹1,663 — Razorpay</a>

                <p className="body-sm" style={{ marginTop: 18, textAlign: 'center' }}>
                  By placing your order you agree to our <a style={{ borderBottom: '1px solid var(--ink-soft)' }}>Terms</a> and <a style={{ borderBottom: '1px solid var(--ink-soft)' }}>Refund Policy</a>.
                </p>

                <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--hairline-soft)', display: 'flex', gap: 14, alignItems: 'center' }}>
                  <Icon name="lock" size={14} color="var(--sage-deep)" />
                  <span className="body-sm">Your payment details are encrypted end-to-end. Floretta never stores card data.</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
