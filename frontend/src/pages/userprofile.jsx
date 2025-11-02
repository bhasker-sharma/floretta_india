// src/components/UserProfile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS, getImageUrl } from "../config/api";
import Navbar from "../components/navbar";
import "../styles/userprofile.css";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [showNoAddressPopup, setShowNoAddressPopup] = useState(
    !selectedAddress
  );
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    axios
      .get(API_ENDPOINTS.USER_PROFILE, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        setFormData(res.data);

        // Default to address1 if available
        const defaultAddr = res.data.address1 || res.data.address || "";
        setSelectedAddress(defaultAddr);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError("Something went wrong!");
        }
      });
  }, [navigate, token]);

  useEffect(() => {
    setShowNoAddressPopup(!selectedAddress);
  }, [selectedAddress]);

  useEffect(() => {
    if (showOrders) {
      setOrdersLoading(true);
      axios
        .get(API_ENDPOINTS.MY_ORDERS, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setOrders(res.data))
        .catch(() => setOrders([]))
        .finally(() => setOrdersLoading(false));
    }
  }, [showOrders, token]);

  // Optional: persist selected address to localStorage
  // useEffect(() => {
  //   if (selectedAddress) {
  //     localStorage.setItem('selectedAddress', selectedAddress);
  //   }
  // }, [selectedAddress]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewAddressChange = (e) => {
    setNewAddress(e.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const handleAddNewAddress = () => {
    for (let i = 1; i <= 5; i++) {
      const key = `address${i}`;
      if (!formData[key]) {
        setFormData((prev) => ({
          ...prev,
          [key]: newAddress,
        }));
        break;
      }
    }
    setShowAddressPopup(false);
    setNewAddress("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filter out null, undefined, and non-string values
      const cleanedData = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          cleanedData[key] = value;
        }
      });

      const res = await axios.post(
        API_ENDPOINTS.UPDATE_PROFILE,
        cleanedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const updatedUser = res.data.user;
      setUser(updatedUser);
      setFormData(updatedUser);
      setEditMode(false);
      // Set selectedAddress to the updated main address
      if (updatedUser.address) {
        setSelectedAddress(updatedUser.address);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div>{error}</div>;
  if (!user) return <div>Loading...</div>;

  // Generate Invoice for individual order
  const generateInvoice = (order) => {
    const invoiceWindow = window.open("", "", "height=800,width=600");

    const invoiceHTML = `
            <html>
            <head>
                <title>Invoice - ${order.order_number}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 40px;
                        color: #333;
                    }
                    .invoice-header {
                        text-align: center;
                        margin-bottom: 30px;
                        border-bottom: 3px solid #232946;
                        padding-bottom: 20px;
                    }
                    .invoice-header h1 {
                        color: #232946;
                        margin: 0;
                        font-size: 32px;
                    }
                    .invoice-header p {
                        margin: 5px 0;
                        color: #666;
                    }
                    .invoice-details {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 30px;
                    }
                    .invoice-details div {
                        flex: 1;
                    }
                    .invoice-details h3 {
                        color: #232946;
                        margin-bottom: 10px;
                        font-size: 14px;
                        text-transform: uppercase;
                        border-bottom: 2px solid #eee;
                        padding-bottom: 5px;
                    }
                    .invoice-details p {
                        margin: 5px 0;
                        font-size: 13px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    th {
                        background-color: #232946;
                        color: white;
                        padding: 12px;
                        text-align: left;
                        font-size: 13px;
                    }
                    td {
                        padding: 10px 12px;
                        border-bottom: 1px solid #ddd;
                        font-size: 13px;
                    }
                    tr:hover {
                        background-color: #f9f9f9;
                    }
                    .total-section {
                        text-align: right;
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 2px solid #232946;
                    }
                    .total-section p {
                        margin: 8px 0;
                        font-size: 14px;
                    }
                    .total-section .grand-total {
                        font-size: 20px;
                        font-weight: bold;
                        color: #232946;
                        margin-top: 15px;
                    }
                    .invoice-footer {
                        text-align: center;
                        margin-top: 50px;
                        padding-top: 20px;
                        border-top: 1px solid #ddd;
                        color: #666;
                        font-size: 12px;
                    }
                    .status-badge {
                        display: inline-block;
                        padding: 4px 12px;
                        border-radius: 12px;
                        font-size: 11px;
                        font-weight: bold;
                    }
                    .status-pending {
                        background-color: #fff3cd;
                        color: #856404;
                    }
                    .status-processing {
                        background-color: #cfe2ff;
                        color: #084298;
                    }
                    .status-completed {
                        background-color: #d1e7dd;
                        color: #0f5132;
                    }
                    .status-cancelled {
                        background-color: #f8d7da;
                        color: #842029;
                    }
                    @media print {
                        body { padding: 20px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="invoice-header">
                    <h1>FLORETTA INDIA</h1>
                    <p>Premium Fragrances & Amenities</p>
                    <p style="font-size: 11px; margin-top: 10px;"><strong>GST No:</strong> 05ANWPK8158L1Z4</p>
                    <p style="font-size: 14px; margin-top: 15px; font-weight: bold;">INVOICE</p>
                </div>

                <div class="invoice-details">
                    <div>
                        <h3>Invoice Details</h3>
                        <p><strong>Invoice #:</strong> ${order.order_number}</p>
                        <p><strong>Order Date:</strong>
                         ${new Date(
                           order.created_at
                         ).toLocaleDateString()}<br />
                         </p>
                         <P>
                         <strong>Order Time:</strong>
                         ${new Date(order.created_at).toLocaleTimeString()}
                         </P>
                        <p><strong>Status:</strong> <span class="status-badge status-${order.status?.toLowerCase()}">${
      order.status || "Pending"
    }</span></p>
                    </div>
                    <div>
                        <h3>Customer Details</h3>
                        <p><strong>Name:</strong> ${
                          order.customer_name || "N/A"
                        }</p>
                        <p><strong>Email:</strong> ${
                          order.customer_email || "N/A"
                        }</p>
                        <p><strong>Phone:</strong> ${
                          order.customer_phone || "N/A"
                        }</p>
                        <p><strong>Address:</strong> ${
                          order.customer_address || "N/A"
                        }</p>
                        ${
                          order.include_gst && user.gst_number
                            ? `<p><strong>GST Number:</strong> ${user.gst_number}</p>`
                            : ""
                        }
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th style="width: 60px; text-align: center;">S.No</th>
                            <th>Item</th>
                            <th style="text-align: center;">Quantity</th>
                            <th style="text-align: right;">Unit Price</th>
                            <th style="text-align: right;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${
                          order.order_items &&
                          order.order_items
                            .map(
                              (item, idx) => `
                            <tr>
                                <td style="text-align: center;">${idx + 1}</td>
                                <td>${item.name || item.product_name}</td>
                                <td style="text-align: center;">${
                                  item.quantity
                                }</td>
                                <td style="text-align: right;">₹${parseFloat(
                                  item.price || 0
                                ).toFixed(2)}</td>
                                <td style="text-align: right;">₹${(
                                  parseFloat(item.price || 0) *
                                  parseInt(item.quantity || 0)
                                ).toFixed(2)}</td>
                            </tr>
                        `
                            )
                            .join("")
                        }
                    </tbody>
                </table>

                <div class="total-section">
                    <p><strong>Subtotal:</strong> ₹${parseFloat(
                      order.order_value || 0
                    ).toFixed(2)}</p>
                    <p><strong>Tax (0%):</strong> ₹0.00</p>
                    <p><strong>Shipping:</strong> ₹0.00</p>
                    <p class="grand-total">Grand Total: ₹${parseFloat(
                      order.order_value || 0
                    ).toFixed(2)}</p>
                </div>

                <div class="invoice-footer">
                    <p><strong>Floretta India</strong></p>
                    <p>Your Trusted Fragrance Partner</p>
                    <p style="margin-top: 10px;"><strong>Address:</strong> Sarswati Puram Colony, Near Dikhshalya Institute</p>
                    <p>Khankhal, Haridwar, Uttarakhand - 249408</p>
                    <p style="margin-top: 10px;">Phone: +91 9639970148 | Email: florettaindia@gmail.com</p>
                    <p>Website: www.florettaindia.com</p>
                    <p style="margin-top: 15px;">Thank you for your business!</p>
                    <p style="margin-top: 10px;">This is a computer-generated invoice and does not require a signature.</p>
                </div>

                <div class="no-print" style="text-align: center; margin-top: 30px;">
                    <button onclick="window.print()" style="padding: 10px 30px; background-color: #232946; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px;">
                        Print Invoice
                    </button>
                    <button onclick="window.close()" style="padding: 10px 30px; background-color: #666; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; margin-left: 10px;">
                        Close
                    </button>
                </div>
            </body>
            </html>
        `;

    invoiceWindow.document.write(invoiceHTML);
    invoiceWindow.document.close();
    invoiceWindow.focus();
  };

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="left-panel">
          <div className="avatar">
            {user.image ? (
              <img
                src={getImageUrl(user.image)}
                alt="User"
              />
            ) : (
              <span className="avatar-initial">{user.name ? user.name.charAt(0).toUpperCase() : '?'}</span>
            )}
          </div>
          <div className="info-box">
            <h3>{user.name}</h3>
            <p>📧 {user.email}</p>
            <p>📞 {user.mobile}</p>
            {/* <p>🧾 {user.pin}</p>
            <p>🏙️ {user.city}</p> */}
            {selectedAddress ? (
              <p>📍 {selectedAddress}</p>
            ) : (
              showNoAddressPopup && (
                <div className="no-address-popup-backdrop">
                  <div className="no-address-popup">
                    <h3>No Address Selected</h3>
                    <p>
                      Please add or select an address to proceed with your
                      orders.
                    </p>
                    <button
                      onClick={() => setShowNoAddressPopup(false)}
                      className="submit-btn"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <div className="right-panel">
          <div className="action-grid">
            <button onClick={() => setShowOrders(true)}>🛍️ Orders</button>
            <button onClick={() => navigate("/wishlist")}>❤️ Wishlist</button>
            <button>🏷️ Coupons</button>
            <button>🆘 Help Centre</button>
          </div>

          <h4>Account Settings</h4>
          <ul className="settings-list">
            <li onClick={() => setEditMode(true)}>👤 Edit Profile</li>
            <li onClick={() => setShowSavedAddresses(true)}>
              📍 Saved Addresses
            </li>
            <li onClick={handleLogout} className="logout-btn">
              🚪 Logout
            </li>
          </ul>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editMode && (
        <div className="modal-backdrop">
          <div className="modal-form">
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                placeholder="Name"
              />
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                placeholder="Email"
              />
              <input
                type="text"
                name="mobile"
                value={formData.mobile || ""}
                onChange={handleChange}
                placeholder="Mobile"
              />
              <input
                type="text"
                name="pin"
                value={formData.pin || ""}
                onChange={handleChange}
                placeholder="PIN Code"
              />
              <input
                type="text"
                name="city"
                value={formData.city || ""}
                onChange={handleChange}
                placeholder="City"
              />
              <input
                type="text"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                placeholder="Address"
              />
              <input
                type="text"
                name="gst_number"
                value={formData.gst_number || ""}
                onChange={handleChange}
                placeholder="GST Number (Optional)"
              />
              <button
                type="button"
                onClick={() => setShowAddressPopup(true)}
                className="add-address-btn"
              >
                ➕ Add Another Address
              </button>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="submit-btn">
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>

            {/* Add New Address Popup */}
            {showAddressPopup && (
              <div className="popup-overlay">
                <div className="popup-form">
                  <h3>Add New Address</h3>
                  <textarea
                    value={newAddress}
                    onChange={handleNewAddressChange}
                    placeholder="Enter your address"
                    rows="4"
                  />
                  <div className="flex justify-between">
                    <button
                      onClick={() => setShowAddressPopup(false)}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddNewAddress}
                      className="submit-btn"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Saved Addresses Modal */}
      {showSavedAddresses && (
        <div className="modal-backdrop">
          <div className="modal-form">
            <h2>Saved Addresses</h2>
            {user.address && (
              <div className="saved-address-box">
                <p>{user.address}</p>
                <button
                  onClick={() => {
                    setSelectedAddress(user.address);
                    setShowSavedAddresses(false);
                  }}
                  className="submit-btn"
                >
                  Use this Address
                </button>
              </div>
            )}
            {[1, 2, 3, 4, 5].map((i) => {
              const addr = user[`address${i}`];
              if (!addr) return null;

              return (
                <div key={i} className="saved-address-box">
                  <p>{addr}</p>
                  <button
                    onClick={() => {
                      setSelectedAddress(addr);
                      setShowSavedAddresses(false);
                    }}
                    className="submit-btn"
                  >
                    Use this Address
                  </button>
                </div>
              );
            })}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowSavedAddresses(false)}
                className="cancel-btn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orders Modal */}
      {showOrders && (
        <div className="modal-backdrop">
          <div className="modal-form orders-modal">
            <h2>My Orders</h2>
            {ordersLoading ? (
              <p>Loading orders...</p>
            ) : orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <span className="order-id">
                        Order ID: <b>{order.order_number}</b>
                      </span>
                      <span className="order-date">
                        {new Date(order.created_at).toLocaleString()}
                      </span>
                      <button
                        className="invoice-btn"
                        onClick={() => generateInvoice(order)}
                        title="Generate Invoice"
                      >
                        📄 Invoice
                      </button>
                    </div>
                    <div className="order-products">
                      {order.order_items &&
                        order.order_items.map((item, idx) => (
                          <div key={idx} className="order-product">
                            <img
                              src={getImageUrl(item.image)}
                              alt={item.name}
                              className="order-product-img"
                              onError={(e) => (e.target.src = "/fallback.jpg")}
                            />
                            <div>
                              <div className="product-name">{item.name}</div>
                              <div>Qty: {item.quantity}</div>
                              <div>Price: ₹{item.price}</div>
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="order-info">
                      <div>
                        <b>Name:</b> {order.customer_name}
                      </div>
                      <div>
                        <b>Phone:</b> {order.customer_phone}
                      </div>
                      <div>
                        <b>Address:</b> {order.customer_address}
                      </div>
                    </div>
                    <div className="order-total">
                      <b>Total:</b> ₹{order.order_value}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setShowOrders(false)}
              className="cancel-btn"
              style={{ marginTop: 16 }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default UserProfile;
