/**
 * API Configuration
 * Centralized API URL management for the application
 *
 * SECURITY: Never hardcode API URLs in components
 * Use environment variables for flexibility across environments
 */

// Get API URL from environment variable or use default
// Vite uses import.meta.env.VITE_* prefix
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_URL}/api/login`,
  REGISTER: `${API_URL}/api/register`,
  LOGOUT: `${API_URL}/api/logout`,

  // Google OAuth
  GOOGLE_REDIRECT: `${API_URL}/api/auth/google/redirect`,
  GOOGLE_CALLBACK: `${API_URL}/api/auth/google/callback`,
  GOOGLE_EXCHANGE_CODE: `${API_URL}/api/auth/google/exchange-code`,

  // Email Verification
  VERIFY_EMAIL_OTP: `${API_URL}/api/verify-email-otp`,
  RESEND_OTP: `${API_URL}/api/resend-otp`,

  // Password Reset
  FORGOT_PASSWORD: `${API_URL}/api/forgot-password`,
  VERIFY_OTP: `${API_URL}/api/verify-otp`,
  RESET_PASSWORD: `${API_URL}/api/reset-password`,

  // User
  USER_PROFILE: `${API_URL}/api/me`,
  UPDATE_PROFILE: `${API_URL}/api/update-profile`,
  CHECK_USER: `${API_URL}/api/check-user`,

  // Wishlist
  WISHLIST: `${API_URL}/api/wishlist`,
  WISHLIST_ADD: `${API_URL}/api/wishlist`,
  WISHLIST_REMOVE: (productId) => `${API_URL}/api/wishlist/${productId}`,

  // Cart
  CART: `${API_URL}/api/cart`,
  CART_ADD: `${API_URL}/api/cart`,
  CART_UPDATE: (id) => `${API_URL}/api/cart/${id}`,
  CART_DELETE: (id) => `${API_URL}/api/cart/${id}`,
  CART_CLEAR: `${API_URL}/api/cart/clear`,

  // Products
  PRODUCTS: `${API_URL}/api/products`,
  PRODUCT_DETAIL: (id) => `${API_URL}/api/products/${id}`,
  HOMEPAGE: `${API_URL}/api/homepage`,
  FRESHNER_MIST_DETAIL: (id) => `${API_URL}/api/freshners-mist-all/${id}`,
  FRESHNERS_MIST_ALL: `${API_URL}/api/freshners-mist-all`,

  // Reviews
  PRODUCT_REVIEWS: (productId) =>
    `${API_URL}/api/products/${productId}/reviews`,
  ADD_REVIEW: `${API_URL}/api/reviews`,
  UPDATE_REVIEW: (reviewId) => `${API_URL}/api/reviews/${reviewId}`,
  DELETE_REVIEW: (reviewId) => `${API_URL}/api/reviews/${reviewId}`,
  USER_REVIEW: (productId) => `${API_URL}/api/products/${productId}/my-review`,

  // Payment
  RAZORPAY_CREATE_ORDER: `${API_URL}/api/razorpay/create-order`,
  RAZORPAY_VERIFY: `${API_URL}/api/razorpay/verify`,
  MY_ORDERS: `${API_URL}/api/my-orders`,

  // Admin
  ADMIN_LOGIN: `${API_URL}/api/admin/login`,
  ADMIN_LOGOUT: `${API_URL}/api/admin/logout`,
  ADMIN_ME: `${API_URL}/api/admin/me`,
  ADMIN_ORDERS: `${API_URL}/api/admin/orders`,
  ADMIN_ORDERS_NEW: `${API_URL}/api/admin/orders/new`,
  ADMIN_ORDER_VERIFY: (id) => `${API_URL}/api/admin/orders/${id}/verify`,
  ADMIN_ORDER_SET_STATUS: (id) => `${API_URL}/api/admin/orders/${id}/status`,
  ADMIN_CREATE: `${API_URL}/api/admin/create-admin`,
  ADMIN_ALL: `${API_URL}/api/admin/all-admins`,
  ADMIN_DELETE: (id) => `${API_URL}/api/admin/delete-admin/${id}`,
  ADMIN_UPDATE_PERMISSIONS: (id) =>
    `${API_URL}/api/admin/update-admin-permissions/${id}`,
  ADMIN_USERS: `${API_URL}/api/admin/all-users`,
  ADMIN_PRODUCTS: `${API_URL}/api/admin/products`,
  ADMIN_PRODUCT_UPDATE: (id) => `${API_URL}/api/admin/products/${id}`,
  ADMIN_PRODUCT_DELETE: (id) => `${API_URL}/api/admin/products/${id}`,
  ADMIN_PRODUCT_IMAGE_DELETE: (productId, imageId) =>
    `${API_URL}/api/admin/products/${productId}/images/${imageId}`,
  ADMIN_BESTSELLERS_REORDER: `${API_URL}/api/admin/bestsellers/reorder`,
  ADMIN_ENQUIRY_CONTACT: `${API_URL}/api/admin/user-enquiry/contact`,
  ADMIN_ENQUIRY_BOOKINGS: `${API_URL}/api/admin/user-enquiry/bookings`,

  // Hotel Amenities
  ROOM_FRESHNERS: `${API_URL}/api/room-freshners`,
  CONTACT: `${API_URL}/api/contact`,

  // Live Perfume Bar
  LIVEPERFUME: `${API_URL}/api/liveperfume`,
  BOOKINGS: `${API_URL}/api/bookings`,

  // Sliders
  SLIDERS_BY_PAGE: (page) => `${API_URL}/api/sliders/${page}`,
  ADMIN_SLIDERS: `${API_URL}/api/admin/sliders`,
  ADMIN_SLIDERS_UPLOAD: `${API_URL}/api/admin/sliders`,
  ADMIN_SLIDERS_DELETE: (id) => `${API_URL}/api/admin/sliders/${id}`,
  ADMIN_SLIDERS_REORDER: `${API_URL}/api/admin/sliders/reorder`,

  // Uproducts (Our Products section on homepage)
  ADMIN_UPRODUCTS: `${API_URL}/api/admin/uproducts`,
  ADMIN_UPRODUCTS_UPLOAD: `${API_URL}/api/admin/uproducts`,
  ADMIN_UPRODUCTS_UPDATE: (id) => `${API_URL}/api/admin/uproducts/${id}`,
  ADMIN_UPRODUCTS_DELETE: (id) => `${API_URL}/api/admin/uproducts/${id}`,

  // How It Works (Live Perfume page)
  ADMIN_HOW_IT_WORKS: `${API_URL}/api/admin/how-it-works`,
  ADMIN_HOW_IT_WORKS_CREATE: `${API_URL}/api/admin/how-it-works`,
  ADMIN_HOW_IT_WORKS_UPDATE: (id) => `${API_URL}/api/admin/how-it-works/${id}`,
  ADMIN_HOW_IT_WORKS_DELETE: (id) => `${API_URL}/api/admin/how-it-works/${id}`,

  // Admin Reviews
  ADMIN_REVIEWS: `${API_URL}/api/admin/reviews`,
  ADMIN_REVIEW_DELETE: (reviewId) => `${API_URL}/api/admin/reviews/${reviewId}`,
  ADMIN_REVIEW_STATS: `${API_URL}/api/admin/reviews/stats`,
  ADMIN_REVIEW_TOGGLE_FEATURED: (reviewId) =>
    `${API_URL}/api/admin/reviews/${reviewId}/toggle-featured`,
  ADMIN_REVIEW_UPDATE_STATUS: (reviewId) =>
    `${API_URL}/api/admin/reviews/${reviewId}/status`,

  // Career Page
  CAREERS: `${API_URL}/api/careers`,
  CAREER_APPLY: `${API_URL}/api/careers/apply`,
  ADMIN_CAREERS: `${API_URL}/api/admin/careers`,
  ADMIN_CAREER_CREATE: `${API_URL}/api/admin/careers`,
  ADMIN_CAREER_UPDATE: (id) => `${API_URL}/api/admin/careers/${id}`,
  ADMIN_CAREER_DELETE: (id) => `${API_URL}/api/admin/careers/${id}`,
  ADMIN_CAREER_TOGGLE_STATUS: (id) =>
    `${API_URL}/api/admin/careers/${id}/toggle-status`,
  ADMIN_CAREER_APPLICATIONS: `${API_URL}/api/admin/career-applications`,
  ADMIN_CAREER_RESUME_DOWNLOAD: (id) =>
    `${API_URL}/api/admin/career-applications/${id}/resume`,
  ADMIN_CAREER_COVER_LETTER_DOWNLOAD: (id) =>
    `${API_URL}/api/admin/career-applications/${id}/cover-letter`,
  ADMIN_CAREER_APPLICATION_UPDATE_STATUS: (id) =>
    `${API_URL}/api/admin/career-applications/${id}/status`,
  ADMIN_CAREER_APPLICATION_UPDATE_COMMENTS: (id) =>
    `${API_URL}/api/admin/career-applications/${id}/comments`,
  ADMIN_CAREER_APPLICATION_DELETE: (id) =>
    `${API_URL}/api/admin/career-applications/${id}`,

  // Blogs
  BLOGS: `${API_URL}/api/blogs`,
  BLOG_DETAIL: (id) => `${API_URL}/api/blogs/${id}`,
  ADMIN_BLOGS: `${API_URL}/api/admin/blogs`,
  ADMIN_BLOG_UPDATE: (id) => `${API_URL}/api/admin/blogs/${id}`,
  ADMIN_BLOG_DELETE: (id) => `${API_URL}/api/admin/blogs/${id}`,
  ADMIN_BLOG_STATUS: (id) => `${API_URL}/api/admin/blogs/${id}/status`,
  ADMIN_BLOG_CATEGORIES: `${API_URL}/api/admin/blog-categories`,
  ADMIN_BLOG_CATEGORY_DELETE: (id) => `${API_URL}/api/admin/blog-categories/${id}`,

  // Analytics
  ANALYTICS_OVERVIEW: `${API_URL}/api/admin/analytics/overview`,
  ANALYTICS_SALES: `${API_URL}/api/admin/analytics/sales`,
  ANALYTICS_PRODUCTS: `${API_URL}/api/admin/analytics/products`,
  ANALYTICS_CUSTOMERS: `${API_URL}/api/admin/analytics/customers`,
  ANALYTICS_REVIEWS: `${API_URL}/api/admin/analytics/reviews`,
  ANALYTICS_ORDERS: `${API_URL}/api/admin/analytics/orders`,
};

// Storage URLs (for images, files, etc.)
export const STORAGE_URL = `${API_URL}/storage`;

// Helper function to get storage URL for images
export const getImageUrl = (imagePath) => {
  if (!imagePath) return "/fallback.jpg";
  if (imagePath.startsWith("http")) return imagePath;
  // For images stored in public folder (like uploads/blogs/)
  if (imagePath.startsWith("uploads/")) return `${API_URL}/${imagePath}`;
  return `${STORAGE_URL}/${imagePath}`;
};

export default API_URL;
