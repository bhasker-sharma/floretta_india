// src/components/UserProfile.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/navbar';
import '../styles/userprofile.css';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [newAddress, setNewAddress] = useState({ address: '', city: '', pin: '' });
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [showNoAddressPopup, setShowNoAddressPopup] = useState(!selectedAddress);
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    axios
      .get('http://localhost:8000/api/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        setFormData(res.data);

        // Default to address1 if available
        const defaultAddr = res.data.address1 || res.data.address || '';
        setSelectedAddress(defaultAddr);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError('Something went wrong!');
        }
      });
  }, [navigate, token]);

  useEffect(() => {
    setShowNoAddressPopup(!selectedAddress);
  }, [selectedAddress]);

  useEffect(() => {
    if (showOrders) {
      setOrdersLoading(true);
      axios.get('http://localhost:8000/api/my-orders', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setOrders(res.data))
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

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  const handleAddNewAddress = () => {
    for (let i = 1; i <= 5; i++) {
      const key = `address${i}`;
      if (!formData[key]) {
        setFormData((prev) => ({
          ...prev,
          [key]: `${newAddress.address}, ${newAddress.city} - ${newAddress.pin}`,
        }));
        break;
      }
    }
    setShowAddressPopup(false);
    setNewAddress({ address: '', city: '', pin: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'image' && value !== undefined && value !== null) {
          payload.append(key, value);
        }
      });
      if (formData.image instanceof File) {
        payload.append('image', formData.image);
      }

      const res = await axios.post('http://localhost:8000/api/update-profile', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedUser = res.data.user;
      setUser(updatedUser);
      setFormData(updatedUser);
      setEditMode(false);
      // Set selectedAddress to the updated main address
      if (updatedUser.address) {
        setSelectedAddress(updatedUser.address);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div>{error}</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="left-panel">
          <div className="avatar">
            {user.image ? (
              <img src={`http://localhost:8000/storage/${user.image}`} alt="User" />
            ) : (
              <span>No Image</span>
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
                    <p>Please add or select an address to proceed with your orders.</p>
                    <button onClick={() => setShowNoAddressPopup(false)} className="submit-btn">Close</button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <div className="right-panel">
          <div className="action-grid">
            <button onClick={() => setShowOrders(true)}>🛍️ Orders</button>
            <button onClick={() => navigate('/wishlist')}>❤️ Wishlist</button>
            <button>🏷️ Coupons</button>
            <button>🆘 Help Centre</button>
          </div>

          <h4>Account Settings</h4>
          <ul className="settings-list">
            <li onClick={() => setEditMode(true)}>👤 Edit Profile</li>
            <li onClick={() => setShowSavedAddresses(true)}>📍 Saved Addresses</li>
            <li onClick={handleLogout} className="logout-btn">🚪 Logout</li>
          </ul>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editMode && (
        <div className="modal-backdrop">
          <div className="modal-form">
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input type="text" name="name" value={formData.name || ''} onChange={handleChange} placeholder="Name" />
              <input type="email" name="email" value={formData.email || ''} onChange={handleChange} placeholder="Email" />
              <input type="text" name="mobile" value={formData.mobile || ''} onChange={handleChange} placeholder="Mobile" />
              <input type="text" name="pin" value={formData.pin || ''} onChange={handleChange} placeholder="PIN Code" />
              <input type="text" name="city" value={formData.city || ''} onChange={handleChange} placeholder="City" />
              <input type="text" name="address" value={formData.address || ''} onChange={handleChange} placeholder="Address" />
              <input type="file" accept="image/*" onChange={handleImageChange} />
              <button type="button" onClick={() => setShowAddressPopup(true)} className="add-address-btn">
                ➕ Add Another Address
              </button>
              <div className="flex justify-between">
                <button type="button" onClick={() => setEditMode(false)} className="cancel-btn">Cancel</button>
                <button type="submit" disabled={loading} className="submit-btn">
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>

            {/* Add New Address Popup */}
            {showAddressPopup && (
              <div className="popup-overlay">
                <div className="popup-form">
                  <h3>Add New Address</h3>
                  <input type="text" name="address" value={newAddress.address} onChange={handleNewAddressChange} placeholder="Address" />
                  <input type="text" name="city" value={newAddress.city} onChange={handleNewAddressChange} placeholder="City" />
                  <input type="text" name="pin" value={newAddress.pin} onChange={handleNewAddressChange} placeholder="PIN Code" />
                  <div className="flex justify-between">
                    <button onClick={() => setShowAddressPopup(false)} className="cancel-btn">Cancel</button>
                    <button onClick={handleAddNewAddress} className="submit-btn">Add</button>
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
                <p><strong>Primary Address:</strong> {user.address}</p>
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
              return addr ? (
                <div key={i} className="saved-address-box">
                  <p><strong>Address {i}:</strong> {addr}</p>
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
              ) : null;
            })}
            <div className="flex justify-end mt-4">
              <button onClick={() => setShowSavedAddresses(false)} className="cancel-btn">Close</button>
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
              {orders.map(order => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <span className="order-id">Order ID: <b>{order.order_number}</b></span>
                    <span className="order-date">{new Date(order.created_at).toLocaleString()}</span>
                  </div>
                  <div className="order-products">
                    {order.order_items && order.order_items.map((item, idx) => (
                      <div key={idx} className="order-product">
                        <img
                          src={
                            item.image
                              ? `http://localhost:8000/storage/${item.image}`
                              : '/fallback.jpg'
                          }
                          alt={item.name}
                          className="order-product-img"
                          onError={e => (e.target.src = '/fallback.jpg')}
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
                    <div><b>Name:</b> {order.customer_name}</div>
                    <div><b>Phone:</b> {order.customer_phone}</div>
                    <div><b>Address:</b> {order.customer_address}</div>
                  </div>
                  <div className="order-total">
                    <b>Total:</b> ₹{order.order_value}
                  </div>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => setShowOrders(false)} className="cancel-btn" style={{marginTop: 16}}>Close</button>
        </div>
      </div>
    )}
    </>
  );
}

export default UserProfile;
