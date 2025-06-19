import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import Slider from '../components/slider';
import Testimonials from '../components/testimonials';
import Uproducts from '../components/uproduct';
import Footer from '../components/footer';
import ProductCard from '../components/ProductCard';
import '../styles/home.css';

const Home = () => {
  const [cocoProduct, setCocoProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [homeProducts, setHomeProducts] = useState([]);
  const [homeProductError, setHomeProductError] = useState(null);

  const navigate = useNavigate();

  const handleViewAllClick = () => {
    navigate('/product');
  };

  useEffect(() => {
    fetch('http://localhost:8000/api/homepage')
      .then((res) => res.json())
      .then((data) => {
        const item = data.coco || data[0];
        if (item) {
          setCocoProduct(item);
          setSelectedImage(item.main_image);
        }

        setHomeProducts(Array.isArray(data.homeproducts) ? data.homeproducts : []);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setHomeProductError('Unable to load products. Please try again later.');
      });
  }, []);

  const cocoThumbnails = [
    cocoProduct?.main_image,
    cocoProduct?.image_2,
    cocoProduct?.image_3,
    cocoProduct?.image_4,
  ].filter(Boolean);

  return (
    <>
      <Navbar />
      <Slider fetchUrl="http://localhost:8000/api/homepage" interval={4000} />


      {/* === HOME PRODUCTS === */}
      <div className="homep-product-list">
        <h2 className="homep-section-title">Best Sellers</h2>
        {homeProductError && <p className="homep-error">{homeProductError}</p>}

        <div className="product-grid">
          {homeProducts
            .filter((item) => item && (item.image || item.image_path))
            .map((item) => (
              <div key={item.id} onClick={() => navigate(`/product/${item.id}`)} style={{ cursor: 'pointer' }}>
                <ProductCard item={item} />
              </div>
            ))}
        </div>

        <button onClick={handleViewAllClick} className="homep-view-all-button">
          View All
        </button>
      </div>

      {/* === COCO PRODUCT === */}
      <div className="pdp-product-display-container">
        {!cocoProduct ? (
          <p className="loading-text">Loading Coco Fudge...</p>
        ) : (
          <div className="pdp-product-card">
            <div className="pdp-product-images">
              <img
                className="pdp-product-main-image"
                src={`http://localhost:8000/storage/${selectedImage}`}
                alt="Main Product"
              />
              <div className="pdp-product-thumbnails">
                {cocoThumbnails.map((img, idx) => (
                  <img
                    key={idx}
                    className={`pdp-thumbnail ${img === selectedImage ? 'active' : ''}`}
                    src={`http://localhost:8000/storage/${img}`}
                    alt={`Thumbnail ${idx + 1}`}
                    onClick={() => setSelectedImage(img)}
                  />
                ))}
              </div>
            </div>

            <div className="pdp-info-section">
              <p className="pdp-product-brand">{cocoProduct.brand}</p>
              <h2 className="pdp-product-name">{cocoProduct.name}</h2>
              <div className="pdp-product-save">SAVE RS. {cocoProduct.savings}</div>
              <div className="pdp-product-prices">
                <span className="pdp-product-price">RS ₹{cocoProduct.price}</span>
                <span className="pdp-product-old-price">₹{cocoProduct.old_price}</span>
              </div>
              <div className="pdp-product-size">
                <label>SIZE</label>
                <div className="pdp-size-box">{cocoProduct.size}</div>
              </div>
              <button className="pdp-add-to-cart-btn">ADD TO CART</button>
              <button className="pdp-shop-now-btn">SHOP NOW</button>
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
