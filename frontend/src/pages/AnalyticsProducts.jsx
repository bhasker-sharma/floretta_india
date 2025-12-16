/**
 * AnalyticsProducts Component
 *
 * Comprehensive product performance analytics dashboard:
 * - Product KPIs (active products, out of stock items, top product, returns)
 * - Top products by revenue with configurable limits
 * - Detailed product performance table with multi-criteria filtering
 * - Low stock alerts for inventory management
 * - CSV export for product data
 *
 * Key Features:
 * - Dynamic top products chart (Top 5/10/20)
 * - Advanced filtering: category, stock status, search
 * - Stock status indicators (In Stock, Low Stock, Out of Stock)
 * - Days since last sale tracking
 * - Product rating display
 */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import KPICard from "../components/KPICard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

function AnalyticsProducts({ dateRange }) {
  const [loading, setLoading] = useState(false);

  // Product KPIs
  const [kpis, setKpis] = useState({});

  // Chart and table data
  const [topProducts, setTopProducts] = useState([]); // Top N products by revenue
  const [allProductsRevenue, setAllProductsRevenue] = useState([]); // All products for detailed graph
  const [productPerformance, setProductPerformance] = useState([]); // Detailed product performance table
  const [lowStock, setLowStock] = useState([]); // Products with low/no stock
  const [productsPagination, setProductsPagination] = useState({}); // Pagination metadata

  // Filter states
  const [topProductsLimit, setTopProductsLimit] = useState(10); // Number of top products to show (5/10/20)
  const [categoryFilter, setCategoryFilter] = useState(""); // Filter by product category
  const [stockFilter, setStockFilter] = useState(""); // Filter by stock status (in_stock/low_stock/out_of_stock)
  const [productsSearch, setProductsSearch] = useState(""); // Text search for product names
  const [productsSortBy, setProductsSortBy] = useState("revenue"); // Sort column
  const [productsSortOrder, setProductsSortOrder] = useState("desc"); // Sort direction
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination

  // Responsive Y-axis width and font size
  const [yAxisWidth, setYAxisWidth] = useState(250);
  const [yAxisFontSize, setYAxisFontSize] = useState(11);
  const [chartMargin, setChartMargin] = useState({ top: 5, right: 30, left: 20, bottom: 5 });
  const [chartWidth, setChartWidth] = useState(null); // Fixed width for mobile
  const [chartHeight, setChartHeight] = useState(350); // Dynamic height

  // Handle window resize for responsive Y-axis
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      console.log('Window width:', width); // Debug log

      if (width <= 600) {
        // Mobile devices (including iPhone 14 Pro Max at 430px)
        setYAxisWidth(60);
        setYAxisFontSize(7);
        setChartMargin({ top: 5, right: 10, left: 5, bottom: 5 });
        setChartWidth(width - 48); // Full width minus padding (24px on each side)
        setChartHeight(300);
      } else if (width <= 768) {
        // Small tablets
        setYAxisWidth(120);
        setYAxisFontSize(9);
        setChartMargin({ top: 5, right: 20, left: 10, bottom: 5 });
        setChartWidth(null); // Use ResponsiveContainer
        setChartHeight(350);
      } else if (width <= 1024) {
        // Tablets
        setYAxisWidth(180);
        setYAxisFontSize(10);
        setChartMargin({ top: 5, right: 25, left: 15, bottom: 5 });
        setChartWidth(null); // Use ResponsiveContainer
        setChartHeight(350);
      } else {
        // Desktop
        setYAxisWidth(250);
        setYAxisFontSize(11);
        setChartMargin({ top: 5, right: 30, left: 20, bottom: 5 });
        setChartWidth(null); // Use ResponsiveContainer
        setChartHeight(350);
      }
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /**
   * Effect Hook: Load data when date range or top products limit changes
   */
  useEffect(() => {
    if (Object.keys(dateRange).length > 0) {
      loadProductsData();
    }
  }, [dateRange, topProductsLimit]);

  /**
   * Effect Hook: Reload data when filters, search, sort, or pagination changes
   */
  useEffect(() => {
    if (Object.keys(dateRange).length > 0) {
      loadProductsData();
    }
  }, [
    categoryFilter,
    stockFilter,
    productsSearch,
    productsSortBy,
    productsSortOrder,
    currentPage,
  ]);

  /**
   * Load Product Analytics Data
   *
   * Fetches comprehensive product performance metrics:
   * - KPIs: Total active products, out of stock items, top product name, total returns
   * - Top products by revenue (configurable: top 5/10/20)
   * - Product performance table with units sold, revenue, stock, ratings
   * - Low stock alert list (products with stock < 5 or out of stock)
   *
   * Supports multiple filters: category, stock status, search, sorting
   */
  const loadProductsData = async () => {
    setLoading(true);
    const token = localStorage.getItem("adminToken");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        ...dateRange,
        top_limit: topProductsLimit, // Number of top products to show
        category: categoryFilter,
        stock_status: stockFilter,
        search: productsSearch,
        sort_by: productsSortBy,
        sort_order: productsSortOrder,
        page: currentPage,
        per_page: 15,
      },
    };

    try {
      const response = await axios.get(
        API_ENDPOINTS.ANALYTICS_PRODUCTS,
        config
      );
      if (response.data.success) {
        const data = response.data.data;
        setKpis(data.kpis || {});
        // Helper to parse revenue safely (handles "1,000" strings)
        const parseRevenue = (val) => {
          if (typeof val === "number") return val;
          return parseFloat(String(val).replace(/,/g, "")) || 0;
        };

        // Ensure revenue is a number for the charts
        const topProductsData = (data.top_products_by_revenue || []).map(
          (p) => ({
            ...p,
            revenue: parseRevenue(p.revenue),
          })
        );
        setTopProducts(topProductsData);

        // Ensure revenue is a number for the chart (include products with zero revenue)
        const allProducts = (data.all_products_revenue || [])
          .map((p) => ({
            ...p,
            revenue: parseRevenue(p.revenue),
          }));
        setAllProductsRevenue(allProducts);
        setProductPerformance(data.product_performance?.data || []);
        setProductsPagination(data.product_performance || {});
        setLowStock(data.low_stock_products || []);
      }
    } catch (error) {
      console.error("Error loading products data:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Export Product Performance to CSV
   *
   * Creates a CSV file with detailed product metrics including:
   * - Product name and category
   * - Units sold and revenue
   * - Current stock level
   * - Average rating
   * - Days since last sale
   */
  const handleExportCSV = () => {
    if (productPerformance.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = [
      "Product",
      "Category",
      "Units Sold",
      "Revenue",
      "Stock",
      "Avg Rating",
      "Days Since Last Sale",
    ];
    const rows = productPerformance.map((product) => [
      product.name,
      product.category,
      product.units_sold,
      product.revenue,
      product.stock,
      product.avg_rating,
      product.days_since_last_sale,
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

    // Create and download CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `product_performance_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Get Stock Status Badge
   *
   * Returns a colored badge based on stock level:
   * - Red (Out of Stock): stock = 0
   * - Orange (Low Stock): stock < 5
   * - Green (In Stock): stock >= 5
   */
  const getStockStatusBadge = (stock) => {
    if (stock === 0)
      return <span className="status-badge status-failed">Out of Stock</span>;
    if (stock < 5)
      return <span className="status-badge status-pending">Low Stock</span>;
    return <span className="status-badge status-paid">In Stock</span>;
  };

  const COLORS = ["#a33d3d", "#10b981", "#f59e0b", "#3b82f6", "#8b5cf6"];

  /**
   * Export Products Analytics to PDF
   */
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    // Title
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text("Products Analytics Report", pageWidth / 2, yPos, { align: "center" });

    // Date Range
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const dateText = `Period: ${dateRange.start_date || 'N/A'} to ${dateRange.end_date || 'N/A'}`;
    doc.text(dateText, pageWidth / 2, yPos, { align: "center" });

    yPos += 15;

    // KPIs Section
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text("Key Performance Indicators", 14, yPos);
    yPos += 7;

    if (kpis && Object.keys(kpis).length > 0) {
      const kpiData = [
        ["Active Products", kpis.total_active_products?.value || 0, `${kpis.total_active_products?.trend >= 0 ? '+' : ''}${kpis.total_active_products?.trend || 0}%`],
        ["Out of Stock", kpis.out_of_stock?.value || 0, `${kpis.out_of_stock?.trend >= 0 ? '+' : ''}${kpis.out_of_stock?.trend || 0}%`],
        ["Top Product", kpis.top_product?.value || 'N/A', ''],
        ["Returns", kpis.total_returns?.value || 0, `${kpis.total_returns?.trend >= 0 ? '+' : ''}${kpis.total_returns?.trend || 0}%`],
      ];

      autoTable(doc, {
        startY: yPos,
        head: [["Metric", "Value", "Trend"]],
        body: kpiData,
        theme: 'grid',
        headStyles: { fillColor: [163, 61, 61], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 3 }
      });
      yPos = doc.lastAutoTable.finalY + 10;
    }

    // Top Products Section
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`Top ${topProductsLimit} Products by Revenue`, 14, yPos);
    yPos += 7;

    if (topProducts && topProducts.length > 0) {
      const productData = topProducts.map(product => [
        product.product_name,
        `₹${Number(product.revenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        product.units_sold || 0
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [["Product Name", "Revenue", "Units Sold"]],
        body: productData,
        theme: 'grid',
        headStyles: { fillColor: [163, 61, 61], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: {
          0: { cellWidth: 90 },
          1: { cellWidth: 60, halign: 'right' },
          2: { cellWidth: 40, halign: 'right' }
        }
      });
      yPos = doc.lastAutoTable.finalY + 10;
    }

    // Low Stock Items
    if (lowStock && lowStock.length > 0) {
      if (yPos > 220) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text("Low Stock Items", 14, yPos);
      yPos += 7;

      const lowStockData = lowStock.map(product => [
        product.name,
        product.stock || 0,
        product.stock === 0 ? 'Out of Stock' : 'Low Stock'
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [["Product Name", "Stock", "Status"]],
        body: lowStockData,
        theme: 'grid',
        headStyles: { fillColor: [163, 61, 61], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 8, cellPadding: 2 }
      });
      yPos = doc.lastAutoTable.finalY + 10;
    }

    // Product Performance Table
    if (productPerformance && productPerformance.length > 0) {
      if (yPos > 200) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text("Product Performance", 14, yPos);
      yPos += 7;

      const performanceData = productPerformance.map(product => [
        product.name,
        `₹${Number(product.revenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        product.units_sold || 0,
        product.stock || 0,
        product.rating ? `${product.rating}/5` : 'N/A'
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [["Product", "Revenue", "Units Sold", "Stock", "Rating"]],
        body: performanceData,
        theme: 'grid',
        headStyles: { fillColor: [163, 61, 61], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 7, cellPadding: 2 },
        columnStyles: {
          0: { cellWidth: 60 },
          1: { cellWidth: 50, halign: 'right' },
          2: { cellWidth: 30, halign: 'right' },
          3: { cellWidth: 25, halign: 'right' },
          4: { cellWidth: 25, halign: 'center' }
        }
      });
    }

    doc.save(`products-analytics-${new Date().toISOString().split('T')[0]}.pdf`);
  };

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
        {kpis.total_active_products && (
          <KPICard
            label={kpis.total_active_products.label}
            value={kpis.total_active_products.value}
            trend={kpis.total_active_products.trend}
            icon="fas fa-box"
            formatter="number"
          />
        )}
        {kpis.out_of_stock_items && (
          <KPICard
            label={kpis.out_of_stock_items.label}
            value={kpis.out_of_stock_items.value}
            trend={kpis.out_of_stock_items.trend}
            icon="fas fa-exclamation-triangle"
            formatter="number"
          />
        )}
        {kpis.top_product && (
          <KPICard
            label={kpis.top_product.label}
            value={kpis.top_product.value}
            trend={0}
            icon="fas fa-star"
            formatter="text"
          />
        )}
        {kpis.total_returns && (
          <KPICard
            label={kpis.total_returns.label}
            value={kpis.total_returns.value}
            trend={kpis.total_returns.trend}
            icon="fas fa-undo"
            formatter="number"
          />
        )}
      </div>

      {/* Top Products Chart */}
      <div
        className="chart-card"
        style={{ gridColumn: "1 / -1", marginBottom: "24px" }}
      >
        <div className="chart-card-header">
          <h3>Top Products by Revenue</h3>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <label
              style={{ fontSize: "13px", fontWeight: 600, color: "#6b7280" }}
            >
              Show:
            </label>
            <select
              value={topProductsLimit}
              onChange={(e) => setTopProductsLimit(Number(e.target.value))}
              style={{
                padding: "6px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "13px",
              }}
            >
              <option value={5}>Top 5</option>
              <option value={10}>Top 10</option>
              <option value={20}>Top 20</option>
            </select>
          </div>
        </div>
        <div className="chart-card-body" style={{ minHeight: chartHeight, height: chartHeight, overflow: 'auto' }}>
          {topProducts.length > 0 ? (
            chartWidth ? (
              <BarChart
                key={topProducts.length}
                data={topProducts}
                layout="vertical"
                barCategoryGap="20%"
                width={chartWidth}
                height={chartHeight}
              >
                <defs>
                  <linearGradient
                    id="colorProductRevenue"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="5%" stopColor="#a33d3d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#a33d3d" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  type="number"
                  stroke="#666"
                  style={{ fontSize: "12px", fontWeight: "500" }}
                  tickLine={false}
                  tickFormatter={(value) => `₹${value.toLocaleString()}`}
                  allowDecimals={false}
                  domain={[0, 'auto']}
                />
                <YAxis
                  dataKey="product_name"
                  type="category"
                  width={yAxisWidth}
                  stroke="#666"
                  style={{ fontSize: `${yAxisFontSize}px`, fontWeight: "500" }}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(163, 61, 61, 0.1)' }}
                  wrapperStyle={{ outline: 'none' }}
                  isAnimationActive={false}
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
                  isAnimationActive={false}
                />
              </BarChart>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  key={topProducts.length}
                  data={topProducts}
                  layout="vertical"
                  barCategoryGap="20%"
                >
                <defs>
                  <linearGradient
                    id="colorProductRevenue"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="5%" stopColor="#a33d3d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#a33d3d" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  type="number"
                  stroke="#666"
                  style={{ fontSize: "12px", fontWeight: "500" }}
                  tickLine={false}
                  tickFormatter={(value) => `₹${value.toLocaleString()}`}
                  allowDecimals={false}
                  domain={[0, 'auto']}
                />
                <YAxis
                  dataKey="product_name"
                  type="category"
                  width={yAxisWidth}
                  stroke="#666"
                  style={{ fontSize: `${yAxisFontSize}px`, fontWeight: "500" }}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(163, 61, 61, 0.1)' }}
                  wrapperStyle={{ outline: 'none' }}
                  isAnimationActive={false}
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
                  isAnimationActive={false}
                />
              </BarChart>
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

      {/* All Products Revenue Chart (Scrollable) */}
      <div
        className="chart-card"
        style={{ gridColumn: "1 / -1", marginBottom: "24px" }}
      >
        <div className="chart-card-header">
          <h3>All Products Revenue</h3>
          <span style={{ fontSize: "13px", color: "#6b7280", fontWeight: "normal" }}>
            {allProductsRevenue.length} products total
          </span>
        </div>
        <div
          className="chart-card-body"
          style={{
            maxHeight: "600px",
            overflowY: "scroll",
            overflowX: "hidden",
            paddingRight: "10px",
            position: "relative",
          }}
        >
          {allProductsRevenue.length > 0 ? (
            <div
              style={{
                height: "600px",
                width: "100%",
                minHeight: "600px",
                minWidth: 0,
              }}
            >
              {chartWidth ? (
                <BarChart
                  data={allProductsRevenue}
                  margin={{ top: 20, right: 30, left: 60, bottom: 150 }}
                  barCategoryGap="20%"
                  width={chartWidth}
                  height={600}
                >
                  <defs>
                    <linearGradient
                      id="colorAllProducts"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#3b82f6"
                        stopOpacity={0.6}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="product_name"
                    stroke="#666"
                    angle={-90}
                    textAnchor="end"
                    height={150}
                    interval={0}
                    style={{ fontSize: "11px", fontWeight: "500" }}
                    tickLine={false}
                  />
                  <YAxis
                    type="number"
                    stroke="#666"
                    style={{ fontSize: "12px", fontWeight: "500" }}
                    tickFormatter={(value) => `₹${value.toLocaleString()}`}
                    allowDecimals={false}
                    domain={[0, 'auto']}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                    wrapperStyle={{ outline: 'none' }}
                    isAnimationActive={false}
                    position={{ x: 'auto', y: 'auto' }}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
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
                              {data.product_name}
                            </p>
                            <p
                              style={{
                                margin: 0,
                                color: "#3b82f6",
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
                    fill="url(#colorAllProducts)"
                    name="Revenue (₹)"
                    radius={[4, 4, 0, 0]}
                    barSize={18}
                    isAnimationActive={false}
                  />
                </BarChart>
              ) : (
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <BarChart
                    data={allProductsRevenue}
                    margin={{ top: 20, right: 30, left: 60, bottom: 150 }}
                    barCategoryGap="20%"
                  >
                  <defs>
                    <linearGradient
                      id="colorAllProducts"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#3b82f6"
                        stopOpacity={0.6}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="product_name"
                    stroke="#666"
                    angle={-90}
                    textAnchor="end"
                    height={150}
                    interval={0}
                    style={{ fontSize: "11px", fontWeight: "500" }}
                    tickLine={false}
                  />
                  <YAxis
                    type="number"
                    stroke="#666"
                    style={{ fontSize: "12px", fontWeight: "500" }}
                    tickFormatter={(value) => `₹${value.toLocaleString()}`}
                    allowDecimals={false}
                    domain={[0, 'auto']}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                    wrapperStyle={{ outline: 'none' }}
                    isAnimationActive={false}
                    position={{ x: 'auto', y: 'auto' }}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
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
                              {data.product_name}
                            </p>
                            <p
                              style={{
                                margin: 0,
                                color: "#3b82f6",
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
                    fill="url(#colorAllProducts)"
                    name="Revenue (₹)"
                    radius={[4, 4, 0, 0]}
                    barSize={18}
                    isAnimationActive={false}
                  />
                </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          ) : (
            <div className="chart-no-data">
              <i className="fas fa-chart-bar"></i>
              <p>No data available for all products</p>
            </div>
          )}
        </div>
      </div>

      {/* Product Performance Table */}
      <div className="orders-table-card" style={{ marginBottom: "24px" }}>
        <div className="orders-table-header">
          <h3>Product Performance</h3>
          <div className="orders-table-actions">
            <div className="orders-search">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search products..."
                value={productsSearch}
                onChange={(e) => setProductsSearch(e.target.value)}
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
            <label>Category:</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
              <option value="Home">Home</option>
              <option value="Sports">Sports</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Stock Status:</label>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock (&lt;5)</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        </div>

        <table className="analytics-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th
                onClick={() => {
                  setProductsSortBy("units_sold");
                  setProductsSortOrder(
                    productsSortOrder === "asc" ? "desc" : "asc"
                  );
                }}
              >
                Units Sold <i className="fas fa-sort"></i>
              </th>
              <th
                onClick={() => {
                  setProductsSortBy("revenue");
                  setProductsSortOrder(
                    productsSortOrder === "asc" ? "desc" : "asc"
                  );
                }}
              >
                Revenue <i className="fas fa-sort"></i>
              </th>
              <th
                onClick={() => {
                  setProductsSortBy("stock");
                  setProductsSortOrder(
                    productsSortOrder === "asc" ? "desc" : "asc"
                  );
                }}
              >
                Stock <i className="fas fa-sort"></i>
              </th>
              <th>Avg Rating</th>
              <th>Days Since Last Sale</th>
            </tr>
          </thead>
          <tbody>
            {productPerformance.length > 0 ? (
              productPerformance.map((product) => (
                <tr key={product.id}>
                  <td>
                    <strong>{product.name}</strong>
                  </td>
                  <td>{product.category}</td>
                  <td>{product.units_sold}</td>
                  <td>
                    <strong>
                      ₹
                      {Number(product.revenue).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </strong>
                  </td>
                  <td>{getStockStatusBadge(product.stock)}</td>
                  <td>
                    <span style={{ color: "#f59e0b" }}>
                      {product.avg_rating > 0
                        ? `⭐ ${product.avg_rating}`
                        : "No reviews"}
                    </span>
                  </td>
                  <td>
                    {product.days_since_last_sale !== null
                      ? `${product.days_since_last_sale} days`
                      : "Never sold"}
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
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {productsPagination.total > 0 && (
          <div className="table-pagination">
            <div className="pagination-info">
              Showing {productsPagination.from} to {productsPagination.to} of{" "}
              {productsPagination.total} products
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
                disabled={currentPage === productsPagination.last_page}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Low Stock Alert */}
      {lowStock.length > 0 && (
        <div className="orders-table-card">
          <div className="orders-table-header">
            <h3 style={{ color: "#f59e0b" }}>
              <i className="fas fa-exclamation-triangle"></i> Low Stock Alert
            </h3>
          </div>
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Units Sold (Period)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.map((product) => (
                <tr key={product.id}>
                  <td>
                    <strong>{product.name}</strong>
                  </td>
                  <td>{product.category}</td>
                  <td>
                    <strong
                      style={{
                        color: product.stock === 0 ? "#ef4444" : "#f59e0b",
                      }}
                    >
                      {product.stock}
                    </strong>
                  </td>
                  <td>{product.units_sold}</td>
                  <td>{getStockStatusBadge(product.stock)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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

export default AnalyticsProducts;
