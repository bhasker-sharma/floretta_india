import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS, STORAGE_URL } from "../config/api";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import ReviewSection from "../components/ReviewSection";
import "../styles/productDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const imageRef = useRef();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [thumbnails, setThumbnails] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [zoomStyle, setZoomStyle] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showZoom, setShowZoom] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const baseURL = `${STORAGE_URL}/`;
  const isFreshner = location.pathname.startsWith("/freshner-mist");

  // Helper function to create URL-friendly slug from product name and ID
  const createSlug = (name, productId) => {
    if (!name) return productId;
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .substring(0, 50); // Limit length
    return `${slug}-${productId}`;
  };

  // Helper function to extract ID from slug
  const extractIdFromSlug = (slug) => {
    if (!slug) return null;
    const parts = slug.split('-');
    return parts[parts.length - 1];
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    const productId = extractIdFromSlug(id);
    const apiURL = isFreshner ? API_ENDPOINTS.FRESHNER_MIST_DETAIL(productId) : API_ENDPOINTS.PRODUCT_DETAIL(productId);

    axios
      .get(apiURL)
      .then((res) => {
        processProductData(res.data);
        checkIfInWishlist(res.data.id);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Sorry, item not found.");
        setLoading(false);
      });
  }, [id, location.pathname]);

  const checkIfInWishlist = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get(API_ENDPOINTS.WISHLIST, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const wishlistItems = response.data;
      const isInList = wishlistItems.some(
        (item) => item.product_id === productId
      );
      setIsInWishlist(isInList);
    } catch (error) {
      console.error("Error checking wishlist:", error);
    }
  };

  const processProductData = (data) => {
    setProduct(data);

    let allImages = [];

    // First, check if we have the new all_images array from API
    if (
      data.all_images &&
      Array.isArray(data.all_images) &&
      data.all_images.length > 0
    ) {
      // Use the new all_images array which has proper URLs
      allImages = data.all_images.map((img) => img.url);
    } else {
      // Fallback to old method for backwards compatibility
      let extraImages = [];

      try {
        if (typeof data.extra_images === "string") {
          extraImages = JSON.parse(data.extra_images);
        } else if (Array.isArray(data.extra_images)) {
          extraImages = data.extra_images;
        } else {
          extraImages = [];
        }
      } catch {
        extraImages = data.extra_images?.split(",").map((i) => i.trim()) || [];
      }

      const trimmedImage = data.image?.trim();
      const filteredExtras = extraImages.filter(
        (img) => img.trim() !== trimmedImage
      );
      allImages = trimmedImage
        ? [
            `${baseURL}${trimmedImage}`,
            ...filteredExtras.map((img) => `${baseURL}${img}`),
          ]
        : filteredExtras.map((img) => `${baseURL}${img}`);
    }

    setThumbnails(allImages);
    setSelectedImage(allImages[0] || "");

    if (!isFreshner && data.category) {
      fetchRelatedProducts(data.category, data.id);
    }

    setLoading(false);
  };

  const fetchRelatedProducts = (category, currentId) => {
    axios
      .get(`${API_ENDPOINTS.PRODUCTS}?category=${encodeURIComponent(category)}`)
      .then((res) => {
        const related = res.data.filter((p) => p.id !== currentId);
        setRelatedProducts(related.slice(0, 12));
      })
      .catch((err) => {
        console.error("Error fetching related products:", err);
      });
  };

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;

    const { left, top, width, height } =
      imageRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const backgroundPosX = (x / width) * 100;
    const backgroundPosY = (y / height) * 100;

    setZoomStyle({
      backgroundImage: `url(${selectedImage})`,
      backgroundSize: "250%",
      backgroundPosition: `${backgroundPosX}% ${backgroundPosY}%`,
    });
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= 10) {
      setQuantity(value);
    }
  };

  // Image slider navigation
  const handlePrevImage = () => {
    const newIndex = currentImageIndex === 0 ? thumbnails.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(newIndex);
    setSelectedImage(thumbnails[newIndex]);
  };

  const handleNextImage = () => {
    const newIndex = currentImageIndex === thumbnails.length - 1 ? 0 : currentImageIndex + 1;
    setCurrentImageIndex(newIndex);
    setSelectedImage(thumbnails[newIndex]);
  };

  const handleThumbnailClick = (img, index) => {
    setSelectedImage(img);
    setCurrentImageIndex(index);
  };

  // Touch handlers for swipe navigation
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentImageIndex < thumbnails.length - 1) {
      handleNextImage();
    }
    if (isRightSwipe && currentImageIndex > 0) {
      handlePrevImage();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to add items to cart");
      navigate("/login");
      return;
    }

    setAddingToCart(true);

    try {
      // Determine product type based on the flag or pathname
      let productType = "perfume"; // default
      if (product.flag) {
        productType = product.flag;
      } else if (isFreshner || location.pathname.includes("freshner")) {
        productType = "freshner";
      } else if (location.pathname.includes("face-mist")) {
        productType = "face_mist";
      }

      await axios.post(
        API_ENDPOINTS.CART_ADD,
        {
          product_id: product.id,
          quantity: quantity,
          type: productType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      alert("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        const errorMessage =
          error.response?.data?.message ||
          "Failed to add product to cart. Please try again.";
        alert(errorMessage);
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to purchase");
      navigate("/login");
      return;
    }

    setBuyingNow(true);

    try {
      // Determine product type based on the flag or pathname
      let productType = "perfume"; // default
      if (product.flag) {
        productType = product.flag;
      } else if (isFreshner || location.pathname.includes("freshner")) {
        productType = "freshner";
      } else if (location.pathname.includes("face-mist")) {
        productType = "face_mist";
      }

      // Add to cart first
      await axios.post(
        API_ENDPOINTS.CART_ADD,
        {
          product_id: product.id,
          quantity: quantity,
          type: productType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      // Navigate to cart page with auto-checkout parameter
      navigate("/cart?checkout=true");
    } catch (error) {
      console.error("Error processing buy now:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        const errorMessage =
          error.response?.data?.message ||
          "Failed to process request. Please try again.";
        alert(errorMessage);
      }
      setBuyingNow(false);
    }
  };

  const handleAddToWishlist = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to add items to your wishlist.");
      navigate("/login");
      return;
    }

    if (isInWishlist) {
      // Remove from wishlist
      try {
        setAddingToWishlist(true);
        await axios.delete(API_ENDPOINTS.WISHLIST_REMOVE(product.id), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsInWishlist(false);
        alert("Removed from wishlist!");
      } catch (error) {
        console.error("Error removing from wishlist:", error);
        alert(
          error.response?.data?.message ||
          "Failed to remove from wishlist. Please try again."
        );
      } finally {
        setAddingToWishlist(false);
      }
    } else {
      // Add to wishlist
      try {
        setAddingToWishlist(true);
        await axios.post(
          API_ENDPOINTS.WISHLIST_ADD,
          { product_id: product.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsInWishlist(true);
        alert("Added to wishlist!");
      } catch (error) {
        console.error("Error adding to wishlist:", error);
        alert(
          error.response?.data?.message ||
          "Failed to add to wishlist. Please try again."
        );
      } finally {
        setAddingToWishlist(false);
      }
    }
  };

  if (loading)
    return (
      <>
        <Navbar />
        <div className="amazon-loading">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
        <Footer />
      </>
    );

  if (error)
    return (
      <>
        <Navbar />
        <div className="amazon-error">
          <p>{error}</p>
          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
        <Footer />
      </>
    );

  if (!product) return null;

  const discount = product.old_price
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0;

  return (
    <>
      <Navbar />
      <div className="amazon-product-page">
        {/* Breadcrumb */}
        <div className="amazon-breadcrumb">
          <span onClick={() => navigate("/")}>Home</span>
          <span className="separator">›</span>
          <span onClick={() => navigate("/product")}>Products</span>
          <span className="separator">›</span>
          <span className="current">{product.name || "Product"}</span>
        </div>

        <div className="amazon-product-container">
          {/* Left Section - Image Gallery */}
          <div className="amazon-image-section">
            <div className="amazon-thumbnail-column">
              {thumbnails.map((img, i) => (
                <div
                  key={i}
                  className={`amazon-thumbnail-wrapper ${
                    currentImageIndex === i ? "active" : ""
                  }`}
                  onClick={() => handleThumbnailClick(img, i)}
                >
                  <img
                    src={img}
                    alt={`View ${i + 1}`}
                    className="amazon-thumbnail"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            <div className="amazon-main-image-section">
              {/* {thumbnails.length > 1 && (
                <button
                  className="amazon-image-nav amazon-image-nav-left"
                  onClick={handlePrevImage}
                  aria-label="Previous image"
                >
                  ‹
                </button>
              )} */}

              <div
                className="amazon-main-image-container"
                onMouseEnter={() => setShowZoom(true)}
                onMouseLeave={() => setShowZoom(false)}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="amazon-main-image"
                  ref={imageRef}
                  loading="lazy"
                />
                {showZoom && selectedImage && (
                  <div className="amazon-zoom-lens"></div>
                )}
              </div>

              {/* Dot Navigation for Mobile/Tablet */}
              {thumbnails.length > 1 && (
                <div className="amazon-image-dots">
                  {thumbnails.map((_, index) => (
                    <button
                      key={index}
                      className={`amazon-dot ${
                        currentImageIndex === index ? "active" : ""
                      }`}
                      onClick={() => handleThumbnailClick(thumbnails[index], index)}
                      aria-label={`Go to image ${index + 0.5}`}
                    />
                  ))}
                </div>
              )}

              {/* {thumbnails.length > 1 && (
                <button
                  className="amazon-image-nav amazon-image-nav-right"
                  onClick={handleNextImage}
                  aria-label="Next image"
                >
                  ›
                </button>
              )} */}

              {showZoom && selectedImage && (
                <div className="amazon-zoom-result" style={zoomStyle}></div>
              )}
            </div>
          </div>

          {/* Center Section - Product Info */}
          <div className="amazon-info-section">
            <h1 className="amazon-product-title">{product.name}</h1>

            <div className="amazon-subtitle">
              {product.description ||
                product.Discription ||
                "Premium Quality Product"}
            </div>

            <div className="amazon-rating-section">
              <div className="amazon-stars">
                <span className="star-rating">
                  {product.rating >= 0 ? '★'.repeat(Math.round(Number(product.rating))) + '☆'.repeat(5 - Math.round(Number(product.rating))) : '☆☆☆☆☆'}
                </span>
                <span className="rating-value">{product.rating ? Number(product.rating).toFixed(1) : '0.0'}</span>
              </div>
              <span className="amazon-rating-count">({product.reviews_count || 0} reviews)</span>
            </div>

            <hr className="amazon-divider" />

            <div className="amazon-price-section">
              {discount > 0 && (
                <div className="amazon-discount-badge">-{discount}%</div>
              )}
              <div className="amazon-price-row">
                <span className="amazon-currency">₹</span>
                <span className="amazon-price">{product.price}.00</span>
              </div>
              <div className="amazon-price-per-unit">
                (₹{Math.round(product.price / (product.volume || 8))} / 100ml)
              </div>
              {product.old_price && (
                <div className="amazon-old-price-row">
                  <span className="amazon-mrp-label">M.R.P.:</span>
                  <span className="amazon-old-price">₹{product.old_price}.00</span>
                </div>
              )}
              <div className="amazon-tax-info">Inclusive of all taxes</div>
            </div>

            <hr className="amazon-divider" />

            {/* Offers Section */}
            <div className="amazon-offers-section">
              <div className="amazon-offers-title">Save Extra: 2 offers available</div>
              <div className="amazon-offer-cards">
                <div className="amazon-offer-card">
                  <div className="amazon-offer-type">Cashback</div>
                  <div className="amazon-offer-text">
                    5% with ICICI Bank Amazon Pay Card (Prime only)
                  </div>
                </div>
                <div className="amazon-offer-card">
                  <div className="amazon-offer-type">Business Offer</div>
                  <div className="amazon-offer-text">
                    Save up to 28% with GST invoice
                  </div>
                </div>
              </div>
            </div>

            <hr className="amazon-divider" />

            {/* Mobile/Tablet Action Buttons - Only visible on small/medium screens */}
            <div className="amazon-mobile-action-buttons">
              <div className="amazon-quantity-selector">
                <label htmlFor="quantity-mobile">Quantity:</label>
                <select
                  id="quantity-mobile"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="amazon-quantity-dropdown"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              <div className="amazon-mobile-buttons-row">
                <button
                  className="amazon-add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                >
                  {addingToCart ? "Adding..." : "Add to Cart"}
                </button>

                <button
                  className="amazon-buy-now-btn"
                  onClick={handleBuyNow}
                  disabled={buyingNow}
                >
                  {buyingNow ? "Processing..." : "Buy Now"}
                </button>
              </div>
            </div>

            <hr className="amazon-divider" />

            {/* Product Details */}
            <div className="amazon-details-table">
              <table>
                <tbody>
                  {product.scent && (
                    <tr>
                      <td className="amazon-detail-label">Scent</td>
                      <td className="amazon-detail-value">{product.scent}</td>
                    </tr>
                  )}
                  {product.colour && (
                    <tr>
                      <td className="amazon-detail-label">Colour</td>
                      <td className="amazon-detail-value">{product.colour}</td>
                    </tr>
                  )}
                  {product.brand && (
                    <tr>
                      <td className="amazon-detail-label">Brand</td>
                      <td className="amazon-detail-value">{product.brand}</td>
                    </tr>
                  )}
                  {product.item_form && (
                    <tr>
                      <td className="amazon-detail-label">Item Form</td>
                      <td className="amazon-detail-value">{product.item_form}</td>
                    </tr>
                  )}
                  {product.power_source && (
                    <tr>
                      <td className="amazon-detail-label">Power Source</td>
                      <td className="amazon-detail-value">{product.power_source}</td>
                    </tr>
                  )}
                  {product.launch_date && (
                    <tr>
                      <td className="amazon-detail-label">Launch Date</td>
                      <td className="amazon-detail-value">{new Date(product.launch_date).toDateString()}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <hr className="amazon-divider" />

            {/* Ingredients */}
            {product.ingredients && (
              <div className="amazon-about-section">
                <h2 className="amazon-about-title">Ingredients</h2>
                <p className="amazon-about-text">{product.ingredients}</p>
              </div>
            )}

            {/* About Product */}
            {product.about_product && (
              <div className="amazon-about-section">
                <h2 className="amazon-about-title">About Product</h2>
                <p className="amazon-about-text">{product.about_product}</p>
              </div>
            )}
          </div>

          {/* Right Section - Buy Box */}
          <div className="amazon-buy-box">
            <div className="amazon-buy-price">
              ₹{product.price}.00 (₹{Math.round(product.price / (product.volume || 8))}.00 / 100ml)
            </div>

            <div className="amazon-stock-status">In stock</div>

            <div className="amazon-sold-by">
              Ships from <strong>FLORETTA INDIA</strong>
              <br />
              Sold by <strong>FLORETTA INDIA</strong>
            </div>

            <div className="amazon-secure-transaction">
              <i className="fas fa-lock"></i> Secure transaction
            </div>

            <div className="amazon-quantity-selector">
              <label htmlFor="quantity">Quantity:</label>
              <select
                id="quantity"
                value={quantity}
                onChange={handleQuantityChange}
                className="amazon-quantity-dropdown"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="amazon-add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={addingToCart}
            >
              {addingToCart ? "Adding..." : "Add to Cart"}
            </button>

            <button
              className="amazon-buy-now-btn"
              onClick={handleBuyNow}
              disabled={buyingNow}
            >
              {buyingNow ? "Processing..." : "Buy Now"}
            </button>

            <hr className="amazon-divider-thin" />

            <div className="amazon-add-to-list">
              <button
                className="amazon-list-btn"
                onClick={handleAddToWishlist}
                disabled={addingToWishlist}
              >
                <i className={isInWishlist ? "fas fa-heart" : "far fa-heart"}></i>{" "}
                {addingToWishlist
                  ? "Processing..."
                  : isInWishlist
                  ? "Remove from Wish List"
                  : "Add to Wish List"}
              </button>
            </div>
          </div>
        </div>

        {/* Review Section */}
        <div className="amazon-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <ReviewSection productId={id} />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="amazon-related-section">
            <h2 className="amazon-related-title">
              Products related to this item
            </h2>
            <div className="amazon-related-grid">
              {relatedProducts.map((p) => (
                <div
                  key={p.id}
                  className="amazon-related-card"
                  onClick={() => navigate(`/product/${createSlug(p.name, p.id)}`)}
                >
                  <img
                    src={`${baseURL}${p.image}`}
                    alt={p.name}
                    className="amazon-related-image"
                    loading="lazy"
                  />
                  <div className="amazon-related-info">
                    <div className="amazon-related-name">{p.name}</div>
                    <div className="amazon-related-rating">
                      <span className="amazon-related-stars">★★★★☆</span>
                      <span className="amazon-related-count">(1,234)</span>
                    </div>
                    <div className="amazon-related-price">₹{p.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
