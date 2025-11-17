// src/components/UserProfile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS, getImageUrl } from "../config/api";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "../styles/userprofile.css";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState(null);
  const [showAddNewForm, setShowAddNewForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    label: "",
    name: "",
    address: "",
    city: "",
    pin: "",
    mobile: "",
  });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressFormChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const openAddressForm = (index = null) => {
    if (index) {
      const addr = parseAddress(user[`address${index}`]);
      if (addr) {
        setAddressForm(addr);
        setEditingAddressIndex(index);
      }
    } else {
      setAddressForm({
        label: "",
        name: "",
        address: "",
        city: "",
        pin: "",
        mobile: "",
      });
      setEditingAddressIndex(null);
    }
    // Address form is now within Edit Profile modal, no separate modal needed
  };

  const handleSaveAddress = async () => {
    // Validate required fields
    if (
      !addressForm.name ||
      !addressForm.address ||
      !addressForm.city ||
      !addressForm.pin ||
      !addressForm.mobile
    ) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
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
            "All 5 address slots are full. Please delete an address first."
          );
          setLoading(false);
          return;
        }
      }

      const addressData = {
        [`address${targetIndex}`]: JSON.stringify(addressForm),
      };

      const res = await axios.post(API_ENDPOINTS.UPDATE_PROFILE, addressData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const updatedUser = res.data.user;
      setUser(updatedUser);
      setFormData(updatedUser);
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
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save address.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (index) => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }

    setLoading(true);
    try {
      const addressData = {
        [`address${index}`]: null,
      };

      const res = await axios.post(API_ENDPOINTS.UPDATE_PROFILE, addressData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const updatedUser = res.data.user;
      setUser(updatedUser);
      setFormData(updatedUser);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete address.");
      console.error("Delete address error:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filter out null, undefined, and non-string values
      const cleanedData = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          cleanedData[key] = value;
        }
      });

      const res = await axios.post(API_ENDPOINTS.UPDATE_PROFILE, cleanedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const updatedUser = res.data.user;
      setUser(updatedUser);
      setFormData(updatedUser);
      setEditMode(false);
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
              <img src={getImageUrl(user.image)} alt="User" />
            ) : (
              <span className="avatar-initial">
                {user.name ? user.name.charAt(0).toUpperCase() : "?"}
              </span>
            )}
          </div>
          <div className="info-box">
            <h3>{user.name}</h3>
            <p>📧 {user.email}</p>
            <p>📞 {user.mobile}</p>
          </div>
        </div>

        <div className="right-panel">
          <div className="action-grid">
            <div className="action-column">
              <button onClick={() => setShowOrders(true)}>🛍️ Orders</button>
              <button onClick={() => navigate("/wishlist")}>❤️ Wishlist</button>
            </div>
            <div className="action-column">
              <button>🏷️ Coupons</button>
              <button>🆘 Help Centre</button>
            </div>
          </div>

          <h4>Account Settings</h4>
          <ul className="settings-list">
            <div className="settings-column">
              <li onClick={() => setEditMode(true)}>👤 Edit Profile</li>
            </div>
            <div className="settings-column">
              <li onClick={handleLogout} className="logout-btn">
                🚪 Logout
              </li>
            </div>
          </ul>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editMode && (
        <div className="modal-backdrop">
          <div
            className="modal-form"
            style={{ maxWidth: "600px", maxHeight: "90vh", overflowY: "auto" }}
          >
            <h2>Edit Profile</h2>

            {/* Profile Information Section */}
            <div
              style={{
                marginBottom: "30px",
                borderBottom: "2px solid #eee",
                paddingBottom: "20px",
              }}
            >
              <h3 style={{ marginBottom: "15px", color: "#232946" }}>
                Personal Information
              </h3>
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  placeholder="Name"
                  style={{
                    padding: "12px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                    fontSize: "14px",
                  }}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  placeholder="Email"
                  style={{
                    padding: "12px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                    fontSize: "14px",
                  }}
                />
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile || ""}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  style={{
                    padding: "12px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                    fontSize: "14px",
                  }}
                />
                <div
                  style={{ display: "flex", gap: "10px", marginTop: "10px" }}
                >
                  <button
                    type="submit"
                    disabled={loading}
                    className="submit-btn"
                    style={{ flex: 1 }}
                  >
                    {loading ? "Saving..." : "Update Profile"}
                  </button>
                </div>
              </form>
            </div>

            {/* Address Management Section */}
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ marginBottom: "15px", color: "#232946" }}>
                📍 Manage Addresses
              </h3>

              {/* Display all saved addresses */}
              <div className="addresses-list" style={{ marginBottom: "20px" }}>
                {getAllAddresses().length === 0 ? (
                  <p
                    style={{
                      textAlign: "center",
                      color: "#666",
                      padding: "20px",
                      backgroundColor: "#f9f9f9",
                      borderRadius: "8px",
                    }}
                  >
                    No addresses saved yet
                  </p>
                ) : (
                  getAllAddresses().map((addr) => (
                    <div
                      key={addr.index}
                      className="saved-address-box"
                      style={{
                        border: "1px solid #ddd",
                        padding: "15px",
                        marginBottom: "10px",
                        borderRadius: "8px",
                        backgroundColor: "#f9f9f9",
                      }}
                    >
                      <div style={{ marginBottom: "10px" }}>
                        <strong>{addr.label || "Address"}</strong>
                        <p style={{ margin: "5px 0" }}>{addr.name}</p>
                        <p
                          style={{
                            margin: "5px 0",
                            fontSize: "14px",
                            color: "#666",
                          }}
                        >
                          {addr.address}, {addr.city} - {addr.pin}
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
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button
                          onClick={() => openAddressForm(addr.index)}
                          className="submit-btn"
                          style={{ flex: 1, fontSize: "13px", padding: "8px" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(addr.index)}
                          className="cancel-btn"
                          style={{ flex: 1, fontSize: "13px", padding: "8px" }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add New Address Form */}
              {editingAddressIndex === null && showAddNewForm && (
                <div
                  style={{
                    border: "2px dashed #ddd",
                    padding: "20px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                  }}
                >
                  <h4 style={{ marginBottom: "15px" }}>Add New Address</h4>
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
                        fontSize: "13px",
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
                        fontSize: "13px",
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
                        fontSize: "13px",
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
                        fontSize: "13px",
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
                        fontSize: "13px",
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
                        fontSize: "13px",
                      }}
                    />
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={() => {
                          setShowAddNewForm(false);
                          setAddressForm({
                            label: "",
                            name: "",
                            address: "",
                            city: "",
                            pin: "",
                            mobile: "",
                          });
                        }}
                        className="cancel-btn"
                        style={{ flex: 1, fontSize: "13px", padding: "8px" }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveAddress}
                        disabled={loading}
                        className="submit-btn"
                        style={{ flex: 1, fontSize: "13px", padding: "8px" }}
                      >
                        {loading ? "Saving..." : "Save Address"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Add New Address Button */}
              {editingAddressIndex === null &&
                !showAddNewForm &&
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
                        border: "2px dashed #232946",
                        background: "#fff",
                        color: "#232946",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      + Add New Address
                    </button>
                  </div>
                )}

              {/* Edit Address Form */}
              {editingAddressIndex !== null && (
                <div
                  style={{
                    border: "2px solid #232946",
                    padding: "20px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    backgroundColor: "#f0f4ff",
                  }}
                >
                  <h4 style={{ marginBottom: "15px" }}>Edit Address</h4>
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
                        fontSize: "13px",
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
                        fontSize: "13px",
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
                        fontSize: "13px",
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
                        fontSize: "13px",
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
                        fontSize: "13px",
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
                        fontSize: "13px",
                      }}
                    />
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={() => {
                          setEditingAddressIndex(null);
                          setAddressForm({
                            label: "",
                            name: "",
                            address: "",
                            city: "",
                            pin: "",
                            mobile: "",
                          });
                        }}
                        className="cancel-btn"
                        style={{ flex: 1, fontSize: "13px", padding: "8px" }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveAddress}
                        disabled={loading}
                        className="submit-btn"
                        style={{ flex: 1, fontSize: "13px", padding: "8px" }}
                      >
                        {loading ? "Saving..." : "Update Address"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                setEditMode(false);
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
              }}
              className="cancel-btn"
              style={{ width: "100%" }}
            >
              Close
            </button>
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
                    {/* Order Status Tracking */}
                    <div
                      className="order-status-tracker"
                      style={{
                        padding: "15px",
                        margin: "10px 0",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "8px",
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "10px",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "bold",
                            fontSize: "14px",
                            color: "#333",
                          }}
                        >
                          Order Status:
                        </span>
                        <span
                          style={{
                            padding: "6px 12px",
                            borderRadius: "20px",
                            fontSize: "13px",
                            fontWeight: "bold",
                            backgroundColor:
                              order.order_status === "Delivered"
                                ? "#d4edda"
                                : order.order_status === "In-Transit"
                                ? "#fff3cd"
                                : order.order_status === "Shipped"
                                ? "#cfe2ff"
                                : "#e2e3e5",
                            color:
                              order.order_status === "Delivered"
                                ? "#155724"
                                : order.order_status === "In-Transit"
                                ? "#856404"
                                : order.order_status === "Shipped"
                                ? "#084298"
                                : "#383d41",
                          }}
                        >
                          {order.order_status || "Order Placed"}
                        </span>
                      </div>

                      {/* Status Timeline */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          position: "relative",
                          marginTop: "15px",
                        }}
                      >
                        {/* Progress Line */}
                        <div
                          style={{
                            position: "absolute",
                            top: "12px",
                            left: "0",
                            right: "0",
                            height: "2px",
                            backgroundColor: "#e0e0e0",
                            zIndex: 0,
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              backgroundColor: "#28a745",
                              width:
                                order.order_status === "Delivered"
                                  ? "100%"
                                  : order.order_status === "In-Transit"
                                  ? "66%"
                                  : order.order_status === "Shipped"
                                  ? "33%"
                                  : "0%",
                              transition: "width 0.3s ease",
                            }}
                          ></div>
                        </div>

                        {/* Status Steps */}
                        {[
                          "Order Placed",
                          "Shipped",
                          "In-Transit",
                          "Delivered",
                        ].map((status, idx) => {
                          const currentStatuses = [
                            "Order Placed",
                            "Shipped",
                            "In-Transit",
                            "Delivered",
                          ];
                          const currentIndex = currentStatuses.indexOf(
                            order.order_status || "Order Placed"
                          );
                          const isCompleted = idx <= currentIndex;
                          const isActive = idx === currentIndex;

                          return (
                            <div
                              key={status}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                zIndex: 1,
                                flex: 1,
                              }}
                            >
                              <div
                                style={{
                                  width: "24px",
                                  height: "24px",
                                  borderRadius: "50%",
                                  backgroundColor: isCompleted
                                    ? "#28a745"
                                    : "#e0e0e0",
                                  border: isActive
                                    ? "3px solid #28a745"
                                    : "2px solid transparent",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  marginBottom: "8px",
                                  transition: "all 0.3s ease",
                                  boxShadow: isActive
                                    ? "0 0 0 4px rgba(40, 167, 69, 0.2)"
                                    : "none",
                                }}
                              >
                                {isCompleted && (
                                  <span
                                    style={{
                                      color: "#fff",
                                      fontSize: "14px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    ✓
                                  </span>
                                )}
                              </div>
                              <span
                                style={{
                                  fontSize: "11px",
                                  textAlign: "center",
                                  color: isCompleted ? "#333" : "#999",
                                  fontWeight: isActive ? "bold" : "normal",
                                  maxWidth: "80px",
                                  lineHeight: "1.2",
                                }}
                              >
                                {status}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {order.order_status_changed_at && (
                        <div
                          style={{
                            marginTop: "12px",
                            fontSize: "12px",
                            color: "#666",
                            textAlign: "right",
                          }}
                        >
                          Last updated:{" "}
                          {new Date(
                            order.order_status_changed_at
                          ).toLocaleString()}
                        </div>
                      )}
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
      <Footer />
    </>
  );
}

export default UserProfile;
