import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import '../styles/policies.css';

const TermsAndConditions = () => {
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
    for (let i = 1; i <= 10; i++) {
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
          <h1>Terms & Conditions</h1>
          <p className="policy-last-updated">Last Updated: January 2025</p>
        </div>

        <div className="policy-content">
          <div className="policy-intro">
            <p>
              Welcome to Floretta India. By accessing or using our website, you agree to
              the following Terms & Conditions. Please read them carefully before making
              any purchase or using our services.
            </p>
          </div>

          <div className="expand-all-container">
            <button className="expand-all-btn" onClick={toggleExpandAll}>
              {expandAll ? 'Collapse All' : 'Expand All'}
            </button>
          </div>

          <AccordionItem id="section1" title="1. Use of Website">
            <ul>
              <li>You must be 18+ to make a purchase.</li>
              <li>You agree not to misuse the website or engage in harmful activities.</li>
            </ul>
          </AccordionItem>

          <AccordionItem id="section2" title="2. Products">
            <ul>
              <li>We offer perfumes, fragrances, and related products.</li>
              <li>Product colors and packaging may slightly vary due to lighting and screen settings.</li>
              <li>All products are for personal use only—not for resale unless approved.</li>
            </ul>
          </AccordionItem>

          <AccordionItem id="section3" title="3. Orders & Payments">
            <ul>
              <li>Orders are confirmed only after successful payment.</li>
              <li>We reserve the right to cancel any order due to stock issues or suspicious activity.</li>
              <li>Payment is processed through secure third-party gateways.</li>
            </ul>
            <div className="policy-highlight">
              <p>
                <strong>Note:</strong> We do not store your payment card details. All transactions
                are securely processed by our payment partners.
              </p>
            </div>
          </AccordionItem>

          <AccordionItem id="section4" title="4. Pricing">
            <ul>
              <li>All prices are listed in INR (Indian Rupees).</li>
              <li>Prices may change anytime without prior notice.</li>
            </ul>
          </AccordionItem>

          <AccordionItem id="section5" title="5. Intellectual Property">
            <ul>
              <li>All content, product images, and branding belong to Floretta India.</li>
              <li>Copying or using our visuals/content without permission is prohibited.</li>
            </ul>
            <div className="policy-important">
              <p>
                Unauthorized use of our brand assets, images, or content may result in legal action.
              </p>
            </div>
          </AccordionItem>

          <AccordionItem id="section6" title="6. Limitation of Liability">
            <p>We are not responsible for:</p>
            <ul>
              <li>Any allergic reactions (always patch test before full use).</li>
              <li>Delays due to courier partners or external circumstances.</li>
              <li>Minor color differences on packaging or products due to screen settings.</li>
            </ul>
            <div className="policy-note">
              <p>
                We recommend performing a patch test before using any fragrance product to check
                for allergies or skin sensitivities.
              </p>
            </div>
          </AccordionItem>

          <AccordionItem id="section7" title="7. Governing Law">
            <p>
              These terms are governed by the laws of India. Any disputes arising from the use
              of our website or products will be subject to the jurisdiction of Indian courts.
            </p>
          </AccordionItem>

          <AccordionItem id="section8" title="8. Modifications to Terms">
            <p>
              Floretta India reserves the right to modify these Terms & Conditions at any time.
              Changes will be effective immediately upon posting on this page. Your continued use
              of the website after such changes constitutes acceptance of the new terms.
            </p>
          </AccordionItem>

          <AccordionItem id="section9" title="9. User Accounts">
            <ul>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You agree to accept responsibility for all activities that occur under your account.</li>
              <li>We reserve the right to suspend or terminate accounts that violate our terms.</li>
            </ul>
          </AccordionItem>

          <AccordionItem id="section10" title="10. Contact Us">
            <p>If you have any questions about these Terms & Conditions, please contact us:</p>
            <p><strong>Floretta India</strong></p>
            <p>Email: <a href="mailto:support@florettaindia.com">support@florettaindia.com</a></p>
            <p>Phone: +91-9639970148</p>
          </AccordionItem>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsAndConditions;
