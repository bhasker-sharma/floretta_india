import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/rfreshner.css';

const ProductCard = ({ item, onClick }) => {
  const navigate = useNavigate();
  const mainImage = item.image || item.image_path || '';
  const hoverImage =
    item.image_hover || item.image_2 || item.image_3 || item.image_4 || mainImage;

  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (loading || added) return;

    setLoading(true);

    try {
      // Step 1: Get CSRF token once per session (optional if already done)
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
        withCredentials: true,
      });

      // Step 2: Check login session
      const userCheck = await axios.get('http://localhost:8000/api/check-user', {
        withCredentials: true,
      });

      if (userCheck.data?.status !== 'ok' || !userCheck.data?.user) {
        alert('Please login to continue.');
        navigate('/admin-login');
        return;
      }

      // Step 3: Add to cart
      await axios.post(
        'http://localhost:8000/api/cart',
        {
          product_id: item.id,
          quantity: 1,
          type: item.flag || 'perfume',
        },
        {
          withCredentials: true,
        }
      );

      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error('Add to cart failed:', error);
      alert('Please login first.');
      navigate('/admin-login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="freshener-card"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <img
        loading="lazy"
        className="hover-fade-img"
        src={`http://localhost:8000/storage/${mainImage}`}
        alt={item.name}
        onError={(e) => {
          e.target.src = 'fallback.jpg';
        }}
        onMouseOver={(e) => {
          e.currentTarget.src = `http://localhost:8000/storage/${hoverImage}`;
        }}
        onMouseOut={(e) => {
          e.currentTarget.src = `http://localhost:8000/storage/${mainImage}`;
        }}
      />

      <h3>{item.name?.toUpperCase()}</h3>
      <p>{item.flag?.toUpperCase() || 'PRODUCT'}</p>

      {item.rating && (
        <p className="rating">
          ⭐ {Number(item.rating).toFixed(1)} | {item.reviews || item.reviews_count || 0} reviews
        </p>
      )}

      <p className="price">
        ₹{Number(item.price).toFixed(2)}
        {item.old_price && (
          <span className="old-price"> ₹{Number(item.old_price).toFixed(2)}</span>
        )}
      </p>

      <button
        className={`add-btn ${added ? 'added' : ''}`}
        onClick={handleAddToCart}
        disabled={added || loading}
      >
        {added ? '✔ ADDED TO CART' : loading ? 'ADDING...' : 'ADD TO CART'}
      </button>
    </div>
  );
};

export default ProductCard;
