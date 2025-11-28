import '../styles/footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/carrier">Career</a></li>
            <li><a href="/aboutus">About us</a></li>
            <li><a href="/contactus">Contact Us</a></li>
          </ul>
        </div>


        {/* Newsletter */}
        <div className="footer-section newsletter">
          <h3>Stay Connected</h3>
          <p className="newsletter-description">
            Subscribe to our newsletter for exclusive deals and updates.
          </p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <div className="email-input-wrapper">
              <input
                type="email"
                placeholder="Your email address"
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-btn">
                Subscribe
              </button>
            </div>
          </form>
        </div>

        {/* Support */}
        <div className="footer-section">
          <h3>SUPPORT</h3>
          <ul>
            <li><a href="/admin">Admin</a></li>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/refund-policy">Refund & Return Policy</a></li>
            <li><a href="/terms-and-conditions">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h3>CONTACT INFORMATION</h3>
          <p>Phone: +91 9149126788</p>
          <p>Email: kaushikmashek93@gmail.com</p>
          <p>Address: Haridwar, Uttrakhand</p>
        </div>
        {/* Social Section - Full Width Bottom */}
        <div className="social-section">
          <p className="social-title">Follow Us</p>
          <div className="social-icons">
            <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
