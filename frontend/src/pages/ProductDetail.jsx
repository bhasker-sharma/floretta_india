import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS, STORAGE_URL } from '../config/api';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import '../styles/products.css';

const ProductDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const imageRef = useRef();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [thumbnails, setThumbnails] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [zoomStyle, setZoomStyle] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showZoom, setShowZoom] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);

  const baseURL = `${STORAGE_URL}/`;
  const isFreshner = location.pathname.startsWith('/freshner-mist');

  useEffect(() => {
    setLoading(true);
    setError(null);

    const apiURL = API_ENDPOINTS.PRODUCT_DETAIL(id);

    axios.get(apiURL)
      .then(res => {
        processProductData(res.data);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setError("Sorry, item not found.");
        setLoading(false);
      });
  }, [id, location.pathname]);

  const processProductData = (data) => {
    setProduct(data);

    let extraImages = [];

    try {
      if (typeof data.extra_images === 'string') {
        extraImages = JSON.parse(data.extra_images);
      } else if (Array.isArray(data.extra_images)) {
        extraImages = data.extra_images;
      } else {
        extraImages = [];
      }
    } catch {
      extraImages = data.extra_images?.split(',').map(i => i.trim()) || [];
    }

    const trimmedImage = data.image?.trim();
    const filteredExtras = extraImages.filter(img => img.trim() !== trimmedImage);
    const allImages = trimmedImage
      ? [`${baseURL}${trimmedImage}`, ...filteredExtras.map(img => `${baseURL}${img}`)]
      : filteredExtras.map(img => `${baseURL}${img}`);

    setThumbnails(allImages);
    setSelectedImage(allImages[0] || '');

    if (!isFreshner && data.category) {
      fetchRelatedProducts(data.category, data.id);
    }

    setLoading(false);
  };

  const fetchRelatedProducts = (category, currentId) => {
    axios.get(`${API_ENDPOINTS.PRODUCTS}?category=${encodeURIComponent(category)}`)
      .then(res => {
        const related = res.data.filter(p => p.id !== currentId);
        setRelatedProducts(related);
      })
      .catch(err => {
        console.error("Error fetching related products:", err);
      });
  };

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;

    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const backgroundPosX = (x / width) * 100;
    const backgroundPosY = (y / height) * 100;

    setZoomStyle({
      backgroundImage: `url(${selectedImage})`,
      backgroundSize: '200%',
      backgroundPosition: `${backgroundPosX}% ${backgroundPosY}%`
    });
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= 10) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please login to add items to cart');
      navigate('/login');
      return;
    }

    setAddingToCart(true);

    try {
      // Determine product type based on the flag or pathname
      let productType = 'perfume'; // default
      if (product.flag) {
        productType = product.flag;
      } else if (isFreshner || location.pathname.includes('freshner')) {
        productType = 'freshner';
      } else if (location.pathname.includes('face-mist')) {
        productType = 'face_mist';
      }

      await axios.post(
        API_ENDPOINTS.CART_ADD,
        {
          product_id: product.id,
          quantity: quantity,
          type: productType
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          }
        }
      );

      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        const errorMessage = error.response?.data?.message || 'Failed to add product to cart. Please try again.';
        alert(errorMessage);
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please login to purchase');
      navigate('/login');
      return;
    }

    setBuyingNow(true);

    try {
      // Determine product type based on the flag or pathname
      let productType = 'perfume'; // default
      if (product.flag) {
        productType = product.flag;
      } else if (isFreshner || location.pathname.includes('freshner')) {
        productType = 'freshner';
      } else if (location.pathname.includes('face-mist')) {
        productType = 'face_mist';
      }

      // Add to cart first
      await axios.post(
        API_ENDPOINTS.CART_ADD,
        {
          product_id: product.id,
          quantity: quantity,
          type: productType
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          }
        }
      );

      // Navigate to cart page with auto-checkout parameter
      navigate('/cart?checkout=true');
    } catch (error) {
      console.error('Error processing buy now:', error);
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        const errorMessage = error.response?.data?.message || 'Failed to process request. Please try again.';
        alert(errorMessage);
      }
      setBuyingNow(false);
    }
  };

  if (loading) return <p className="loading">Loading item details...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!product) return null;

  return (
    <>
      <Navbar />
      <div className="product-detail-wrapper">
        <div className="thumbnail-column">
          {thumbnails.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Thumbnail ${i + 1}`}
              className={`thumbnail ${selectedImage === img ? 'active' : ''}`}
              onClick={() => setSelectedImage(img)}
              loading="lazy"
            />
          ))}
        </div>

        <div
          className="main-image-column"
          onMouseEnter={() => setShowZoom(true)}
          onMouseLeave={() => setShowZoom(false)}
          onMouseMove={handleMouseMove}
        >
          {selectedImage ? (
            <img
              src={selectedImage}
              alt={product.name}
              className="main-image"
              ref={imageRef}
              loading="lazy"
            />
          ) : (
            <div className="no-image-placeholder">No image available</div>
          )}
          {showZoom && selectedImage && (
            <div className="zoom-result" style={zoomStyle} />
          )}
        </div>

        <div className="product-info">
          <h2>{product.name}</h2>
          <p className="product-description">
            {product.description || product.Discription || 'No description available.'}
          </p>

            <div class="rating-review-row">
              <span class="rating">★ 4.5</span>
              <span class="review-count">(120 reviews)</span>
            </div>


          <div className="price-row">
            <p className="discount">-42%</p>
            <p className="final-price">₹{product.price}</p>
            <p className="unit-price">(₹70 / 100ml)</p>
          </div>

          {product.old_price && <p className="old-price">M.R.P.: ₹{product.old_price}</p>}
          <p className="tax-note">Inclusive of all taxes</p>

          <div className="offer-box">
            <p><strong>Save Extra:</strong> 2 offers available</p>
            <p><strong>Cashback:</strong> 5% with ICICI Bank Amazon Pay Card (Prime only)</p>
            <p><strong>Business Offer:</strong> Save up to 28% with GST invoice</p>
          </div>

          <hr className="section-line" />

          <p><strong>Scent:</strong> {product.scent || 'N/A'}</p>
          <p><strong>Colour:</strong> {product.colour || 'N/A'}</p>
          <p><strong>Brand:</strong> {product.brand || 'N/A'}</p>
          <p><strong>Item Form:</strong> {product.item_form || 'N/A'}</p>
          <p><strong>Power Source:</strong> {product.power_source || 'N/A'}</p>
          <p><strong>Launch Date:</strong> {product.launch_date ? new Date(product.launch_date).toDateString() : 'N/A'}</p>
          <p><strong>About Product:</strong> {product.about_product || 'N/A'}</p>

          {/* <div className="button-row">
            <button className="buy-now-btn">BUY NOW</button>
            <button className="buy-now-btn">ADD TO CART</button>
          </div> */}
        </div>
         <div className="right-box">
          <p className="final-price-box">₹{product.price}.00 <span className="unit-price-box">(₹70.00 / 100ml)</span></p>
          <p className="green-text">In stock</p>
          <p className="small-text">Ships from <strong>FLORETTA INDIA</strong></p>
          <p className="small-text">Sold by <strong>FLORETTA INDIA</strong></p>
          <p className="small-text"><a href="#">Secure transaction</a></p>

          <label htmlFor="quantity-select" className="small-text">Quantity:</label>
         <input
            type="number"
            id="quantity-select"
            className="qty-select"
            min={1}
            max={10}
            value={quantity}
            onChange={handleQuantityChange}
          />


          <button
            className="buy-btn"
            onClick={handleAddToCart}
            disabled={addingToCart}
          >
            {addingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
          <button
            className="buy-btn"
            onClick={handleBuyNow}
            disabled={buyingNow}
          >
            {buyingNow ? 'Processing...' : 'Buy Now'}
          </button>
        </div>
      </div>
      

      {relatedProducts.length > 0 && (
        <div className="related-products-section">
          <h3>Related Products</h3>
          <div className="related-products-grid">
            {relatedProducts.map(p => (
              <div key={p.id} className="related-product-card">
                <img
                  src={`${baseURL}${p.image}`}
                  alt={p.name}
                  className="related-product-image"
                  loading="lazy"
                />
                <p>{p.name}</p>
                <p>₹{p.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default ProductDetail;
