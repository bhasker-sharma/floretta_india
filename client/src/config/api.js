export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  LOGIN: `${API_URL}/api/login`,
  REGISTER: `${API_URL}/api/register`,
  LOGOUT: `${API_URL}/api/logout`,
  GOOGLE_REDIRECT: `${API_URL}/api/auth/google/redirect`,
  GOOGLE_EXCHANGE_CODE: `${API_URL}/api/auth/google/exchange-code`,
  VERIFY_EMAIL_OTP: `${API_URL}/api/verify-email-otp`,
  RESEND_OTP: `${API_URL}/api/resend-otp`,
  FORGOT_PASSWORD: `${API_URL}/api/forgot-password`,
  VERIFY_OTP: `${API_URL}/api/verify-otp`,
  RESET_PASSWORD: `${API_URL}/api/reset-password`,
  USER_PROFILE: `${API_URL}/api/me`,
  UPDATE_PROFILE: `${API_URL}/api/update-profile`,
  WISHLIST: `${API_URL}/api/wishlist`,
  WISHLIST_REMOVE: (id) => `${API_URL}/api/wishlist/${id}`,
  CART: `${API_URL}/api/cart`,
  CART_UPDATE: (id) => `${API_URL}/api/cart/${id}`,
  CART_DELETE: (id) => `${API_URL}/api/cart/${id}`,
  CART_CLEAR: `${API_URL}/api/cart/clear`,
  PRODUCTS: `${API_URL}/api/products`,
  PRODUCT_DETAIL: (id) => `${API_URL}/api/products/${id}`,
  PRODUCT_REVIEWS: (id) => `${API_URL}/api/products/${id}/reviews`,
  ADD_REVIEW: `${API_URL}/api/reviews`,
  UPDATE_REVIEW: (id) => `${API_URL}/api/reviews/${id}`,
  DELETE_REVIEW: (id) => `${API_URL}/api/reviews/${id}`,
  USER_REVIEW: (id) => `${API_URL}/api/products/${id}/my-review`,
  RAZORPAY_CREATE_ORDER: `${API_URL}/api/razorpay/create-order`,
  RAZORPAY_VERIFY: `${API_URL}/api/razorpay/verify`,
  MY_ORDERS: `${API_URL}/api/my-orders`,
  CAREERS: `${API_URL}/api/careers`,
  BLOGS: `${API_URL}/api/blogs`,
  BLOG_DETAIL: (id) => `${API_URL}/api/blogs/${id}`,
  CONTACT: `${API_URL}/api/contact`,
};

export const STORAGE_URL = `${API_URL}/storage`;

export const getImageUrl = (path) => {
  if (!path) return '/fallback.jpg';
  if (path.startsWith('http')) return path;
  if (path.startsWith('uploads/')) return `${API_URL}/${path}`;
  return `${STORAGE_URL}/${path}`;
};

export default API_URL;
