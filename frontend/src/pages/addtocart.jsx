import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/footer';
import Navbar from '../components/navbar';
import '../styles/cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginAndFetchCart = async () => {
      try {
        // Step 1: Check if user is logged in
        const checkResponse = await axios.get('http://localhost:8000/api/check-user', {
          withCredentials: true
        });

        const user = checkResponse.data.user;

        // Step 2: Validate user profile
        if (!user || !user.name || !user.email) {
          alert('Please complete your profile to access the cart.');
          return navigate('/profile'); // Redirect to profile page
        }

        // Step 3: Fetch cart
        const cartResponse = await axios.get('http://localhost:8000/api/cart', {
          withCredentials: true
        });

        setCartItems(cartResponse.data.cart || cartResponse.data);
      } catch (error) {
        console.error('User not authenticated or error fetching cart:', error);
        navigate('/admin-login'); // Redirect to login
      } finally {
        setLoading(false);
      }
    };

    checkLoginAndFetchCart();
  }, [navigate]);

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await axios.put(`http://localhost:8000/api/cart/${itemId}`, {
        quantity: newQuantity
      }, { withCredentials: true });

      setCartItems(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity.');
    }
  };

  const handleIncrement = (itemId, currentQuantity) => {
    handleUpdateQuantity(itemId, currentQuantity + 1);
  };

  const handleDecrement = (itemId, currentQuantity) => {
    if (currentQuantity > 1) {
      handleUpdateQuantity(itemId, currentQuantity - 1);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8000/api/cart/${itemId}`, {
        withCredentials: true
      });
      setCartItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item from cart.');
    }
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );
  const deliveryCharge = 0;
  const totalAmount = totalPrice - discount + deliveryCharge;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'SAVE200') {
      setDiscount(200);
    } else {
      setDiscount(0);
    }
  };

  return (
    <>
      <Navbar />
      <div className="cart-page">
        <h2 className="cart-heading">My Cart ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})</h2>
        <div className="cart-wrapper">
          <div className="cart-left">
            {loading ? (
              <p>Loading cart...</p>
            ) : cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              cartItems.map((item, index) => (
                <div className="cart-item" key={index}>
                  <img
                    src={`http://localhost:8000/storage/${item.image_path || item.image}`}
                    alt={item.name}
                    onError={(e) => (e.target.src = '/fallback.jpg')}
                  />
                  <div className="item-info">
                    <p className="brand">Floretta India</p>
                    <h3>{item.name}</h3>
                    <p className="price">
                      RS ₹{Number(item.price).toFixed(2)}{' '}
                      <span className="original">₹{Number(item.original_price).toFixed(2)}</span>
                    </p>
                    <p className="save">
                      SAVE RS. {(Number(item.original_price) - Number(item.price)).toFixed(2)}
                    </p>
                    <div className="qty-row">
                      <button className="qty-btn" onClick={() => handleDecrement(item.id, item.quantity)}>-</button>
                      <span>{item.quantity}</span>
                      <button className="qty-btn" onClick={() => handleIncrement(item.id, item.quantity)}>+</button>
                      <button className="remove" onClick={() => handleRemove(item.id)}>Remove</button>
                    </div>
                  </div>
                </div>
              ))
            )}
            <button className="place-order-wide">PLACE ORDER</button>
          </div>

          <div className="cart-right">
            <div className="promo-code">
              <p>Promo code</p>
              <div className="promo-input">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Type Here"
                />
                <button onClick={handleApplyPromo}>Apply</button>
              </div>
            </div>

            <div className="price-box">
              <h3>Price Details</h3>
              <div className="price-row">
                <span>Price ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="price-row">
                <span>Discount</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
              <div className="price-row">
                <span>Delivery Charges</span>
                <span>{deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge}`}</span>
              </div>
              <hr />
              <div className="price-row total">
                <strong>Total Amount</strong>
                <strong>₹{totalAmount.toFixed(2)}</strong>
              </div>
              {discount > 0 && (
                <p className="saved-note">You will save ₹{discount} on this order</p>
              )}
            </div>

            <button className="place-order-btn">Place Order</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
