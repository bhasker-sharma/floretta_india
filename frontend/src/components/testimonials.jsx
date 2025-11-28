import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../config/api";
import "../styles/testimonials.css";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = React.useRef(null);

  useEffect(() => {
    fetch(API_ENDPOINTS.HOMEPAGE)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTestimonials(data);
        } else if (Array.isArray(data.data)) {
          setTestimonials(data.data);
        } else if (Array.isArray(data.testimonials)) {
          setTestimonials(data.testimonials);
        } else {
          console.error("Unexpected response format:", data);
        }
      })
      .catch((error) => console.error("Error fetching testimonials:", error));
  }, []);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    if (sliderRef.current) {
      const slideWidth = window.innerWidth <= 480 ? 300 : 370;
      sliderRef.current.scrollTo({
        left: index * slideWidth,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (sliderRef.current) {
      const slideWidth = window.innerWidth <= 480 ? 300 : 370;
      const scrollLeft = sliderRef.current.scrollLeft;
      const newIndex = Math.round(scrollLeft / slideWidth);
      setCurrentIndex(newIndex);
    }
  };

  return (
    <div className="testimonials-section">
      <h2 className="testimonial-heading">OUR CUSTOMERS</h2>

      {/* Grid layout for large screens */}
      <div className="testimonial-container">
        {testimonials.map((item, index) => (
          <div className="testimonial-card" key={index}>
            <p className="testimonial-name">{item.name}</p>
            <div className="testimonial-stars">
              {"★".repeat(item.rating)}
              {"☆".repeat(5 - item.rating)}
            </div>
            <p className="testimonial-product">{item.product}</p>
            <p className="testimonial-review">{item.review}</p>
          </div>
        ))}
      </div>

      {/* Slider layout for mobile */}
      <div className="testimonial-slider-container">
        <div
          className="testimonial-slider-wrapper"
          ref={sliderRef}
          onScroll={handleScroll}
        >
          {testimonials.map((item, index) => (
            <div
              className={`testimonial-slide ${index === currentIndex ? 'active' : ''}`}
              key={index}
            >
              <div className="testimonial-card">
                <p className="testimonial-name">{item.name}</p>
                <div className="testimonial-stars">
                  {"★".repeat(item.rating)}
                  {"☆".repeat(5 - item.rating)}
                </div>
                <p className="testimonial-product">{item.product}</p>
                <p className="testimonial-review">{item.review}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Dot navigation */}
        {testimonials.length > 0 && (
          <div className="testimonial-dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`testimonial-dot ${currentIndex === index ? "active" : ""}`}
                onClick={() => handleDotClick(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Testimonials;
