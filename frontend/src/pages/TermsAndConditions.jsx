import React, { useEffect } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import '../styles/policies.css';

const TermsAndConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

          {/* Section 1 */}
          <div className="policy-section">
            <h2>1. Use of Website</h2>
            <ul>
              <li>You must be 18+ to make a purchase.</li>
              <li>You agree not to misuse the website or engage in harmful activities.</li>
            </ul>
          </div>

          <hr className="policy-divider" />

          {/* Section 2 */}
          <div className="policy-section">
            <h2>2. Products</h2>
            <ul>
              <li>We offer perfumes, fragrances, and related products.</li>
              <li>Product colors and packaging may slightly vary due to lighting and screen settings.</li>
              <li>All products are for personal use only—not for resale unless approved.</li>
            </ul>
          </div>

          <hr className="policy-divider" />

          {/* Section 3 */}
          <div className="policy-section">
            <h2>3. Orders & Payments</h2>
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
          </div>

          <hr className="policy-divider" />

          {/* Section 4 */}
          <div className="policy-section">
            <h2>4. Pricing</h2>
            <ul>
              <li>All prices are listed in INR (Indian Rupees).</li>
              <li>Prices may change anytime without prior notice.</li>
            </ul>
          </div>

          <hr className="policy-divider" />

          {/* Section 5 */}
          <div className="policy-section">
            <h2>5. Intellectual Property</h2>
            <ul>
              <li>All content, product images, and branding belong to Floretta India.</li>
              <li>Copying or using our visuals/content without permission is prohibited.</li>
            </ul>
            <div className="policy-important">
              <p>
                Unauthorized use of our brand assets, images, or content may result in legal action.
              </p>
            </div>
          </div>

          <hr className="policy-divider" />

          {/* Section 6 */}
          <div className="policy-section">
            <h2>6. Limitation of Liability</h2>
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
          </div>

          <hr className="policy-divider" />

          {/* Section 7 */}
          <div className="policy-section">
            <h2>7. Governing Law</h2>
            <p>
              These terms are governed by the laws of India. Any disputes arising from the use
              of our website or products will be subject to the jurisdiction of Indian courts.
            </p>
          </div>

          <hr className="policy-divider" />

          {/* Section 8 */}
          <div className="policy-section">
            <h2>8. Modifications to Terms</h2>
            <p>
              Floretta India reserves the right to modify these Terms & Conditions at any time.
              Changes will be effective immediately upon posting on this page. Your continued use
              of the website after such changes constitutes acceptance of the new terms.
            </p>
          </div>

          <hr className="policy-divider" />

          {/* Section 9 */}
          <div className="policy-section">
            <h2>9. User Accounts</h2>
            <ul>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You agree to accept responsibility for all activities that occur under your account.</li>
              <li>We reserve the right to suspend or terminate accounts that violate our terms.</li>
            </ul>
          </div>

          <hr className="policy-divider" />

          {/* Contact Section */}
          <div className="policy-contact">
            <h2>10. Contact Us</h2>
            <p>If you have any questions about these Terms & Conditions, please contact us:</p>
            <p><strong>Floretta India</strong></p>
            <p>Email: <a href="mailto:support@florettaindia.com">support@florettaindia.com</a></p>
            <p>Phone: +91-9639970148</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsAndConditions;
