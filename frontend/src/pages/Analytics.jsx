/**
 * Analytics Dashboard Component
 *
 * Main analytics component that provides comprehensive business intelligence through multiple tabs:
 * - Overview: High-level KPIs, revenue trends, customer segments, and recent orders
 * - Sales: Detailed sales analysis with various breakdowns
 * - Products: Product performance metrics and inventory insights
 * - Customers: Customer behavior and segmentation analysis
 * - Reviews: Review management and sentiment tracking
 *
 * Key Features:
 * - Dynamic date range filtering across all analytics
 * - Real-time data visualization with interactive charts
 * - Sortable and searchable data tables
 * - CSV export functionality
 * - Pagination for large datasets
 */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import DateFilter from "../components/DateFilter";
import KPICard from "../components/KPICard";
import AnalyticsSales from "./AnalyticsSales";
import AnalyticsProducts from "./AnalyticsProducts";
import AnalyticsCustomers from "./AnalyticsCustomers";
import AnalyticsReviews from "./AnalyticsReviews";
import {
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import "../styles/Analytics.css";

function Analytics() {
  // Tab management - controls which analytics view is currently displayed
  const [activeTab, setActiveTab] = useState("overview");

  // Date range filter - shared across all tabs for consistent time-based filtering
  const [dateRange, setDateRange] = useState({});

  // Loading state for async data fetching
  const [loading, setLoading] = useState(false);

  // Overview tab data states
  // KPIs: Key Performance Indicators (total revenue, orders, avg order value, etc.)
  const [kpis, setKpis] = useState({});

  // Revenue over time: Array of daily revenue and order count data for trend chart
  const [revenueOverTime, setRevenueOverTime] = useState([]);

  // Customer segments: Object containing new vs returning customer counts
  const [customerSegments, setCustomerSegments] = useState({});

  // Top products: Array of best-selling products by revenue
  const [topProducts, setTopProducts] = useState([]);

  // Orders table state management
  // Orders: Array of order objects to display in the table
  const [orders, setOrders] = useState([]);

  // Pagination data: Contains total, per_page, current_page, last_page, from, to
  const [ordersPagination, setOrdersPagination] = useState({});

  // Search query for filtering orders by customer name, email, or order number
  const [ordersSearch, setOrdersSearch] = useState("");

  // Sorting configuration - which column to sort by
  const [ordersSortBy, setOrdersSortBy] = useState("created_at");

  // Sorting direction - ascending or descending
  const [ordersSortOrder, setOrdersSortOrder] = useState("desc");

  // Current page number for pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Responsive chart dimensions for mobile
  const [chartWidth, setChartWidth] = useState(null);
  const [chartHeight, setChartHeight] = useState(350);

  // Handle window resize for mobile charts
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 600) {
        setChartWidth(width - 48);
        setChartHeight(300);
      } else {
        setChartWidth(null);
        setChartHeight(350);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /**
   * Effect Hook: Load analytics data when tab or date range changes
   * Only triggers when dateRange has been set (not empty) to avoid unnecessary API calls
   */
  useEffect(() => {
    if (Object.keys(dateRange).length > 0) {
      loadAnalyticsData();
    }
  }, [activeTab, dateRange]);

  /**
   * Load Overview Analytics Data
   *
   * Fetches high-level analytics data for the Overview tab including:
   * - KPIs (total revenue, orders, average order value, customers, returning rate, rating)
   * - Revenue and order trends over time (daily breakdown)
   * - Customer segmentation (new vs returning)
   * - Top 5 products by revenue
   */
  const loadAnalyticsData = async () => {
    if (activeTab !== "overview") return;

    setLoading(true);
    const token = localStorage.getItem("adminToken");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
      params: dateRange,
    };

    try {
      const response = await axios.get(
        API_ENDPOINTS.ANALYTICS_OVERVIEW,
        config
      );
      if (response.data.success) {
        const data = response.data.data;
        setKpis(data.kpis);
        setRevenueOverTime(data.revenue_over_time);
        setCustomerSegments(data.customer_segments);
        console.log("Top Products Data:", data.top_products);
        setTopProducts(data.top_products);
      }
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load Orders Table Data
   *
   * Fetches paginated orders with search, sort, and filter capabilities.
   * Supports text search, column sorting, and pagination (15 orders per page).
   */
  const loadOrders = async () => {
    setLoading(true);
    const token = localStorage.getItem("adminToken");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        ...dateRange,
        search: ordersSearch,
        sort_by: ordersSortBy,
        sort_order: ordersSortOrder,
        page: currentPage,
        per_page: 15,
      },
    };

    try {
      const response = await axios.get(API_ENDPOINTS.ANALYTICS_ORDERS, config);
      if (response.data.success) {
        setOrders(response.data.data.data);
        setOrdersPagination(response.data.data);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Effect Hook: Reload orders when filters, search, sort, or page changes
   * Only triggers when on the overview tab to avoid unnecessary API calls
   */
  useEffect(() => {
    if (Object.keys(dateRange).length > 0 && activeTab === "overview") {
      loadOrders();
    }
  }, [
    dateRange,
    ordersSearch,
    ordersSortBy,
    ordersSortOrder,
    currentPage,
    activeTab,
  ]);

  /**
   * Handle Date Range Change
   * Called by DateFilter component when user selects a new date range
   */
  const handleDateChange = (dates) => {
    setDateRange(dates);
  };

  /**
   * Export Orders to CSV
   *
   * Generates and downloads a CSV file containing current orders table data.
   * CSV includes proper escaping for special characters (commas, quotes, newlines).
   */
  const handleExportCSV = () => {
    if (orders.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = [
      "Order ID",
      "Date",
      "Customer",
      "Email",
      "Items Count",
      "Total",
      "Payment Status",
      "Fulfillment Status",
    ];
    const rows = orders.map((order) => [
      order.order_number,
      order.date,
      order.customer,
      order.customer_email,
      order.items_count,
      order.total,
      order.payment_status,
      order.fulfillment_status,
    ]);

    // Build CSV with proper escaping
    let csvContent = headers.join(",") + "\n";
    rows.forEach((row) => {
      const escapedRow = row.map((cell) => {
        const cellStr = String(cell).replace(/"/g, '""');
        return cellStr.includes(",") || cellStr.includes("\n")
          ? `"${cellStr}"`
          : cellStr;
      });
      csvContent += escapedRow.join(",") + "\n";
    });

    // Create blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `orders_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Export Overview Analytics to PDF with Charts as Images
   */
  const handleExportPDF = async () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 20;

    // Title
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text("Analytics Overview Report", pageWidth / 2, yPos, { align: "center" });

    // Date Range
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const dateText = `Period: ${dateRange.start_date || 'N/A'} to ${dateRange.end_date || 'N/A'}`;
    doc.text(dateText, pageWidth / 2, yPos, { align: "center" });
    yPos += 10;

    try {
      // Capture KPI Cards
      const kpiSection = document.querySelector('.kpi-cards-row');
      if (kpiSection) {
        const kpiCanvas = await html2canvas(kpiSection, { scale: 2, backgroundColor: '#ffffff' });
        const kpiImg = kpiCanvas.toDataURL('image/png');
        const kpiWidth = pageWidth - 20;
        const kpiHeight = (kpiCanvas.height * kpiWidth) / kpiCanvas.width;

        if (yPos + kpiHeight > pageHeight - 20) {
          doc.addPage();
          yPos = 20;
        }

        doc.addImage(kpiImg, 'PNG', 10, yPos, kpiWidth, kpiHeight);
        yPos += kpiHeight + 10;
      }

      // Capture all chart cards
      const chartCards = document.querySelectorAll('.analytics-charts-grid .chart-card');
      for (let i = 0; i < chartCards.length; i++) {
        const card = chartCards[i];

        if (yPos > pageHeight - 80) {
          doc.addPage();
          yPos = 20;
        }

        const canvas = await html2canvas(card, { scale: 2, backgroundColor: '#ffffff' });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (imgHeight > pageHeight - 40) {
          const ratio = (pageHeight - 40) / imgHeight;
          const adjustedHeight = pageHeight - 40;
          const adjustedWidth = imgWidth * ratio;
          doc.addImage(imgData, 'PNG', 10, yPos, adjustedWidth, adjustedHeight);
          yPos = pageHeight - 10;
        } else {
          doc.addImage(imgData, 'PNG', 10, yPos, imgWidth, imgHeight);
          yPos += imgHeight + 10;
        }
      }

      // Capture Orders Table
      const ordersSection = document.querySelector('.analytics-table-container');
      if (ordersSection && orders.length > 0) {
        if (yPos > pageHeight - 80) {
          doc.addPage();
          yPos = 20;
        }

        const tableCanvas = await html2canvas(ordersSection, { scale: 2, backgroundColor: '#ffffff' });
        const tableImg = tableCanvas.toDataURL('image/png');
        const tableWidth = pageWidth - 20;
        const tableHeight = (tableCanvas.height * tableWidth) / tableCanvas.width;

        if (tableHeight > pageHeight - yPos - 10) {
          doc.addPage();
          yPos = 20;
        }

        doc.addImage(tableImg, 'PNG', 10, yPos, tableWidth, tableHeight);
      }

      // Save PDF
      doc.save(`analytics-overview-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>Analytics Dashboard</h2>
        <p>Monitor your business performance and key metrics</p>
      </div>

      <div className="analytics-tabs">
        <button
          className={`analytics-tab ${
            activeTab === "overview" ? "active" : ""
          }`}
          onClick={() => setActiveTab("overview")}
        >
          <i className="fas fa-chart-line"></i> Overview
        </button>
        <button
          className={`analytics-tab ${activeTab === "sales" ? "active" : ""}`}
          onClick={() => setActiveTab("sales")}
        >
          <i className="fas fa-shopping-cart"></i> Sales
        </button>
        <button
          className={`analytics-tab ${
            activeTab === "products" ? "active" : ""
          }`}
          onClick={() => setActiveTab("products")}
        >
          <i className="fas fa-box"></i> Products
        </button>
        <button
          className={`analytics-tab ${
            activeTab === "customers" ? "active" : ""
          }`}
          onClick={() => setActiveTab("customers")}
        >
          <i className="fas fa-users"></i> Customers
        </button>
        <button
          className={`analytics-tab ${activeTab === "reviews" ? "active" : ""}`}
          onClick={() => setActiveTab("reviews")}
        >
          <i className="fas fa-star"></i> Reviews
        </button>
      </div>

      <DateFilter onDateChange={handleDateChange} />

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <>
          {/* Export Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', marginTop: '10px' }}>
            <button className="btn-export-csv" onClick={handleExportPDF}>
              <i className="fas fa-file-pdf"></i> Export PDF
            </button>
          </div>

          {/* KPI Cards */}
          <div className="kpi-cards-row">
            {kpis.total_revenue && (
              <KPICard
                label={kpis.total_revenue.label}
                value={kpis.total_revenue.value}
                trend={kpis.total_revenue.trend}
                icon="fas fa-rupee-sign"
                formatter="currency"
              />
            )}
            {kpis.total_orders && (
              <KPICard
                label={kpis.total_orders.label}
                value={kpis.total_orders.value}
                trend={kpis.total_orders.trend}
                icon="fas fa-shopping-bag"
                formatter="number"
              />
            )}
            {kpis.avg_order_value && (
              <KPICard
                label={kpis.avg_order_value.label}
                value={kpis.avg_order_value.value}
                trend={kpis.avg_order_value.trend}
                icon="fas fa-chart-bar"
                formatter="currency"
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
            {kpis.returning_customer_percent && (
              <KPICard
                label={kpis.returning_customer_percent.label}
                value={kpis.returning_customer_percent.value}
                trend={kpis.returning_customer_percent.trend}
                icon="fas fa-redo"
                formatter="percentage"
              />
            )}
            {kpis.avg_rating && (
              <KPICard
                label={kpis.avg_rating.label}
                value={kpis.avg_rating.value}
                trend={kpis.avg_rating.trend}
                icon="fas fa-star"
                formatter="rating"
              />
            )}
          </div>

          {/* Charts */}
          <div className="analytics-charts-grid">
            {/* Revenue & Orders Over Time */}
            <div className="chart-card" style={{ gridColumn: "1 / -1" }}>
              <div className="chart-card-header">
                <h3>Revenue & Orders Over Time</h3>
                <p>Daily breakdown of revenue and order volume</p>
              </div>
              <div className="chart-card-body" style={{ minHeight: chartHeight, overflow: 'auto' }}>
                {revenueOverTime.length > 0 ? (
                  chartWidth ? (
                    <ComposedChart data={revenueOverTime} width={chartWidth} height={chartHeight}>
                      <defs>
                        <linearGradient
                          id="colorRevenue"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#a33d3d"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#a33d3d"
                            stopOpacity={0.3}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="date"
                        stroke="#6b7280"
                        style={{ fontSize: "12px", fontWeight: 500 }}
                        tickLine={false}
                        angle={-90}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis
                        yAxisId="left"
                        stroke="#a33d3d"
                        style={{ fontSize: "12px", fontWeight: 500 }}
                        tickLine={false}
                        domain={[0, "auto"]}
                        label={{
                          value: "Revenue (₹)",
                          angle: -90,
                          position: "insideLeft",
                          style: { fill: "#a33d3d", fontSize: "12px" },
                        }}
                        tickFormatter={(value) => `₹${value.toLocaleString()}`}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#10b981"
                        style={{ fontSize: "12px", fontWeight: 500 }}
                        tickLine={false}
                        domain={[0, "auto"]}
                        label={{
                          value: "Orders",
                          angle: 90,
                          position: "insideRight",
                          style: { fill: "#10b981", fontSize: "12px" },
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          padding: "12px",
                        }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div
                                style={{
                                  backgroundColor: "#fff",
                                  border: "1px solid #e5e7eb",
                                  borderRadius: "8px",
                                  padding: "12px",
                                  boxShadow:
                                    "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                }}
                              >
                                <p
                                  style={{
                                    margin: 0,
                                    fontWeight: "bold",
                                    marginBottom: "8px",
                                    color: "#374151",
                                  }}
                                >
                                  {data.date}
                                </p>
                                <p
                                  style={{
                                    margin: 0,
                                    color: "#a33d3d",
                                    marginBottom: "4px",
                                  }}
                                >
                                  Revenue: ₹
                                  {Number(data.revenue).toLocaleString(
                                    "en-IN",
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )}
                                </p>
                                <p style={{ margin: 0, color: "#10b981" }}>
                                  Orders: {data.orders}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend
                        wrapperStyle={{ paddingTop: "20px" }}
                        iconType="circle"
                      />
                      <Bar
                        yAxisId="left"
                        dataKey="revenue"
                        fill="url(#colorRevenue)"
                        name="Revenue (₹)"
                        radius={[8, 8, 0, 0]}
                        barSize={40}
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="revenue"
                        stroke="#10b981"
                        strokeWidth={3}
                        name="Revenue Trend"
                        dot={{ fill: "#10b981", strokeWidth: 2, r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                    </ComposedChart>
                  ) : (
                    <ResponsiveContainer width="100%" height={chartHeight}>
                      <ComposedChart data={revenueOverTime}>
                        <defs>
                          <linearGradient
                            id="colorRevenue"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#a33d3d"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#a33d3d"
                              stopOpacity={0.3}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="date"
                          stroke="#6b7280"
                          style={{ fontSize: "12px", fontWeight: 500 }}
                          tickLine={false}
                          angle={-90}
                          textAnchor="end"
                          height={100}
                        />
                        <YAxis
                          yAxisId="left"
                          stroke="#a33d3d"
                          style={{ fontSize: "12px", fontWeight: 500 }}
                          tickLine={false}
                          domain={[0, "auto"]}
                          label={{
                            value: "Revenue (₹)",
                            angle: -90,
                            position: "insideLeft",
                            style: { fill: "#a33d3d", fontSize: "12px" },
                          }}
                          tickFormatter={(value) => `₹${value.toLocaleString()}`}
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          stroke="#10b981"
                          style={{ fontSize: "12px", fontWeight: 500 }}
                          tickLine={false}
                          domain={[0, "auto"]}
                          label={{
                            value: "Orders",
                            angle: 90,
                            position: "insideRight",
                            style: { fill: "#10b981", fontSize: "12px" },
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            padding: "12px",
                          }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div
                                  style={{
                                    backgroundColor: "#fff",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "8px",
                                    padding: "12px",
                                    boxShadow:
                                      "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                  }}
                                >
                                  <p
                                    style={{
                                      margin: 0,
                                      fontWeight: "bold",
                                      marginBottom: "8px",
                                      color: "#374151",
                                    }}
                                  >
                                    {data.date}
                                  </p>
                                  <p
                                    style={{
                                      margin: 0,
                                      color: "#a33d3d",
                                      marginBottom: "4px",
                                    }}
                                  >
                                    Revenue: ₹
                                    {Number(data.revenue).toLocaleString(
                                      "en-IN",
                                      {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      }
                                    )}
                                  </p>
                                  <p style={{ margin: 0, color: "#10b981" }}>
                                    Orders: {data.orders}
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Legend
                          wrapperStyle={{ paddingTop: "20px" }}
                          iconType="circle"
                        />
                        <Bar
                          yAxisId="left"
                          dataKey="revenue"
                          fill="url(#colorRevenue)"
                          name="Revenue (₹)"
                          radius={[8, 8, 0, 0]}
                          barSize={40}
                        />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="revenue"
                          stroke="#10b981"
                          strokeWidth={3}
                          name="Revenue Trend"
                          dot={{ fill: "#10b981", strokeWidth: 2, r: 5 }}
                          activeDot={{ r: 7 }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  )
                ) : (
                  <div className="chart-no-data">
                    <i className="fas fa-chart-line"></i>
                    <p>No data available for selected period</p>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Segments */}
            <div className="chart-card" style={{ gridColumn: "1 / -1" }}>
              <div className="chart-card-header">
                <h3>New vs Returning Customers</h3>
                <p>Customer distribution breakdown</p>
              </div>
              <div className="chart-card-body" style={{ minHeight: 300, overflow: 'auto' }}>
                {customerSegments.new > 0 || customerSegments.returning > 0 ? (
                  chartWidth ? (
                    <PieChart width={chartWidth} height={300}>
                      <Pie
                        data={[
                          {
                            name: "New Customers",
                            value: customerSegments.new,
                          },
                          {
                            name: "Returning Customers",
                            value: customerSegments.returning,
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#8b5cf6" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "New Customers",
                            value: customerSegments.new,
                          },
                          {
                            name: "Returning Customers",
                            value: customerSegments.returning,
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(1)}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#a33d3d" />
                        <Cell fill="#10b981" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  )
                ) : (
                  <div className="chart-no-data">
                    <i className="fas fa-users"></i>
                    <p>No customer data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Top Products */}
            <div className="chart-card" style={{ gridColumn: "1 / -1" }}>
              <div className="chart-card-header">
                <h3>Top 5 Products by Revenue</h3>
                <p>Best performing products</p>
              </div>
              <div className="chart-card-body" style={{ minHeight: 300, overflow: 'auto' }}>
                {topProducts.length > 0 ? (
                  chartWidth ? (
                    <BarChart
                      data={topProducts}
                      layout="vertical"
                      width={chartWidth}
                      height={300}
                    >
                      <defs>
                        <linearGradient
                          id="colorProductRevenue"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="0"
                        >
                          <stop
                            offset="5%"
                            stopColor="#a33d3d"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#a33d3d"
                            stopOpacity={0.6}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        type="number"
                        stroke="#666"
                        style={{ fontSize: "12px", fontWeight: "500" }}
                        tickLine={false}
                        tickFormatter={(value) => `₹${value.toLocaleString()}`}
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        width={150}
                        stroke="#666"
                        style={{ fontSize: "11px", fontWeight: "500" }}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e0e0e0",
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                        formatter={(value) => [
                          `₹${value.toLocaleString()}`,
                          "Revenue",
                        ]}
                      />
                      <Legend />
                      <Bar
                        dataKey="revenue"
                        fill="url(#colorProductRevenue)"
                        name="Revenue (₹)"
                        radius={[0, 8, 8, 0]}
                        barSize={30}
                      />
                    </BarChart>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                    <BarChart 
                        data={topProducts} 
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                      >
                      <defs>
                        <linearGradient
                          id="colorTopProducts"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="0"
                        >
                          <stop
                            offset="5%"
                            stopColor="#a33d3d"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#a33d3d"
                            stopOpacity={0.6}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        type="number"
                        stroke="#666"
                        style={{ fontSize: "12px", fontWeight: "500" }}
                        tickFormatter={(value) => `₹${value.toLocaleString()}`}
                        tickLine={false}
                        domain={[0, 'dataMax']}
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        width={200}
                        stroke="#666"
                        style={{ fontSize: "11px", fontWeight: "500" }}
                        tickLine={false}
                        tick={(props) => {
                          const { x, y, payload } = props;
                          const maxLength = 25;
                          const text = payload.value;
                          const displayText =
                            text.length > maxLength
                              ? text.substring(0, maxLength) + "..."
                              : text;
                          return (
                            <text
                              x={x}
                              y={y}
                              dy={4}
                              textAnchor="end"
                              fill="#666"
                              fontSize="11px"
                              fontWeight="500"
                            >
                              {displayText}
                            </text>
                          );
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e0e0e0",
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          padding: "10px",
                        }}
                        cursor={{ fill: "rgba(163, 61, 61, 0.1)" }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div
                                style={{
                                  backgroundColor: "#fff",
                                  border: "1px solid #e0e0e0",
                                  borderRadius: "8px",
                                  padding: "10px",
                                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                }}
                              >
                                <p
                                  style={{
                                    margin: 0,
                                    fontWeight: "bold",
                                    marginBottom: "5px",
                                  }}
                                >
                                  {data.name}
                                </p>
                                <p style={{ margin: 0, color: "#a33d3d" }}>
                                  Revenue: ₹{data.revenue.toLocaleString()}
                                </p>
                                <p style={{ margin: 0, color: "#666" }}>
                                  Units Sold: {data.units_sold}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar
                        dataKey="revenue"
                        fill="url(#colorTopProducts)"
                        name="Revenue (₹)"
                        radius={[0, 8, 8, 0]}
                        barSize={30}
                        cursor="pointer"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                  )
                ) : (
                  <div className="chart-no-data">
                    <i className="fas fa-box"></i>
                    <p>No product data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Latest Orders Table */}
          <div className="orders-table-card">
            <div className="orders-table-header">
              <h3>Latest Orders</h3>
              <div className="orders-table-actions">
                <div className="orders-search">
                  <i className="fas fa-search"></i>
                  <input
                    type="text"
                    placeholder="Search orders, customers..."
                    value={ordersSearch}
                    onChange={(e) => setOrdersSearch(e.target.value)}
                  />
                </div>
                <button className="btn-export-csv" onClick={handleExportCSV}>
                  <i className="fas fa-file-csv"></i> Export CSV
                </button>
              </div>
            </div>

            <table className="analytics-table">
              <thead>
                <tr>
                  <th
                    onClick={() => {
                      setOrdersSortBy("id");
                      setOrdersSortOrder(
                        ordersSortOrder === "asc" ? "desc" : "asc"
                      );
                    }}
                  >
                    Order ID <i className="fas fa-sort"></i>
                  </th>
                  <th
                    onClick={() => {
                      setOrdersSortBy("created_at");
                      setOrdersSortOrder(
                        ordersSortOrder === "asc" ? "desc" : "asc"
                      );
                    }}
                  >
                    Date <i className="fas fa-sort"></i>
                  </th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th
                    onClick={() => {
                      setOrdersSortBy("total_amount");
                      setOrdersSortOrder(
                        ordersSortOrder === "asc" ? "desc" : "asc"
                      );
                    }}
                  >
                    Total <i className="fas fa-sort"></i>
                  </th>
                  <th>Payment Status</th>
                  <th>Fulfillment Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <strong>{order.order_number}</strong>
                      </td>
                      <td>{new Date(order.date).toLocaleDateString()}</td>
                      <td>
                        <div>{order.customer}</div>
                        <div style={{ fontSize: "12px", color: "#9ca3af" }}>
                          {order.customer_email}
                        </div>
                      </td>
                      <td>{order.items_count} items</td>
                      <td>
                        <strong>
                          ₹
                          {Number(order.total).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </strong>
                      </td>
                      <td>
                        <span
                          className={`status-badge status-${order.payment_status}`}
                        >
                          {order.payment_status}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`status-badge status-${order.fulfillment_status}`}
                        >
                          {order.fulfillment_status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "#9ca3af",
                      }}
                    >
                      <i
                        className="fas fa-inbox"
                        style={{
                          fontSize: "32px",
                          marginBottom: "12px",
                          display: "block",
                        }}
                      ></i>
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {ordersPagination.total > 0 && (
              <div className="table-pagination">
                <div className="pagination-info">
                  Showing {ordersPagination.from} to {ordersPagination.to} of{" "}
                  {ordersPagination.total} orders
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
                    disabled={currentPage === ordersPagination.last_page}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* SALES TAB */}
      {activeTab === "sales" && <AnalyticsSales dateRange={dateRange} />}

      {/* PRODUCTS TAB */}
      {activeTab === "products" && <AnalyticsProducts dateRange={dateRange} />}

      {/* CUSTOMERS TAB */}
      {activeTab === "customers" && (
        <AnalyticsCustomers dateRange={dateRange} />
      )}

      {/* REVIEWS TAB */}
      {activeTab === "reviews" && <AnalyticsReviews dateRange={dateRange} />}
    </div>
  );
}

export default Analytics;
