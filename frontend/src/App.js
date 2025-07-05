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
        {/* <Route path="/admin-login" element={<Userlogin />} /> */}
        <Route path="/register" element={<Register />} />
        <Route path="/addtocart" element={<Addtocart />} />
        <Route path="/carrier" element={<Carrier />} />
        <Route path="/contactus" element={<Contact />} />
        <Route path="/userprofile" element={<Profile />} />
      <Route path="/login" element={<Userlogin />} />

      </Routes>
    </Router>
  );
};

export default App;
