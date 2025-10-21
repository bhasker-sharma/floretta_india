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

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await axios.delete(`http://localhost:8000/api/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update the UI by removing the item from the list
      setWishlistItems(wishlistItems.filter(item => item.product_id !== productId));
    } catch (err) {
      console.error('Error removing from wishlist:', err.response?.data || err.message);
      alert('Could not remove item from wishlist.');
    }
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
                <div key={product.id} style={{ position: 'relative' }}>
                  <ProductCard
                    item={product}
                    onClick={() => handleProductClick(product)}
                  />
                  <button
                    className="wishlist-delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromWishlist(item.product_id);
                    }}
                    title="Remove from wishlist"
                  >
                    ✕
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default Wishlist;
