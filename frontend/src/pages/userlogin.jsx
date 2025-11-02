// src/components/LoginForm.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import "../styles/LoginForm.css";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        API_ENDPOINTS.LOGIN,
        formData,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (
        response.status === 200 &&
        response.data.token &&
        response.data.user
      ) {
        // Save token and user to localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("isLoggedIn", "true");

        alert("Login successful!");
        navigate("/userprofile");
      } else {
        alert(response.data.message || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);

      // Check if email is not verified
      if (error.response?.status === 403 && error.response?.data?.email_verified === false) {
        alert(error.response.data.message || "Please verify your email first.");
        // Navigate to verification page with email
        navigate("/verify-email", { state: { email: error.response.data.email } });
      } else {
        alert(
          error.response?.data?.message ||
            "An error occurred while trying to log in."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-box">
      {/* ✅ Back Button */}
      <button
        className="back-button"
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          padding: "6px 12px",
          backgroundColor: "#eee",
          border: "1px solid #ccc",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        ← Back
      </button>

      <h2>User Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="submit"
          value={loading ? "Logging in..." : "Login"}
          disabled={loading}
        />
      </form>

      <div className="forgot-password-link">
        <Link
          to="/forgot-password"
          state={{ email: formData.email }}
        >
          Forgot Password?
        </Link>
      </div>

      <div className="or-separator">
        <span>OR</span>
      </div>

      <button
        className="social-btn google"
        onClick={() =>
          (window.location.href = API_ENDPOINTS.GOOGLE_REDIRECT)
        }
      >
        <img
          src="https://developers.google.com/static/identity/images/g-logo.png"
          alt="Sign in with Google"
        />
        <p> Sign in with Google</p>
      </button>

      <button
        className="social-btn email"
        onClick={() => alert("Custom Email Sign-In not implemented yet")}
      >
        📧 Sign in with Email
      </button>

      <div className="register-link">
        Don't have an account? <Link to="/register">Register</Link>
      </div>
    </div>
  );
};

export default LoginForm;
