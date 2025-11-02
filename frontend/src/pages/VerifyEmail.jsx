import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import "../styles/LoginForm.css";

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(600); // 10 minutes

  useEffect(() => {
    // Get email from navigation state
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      alert("Email not found. Please register again.");
      navigate("/register");
    }
  }, [location, navigate]);

  useEffect(() => {
    // Countdown timer
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        API_ENDPOINTS.VERIFY_EMAIL_OTP,
        { email, otp },
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      const { token, user } = response.data;

      // Save token to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", "true");

      alert("Email verified successfully!");
      navigate("/userprofile");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert(
        error.response?.data?.message ||
          "Verification failed. Please check your OTP and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);
    try {
      const response = await axios.post(
        API_ENDPOINTS.RESEND_OTP,
        { email },
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      alert(response.data.message || "OTP has been resent to your email.");
      setTimer(600); // Reset timer to 10 minutes
      setOtp(""); // Clear OTP input
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert(
        error.response?.data?.message ||
          "Failed to resend OTP. Please try again."
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleVerify}>
        <h2>Verify Your Email</h2>
        <p style={{ color: "#666", marginBottom: "20px", fontSize: "14px" }}>
          We have sent a 6-digit verification code to <strong>{email}</strong>
        </p>

        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          maxLength="6"
          required
          style={{
            letterSpacing: "8px",
            fontSize: "24px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        />

        <div
          style={{
            textAlign: "center",
            margin: "15px 0",
            fontSize: "14px",
            color: timer > 0 ? "#666" : "#f37254",
          }}
        >
          {timer > 0 ? (
            <p>OTP expires in: <strong>{formatTime(timer)}</strong></p>
          ) : (
            <p style={{ color: "#f37254" }}>OTP has expired!</p>
          )}
        </div>

        <button type="submit" disabled={loading || timer === 0}>
          {loading ? "Verifying..." : "Verify Email"}
        </button>

        <div
          style={{
            marginTop: "15px",
            textAlign: "center",
            fontSize: "14px",
          }}
        >
          <p style={{ color: "#666" }}>
            Did not receive the code?{" "}
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resending}
              style={{
                background: "none",
                border: "none",
                color: "#f37254",
                textDecoration: "underline",
                cursor: resending ? "not-allowed" : "pointer",
                padding: 0,
                fontSize: "14px",
              }}
            >
              {resending ? "Resending..." : "Resend OTP"}
            </button>
          </p>
        </div>

        <p style={{ marginTop: "20px" }}>
          <a href="/login">Back to Login</a>
        </p>
      </form>
    </div>
  );
}

export default VerifyEmail;

