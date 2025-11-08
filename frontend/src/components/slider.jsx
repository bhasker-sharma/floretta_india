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
        const fetchedImages = data.sliders?.map(slider =>
          `${API_URL}${slider.image_url}`
        );
        setSlides(fetchedImages || []);
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

  if (!slides.length) return <p>Loading carousel...</p>;

  return (
    <div className="carousel-container">
      <div
        className="carousel-track"
        style={{ transform: `translateX(-${index * 100}vw)` }}
      >
        {slides.map((src, i) => (
          <div key={i} className="carousel-slide">
            <img src={src} alt={`Slide ${i + 1}`} className="carousel-image" />
          </div>
        ))}
      </div>
      <div className="carousel-dots">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`dot ${i === index ? 'active' : ''}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
