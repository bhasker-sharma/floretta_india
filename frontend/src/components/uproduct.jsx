import React, { useEffect, useState } from 'react';
import '../styles/uproducts.css';

const UProductGallery = () => {
  const [products, setProducts] = useState([]);

useEffect(() => {
  fetch('http://localhost:8000/api/homepage')
    .then(res => res.json())
    .then(data => {
      console.log("API:", data);
      // Adjust this line based on actual shape
      setProducts(Array.isArray(data) ? data : data.uproducts || []);
    });
}, []);


  return (
    <div className="uproduct-gallery">
      <h2 className="section-heading">Our Products</h2>
      <div className="uproduct-grid">
        {products.map(product => (
          <div className="uproduct-card" key={product.id}>
            <div className="uproduct-image-wrapper">
              <img
                src={`http://localhost:8000/storage/${product.image_path}`}
                alt="Main"
                className="main-img"
              />
              {product.hover_image_path && (
                <img
                  src={`http://localhost:8000/storage/${product.hover_image_path}`}
                  alt="Hover"
                  className="hover-img"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UProductGallery;
