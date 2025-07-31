import React from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import '../styles/carrier.css';

const Contact = () => {
  return (
    <>
      <Navbar />

      <div className="contact-form">
        <h2>Get In Touch</h2>
        <form>
          <div className="form-row">
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <input type="tel" placeholder="Phone" />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea rows="5" placeholder="Your message here..."></textarea>
          </div>
          <div className="form-submit">
            <button type="submit">Send message</button>
          </div>
        </form>
      </div>

      <Footer />
    </>
  );
};

export default Contact;
