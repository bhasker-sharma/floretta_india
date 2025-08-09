import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
    const navigate = useNavigate();

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
                    <h2>Orders</h2>
                    <div className="orders-placeholder">
                        <p>Order management and details will appear here.</p>
                        <div className="orders-illustration">
                            <i className="fas fa-box-open fa-3x"></i>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default AdminDashboard;