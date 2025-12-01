import { useState } from 'react';
import { Star } from 'lucide-react';
import PropTypes from 'prop-types';

const StarRating = ({
  rating,
  onRatingChange,
  readonly = false,
  size = 24,
  showNumber = true
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (!readonly) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          style={{
            cursor: readonly ? 'default' : 'pointer',
            transition: 'all 0.15s',
            fill: star <= displayRating ? '#fbbf24' : 'none',
            color: star <= displayRating ? '#fbbf24' : '#d1d5db',
            transform: !readonly && hoverRating === star ? 'scale(1.1)' : 'scale(1)',
          }}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
        />
      ))}
      {showNumber && (
        <span style={{
          marginLeft: '8px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151'
        }}>
          {rating > 0 ? rating.toFixed(1) : '0.0'}
        </span>
      )}
    </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
  onRatingChange: PropTypes.func,
  readonly: PropTypes.bool,
  size: PropTypes.number,
  showNumber: PropTypes.bool,
};

export default StarRating;
