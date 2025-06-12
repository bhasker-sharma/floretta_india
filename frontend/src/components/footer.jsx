import React from 'react';
import '../styles/footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Career</a></li>
            <li><a href="#">About us</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h3>CONTACT INFORMATION</h3>
          <p>Phone: +91 9149126788</p>
          <p>Email: kaushikmashek93@gmail.com</p>
          <p>Address: Haridwar, Uttrakhand</p>
        </div>

        {/* Newsletter */}
        <div className="footer-section newsletter">
          <p className="newsletter-text">
            Floretta Stay connected for exclusive offers and latest updates, delivered straight to your inbox.
          </p>
          <form className="newsletter-form">
            <input type="email" placeholder="ENTER EMAIL ADDRESS" required />
            <button type="submit">SEND</button>
          </form>
          <p className="visit-us">VISIT US ON</p>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
          </div>
        </div>

        {/* Support */}
        <div className="footer-section">
          <h3>SUPPORT</h3>
          <ul>
            <li><a href="/admin">Admin</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Refund & Return Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
