import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, getImageUrl } from '../config/api';

import Navbar from '../components/navbar';
import Slider from '../components/slider';
import Footer from '../components/footer';

import '../styles/hotelamenities.css'; // Include styles for both sections

function HotelAmenities() {
  const [freshners, setFreshners] = useState([]);
  const [formData, setFormData] = useState({
    hotel_name: '',
    email: '',
    mobile: '',
    packaging_option: '',
    preferred_fragrance: '',
    estimated_quantity: '',
    additional_requirements: '',
  });

  useEffect(() => {
    axios.get(API_ENDPOINTS.ROOM_FRESHNERS)
      .then(response => setFreshners(response.data))
      .catch(error => console.error('Failed to fetch room freshners:', error));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_ENDPOINTS.CONTACT, formData);
      alert('Form submitted successfully!');
      setFormData({
        hotel_name: '',
        email: '',
        mobile: '',
        packaging_option: '',
        preferred_fragrance: '',
        estimated_quantity: '',
        additional_requirements: '',
      });
    } catch (error) {
      console.error('Error submitting form', error);
      alert('Something went wrong!');
    }
  };

  return (
    <>
      <Navbar />
      <Slider fetchUrl={API_ENDPOINTS.HOMEPAGE} interval={4000} />

      {/* Room Freshener Section */}
      <div className="rfv-container">
        <h2 className="rfv-title">Room Fresheners</h2>
        <div className="rfv-grid">
          {freshners.map((item, idx) => (
            <div className="rfv-card" key={idx}>
              <img
                src={getImageUrl(item.image)}
                alt={item.name}
                className="rfv-img"
              />
              <p className="rfv-name">{item.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="cf-container">
        <h2 className="cf-title">Contact Us</h2>
        <form onSubmit={handleSubmit} className="cf-form">
          <input
            type="text"
            name="hotel_name"
            placeholder="Hotel Name"
            value={formData.hotel_name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="mobile"
            placeholder="Mobile No"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
          <select
            name="packaging_option"
            value={formData.packaging_option}
            onChange={handleChange}
            required
          >
            <option value="">Packaging Options</option>
            <option value="Standard">Standard</option>
            <option value="Customized">Customized</option>
          </select>
          <select
            name="preferred_fragrance"
            value={formData.preferred_fragrance}
            onChange={handleChange}
            required
          >
            <option value="">Preferred Fragrance</option>
            <option value="Lavender">Lavender</option>
            <option value="Rose">Rose</option>
            <option value="Sandalwood">Sandalwood</option>
          </select>
          <select
            name="estimated_quantity"
            value={formData.estimated_quantity}
            onChange={handleChange}
            required
          >
            <option value="">Estimated Quantity (Sets)</option>
            <option value="0-100">0-100</option>
            <option value="100-500">100-500</option>
            <option value="500+">500+</option>
          </select>
          <textarea
            name="additional_requirements"
            placeholder="Additional Requirements"
            value={formData.additional_requirements}
            onChange={handleChange}
          ></textarea>
          <button type="submit">Book Now</button>
        </form>
      </div>

      <Footer />
    </>
  );
}

export default HotelAmenities;
