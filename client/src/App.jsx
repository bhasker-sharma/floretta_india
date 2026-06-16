import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AuthPage from './pages/AuthPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import TrackingPage from './pages/TrackingPage';
import ContactPage from './pages/ContactPage';
import ShippingPage from './pages/ShippingPage';
import ReturnsPage from './pages/ReturnsPage';
import FAQPage from './pages/FAQPage';
import SustainabilityPage from './pages/SustainabilityPage';
import ComingSoonPage from './pages/ComingSoonPage';
import CareersPage from './pages/CareersPage';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ProductPage />} />
        <Route path="/product/:slug" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/account/profile" element={<ProfilePage />} />
        <Route path="/account/orders" element={<OrdersPage />} />
        <Route path="/account/track" element={<TrackingPage />} />
        <Route path="/account" element={<ProfilePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/shipping" element={<ShippingPage />} />
        <Route path="/returns" element={<ReturnsPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/sustainability" element={<SustainabilityPage />} />
        <Route path="/coming-soon" element={<ComingSoonPage />} />
        <Route path="/careers" element={<CareersPage />} />
      </Routes>
    </Router>
  );
}
