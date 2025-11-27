import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import '../styles/policies.css';

const RefundReturnPolicy = () => {
  const [openSections, setOpenSections] = useState({});
  const [expandAll, setExpandAll] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const toggleExpandAll = () => {
    const newExpandAll = !expandAll;
    setExpandAll(newExpandAll);

    const allSections = {};
    for (let i = 1; i <= 4; i++) {
      allSections[`section${i}`] = newExpandAll;
    }
    setOpenSections(allSections);
  };

  const AccordionItem = ({ id, title, children }) => {
    const isOpen = openSections[id] || false;

    return (
      <div className="accordion-item">
        <button
          className={`accordion-header ${isOpen ? 'active' : ''}`}
          onClick={() => toggleSection(id)}
        >
          <h2 className="accordion-title">{title}</h2>
          <span className={`accordion-icon ${isOpen ? 'rotate' : ''}`}>▼</span>
        </button>
        <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className="policy-page">
      <Navbar />

      <div className="policy-container">
        <div className="policy-header">
          <h1>Cancellation, Refund & Return Policy</h1>
          <p className="policy-last-updated">Last Updated: January 2025</p>
        </div>

        <div className="policy-content">
          <div className="policy-intro">
            <p>
              At Floretta India, customer satisfaction is our priority. Please read our
              Cancellation, Refund, and Return Policy carefully to understand your rights
              and our process for handling order issues.
            </p>
          </div>

          <div className="expand-all-container">
            <button className="expand-all-btn" onClick={toggleExpandAll}>
              {expandAll ? 'Collapse All' : 'Expand All'}
            </button>
          </div>

          <AccordionItem id="section1" title="Cancellation Policy">
            <h3>1. Order Cancellation</h3>
            <ul>
              <li>You can cancel your order within <strong>2 hours</strong> of placing it.</li>
              <li>Once dispatched, the order <strong>cannot be cancelled</strong>.</li>
            </ul>
            <div className="policy-note">
              <p>
                To cancel an order, please contact our customer support immediately via email
                or phone with your order details.
              </p>
            </div>

            <h3>2. How to Cancel</h3>
            <p>Contact us within 2 hours of order placement with:</p>
            <ul>
              <li>Your order number</li>
              <li>Registered email address or phone number</li>
              <li>Reason for cancellation</li>
            </ul>
          </AccordionItem>

          <AccordionItem id="section2" title="Refund Policy">
            <h3>1. Refund Eligibility</h3>
            <p>Refunds are issued only if:</p>
            <ul>
              <li>You receive a damaged product</li>
              <li>Wrong product is delivered</li>
              <li>Product is missing from the order</li>
            </ul>

            <h3>2. Refund Requirements</h3>
            <div className="policy-important">
              <p>
                <strong>IMPORTANT:</strong> Refund eligibility requires an unboxing video
                from the start (mandatory) and proof submitted within 24 hours of delivery.
              </p>
            </div>
            <p>To claim a refund, you must provide:</p>
            <ul>
              <li>Unboxing video showing the issue (recorded from the moment you receive the package)</li>
              <li>Clear photos of the damaged or incorrect product</li>
              <li>Order number and delivery receipt</li>
              <li>Complaint raised within 24 hours of delivery</li>
            </ul>

            <h3>3. Refund Method</h3>
            <p>
              Refunds are processed to the original payment method within <strong>5–7 working days</strong>
              after approval. The refund timeline may vary depending on your bank or payment provider.
            </p>

            <h3>4. Non-Refundable Items</h3>
            <div className="policy-highlight">
              <p><strong>We do NOT offer refunds on:</strong></p>
            </div>
            <ul>
              <li>Used products</li>
              <li>Opened perfumes or fragrance bottles</li>
              <li>Sale items or clearance products</li>
              <li>Products without proper documentation (unboxing video and photos)</li>
            </ul>
          </AccordionItem>

          <AccordionItem id="section3" title="Return & Exchange Policy">
            <h3>1. Returns</h3>
            <div className="policy-important">
              <p>
                <strong>Due to hygiene and safety reasons, we do not accept returns on perfumes
                and fragrance products.</strong>
              </p>
            </div>
            <p>
              This policy is in place to ensure product quality and safety for all our customers.
              Once a fragrance product is delivered, it cannot be returned for hygiene purposes.
            </p>

            <h3>2. Exchanges</h3>
            <p>We offer exchange only for:</p>
            <ul>
              <li>Damaged product received</li>
              <li>Wrong item delivered</li>
            </ul>

            <h3>3. Exchange Conditions</h3>
            <p>To be eligible for an exchange, you must:</p>
            <ul>
              <li>Provide unboxing video (mandatory)</li>
              <li>Raise complaint within 24 hours of delivery</li>
              <li>Keep the product in its original packaging</li>
              <li>Ensure the product is unused and unopened</li>
            </ul>

            <h3>4. Non-Exchangeable Items</h3>
            <p>We cannot exchange:</p>
            <ul>
              <li>Used or opened bottles</li>
              <li>Products damaged after delivery due to mishandling</li>
              <li>Items without original packaging</li>
              <li>Products purchased during sale/clearance (unless defective)</li>
            </ul>

            <h3>5. Exchange Process</h3>
            <p>Once your exchange request is approved, we will arrange for:</p>
            <ul>
              <li>Pickup of the incorrect/damaged product</li>
              <li>Delivery of the replacement product</li>
            </ul>
            <div className="policy-note">
              <p>
                Exchange processing may take 7-10 working days depending on product availability
                and your location.
              </p>
            </div>
          </AccordionItem>

          <AccordionItem id="section4" title="Important Notes & Contact">
            <h3>Important Notes</h3>
            <ul>
              <li>Always record an unboxing video when you receive your order. This is crucial for processing any claims.</li>
              <li>Inspect your order immediately upon delivery and report any issues within 24 hours.</li>
              <li>Keep the original packaging and invoice until you are satisfied with the product.</li>
              <li>We reserve the right to reject refund/exchange requests that do not meet our policy requirements.</li>
            </ul>

            <hr className="policy-divider" />

            <div className="policy-contact">
              <h3>Contact Us</h3>
              <p>For cancellation, refund, or exchange requests, please contact us:</p>
              <p><strong>Floretta India</strong></p>
              <p>Email: <a href="mailto:support@florettaindia.com">support@florettaindia.com</a></p>
              <p>Phone: +91-9639970148</p>
              <p>Our customer support team will assist you with your request and guide you through the process.</p>
            </div>
          </AccordionItem>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RefundReturnPolicy;
