import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Icon from '../components/Icon';

const categories = [
  {
    label: 'The product',
    items: [
      ['What is Glow Ubtan?', 'Glow Ubtan is a stone-milled dry powder face and body polish made from seven Ayurvedic botanicals — Multani mitti, rice flour, sandalwood, orange peel, rose petal, manjistha and mulethi. You mix it with a liquid of your choice to create a fresh paste each time you use it.'],
      ['Is it suitable for men?', 'Completely. The formula is unisex and particularly effective for beard-area uneven tone, post-shave roughness, and tan removal. Nothing about the formula is gender-specific.'],
      ['What skin types can use it?', 'All skin types — oily, dry, combination, normal, and sensitive. For very sensitive skin, we recommend patch-testing and using it once a week to start.'],
      ['Is there any fragrance added?', 'No synthetic fragrance at all. The aroma comes entirely from the botanicals — primarily sandalwood and rose petal. If you are sensitive to natural scents, patch-test first.'],
      ['Is it vegan and cruelty-free?', 'Yes on both counts. No animal-derived ingredients, no animal testing at any stage.'],
      ['What is the shelf life?', '24 months unopened. After opening, 6 months if stored in a cool, dry place away from moisture. Always use a dry spoon — never wet fingers — to scoop.'],
    ],
  },
  {
    label: 'How to use',
    items: [
      ['How do I mix and use the ubtan?', 'Take 1–2 teaspoons of the powder. Mix with raw milk (for dry skin) or rose water (for oily/combination skin) to form a smooth paste. Apply to cleansed skin, leave for 8–10 minutes, then wet your fingertips and massage gently before rinsing with cool water.'],
      ['How often should I use it?', '2–3 times a week for most skin types. For sensitive or dry skin, once a week is enough to start. You can increase frequency as your skin adjusts.'],
      ['Can I use it on my body?', 'Yes — the name says face and body. It works especially well on knees, elbows, the back of the neck, and areas of unevenness or tan.'],
      ['Can I mix it with something other than milk or rose water?', "Yes. You can use plain water, aloe vera gel, or diluted honey. Raw milk works best for brightening and is our top recommendation. Avoid mixing with strong acids like lemon juice as it can irritate the skin."],
    ],
  },
  {
    label: 'Orders & shipping',
    items: [
      ['How long does delivery take?', 'Standard delivery is 4–7 business days from dispatch. Express (BlueDart) is 1–2 business days, available at checkout. We ship from Jaipur, Rajasthan.'],
      ['Is shipping free?', 'Yes — on all orders above ₹999. Orders below ₹999 have a flat ₹79 shipping charge.'],
      ['Can I track my order?', 'Yes. You will receive an email and SMS with your tracking (AWB) number once your order is dispatched. You can also track it in your account under "Track Order".'],
      ['Do you offer cash on delivery?', 'Yes, COD is available on orders up to ₹3,000 across most pincodes. A ₹49 handling fee applies.'],
    ],
  },
  {
    label: 'Returns & payments',
    items: [
      ['What is your return policy?', 'We accept returns on unopened products in original packaging within 7 days of delivery. Opened or used products cannot be returned due to hygiene reasons.'],
      ['My product arrived damaged. What do I do?', 'Please photograph the packaging and product and email orders@floretta.in within 48 hours of delivery. We will arrange a free replacement or full refund.'],
      ['What payment methods do you accept?', 'UPI, credit/debit cards (Visa, Mastercard, RuPay, Amex), net banking, and cash on delivery — all via Razorpay.'],
    ],
  },
];

export default function FAQPage() {
  const [openCat, setOpenCat] = useState(0);
  const [openQ, setOpenQ] = useState(null);

  return (
    <div className="fl">
      <Header />

      <section style={{ background: 'var(--paper)', padding: '72px 0 120px' }}>
        <div className="container" style={{ maxWidth: 960 }}>
          <div className="ornament" style={{ marginBottom: 24 }}><span className="eyebrow eyebrow--maroon">Help centre</span></div>
          <h1 className="display-3">Frequently asked questions.</h1>
          <p className="body-lg" style={{ marginTop: 18 }}>Can't find your answer? <Link to="/contact" style={{ borderBottom: '1px solid var(--ink-soft)' }}>Contact our team →</Link></p>

          {/* Category tabs */}
          <div style={{ display: 'flex', gap: 8, marginTop: 48, flexWrap: 'wrap' }}>
            {categories.map((cat, i) => (
              <button key={i} onClick={() => { setOpenCat(i); setOpenQ(null); }} className={i === openCat ? 'btn btn--primary btn--sm' : 'btn btn--outline btn--sm'}>{cat.label}</button>
            ))}
          </div>

          {/* Questions */}
          <div style={{ marginTop: 40, borderTop: '1px solid var(--hairline)' }}>
            {categories[openCat].items.map(([q, a], i) => (
              <div key={i} style={{ borderBottom: '1px solid var(--hairline)' }}>
                <button onClick={() => setOpenQ(openQ === i ? null : i)} style={{ width: '100%', padding: '24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, textAlign: 'left', cursor: 'pointer', background: 'none', border: 'none' }}>
                  <span style={{ fontFamily: 'var(--f-display)', fontSize: 22, color: 'var(--ink)', fontWeight: 400 }}>{q}</span>
                  <Icon name={openQ === i ? 'minus' : 'plus'} size={18} color="var(--ink-soft)" />
                </button>
                {openQ === i && (
                  <p className="body" style={{ paddingBottom: 24, maxWidth: 680, lineHeight: 1.7 }}>{a}</p>
                )}
              </div>
            ))}
          </div>

          {/* Still need help */}
          <div style={{ marginTop: 72, textAlign: 'center', padding: '56px 0', borderTop: '1px solid var(--hairline)' }}>
            <div className="eyebrow eyebrow--sage">Still need help?</div>
            <h2 className="display-4" style={{ marginTop: 14 }}>We're here for you.</h2>
            <p className="body-lg" style={{ marginTop: 12 }}>Monday – Saturday · 10 AM – 6 PM IST</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn btn--maroon btn--lg">Send a message</Link>
              <a href="mailto:hello@floretta.in" className="btn btn--ghost btn--lg">hello@floretta.in</a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
