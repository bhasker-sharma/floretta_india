import React, { useEffect, useState } from "react";
import { API_ENDPOINTS, getImageUrl } from "../config/api";
import "../styles/uproducts.css";

const UProductGallery = () => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = React.useRef(null);

  useEffect(() => {
    fetch(API_ENDPOINTS.HOMEPAGE)
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : data.uproducts || []);
      });
  }, []);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    if (sliderRef.current) {
      const slideWidth = window.innerWidth <= 480 ? 270 : 300;
      sliderRef.current.scrollTo({
        left: index * slideWidth,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (sliderRef.current) {
      const slideWidth = window.innerWidth <= 480 ? 270 : 300;
      const scrollLeft = sliderRef.current.scrollLeft;
      const newIndex = Math.round(scrollLeft / slideWidth);
      setCurrentIndex(newIndex);
    }
  };

  return (
    <div className="uproduct-gallery">
      <h2 className="section-heading">Our Products</h2>

      {/* Grid layout for large screens */}
      <div className="uproduct-grid">
        {products.map((product) => (
          <div className="uproduct-card" key={product.id}>
            <div className="uproduct-image-wrapper">
              <img
                src={getImageUrl(product.image_path)}
                alt="Main"
                className="main-img"
              />
              {product.hover_image_path && (
                <img
                  src={getImageUrl(product.hover_image_path)}
                  alt="Hover"
                  className="hover-img"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Slider layout for mobile */}
      <div className="uproduct-slider-container">
        <div
          className="uproduct-slider-wrapper"
          ref={sliderRef}
          onScroll={handleScroll}
        >
          {products.map((product, index) => (
            <div
              className={`uproduct-slide ${index === currentIndex ? 'active' : ''}`}
              key={product.id}
            >
              <div className="uproduct-image-wrapper">
                <img
                  src={getImageUrl(product.image_path)}
                  alt="Main"
                  className="main-img"
                />
                {product.hover_image_path && (
                  <img
                    src={getImageUrl(product.hover_image_path)}
                    alt="Hover"
                    className="hover-img"
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Dot navigation */}
        {products.length > 0 && (
          <div className="uproduct-dots">
            {products.map((_, index) => (
              <button
                key={index}
                className={`uproduct-dot ${currentIndex === index ? "active" : ""}`}
                onClick={() => handleDotClick(index)}
                aria-label={`Go to product ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UProductGallery;
