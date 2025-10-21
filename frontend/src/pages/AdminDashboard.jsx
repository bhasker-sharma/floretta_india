import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all orders
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                if (!token) {
                    navigate('/admin/login');
                    return;
                }

                const response = await axios.get('http://localhost:8000/api/admin/orders', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setOrders(response.data.orders || []);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setLoading(false);
                setError('Failed to load orders. Please try again.');
            }
        };

        fetchOrders();
    }, [navigate]);

    // Define the logout function
    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.post('http://localhost:8000/api/admin/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (err) {
            // Optionally handle error
        } finally {
            localStorage.removeItem('adminToken');
            navigate('/'); // Redirect to home page
        }
    };

    return (
        <div className="admin-dashboard">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <h2>Admin</h2>
                </div>
                <nav>
                    <ul>
                        <li className="active"><i className="fas fa-box"></i> Orders</li>
                        <li><i className="fas fa-users"></i> Customers</li>
                        <li><i className="fas fa-cube"></i> Products</li>
                        <li><i className="fas fa-chart-line"></i> Analytics</li>
                        <li><i className="fas fa-cogs"></i> Settings</li>
                        <li onClick={handleLogout} style={{ cursor: 'pointer' }}>
                            <i className="fas fa-sign-out-alt"></i> Logout
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                {/* Header */}
                <header className="admin-header">
                    <h1>Dashboard</h1>
                    <div className="admin-header-right">
                        <span className="admin-user">Welcome, Admin</span>
                        <img
                            src="https://ui-avatars.com/api/?name=Admin"
                            alt="Admin Avatar"
                            className="admin-avatar"
                        />
                    </div>
                </header>

                {/* Orders Section */}
                <section className="admin-section">
                    <h2>All Orders ({orders.length})</h2>

                    {loading ? (
                        <div className="loading-spinner">
                            <p>Loading orders...</p>
                        </div>
                    ) : error ? (
                        <div className="error-message">
                            <p>{error}</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="orders-placeholder">
                            <p>No orders found.</p>
                            <div className="orders-illustration">
                                <i className="fas fa-box-open fa-3x"></i>
                            </div>
                        </div>
                    ) : (
                        <div className="orders-table-container">
                            <table className="orders-table">
                                <thead>
                                    <tr>
                                        <th>Order Number</th>
                                        <th>Customer Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Address</th>
                                        <th>Items</th>
                                        <th>Quantity</th>
                                        <th>Total Amount</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.id}>
                                            <td className="order-number">{order.order_number}</td>
                                            <td>{order.customer_name || 'N/A'}</td>
                                            <td>{order.customer_email || 'N/A'}</td>
                                            <td>{order.customer_phone || 'N/A'}</td>
                                            <td className="order-address">{order.customer_address || 'N/A'}</td>
                                            <td>
                                                <div className="order-items-list">
                                                    {order.order_items && order.order_items.map((item, idx) => (
                                                        <div key={idx} className="order-item-with-image">
                                                            {item.image && (
                                                                <img
                                                                    src={`http://localhost:8000/storage/${item.image}`}
                                                                    alt={item.name || item.product_name}
                                                                    className="order-item-image"
                                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                                />
                                                            )}
                                                            <div className="order-item-details">
                                                                <span className="item-name">{item.name || item.product_name}</span>
                                                                <span className="item-quantity">Qty: {item.quantity}</span>
                                                                <span className="item-price">₹{parseFloat(item.price || 0).toFixed(2)}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td>{order.order_quantity || 0}</td>
                                            <td className="order-total">₹{parseFloat(order.order_value || 0).toFixed(2)}</td>
                                            <td>
                                                <span className={`status-badge status-${order.status?.toLowerCase()}`}>
                                                    {order.status || 'Pending'}
                                                </span>
                                            </td>
                                            <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default AdminDashboard;