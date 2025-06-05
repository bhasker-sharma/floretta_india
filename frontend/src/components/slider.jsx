import React, { useEffect, useState } from 'react';
import '../styles/slider.css';

const Carousel = () => {
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch('http://localhost:8000/api/homepage')
      .then((res) => res.json())
      .then((data) => {
        // Laravel returns 'sliders' array with image paths
        const sliderImages = data.sliders.map(slider =>
          `http://localhost:8000/storage/${slider.image}`
        );
        setImages(sliderImages);
      })
      .catch((err) => console.error('Failed to fetch slider images', err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

  if (images.length === 0) return <p>Loading...</p>;

  return (
    <div className="carousel-container">
      <div
        className="carousel-track"
        style={{ transform: `translateX(-${index * 100}vw)` }}
      >
        {images.map((src, i) => (
          <div key={i} className="carousel-slide">
            <img src={src} alt={`Slide ${i + 1}`} className="carousel-image" />
          </div>
        ))}
      </div>
      <div className="carousel-dots">
        {images.map((_, i) => (
          <div
            key={i}
            className={`dot ${i === index ? '' : 'opacity-50'}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
