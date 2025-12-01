import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import '../styles/policies.css';

const ShippingPolicy = () => {
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
    for (let i = 1; i <= 9; i++) {
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
          <h1>Shipping Policy</h1>
          <p className="policy-last-updated">Last Updated: January 2025</p>
        </div>

        <div className="policy-content">
          <div className="policy-intro">
            <p>
              At Floretta India, we are committed to delivering your orders quickly and safely.
              Please review our shipping policy to understand our delivery process, timelines,
              and related terms.
            </p>
          </div>

          <div className="expand-all-container">
            <button className="expand-all-btn" onClick={toggleExpandAll}>
              {expandAll ? 'Collapse All' : 'Expand All'}
            </button>
          </div>

          <AccordionItem id="section1" title="1. Shipping Locations">
            <p>
              We ship across India. Currently, we do not ship internationally. If you are
              located outside India and wish to purchase our products, please contact us
              for special arrangements.
            </p>
          </AccordionItem>

          <AccordionItem id="section2" title="2. Shipping Time">
            <ul>
              <li>Orders are dispatched within <strong>1–3 working days</strong> after order confirmation.</li>
              <li>Delivery takes <strong>3–7 working days</strong>, depending on your location.</li>
            </ul>
            <div className="policy-note">
              <p>
                <strong>Note:</strong> Delivery times may vary during festive seasons, holidays,
                or in case of unforeseen circumstances. Remote locations may experience slight delays.
              </p>
            </div>
          </AccordionItem>

          <AccordionItem id="section3" title="3. Shipping Charges">
            <ul>
              <li>Standard shipping charges apply based on pin code and courier partner.</li>
              <li>Free shipping may be available on special offers or orders above a certain amount.</li>
            </ul>
            <div className="policy-highlight">
              <p>
                <strong>Stay updated!</strong> Check our website regularly for promotional offers
                including free shipping campaigns.
              </p>
            </div>
          </AccordionItem>

          <AccordionItem id="section4" title="4. Order Tracking">
            <p>Once your order is shipped, you will receive a tracking link via:</p>
            <ul>
              <li>SMS</li>
              <li>Email</li>
              <li>WhatsApp</li>
            </ul>
            <p>
              You can use this tracking link to monitor your order's delivery status in real-time.
            </p>
          </AccordionItem>

          <AccordionItem id="section5" title="5. Packaging">
            <p>
              All products are securely packed to avoid leakage or breakage during transit. We use:
            </p>
            <ul>
              <li>Bubble wrap and protective cushioning for fragile items</li>
              <li>Sealed packaging to prevent leakage</li>
              <li>Sturdy outer boxes to protect against damage</li>
            </ul>
            <div className="policy-note">
              <p>
                If you receive a damaged package, please record an unboxing video and contact us
                immediately for assistance.
              </p>
            </div>
          </AccordionItem>

          <AccordionItem id="section6" title="6. Delays">
            <p>We are not responsible for delays caused by:</p>
            <ul>
              <li>Weather conditions</li>
              <li>Political issues or strikes</li>
              <li>Courier partner delays</li>
              <li>Incorrect address provided by the customer</li>
              <li>Public holidays or festive seasons</li>
            </ul>
            <div className="policy-important">
              <p>
                Please ensure your shipping address is complete and accurate to avoid delivery delays.
              </p>
            </div>
          </AccordionItem>

          <AccordionItem id="section7" title="7. Failed Delivery Attempts">
            <p>If the courier is unable to deliver your order due to:</p>
            <ul>
              <li>Incorrect or incomplete address</li>
              <li>Recipient unavailable</li>
              <li>Refusal to accept the order</li>
            </ul>
            <p>
              The package will be returned to our warehouse. In such cases, additional shipping
              charges may apply for re-delivery. Please contact our support team for assistance.
            </p>
          </AccordionItem>

          <AccordionItem id="section8" title="8. Address Changes">
            <p>
              Once an order is dispatched, we cannot modify the delivery address. Please ensure
              your shipping details are correct before confirming your order.
            </p>
          </AccordionItem>

          <AccordionItem id="section9" title="9. Contact Us">
            <p>For any shipping-related queries, please contact us:</p>
            <p><strong>Floretta India</strong></p>
            <p>Email: <a href="mailto:support@florettaindia.com">support@florettaindia.com</a></p>
            <p>Phone: +91-9639970148</p>
            <p>Our customer support team is available to help you with any concerns.</p>
          </AccordionItem>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ShippingPolicy;
