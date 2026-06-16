import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const sections = [
  {
    title: 'Free shipping threshold',
    body: `All orders above ₹999 qualify for complimentary standard shipping across India. For orders below ₹999, a flat shipping charge of ₹79 applies.`,
  },
  {
    title: 'Delivery timeframes',
    body: `Standard delivery: 4–7 business days from dispatch.\nExpress delivery (BlueDart): 1–2 business days, available at checkout for ₹149.\n\nDelivery timelines are estimates. We ship from Jaipur, Rajasthan — remote pincodes may take 1–2 additional days.`,
  },
  {
    title: 'Order processing',
    body: `Orders are processed Monday through Saturday, excluding public holidays. Orders placed before 12 PM IST are typically dispatched the same day. Orders placed after 12 PM are dispatched the following business day.`,
  },
  {
    title: 'Tracking your order',
    body: `Once your order is dispatched, you will receive an email and SMS with your AWB (tracking) number. You can track your parcel via the carrier's website or through your account on floretta.in.`,
  },
  {
    title: 'Cash on delivery (COD)',
    body: `COD is available on orders up to ₹3,000 across most serviceable pincodes in India. COD is not available for orders outside India. A ₹49 COD handling fee applies.`,
  },
  {
    title: 'International shipping',
    body: `We currently ship within India only. International shipping is on our roadmap — if you're outside India, you can register your interest at hello@floretta.in.`,
  },
  {
    title: 'Damaged or lost parcels',
    body: `In the rare event your parcel arrives damaged, please photograph the outer packaging and the product before use and email us at orders@floretta.in within 48 hours of delivery. We will arrange a replacement or full refund.`,
  },
];

export default function ShippingPage() {
  return (
    <div className="fl">
      <Header />

      <section style={{ background: 'var(--paper)', padding: '72px 0 120px' }}>
        <div className="container" style={{ maxWidth: 880 }}>
          <div className="ornament" style={{ marginBottom: 24 }}>
            <span className="eyebrow eyebrow--maroon">Policies</span>
          </div>
          <h1 className="display-3">Shipping policy.</h1>
          <p className="body-lg" style={{ marginTop: 18, maxWidth: 600 }}>
            Everything you need to know about how we get Glow Ubtan to your door.
          </p>
          <p className="mono" style={{ marginTop: 12 }}>Last updated: May 2026</p>

          <div style={{ marginTop: 64, display: 'flex', flexDirection: 'column', gap: 0, borderTop: '1px solid var(--hairline)' }}>
            {sections.map((s, i) => (
              <div key={i} style={{ padding: '40px 0', borderBottom: '1px solid var(--hairline)' }}>
                <h2 className="display-5" style={{ marginBottom: 14 }}>{s.title}</h2>
                {s.body.split('\n').map((line, j) => (
                  <p key={j} className="body" style={{ marginTop: j > 0 ? 10 : 0, maxWidth: 680 }}>{line}</p>
                ))}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 56, display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
            <Link to="/returns" className="btn btn--outline">Returns policy →</Link>
            <Link to="/faq" className="btn btn--link">Read the FAQ</Link>
            <Link to="/contact" className="btn btn--link">Contact support</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
