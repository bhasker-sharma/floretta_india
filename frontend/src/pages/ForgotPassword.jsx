import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import '../styles/ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post(API_ENDPOINTS.FORGOT_PASSWORD, {
        email: email,
      });

      if (response.data.success) {
        setMessage('OTP has been sent to your email. Please check your inbox.');
        // Store email in sessionStorage to use in next steps
        sessionStorage.setItem('reset_email', email);
        // Navigate to verify OTP page after 2 seconds
        setTimeout(() => {
          navigate('/verify-otp');
        }, 2000);
      }
    } catch (err) {
      setError(
        err.response?.data?.error || 'Failed to send OTP. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          <div className="forgot-password-header">
            <h2>Forgot Password?</h2>
            <p>Enter your email address and we'll send you an OTP to reset your password.</p>
          </div>

          <form onSubmit={handleSubmit} className="forgot-password-form">
            {error && (
              <div className="alert alert-error">
                <span className="alert-icon">⚠️</span>
                {error}
              </div>
            )}

            {message && (
              <div className="alert alert-success">
                <span className="alert-icon">✓</span>
                {message}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>

          <div className="forgot-password-footer">
            <p>
              Remember your password?{' '}
              <span onClick={() => navigate('/login')} className="link-text">
                Back to Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
