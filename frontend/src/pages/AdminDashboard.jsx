import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(100);
    const [minZoom, setMinZoom] = useState(50);
    const [activeSection, setActiveSection] = useState('orders');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const tableRef = React.useRef(null);
    const containerRef = React.useRef(null);

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

                const fetchedOrders = response.data.orders || [];
                setOrders(fetchedOrders);
                setFilteredOrders(fetchedOrders);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setLoading(false);
                setError('Failed to load orders. Please try again.');
            }
        };

        fetchOrders();
    }, [navigate]);

    // Calculate minimum zoom to fit table in container
    useEffect(() => {
        const calculateMinZoom = () => {
            if (tableRef.current && containerRef.current) {
                const tableWidth = tableRef.current.scrollWidth;
                const containerWidth = containerRef.current.clientWidth;

                if (tableWidth > containerWidth) {
                    const calculatedMinZoom = Math.floor((containerWidth / tableWidth) * 100);
                    setMinZoom(Math.max(50, calculatedMinZoom));
                } else {
                    setMinZoom(50);
                }
            }
        };

        // Calculate after orders are loaded and rendered
        if (!loading && filteredOrders.length > 0) {
            setTimeout(calculateMinZoom, 100);
        }

        // Recalculate on window resize
        window.addEventListener('resize', calculateMinZoom);
        return () => window.removeEventListener('resize', calculateMinZoom);
    }, [loading, filteredOrders]);

    // Filter orders by date range
    const handleFilter = () => {
        if (!startDate && !endDate) {
            setFilteredOrders(orders);
            return;
        }

        const filtered = orders.filter(order => {
            const orderDate = new Date(order.created_at);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            // Set end date to end of day
            if (end) {
                end.setHours(23, 59, 59, 999);
            }

            if (start && end) {
                return orderDate >= start && orderDate <= end;
            } else if (start) {
                return orderDate >= start;
            } else if (end) {
                return orderDate <= end;
            }
            return true;
        });

        setFilteredOrders(filtered);
    };

    // Clear filters
    const handleClearFilter = () => {
        setStartDate('');
        setEndDate('');
        setFilteredOrders(orders);
    };

    // Export to CSV
    const exportToCSV = () => {
        const headers = ['Order Number', 'Customer Name', 'Email', 'Phone', 'Address', 'Items', 'Quantity', 'Total Amount', 'Status', 'Date', 'Time'];

        const csvData = filteredOrders.map(order => [
            order.order_number,
            order.customer_name || 'N/A',
            order.customer_email || 'N/A',
            order.customer_phone || 'N/A',
            `"${order.customer_address || 'N/A'}"`, // Quoted for CSV
            order.order_items?.map(item => item.name || item.product_name).join('; ') || 'N/A',
            order.order_quantity || 0,
            `₹${parseFloat(order.order_value || 0).toFixed(2)}`,
            order.status || 'Pending',
            new Date(order.created_at).toLocaleDateString(),
            new Date(order.created_at).toLocaleTimeString()
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `orders_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setShowExportMenu(false);
    };

    // Export to PDF
    const exportToPDF = () => {
        const printWindow = window.open('', '', 'height=600,width=800');

        const htmlContent = `
            <html>
            <head>
                <title>Orders Report</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #232946; text-align: center; }
                    .meta { text-align: center; color: #666; margin-bottom: 30px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
                    th { background-color: #232946; color: white; }
                    tr:nth-child(even) { background-color: #f9f9f9; }
                    .items { max-width: 200px; word-wrap: break-word; }
                    .total { font-weight: bold; }
                </style>
            </head>
            <body>
                <h1>Floretta India - Orders Report</h1>
                <div class="meta">
                    <p>Generated on: ${new Date().toLocaleString()}</p>
                    <p>Total Orders: ${filteredOrders.length}</p>
                    ${startDate || endDate ? `<p>Filter: ${startDate || 'Start'} to ${endDate || 'End'}</p>` : ''}
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Order #</th>
                            <th>Customer</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Items</th>
                            <th>Qty</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredOrders.map(order => `
                            <tr>
                                <td>${order.order_number}</td>
                                <td>${order.customer_name || 'N/A'}</td>
                                <td>${order.customer_email || 'N/A'}</td>
                                <td>${order.customer_phone || 'N/A'}</td>
                                <td class="items">${order.order_items?.map(item => item.name || item.product_name).join(', ') || 'N/A'}</td>
                                <td>${order.order_quantity || 0}</td>
                                <td class="total">₹${parseFloat(order.order_value || 0).toFixed(2)}</td>
                                <td>${order.status || 'Pending'}</td>
                                <td>${new Date(order.created_at).toLocaleDateString()}</td>
                                <td>${new Date(order.created_at).toLocaleTimeString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
        setShowExportMenu(false);
    };

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
            <aside className={`admin-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
                <div className="admin-logo">
                    <h2>FLORETTA</h2>
                    <p className="admin-subtitle">Admin Panel</p>
                    {/* Close button - only visible when sidebar is open */}
                    {sidebarOpen && (
                        <button
                            className="sidebar-close-btn"
                            onClick={() => setSidebarOpen(false)}
                            aria-label="Close Sidebar"
                        >
                            <i className="fas fa-arrow-left"></i>
                        </button>
                    )}
                </div>
                <nav className="admin-nav">
                    <ul>
                        <li
                            className={activeSection === 'orders' ? 'active' : ''}
                            onClick={() => {
                                setActiveSection('orders');
                                setSidebarOpen(false);
                            }}
                        >
                            <i className="fas fa-box"></i>
                            <span>Orders</span>
                        </li>
                        <li
                            className={activeSection === 'customers' ? 'active' : ''}
                            onClick={() => {
                                setActiveSection('customers');
                                setSidebarOpen(false);
                            }}
                        >
                            <i className="fas fa-users"></i>
                            <span>Customers</span>
                        </li>
                        <li
                            className={activeSection === 'products' ? 'active' : ''}
                            onClick={() => {
                                setActiveSection('products');
                                setSidebarOpen(false);
                            }}
                        >
                            <i className="fas fa-cube"></i>
                            <span>Products</span>
                        </li>
                        <li
                            className={activeSection === 'analytics' ? 'active' : ''}
                            onClick={() => {
                                setActiveSection('analytics');
                                setSidebarOpen(false);
                            }}
                        >
                            <i className="fas fa-chart-line"></i>
                            <span>Analytics</span>
                        </li>
                        <li
                            className={activeSection === 'settings' ? 'active' : ''}
                            onClick={() => {
                                setActiveSection('settings');
                                setSidebarOpen(false);
                            }}
                        >
                            <i className="fas fa-cogs"></i>
                            <span>Settings</span>
                        </li>
                        <li className="logout-item" onClick={handleLogout}>
                            <i className="fas fa-sign-out-alt"></i>
                            <span>Logout</span>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Overlay */}
            <div
                className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
            ></div>

            {/* Main Content */}
            <main className="admin-main">
                {/* Header */}
                <header className="admin-header">
                    {/* Hamburger Menu Button */}
                    <button
                        className="hamburger-menu"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        aria-label="Toggle Sidebar"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <h1>Dashboard</h1>
                    <h2 className="admin-header-center desktop-only">All Orders ({filteredOrders.length})</h2>
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
                    <h2 className="mobile-only">All Orders ({filteredOrders.length})</h2>
                    {/* Date Filter */}
                    <div className="date-filter">
                        <div className="filter-inputs">
                            <div className="filter-group">
                                <label>Start Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="date-input"
                                />
                            </div>
                            <div className="filter-group">
                                <label>End Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="date-input"
                                />
                            </div>
                            <div className="filter-buttons">
                                <button onClick={handleFilter} className="filter-btn">
                                    Filter
                                </button>
                                <button onClick={handleClearFilter} className="clear-btn">
                                    Clear
                                </button>
                            </div>

                            {/* Zoom Controls */}
                            {filteredOrders.length > 0 && (
                                <div className="zoom-controls">
                                    <button
                                        onClick={() => setZoomLevel(Math.max(minZoom, zoomLevel - 10))}
                                        className="zoom-btn"
                                        disabled={zoomLevel <= minZoom}
                                    >
                                        <span>−</span>
                                    </button>
                                    <input
                                        type="range"
                                        min={minZoom}
                                        max="150"
                                        step="5"
                                        value={zoomLevel}
                                        onChange={(e) => setZoomLevel(Number(e.target.value))}
                                        className="zoom-slider"
                                    />
                                    <span className="zoom-level">{zoomLevel}%</span>
                                    <button
                                        onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
                                        className="zoom-btn"
                                        disabled={zoomLevel >= 150}
                                    >
                                        <span>+</span>
                                    </button>
                                    <button
                                        onClick={() => setZoomLevel(100)}
                                        className="zoom-reset-btn"
                                    >
                                        Reset
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-spinner">
                            <p>Loading orders...</p>
                        </div>
                    ) : error ? (
                        <div className="error-message">
                            <p>{error}</p>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="orders-placeholder">
                            <p>No orders found.</p>
                            <div className="orders-illustration">
                                <i className="fas fa-box-open fa-3x"></i>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="orders-table-container" ref={containerRef}>
                                <div className="table-zoom-wrapper" style={{
                                    transform: `scale(${zoomLevel / 100})`,
                                    transformOrigin: 'top left'
                                }}>
                                    <table className="orders-table" ref={tableRef}>
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
                                        <th>Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order) => (
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
                                            <td className="order-time">{new Date(order.created_at).toLocaleTimeString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="11" style={{ padding: 0, border: 'none' }}>
                                            {/* Export Button */}
                                            <div className="export-section">
                                                <div className="export-container">
                                                    <button
                                                        className="export-btn"
                                                        onClick={() => setShowExportMenu(!showExportMenu)}
                                                    >
                                                        <span>📥</span> Extract Data
                                                    </button>

                                                    {showExportMenu && (
                                                        <div className="export-menu">
                                                            <button onClick={exportToCSV} className="export-option csv-option">
                                                                <span className="icon-csv">CSV</span>
                                                                Export as CSV
                                                            </button>
                                                            <button onClick={exportToPDF} className="export-option pdf-option">
                                                                <span className="icon-pdf">PDF</span>
                                                                Export as PDF
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                                </div>
                            </div>
                        </>
                    )}
                </section>
            </main>
        </div>
    );
}

export default AdminDashboard;