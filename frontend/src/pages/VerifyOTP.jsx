import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import '../styles/VerifyOTP.css';

function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get email from sessionStorage
    const storedEmail = sessionStorage.getItem('reset_email');
    if (!storedEmail) {
      // If no email found, redirect to forgot password page
      navigate('/forgot-password');
    } else {
      setEmail(storedEmail);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post(API_ENDPOINTS.VERIFY_OTP, {
        email: email,
        otp: otp,
      });

      if (response.data.success) {
        setMessage('OTP verified successfully! Redirecting to reset password...');
        // Store the verified OTP in sessionStorage for password reset
        sessionStorage.setItem('verified_otp', otp);
        // Navigate to reset password page after 1.5 seconds
        setTimeout(() => {
          navigate('/reset-password');
        }, 1500);
      }
    } catch (err) {
      setError(
        err.response?.data?.error || 'Invalid or expired OTP. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post(API_ENDPOINTS.FORGOT_PASSWORD, {
        email: email,
      });

      if (response.data.success) {
        setMessage('New OTP has been sent to your email.');
        setOtp('');
      }
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-otp-page">
      <div className="verify-otp-container">
        <div className="verify-otp-card">
          <div className="verify-otp-header">
            <h2>Verify OTP</h2>
            <p>We've sent a 6-digit code to</p>
            <p className="email-display">{email}</p>
          </div>

          <form onSubmit={handleSubmit} className="verify-otp-form">
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
              <label htmlFor="otp">Enter OTP</label>
              <input
                type="text"
                id="otp"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength="6"
                required
                disabled={loading}
                className="otp-input"
              />
              <small className="help-text">Valid for 10 minutes</small>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading || otp.length !== 6}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>

          <div className="verify-otp-footer">
            <p>
              Didn't receive the code?{' '}
              <span onClick={handleResendOTP} className="link-text">
                Resend OTP
              </span>
            </p>
            <p>
              <span onClick={() => navigate('/forgot-password')} className="link-text">
                Change Email Address
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyOTP;
