/**
 * API Configuration
 * Centralized API URL management for the application
 *
 * SECURITY: Never hardcode API URLs in components
 * Use environment variables for flexibility across environments
 */

// Get API URL from environment variable or use default
// Create React App uses process.env.REACT_APP_* prefix
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

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
  FRESHNERS_MIST_ALL: `${API_URL}/api/freshners-mist-all`,

  // Payment
  RAZORPAY_CREATE_ORDER: `${API_URL}/api/razorpay/create-order`,
  RAZORPAY_VERIFY: `${API_URL}/api/razorpay/verify`,
  MY_ORDERS: `${API_URL}/api/my-orders`,

  // Admin
  ADMIN_LOGIN: `${API_URL}/api/admin/login`,
  ADMIN_LOGOUT: `${API_URL}/api/admin/logout`,
  ADMIN_ME: `${API_URL}/api/admin/me`,
  ADMIN_ORDERS: `${API_URL}/api/admin/orders`,
  ADMIN_CREATE: `${API_URL}/api/admin/create-admin`,
  ADMIN_ALL: `${API_URL}/api/admin/all-admins`,
  ADMIN_DELETE: (id) => `${API_URL}/api/admin/delete-admin/${id}`,
  ADMIN_USERS: `${API_URL}/api/admin/all-users`,
  ADMIN_PRODUCTS: `${API_URL}/api/admin/products`,
  ADMIN_PRODUCT_DELETE: (id) => `${API_URL}/api/admin/products/${id}`,

  // Hotel Amenities
  ROOM_FRESHNERS: `${API_URL}/api/room-freshners`,
  CONTACT: `${API_URL}/api/contact`,

  // Live Perfume Bar
  LIVEPERFUME: `${API_URL}/api/liveperfume`,
  BOOKINGS: `${API_URL}/api/bookings`,
};

// Storage URLs (for images, files, etc.)
export const STORAGE_URL = `${API_URL}/storage`;

// Helper function to get storage URL for images
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/fallback.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  return `${STORAGE_URL}/${imagePath}`;
};

export default API_URL;
