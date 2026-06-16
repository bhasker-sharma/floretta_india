import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Icon from '../components/Icon';

const sections = [
  {
    title: '7-day return window',
    body: `We accept returns on unopened, unused products in their original packaging within 7 days of delivery. Once the return window has passed, we are unfortunately unable to accept returns.`,
  },
  {
    title: 'Conditions for return',
    body: `Products must be:\n• Unopened and in original, factory-sealed packaging\n• Free from damage caused by the customer\n• Returned with the original invoice\n\nOpened or used products cannot be accepted for return due to hygiene and safety reasons. If your product arrived damaged or defective, this is treated as a separate case — see below.`,
  },
  {
    title: 'How to initiate a return',
    body: `1. Email orders@floretta.in with your order number and reason for return\n2. Our team will respond within 24 hours with a return authorisation and instructions\n3. Pack the product securely and ship it to our returns address in Jaipur\n4. Once received and inspected, your refund will be processed within 5–7 business days`,
  },
  {
    title: 'Refund method',
    body: `Refunds are issued to the original payment method:\n• UPI / bank transfer: 3–5 business days\n• Credit / debit card: 5–7 business days\n• Razorpay wallet: 1–2 business days\n\nShipping charges (if any) are non-refundable. Return shipping cost is borne by the customer unless the return is due to a defective or incorrectly shipped product.`,
  },
  {
    title: 'Damaged or defective products',
    body: `If you receive a product that is damaged, defective, or different from what you ordered, please contact us within 48 hours of delivery with photos of the packaging and product. We will arrange a free replacement or full refund, including original shipping costs.`,
  },
  {
    title: 'Exchanges',
    body: `We do not offer direct exchanges at this time. If you'd like a different size or variant, please initiate a return (if eligible) and place a new order.`,
  },
  {
    title: 'Gift orders',
    body: `If you received a Floretta product as a gift and wish to return it, please contact us with the order number (available on the packaging slip). The refund will be issued to the original purchaser's payment method.`,
  },
];

export default function ReturnsPage() {
  return (
    <div className="fl">
      <Header />

      <section style={{ background: 'var(--paper)', padding: '72px 0 120px' }}>
        <div className="container" style={{ maxWidth: 880 }}>
          <div className="ornament" style={{ marginBottom: 24 }}>
            <span className="eyebrow eyebrow--maroon">Policies</span>
          </div>
          <h1 className="display-3">Returns &amp; refunds.</h1>
          <p className="body-lg" style={{ marginTop: 18, maxWidth: 600 }}>
            We want every ritual to feel right. If something isn't, here's how we make it right.
          </p>
          <p className="mono" style={{ marginTop: 12 }}>Last updated: May 2026</p>

          {/* Quick summary cards */}
          <div className="fl-grid-three" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 48 }}>
            {[
              ['7 days', 'Return window from delivery date'],
              ['Unopened only', 'Products must be factory-sealed'],
              ['5–7 days', 'Refund processing time'],
            ].map(([t, s]) => (
              <div key={t} className="card" style={{ padding: 24 }}>
                <div className="display-4" style={{ color: 'var(--maroon)' }}>{t}</div>
                <div className="body-sm" style={{ marginTop: 8 }}>{s}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 56, display: 'flex', flexDirection: 'column', gap: 0, borderTop: '1px solid var(--hairline)' }}>
            {sections.map((s, i) => (
              <div key={i} style={{ padding: '40px 0', borderBottom: '1px solid var(--hairline)' }}>
                <h2 className="display-5" style={{ marginBottom: 14 }}>{s.title}</h2>
                {s.body.split('\n').map((line, j) => (
                  <p key={j} className="body" style={{ marginTop: j > 0 ? 8 : 0, maxWidth: 680 }}>{line}</p>
                ))}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 56, padding: 32, background: 'var(--cream)', border: '1px solid var(--hairline)', borderRadius: 8 }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <Icon name="leaf" size={20} color="var(--sage-deep)" />
              <div>
                <div className="display-5" style={{ fontSize: 20 }}>Still have questions?</div>
                <p className="body" style={{ marginTop: 8 }}>Our support team is available Monday–Saturday, 10 AM–6 PM IST.</p>
                <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
                  <Link to="/contact" className="btn btn--maroon btn--sm">Contact us</Link>
                  <Link to="/faq" className="btn btn--outline btn--sm">Read FAQ</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
