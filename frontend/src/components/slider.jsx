import React, { useEffect, useState } from 'react';
import { API_URL } from '../config/api';
import '../styles/slider.css';

const Slider = ({ images = [], fetchUrl, interval = 3000 }) => {
  const [slides, setSlides] = useState(images);
  const [index, setIndex] = useState(0);

useEffect(() => {
  if (fetchUrl) {
    fetch(fetchUrl)
      .then((res) => res.json())
      .then((data) => {
        // Check if this is the new slider API format
        if (data.sliders) {
          const fetchedImages = data.sliders.map(slider => {
            // image_url already includes /storage/ path
            return slider.image_url.startsWith('http')
              ? slider.image_url
              : `${API_URL}${slider.image_url}`;
          });
          setSlides(fetchedImages || []);
        }
        // Legacy format from homepage API
        else if (data.sliders_old) {
          const fetchedImages = data.sliders_old.map(slider =>
            `${API_URL}${slider.image_url}`
          );
          setSlides(fetchedImages || []);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch slider images', err);
      });
  }
}, [fetchUrl]);


  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % slides.length);
    }, interval);
    return () => clearInterval(timer);
  }, [slides, interval]);

  const handlePrev = () => {
    setIndex(prev => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setIndex(prev => (prev + 1) % slides.length);
  };

  if (!slides.length) return <p>Loading carousel...</p>;

  return (
    <div className="carousel-container">
      <div
        className="carousel-track"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((src, i) => (
          <div key={i} className="carousel-slide">
            <img src={src} alt={`Slide ${i + 1}`} className="carousel-image" />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button className="carousel-arrow carousel-arrow-left" onClick={handlePrev}>
        <i className="fas fa-chevron-left"></i>
      </button>
      <button className="carousel-arrow carousel-arrow-right" onClick={handleNext}>
        <i className="fas fa-chevron-right"></i>
      </button>

      <div className="carousel-dots">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`dot ${i === index ? 'active' : ''}`}
            onClick={() => setIndex(i)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
