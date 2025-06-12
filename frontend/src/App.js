// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Product from './pages/product';
import LivePerfume from './pages/liveperfume';
import ProductDetail from './pages/ProductDetail';
import HotelAmenities from './pages/hotelamenities';
import AdminLogin from './pages/AdminLogin';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/liveperfume" element={<LivePerfume />} />
        <Route path="/hotel-amenities" element={<HotelAmenities />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/freshner-mist/:id" element={<ProductDetail />} /> {/* New route */}
        <Route path="/admin" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
};

export default App;
