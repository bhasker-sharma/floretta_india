import React, { useEffect } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import '../styles/policies.css';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="policy-page">
      <Navbar />

      <div className="policy-container">
        <div className="policy-header">
          <h1>Privacy Policy</h1>
          <p className="policy-last-updated">Last Updated: January 2025</p>
        </div>

        <div className="policy-content">
          <div className="policy-intro">
            <p>
              Floretta India ("we", "our", "us") is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, share, and safeguard your
              information when you visit our website, make a purchase, or interact with us online.
            </p>
          </div>

          {/* Section 1 */}
          <div className="policy-section">
            <h2>1. Information We Collect</h2>

            <h3>A. Personal Information</h3>
            <p>We may collect the following details when you place an order, create an account, or fill forms:</p>
            <ul>
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Billing & shipping address</li>
              <li>Payment details (processed securely by payment gateways; we do not store card details)</li>
            </ul>

            <h3>B. Non-Personal Information</h3>
            <ul>
              <li>Browser type</li>
              <li>Device information</li>
              <li>IP address</li>
              <li>Cookies & usage data</li>
              <li>Pages visited, time spent, click patterns</li>
            </ul>

            <h3>C. Social Media Information</h3>
            <p>
              If you interact with us on platforms like Instagram, Facebook, etc., we may
              receive basic profile data as permitted.
            </p>
          </div>

          <hr className="policy-divider" />

          {/* Section 2 */}
          <div className="policy-section">
            <h2>2. How We Use Your Information</h2>
            <p>We use your data to:</p>
            <ul>
              <li>Process and deliver your orders</li>
              <li>Communicate about orders, offers, and customer support</li>
              <li>Improve website experience</li>
              <li>Personalize product recommendations</li>
              <li>Send promotional emails (only with your consent)</li>
              <li>Maintain security and prevent fraud</li>
            </ul>
          </div>

          <hr className="policy-divider" />

          {/* Section 3 */}
          <div className="policy-section">
            <h2>3. How We Share Your Information</h2>
            <p>Your data may be shared with:</p>
            <ul>
              <li>Logistics partners for delivering orders</li>
              <li>Payment gateways for secure payment processing</li>
              <li>Marketing platforms (email/SMS services)</li>
              <li>Analytics tools like Google Analytics</li>
            </ul>
            <div className="policy-highlight">
              <p><strong>We do not sell or trade your personal data.</strong></p>
            </div>
          </div>

          <hr className="policy-divider" />

          {/* Section 4 */}
          <div className="policy-section">
            <h2>4. Cookies</h2>
            <p>We use cookies to:</p>
            <ul>
              <li>Improve browsing experience</li>
              <li>Remember your preferences</li>
              <li>Provide personalized recommendations</li>
              <li>Analyse website traffic</li>
            </ul>
            <div className="policy-note">
              <p>Users can disable cookies anytime in their browser settings.</p>
            </div>
          </div>

          <hr className="policy-divider" />

          {/* Section 5 */}
          <div className="policy-section">
            <h2>5. Data Protection & Security</h2>
            <p>
              We use industry-standard security techniques to protect your data. Although we
              strive to keep your information safe, no method of data transfer is 100% secure.
            </p>
          </div>

          <hr className="policy-divider" />

          {/* Section 6 */}
          <div className="policy-section">
            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Request corrections</li>
              <li>Request deletion of your data</li>
              <li>Opt out of marketing communications</li>
            </ul>
            <p>To exercise your rights, email us at: <strong>support@florettaindia.com</strong></p>
          </div>

          <hr className="policy-divider" />

          {/* Section 7 */}
          <div className="policy-section">
            <h2>7. Children's Privacy</h2>
            <p>
              Our website is not intended for children under 13. We do not knowingly collect
              personal information from minors.
            </p>
          </div>

          <hr className="policy-divider" />

          {/* Section 8 */}
          <div className="policy-section">
            <h2>8. Third-Party Links</h2>
            <p>
              Our website may contain links to external sites. We are not responsible for the
              privacy practices of those websites.
            </p>
          </div>

          <hr className="policy-divider" />

          {/* Section 9 */}
          <div className="policy-section">
            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on
              this page with the updated date.
            </p>
          </div>

          <hr className="policy-divider" />

          {/* Contact Section */}
          <div className="policy-contact">
            <h2>10. Contact Us</h2>
            <p>For any privacy-related queries, contact:</p>
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

export default PrivacyPolicy;
