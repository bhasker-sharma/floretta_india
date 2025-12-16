/**
 * AnalyticsSales Component
 *
 * Provides detailed sales analytics and reporting:
 * - Sales KPIs (total revenue, orders, conversion rate, refunded orders)
 * - Multi-view sales charts (by day, category, payment method)
 * - Detailed orders table with advanced filtering
 * - CSV export for sales data
 *
 * Key Features:
 * - Multiple chart visualizations with tab switching
 * - Advanced filtering by payment and fulfillment status
 * - Real-time search across orders
 * - Sortable columns with pagination
 */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import KPICard from "../components/KPICard";
import {
  ComposedChart,
  Line,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

function AnalyticsSales({ dateRange }) {
  const [loading, setLoading] = useState(false);

  // Sales KPIs: total revenue, total orders, conversion rate, refunded orders
  const [kpis, setKpis] = useState({});

  // Chart data states for different visualizations
  const [salesByDay, setSalesByDay] = useState([]); // Daily sales trend
  const [salesByCategory, setSalesByCategory] = useState([]); // Sales breakdown by product category
  const [salesByPaymentMethod, setSalesByPaymentMethod] = useState([]); // Sales by payment type
  const [salesByStatus, setSalesByStatus] = useState([]); // Sales by order status

  // Orders table data
  const [orders, setOrders] = useState([]);
  const [ordersPagination, setOrdersPagination] = useState({});

  // Chart tab state - controls which sales chart is displayed (day/category/payment)
  const [chartTab, setChartTab] = useState("day");

  // Advanced filters for orders table
  const [ordersSearch, setOrdersSearch] = useState(""); // Text search query
  const [paymentStatusFilter, setPaymentStatusFilter] = useState(""); // Filter by payment status
  const [fulfillmentStatusFilter, setFulfillmentStatusFilter] = useState(""); // Filter by fulfillment status
  const [ordersSortBy, setOrdersSortBy] = useState("created_at"); // Sort column
  const [ordersSortOrder, setOrdersSortOrder] = useState("desc"); // Sort direction
  const [currentPage, setCurrentPage] = useState(1); // Pagination

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
   * Effect Hook: Initial data load when date range changes
   * Loads both sales charts data and orders table on date range update
   */
  useEffect(() => {
    if (Object.keys(dateRange).length > 0) {
      loadSalesData();
      loadOrders();
    }
  }, [dateRange]);

  /**
   * Effect Hook: Reload orders when filters change
   * Triggers when search query, status filters, sorting, or pagination changes
   */
  useEffect(() => {
    if (Object.keys(dateRange).length > 0) {
      loadOrders();
    }
  }, [
    ordersSearch,
    paymentStatusFilter,
    fulfillmentStatusFilter,
    ordersSortBy,
    ordersSortOrder,
    currentPage,
  ]);

  /**
   * Load Sales Analytics Data
   *
   * Fetches comprehensive sales metrics including:
   * - KPIs: Total revenue, orders, conversion rate, refunded orders
   * - Sales by day: Daily revenue and order count trends
   * - Sales by category: Revenue and units sold per product category
   * - Sales by payment method: Revenue distribution across payment types
   * - Sales by status: Order status breakdown
   */
  const loadSalesData = async () => {
    setLoading(true);
    const token = localStorage.getItem("adminToken");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
      params: dateRange,
    };

    try {
      const response = await axios.get(API_ENDPOINTS.ANALYTICS_SALES, config);
      if (response.data.success) {
        const data = response.data.data;
        setKpis(data.kpis || {});
        setSalesByDay(data.sales_by_day || []);
        setSalesByCategory(data.sales_by_category || []);
        setSalesByPaymentMethod(data.sales_by_payment_method || []);
        setSalesByStatus(data.sales_by_status || []);
      }
    } catch (error) {
      console.error("Error loading sales data:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load Detailed Orders with Advanced Filtering
   *
   * Fetches orders with multiple filter options:
   * - Text search (order number, customer name/email)
   * - Payment status filter (paid, pending, failed, refunded)
   * - Fulfillment status filter (Order Placed, Shipped, In-Transit, Delivered)
   * - Column sorting and pagination (15 per page)
   */
  const loadOrders = async () => {
    setLoading(true);
    const token = localStorage.getItem("adminToken");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        ...dateRange,
        search: ordersSearch,
        payment_status: paymentStatusFilter,
        fulfillment_status: fulfillmentStatusFilter,
        sort_by: ordersSortBy,
        sort_order: ordersSortOrder,
        page: currentPage,
        per_page: 15,
      },
    };

    try {
      const response = await axios.get(API_ENDPOINTS.ANALYTICS_ORDERS, config);
      if (response.data.success) {
        setOrders(response.data.data.data || []);
        setOrdersPagination(response.data.data);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Export Sales Orders to CSV
   *
   * Creates a downloadable CSV file with all currently displayed orders.
   * Includes order details, customer info, and status information.
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
      "Items",
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

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `sales_orders_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Export Sales Analytics to PDF with visible charts and data
   */
  const handleExportPDF = async () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 20;

    // Title
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text("Sales Analytics Report", pageWidth / 2, yPos, { align: "center" });

    // Date Range
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const dateText = `Period: ${dateRange.start_date || 'N/A'} to ${dateRange.end_date || 'N/A'}`;
    doc.text(dateText, pageWidth / 2, yPos, { align: "center" });
    yPos += 15;

    try {
      // Temporarily hide export button
      const exportBtn = document.querySelector('.btn-export-csv');
      const originalDisplay = exportBtn ? exportBtn.parentElement.style.display : '';
      if (exportBtn) exportBtn.parentElement.style.display = 'none';

      // Capture KPI Cards
      const kpiSection = document.querySelector('.kpi-cards-row');
      if (kpiSection) {
        const kpiCanvas = await html2canvas(kpiSection, { scale: 2, backgroundColor: '#ffffff', logging: false });
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
      const chartCards = document.querySelectorAll('.chart-card');
      for (let i = 0; i < chartCards.length; i++) {
        const card = chartCards[i];

        if (yPos > pageHeight - 60) {
          doc.addPage();
          yPos = 20;
        }

        const canvas = await html2canvas(card, { scale: 1.5, backgroundColor: '#ffffff', logging: false });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const maxHeight = pageHeight - yPos - 20;
        if (imgHeight > maxHeight) {
          doc.addPage();
          yPos = 20;
          const adjustedHeight = Math.min(imgHeight, pageHeight - 40);
          const adjustedWidth = (canvas.width * adjustedHeight) / canvas.height;
          doc.addImage(imgData, 'PNG', 10, yPos, Math.min(adjustedWidth, pageWidth - 20), adjustedHeight);
          yPos += adjustedHeight + 10;
        } else {
          doc.addImage(imgData, 'PNG', 10, yPos, imgWidth, imgHeight);
          yPos += imgHeight + 10;
        }
      }

      // Capture tables if present
      const tables = document.querySelectorAll('.analytics-table-container, table');
      for (let i = 0; i < tables.length; i++) {
        const table = tables[i];
        if (table.offsetHeight === 0) continue;

        if (yPos > pageHeight - 60) {
          doc.addPage();
          yPos = 20;
        }

        const tableCanvas = await html2canvas(table, { scale: 1.5, backgroundColor: '#ffffff', logging: false });
        const tableImg = tableCanvas.toDataURL('image/png');
        const tableWidth = pageWidth - 20;
        const tableHeight = (tableCanvas.height * tableWidth) / tableCanvas.width;

        if (tableHeight > pageHeight - yPos - 20) {
          doc.addPage();
          yPos = 20;
        }

        const maxTableHeight = pageHeight - yPos - 20;
        if (tableHeight > maxTableHeight) {
          const adjustedHeight = maxTableHeight;
          const adjustedWidth = (tableCanvas.width * adjustedHeight) / tableCanvas.height;
          doc.addImage(tableImg, 'PNG', 10, yPos, Math.min(adjustedWidth, pageWidth - 20), adjustedHeight);
        } else {
          doc.addImage(tableImg, 'PNG', 10, yPos, tableWidth, tableHeight);
        }
        yPos += Math.min(tableHeight, maxTableHeight) + 10;
      }

      // Restore export button
      if (exportBtn) exportBtn.parentElement.style.display = originalDisplay;

      // Save PDF
      doc.save(`sales-analytics-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');

      // Restore export button on error
      const exportBtn = document.querySelector('.btn-export-csv');
      if (exportBtn && exportBtn.parentElement) {
        exportBtn.parentElement.style.display = '';
      }
    }
  };

  // Color palette for chart visualizations
  const COLORS = ["#a33d3d", "#10b981", "#f59e0b", "#3b82f6", "#8b5cf6"];

  return (
    <div>
      {/* Export Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
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
        {/* {kpis.conversion_rate && (
          <KPICard
            label={kpis.conversion_rate.label}
            value={kpis.conversion_rate.value}
            trend={kpis.conversion_rate.trend}
            icon="fas fa-chart-line"
            formatter="percentage"
          />
        )} */}
        {kpis.refunded_orders && (
          <KPICard
            label={kpis.refunded_orders.label}
            value={kpis.refunded_orders.value}
            trend={kpis.refunded_orders.trend}
            icon="fas fa-undo"
            formatter="number"
          />
        )}
      </div>

      {/* Main Chart with Tabs */}
      <div
        className="chart-card"
        style={{ gridColumn: "1 / -1", marginBottom: "24px" }}
      >
        <div className="chart-card-header">
          <h3>Sales Performance</h3>
          <div className="chart-tabs">
            <button
              className={`chart-tab ${chartTab === "day" ? "active" : ""}`}
              onClick={() => setChartTab("day")}
            >
              By Date
            </button>
            <button
              className={`chart-tab ${chartTab === "category" ? "active" : ""}`}
              onClick={() => setChartTab("category")}
            >
              By Category
            </button>
            <button
              className={`chart-tab ${chartTab === "payment" ? "active" : ""}`}
              onClick={() => setChartTab("payment")}
            >
              By Payment Method
            </button>
          </div>
        </div>
        <div className="chart-card-body" style={{ minHeight: chartHeight, overflow: 'auto' }}>
          {chartTab === "day" && salesByDay.length > 0 ? (
            chartWidth ? (
              <ComposedChart data={salesByDay} width={chartWidth} height={chartHeight}>
                <defs>
                  <linearGradient
                    id="colorSalesRevenue"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#a33d3d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#a33d3d" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  stroke="#666"
                  style={{ fontSize: "12px", fontWeight: "500" }}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#a33d3d"
                  style={{ fontSize: "12px", fontWeight: "500" }}
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
                  style={{ fontSize: "12px", fontWeight: "500" }}
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
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    padding: "12px",
                  }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div
                          style={{
                            backgroundColor: "#fff",
                            border: "1px solid #e0e0e0",
                            borderRadius: "8px",
                            padding: "12px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
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
                            {Number(data.revenue).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
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
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="revenue"
                  fill="url(#colorSalesRevenue)"
                  name="Revenue (₹)"
                  radius={[8, 8, 0, 0]}
                  barSize={40}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Orders"
                />
              </ComposedChart>
            ) : (
              <ResponsiveContainer width="100%" height={chartHeight}>
                <ComposedChart data={salesByDay}>
                <defs>
                  <linearGradient
                    id="colorSalesRevenue"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#a33d3d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#a33d3d" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  stroke="#666"
                  style={{ fontSize: "12px", fontWeight: "500" }}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#a33d3d"
                  style={{ fontSize: "12px", fontWeight: "500" }}
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
                  style={{ fontSize: "12px", fontWeight: "500" }}
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
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    padding: "12px",
                  }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div
                          style={{
                            backgroundColor: "#fff",
                            border: "1px solid #e0e0e0",
                            borderRadius: "8px",
                            padding: "12px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
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
                            {Number(data.revenue).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
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
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="revenue"
                  fill="url(#colorSalesRevenue)"
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
          ) : chartTab === "category" && salesByCategory.length > 0 ? (
            chartWidth ? (
              <BarChart
                data={salesByCategory}
                barCategoryGap="20%"
                width={chartWidth}
                height={chartHeight}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a33d3d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#a33d3d" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="category"
                  stroke="#666"
                  style={{ fontSize: "12px", fontWeight: "500" }}
                  tickLine={false}
                  tickFormatter={(value) => {
                    if (!value) return "Uncategorized";
                    const formatted = value.toLowerCase().replace(/\s+/g, "_");
                    if (formatted === "perfume" || formatted === "perfumes")
                      return "Perfume";
                    if (formatted === "freshener" || formatted === "freshner")
                      return "Freshener";
                    if (formatted === "facemist" || formatted === "face_mist")
                      return "Face Mist";
                    return value
                      .split("_")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ");
                  }}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#a33d3d"
                  style={{ fontSize: "12px", fontWeight: "500" }}
                  tickLine={false}
                  domain={[0, "auto"]}
                  label={{
                    value: "Revenue (₹)",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "#a33d3d", fontSize: "11px" },
                  }}
                  tickFormatter={(value) => `₹${value.toLocaleString()}`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#10b981"
                  style={{ fontSize: "12px", fontWeight: "500" }}
                  tickLine={false}
                  domain={[0, "auto"]}
                  label={{
                    value: "Units Sold",
                    angle: 90,
                    position: "insideRight",
                    style: { fill: "#10b981", fontSize: "11px" },
                  }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(163, 61, 61, 0.1)" }}
                  wrapperStyle={{ outline: "none" }}
                  isAnimationActive={false}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value, name) => {
                    if (name === "Revenue (₹)")
                      return [`₹${value.toLocaleString()}`, name];
                    return [value, name];
                  }}
                  labelFormatter={(value) => {
                    if (!value) return "Uncategorized";
                    const formatted = value.toLowerCase().replace(/\s+/g, "_");
                    if (formatted === "perfume" || formatted === "perfumes")
                      return "Perfume";
                    if (formatted === "freshener" || formatted === "freshner")
                      return "Freshener";
                    if (formatted === "facemist" || formatted === "face_mist")
                      return "Face Mist";
                    return value
                      .split("_")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ");
                  }}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="revenue"
                  fill="url(#colorRevenue)"
                  name="Revenue (₹)"
                  radius={[8, 8, 0, 0]}
                  barSize={40}
                  isAnimationActive={false}
                />
                <Bar
                  yAxisId="right"
                  dataKey="units_sold"
                  fill="url(#colorUnits)"
                  name="Units Sold"
                  radius={[8, 8, 0, 0]}
                  barSize={40}
                  isAnimationActive={false}
                />
              </BarChart>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={salesByCategory} barCategoryGap="20%">
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#a33d3d" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#a33d3d" stopOpacity={0.6} />
                    </linearGradient>
                    <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="category"
                    stroke="#666"
                    style={{ fontSize: "12px", fontWeight: "500" }}
                    tickLine={false}
                    tickFormatter={(value) => {
                      if (!value) return "Uncategorized";
                      const formatted = value
                        .toLowerCase()
                        .replace(/\s+/g, "_");
                      if (formatted === "perfume" || formatted === "perfumes")
                        return "Perfume";
                      if (
                        formatted === "freshener" ||
                        formatted === "freshner"
                      )
                        return "Freshener";
                      if (
                        formatted === "facemist" ||
                        formatted === "face_mist"
                      )
                        return "Face Mist";
                      return value
                        .split("_")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ");
                    }}
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="#a33d3d"
                    style={{ fontSize: "12px", fontWeight: "500" }}
                    tickLine={false}
                    domain={[0, "auto"]}
                    label={{
                      value: "Revenue (₹)",
                      angle: -90,
                      position: "insideLeft",
                      style: { fill: "#a33d3d", fontSize: "11px" },
                    }}
                    tickFormatter={(value) => `₹${value.toLocaleString()}`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#10b981"
                    style={{ fontSize: "12px", fontWeight: "500" }}
                    tickLine={false}
                    domain={[0, "auto"]}
                    label={{
                      value: "Units Sold",
                      angle: 90,
                      position: "insideRight",
                      style: { fill: "#10b981", fontSize: "11px" },
                    }}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(163, 61, 61, 0.1)" }}
                    wrapperStyle={{ outline: "none" }}
                    isAnimationActive={false}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value, name) => {
                      if (name === "Revenue (₹)")
                        return [`₹${value.toLocaleString()}`, name];
                      return [value, name];
                    }}
                    labelFormatter={(value) => {
                      if (!value) return "Uncategorized";
                      const formatted = value
                        .toLowerCase()
                        .replace(/\s+/g, "_");
                      if (formatted === "perfume" || formatted === "perfumes")
                        return "Perfume";
                      if (
                        formatted === "freshener" ||
                        formatted === "freshner"
                      )
                        return "Freshener";
                      if (
                        formatted === "facemist" ||
                        formatted === "face_mist"
                      )
                        return "Face Mist";
                      return value
                        .split("_")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ");
                    }}
                  />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="revenue"
                    fill="url(#colorRevenue)"
                    name="Revenue (₹)"
                    radius={[8, 8, 0, 0]}
                    barSize={40}
                    isAnimationActive={false}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="units_sold"
                    fill="url(#colorUnits)"
                    name="Units Sold"
                    radius={[8, 8, 0, 0]}
                    barSize={40}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            )
          ) : chartTab === "payment" && salesByPaymentMethod.length > 0 ? (
            chartWidth ? (
              <PieChart width={chartWidth} height={chartHeight}>
                <Pie
                  data={salesByPaymentMethod}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ payment_method, percent }) =>
                    `${payment_method}: ${(percent * 100).toFixed(1)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="revenue"
                  nameKey="payment_method"
                >
                  {salesByPaymentMethod.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={salesByPaymentMethod}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ payment_method, percent }) =>
                      `${payment_method}: ${(percent * 100).toFixed(1)}%`
                    }
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="revenue"
                    nameKey="payment_method"
                  >
                    {salesByPaymentMethod.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )
          ) : (
            <div className="chart-no-data">
              <i className="fas fa-chart-bar"></i>
              <p>No data available for selected period</p>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Orders Table */}
      <div className="orders-table-card">
        <div className="orders-table-header">
          <h3>Detailed Orders</h3>
          <div className="orders-table-actions">
            <div className="orders-search">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search orders..."
                value={ordersSearch}
                onChange={(e) => setOrdersSearch(e.target.value)}
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
            <label>Payment Status:</label>
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Fulfillment Status:</label>
            <select
              value={fulfillmentStatusFilter}
              onChange={(e) => setFulfillmentStatusFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="Order Placed">Order Placed</option>
              <option value="Shipped">Shipped</option>
              <option value="In-Transit">In-Transit</option>
              <option value="Delivered">Delivered</option>
            </select>
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

      <style jsx>{`
        .chart-tabs {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }

        .chart-tab {
          padding: 8px 16px;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
        }

        .chart-tab:hover {
          background: #e5e7eb;
        }

        .chart-tab.active {
          background: #a33d3d;
          color: white;
          border-color: #a33d3d;
        }

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

export default AnalyticsSales;
