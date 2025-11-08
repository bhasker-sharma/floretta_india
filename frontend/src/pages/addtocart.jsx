import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS, getImageUrl } from "../config/api";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import "../styles/cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [user, setUser] = useState(null);
  const [showAddressSelection, setShowAddressSelection] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [editingAddressIndex, setEditingAddressIndex] = useState(null);
  const [showAddNewForm, setShowAddNewForm] = useState(false);
  const [includeGST, setIncludeGST] = useState(false);
  const [showGSTInput, setShowGSTInput] = useState(false);
  const [gstNumber, setGstNumber] = useState("");
  const [currentStep, setCurrentStep] = useState(1); // 1: Address, 2: GST, 3: Payment
  const [addressForm, setAddressForm] = useState({
    label: "",
    name: "",
    address: "",
    city: "",
    pin: "",
    mobile: "",
  });
  const [addressLoading, setAddressLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkLoginAndFetchCart = async () => {
      try {
        if (!token) {
          alert("Please login to access your cart.");
          return navigate("/login");
        }

        const checkResponse = await axios.get(API_ENDPOINTS.CHECK_USER, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const userData = checkResponse.data.user;
        setUser(userData); // Store user data

        // Initialize GST number if available
        if (userData.gst_number) {
          setGstNumber(userData.gst_number);
        }

        if (!userData || !userData.name || !userData.email) {
          alert("Please complete your profile to access the cart.");
          return navigate("/userprofile");
        }

        const cartResponse = await axios.get(API_ENDPOINTS.CART, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        setCartItems(cartResponse.data.cart || cartResponse.data);
      } catch (error) {
        console.error("User not authenticated or error fetching cart:", error);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkLoginAndFetchCart();
  }, [navigate, token]);

  // Auto-trigger checkout flow when coming from "Buy Now"
  useEffect(() => {
    const shouldAutoCheckout = searchParams.get("checkout") === "true";

    if (shouldAutoCheckout && !loading && cartItems.length > 0 && user) {
      // Wait a bit for the cart to render, then trigger checkout
      const timer = setTimeout(() => {
        handlePlaceOrder();
      }, 500);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, loading, cartItems, user]);

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await axios.put(
        API_ENDPOINTS.CART_UPDATE(itemId),
        {
          quantity: newQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      setCartItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity.");
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
      await axios.delete(API_ENDPOINTS.CART_DELETE(itemId), {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item from cart.");
    }
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );
  const deliveryCharge = 0;
  const totalAmount = totalPrice - discount + deliveryCharge;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === "SAVE200") {
      setDiscount(200);
    } else {
      setDiscount(0);
    }
  };

  // Helper functions for address management
  const parseAddress = (jsonString) => {
    if (!jsonString) return null;
    try {
      return JSON.parse(jsonString);
    } catch {
      return null;
    }
  };

  const getAllAddresses = () => {
    const addresses = [];
    for (let i = 1; i <= 5; i++) {
      const addr = parseAddress(user?.[`address${i}`]);
      if (addr) {
        addresses.push({ index: i, ...addr });
      }
    }
    return addresses;
  };

  const getSelectedAddress = () => {
    if (selectedAddressIndex) {
      return parseAddress(user[`address${selectedAddressIndex}`]);
    }
    // Use default address index if available
    const defaultIndex = user?.default_address_index || 1;
    return parseAddress(user?.[`address${defaultIndex}`]);
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

  const handleAddressFormChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveAddress = async () => {
    // Validate form
    if (!addressForm.name || addressForm.name.trim().length < 2) {
      alert("Please enter a valid name (minimum 2 characters)");
      return;
    }
    if (!addressForm.address || addressForm.address.trim().length < 5) {
      alert("Please enter a valid address (minimum 5 characters)");
      return;
    }
    if (!addressForm.mobile || addressForm.mobile.trim().length < 10) {
      alert("Please enter a valid mobile number (minimum 10 digits)");
      return;
    }
    if (!addressForm.city || !addressForm.pin) {
      alert("Please enter city and PIN code");
      return;
    }

    setAddressLoading(true);
    try {
      let targetIndex = editingAddressIndex;

      // If adding new address, find first empty slot
      if (!targetIndex) {
        for (let i = 1; i <= 5; i++) {
          if (!user[`address${i}`]) {
            targetIndex = i;
            break;
          }
        }
        if (!targetIndex) {
          alert(
            "All 5 address slots are full. Please delete an address from your profile first."
          );
          setAddressLoading(false);
          return;
        }
      }

      const addressData = {
        [`address${targetIndex}`]: JSON.stringify(addressForm),
      };

      await axios.post(API_ENDPOINTS.UPDATE_PROFILE, addressData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      // Update local user state
      setUser((prev) => ({
        ...prev,
        [`address${targetIndex}`]: JSON.stringify(addressForm),
      }));

      // Select this address
      setSelectedAddressIndex(targetIndex);
      setEditingAddressIndex(null);
      setShowAddNewForm(false);

      // Reset form
      setAddressForm({
        label: "",
        name: "",
        address: "",
        city: "",
        pin: "",
        mobile: "",
      });

      alert("Address saved successfully!");
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Failed to save address. Please try again.");
    } finally {
      setAddressLoading(false);
    }
  };

  const handleSelectAddress = async (index) => {
    setSelectedAddressIndex(index);

    // Update default address index in backend
    try {
      await axios.post(
        API_ENDPOINTS.UPDATE_PROFILE,
        {
          default_address_index: index,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      setUser((prev) => ({
        ...prev,
        default_address_index: index,
      }));
    } catch (error) {
      console.error("Error updating default address:", error);
    }
  };

  const openEditAddress = (index) => {
    const addr = parseAddress(user[`address${index}`]);
    if (addr) {
      setAddressForm(addr);
      setEditingAddressIndex(index);
    }
  };

  const handleCancelEdit = () => {
    setEditingAddressIndex(null);
    setShowAddNewForm(false);
    setAddressForm({
      label: "",
      name: "",
      address: "",
      city: "",
      pin: "",
      mobile: "",
    });
  };

  const handlePlaceOrder = () => {
    // Check if user has any addresses
    const addresses = getAllAddresses();

    // Set default selected address if not already set and addresses exist
    if (addresses.length > 0 && !selectedAddressIndex) {
      const defaultIndex = user?.default_address_index || 1;
      setSelectedAddressIndex(defaultIndex);
    }

    // Show address selection modal and set step to 1 (even if no addresses exist)
    setCurrentStep(1);
    setShowAddressSelection(true);
  };

  const proceedToInvoice = () => {
    const selectedAddr = getSelectedAddress();
    if (!selectedAddr) {
      alert("Please select a delivery address");
      return;
    }

    // Close address selection and open GST input, move to step 2
    setCurrentStep(2);
    setShowAddressSelection(false);
    setShowGSTInput(true);
  };

  const goBackToAddressSelection = () => {
    // Go back to address selection from GST
    setCurrentStep(1);
    setShowGSTInput(false);
    setShowAddressSelection(true);
  };

  const proceedFromGSTToPayment = async () => {
    // If user entered GST number, save it to profile
    if (gstNumber && gstNumber.trim() !== "") {
      try {
        await axios.post(
          API_ENDPOINTS.UPDATE_PROFILE,
          {
            gst_number: gstNumber.trim(),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        // Update local user state
        setUser((prev) => ({
          ...prev,
          gst_number: gstNumber.trim(),
        }));
        setIncludeGST(true);
      } catch (error) {
        console.error("Error saving GST number:", error);
      }
    }

    // Close GST modal and proceed to payment, move to step 3
    setCurrentStep(3);
    setShowGSTInput(false);
    proceedToPayment();
  };

  const skipGSTAndProceed = () => {
    setIncludeGST(false);
    setCurrentStep(3);
    setShowGSTInput(false);
    proceedToPayment();
  };

  const proceedToPayment = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    const selectedAddr = getSelectedAddress();
    if (!selectedAddr) {
      alert("Please select a delivery address");
      return;
    }

    // Get fresh token from localStorage
    const currentToken = localStorage.getItem("token");
    if (!currentToken) {
      alert("Please login to continue");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        API_ENDPOINTS.RAZORPAY_CREATE_ORDER,
        {
          amount: totalAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
            Accept: "application/json",
          },
        }
      );

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
              alert("User information not available");
              return;
            }
            const minimalOrderItems = cartItems.map((item) => ({
              id: item.product_id, // Use product_id instead of cart id
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            }));

            // Format address string
            const addressString = `${selectedAddr.address}, ${selectedAddr.city} - ${selectedAddr.pin}`;

            // Show success popup immediately (optimistic UI)
            setShowSuccessPopup(true);
            // Clear cart immediately in UI
            setCartItems([]);

            // Automatically close popup and redirect after 3 seconds
            setTimeout(() => {
              setShowSuccessPopup(false);
            }, 3000);

            // Get fresh token for background requests
            const currentToken = localStorage.getItem("token");

            // Verify payment and clear cart in background (don't wait)
            Promise.all([
              axios.post(
                API_ENDPOINTS.RAZORPAY_VERIFY,
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  user_id: user.id,
                  customer_name: selectedAddr.name,
                  customer_email: user.email,
                  customer_phone: selectedAddr.mobile,
                  customer_address: addressString,
                  order_value: totalAmount,
                  order_quantity: cartItems.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  ),
                  order_items: minimalOrderItems,
                  include_gst: includeGST,
                },
                {
                  headers: {
                    Authorization: `Bearer ${currentToken}`,
                    Accept: "application/json",
                  },
                }
              ),
              axios.delete(API_ENDPOINTS.CART_CLEAR, {
                headers: {
                  Authorization: `Bearer ${currentToken}`,
                  Accept: "application/json",
                },
              }),
            ]).catch((err) => {
              console.error("Background verification error:", err);
              // Don't show error to user since payment was successful
            });
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
      console.error("Error placing order:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  // Paginator component
  const StepPaginator = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "20px",
        gap: "10px",
      }}
    >
      {[1, 2, 3].map((step) => (
        <div key={step} style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: currentStep >= step ? "#f37254" : "#ddd",
              color: currentStep >= step ? "#fff" : "#666",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            {step}
          </div>
          <div
            style={{
              marginLeft: "8px",
              fontSize: "14px",
              fontWeight: currentStep === step ? "bold" : "normal",
              color: currentStep >= step ? "#333" : "#999",
            }}
          >
            {step === 1 ? "Address" : step === 2 ? "GST Info" : "Payment"}
          </div>
          {step < 3 && (
            <div
              style={{
                width: "50px",
                height: "2px",
                backgroundColor: currentStep > step ? "#f37254" : "#ddd",
                marginLeft: "10px",
                marginRight: "10px",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="cart-page">
        <h2 className="cart-heading">
          My Cart ({cartItems.length} item{cartItems.length !== 1 ? "s" : ""})
        </h2>
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
                    src={getImageUrl(item.image_path || item.image)}
                    alt={item.name}
                    onError={(e) => (e.target.src = "/fallback.jpg")}
                  />
                  <div className="item-info">
                    <p className="brand">Floretta India</p>
                    <h3>{item.name}</h3>
                    <p className="price">
                      RS ₹{Number(item.price).toFixed(2)}{" "}
                      <span className="original">
                        ₹{Number(item.original_price).toFixed(2)}
                      </span>
                    </p>
                    <p className="save">
                      SAVE RS.{" "}
                      {(
                        Number(item.original_price) - Number(item.price)
                      ).toFixed(2)}
                    </p>
                    <div className="qty-row">
                      <button
                        className="qty-btn"
                        onClick={() => handleDecrement(item.id, item.quantity)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => handleIncrement(item.id, item.quantity)}
                      >
                        +
                      </button>
                      <button
                        className="remove"
                        onClick={() => handleRemove(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
            <button className="place-order-wide" onClick={handlePlaceOrder}>
              PLACE ORDER
            </button>
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
                <span>
                  Price ({cartItems.length} item
                  {cartItems.length !== 1 ? "s" : ""})
                </span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="price-row">
                <span>Discount</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
              <div className="price-row">
                <span>Delivery Charges</span>
                <span>
                  {deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}
                </span>
              </div>
              <hr />
              <div className="price-row total">
                <strong>Total Amount</strong>
                <strong>₹{totalAmount.toFixed(2)}</strong>
              </div>
              {discount > 0 && (
                <p className="saved-note">
                  You will save ₹{discount} on this order
                </p>
              )}
            </div>

            <button className="place-order-btn" onClick={handlePlaceOrder}>
              Place Order
            </button>
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
                  <span>
                    {item.name} × {item.quantity}
                  </span>
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
            <div className="gst-checkbox-container">
              <label className="gst-checkbox-label">
                <input
                  type="checkbox"
                  checked={includeGST}
                  onChange={(e) => setIncludeGST(e.target.checked)}
                />
                <span>Include GST details in invoice</span>
              </label>
              {includeGST && user?.gst_number && (
                <p className="gst-number-display">
                  GST Number: {user.gst_number}
                </p>
              )}
            </div>
            <div className="invoice-actions">
              <button
                onClick={() => setShowInvoice(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button onClick={proceedToPayment} className="pay-btn">
                Pay Now
              </button>
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

      {/* GST Number Input Modal */}
      {showGSTInput && (
        <div className="invoice-backdrop">
          <div className="invoice-modal" style={{ maxWidth: "500px" }}>
            <StepPaginator />
            <h2>GST Information</h2>
            <p
              style={{ marginBottom: "20px", color: "#666", fontSize: "14px" }}
            >
              Would you like to add a GST number to your invoice? This is
              optional.
            </p>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "bold",
                }}
              >
                GST Number (Optional)
              </label>
              <input
                type="text"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                placeholder="Enter GST Number (e.g., 22AAAAA0000A1Z5)"
                maxLength="15"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  fontSize: "14px",
                  textTransform: "uppercase",
                }}
              />
              <small
                style={{
                  color: "#666",
                  fontSize: "12px",
                  marginTop: "5px",
                  display: "block",
                }}
              >
                GST format: 15 characters (e.g., 22AAAAA0000A1Z5)
              </small>
            </div>

            <div
              className="invoice-actions"
              style={{ marginTop: "20px", display: "flex", gap: "10px" }}
            >
              <button
                onClick={goBackToAddressSelection}
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "1px solid #ddd",
                  background: "#fff",
                  color: "#666",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                ← Back
              </button>
              <button
                onClick={skipGSTAndProceed}
                className="cancel-btn"
                style={{ flex: 1 }}
              >
                Skip
              </button>
              <button
                onClick={proceedFromGSTToPayment}
                className="pay-btn"
                style={{ flex: 1 }}
              >
                {gstNumber ? "Save & Continue" : "Continue"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Address Selection Modal */}
      {showAddressSelection && (
        <div className="invoice-backdrop">
          <div
            className="invoice-modal"
            style={{ maxWidth: "600px", maxHeight: "80vh", overflowY: "auto" }}
          >
            <StepPaginator />
            <h2>Select Delivery Address</h2>

            {/* Display all saved addresses */}
            <div style={{ marginBottom: "20px" }}>
              {getAllAddresses().length === 0 ? (
                <p
                  style={{
                    textAlign: "center",
                    color: "#666",
                    padding: "20px",
                  }}
                >
                  No addresses saved. Please add an address using the button
                  below.
                </p>
              ) : (
                getAllAddresses().map((addr) => (
                  <div
                    key={addr.index}
                    style={{
                      border:
                        selectedAddressIndex === addr.index
                          ? "2px solid #f37254"
                          : "1px solid #ddd",
                      padding: "15px",
                      marginBottom: "10px",
                      borderRadius: "8px",
                      backgroundColor:
                        selectedAddressIndex === addr.index
                          ? "#fff5f2"
                          : "#f9f9f9",
                      cursor: "pointer",
                      position: "relative",
                    }}
                  >
                    <div onClick={() => handleSelectAddress(addr.index)}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "8px",
                        }}
                      >
                        <strong style={{ fontSize: "16px" }}>
                          {addr.label || "Address"}
                        </strong>
                        {selectedAddressIndex === addr.index && (
                          <span
                            style={{ color: "#f37254", fontWeight: "bold" }}
                          >
                            ✓ Selected
                          </span>
                        )}
                      </div>
                      <p style={{ margin: "5px 0", fontSize: "14px" }}>
                        <strong>{addr.name}</strong>
                      </p>
                      <p
                        style={{
                          margin: "5px 0",
                          fontSize: "14px",
                          color: "#666",
                        }}
                      >
                        {addr.address}
                      </p>
                      <p
                        style={{
                          margin: "5px 0",
                          fontSize: "14px",
                          color: "#666",
                        }}
                      >
                        {addr.city} - {addr.pin}
                      </p>
                      <p
                        style={{
                          margin: "5px 0",
                          fontSize: "14px",
                          color: "#666",
                        }}
                      >
                        Phone: {addr.mobile}
                      </p>
                    </div>
                    {editingAddressIndex !== addr.index && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditAddress(addr.index);
                        }}
                        style={{
                          marginTop: "10px",
                          padding: "8px 16px",
                          border: "1px solid #f37254",
                          background: "#fff",
                          color: "#f37254",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "14px",
                        }}
                      >
                        Edit
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Add/Edit Address Form */}
            {editingAddressIndex !== null ? (
              <div
                style={{
                  border: "2px solid #f37254",
                  padding: "20px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  backgroundColor: "#fff5f2",
                }}
              >
                <h3 style={{ marginBottom: "15px" }}>Edit Address</h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <input
                    type="text"
                    name="label"
                    value={addressForm.label}
                    onChange={handleAddressFormChange}
                    placeholder="Label (e.g., Home, Office)"
                    style={{
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <input
                    type="text"
                    name="name"
                    value={addressForm.name}
                    onChange={handleAddressFormChange}
                    placeholder="Full Name *"
                    required
                    style={{
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <textarea
                    name="address"
                    value={addressForm.address}
                    onChange={handleAddressFormChange}
                    placeholder="Street Address *"
                    required
                    rows="3"
                    style={{
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <input
                    type="text"
                    name="city"
                    value={addressForm.city}
                    onChange={handleAddressFormChange}
                    placeholder="City *"
                    required
                    style={{
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <input
                    type="text"
                    name="pin"
                    value={addressForm.pin}
                    onChange={handleAddressFormChange}
                    placeholder="PIN Code *"
                    required
                    style={{
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <input
                    type="text"
                    name="mobile"
                    value={addressForm.mobile}
                    onChange={handleAddressFormChange}
                    placeholder="Mobile Number *"
                    required
                    style={{
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={handleCancelEdit}
                      className="cancel-btn"
                      style={{ flex: 1 }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveAddress}
                      disabled={addressLoading}
                      className="pay-btn"
                      style={{ flex: 1 }}
                    >
                      {addressLoading ? "Saving..." : "Update Address"}
                    </button>
                  </div>
                </div>
              </div>
            ) : showAddNewForm ? (
              <div
                style={{
                  border: "2px dashed #ddd",
                  padding: "20px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                }}
              >
                <h3 style={{ marginBottom: "15px" }}>Add New Address</h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <input
                    type="text"
                    name="label"
                    value={addressForm.label}
                    onChange={handleAddressFormChange}
                    placeholder="Label (e.g., Home, Office)"
                    style={{
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <input
                    type="text"
                    name="name"
                    value={addressForm.name}
                    onChange={handleAddressFormChange}
                    placeholder="Full Name *"
                    required
                    style={{
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <textarea
                    name="address"
                    value={addressForm.address}
                    onChange={handleAddressFormChange}
                    placeholder="Street Address *"
                    required
                    rows="3"
                    style={{
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <input
                    type="text"
                    name="city"
                    value={addressForm.city}
                    onChange={handleAddressFormChange}
                    placeholder="City *"
                    required
                    style={{
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <input
                    type="text"
                    name="pin"
                    value={addressForm.pin}
                    onChange={handleAddressFormChange}
                    placeholder="PIN Code *"
                    required
                    style={{
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <input
                    type="text"
                    name="mobile"
                    value={addressForm.mobile}
                    onChange={handleAddressFormChange}
                    placeholder="Mobile Number *"
                    required
                    style={{
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={handleCancelEdit}
                      className="cancel-btn"
                      style={{ flex: 1 }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveAddress}
                      disabled={addressLoading}
                      className="pay-btn"
                      style={{ flex: 1 }}
                    >
                      {addressLoading ? "Saving..." : "Save Address"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              getAllAddresses().length < 5 && (
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <button
                    onClick={() => {
                      setShowAddNewForm(true);
                      setAddressForm({
                        label: "",
                        name: "",
                        address: "",
                        city: "",
                        pin: "",
                        mobile: "",
                      });
                    }}
                    style={{
                      padding: "12px 24px",
                      border: "2px dashed #f37254",
                      background: "#fff",
                      color: "#f37254",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    + Add New Address
                  </button>
                </div>
              )
            )}

            <div className="invoice-actions" style={{ marginTop: "20px" }}>
              <button
                onClick={() => {
                  setShowAddressSelection(false);
                  handleCancelEdit();
                }}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button
                onClick={proceedToInvoice}
                className="pay-btn"
                disabled={!selectedAddressIndex}
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Cart;
