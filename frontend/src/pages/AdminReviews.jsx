import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS, STORAGE_URL } from '../config/api';
import { Star, Trash2, Search, TrendingUp, BarChart3, Award } from 'lucide-react';

const AdminReviews = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [togglingFeatured, setTogglingFeatured] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [perPage, setPerPage] = useState(20);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchReviews();
    fetchStats();
  }, [currentPage, perPage, searchTerm]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');

      const response = await axios.get(API_ENDPOINTS.ADMIN_REVIEWS, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: currentPage,
          per_page: perPage,
          search: searchTerm,
        },
      });

      if (response.data.success) {
        setReviews(response.data.reviews);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(API_ENDPOINTS.ADMIN_REVIEW_STATS, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(reviewId);
      const token = localStorage.getItem('adminToken');

      const response = await axios.delete(API_ENDPOINTS.ADMIN_REVIEW_DELETE(reviewId), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        alert('Review deleted successfully');
        fetchReviews();
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleFeatured = async (reviewId, currentStatus) => {
    try {
      setTogglingFeatured(reviewId);
      const token = localStorage.getItem('adminToken');

      const response = await axios.put(
        API_ENDPOINTS.ADMIN_REVIEW_TOGGLE_FEATURED(reviewId),
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        // Update the review in the local state
        setReviews(reviews.map(review =>
          review.id === reviewId
            ? { ...review, is_featured: response.data.is_featured }
            : review
        ));

        const message = response.data.is_featured
          ? 'Review added to homepage!'
          : 'Review removed from homepage';
        alert(message);
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
      alert('Failed to update featured status. Please try again.');
    } finally {
      setTogglingFeatured(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchReviews();
  };

  const handleViewDetails = (review) => {
    setSelectedReview(review);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReview(null);
  };

  const renderStars = (rating) => {
    return (
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            style={{
              fill: star <= rating ? '#fbbf24' : 'none',
              color: star <= rating ? '#fbbf24' : '#d1d5db',
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <style>{`
        .admin-reviews-header {
          margin-bottom: 30px;
        }

        .admin-reviews-title {
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .admin-reviews-subtitle {
          font-size: 16px;
          color: #6b7280;
        }

        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .admin-stat-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .admin-stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .admin-stat-label {
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
        }

        .admin-stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
        }

        .admin-search-section {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .admin-search-form {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .admin-search-input {
          flex: 1;
          min-width: 250px;
          padding: 10px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
        }

        .admin-search-button {
          padding: 10px 24px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .admin-search-button:hover {
          background: #1d4ed8;
        }

        .admin-per-page-select {
          padding: 10px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
        }

        .admin-reviews-table-container {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
        }

        .admin-reviews-table {
          width: 100%;
          border-collapse: collapse;
        }

        .admin-reviews-table th {
          background: #f9fafb;
          padding: 16px;
          text-align: left;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          border-bottom: 1px solid #e5e7eb;
        }

        .admin-reviews-table td {
          padding: 16px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
          color: #1f2937;
        }

        .admin-reviews-table tbody tr {
          cursor: pointer;
        }

        .admin-reviews-table tr:hover {
          background: #f9fafb;
        }

        .admin-product-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .admin-product-image {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .admin-product-name {
          font-weight: 500;
          color: #1f2937;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .admin-review-text {
          max-width: 300px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #6b7280;
        }

        .admin-delete-button {
          padding: 8px 12px;
          background: #dc2626;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
        }

        .admin-delete-button:hover {
          background: #b91c1c;
        }

        .admin-delete-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .admin-pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: white;
          border-top: 1px solid #e5e7eb;
        }

        .admin-pagination-info {
          font-size: 14px;
          color: #6b7280;
        }

        .admin-pagination-buttons {
          display: flex;
          gap: 8px;
        }

        .admin-pagination-button {
          padding: 8px 16px;
          border: 1px solid #d1d5db;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }

        .admin-pagination-button:hover:not(:disabled) {
          background: #f9fafb;
        }

        .admin-pagination-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .admin-pagination-button.active {
          background: #2563eb;
          color: white;
          border-color: #2563eb;
        }

        .admin-loading {
          text-align: center;
          padding: 60px 20px;
          font-size: 16px;
          color: #6b7280;
        }

        .admin-no-data {
          text-align: center;
          padding: 60px 20px;
        }

        .admin-no-data-icon {
          margin-bottom: 16px;
          color: #d1d5db;
        }

        .admin-no-data-text {
          font-size: 16px;
          color: #6b7280;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          max-width: 700px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .modal-header {
          padding: 24px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-title {
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 24px;
          color: #6b7280;
          cursor: pointer;
          padding: 4px 8px;
          line-height: 1;
        }

        .modal-close:hover {
          color: #1f2937;
        }

        .modal-body {
          padding: 24px;
        }

        .modal-section {
          margin-bottom: 24px;
        }

        .modal-section:last-child {
          margin-bottom: 0;
        }

        .modal-label {
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .modal-value {
          font-size: 14px;
          color: #1f2937;
          line-height: 1.6;
        }

        .modal-product-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .modal-product-image {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .modal-product-details {
          flex: 1;
        }

        .modal-product-name {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .modal-product-id {
          font-size: 13px;
          color: #6b7280;
        }

        .modal-rating-display {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .modal-rating-number {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
        }

        .modal-review-text {
          background: #f9fafb;
          padding: 16px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          font-size: 14px;
          line-height: 1.6;
          color: #374151;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .modal-user-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .modal-user-row {
          display: flex;
          gap: 8px;
        }

        .modal-user-label {
          font-weight: 600;
          color: #6b7280;
          min-width: 60px;
        }

        .modal-user-value {
          color: #1f2937;
        }

        .modal-footer {
          padding: 16px 24px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .modal-button {
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          border: none;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .modal-button-close {
          background: #f3f4f6;
          color: #374151;
        }

        .modal-button-close:hover {
          background: #e5e7eb;
        }

        .modal-button-delete {
          background: #dc2626;
          color: white;
        }

        .modal-button-delete:hover {
          background: #b91c1c;
        }

        .modal-button-delete:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        /* Tablet Responsive (768px - 1024px) */
        @media (max-width: 1024px) {
          .admin-reviews-title {
            font-size: 28px;
          }

          .admin-reviews-table th,
          .admin-reviews-table td {
            padding: 12px;
            font-size: 13px;
          }

          .admin-product-name {
            max-width: 150px;
          }

          .admin-review-text {
            max-width: 200px;
          }

          .admin-action-button,
          .admin-delete-button {
            font-size: 12px;
            padding: 6px 8px;
          }
        }

        /* Mobile Responsive (max-width: 768px) */
        @media (max-width: 768px) {
          .admin-reviews-header {
            margin-bottom: 20px;
          }

          .admin-reviews-title {
            font-size: 24px;
          }

          .admin-reviews-subtitle {
            font-size: 14px;
          }

          .admin-stats-grid {
            grid-template-columns: 1fr;
            gap: 12px;
            margin-bottom: 20px;
          }

          .admin-stat-card {
            padding: 16px;
          }

          .admin-stat-value {
            font-size: 28px;
          }

          .admin-search-section {
            padding: 16px;
          }

          .admin-search-form {
            flex-direction: column;
            align-items: stretch;
          }

          .admin-search-input {
            width: 100%;
            min-width: unset;
          }

          .admin-search-button {
            width: 100%;
            justify-content: center;
          }

          .admin-per-page-select {
            width: 100%;
          }

          /* Hide table, show mobile cards instead */
          .admin-reviews-table-container {
            overflow-x: auto;
          }

          .admin-reviews-table {
            font-size: 12px;
            min-width: 800px;
          }

          .admin-reviews-table th,
          .admin-reviews-table td {
            padding: 8px;
          }

          .admin-product-image {
            width: 40px;
            height: 40px;
          }

          .admin-product-name {
            max-width: 100px;
            font-size: 12px;
          }

          .admin-review-text {
            max-width: 120px;
            font-size: 12px;
          }

          .admin-action-button {
            padding: 4px 6px;
            font-size: 11px;
          }

          .admin-action-button span {
            display: none;
          }

          .admin-delete-button {
            padding: 6px 8px;
            font-size: 11px;
          }

          .admin-delete-button span {
            display: none;
          }

          .admin-pagination {
            flex-direction: column;
            gap: 12px;
            padding: 16px;
          }

          .admin-pagination-info {
            text-align: center;
            font-size: 13px;
          }

          .admin-pagination-buttons {
            flex-wrap: wrap;
            justify-content: center;
          }

          .admin-pagination-button {
            padding: 6px 12px;
            font-size: 13px;
          }

          .modal-content {
            max-width: 95%;
          }

          .modal-header {
            padding: 16px;
          }

          .modal-title {
            font-size: 18px;
          }

          .modal-body {
            padding: 16px;
          }

          .modal-footer {
            padding: 12px 16px;
            flex-direction: column;
          }

          .modal-button {
            width: 100%;
            justify-content: center;
          }

          .modal-product-image {
            width: 60px;
            height: 60px;
          }

          .modal-rating-number {
            font-size: 24px;
          }
        }

        /* Extra Small Mobile (max-width: 480px) */
        @media (max-width: 480px) {
          div[style*="padding: 20px"] {
            padding: 12px !important;
          }

          .admin-reviews-title {
            font-size: 20px;
          }

          .admin-reviews-subtitle {
            font-size: 13px;
          }

          .admin-stat-label {
            font-size: 12px;
          }

          .admin-stat-value {
            font-size: 24px;
          }

          .admin-search-section {
            padding: 12px;
          }

          .admin-reviews-table {
            min-width: 700px;
          }

          .admin-reviews-table th,
          .admin-reviews-table td {
            padding: 6px;
            font-size: 11px;
          }

          .admin-product-name,
          .admin-review-text {
            max-width: 80px;
            font-size: 11px;
          }

          .modal-product-info {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      {/* Header */}
      <div className="admin-reviews-header">
        <h1 className="admin-reviews-title">Review Management</h1>
        <p className="admin-reviews-subtitle">Manage all product reviews from customers</p>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="admin-stat-label">Total Reviews</span>
              <BarChart3 size={24} color="#2563eb" />
            </div>
            <div className="admin-stat-value">{stats.total_reviews}</div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="admin-stat-label">Average Rating</span>
              <TrendingUp size={24} color="#10b981" />
            </div>
            <div className="admin-stat-value">{stats.average_rating}</div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="admin-stat-label">5-Star Reviews</span>
              <Star size={24} color="#fbbf24" />
            </div>
            <div className="admin-stat-value">{stats.rating_distribution[5] || 0}</div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="admin-search-section">
        <form onSubmit={handleSearch} className="admin-search-form">
          <input
            type="text"
            placeholder="Search by product name, user name, or review text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-search-input"
          />
          <button type="submit" className="admin-search-button">
            <Search size={18} />
            Search
          </button>
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="admin-per-page-select"
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </form>
      </div>

      {/* Reviews Table */}
      <div className="admin-reviews-table-container">
        {loading ? (
          <div className="admin-loading">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="admin-no-data">
            <div className="admin-no-data-icon">
              <Star size={64} />
            </div>
            <p className="admin-no-data-text">No reviews found</p>
          </div>
        ) : (
          <>
            <table className="admin-reviews-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Rating</th>
                  <th>Review</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review.id} onClick={() => handleViewDetails(review)}>
                    <td>#{review.id}</td>
                    <td>
                      <div className="admin-product-info">
                        {review.product_image && (
                          <img
                            src={`${STORAGE_URL}/${review.product_image}`}
                            alt={review.product_name}
                            className="admin-product-image"
                          />
                        )}
                        <span className="admin-product-name" title={review.product_name}>
                          {review.product_name}
                        </span>
                      </div>
                    </td>
                    <td>{renderStars(review.rating)}</td>
                    <td>
                      <div className="admin-review-text" title={review.review}>
                        {review.review || <em style={{ color: '#9ca3af' }}>No text</em>}
                      </div>
                    </td>
                    <td>{review.user_name}</td>
                    <td style={{ color: '#6b7280' }}>{review.user_email}</td>
                    <td style={{ color: '#6b7280', fontSize: '13px' }}>{review.created_at}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Featured button - available for all reviews */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFeatured(review.id, review.is_featured);
                          }}
                          disabled={togglingFeatured === review.id}
                          className="admin-action-button"
                          style={{
                            backgroundColor: review.is_featured ? '#fbbf24' : '#e5e7eb',
                            color: review.is_featured ? '#ffffff' : '#6b7280',
                            border: 'none',
                            cursor: togglingFeatured === review.id ? 'not-allowed' : 'pointer',
                            opacity: togglingFeatured === review.id ? 0.5 : 1,
                            padding: '6px 10px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                          title={review.is_featured ? 'Remove from homepage' : 'Add to homepage (Featured)'}
                        >
                          <Award size={14} />
                          {review.is_featured && <span style={{ fontSize: '12px' }}>Featured</span>}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(review.id);
                          }}
                          disabled={deleting === review.id}
                          className="admin-delete-button"
                        >
                          <Trash2 size={14} />
                          {deleting === review.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {pagination && (
              <div className="admin-pagination">
                <div className="admin-pagination-info">
                  Showing {pagination.from} to {pagination.to} of {pagination.total} reviews
                </div>
                <div className="admin-pagination-buttons">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="admin-pagination-button"
                  >
                    Previous
                  </button>
                  {[...Array(pagination.last_page)].map((_, index) => {
                    const page = index + 1;
                    // Show only nearby pages
                    if (
                      page === 1 ||
                      page === pagination.last_page ||
                      (page >= currentPage - 2 && page <= currentPage + 2)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`admin-pagination-button ${
                            page === currentPage ? 'active' : ''
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === currentPage - 3 || page === currentPage + 3) {
                      return <span key={page}>...</span>;
                    }
                    return null;
                  })}
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === pagination.last_page}
                    className="admin-pagination-button"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Review Details Modal */}
      {showModal && selectedReview && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Review Details</h2>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              {/* Product Information */}
              <div className="modal-section">
                <div className="modal-label">Product</div>
                <div className="modal-product-info">
                  {selectedReview.product_image && (
                    <img
                      src={`${STORAGE_URL}/${selectedReview.product_image}`}
                      alt={selectedReview.product_name}
                      className="modal-product-image"
                    />
                  )}
                  <div className="modal-product-details">
                    <div className="modal-product-name">{selectedReview.product_name}</div>
                    <div className="modal-product-id">Product ID: #{selectedReview.product_id}</div>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="modal-section">
                <div className="modal-label">Rating</div>
                <div className="modal-rating-display">
                  <div className="modal-rating-number">{selectedReview.rating}.0</div>
                  {renderStars(selectedReview.rating)}
                </div>
              </div>

              {/* Review Text */}
              <div className="modal-section">
                <div className="modal-label">Review</div>
                <div className="modal-review-text">
                  {selectedReview.review || <em style={{ color: '#9ca3af' }}>No review text provided</em>}
                </div>
              </div>

              {/* User Information */}
              <div className="modal-section">
                <div className="modal-label">Customer Information</div>
                <div className="modal-user-info">
                  <div className="modal-user-row">
                    <span className="modal-user-label">Name:</span>
                    <span className="modal-user-value">{selectedReview.user_name}</span>
                  </div>
                  <div className="modal-user-row">
                    <span className="modal-user-label">Email:</span>
                    <span className="modal-user-value">{selectedReview.user_email}</span>
                  </div>
                  <div className="modal-user-row">
                    <span className="modal-user-label">Review ID:</span>
                    <span className="modal-user-value">#{selectedReview.id}</span>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="modal-section">
                <div className="modal-label">Dates</div>
                <div className="modal-user-info">
                  <div className="modal-user-row">
                    <span className="modal-user-label">Created:</span>
                    <span className="modal-user-value">{selectedReview.created_at}</span>
                  </div>
                  <div className="modal-user-row">
                    <span className="modal-user-label">Updated:</span>
                    <span className="modal-user-value">{selectedReview.updated_at}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-button modal-button-close" onClick={closeModal}>
                Close
              </button>
              <button
                className="modal-button modal-button-delete"
                onClick={() => {
                  handleDelete(selectedReview.id);
                  closeModal();
                }}
                disabled={deleting === selectedReview.id}
              >
                <Trash2 size={16} />
                {deleting === selectedReview.id ? 'Deleting...' : 'Delete Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
