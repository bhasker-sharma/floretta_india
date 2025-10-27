// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Product from './pages/product';
import LivePerfume from './pages/liveperfume';
import ProductDetail from './pages/ProductDetail';
import HotelAmenities from './pages/hotelamenities';
import Userlogin from './pages/userlogin';
import Register from './pages/register';
import Addtocart from './pages/addtocart';
import Carrier from './pages/carrier';
import Contact from './pages/contactus';
import Profile from './pages/userprofile';
import Wishlist from './pages/Wishlist';
import PrivateRoute from './components/PrivateRoute';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AuthCallback from './pages/AuthCallback';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/liveperfume" element={<LivePerfume />} />
        <Route path="/hotel-amenities" element={<HotelAmenities />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/freshner-mist/:id" element={<ProductDetail />} />

        <Route path="/register" element={<Register />} />
        <Route path="/carrier" element={<Carrier />} />
        <Route path="/contactus" element={<Contact />} />
        <Route path="/login" element={<Userlogin />} />
        <Route path="/userlogin" element={<Userlogin />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

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
