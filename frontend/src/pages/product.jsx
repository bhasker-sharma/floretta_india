import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

import ProductCard from '../components/ProductCard';
import Navbar from '../components/navbar';
import Slider from '../components/slider';
import Footer from '../components/footer';
import Rfreshner from '../components/rfreshner';

// Static slider images (make sure these exist in /public/slider/)
const staticSliderImages = [
  '/slider/slide1.png',
  '/slider/slide2.png',
  '/slider/slide3.png',
  '/slider/slide4.png',
  '/slider/slide5.png',
];

const notes = ['All', 'Sweet', 'Woody', 'Floral', 'Citrus'];

const Product = () => {
  const [products, setProducts] = useState([]);
  const [selectedNote, setSelectedNote] = useState('all');
  const navigate = useNavigate();

  // Fetch products from API based on note
  const fetchProducts = (note) => {
   axios
  .get(`${API_ENDPOINTS.PRODUCTS}?note=${note}`) // ✅ only from perfumes
  .then((res) => {
    const filtered = res.data.filter(p => p.flag === 'perfume');
    setProducts(filtered);
  })
  .catch((err) => console.error('Error fetching products:', err));

  };

  // Initial fetch
  useEffect(() => {
    fetchProducts('all');
  }, []);

  // Note filter button click handler
  const handleFilter = (note) => {
    const lowerNote = note.toLowerCase();
    setSelectedNote(lowerNote);
    fetchProducts(lowerNote);
  };

  // Navigate to product detail
  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <>
      <Navbar />

      {/* Static slider images passed here */}
      <Slider images={staticSliderImages} />

      <div className="product-section">
        <h2 className="product-title">Shop By Perfume Notes</h2>

        <div className="note-buttons">
          {notes.map((note) => (
            <button
              key={note}
              className={`note-btn ${selectedNote === note.toLowerCase() ? 'active' : ''}`}
              onClick={() => handleFilter(note)}
            >
              {note.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              item={product}
              onClick={() => handleProductClick(product.id)}
            />
          ))}
        </div>
      </div>

      {/* Decorative Section */}
      <div className="diamond-line">
        <div className="diamond" />
        <div className="line" />
        <div className="diamond" />
      </div>

      <Rfreshner />

      <div className="why-floretta">
        <h2 className="why-heading">WHY FLORETTA PERFUMES ARE BETTER</h2>
        <div className="why-content">
          <div className="why-box">
            <p className="why-small">UPTO</p>
            <h1 className="why-big">30%</h1>
            <p className="why-label">PERFUME OIL CONCENTRATION</p>
          </div>

          <div className="why-box">
            <div className="clock-icon">
              <svg width="70" height="70" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#a23b45" strokeWidth="2" />
                <line x1="12" y1="12" x2="12" y2="7" stroke="#a23b45" strokeWidth="2" />
                <line x1="12" y1="12" x2="16" y2="14" stroke="#a23b45" strokeWidth="2" />
              </svg>
              <div className="clock-label">24 Hrs</div>
            </div>
            <p className="why-label">LONG LASTING</p>
          </div>

          <div className="why-box">
            {/* <img
              src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg"
              alt="Indian Flag"
              className="india-flags"
            /> */}
            <p className="why-label">MADE IN INDIA</p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Product;
