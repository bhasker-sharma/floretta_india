import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS, getImageUrl } from "../config/api";
import "../styles/rfreshner.css";

const ProductCard = ({ item, onClick }) => {
  const navigate = useNavigate();

  // Use all_images array if available (new products with multiple images)
  let mainImage = "";
  let hoverImage = "";
  let hasFullUrl = false;

  if (
    item.all_images &&
    Array.isArray(item.all_images) &&
    item.all_images.length > 0
  ) {
    // Use the new all_images array
    mainImage = item.all_images[0]?.url || "";
    hoverImage = item.all_images[1]?.url || item.all_images[0]?.url || "";
    hasFullUrl = true; // all_images URLs are already complete
  } else {
    // Fallback to old image fields for backwards compatibility
    mainImage = item.image || item.image_path || "";
    hoverImage =
      item.image_hover ||
      item.image_2 ||
      item.image_3 ||
      item.image_4 ||
      mainImage;
    hasFullUrl = false; // old fields need getImageUrl
  }

  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (loading || added) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return navigate("/login");
      }

      await axios.post(
        API_ENDPOINTS.CART,
        {
          product_id: item.id,
          quantity: 1,
          type: item.flag || "perfume",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error(
        "Add to cart failed:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLikeProduct = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      if (liked) {
        // ❌ Remove from wishlist
        await axios.delete(API_ENDPOINTS.WISHLIST_REMOVE(item.id), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLiked(false);
      } else {
        // ✅ Add to wishlist
        await axios.post(
          API_ENDPOINTS.WISHLIST_ADD,
          { product_id: item.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLiked(true);
      }
    } catch (error) {
      console.error("Wishlist toggle failed:", error);
    }
  };

  return (
    <div
      className="freshener-card"
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <img
        loading="lazy"
        className="hover-fade-img"
        src={hasFullUrl ? mainImage : getImageUrl(mainImage)}
        alt={item.name}
        onError={(e) => {
          e.target.src = "fallback.jpg";
        }}
        onMouseOver={(e) => {
          e.currentTarget.src = hasFullUrl
            ? hoverImage
            : getImageUrl(hoverImage);
        }}
        onMouseOut={(e) => {
          e.currentTarget.src = hasFullUrl ? mainImage : getImageUrl(mainImage);
        }}
      />

      <h3>{item.name?.toUpperCase()}</h3>
      <p>{item.flag?.toUpperCase() || "PRODUCT"}</p>

      {item.rating && (
        <p className="rating">
          ⭐ {Number(item.rating).toFixed(1)} |{" "}
          {item.reviews || item.reviews_count || 0} reviews
        </p>
      )}

      <p className="price">
        ₹{Number(item.price).toFixed(2)}
        {item.old_price && (
          <span className="old-price">
            {" "}
            ₹{Number(item.old_price).toFixed(2)}
          </span>
        )}
      </p>

      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <button
          className={`add-btn ${added ? "added" : ""}`}
          onClick={handleAddToCart}
          disabled={added || loading}
        >
          {added ? "✔ ADDED TO CART" : loading ? "ADDING..." : "ADD TO CART"}
        </button>

        <button
          className={`like-btn ${liked ? "liked" : ""}`}
          onClick={handleLikeProduct}
          title="Add to Wishlist"
        >
          {liked ? "❤️" : "🤍"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
