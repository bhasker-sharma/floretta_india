/**
 * AnalyticsCustomers Component
 *
 * Customer analytics and behavior tracking dashboard:
 * - Customer KPIs (total customers, new customers, returning rate, avg orders per customer)
 * - New vs returning customer trends over time
 * - Geographic distribution (orders by location/city)
 * - Top customers by spending with detailed metrics
 * - CSV export for customer data
 *
 * Key Features:
 * - Customer acquisition tracking (new vs returning)
 * - Geographic sales analysis (top 10 cities)
 * - Customer lifetime value metrics
 * - Status filtering (active/inactive customers)
 * - Multi-column sorting and search
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import KPICard from '../components/KPICard';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function AnalyticsCustomers({ dateRange }) {
  const [loading, setLoading] = useState(false);

  // Customer KPIs
  const [kpis, setKpis] = useState({});

  // Chart data
  const [customerSegmentsOverTime, setCustomerSegmentsOverTime] = useState([]); // New vs returning trend
  const [ordersByLocation, setOrdersByLocation] = useState([]); // Top 10 cities by order count

  // Customer table data
  const [customers, setCustomers] = useState([]); // Top customers list
  const [customersPagination, setCustomersPagination] = useState({}); // Pagination metadata

  // Filter states
  const [customersSearch, setCustomersSearch] = useState(''); // Search by name or email
  const [statusFilter, setStatusFilter] = useState(''); // Filter by active/inactive status
  const [customersSortBy, setCustomersSortBy] = useState('total_spent'); // Sort column (default: total spent)
  const [customersSortOrder, setCustomersSortOrder] = useState('desc'); // Sort direction
  const [currentPage, setCurrentPage] = useState(1); // Current page number

  /**
   * Effect Hook: Load data when date range changes
   */
  useEffect(() => {
    if (Object.keys(dateRange).length > 0) {
      loadCustomersData();
    }
  }, [dateRange]);

  /**
   * Effect Hook: Reload data when filters, search, sort, or pagination changes
   */
  useEffect(() => {
    if (Object.keys(dateRange).length > 0) {
      loadCustomersData();
    }
  }, [customersSearch, statusFilter, customersSortBy, customersSortOrder, currentPage]);

  /**
   * Load Customer Analytics Data
   *
   * Fetches comprehensive customer analytics including:
   * - KPIs: Total customers, new customers, returning rate, avg orders per customer
   * - Customer segments over time: Daily new vs returning customer counts
   * - Orders by location: Top 10 cities by order volume
   * - Top customers: Paginated list sorted by total spent (default)
   *
   * Includes customer lifetime value metrics:
   * - Total orders and revenue per customer
   * - Average order value
   * - Last order date
   * - Customer status (active/inactive)
   */
  const loadCustomersData = async () => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        ...dateRange,
        search: customersSearch,
        status: statusFilter,
        sort_by: customersSortBy,
        sort_order: customersSortOrder,
        page: currentPage,
        per_page: 15,
      },
    };

    try {
      const response = await axios.get(API_ENDPOINTS.ANALYTICS_CUSTOMERS, config);
      if (response.data.success) {
        const data = response.data.data;
        setKpis(data.kpis || {});
        setCustomerSegmentsOverTime(data.customer_segments_over_time || []);
        setOrdersByLocation(data.orders_by_location || []);
        setCustomers(data.top_customers?.data || []);
        setCustomersPagination(data.top_customers || {});
      }
    } catch (error) {
      console.error('Error loading customers data:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Export Customer Data to CSV
   *
   * Creates a CSV file containing customer metrics:
   * - Customer name and email
   * - Total orders and total spent
   * - Average order value
   * - Last order date
   * - Customer status (active/inactive)
   */
  const handleExportCSV = () => {
    if (customers.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = ['Name', 'Email', 'Total Orders', 'Total Spent', 'Avg Order Value', 'Last Order Date', 'Status'];
    const rows = customers.map(customer => [
      customer.name,
      customer.email,
      customer.total_orders,
      customer.total_spent,
      customer.avg_order_value,
      customer.last_order_date || 'N/A',
      customer.status,
    ]);

    // Build CSV with proper escaping
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      const escapedRow = row.map(cell => {
        const cellStr = String(cell).replace(/"/g, '""');
        return cellStr.includes(',') || cellStr.includes('\n') ? `"${cellStr}"` : cellStr;
      });
      csvContent += escapedRow.join(',') + '\n';
    });

    // Create and download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `customers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {/* KPI Cards */}
      <div className="kpi-cards-row">
        {kpis.total_customers && (
          <KPICard
            label={kpis.total_customers.label}
            value={kpis.total_customers.value}
            trend={kpis.total_customers.trend}
            icon="fas fa-users"
            formatter="number"
          />
        )}
        {kpis.new_customers && (
          <KPICard
            label={kpis.new_customers.label}
            value={kpis.new_customers.value}
            trend={kpis.new_customers.trend}
            icon="fas fa-user-plus"
            formatter="number"
          />
        )}
        {kpis.returning_customer_rate && (
          <KPICard
            label={kpis.returning_customer_rate.label}
            value={kpis.returning_customer_rate.value}
            trend={kpis.returning_customer_rate.trend}
            icon="fas fa-redo"
            formatter="percentage"
          />
        )}
        {kpis.avg_orders_per_customer && (
          <KPICard
            label={kpis.avg_orders_per_customer.label}
            value={kpis.avg_orders_per_customer.value}
            trend={kpis.avg_orders_per_customer.trend}
            icon="fas fa-shopping-cart"
            formatter="number"
          />
        )}
      </div>

      {/* Charts Row */}
      <div className="analytics-charts-grid" style={{ marginBottom: '24px' }}>
        {/* New vs Returning Over Time */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3>New vs Returning Customers</h3>
            <p>Customer acquisition over time</p>
          </div>
          <div className="chart-card-body">
            {customerSegmentsOverTime.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={customerSegmentsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#888" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#888" style={{ fontSize: '12px' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="new_customers" stroke="#10b981" strokeWidth={2} name="New" />
                  <Line type="monotone" dataKey="returning_customers" stroke="#a33d3d" strokeWidth={2} name="Returning" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-no-data">
                <i className="fas fa-chart-line"></i>
                <p>No data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Orders by Location */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3>Orders by Location</h3>
            <p>Top 10 cities</p>
          </div>
          <div className="chart-card-body">
            {ordersByLocation.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ordersByLocation}>
                  <defs>
                    <linearGradient id="colorLocationOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a33d3d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#a33d3d" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="city"
                    stroke="#666"
                    style={{ fontSize: '11px', fontWeight: '500' }}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#666"
                    style={{ fontSize: '12px', fontWeight: '500' }}
                    tickLine={false}
                    domain={[0, (dataMax) => Math.ceil(dataMax * 1.1)]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="order_count"
                    fill="url(#colorLocationOrders)"
                    name="Orders"
                    radius={[8, 8, 0, 0]}
                    barSize={35}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-no-data">
                <i className="fas fa-map-marker-alt"></i>
                <p>No location data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="orders-table-card">
        <div className="orders-table-header">
          <h3>Top Customers</h3>
          <div className="orders-table-actions">
            <div className="orders-search">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search customers..."
                value={customersSearch}
                onChange={(e) => setCustomersSearch(e.target.value)}
              />
            </div>
            <button className="btn-export-csv" onClick={handleExportCSV}>
              <i className="fas fa-file-csv"></i> Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="table-filters">
          <div className="filter-group">
            <label>Status:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <table className="analytics-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th onClick={() => { setCustomersSortBy('total_orders'); setCustomersSortOrder(customersSortOrder === 'asc' ? 'desc' : 'asc'); }}>
                Total Orders <i className="fas fa-sort"></i>
              </th>
              <th onClick={() => { setCustomersSortBy('total_spent'); setCustomersSortOrder(customersSortOrder === 'asc' ? 'desc' : 'asc'); }}>
                Total Spent <i className="fas fa-sort"></i>
              </th>
              <th onClick={() => { setCustomersSortBy('avg_order_value'); setCustomersSortOrder(customersSortOrder === 'asc' ? 'desc' : 'asc'); }}>
                Avg Order Value <i className="fas fa-sort"></i>
              </th>
              <th>Last Order Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <tr key={customer.id}>
                  <td><strong>{customer.name}</strong></td>
                  <td>{customer.email}</td>
                  <td>{customer.total_orders}</td>
                  <td><strong>₹{Number(customer.total_spent).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td>
                  <td>₹{Number(customer.avg_order_value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td>{customer.last_order_date ? new Date(customer.last_order_date).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <span className={`status-badge ${customer.status === 'active' ? 'status-paid' : 'status-cancelled'}`}>
                      {customer.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {customersPagination.total > 0 && (
          <div className="table-pagination">
            <div className="pagination-info">
              Showing {customersPagination.from} to {customersPagination.to} of {customersPagination.total} customers
            </div>
            <div className="pagination-controls">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="pagination-btn active">{currentPage}</span>
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === customersPagination.last_page}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .table-filters {
          display: flex;
          gap: 16px;
          margin: 16px 0;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-group label {
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
        }

        .filter-group select {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 13px;
          min-width: 150px;
        }
      `}</style>
    </div>
  );
}

export default AnalyticsCustomers;
