import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '../components/footer';
import Navbar from '../components/navbar';
import '../styles/cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/cart');
        setCartItems(response.data.cart || response.data);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );
  const totalOriginal = cartItems.reduce(
    (acc, item) => acc + Number(item.original_price || 0) * Number(item.quantity || 1),
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
const handleRemove = async (itemId) => {
  try {
    await axios.delete(`http://localhost:8000/api/cart/${itemId}`);
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  } catch (error) {
    console.error('Error removing item:', error);
    alert('Failed to remove item from cart.');
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
                      <button className="qty-btn">-</button>
                      <span>{item.quantity}</span>
                      <button className="qty-btn">+</button>
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
