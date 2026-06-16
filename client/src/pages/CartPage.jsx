import { useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Icon from '../components/Icon';
import { useCartStore } from '../stores/cartStore';
import { imageUrl } from '../lib/api';

const fmt = (paise) => '₹' + (paise / 100).toLocaleString('en-IN');

export default function CartPage() {
  const cart = useCartStore();

  useEffect(() => { cart.fetch(); }, []);

  const items    = cart.items;
  const subtotal = cart.subtotal();
  const shipping = subtotal >= 99900 ? 0 : 7900;
  const total    = subtotal + shipping;

  if (cart.loading && items.length === 0) return (
    <div className="fl">
      <Header active="Bag" />
      <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="body-sm" style={{ color: 'var(--ink-mute)' }}>Loading your bag…</span>
      </div>
    </div>
  );

  if (items.length === 0) return (
    <div className="fl">
      <Header active="Bag" />
      <section style={{ padding: '120px 0', background: 'var(--paper)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="eyebrow eyebrow--maroon">Your bag</div>
          <h2 className="display-3" style={{ marginTop: 14 }}>
            <em style={{ fontStyle: 'italic', fontWeight: 300 }}>Nothing here yet.</em>
          </h2>
          <p className="body-lg" style={{ marginTop: 20, color: 'var(--ink-soft)' }}>Add the Glow Ubtan to start your ritual.</p>
          <Link to="/shop" className="btn btn--maroon btn--lg" style={{ marginTop: 36, display: 'inline-flex' }}>
            Shop now
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );

  return (
    <div className="fl">
      <Header active="Bag" />

      <section style={{ padding: '72px 0 120px', background: 'var(--paper)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56, paddingBottom: 28, borderBottom: '1px solid var(--hairline)' }}>
            <div>
              <div className="eyebrow eyebrow--maroon">Step 01 of 03</div>
              <h1 className="display-2" style={{ marginTop: 16 }}>
                Your Bag.<br />
                <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--ink-mute)', fontSize: 36 }}>{items.length} item{items.length !== 1 ? 's' : ''}, beautifully chosen.</em>
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              {['Bag', 'Details', 'Payment'].map((s, i) => (
                <Fragment key={s}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="medallion" style={i === 0 ? { borderColor: 'var(--ink)', background: 'var(--ink)', color: 'var(--cream)' } : {}}>
                      {i === 0 ? <Icon name="check" size={14} color="var(--cream)" /> : <span style={{ fontStyle: 'italic' }}>{i + 1}</span>}
                    </span>
                    <span className="caps" style={{ color: i === 0 ? 'var(--ink)' : 'var(--ink-mute)' }}>{s}</span>
                  </div>
                  {i < 2 && <span style={{ width: 32, height: 1, background: 'var(--hairline)' }}></span>}
                </Fragment>
              ))}
            </div>
          </div>

          <div className="fl-grid-cart" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 64 }}>
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px 20px', padding: '0 0 14px', borderBottom: '1px solid var(--hairline)' }}>
                {['Item','Price','Qty','Total',''].map((h, i) => (
                  <span key={i} className="caps" style={{ color: 'var(--ink-mute)', textAlign: i >= 1 && i <= 3 ? 'center' : 'left' }}>{h}</span>
                ))}
              </div>

              {items.map((it) => (
                <div key={it.id} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px 20px', padding: '28px 0', borderBottom: '1px solid var(--hairline)', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 20 }}>
                    {it.image
                      ? <img src={imageUrl(it.image)} alt={it.name} style={{ width: 96, height: 120, borderRadius: 4, objectFit: 'cover' }} />
                      : <div className="ph" style={{ width: 96, height: 120, borderRadius: 4 }}><span style={{ fontSize: 9 }}>jar</span></div>
                    }
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div className="display-5" style={{ fontSize: 22 }}>{it.name}</div>
                      <div style={{ display: 'flex', gap: 14, marginTop: 10, alignItems: 'center' }}>
                        <span className="chip">{it.variant}</span>
                      </div>
                    </div>
                  </div>
                  <span style={{ fontFamily: 'var(--f-display)', fontSize: 22, textAlign: 'center' }}>{fmt(it.price)}</span>
                  <div style={{ justifySelf: 'center', display: 'flex', alignItems: 'center', border: '1px solid var(--hairline)', borderRadius: 4 }}>
                    <button style={{ padding: '8px 10px', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => cart.updateQty(it.id, it.qty - 1)}><Icon name="minus" size={12} /></button>
                    <span style={{ fontFamily: 'var(--f-display)', fontSize: 16, padding: '0 10px' }}>{it.qty}</span>
                    <button style={{ padding: '8px 10px', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => cart.updateQty(it.id, it.qty + 1)}><Icon name="plus" size={12} /></button>
                  </div>
                  <span style={{ fontFamily: 'var(--f-display)', fontSize: 26, textAlign: 'right' }}>{fmt(it.price * it.qty)}</span>
                  <button style={{ color: 'var(--ink-mute)', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => cart.remove(it.id)}><Icon name="x" size={16} /></button>
                </div>
              ))}

              {subtotal < 99900 && (
                <div style={{ marginTop: 32, padding: 24, background: 'var(--cream)', border: '1px dashed var(--hairline)', borderRadius: 4, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 18, alignItems: 'center' }}>
                  <Icon name="leaf" color="var(--sage-deep)" size={22} />
                  <div>
                    <div className="display-5" style={{ fontSize: 20 }}>
                      Add {fmt(99900 - subtotal)} more for free shipping.
                    </div>
                    <div style={{ height: 4, background: 'var(--hairline)', borderRadius: 2, marginTop: 12, overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(100, (subtotal / 99900) * 100)}%`, height: '100%', background: 'var(--maroon)' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <aside>
              <div className="card" style={{ padding: 32, position: 'sticky', top: 24 }}>
                <div className="eyebrow eyebrow--maroon">Order summary</div>
                <h3 className="display-4" style={{ marginTop: 12, marginBottom: 28 }}>{items.length} item{items.length !== 1 ? 's' : ''}</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    ['Subtotal',  fmt(subtotal)],
                    ['Shipping',  shipping === 0 ? 'Free' : fmt(shipping)],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span className="body" style={{ color: 'var(--ink-soft)' }}>{k}</span>
                      <span className="body" style={{ color: 'var(--ink)', fontWeight: 500 }}>{v}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 22, paddingTop: 22, borderTop: '1px solid var(--hairline)' }}>
                  <span className="display-5">Total</span>
                  <span style={{ fontFamily: 'var(--f-display)', fontSize: 36, fontWeight: 400 }}>{fmt(total)}</span>
                </div>
                <div className="body-sm" style={{ marginTop: 6, textAlign: 'right' }}>Inclusive of all taxes</div>

                <Link to="/checkout" className="btn btn--maroon btn--block btn--lg" style={{ marginTop: 28 }}>
                  Proceed to Checkout
                  <Icon name="arrow" size={14} color="#FBF7EE" />
                </Link>
                <Link to="/shop" className="btn btn--link" style={{ display: 'block', textAlign: 'center', marginTop: 16 }}>← Continue shopping</Link>

                <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--hairline-soft)', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[['lock','Secure checkout · Razorpay encrypted'],['truck','Free shipping on orders over ₹999'],['leaf','7-day no-questions returns']].map(([ico, t]) => (
                    <div key={t} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <Icon name={ico} size={16} color="var(--ink-soft)" />
                      <span className="body-sm">{t}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 24, flexWrap: 'wrap' }}>
                  {['VISA','Master','UPI','RuPay','Amex'].map(p => (
                    <span key={p} style={{ padding: '5px 10px', border: '1px solid var(--hairline)', borderRadius: 2, fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.08em', color: 'var(--ink-soft)' }}>{p}</span>
                  ))}
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
