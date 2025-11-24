import axios from 'axios';

let isRedirecting = false; // Flag to prevent multiple redirects

/**
 * Setup axios interceptors to handle authentication errors
 * Shows popup and redirects to login when session expires
 */
export const setupAxiosInterceptors = () => {
  // Response interceptor to catch 401 (Unauthorized) errors
  axios.interceptors.response.use(
    (response) => {
      // If response is successful, just return it
      return response;
    },
    (error) => {
      // Check if error is due to authentication (401 Unauthorized or 403 Forbidden)
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        // IMPORTANT: Don't intercept OAuth/Google login errors
        // Let those be handled by their respective components
        const isOAuthError = error.config?.url?.includes('/auth/') ||
                            error.config?.url?.includes('google') ||
                            error.config?.url?.includes('oauth');

        if (isOAuthError) {
          // Don't intercept OAuth errors, pass them through
          return Promise.reject(error);
        }

        // Prevent multiple redirects
        if (!isRedirecting) {
          isRedirecting = true;

          // Check which type of user is logged out
          const isAdminRoute = window.location.pathname.includes('/admin');
          const hasAdminToken = localStorage.getItem('adminToken');

          let message = '';
          let redirectPath = '';

          if (isAdminRoute || hasAdminToken) {
            // Admin session expired
            message = '⚠️ Your admin session has expired. Please login again.';
            redirectPath = '/admin/login';

            // Clear admin token
            localStorage.removeItem('adminToken');
          } else {
            // User session expired
            message = '⚠️ Your session has expired. Please login again.';
            redirectPath = '/login';

            // Clear user token and related data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }

          // Show alert popup
          alert(message);

          // Redirect to login page
          window.location.href = redirectPath;

          // Reset flag after redirect
          setTimeout(() => {
            isRedirecting = false;
          }, 1000);
        }
      }

      // Return the error so it can be handled by catch blocks if needed
      return Promise.reject(error);
    }
  );
};

/**
 * Initialize interceptors when app starts
 */
export const initializeAuth = () => {
  setupAxiosInterceptors();
};
