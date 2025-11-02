import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import "../styles/AdminDashboard.css";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function AdminDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [minZoom, setMinZoom] = useState(50);
  const [activeSection, setActiveSection] = useState("orders");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const tableRef = React.useRef(null);
  const containerRef = React.useRef(null);

  // Admin info state
  const [adminInfo, setAdminInfo] = useState(null);

  // Add Admin form state
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [adminFormLoading, setAdminFormLoading] = useState(false);
  const [adminFormMessage, setAdminFormMessage] = useState("");
  const [allAdmins, setAllAdmins] = useState([]);

  // Customers state
  const [allUsers, setAllUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Products state
  const [allProducts, setAllProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productFormData, setProductFormData] = useState({
    name: '',
    flag: 'perfume',
    price: '',
    volume_ml: '',
    scent: '',
    note: '',
    Discription: '',
    about_product: '',
    original_price: '',
    discount_amount: '',
    is_discount_active: false,
    delivery_charge: '',
    available_quantity: '',
    image: '',
    ingredients: '',
    brand: '',
    colour: '',
    item_form: '',
    power_source: '',
    launch_date: ''
  });
  const [productFormLoading, setProductFormLoading] = useState(false);
  const [productFormMessage, setProductFormMessage] = useState('');

  // Load admin info from localStorage
  useEffect(() => {
    const storedAdminInfo = localStorage.getItem("adminInfo");
    if (storedAdminInfo) {
      setAdminInfo(JSON.parse(storedAdminInfo));
    }
  }, []);

  // Fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          navigate("/admin/login");
          return;
        }

        const response = await axios.get(API_ENDPOINTS.ADMIN_ORDERS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const fetchedOrders = response.data.orders || [];
        setOrders(fetchedOrders);
        setFilteredOrders(fetchedOrders);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setLoading(false);
        setError("Failed to load orders. Please try again.");
      }
    };

    fetchOrders();
  }, [navigate]);

  // Fetch all admins for superadmin
  useEffect(() => {
    const fetchAdmins = async () => {
      if (adminInfo?.role !== "superadmin") return;

      try {
        const token = localStorage.getItem("adminToken");
        const response = await axios.get(API_ENDPOINTS.ADMIN_ALL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setAllAdmins(response.data.admins);
        }
      } catch (err) {
        console.error("Error fetching admins:", err);
      }
    };

    fetchAdmins();
  }, [adminInfo]);

  // Fetch all users when customers section is active
  useEffect(() => {
    const fetchUsers = async () => {
      if (activeSection !== "customers") return;

      setUsersLoading(true);
      try {
        const token = localStorage.getItem("adminToken");
        const response = await axios.get(API_ENDPOINTS.ADMIN_USERS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setAllUsers(response.data.users);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, [activeSection]);

  // Fetch all products when products section is active
  useEffect(() => {
    const fetchProducts = async () => {
      if (activeSection !== "products") return;

      setProductsLoading(true);
      try {
        const token = localStorage.getItem("adminToken");
        const response = await axios.get(API_ENDPOINTS.ADMIN_PRODUCTS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setAllProducts(response.data.products);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, [activeSection]);

  // Calculate minimum zoom to fit table in container
  useEffect(() => {
    const calculateMinZoom = () => {
      if (tableRef.current && containerRef.current) {
        const tableWidth = tableRef.current.scrollWidth;
        const containerWidth = containerRef.current.clientWidth;

        if (tableWidth > containerWidth) {
          const calculatedMinZoom = Math.floor(
            (containerWidth / tableWidth) * 100
          );
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
    window.addEventListener("resize", calculateMinZoom);
    return () => window.removeEventListener("resize", calculateMinZoom);
  }, [loading, filteredOrders]);

  // Filter orders by date range
  const handleFilter = () => {
    if (!startDate && !endDate) {
      setFilteredOrders(orders);
      return;
    }

    const filtered = orders.filter((order) => {
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
    setStartDate("");
    setEndDate("");
    setFilteredOrders(orders);
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "Order Number",
      "Customer Name",
      "Email",
      "Phone",
      "Address",
      "Items",
      "Quantity",
      "Total Amount",
      "Status",
      "Date",
      "Time",
    ];

    const csvData = filteredOrders.map((order) => [
      order.order_number,
      order.customer_name || "N/A",
      order.customer_email || "N/A",
      order.customer_phone || "N/A",
      `"${order.customer_address || "N/A"}"`, // Quoted for CSV
      order.order_items
        ?.map((item) => item.name || item.product_name)
        .join("; ") || "N/A",
      order.order_quantity || 0,
      `₹${parseFloat(order.order_value || 0).toFixed(2)}`,
      order.status || "Pending",
      new Date(order.created_at).toLocaleDateString(),
      new Date(order.created_at).toLocaleTimeString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

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
    setShowExportMenu(false);
  };

  // Export to PDF
  const exportToPDF = () => {
    const printWindow = window.open("", "", "height=600,width=800");

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
                    ${
                      startDate || endDate
                        ? `<p>Filter: ${startDate || "Start"} to ${
                            endDate || "End"
                          }</p>`
                        : ""
                    }
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
                        ${filteredOrders
                          .map(
                            (order) => `
                            <tr>
                                <td>${order.order_number}</td>
                                <td>${order.customer_name || "N/A"}</td>
                                <td>${order.customer_email || "N/A"}</td>
                                <td>${order.customer_phone || "N/A"}</td>
                                <td class="items">${
                                  order.order_items
                                    ?.map(
                                      (item, idx) =>
                                        `${idx + 1}. ${
                                          item.name || item.product_name
                                        }`
                                    )
                                    .join("<br>") || "N/A"
                                }</td>
                                <td>${order.order_quantity || 0}</td>
                                <td class="total">₹${parseFloat(
                                  order.order_value || 0
                                ).toFixed(2)}</td>
                                <td>${order.status || "Pending"}</td>
                                <td>${new Date(
                                  order.created_at
                                ).toLocaleDateString()}</td>
                                <td>${new Date(
                                  order.created_at
                                ).toLocaleTimeString()}</td>
                            </tr>
                        `
                          )
                          .join("")}
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
                          order.include_gst && order.user?.gst_number
                            ? `<p><strong>GST Number:</strong> ${order.user.gst_number}</p>`
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

  // Handle creating a new admin
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setAdminFormLoading(true);
    setAdminFormMessage("");

    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.post(
        API_ENDPOINTS.ADMIN_CREATE,
        {
          email: newAdminEmail,
          password: newAdminPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success) {
        setAdminFormMessage("✓ Admin created successfully!");
        setNewAdminEmail("");
        setNewAdminPassword("");

        // Refresh admin list
        const adminsResponse = await axios.get(API_ENDPOINTS.ADMIN_ALL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (adminsResponse.data.success) {
          setAllAdmins(adminsResponse.data.admins);
        }

        setTimeout(() => setAdminFormMessage(""), 5000);
      }
    } catch (error) {
      console.error("Error creating admin:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to create admin";
      setAdminFormMessage("✗ " + errorMsg);
    } finally {
      setAdminFormLoading(false);
    }
  };

  // Handle deleting an admin
  const handleDeleteAdmin = async (adminId, adminEmail) => {
    // Confirm deletion
    const confirmDelete = window.confirm(
      `Are you sure you want to delete admin account: ${adminEmail}?\n\nThis action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.delete(
        API_ENDPOINTS.ADMIN_DELETE(adminId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setAdminFormMessage("✓ Admin deleted successfully!");

        // Refresh admin list
        const adminsResponse = await axios.get(API_ENDPOINTS.ADMIN_ALL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (adminsResponse.data.success) {
          setAllAdmins(adminsResponse.data.admins);
        }

        setTimeout(() => setAdminFormMessage(""), 5000);
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      const errorMsg =
        error.response?.data?.error || error.response?.data?.message || "Failed to delete admin";
      setAdminFormMessage("✗ " + errorMsg);
      setTimeout(() => setAdminFormMessage(""), 5000);
    }
  };

  // Handle viewing user details
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  // Handle product form input changes
  const handleProductFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle creating a new product
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setProductFormLoading(true);
    setProductFormMessage('');

    try {
      const token = localStorage.getItem('adminToken');

      // Filter out empty string values
      const productData = Object.fromEntries(
        Object.entries(productFormData).filter(([key, value]) => {
          if (typeof value === 'string') return value.trim() !== '';
          return true;
        })
      );

      const response = await axios.post(
        API_ENDPOINTS.ADMIN_PRODUCTS,
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

      if (response.data.success) {
        setProductFormMessage('✓ Product created successfully!');

        // Reset form
        setProductFormData({
          name: '',
          flag: 'perfume',
          price: '',
          volume_ml: '',
          scent: '',
          note: '',
          Discription: '',
          about_product: '',
          original_price: '',
          discount_amount: '',
          is_discount_active: false,
          delivery_charge: '',
          available_quantity: '',
          image: '',
          ingredients: '',
          brand: '',
          colour: '',
          item_form: '',
          power_source: '',
          launch_date: ''
        });

        // Refresh products list
        const productsResponse = await axios.get(API_ENDPOINTS.ADMIN_PRODUCTS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (productsResponse.data.success) {
          setAllProducts(productsResponse.data.products);
        }

        setTimeout(() => setProductFormMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error creating product:', error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Failed to create product';
      setProductFormMessage('✗ ' + errorMsg);
    } finally {
      setProductFormLoading(false);
    }
  };

  // Handle deleting a product
  const handleDeleteProduct = async (productId, productName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete product: ${productName}?\n\nThis action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.delete(
        API_ENDPOINTS.ADMIN_PRODUCT_DELETE(productId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setProductFormMessage('✓ Product deleted successfully!');

        // Refresh products list
        const productsResponse = await axios.get(API_ENDPOINTS.ADMIN_PRODUCTS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (productsResponse.data.success) {
          setAllProducts(productsResponse.data.products);
        }

        setTimeout(() => setProductFormMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Failed to delete product';
      setProductFormMessage('✗ ' + errorMsg);
    }
  };

  // Define the logout function
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.post(
        API_ENDPOINTS.ADMIN_LOGOUT,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      // Optionally handle error
    } finally {
      localStorage.removeItem("adminToken");
      navigate("/"); // Redirect to home page
    }
  };

  // Export customers to CSV
  const exportCustomersToCSV = () => {
    if (allUsers.length === 0) {
      alert('No customers to export');
      return;
    }

    // Define CSV headers
    const headers = ['ID', 'Name', 'Email', 'Mobile', 'Address', 'City', 'PIN', 'GST Number', 'Email Verified'];

    // Map user data to CSV rows
    const rows = allUsers.map(user => [
      user.id || '',
      user.name || '',
      user.email || '',
      user.mobile || '',
      user.address || '',
      user.city || '',
      user.pin || '',
      user.gst_number || '',
      user.email_verified ? 'Yes' : 'No'
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `floretta_customers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export customers to PDF
  const exportCustomersToPDF = () => {
    if (allUsers.length === 0) {
      alert('No customers to export');
      return;
    }

    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text('Floretta India - Customer List', 14, 22);

    // Add export date
    doc.setFontSize(10);
    doc.text(`Export Date: ${new Date().toLocaleDateString()}`, 14, 30);

    // Prepare table data
    const tableData = allUsers.map(user => [
      user.id || '',
      user.name || '',
      user.email || '',
      user.mobile || '',
      user.city || '',
      user.pin || '',
      user.gst_number || '',
      user.email_verified ? 'Yes' : 'No'
    ]);

    // Add table
    autoTable(doc, {
      head: [['ID', 'Name', 'Email', 'Mobile', 'City', 'PIN', 'GST', 'Verified']],
      body: tableData,
      startY: 35,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [243, 114, 84], textColor: 255 },
      alternateRowStyles: { fillColor: [249, 249, 249] },
      margin: { top: 35 },
    });

    // Generate PDF as blob and trigger direct download
    const pdfBlob = doc.output('blob');
    const fileName = `floretta_customers_${new Date().toISOString().split('T')[0]}.pdf`;

    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(pdfBlob);
    link.download = fileName;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }, 100);
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
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
              className={activeSection === "orders" ? "active" : ""}
              onClick={() => {
                setActiveSection("orders");
                setSidebarOpen(false);
              }}
            >
              <i className="fas fa-box"></i>
              <span>Orders</span>
            </li>
            <li
              className={activeSection === "customers" ? "active" : ""}
              onClick={() => {
                setActiveSection("customers");
                setSidebarOpen(false);
              }}
            >
              <i className="fas fa-users"></i>
              <span>Customers</span>
            </li>
            <li
              className={activeSection === "products" ? "active" : ""}
              onClick={() => {
                setActiveSection("products");
                setSidebarOpen(false);
              }}
            >
              <i className="fas fa-cube"></i>
              <span>Products</span>
            </li>
            <li
              className={activeSection === "analytics" ? "active" : ""}
              onClick={() => {
                setActiveSection("analytics");
                setSidebarOpen(false);
              }}
            >
              <i className="fas fa-chart-line"></i>
              <span>Analytics</span>
            </li>
            {adminInfo?.role === "superadmin" && (
              <li
                className={activeSection === "addUser" ? "active" : ""}
                onClick={() => {
                  setActiveSection("addUser");
                  setSidebarOpen(false);
                }}
              >
                <i className="fas fa-user-plus"></i>
                <span>Add User</span>
              </li>
            )}
            <li
              className={activeSection === "settings" ? "active" : ""}
              onClick={() => {
                setActiveSection("settings");
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
        className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`}
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
          <h2 className="admin-header-center desktop-only">
            All Orders ({filteredOrders.length})
          </h2>
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
        {activeSection === "orders" && (
          <section className="admin-section">
            <h2 className="mobile-only">
              All Orders ({filteredOrders.length})
            </h2>
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
                      onClick={() =>
                        setZoomLevel(Math.max(minZoom, zoomLevel - 10))
                      }
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
                      onClick={() =>
                        setZoomLevel(Math.min(150, zoomLevel + 10))
                      }
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
                  <div
                    className="table-zoom-wrapper"
                    style={{
                      transform: `scale(${zoomLevel / 100})`,
                      transformOrigin: "top left",
                    }}
                  >
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
                          <th>Date & Time</th>
                          <th>Invoice</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order) => (
                          <tr key={order.id}>
                            <td className="order-number">
                              {order.order_number}
                            </td>
                            <td>{order.customer_name || "N/A"}</td>
                            <td>{order.customer_email || "N/A"}</td>
                            <td>{order.customer_phone || "N/A"}</td>
                            <td className="order-address">
                              {order.customer_address || "N/A"}
                            </td>
                            <td>
                              <div className="order-items-list">
                                {order.order_items &&
                                  order.order_items.map((item, idx) => (
                                    <div
                                      key={idx}
                                      className="order-item-with-image"
                                    >
                                      {/* {item.image && (
                                                                <img
                                                                    src={`http://localhost:8000/storage/${item.image}`}
                                                                    alt={item.name || item.product_name}
                                                                    className="order-item-image"
                                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                                />
                                                            )} */}
                                      <div className="order-item-details">
                                        <span className="item-name">
                                          {item.name || item.product_name}
                                        </span>
                                        <span className="item-quantity">
                                          Qty: {item.quantity}
                                        </span>
                                        <span className="item-price">
                                          ₹
                                          {parseFloat(item.price || 0).toFixed(
                                            2
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </td>
                            <td>{order.order_quantity || 0}</td>
                            <td className="order-total">
                              ₹{parseFloat(order.order_value || 0).toFixed(2)}
                            </td>
                            <td>
                              <span
                                className={`status-badge status-${order.status?.toLowerCase()}`}
                              >
                                {order.status || "Pending"}
                              </span>
                            </td>
                            <td className="order-datetime">
                              {new Date(order.created_at).toLocaleDateString()}
                              <br />
                              {new Date(order.created_at).toLocaleTimeString()}
                            </td>
                            <td>
                              <button
                                className="invoice-btn"
                                onClick={() => generateInvoice(order)}
                                title="Generate Invoice"
                              >
                                📄 Invoice
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td
                            colSpan="11"
                            style={{ padding: 0, border: "none" }}
                          >
                            {/* Export Button */}
                            <div className="export-section">
                              <div className="export-container">
                                <button
                                  className="export-btn"
                                  onClick={() =>
                                    setShowExportMenu(!showExportMenu)
                                  }
                                >
                                  <span>📥</span> Extract Data
                                </button>

                                {showExportMenu && (
                                  <div className="export-menu">
                                    <button
                                      onClick={exportToCSV}
                                      className="export-option csv-option"
                                    >
                                      <span className="icon-csv">CSV</span>
                                      Export as CSV
                                    </button>
                                    <button
                                      onClick={exportToPDF}
                                      className="export-option pdf-option"
                                    >
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
        )}

        {/* Customers Section */}
        {activeSection === "customers" && (
          <section className="admin-section settings-section customers-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>Customers</h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={exportCustomersToCSV}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
                >
                  <i className="fas fa-file-csv"></i>
                  Export CSV
                </button>
                <button
                  onClick={exportCustomersToPDF}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
                >
                  <i className="fas fa-file-pdf"></i>
                  Export PDF
                </button>
              </div>
            </div>

            <div className="settings-card">
              <h3>All Customers ({allUsers.length})</h3>
              <p className="settings-description">
                List of all registered customers in the system.
              </p>

              <div className="admin-list-container">
                {usersLoading ? (
                  <p className="no-admins">Loading customers...</p>
                ) : allUsers.length === 0 ? (
                  <p className="no-admins">No customers found</p>
                ) : (
                  <ul className="admin-items">
                    {allUsers.map((user) => (
                      <li
                        key={user.id}
                        className="admin-item customer-item clickable"
                        onClick={() => handleViewUser(user)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="admin-item-header">
                          <span className="admin-email">{user.email}</span>
                          <span className="admin-badge customer">Customer</span>
                        </div>
                        {user.name && (
                          <span className="customer-name">
                            <i className="fas fa-user"></i> {user.name}
                          </span>
                        )}
                        {user.mobile && (
                          <span className="customer-phone">
                            <i className="fas fa-phone"></i> {user.mobile}
                          </span>
                        )}
                        {user.gst_number && (
                          <span className="customer-gst">
                            <i className="fas fa-receipt"></i> GST: {user.gst_number}
                          </span>
                        )}
                        <span className="admin-date">
                          Joined: {new Date(user.created_at).toLocaleDateString()}
                        </span>
                        <span className="view-details-hint">
                          <i className="fas fa-eye"></i> Click to view details
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Products Section */}
        {activeSection === "products" && (
          <section className="admin-section settings-section products-section">
            <h2>Products</h2>

            <div className="add-user-container">
              {/* Add Product Form */}
              <div className="settings-card add-user-form">
                <h3>Add New Product</h3>
                <p className="settings-description">
                  Create a new product for your store. Fill in the required fields marked with *.
                </p>

                <form className="admin-form product-form" onSubmit={handleCreateProduct}>
                  {/* Required Fields */}
                  <div className="form-group">
                    <label htmlFor="product-name">Product Name *</label>
                    <input
                      type="text"
                      id="product-name"
                      name="name"
                      value={productFormData.name}
                      onChange={handleProductFormChange}
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="product-flag">Product Type *</label>
                    <select
                      id="product-flag"
                      name="flag"
                      value={productFormData.flag}
                      onChange={handleProductFormChange}
                      required
                    >
                      <option value="perfume">Perfume</option>
                      <option value="freshner">Freshner</option>
                      <option value="face_mist">Face Mist</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="product-price">Price *</label>
                      <input
                        type="number"
                        id="product-price"
                        name="price"
                        value={productFormData.price}
                        onChange={handleProductFormChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="product-volume">Volume (ml)</label>
                      <input
                        type="text"
                        id="product-volume"
                        name="volume_ml"
                        value={productFormData.volume_ml}
                        onChange={handleProductFormChange}
                        placeholder="e.g., 50ml, 100ml"
                      />
                    </div>
                  </div>

                  {/* Optional Fields */}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="product-scent">Scent</label>
                      <input
                        type="text"
                        id="product-scent"
                        name="scent"
                        value={productFormData.scent}
                        onChange={handleProductFormChange}
                        placeholder="e.g., Floral, Woody"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="product-note">Note</label>
                      <select
                        id="product-note"
                        name="note"
                        value={productFormData.note}
                        onChange={handleProductFormChange}
                      >
                        <option value="">Select Note</option>
                        <option value="sweet">Sweet</option>
                        <option value="woody">Woody</option>
                        <option value="floral">Floral</option>
                        <option value="citrus">Citrus</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="product-description">Description</label>
                    <textarea
                      id="product-description"
                      name="Discription"
                      value={productFormData.Discription}
                      onChange={handleProductFormChange}
                      placeholder="Enter product description"
                      rows="3"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="product-about">About Product</label>
                    <textarea
                      id="product-about"
                      name="about_product"
                      value={productFormData.about_product}
                      onChange={handleProductFormChange}
                      placeholder="Additional information about the product"
                      rows="3"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="product-original-price">Original Price</label>
                      <input
                        type="number"
                        id="product-original-price"
                        name="original_price"
                        value={productFormData.original_price}
                        onChange={handleProductFormChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="product-discount">Discount Amount</label>
                      <input
                        type="number"
                        id="product-discount"
                        name="discount_amount"
                        value={productFormData.discount_amount}
                        onChange={handleProductFormChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="product-delivery">Delivery Charge</label>
                      <input
                        type="number"
                        id="product-delivery"
                        name="delivery_charge"
                        value={productFormData.delivery_charge}
                        onChange={handleProductFormChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="product-quantity">Available Quantity</label>
                      <input
                        type="number"
                        id="product-quantity"
                        name="available_quantity"
                        value={productFormData.available_quantity}
                        onChange={handleProductFormChange}
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="is_discount_active"
                        checked={productFormData.is_discount_active}
                        onChange={handleProductFormChange}
                      />
                      <span>Discount Active</span>
                    </label>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="product-brand">Brand</label>
                      <input
                        type="text"
                        id="product-brand"
                        name="brand"
                        value={productFormData.brand}
                        onChange={handleProductFormChange}
                        placeholder="Enter brand name"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="product-colour">Colour</label>
                      <input
                        type="text"
                        id="product-colour"
                        name="colour"
                        value={productFormData.colour}
                        onChange={handleProductFormChange}
                        placeholder="Enter colour"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="product-image">Image Path</label>
                    <input
                      type="text"
                      id="product-image"
                      name="image"
                      value={productFormData.image}
                      onChange={handleProductFormChange}
                      placeholder="e.g., products/perfume.jpg (max 255 chars)"
                      maxLength="255"
                    />
                    <small style={{display: 'block', marginTop: '5px', color: '#666'}}>
                      Enter relative path or URL. Do not paste base64 image data.
                    </small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="product-ingredients">Ingredients</label>
                    <textarea
                      id="product-ingredients"
                      name="ingredients"
                      value={productFormData.ingredients}
                      onChange={handleProductFormChange}
                      placeholder="List ingredients"
                      rows="2"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="product-item-form">Item Form</label>
                      <input
                        type="text"
                        id="product-item-form"
                        name="item_form"
                        value={productFormData.item_form}
                        onChange={handleProductFormChange}
                        placeholder="e.g., Spray, Roll-on, Stick"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="product-power-source">Power Source</label>
                      <input
                        type="text"
                        id="product-power-source"
                        name="power_source"
                        value={productFormData.power_source}
                        onChange={handleProductFormChange}
                        placeholder="e.g., Manual, Battery"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="product-launch-date">Launch Date</label>
                    <input
                      type="date"
                      id="product-launch-date"
                      name="launch_date"
                      value={productFormData.launch_date}
                      onChange={handleProductFormChange}
                    />
                  </div>

                  {productFormMessage && (
                    <div
                      className={`form-message ${
                        productFormMessage.startsWith('✓') ? 'success' : 'error'
                      }`}
                    >
                      {productFormMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn-create-admin"
                    disabled={productFormLoading}
                  >
                    {productFormLoading ? 'Creating...' : 'Create Product'}
                  </button>
                </form>
              </div>

              {/* Products List */}
              <div className="settings-card admin-list">
                <h3>All Products ({allProducts.length})</h3>
                <p className="settings-description">
                  List of all products in the system.
                </p>

                <div className="admin-list-container add-user-list-container">
                  {productsLoading ? (
                    <p className="no-admins">Loading products...</p>
                  ) : allProducts.length === 0 ? (
                    <p className="no-admins">No products found</p>
                  ) : (
                    <ul className="admin-items">
                      {allProducts.map((product) => (
                        <li key={product.id} className="admin-item product-item">
                          <div className="admin-item-header">
                            <span className="admin-email product-name">{product.name}</span>
                            <span className={`admin-badge ${product.flag}`}>
                              {product.flag === 'perfume' ? 'Perfume' :
                               product.flag === 'freshner' ? 'Freshner' : 'Face Mist'}
                            </span>
                          </div>

                          <div className="product-details">
                            <span className="product-info">
                              <i className="fas fa-tag"></i> Price: ₹{product.price}
                            </span>
                            {product.volume_ml && (
                              <span className="product-info">
                                <i className="fas fa-flask"></i> {product.volume_ml}
                              </span>
                            )}
                            {product.available_quantity !== null && (
                              <span className="product-info">
                                <i className="fas fa-boxes"></i> Stock: {product.available_quantity}
                              </span>
                            )}
                          </div>

                          {product.scent && (
                            <span className="product-scent">
                              <i className="fas fa-leaf"></i> {product.scent}
                            </span>
                          )}

                          <button
                            className="delete-admin-btn"
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            title="Delete product"
                          >
                            <i className="fas fa-trash"></i> Delete
                          </button>

                          <span className="admin-date">
                            Created: {new Date(product.created_at).toLocaleDateString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Add User Section - Only for Superadmin */}
        {activeSection === "addUser" && adminInfo?.role === "superadmin" && (
          <section className="admin-section settings-section">
            <h2>Add User</h2>

            <div className="add-user-container">
              <div className="settings-card add-user-form">
                <h3>Add New Admin</h3>
                <p className="settings-description">
                  Create a new admin account with email and password. The
                  password will be securely hashed.
                </p>

                <form className="admin-form" onSubmit={handleCreateAdmin}>
                  <div className="form-group">
                    <label htmlFor="admin-email">Admin Email</label>
                    <input
                      type="email"
                      id="admin-email"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      placeholder="Enter admin email"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="admin-password">Password</label>
                    <input
                      type="password"
                      id="admin-password"
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      placeholder="Enter password (min 6 characters)"
                      required
                      minLength="6"
                    />
                  </div>

                  {adminFormMessage && (
                    <div
                      className={`form-message ${
                        adminFormMessage.startsWith("✓") ? "success" : "error"
                      }`}
                    >
                      {adminFormMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn-create-admin"
                    disabled={adminFormLoading}
                  >
                    {adminFormLoading ? "Creating..." : "Create Admin"}
                  </button>
                </form>
              </div>

              <div className="settings-card admin-list">
                <h3>All Admins ({allAdmins.length})</h3>
                <p className="settings-description">
                  List of all admin accounts in the system.
                </p>

                <div className="admin-list-container add-user-list-container">
                  {allAdmins.length === 0 ? (
                    <p className="no-admins">Loading admins...</p>
                  ) : (
                    <ul className="admin-items">
                      {allAdmins.map((admin) => (
                        <li key={admin.id} className="admin-item">
                          <div className="admin-item-header">
                            <span className="admin-email">{admin.email}</span>
                            {admin.role === "superadmin" && (
                              <span className="admin-badge superadmin">
                                Super Admin
                              </span>
                            )}
                            {admin.role === "admin" && (
                              <span className="admin-badge admin">Admin</span>
                            )}
                          </div>
                        
                          <button
                            className="delete-admin-btn"
                            onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                            title="Delete admin"
                          >
                            <i className="fas fa-trash"></i> Delete
                          </button>
                            
                          <span className="admin-date">
                            Created:{" "}
                            {new Date(admin.created_at).toLocaleDateString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Settings Section - Available for All Admins */}
        {activeSection === "settings" && (
          <section className="admin-section settings-section">
            <h2>Settings</h2>

            <div className="settings-container">
              <div className="settings-card">
                <h3>General Settings</h3>
                <p className="settings-description">
                  Configure your admin dashboard preferences and account
                  settings.
                </p>

                <div className="settings-info">
                  <p>
                    <strong>Logged in as:</strong> {adminInfo?.email || "N/A"}
                  </p>
                  <p>
                    <strong>Role:</strong>{" "}
                    {adminInfo?.role === "superadmin" ? "Super Admin" : "Admin"}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* User Detail Modal */}
        {showUserModal && selectedUser && (
          <div className="modal-overlay" onClick={closeUserModal}>
            <div className="modal-content user-detail-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Customer Details</h2>
                <button className="modal-close" onClick={closeUserModal}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="user-detail-section">
                  <h3><i className="fas fa-user"></i> Personal Information</h3>
                  <div className="detail-row">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{selectedUser.name || 'N/A'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{selectedUser.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Mobile:</span>
                    <span className="detail-value">{selectedUser.mobile || 'N/A'}</span>
                  </div>
                  {selectedUser.gst_number && (
                    <div className="detail-row">
                      <span className="detail-label">GST Number:</span>
                      <span className="detail-value">{selectedUser.gst_number}</span>
                    </div>
                  )}
                </div>

                <div className="user-detail-section">
                  <h3><i className="fas fa-map-marker-alt"></i> Address Information</h3>
                  {selectedUser.address && (
                    <div className="detail-row">
                      <span className="detail-label">Address:</span>
                      <span className="detail-value">{selectedUser.address}</span>
                    </div>
                  )}
                  {selectedUser.address1 && (
                    <div className="detail-row">
                      <span className="detail-label">Address Line 1:</span>
                      <span className="detail-value">{selectedUser.address1}</span>
                    </div>
                  )}
                  {selectedUser.address2 && (
                    <div className="detail-row">
                      <span className="detail-label">Address Line 2:</span>
                      <span className="detail-value">{selectedUser.address2}</span>
                    </div>
                  )}
                  {selectedUser.address3 && (
                    <div className="detail-row">
                      <span className="detail-label">Address Line 3:</span>
                      <span className="detail-value">{selectedUser.address3}</span>
                    </div>
                  )}
                  {selectedUser.address4 && (
                    <div className="detail-row">
                      <span className="detail-label">Address Line 4:</span>
                      <span className="detail-value">{selectedUser.address4}</span>
                    </div>
                  )}
                  {selectedUser.address5 && (
                    <div className="detail-row">
                      <span className="detail-label">Address Line 5:</span>
                      <span className="detail-value">{selectedUser.address5}</span>
                    </div>
                  )}
                  {selectedUser.city && (
                    <div className="detail-row">
                      <span className="detail-label">City:</span>
                      <span className="detail-value">{selectedUser.city}</span>
                    </div>
                  )}
                  {selectedUser.pin && (
                    <div className="detail-row">
                      <span className="detail-label">PIN Code:</span>
                      <span className="detail-value">{selectedUser.pin}</span>
                    </div>
                  )}
                  {!selectedUser.address && !selectedUser.address1 && !selectedUser.city && !selectedUser.pin && (
                    <p className="no-data">No address information available</p>
                  )}
                </div>

                <div className="user-detail-section">
                  <h3><i className="fas fa-calendar"></i> Account Information</h3>
                  <div className="detail-row">
                    <span className="detail-label">Customer ID:</span>
                    <span className="detail-value">#{selectedUser.id}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Joined Date:</span>
                    <span className="detail-value">
                      {new Date(selectedUser.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={closeUserModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
