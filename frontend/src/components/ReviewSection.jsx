import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';
import AddReview from './AddReview';
import { API_ENDPOINTS } from '../config/api';
import { Star, Edit2, Trash2, CheckCircle, MoreVertical } from 'lucide-react';
import PropTypes from 'prop-types';

const ReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [showAddReview, setShowAddReview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ratingBreakdown, setRatingBreakdown] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  });
  const [openMenuId, setOpenMenuId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    fetchReviews();
    if (token) {
      fetchUserReview();
    }
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setIsLoadingReviews(true);
      const response = await axios.get(API_ENDPOINTS.PRODUCT_REVIEWS(productId));

      if (response.data.success) {
        setReviews(response.data.reviews);
        setAverageRating(response.data.average_rating);
        setTotalReviews(response.data.total_reviews);

        // Calculate rating breakdown
        const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        response.data.reviews.forEach(review => {
          breakdown[review.rating]++;
        });
        setRatingBreakdown(breakdown);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const fetchUserReview = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.USER_REVIEW(productId), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success && response.data.review) {
        setUserReview(response.data.review);
      }
    } catch (err) {
      console.error('Error fetching user review:', err);
    }
  };

  const handleSubmitReview = async (reviewData) => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please login to submit a review');
      navigate('/login');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const response = await axios.post(
        API_ENDPOINTS.ADD_REVIEW,
        {
          product_id: productId,
          rating: reviewData.rating,
          review: reviewData.review,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        await fetchReviews();
        await fetchUserReview();
        setShowAddReview(false);
        alert(response.data.message);
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.response?.data?.message || 'Failed to submit review');
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete your review?')) {
      return;
    }

    const token = localStorage.getItem('token');

    try {
      setIsLoading(true);
      const response = await axios.delete(
        API_ENDPOINTS.DELETE_REVIEW(reviewId),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        await fetchReviews();
        setUserReview(null);
        setShowAddReview(false);
        setOpenMenuId(null);
        alert('Review deleted successfully');
      }
    } catch (err) {
      console.error('Error deleting review:', err);
      alert(err.response?.data?.message || 'Failed to delete review');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditReview = () => {
    setShowAddReview(true);
    setOpenMenuId(null);
  };

  const toggleMenu = (reviewId) => {
    setOpenMenuId(openMenuId === reviewId ? null : reviewId);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (openMenuId) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openMenuId]);

  const calculatePercentage = (count) => {
    return totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
  };

  return (
    <div className="amazon-reviews-container" style={{ marginTop: '40px', marginBottom: '40px' }}>
      <style>{`
        .amazon-reviews-container {
          font-family: 'Amazon Ember', Arial, sans-serif;
          max-width: 100%;
        }

        .amazon-reviews-header {
          border-bottom: 1px solid #e7e7e7;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }

        .amazon-reviews-title {
          font-size: 24px;
          font-weight: 700;
          color: #0f1111;
          margin-bottom: 16px;
        }

        .amazon-reviews-summary {
          display: flex;
          gap: 40px;
          flex-wrap: wrap;
          align-items: flex-start;
        }

        .amazon-average-rating {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 180px;
        }

        .amazon-rating-number {
          font-size: 56px;
          font-weight: 400;
          color: #0f1111;
          line-height: 1;
          margin-bottom: 8px;
        }

        .amazon-rating-stars-large {
          margin-bottom: 8px;
        }

        .amazon-rating-total {
          font-size: 14px;
          color: #565959;
        }

        .amazon-rating-breakdown {
          flex: 1;
          min-width: 300px;
          max-width: 500px;
        }

        .amazon-rating-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 6px;
          cursor: pointer;
        }

        .amazon-rating-row:hover .amazon-rating-label {
          color: #c45500;
          text-decoration: underline;
        }

        .amazon-rating-label {
          font-size: 14px;
          color: #007185;
          width: 50px;
          text-align: right;
        }

        .amazon-rating-bar {
          flex: 1;
          height: 20px;
          background-color: #f0f0f0;
          border-radius: 4px;
          overflow: hidden;
          position: relative;
        }

        .amazon-rating-bar-fill {
          height: 100%;
          background-color: #ffa724;
          transition: width 0.3s ease;
        }

        .amazon-rating-percentage {
          font-size: 14px;
          color: #007185;
          width: 40px;
          text-align: right;
        }

        .amazon-review-button-container {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid #e7e7e7;
        }

        .amazon-review-button {
          background-color: #ffd814;
          border: 1px solid #fcd200;
          border-radius: 8px;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
          color: #0f1111;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .amazon-review-button:hover {
          background-color: #f7ca00;
        }

        .amazon-review-button-secondary {
          background-color: #ffffff;
          border: 1px solid #d5d9d9;
          box-shadow: 0 2px 5px 0 rgba(213,217,217,.5);
        }

        .amazon-review-button-secondary:hover {
          background-color: #f7f8f8;
        }

        .amazon-user-review-highlight {
          background-color: #f7f9fa;
          border: 2px solid #007185;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
        }

        .amazon-user-review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .amazon-user-review-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f1111;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .amazon-user-review-actions {
          display: flex;
          gap: 8px;
        }

        .amazon-icon-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          color: #007185;
          transition: background-color 0.2s;
        }

        .amazon-icon-button:hover {
          background-color: #e3e6e6;
        }

        .amazon-reviews-list-title {
          font-size: 18px;
          font-weight: 700;
          color: #0f1111;
          margin-bottom: 16px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #e7e7e7;
        }

        .amazon-review-card {
          padding: 16px 0;
          border-bottom: 1px solid #e7e7e7;
          position: relative;
        }

        .amazon-review-card:last-child {
          border-bottom: none;
        }

        .review-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .review-menu-container {
          position: relative;
        }

        .review-menu-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          color: #565959;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        }

        .review-menu-button:hover {
          background-color: #e3e6e6;
        }

        .review-menu-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border: 1px solid #d5d9d9;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          min-width: 160px;
          margin-top: 4px;
        }

        .review-menu-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          cursor: pointer;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-size: 14px;
          color: #0f1111;
          transition: background-color 0.2s;
        }

        .review-menu-item:first-child {
          border-radius: 8px 8px 0 0;
        }

        .review-menu-item:last-child {
          border-radius: 0 0 8px 8px;
        }

        .review-menu-item:hover {
          background-color: #f7f8f8;
        }

        .review-menu-item.delete {
          color: #c7511f;
        }

        .review-menu-item.delete:hover {
          background-color: #fff4f1;
        }

        .amazon-reviewer-info {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .amazon-reviewer-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 14px;
        }

        .amazon-reviewer-name {
          font-size: 14px;
          font-weight: 700;
          color: #0f1111;
        }

        .amazon-review-rating-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .amazon-review-title {
          font-size: 14px;
          font-weight: 700;
          color: #0f1111;
          margin-bottom: 4px;
        }

        .amazon-review-date {
          font-size: 13px;
          color: #565959;
          margin-bottom: 8px;
        }

        .amazon-review-text {
          font-size: 14px;
          line-height: 1.5;
          color: #0f1111;
          margin-bottom: 12px;
        }

        .amazon-verified-purchase {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #c45500;
          font-weight: 600;
        }

        .amazon-no-reviews {
          text-align: center;
          padding: 60px 20px;
          background-color: #f7f9fa;
          border-radius: 8px;
          margin-top: 20px;
        }

        .amazon-no-reviews-icon {
          margin-bottom: 16px;
          color: #d5d9d9;
        }

        .amazon-no-reviews-text {
          font-size: 16px;
          color: #565959;
          margin-bottom: 20px;
        }

        @media (max-width: 768px) {
          .amazon-reviews-summary {
            flex-direction: column;
            gap: 24px;
          }

          .amazon-rating-breakdown {
            width: 100%;
          }

          .amazon-rating-number {
            font-size: 48px;
          }
        }
      `}</style>

      <div className="amazon-reviews-header">
        <h2 className="amazon-reviews-title">Customer reviews</h2>

        <div className="amazon-reviews-summary">
          {/* Average Rating */}
          <div className="amazon-average-rating">
            <div className="amazon-rating-number">{averageRating.toFixed(1)}</div>
            <div className="amazon-rating-stars-large">
              <StarRating rating={averageRating} readonly={true} size={24} showNumber={false} />
            </div>
            <div className="amazon-rating-total">{totalReviews} global ratings</div>
          </div>

          {/* Rating Breakdown */}
          <div className="amazon-rating-breakdown">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="amazon-rating-row">
                <div className="amazon-rating-label">{star} star</div>
                <div className="amazon-rating-bar">
                  <div
                    className="amazon-rating-bar-fill"
                    style={{ width: `${calculatePercentage(ratingBreakdown[star])}%` }}
                  />
                </div>
                <div className="amazon-rating-percentage">
                  {calculatePercentage(ratingBreakdown[star])}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Review Button */}
        <div className="amazon-review-button-container">
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: '#0f1111' }}>
            Review this product
          </h3>
          <p style={{ fontSize: '14px', color: '#565959', marginBottom: '12px' }}>
            Share your thoughts with other customers
          </p>
          {isAuthenticated && !userReview && !showAddReview && (
            <button
              onClick={() => setShowAddReview(true)}
              className="amazon-review-button"
            >
              Write a customer review
            </button>
          )}
          {!isAuthenticated && (
            <button
              onClick={() => navigate('/login')}
              className="amazon-review-button"
            >
              Sign in to write a review
            </button>
          )}
        </div>
      </div>

      {/* Add/Edit Review Form */}
      {showAddReview && isAuthenticated && (
        <div style={{ marginBottom: '24px' }}>
          <AddReview
            onSubmit={handleSubmitReview}
            existingReview={userReview}
            onCancel={() => setShowAddReview(false)}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Reviews List */}
      <div>
        <h3 className="amazon-reviews-list-title">Top reviews</h3>

        {isLoadingReviews ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#565959' }}>Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="amazon-no-reviews">
            <div className="amazon-no-reviews-icon">
              <Star size={64} />
            </div>
            <p className="amazon-no-reviews-text">
              No reviews yet. Be the first to review this product!
            </p>
            {isAuthenticated && !showAddReview && (
              <button
                onClick={() => setShowAddReview(true)}
                className="amazon-review-button"
              >
                Write the first review
              </button>
            )}
          </div>
        ) : (
          <div>
            {reviews.map((review) => {
              const isUserReview = userReview && review.id === userReview.id;
              return (
                <div key={review.id} className="amazon-review-card">
                  <div className="review-header-row">
                    <div className="amazon-reviewer-info">
                      <div className="amazon-reviewer-avatar">
                        {review.user_name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="amazon-reviewer-name">
                        {review.user_name}
                        {isUserReview && (
                          <span style={{ marginLeft: '8px', fontSize: '12px', color: '#067d62', fontWeight: '600' }}>
                            (My Review)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 3-dot menu for user's own review */}
                    {isUserReview && (
                      <div className="review-menu-container">
                        <button
                          className="review-menu-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMenu(review.id);
                          }}
                          aria-label="Review options"
                        >
                          <MoreVertical size={20} />
                        </button>

                        {openMenuId === review.id && (
                          <div className="review-menu-dropdown">
                            <button
                              className="review-menu-item"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditReview();
                              }}
                            >
                              <Edit2 size={16} />
                              Edit review
                            </button>
                            <button
                              className="review-menu-item delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteReview(review.id);
                              }}
                              disabled={isLoading}
                            >
                              <Trash2 size={16} />
                              Delete review
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="amazon-review-rating-row">
                    <StarRating rating={review.rating} readonly={true} size={18} showNumber={false} />
                  </div>

                  <div className="amazon-review-date">
                    Reviewed on {review.created_at}
                  </div>

                  {review.review && (
                    <div className="amazon-review-text">{review.review}</div>
                  )}

                  {review.verified_purchase && (
                    <div className="amazon-verified-purchase">
                      <CheckCircle size={14} />
                      Verified Purchase
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

ReviewSection.propTypes = {
  productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default ReviewSection;
