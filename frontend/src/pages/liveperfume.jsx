import React, { useEffect, useState } from 'react';
import { API_ENDPOINTS, getImageUrl } from '../config/api';
import Navbar from '../components/navbar';
import Slider from '../components/slider';
import Footer from '../components/footer';
import '../styles/liveperfume.css';

const LivePerfume = () => {
  const [steps, setSteps] = useState([]);
  const [products, setProducts] = useState([]);
  const [barPackages, setBarPackages] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    package: '',
    message: '',
  });

  const [formStatus, setFormStatus] = useState('');

  // Static slider images (ensure they're in public/slider/)
  const staticSliderImages = [
    '/slider/slide6.png',
    '/slider/slide7.png',
    '/slider/slide8.png',
    '/slider/slide9.png',
    '/slider/slide10.png',
  ];

  useEffect(() => {
    fetch(API_ENDPOINTS.LIVEPERFUME)
      .then((res) => res.json())
      .then((data) => {
        setSteps(data.how_it_works || []);
        setBarPackages(data.bar_packages || []);
      })
      .catch((err) => console.error('Failed to fetch live perfume data:', err));

    fetch(API_ENDPOINTS.PRODUCTS)
      .then((res) => res.json())
      .then((data) => setProducts(data || []))
      .catch((err) => console.error('Error fetching products:', err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('Submitting...');

    try {
      const response = await fetch(API_ENDPOINTS.BOOKINGS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setFormStatus('Booking submitted successfully!');
        setFormData({
          name: '',
          email: '',
          mobile: '',
          package: '',
          message: '',
        });
      } else {
        setFormStatus(data.message || 'Failed to submit booking.');
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      setFormStatus('Error occurred. Try again later.');
    }
  };

  const renderFeatures = (description) => {
    return description
      .split('|')
      .filter((line) => line.trim())
      .map((line, i) => <li key={i}>{line.trim()}</li>);
  };

  return (
    <>
      <Navbar />

      {/* Static image slider */}
      <Slider images={staticSliderImages} />

      <div className="live-bar-container">
        <h2 className="live-bar-heading">FLORETTA LIVE PERFUME BAR</h2>
        <p className="live-bar-description">
          The perfume bar at the wedding venue features Floretta India's collections, enhanced
          by floral arrangements and decor that align with the theme. Its design complements the
          venue, creating a welcoming and sophisticated atmosphere for guests.
        </p>
      </div>

      {/* HOW IT WORKS */}
      <div className="hiw-container">
        <h2 className="hiw-title">HOW IT WORKS?</h2>

        <div className="hiw-step-info-row">
          {steps.length > 0 ? (
            steps.map((step) => (
              <div className="hiw-step-info" key={step.id}>
                <h3 className="hiw-step-title">{step.title}</h3>
                <p className="hiw-step-subtitle">{step.subtitle}</p>
              </div>
            ))
          ) : (
            <p>Loading steps...</p>
          )}
        </div>

        <div className="hiw-step-image-row">
          {steps.length > 0 ? (
            steps.map((step) => (
              <div className="hiw-step-image-container" key={step.id}>
                <img
                  src={getImageUrl(step.image)}
                  alt={step.title}
                  className="hiw-image"
                />
              </div>
            ))
          ) : (
            <p>Loading images...</p>
          )}
        </div>
      </div>

      {/* BOOKING FORM */}
      <h2 className="form-title">FOR BOOKING PERFUME BARS</h2>
      <div className="form-wrapper">
        <form className="booking-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="NAME"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="EMAIL"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="tel"
            name="mobile"
            placeholder="MOBILE NO"
            value={formData.mobile}
            onChange={handleInputChange}
            required
          />
          <select
            name="package"
            value={formData.package}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>
              SELECT PACKAGE
            </option>
            <option value="Bronze">Bronze</option>
            <option value="Silver">Silver</option>
            <option value="Gold">Gold</option>
          </select>
          <textarea
            name="message"
            placeholder="MESSAGE"
            value={formData.message}
            onChange={handleInputChange}
          ></textarea>
          <button type="submit">BOOK NOW</button>
        </form>
        {formStatus && <p className="form-status">{formStatus}</p>}
      </div>

      <Footer />
    </>
  );
};

export default LivePerfume;
