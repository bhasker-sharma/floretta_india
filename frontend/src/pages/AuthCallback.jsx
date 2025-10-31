import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hasExchangedCode = useRef(false); // Prevent duplicate calls in React Strict Mode

  useEffect(() => {
    // Prevent duplicate API calls in React 18 Strict Mode (development)
    if (hasExchangedCode.current) {
      console.log('Code exchange already initiated, skipping duplicate call');
      return;
    }

    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const message = searchParams.get('message');

    if (error) {
      const errorMsg = message ? decodeURIComponent(message) : 'Google login failed. Please try again.';
      console.error('Google OAuth Error:', errorMsg);
      alert('Google login failed: ' + errorMsg);
      navigate('/userlogin');
      return;
    }

    // SECURITY: Exchange one-time code for JWT token via POST
    // Prevents token exposure in URLs, browser history, and server logs
    if (code) {
      hasExchangedCode.current = true; // Mark as initiated
      exchangeCodeForToken(code);
    } else {
      alert('Login failed. Missing authentication code.');
      navigate('/userlogin');
    }
  }, [searchParams, navigate]);

  const exchangeCodeForToken = async (code) => {
    try {
      console.log('Exchanging code for token. Code length:', code?.length);

      // Exchange code for token via secure POST request
      const response = await axios.post(API_ENDPOINTS.GOOGLE_EXCHANGE_CODE, {
        code: code
      });

      if (response.data.success) {
        const { token, user } = response.data;

        // Save token and user to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');

        // Clear code from URL (security best practice)
        window.history.replaceState({}, document.title, '/auth/callback');

        navigate('/userprofile');
      } else {
        const errorMsg = response.data.message || 'Login failed. Please try again.';
        console.error('Login failed:', errorMsg);
        alert('Login failed: ' + errorMsg);
        navigate('/userlogin');
      }
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Login failed. Please try again.';
      console.error('Backend error message:', errorMsg);
      console.error('Full error response:', error.response?.data);
      alert('Login failed: ' + errorMsg);
      navigate('/userlogin');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '18px'
    }}>
      Processing login...
    </div>
  );
};

export default AuthCallback;