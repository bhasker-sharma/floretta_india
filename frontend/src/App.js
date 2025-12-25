// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Product from "./pages/product";
import LivePerfume from "./pages/liveperfume";
import ProductDetail from "./pages/ProductDetail";
import HotelAmenities from "./pages/hotelamenities";
import Userlogin from "./pages/userlogin";
import Register from "./pages/register";
import Addtocart from "./pages/addtocart";
import Carrier from "./pages/carrier";
import Contact from "./pages/contactus";
import Profile from "./pages/userprofile";
import Wishlist from "./pages/Wishlist";
import PrivateRoute from "./components/PrivateRoute";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminReviews from "./pages/AdminReviews";
import AdminBlogs from "./pages/AdminBlogs";
import AuthCallback from "./pages/AuthCallback";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import ShippingPolicy from "./pages/ShippingPolicy";
import RefundReturnPolicy from "./pages/RefundReturnPolicy";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import BlogEditor from "./pages/BlogEditor";

import { initializeAuth } from "./utils/axiosInterceptor";

const App = () => {
  // Initialize axios interceptors on app load
  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/liveperfume" element={<LivePerfume />} />
        <Route path="/hotel-amenities" element={<HotelAmenities />} />
        <Route path="/blogs" element={<Blog />} />
        {/* Pure Slug Route */}
        <Route path="/blogs/:slug" element={<BlogDetail />} />
        {/* Fallback for ID (optional, can be removed if not needed) */}
        {/* <Route path="/blogs/:id" element={<BlogDetail />} /> */}

        <Route path="/product" element={<Product />} />

        {/* We use specific routes first to avoid conflict if needed, but here structure is simple */}

        {/* Pure Slug Route for Products */}
        <Route path="/product/:slug" element={<ProductDetail />} />

        <Route path="/freshner-mist/:id" element={<ProductDetail />} />

        <Route path="/register" element={<Register />} />
        <Route path="/carrier" element={<Carrier />} />

        <Route path="/contactus" element={<Contact />} />
        <Route path="/login" element={<Userlogin />} />
        <Route path="/userlogin" element={<Userlogin />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Email Verification Route */}
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Password Reset Routes */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Policy Pages */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/refund-policy" element={<RefundReturnPolicy />} />

        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/reviews" element={<AdminReviews />} />
        <Route path="/admin/blogs" element={<AdminBlogs />} />
        <Route path="/admin/blogs/new" element={<BlogEditor />} />
        <Route path="/admin/blogs/edit/:id" element={<BlogEditor />} />

        {/* 🔒 Protected Routes */}
        <Route
          path="/addtocart"
          element={
            <PrivateRoute>
              <Addtocart />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Addtocart />
            </PrivateRoute>
          }
        />
        <Route
          path="/userprofile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <PrivateRoute>
              <Wishlist />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
