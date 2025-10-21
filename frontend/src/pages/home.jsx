import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from '../components/navbar';
import Slider from '../components/slider';
import Testimonials from '../components/testimonials';
import Uproducts from '../components/uproduct';
import Footer from '../components/footer';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

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
    // Load home products
    fetch('http://localhost:8000/api/products?note=all')
      .then((res) => res.json())
      .then((data) => {
        const perfumes = data.filter((p) => p.flag === 'perfume');
        setHomeProducts(perfumes.slice(0, 4)); // best sellers
        if (perfumes.length > 0) {
          setFeaturedProduct(perfumes[0]);
          setSelectedImage(perfumes[0].image);
        }
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
      await axios.post('http://localhost:8000/api/cart', {
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
      <Slider fetchUrl="http://localhost:8000/api/homepage" interval={4000} />

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
                src={`http://localhost:8000/storage/${selectedImage}`}
                alt="Main"
              />
              <div className="pdp-product-thumbnails">
                {thumbnails.map((img, idx) => (
                  <img
                    key={idx}
                    className={`pdp-thumbnail ${img === selectedImage ? 'active' : ''}`}
                    src={`http://localhost:8000/storage/${img}`}
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
        )}
      </div>

      <Uproducts />
      <Testimonials />
      <Footer />
    </>
  );
};

export default Home;
