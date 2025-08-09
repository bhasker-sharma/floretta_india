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
  const [showInvoice, setShowInvoice] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    const checkLoginAndFetchCart = async () => {
      try {
        if (!token) {
          alert('Please login to access your cart.');
          return navigate('/login');
        }

        const checkResponse = await axios.get('http://localhost:8000/api/check-user', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          }
        });

        const userData = checkResponse.data.user;
        setUser(userData);// Store user data

        if (!userData || !userData.name || !userData.email) {
          alert('Please complete your profile to access the cart.');
          return navigate('/userprofile');
        }

        const cartResponse = await axios.get('http://localhost:8000/api/cart', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          }
        });

        setCartItems(cartResponse.data.cart || cartResponse.data);
      } catch (error) {
        console.error('User not authenticated or error fetching cart:', error);
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkLoginAndFetchCart();
  }, [navigate, token]);

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await axios.put(`http://localhost:8000/api/cart/${itemId}`, {
        quantity: newQuantity
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        }
      });

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
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        }
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

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/razorpay/create-order', {
        amount: totalAmount
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        }
      });

      const { order_id, key, amount, currency } = response.data;

      const options = {
        key: key,
        amount,
        currency,
        name: "Floretta India",
        description: "Order Payment",
        order_id: order_id,
        handler: async function (response) {
              try {
                if (!user) {
                  alert('User information not available');
                  return;
                }
            await axios.post('http://localhost:8000/api/razorpay/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              user_id: user.id, 
              customer_name: user.name,
              customer_email: user.email,
              customer_phone: user.mobile,
              customer_address: user.address,
              order_value: totalAmount,
              order_quantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
              order_items: cartItems
            }, {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
              }
            });
            
          // Show success popup
          setShowSuccessPopup(true);
          // Clear cart after successful order
          setCartItems([]);
          // Automatically close popup and redirect after 3 seconds
          setTimeout(() => {
            setShowSuccessPopup(false);
            navigate('/thankyou');
          },3000);

          } catch (err) {
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: "Customer",
          email: "", // You can prefill user email if you fetch it
        },
        theme: {
          color: "#f37254",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Error placing order:', error);
      alert('Something went wrong. Please try again.');
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
            <button className="place-order-wide" onClick={() => setShowInvoice(true)}>PLACE ORDER</button>
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

            <button className="place-order-btn" onClick={() => setShowInvoice(true)}>Place Order</button>
          </div>
        </div>
      </div>

      {showInvoice && (
        <div className="invoice-backdrop">
          <div className="invoice-modal">
            <h2>Invoice Summary</h2>
            <div className="invoice-content">
              {cartItems.map((item) => (
                <div key={item.id} className="invoice-item">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <hr />
              <div className="invoice-row">
                <strong>Subtotal</strong>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="invoice-row">
                <strong>Discount</strong>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
              <div className="invoice-row total">
                <strong>Total</strong>
                <strong>₹{totalAmount.toFixed(2)}</strong>
              </div>
            </div>
            <div className="invoice-actions">
              <button onClick={() => setShowInvoice(false)} className="cancel-btn">Cancel</button>
              <button onClick={() => { setShowInvoice(false); handlePlaceOrder(); }} className="pay-btn">Pay Now</button>
            </div>
          </div>
        </div>
      )}
      
      {showSuccessPopup && (
        <div className="success-popup-backdrop">
          <div className="success-popup">
            <div className="success-icon">✓</div>
            <h2>Order Placed Successfully!</h2>
            <p>Thank you for shopping with us.</p>
            <p>Your order has been confirmed.</p>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Cart;
