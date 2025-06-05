import React from 'react';
import '../styles/rfreshner.css'; // Ensure this path is correct

const ProductCard = ({ item, onClick }) => {
  const mainImage = item.image || item.image_path || '';
  const hoverImage = item.image_hover || item.image_2 || item.image_3 || item.image_4 || mainImage;

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
      onError={(e) => { e.target.src = 'fallback.jpg'; }}
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
        className="add-btn"
        onClick={(e) => {
          e.stopPropagation(); // prevents triggering parent onClick
          console.log('Add to cart clicked'); // hook to cart function if needed
        }}
      >
        ADD TO CART
      </button>
    </div>
  );
};

export default ProductCard;
