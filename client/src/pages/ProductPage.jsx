import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Stars from '../components/Stars';
import Icon from '../components/Icon';
import api, { imageUrl } from '../lib/api';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';

const fmt = (paise) => '₹' + (paise / 100).toLocaleString('en-IN');
const save = (compare, price) => compare > price ? '₹' + ((compare - price) / 100).toLocaleString('en-IN') : null;

export default function ProductPage() {
  const { slug }    = useParams();
  const productSlug = slug || 'glow-ubtan';
  const navigate    = useNavigate();
  const cart        = useCartStore();
  const auth        = useAuthStore();

  const [product,  setProduct]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [selIdx,   setSelIdx]   = useState(0);
  const [qty,      setQty]      = useState(1);
  const [openFaq,  setOpenFaq]  = useState(0);
  const [pincode,  setPincode]  = useState('');
  const [delivery, setDelivery] = useState(null);
  const [addMsg,   setAddMsg]   = useState('');
  const [adding,   setAdding]   = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${productSlug}`)
      .then(r => { setProduct(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [productSlug]);

  // Fetch cart once on mount so count is correct
  useEffect(() => { cart.fetch(); }, []);

  const checkPincode = async () => {
    if (!pincode || pincode.length < 6) return;
    try {
      const { data } = await api.get('/pincode/check', { params: { pincode } });
      setDelivery(data);
    } catch {
      setDelivery({ serviceable: false });
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    const variant = product.variants[selIdx];
    if (!variant) return;

    setAdding(true); setAddMsg('');
    const res = await cart.add(variant.id, qty);
    setAdding(false);
    if (res?.ok === false) {
      setAddMsg(res.message);
    } else {
      setAddMsg('Added to bag!');
      setTimeout(() => setAddMsg(''), 2500);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/checkout');
  };

  if (loading) return (
    <div className="fl">
      <Header active="Shop" />
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="body-sm" style={{ color: 'var(--ink-mute)' }}>Loading…</span>
      </div>
    </div>
  );

  if (!product) return (
    <div className="fl">
      <Header active="Shop" />
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <p className="body-lg">Product not found.</p>
        <Link to="/" className="btn btn--outline">Go home</Link>
      </div>
    </div>
  );

  const variant  = product.variants[selIdx] || product.variants[0];
  const price    = variant?.price ?? 0;
  const compare  = variant?.compare_price ?? 0;
  const inStock  = (variant?.stock_qty ?? 0) > 0;
  const savings  = save(compare, price);

  return (
    <div className="fl">
      <Header active="Shop" />

      <div style={{ borderBottom: '1px solid var(--hairline)', background: 'var(--cream)' }}>
        <div className="container" style={{ padding: '14px 64px' }}>
          <span className="caps" style={{ color: 'var(--ink-soft)' }}>
            <Link to="/">Home</Link> · <Link to="/shop">Shop</Link> · <span style={{ color: 'var(--ink)' }}>{product.name}</span>
          </span>
        </div>
      </div>

      {/* Gallery + Buy box */}
      <section style={{ background: 'var(--paper)', padding: '56px 0 240px' }}>
        <div className="container fl-grid-product" style={{ display: 'grid', gridTemplateColumns: '84px 1fr 1fr', gap: 32 }}>
          {/* Thumbnails */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {product.images?.length > 0
              ? product.images.map((img, i) => (
                  <div key={i} style={{ aspectRatio: '1/1', borderRadius: 4, overflow: 'hidden', border: i === 0 ? '1px solid var(--ink)' : '1px solid transparent' }}>
                    <img src={imageUrl(img.url)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))
              : [0,1,2,3,4].map(i => (
                  <div key={i} className={'ph' + (i === 1 ? ' ph--sage' : i === 3 ? ' ph--clay' : '')}
                    style={{ aspectRatio: '1/1', borderRadius: 4, border: i === 0 ? '1px solid var(--ink)' : '1px solid transparent' }}>
                    <span style={{ fontSize: 9 }}>0{i + 1}</span>
                  </div>
                ))
            }
          </div>

          {/* Main image */}
          <div style={{ position: 'relative', aspectRatio: '4/5' }}>
            {product.images?.length > 0
              ? <img src={imageUrl(product.images[0]?.url)} alt={product.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }} />
              : <div className="ph" style={{ position: 'absolute', inset: 0, borderRadius: 4 }}>
                  <span>{product.name} · main shot</span>
                  <div className="ph__tag">replace with product photography</div>
                </div>
            }
            <div className="seal" style={{ position: 'absolute', bottom: 24, left: 24, width: 96, height: 96 }}>
              <span className="seal__n" style={{ fontSize: 28 }}>07</span>
              <span className="seal__t" style={{ fontSize: 8 }}>Herbs</span>
            </div>
            <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 8 }}>
              <span className="chip chip--sage">100% Herbal</span>
              {product.is_featured && <span className="chip chip--maroon">Bestseller</span>}
            </div>
          </div>

          {/* Buy box */}
          <div style={{ position: 'sticky', top: 24, alignSelf: 'start', padding: '8px 0 0 24px' }}>
            <div className="eyebrow eyebrow--maroon">N° 01 · Face &amp; Body Polish</div>
            <h1 className="display-3" style={{ marginTop: 14, fontWeight: 400 }}>
              {product.name}
              {product.tagline && <div style={{ fontStyle: 'italic', fontSize: 26, color: 'var(--ink-soft)', fontWeight: 300, marginTop: 6 }}>{product.tagline}</div>}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 20 }}>
              <Stars value={product.average_rating || 5} />
              <span className="body-sm">
                {product.average_rating > 0 ? product.average_rating.toFixed(1) : '5.0'} ·{' '}
                <a style={{ borderBottom: '1px solid var(--ink-soft)' }}>{product.review_count > 0 ? product.review_count : '—'} reviews</a>
              </span>
              <span className="vr" style={{ height: 14 }}></span>
              <span className="caps" style={{ color: inStock ? 'var(--sage-deep)' : 'var(--maroon)' }}>
                ● {inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {product.description && (
              <p className="body-lg" style={{ marginTop: 28 }}>{product.description.split('\n')[0]}</p>
            )}

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 36, paddingTop: 28, borderTop: '1px solid var(--hairline)' }}>
              <span style={{ fontFamily: 'var(--f-display)', fontSize: 44, fontWeight: 400 }}>{fmt(price)}</span>
              {compare > price && <span className="body-sm" style={{ textDecoration: 'line-through', color: 'var(--ink-mute)' }}>{fmt(compare)}</span>}
              {savings && <span className="chip chip--sage">Save {savings}</span>}
              <span className="body-sm" style={{ marginLeft: 'auto' }}>Incl. all taxes</span>
            </div>

            {/* Size selector */}
            {product.variants?.length > 1 && (
              <div style={{ marginTop: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span className="caps">Size</span>
                  <span className="body-sm">{variant?.label}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${product.variants.length}, 1fr)`, gap: 10 }}>
                  {product.variants.map((v, i) => (
                    <div key={v.id} onClick={() => setSelIdx(i)} style={{ padding: '16px 14px', border: selIdx === i ? '1px solid var(--ink)' : '1px solid var(--hairline)', background: selIdx === i ? 'var(--cream)' : 'transparent', borderRadius: 4, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span className="caps">{v.label}</span>
                      <span className="body-sm">{fmt(v.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Qty + Add */}
            <div style={{ display: 'flex', gap: 14, marginTop: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--ink)', borderRadius: 4, padding: '0 14px' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '12px 4px' }}><Icon name="minus" size={14} /></button>
                <span style={{ padding: '0 18px', fontFamily: 'var(--f-display)', fontSize: 18 }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '12px 4px' }}><Icon name="plus" size={14} /></button>
              </div>
              <button onClick={handleAddToCart} disabled={adding || !inStock} className="btn btn--maroon btn--block btn--lg" style={{ flex: 1 }}>
                {adding ? 'Adding…' : `Add to Bag · ${fmt(price)}`}
              </button>
            </div>

            {addMsg && (
              <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 4, background: addMsg.includes('!') ? '#f0fdf4' : '#fef2f2', color: addMsg.includes('!') ? '#15803d' : '#b91c1c', fontSize: 14 }}>
                {addMsg}
              </div>
            )}

            <button onClick={handleBuyNow} disabled={adding || !inStock} className="btn btn--ghost btn--block" style={{ marginTop: 12 }}>Buy now</button>

            {/* Delivery check */}
            <div style={{ marginTop: 28, padding: 18, background: 'var(--cream)', border: '1px solid var(--hairline)', borderRadius: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                <Icon name="truck" color="var(--sage-deep)" />
                <div>
                  <div className="caps">Free shipping over ₹999</div>
                  <div className="body-sm">Cash on delivery available</div>
                </div>
              </div>
              <div className="hr--soft"></div>
              <div style={{ display: 'flex', gap: 14, marginTop: 12, alignItems: 'center' }}>
                <input className="field__input" style={{ flex: 1, padding: '10px 14px' }} placeholder="Enter pincode to check delivery"
                  value={pincode} onChange={e => { setPincode(e.target.value); setDelivery(null); }}
                  onKeyDown={e => e.key === 'Enter' && checkPincode()} maxLength={6} />
                <button onClick={checkPincode} className="btn btn--outline btn--sm">Check</button>
              </div>
              {delivery && (
                <div style={{ marginTop: 10, fontSize: 13, color: delivery.serviceable ? '#15803d' : '#b91c1c' }}>
                  {delivery.serviceable
                    ? `✓ Delivery available${delivery.city ? ' to ' + delivery.city : ''}`
                    : '✗ Delivery not available at this pincode'}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Ingredient breakdown */}
      <section className="ink-bg" style={{ padding: '120px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 80, marginBottom: 64 }}>
            <div>
              <div className="eyebrow" style={{ color: '#BFAE8F' }}>Inside the jar</div>
              <h2 className="display-3" style={{ color: '#F1E6D2', marginTop: 14 }}>
                Seven botanicals,<br /><em style={{ fontStyle: 'italic', fontWeight: 300, color: '#D8967C' }}>nothing else.</em>
              </h2>
            </div>
            <div style={{ alignSelf: 'flex-end' }}>
              <p className="body-lg" style={{ color: '#C7B8A2' }}>No fragrance, no parabens, no SLS, no silicones, no synthetic dyes. Each batch is ground in small clay-pot mills near Sanganer and tested for skin-safety in an independent lab.</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, background: 'rgba(239,231,214,0.14)', border: '1px solid rgba(239,231,214,0.14)' }}>
            {[['Multani Mitti','60%','Clay base. Detoxifies, absorbs excess oil.'],['Rice Flour','12%','Fine-grain exfoliant. Buffs without abrasion.'],['Sandalwood','8%','Brightens dull skin; antiseptic.'],['Orange Peel','6%','Natural vitamin C — refreshes and revives.'],['Rose Petal','6%','Calms redness; balances pH.'],['Manjistha','4%','Ayurvedic brightening root.'],['Mulethi','4%','Soothes inflammation, supports barrier.']].map(([n, pct, d], i) => (
              <div key={n} style={{ background: '#2A1D14', padding: 28, display: 'flex', flexDirection: 'column', gap: 14, minHeight: 280 }}>
                <div className="mono" style={{ color: '#A88A4B' }}>0{i + 1}</div>
                <div className="display-5" style={{ color: '#F1E6D2', fontSize: 20 }}>{n}</div>
                <div style={{ fontFamily: 'var(--f-display)', fontSize: 36, color: '#D8967C', fontStyle: 'italic', fontWeight: 300, lineHeight: 1 }}>{pct}</div>
                <p className="body-sm" style={{ color: '#A8957A' }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to use */}
      <section style={{ padding: '120px 0', background: 'var(--paper)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 80 }}>
          <div>
            <div className="eyebrow eyebrow--maroon">Directions for Use</div>
            <h2 className="display-3" style={{ marginTop: 14 }}>The slow ritual.</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: '48px 0 0', borderTop: '1px solid var(--hairline)' }}>
              {[['01','Choose your mix','For dry skin, blend with raw milk. For oily or combination skin, mix with rose water.'],['02','Apply, then pause','Spread evenly across cleansed face, neck or body. Let it rest for 10 minutes.'],['03','Massage as you rinse','Wet your fingertips, gently massage in circles, then rinse with cool water. Pat dry.'],['04','Seal with care','Follow with a light moisturiser or facial oil. Use 2–3 times a week.']].map(([n, t, body]) => (
                <li key={n} style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 24, padding: '28px 0', borderBottom: '1px solid var(--hairline)' }}>
                  <span style={{ fontFamily: 'var(--f-display)', fontSize: 36, color: 'var(--maroon)', fontStyle: 'italic', fontWeight: 300, lineHeight: 1 }}>{n}</span>
                  <div>
                    <div className="display-5">{t}</div>
                    <p className="body" style={{ marginTop: 8, maxWidth: 480 }}>{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <aside>
            <div className="ph ph--sage" style={{ aspectRatio: '4/5', borderRadius: 4, marginBottom: 24 }}><span>ritual lifestyle shot</span></div>
            <div className="card" style={{ padding: 28 }}>
              <div className="eyebrow eyebrow--maroon" style={{ marginBottom: 14 }}>Safety</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['For external use only','Store in a cool, dry place','Patch-test before first use','Discontinue if irritation occurs','Keep out of reach of children'].map(s => (
                  <li key={s} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <Icon name="check" color="var(--sage-deep)" size={16} />
                    <span className="body">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* Specs */}
      <section style={{ background: 'var(--cream)', padding: '64px 0', borderTop: '1px solid var(--hairline)', borderBottom: '1px solid var(--hairline)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 32 }}>
          {[['Net Weight', variant?.label ?? '100g'],['Form','Fine powder'],['Skin Type','All · Unisex'],['Shelf Life','24 months'],['Made in','Jaipur, IN']].map(([k, v], i) => (
            <div key={k} style={{ paddingLeft: i ? 28 : 0, borderLeft: i ? '1px solid var(--hairline)' : 'none' }}>
              <div className="eyebrow" style={{ color: 'var(--ink-mute)' }}>{k}</div>
              <div className="display-5" style={{ marginTop: 10 }}>{v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section style={{ padding: '120px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80 }}>
            <div>
              <div className="eyebrow eyebrow--maroon">Reviews</div>
              <h2 className="display-3" style={{ marginTop: 14 }}>
                <em style={{ fontStyle: 'italic', fontWeight: 300 }}>
                  {product.review_count > 0 ? product.review_count : '—'} honest
                </em><br />reviews.
              </h2>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 28 }}>
                <span style={{ fontFamily: 'var(--f-display)', fontSize: 72, fontWeight: 400 }}>
                  {product.average_rating > 0 ? product.average_rating.toFixed(1) : '—'}
                </span>
                <div>
                  <Stars value={product.average_rating || 0} size={18} />
                  <div className="body-sm" style={{ marginTop: 6 }}>Verified buyers only</div>
                </div>
              </div>
              <Link to={auth.user ? '#leave-review' : '/login'} className="btn btn--outline" style={{ marginTop: 32, display: 'inline-flex' }}>
                Write a review
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {product.reviews?.length > 0
                ? product.reviews.map((r, i) => (
                    <div key={r.id} className="card" style={{ padding: 28 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Stars value={r.rating} />
                            <span className="caps">{r.user_name}</span>
                            {r.verified && <span style={{ fontSize: 10, padding: '3px 8px', border: '1px solid var(--sage-soft)', borderRadius: 999, color: 'var(--sage-deep)', letterSpacing: '0.10em', textTransform: 'uppercase', fontWeight: 600 }}>Verified</span>}
                          </div>
                          {r.skin_type && <div className="body-sm" style={{ marginTop: 4 }}>Skin: {r.skin_type}</div>}
                        </div>
                      </div>
                      {r.title && <div className="display-5" style={{ marginBottom: 8 }}>"{r.title}"</div>}
                      <p className="body">{r.body}</p>
                    </div>
                  ))
                : (
                    <div style={{ padding: '48px 0', color: 'var(--ink-mute)', fontFamily: 'var(--f-display)', fontStyle: 'italic', fontSize: 22 }}>
                      Be the first to review this product.
                    </div>
                  )
              }
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '100px 0', background: 'var(--cream)', borderTop: '1px solid var(--hairline)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80 }}>
          <div>
            <div className="eyebrow eyebrow--maroon">Frequently asked</div>
            <h2 className="display-3" style={{ marginTop: 14 }}>Questions, answered.</h2>
          </div>
          <div>
            {[['Is this suitable for men?','Yes — completely. The Glow Ubtan is unisex, and especially well-suited to beard-area irritation, post-shave roughness and tan removal.'],['How often should I use it?','Two to three times a week is ideal for most skin types. For very sensitive or dry skin, once a week is enough.'],['Can I use it on my body too?','Absolutely. It\'s particularly lovely for knees, elbows, and the back of the neck.'],['What\'s the shelf life after opening?','Six months after opening if stored cool, dry and away from moisture. Use a dry spoon, never wet fingers.'],['Is there a fragrance added?','None at all. The aroma you smell is the natural scent of the herbs themselves — primarily sandalwood and rose.']].map(([q, a], i) => (
              <div key={q} style={{ borderTop: i === 0 ? '1px solid var(--hairline)' : 'none', borderBottom: '1px solid var(--hairline)', padding: '24px 0' }}>
                <div onClick={() => setOpenFaq(openFaq === i ? -1 : i)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                  <span style={{ fontFamily: 'var(--f-display)', fontSize: 22 }}>{q}</span>
                  <Icon name={openFaq === i ? 'minus' : 'plus'} />
                </div>
                {openFaq === i && <p className="body" style={{ marginTop: 14, maxWidth: 640 }}>{a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
