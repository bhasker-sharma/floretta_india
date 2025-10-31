import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import '../styles/ResetPassword.css';

function ResetPassword() {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get email and verified OTP from sessionStorage
    const storedEmail = sessionStorage.getItem('reset_email');
    const verifiedOtp = sessionStorage.getItem('verified_otp');

    if (!storedEmail || !verifiedOtp) {
      // If no email or OTP found, redirect to forgot password page
      navigate('/forgot-password');
    } else {
      setEmail(storedEmail);
      setOtp(verifiedOtp);
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(API_ENDPOINTS.RESET_PASSWORD, {
        email: email,
        otp: otp,
        password: formData.newPassword,
        password_confirmation: formData.confirmPassword,
      });

      if (response.data.success) {
        setMessage('Password reset successfully! Redirecting to login...');
        // Clear sessionStorage
        sessionStorage.removeItem('reset_email');
        sessionStorage.removeItem('verified_otp');
        // Navigate to login page after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError(
        err.response?.data?.error || 'Failed to reset password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="reset-password-header">
            <h2>Reset Password</h2>
            <p>Enter your new password below</p>
          </div>

          <form onSubmit={handleSubmit} className="reset-password-form">
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
              <label htmlFor="newPassword">New Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <span
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <span
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>

          <div className="reset-password-footer">
            <p>
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

export default ResetPassword;
