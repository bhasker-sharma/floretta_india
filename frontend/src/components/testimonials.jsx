import React, { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../config/api';
import '../styles/testimonials.css';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
useEffect(() => {
  fetch(API_ENDPOINTS.HOMEPAGE)
    .then(response => response.json())
    .then(data => {
      console.log('API Response:', data);

      if (Array.isArray(data)) {
        setTestimonials(data);
      } else if (Array.isArray(data.data)) {
        setTestimonials(data.data);
      } else if (Array.isArray(data.testimonials)) {
        setTestimonials(data.testimonials);
      } else {
        console.error('Unexpected response format:', data);
      }
    })
    .catch(error => console.error('Error fetching testimonials:', error));
}, []);


  return (
    <div className="testimonials-section">
      <h2 className="testimonial-heading">OUR CUSTOMER</h2>
      <div className="testimonial-container">
        {testimonials.map((item, index) => (
          <div className="testimonial-card" key={index}>
            <p className="testimonial-name">{item.name}</p>
            <div className="testimonial-stars">
              {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
            </div>
            <p className="testimonial-product">{item.product}</p>
            <p className="testimonial-review">{item.review}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
