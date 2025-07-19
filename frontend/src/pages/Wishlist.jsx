// src/pages/Wishlist.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import ProductCard from '../components/ProductCard'; // ✅ Import the reusable ProductCard
import '../styles/wishlist.css'; // ✅ Assuming same styles apply

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    axios
      .get('http://localhost:8000/api/wishlist', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setWishlistItems(res.data))
      .catch((err) => {
        console.error('Error fetching wishlist:', err.response?.data || err.message);
        alert('Could not load wishlist. Please login again.');
      });
  }, [token, navigate]);

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <>
      <Navbar />
      <div className="wishlist-page" style={{ padding: '20px' }}>
        <h2>Your Wishlist</h2>
        <div className="wishlist-grid">
          {wishlistItems.length === 0 ? (
            <p>No items in your wishlist.</p>
          ) : (
            wishlistItems.map((item) => {
              const product = item.product;
              if (!product) return null;

              return (
                <ProductCard
                  key={product.id}
                  item={product}
                  onClick={() => handleProductClick(product)}
                />
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default Wishlist;
