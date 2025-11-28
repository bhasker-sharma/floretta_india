import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS, getImageUrl } from '../config/api';

import Navbar from '../components/navbar';
import Slider from '../components/slider';
import Testimonials from '../components/testimonials';
import Uproducts from '../components/uproduct';
import Footer from '../components/footer';
import ProductCard from '../components/ProductCard';

import '../styles/home.css';

const Home = () => {
  const [homeProducts, setHomeProducts] = useState([]);
  const [homeProductError, setHomeProductError] = useState(null);
  const [featuredProduct, setFeaturedProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);

  const navigate = useNavigate();

  const handleViewAllClick = () => {
    navigate('/product');
  };

  useEffect(() => {
    // Load bestseller products from homepage API
    fetch(API_ENDPOINTS.HOMEPAGE)
      .then((res) => res.json())
      .then((data) => {
        // Use bestsellers from the API response
        const bestsellers = data.bestsellers || [];

        // First product (index 0) = Featured product only
        if (bestsellers.length > 0) {
          setFeaturedProduct(bestsellers[0]);
          // Use all_images if available, otherwise fall back to image
          const firstImage = bestsellers[0].all_images?.[0]?.url || bestsellers[0].image;
          setSelectedImage(firstImage);
        }

        // Products 2-5 (indices 1-4) = Bestseller grid only
        setHomeProducts(bestsellers.slice(1, 5)); // Skip first, show next 4
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setHomeProductError('Unable to load products. Please try again later.');
      });
  }, []);

  const thumbnails = [featuredProduct?.image, ...(featuredProduct?.extra_images || []).slice(0, 3)].filter(Boolean);

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      await axios.post(API_ENDPOINTS.CART, {
        product_id: featuredProduct.id,
        quantity: 1,
        type: featuredProduct.flag || 'perfume'
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        }
      });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        alert('Please login to add items to cart');
        navigate('/login');
      } else {
        alert('Failed to add to cart');
      }
    }
  };

  const handleShopNow = () => {
    if (featuredProduct) {
      navigate(`/product/${featuredProduct.id}`);
    }
  };
  

  return (
    <>
      <Navbar />
      <Slider fetchUrl={API_ENDPOINTS.SLIDERS_BY_PAGE('home')} interval={4000} />

      {/* === HOME PRODUCTS === */}
      <div className="homep-product-list">
        <h2 className="homep-section-title">Best Sellers</h2>
        {homeProductError && <p className="homep-error">{homeProductError}</p>}

        <div className="product-grid">
          {homeProducts.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/product/${item.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <ProductCard item={item} />
            </div>
          ))}
        </div>

        <button onClick={handleViewAllClick} className="homep-view-all-button">
          View All
        </button>
      </div>

      {/* === FEATURED PRODUCT === */}
      <div className="pdp-product-display-container">
        {!featuredProduct ? (
          <p className="loading-text">Loading Featured Product...</p>
        ) : (
          <div className="pdp-product-card">
            <div className="pdp-product-images">
              <img
                className="pdp-product-main-image"
                src={getImageUrl(selectedImage)}
                alt="Main"
              />
              <div className="pdp-product-thumbnails">
                {thumbnails.map((img, idx) => (
                  <img
                    key={idx}
                    className={`pdp-thumbnail ${img === selectedImage ? 'active' : ''}`}
                    src={getImageUrl(img)}
                    alt={`Thumb ${idx + 1}`}
                    onClick={() => setSelectedImage(img)}
                    onError={(e) => (e.target.src = '/fallback.jpg')}
                  />
                ))}
              </div>
            </div>

            <div className="pdp-info-section">
              <p className="pdp-product-brand">{featuredProduct.brand}</p>
              <h2 className="pdp-product-name">{featuredProduct.name}</h2>
              <div className="pdp-product-save">
                SAVE RS. {(featuredProduct.original_price - featuredProduct.price).toFixed(2)}
              </div>
              <div className="pdp-product-prices">
                <span className="pdp-product-price">RS ₹{featuredProduct.price}</span>
                <span className="pdp-product-old-price">₹{featuredProduct.original_price}</span>
              </div>
              <div className="pdp-product-size">
                <label>SIZE</label>
                <div className="pdp-size-box">{featuredProduct.volume_ml}ml</div>
              </div>
              <div className="pdp-button-row">
                <button
                  className="pdp-add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={addedToCart}
                >
                  {addedToCart ? 'ADDED TO CART' : 'ADD TO CART'}
                </button>
                <button className="pdp-shop-now-btn" onClick={handleShopNow}>
                  SHOP NOW
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Testimonials />
      <Footer />
    </>
  );
};

export default Home;
