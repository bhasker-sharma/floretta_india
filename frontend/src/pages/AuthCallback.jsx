import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
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
      exchangeCodeForToken(code);
    } else {
      alert('Login failed. Missing authentication code.');
      navigate('/userlogin');
    }
  }, [searchParams, navigate]);

  const exchangeCodeForToken = async (code) => {
    try {
      // Exchange code for token via secure POST request
      const response = await axios.post('http://localhost:8000/api/auth/google/exchange-code', {
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
        alert('Login failed. Please try again.');
        navigate('/userlogin');
      }
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      alert('Login failed. Please try again.');
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