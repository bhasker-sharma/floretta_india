import React, { useEffect, useState } from "react";
import { API_ENDPOINTS, getImageUrl } from "../config/api";
import "../styles/uproducts.css";

const UProductGallery = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(API_ENDPOINTS.HOMEPAGE)
      .then((res) => res.json())
      .then((data) => {
        // Adjust this line based on actual shape
        setProducts(Array.isArray(data) ? data : data.uproducts || []);
      });
  }, []);

  return (
    <div className="uproduct-gallery">
      <h2 className="section-heading">Our Products</h2>
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
    </div>
  );
};

export default UProductGallery;
