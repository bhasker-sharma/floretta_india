/**
 * AnalyticsReviews Component
 *
 * Review analytics and moderation dashboard:
 * - Review KPIs (total reviews, avg rating, 5-star %, low-star %)
 * - Rating distribution (breakdown by star rating 1-5)
 * - Review trends over time (daily review count and average rating)
 * - Top reviewed products
 * - Review management with moderation actions
 * - CSV export for review data
 *
 * Key Features:
 * - Review moderation (approve/reject/delete actions)
 * - Multi-filter support (status, rating, product, search)
 * - Star rating visualization
 * - Sentiment analysis through rating distribution
 * - Product-level review insights
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import KPICard from '../components/KPICard';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function AnalyticsReviews({ dateRange }) {
  const [loading, setLoading] = useState(false);

  // Review KPIs
  const [kpis, setKpis] = useState({});

  // Chart data
  const [ratingDistribution, setRatingDistribution] = useState([]); // Count of reviews per star rating (1-5)
  const [reviewsOverTime, setReviewsOverTime] = useState([]); // Daily review count and avg rating trend
  const [topReviewedProducts, setTopReviewedProducts] = useState([]); // Products with most reviews

  // Reviews table data
  const [reviews, setReviews] = useState([]); // Reviews list with moderation options
  const [reviewsPagination, setReviewsPagination] = useState({}); // Pagination metadata

  // Filter states
  const [reviewsSearch, setReviewsSearch] = useState(''); // Search in review text or customer name
  const [statusFilter, setStatusFilter] = useState(''); // Filter by approval status (approved/pending/rejected)
  const [ratingFilter, setRatingFilter] = useState(''); // Filter by star rating (1-5)
  const [productFilter, setProductFilter] = useState(''); // Filter by product ID
  const [reviewsSortBy, setReviewsSortBy] = useState('created_at'); // Sort column
  const [reviewsSortOrder, setReviewsSortOrder] = useState('desc'); // Sort direction (newest first by default)
  const [currentPage, setCurrentPage] = useState(1); // Current page number

  /**
   * Effect Hook: Load data when date range changes
   */
  useEffect(() => {
    if (Object.keys(dateRange).length > 0) {
      loadReviewsData();
    }
  }, [dateRange]);

  /**
   * Effect Hook: Reload data when any filter, search, sort, or pagination changes
   */
  useEffect(() => {
    if (Object.keys(dateRange).length > 0) {
      loadReviewsData();
    }
  }, [reviewsSearch, statusFilter, ratingFilter, productFilter, reviewsSortBy, reviewsSortOrder, currentPage]);

  /**
   * Load Review Analytics Data
   *
   * Fetches comprehensive review analytics including:
   * - KPIs: Total reviews, avg rating, 5-star percentage, low-star percentage
   * - Rating distribution: Count of reviews for each star rating (1-5)
   * - Reviews over time: Daily review count and average rating trends
   * - Top reviewed products: Products with most reviews
   * - Recent reviews: Paginated list with full review details for moderation
   *
   * Supports advanced filtering by status, rating, product, and search query
   */
  const loadReviewsData = async () => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        ...dateRange,
        search: reviewsSearch,
        status: statusFilter,
        rating: ratingFilter,
        product_id: productFilter,
        sort_by: reviewsSortBy,
        sort_order: reviewsSortOrder,
        page: currentPage,
        per_page: 15,
      },
    };

    try {
      const response = await axios.get(API_ENDPOINTS.ANALYTICS_REVIEWS, config);
      if (response.data.success) {
        const data = response.data.data;
        setKpis(data.kpis || {});
        setRatingDistribution(data.rating_distribution || []);
        setReviewsOverTime(data.reviews_over_time || []);
        setTopReviewedProducts(data.top_reviewed_products || []);
        setReviews(data.recent_reviews || []);
      }
    } catch (error) {
      console.error('Error loading reviews data:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Review Moderation Actions
   *
   * Performs moderation actions on reviews:
   * - approve: Approves a pending/rejected review (makes it visible to customers)
   * - reject: Rejects a review (hides it from customers)
   * - delete: Permanently deletes a review from the database
   *
   * Shows confirmation dialog before executing action
   * Reloads review data after successful moderation
   *
   * @param {number} reviewId - The ID of the review to moderate
   * @param {string} action - The action to perform ('approved', 'rejected', or 'delete')
   */
  const handleModerateReview = async (reviewId, action) => {
    const token = localStorage.getItem('adminToken');
    const confirmMessage = action === 'delete'
      ? 'Are you sure you want to delete this review?'
      : `Are you sure you want to ${action} this review?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      let response;

      if (action === 'delete') {
        // DELETE request to permanently remove review
        response = await axios.delete(
          API_ENDPOINTS.ADMIN_REVIEW_DELETE(reviewId),
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // PUT request to update review status (approved/rejected)
        response = await axios.put(
          API_ENDPOINTS.ADMIN_REVIEW_UPDATE_STATUS(reviewId),
          { status: action },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      if (response.data.success) {
        alert(`Review ${action}d successfully!`);
        loadReviewsData(); // Reload to reflect changes
      }
    } catch (error) {
      console.error(`Error ${action}ing review:`, error);
      alert(`Failed to ${action} review: ` + (error.response?.data?.error || error.message));
    }
  };

  /**
   * Export Reviews to CSV
   *
   * Creates a CSV file containing review data:
   * - Product name
   * - Star rating (1-5)
   * - Review text/comment
   * - Customer name and email
   * - Review date
   * - Moderation status (approved/pending/rejected)
   */
  const handleExportCSV = () => {
    if (reviews.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = ['Product', 'Rating', 'Review Text', 'Customer', 'Email', 'Date', 'Status'];
    const rows = reviews.map(review => [
      review.product_name,
      review.rating,
      review.comment,
      review.customer_name,
      review.customer_email,
      review.date,
      review.status,
    ]);

    // Build CSV with proper escaping
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      const escapedRow = row.map(cell => {
        const cellStr = String(cell).replace(/"/g, '""');
        return cellStr.includes(',') || cellStr.includes('\n') ? `"${cellStr}"` : cellStr;
      });
      csvContent += escapedRow.join(',') + '\n';
    });

    // Create and download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reviews_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Render Star Rating Visualization
   * Converts numeric rating (1-5) to star emoji string
   *
   * @param {number} rating - Star rating (1-5)
   * @returns {string} String of star emojis (e.g., "⭐⭐⭐⭐⭐")
   */
  const renderStars = (rating) => {
    return '⭐'.repeat(rating);
  };

  /**
   * Get Status Badge Component
   *
   * Returns a colored badge component based on review moderation status:
   * - approved: Green badge
   * - pending: Orange badge
   * - rejected: Red badge
   *
   * @param {string} status - Review status (approved/pending/rejected)
   * @returns {JSX.Element} Colored badge component
   */
  const getStatusBadge = (status) => {
    const statusClasses = {
      approved: 'status-paid',
      pending: 'status-pending',
      rejected: 'status-failed',
    };
    return <span className={`status-badge ${statusClasses[status] || 'status-pending'}`}>{status}</span>;
  };

  return (
    <div>
      {/* KPI Cards */}
      <div className="kpi-cards-row">
        {kpis.total_reviews && (
          <KPICard
            label={kpis.total_reviews.label}
            value={kpis.total_reviews.value}
            trend={kpis.total_reviews.trend}
            icon="fas fa-comment"
            formatter="number"
          />
        )}
        {kpis.avg_rating && (
          <KPICard
            label={kpis.avg_rating.label}
            value={kpis.avg_rating.value}
            trend={kpis.avg_rating.trend}
            icon="fas fa-star"
            formatter="rating"
          />
        )}
        {kpis.five_star_percent && (
          <KPICard
            label={kpis.five_star_percent.label}
            value={kpis.five_star_percent.value}
            trend={kpis.five_star_percent.trend}
            icon="fas fa-heart"
            formatter="percentage"
          />
        )}
        {kpis.low_star_percent && (
          <KPICard
            label={kpis.low_star_percent.label}
            value={kpis.low_star_percent.value}
            trend={kpis.low_star_percent.trend}
            icon="fas fa-exclamation-circle"
            formatter="percentage"
          />
        )}
      </div>

      {/* Charts Row */}
      <div className="analytics-charts-grid" style={{ marginBottom: '24px' }}>
        {/* Rating Distribution */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3>Rating Distribution</h3>
            <p>Breakdown by star rating</p>
          </div>
          <div className="chart-card-body">
            {ratingDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ratingDistribution}>
                  <defs>
                    <linearGradient id="colorRatingDist" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a33d3d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#a33d3d" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="rating"
                    stroke="#666"
                    style={{ fontSize: '12px', fontWeight: '500' }}
                    label={{ value: 'Stars', position: 'insideBottom', offset: -5 }}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#666"
                    style={{ fontSize: '12px', fontWeight: '500' }}
                    tickLine={false}
                    domain={[0, (dataMax) => Math.ceil(dataMax * 1.1)]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="count"
                    fill="url(#colorRatingDist)"
                    name="Reviews"
                    radius={[8, 8, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-no-data">
                <i className="fas fa-chart-bar"></i>
                <p>No data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Over Time */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3>Reviews Over Time</h3>
            <p>Daily review count and average rating</p>
          </div>
          <div className="chart-card-body">
            {reviewsOverTime.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={reviewsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#888" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#888" style={{ fontSize: '12px' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="reviews" stroke="#a33d3d" strokeWidth={2} name="Reviews" />
                  <Line type="monotone" dataKey="avg_rating" stroke="#10b981" strokeWidth={2} name="Avg Rating" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-no-data">
                <i className="fas fa-chart-line"></i>
                <p>No data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Reviewed Products */}
      {topReviewedProducts.length > 0 && (
        <div className="chart-card" style={{ gridColumn: '1 / -1', marginBottom: '24px' }}>
          <div className="chart-card-header">
            <h3>Top Reviewed Products</h3>
            <p>Products with most reviews</p>
          </div>
          <div className="chart-card-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topReviewedProducts} layout="vertical">
                <defs>
                  <linearGradient id="colorTopReviewed" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="#a33d3d" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#a33d3d" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  type="number"
                  stroke="#666"
                  style={{ fontSize: '12px', fontWeight: '500' }}
                  tickLine={false}
                  domain={[0, (dataMax) => Math.ceil(dataMax * 1.1)]}
                />
                <YAxis
                  dataKey="product_name"
                  type="category"
                  width={150}
                  stroke="#666"
                  style={{ fontSize: '11px', fontWeight: '500' }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Bar
                  dataKey="review_count"
                  fill="url(#colorTopReviewed)"
                  name="Reviews"
                  radius={[0, 8, 8, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Reviews Table with Moderation */}
      <div className="orders-table-card">
        <div className="orders-table-header">
          <h3>Reviews with Moderation</h3>
          <div className="orders-table-actions">
            <div className="orders-search">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search reviews..."
                value={reviewsSearch}
                onChange={(e) => setReviewsSearch(e.target.value)}
              />
            </div>
            <button className="btn-export-csv" onClick={handleExportCSV}>
              <i className="fas fa-file-csv"></i> Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="table-filters">
          <div className="filter-group">
            <label>Status:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Rating:</label>
            <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>

        <table className="analytics-table">
          <thead>
            <tr>
              <th>Product</th>
              <th onClick={() => { setReviewsSortBy('rating'); setReviewsSortOrder(reviewsSortOrder === 'asc' ? 'desc' : 'asc'); }}>
                Rating <i className="fas fa-sort"></i>
              </th>
              <th>Review Text</th>
              <th>Customer</th>
              <th onClick={() => { setReviewsSortBy('created_at'); setReviewsSortOrder(reviewsSortOrder === 'asc' ? 'desc' : 'asc'); }}>
                Date <i className="fas fa-sort"></i>
              </th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <tr key={review.id}>
                  <td><strong>{review.product_name}</strong></td>
                  <td>
                    <span style={{ color: '#f59e0b', fontSize: '14px' }}>
                      {renderStars(review.rating)}
                    </span>
                  </td>
                  <td>
                    <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {review.comment || 'No comment'}
                    </div>
                  </td>
                  <td>
                    <div>{review.customer_name}</div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>{review.customer_email}</div>
                  </td>
                  <td>{review.date}</td>
                  <td>{getStatusBadge(review.status)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {review.status !== 'approved' && (
                        <button
                          onClick={() => handleModerateReview(review.id, 'approved')}
                          style={{
                            padding: '6px 12px',
                            background: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          <i className="fas fa-check"></i> Approve
                        </button>
                      )}
                      {review.status !== 'rejected' && (
                        <button
                          onClick={() => handleModerateReview(review.id, 'rejected')}
                          style={{
                            padding: '6px 12px',
                            background: '#f59e0b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          <i className="fas fa-times"></i> Reject
                        </button>
                      )}
                      <button
                        onClick={() => handleModerateReview(review.id, 'delete')}
                        style={{
                          padding: '6px 12px',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        <i className="fas fa-trash"></i> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                  No reviews found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .table-filters {
          display: flex;
          gap: 16px;
          margin: 16px 0;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-group label {
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
        }

        .filter-group select {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 13px;
          min-width: 150px;
        }
      `}</style>
    </div>
  );
}

export default AnalyticsReviews;
