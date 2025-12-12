import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import "../styles/AdminDashboard.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import AdminReviews from "./AdminReviews";
import AdminCareer from "./AdminCareer";
import Analytics from "./Analytics";

function AdminDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [zoomLevel, setZoomLevel] = useState(100);
  const [minZoom, setMinZoom] = useState(50);
  const [activeSection, setActiveSection] = useState("orders");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // New Orders state
  const [newOrders, setNewOrders] = useState([]);
  const [loadingNewOrders, setLoadingNewOrders] = useState(false);
  const [errorNewOrders, setErrorNewOrders] = useState(null);
  const tableRef = React.useRef(null);
  const containerRef = React.useRef(null);

  // Order Status options for admin-managed lifecycle
  const ORDER_STATUS_OPTIONS = [
    "Order Placed",
    "Shipped",
    "In-Transit",
    "Delivered",
  ];

  const [updatingStatusIds, setUpdatingStatusIds] = useState([]);

  const handleChangeOrderStatus = async (
    orderId,
    newStatus,
    context = "orders"
  ) => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin/login");
        return;
      }
      setUpdatingStatusIds((prev) => [...prev, orderId]);
      const resp = await axios.post(
        API_ENDPOINTS.ADMIN_ORDER_SET_STATUS(orderId),
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updated = resp.data?.order;
      if (updated) {
        // Update in orders list
        setOrders((prev) =>
          prev.map((o) => (o.id === updated.id ? { ...o, ...updated } : o))
        );
        setFilteredOrders((prev) =>
          prev.map((o) => (o.id === updated.id ? { ...o, ...updated } : o))
        );
        // Update in newOrders list if present
        setNewOrders((prev) =>
          prev.map((o) => (o.id === updated.id ? { ...o, ...updated } : o))
        );
      }
    } catch (e) {
      console.error("Failed to update order status", e);
      alert("Failed to update order status. Please try again.");
    } finally {
      setUpdatingStatusIds((prev) => prev.filter((id) => id !== orderId));
    }
  };

  // Admin info state
  const [adminInfo, setAdminInfo] = useState(null);

  // Add Admin form state
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [adminFormLoading, setAdminFormLoading] = useState(false);
  const [adminFormMessage, setAdminFormMessage] = useState("");
  const [allAdmins, setAllAdmins] = useState([]);

  // Enquiries state
  const [userEnquiryTab, setUserEnquiryTab] = useState("contact");
  const [contactEnquiries, setContactEnquiries] = useState([]);
  const [contactMeta, setContactMeta] = useState({});
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState(null);
  const [perfumeBookings, setPerfumeBookings] = useState([]);
  const [perfumeMeta, setPerfumeMeta] = useState({});
  const [perfumeLoading, setPerfumeLoading] = useState(false);
  const [perfumeError, setPerfumeError] = useState(null);
  const [enquiryFilters, setEnquiryFilters] = useState({
    q: "",
    start_date: "",
    end_date: "",
    per_page: 20,
    page: 1,
  });

  // Customers state
  const [allUsers, setAllUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Products state
  const [allProducts, setAllProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productFormData, setProductFormData] = useState({
    name: "",
    flag: "perfume",
    price: "",
    volume_ml: "",
    scent: "",
    note: "",
    Discription: "",
    about_product: "",
    original_price: "",
    discount_amount: "",
    is_discount_active: false,
    delivery_charge: "",
    available_quantity: "",
    image: "",
    ingredients: "",
    brand: "",
    colour: "",
    item_form: "",
    power_source: "",
    launch_date: "",
    source_table: "",
  });
  const [productImages, setProductImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [productFormLoading, setProductFormLoading] = useState(false);
  const [productFormMessage, setProductFormMessage] = useState("");
  const [editingProduct, setEditingProduct] = useState(null); // Track which product is being edited
  const [isEditMode, setIsEditMode] = useState(false); // Track if we're in edit mode
  const [productView, setProductView] = useState("list"); // "list", "add", or "bestsellers"
  const [bestsellers, setBestsellers] = useState([]); // Bestseller products
  const [bestsellerMessage, setBestsellerMessage] = useState("");

  // Sliders state
  const [allSliders, setAllSliders] = useState([]);
  const [slidersLoading, setSlidersLoading] = useState(false);
  const [selectedSliderPage, setSelectedSliderPage] = useState("home");
  const [sliderUploadFile, setSliderUploadFile] = useState(null);
  const [sliderUploadLoading, setSliderUploadLoading] = useState(false);
  const [sliderMessage, setSliderMessage] = useState("");

  // Uproducts state
  const [uproducts, setUproducts] = useState([]);
  const [uproductsLoading, setUproductsLoading] = useState(false);
  const [uproductImageFile, setUproductImageFile] = useState(null);
  const [uproductHoverImageFile, setUproductHoverImageFile] = useState(null);
  const [uproductUploadLoading, setUproductUploadLoading] = useState(false);
  const [uproductMessage, setUproductMessage] = useState("");
  const [isEditingUproduct, setIsEditingUproduct] = useState(false);
  const [editingUproductId, setEditingUproductId] = useState(null);

  // How It Works state
  const [howItWorks, setHowItWorks] = useState([]);
  const [howItWorksLoading, setHowItWorksLoading] = useState(false);
  const [howItWorksFormData, setHowItWorksFormData] = useState({
    id: null,
    title: "",
    subtitle: "",
    image: null,
  });
  const [howItWorksUploadLoading, setHowItWorksUploadLoading] = useState(false);
  const [howItWorksMessage, setHowItWorksMessage] = useState("");
  const [isEditingHowItWorks, setIsEditingHowItWorks] = useState(false);

  // Settings view state (slider, ourproducts, howitworks)
  const [settingsView, setSettingsView] = useState("slider");

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

  // Fetch NEW (unverified) orders for New Orders section
  useEffect(() => {
    const fetchNewOrders = async () => {
      if (activeSection !== "newOrders") return;
      try {
        setLoadingNewOrders(true);
        setErrorNewOrders(null);
        const token = localStorage.getItem("adminToken");
        if (!token) {
          navigate("/admin/login");
          return;
        }
        const response = await axios.get(API_ENDPOINTS.ADMIN_ORDERS_NEW, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNewOrders(response.data.orders || []);
      } catch (err) {
        console.error("Error fetching new orders:", err);
        setErrorNewOrders("Failed to load new orders. Please try again.");
      } finally {
        setLoadingNewOrders(false);
      }
    };

    fetchNewOrders();
  }, [activeSection, navigate]);

  const handleVerifyOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin/login");
        return;
      }
      await axios.post(
        API_ENDPOINTS.ADMIN_ORDER_VERIFY(orderId),
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Remove from newOrders list optimistically
      setNewOrders((prev) => prev.filter((o) => o.id !== orderId));
      // Optionally refresh main orders list
      // We can refetch orders in background
      (async () => {
        try {
          const resp = await axios.get(API_ENDPOINTS.ADMIN_ORDERS, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const fetchedOrders = resp.data.orders || [];
          setOrders(fetchedOrders);
          setFilteredOrders(fetchedOrders);
        } catch (e) {
          console.warn("Could not refresh orders after verify.");
        }
      })();
    } catch (err) {
      console.error("Verification failed:", err);
      alert("Failed to verify order. Please try again.");
    }
  };

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

  // Fetch bestsellers when bestsellers view is active
  useEffect(() => {
    if (productView === "bestsellers") {
      fetchBestsellers();
    }
  }, [productView]);

  // Fetch enquiries when enquiries section is active
  useEffect(() => {
    const fetchEnquiries = async () => {
      if (activeSection !== "enquiries") return;

      const token = localStorage.getItem("adminToken");
      const params = {
        q: enquiryFilters.q,
        start_date: enquiryFilters.start_date,
        end_date: enquiryFilters.end_date,
        per_page: enquiryFilters.per_page,
        page: enquiryFilters.page,
      };

      try {
        // Fetch contact enquiries
        setContactLoading(true);
        setContactError(null);
        const contactsResponse = await axios.get(
          API_ENDPOINTS.ADMIN_ENQUIRY_CONTACT,
          {
            headers: { Authorization: `Bearer ${token}` },
            params,
          }
        );

        if (contactsResponse.data.success) {
          setContactEnquiries(contactsResponse.data.data || []);
          setContactMeta(contactsResponse.data.meta || {});
        }
      } catch (err) {
        console.error("Error fetching contact enquiries:", err);
        setContactError("Failed to load contact enquiries");
      } finally {
        setContactLoading(false);
      }

      try {
        // Fetch perfume bar bookings
        setPerfumeLoading(true);
        setPerfumeError(null);
        const bookingsResponse = await axios.get(
          API_ENDPOINTS.ADMIN_ENQUIRY_BOOKINGS,
          {
            headers: { Authorization: `Bearer ${token}` },
            params,
          }
        );

        if (bookingsResponse.data.success) {
          setPerfumeBookings(bookingsResponse.data.data || []);
          setPerfumeMeta(bookingsResponse.data.meta || {});
        }
      } catch (err) {
        console.error("Error fetching perfume bar bookings:", err);
        setPerfumeError("Failed to load perfume bar bookings");
      } finally {
        setPerfumeLoading(false);
      }
    };

    fetchEnquiries();
  }, [activeSection, enquiryFilters]);

  // Fetch sliders, uproducts, and how_it_works when settings section is active
  useEffect(() => {
    if (activeSection === "settings") {
      fetchSliders();
      fetchUproducts();
      fetchHowItWorks();
    }
  }, [activeSection]);

  // Helper to update enquiry filters
  const updateEnquiryFilter = (key, value) => {
    setEnquiryFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : value, // Reset to page 1 when filter changes (except page itself)
    }));
  };

  // Export Contact Enquiries to CSV
  const exportContactEnquiriesToCSV = () => {
    if (contactEnquiries.length === 0) {
      alert("No contact enquiries to export");
      return;
    }

    const headers = [
      "ID",
      "Hotel Name",
      "Email",
      "Mobile",
      "Packaging",
      "Fragrance",
      "Quantity",
      "Requirements",
      "Date",
    ];
    const rows = contactEnquiries.map((contact) => [
      contact.id,
      contact.hotel_name || "N/A",
      contact.email,
      contact.mobile,
      contact.packaging_option || "N/A",
      contact.preferred_fragrance || "N/A",
      contact.estimated_quantity || "N/A",
      contact.additional_requirements || "N/A",
      new Date(contact.created_at).toLocaleDateString(),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `hotel-amenities-enquiries-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
  };

  // Export Perfume Bookings to CSV
  const exportPerfumeBookingsToCSV = () => {
    if (perfumeBookings.length === 0) {
      alert("No perfume bookings to export");
      return;
    }

    const headers = [
      "ID",
      "Name",
      "Email",
      "Mobile",
      "Package",
      "Message",
      "Date",
    ];
    const rows = perfumeBookings.map((booking) => [
      booking.id,
      booking.name || "N/A",
      booking.email,
      booking.mobile,
      booking.package || "N/A",
      booking.message || "N/A",
      new Date(booking.created_at).toLocaleDateString(),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `perfume-bar-bookings-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
  };

  // Export Contact Enquiries to PDF
  const exportContactEnquiriesToPDF = () => {
    if (contactEnquiries.length === 0) {
      alert("No contact enquiries to export");
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Title
    doc.setFontSize(18);
    doc.text("Hotel Amenities Contact Enquiries", pageWidth / 2, 15, {
      align: "center",
    });

    // Date
    doc.setFontSize(10);
    doc.text(
      `Generated: ${new Date().toLocaleDateString()}`,
      pageWidth / 2,
      22,
      { align: "center" }
    );

    // Table
    const tableData = contactEnquiries.map((contact) => [
      contact.hotel_name || "N/A",
      contact.email,
      contact.mobile,
      contact.packaging_option || "N/A",
      contact.preferred_fragrance || "N/A",
      new Date(contact.created_at).toLocaleDateString(),
    ]);

    autoTable(doc, {
      head: [
        ["Hotel Name", "Email", "Mobile", "Packaging", "Fragrance", "Date"],
      ],
      body: tableData,
      startY: 28,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [35, 41, 70] },
    });

    doc.save(
      `hotel-amenities-enquiries-${new Date().toISOString().split("T")[0]}.pdf`
    );
  };

  // Export Perfume Bookings to PDF
  const exportPerfumeBookingsToPDF = () => {
    if (perfumeBookings.length === 0) {
      alert("No perfume bookings to export");
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Title
    doc.setFontSize(18);
    doc.text("Live Perfume Bar Bookings", pageWidth / 2, 15, {
      align: "center",
    });

    // Date
    doc.setFontSize(10);
    doc.text(
      `Generated: ${new Date().toLocaleDateString()}`,
      pageWidth / 2,
      22,
      { align: "center" }
    );

    // Table
    const tableData = perfumeBookings.map((booking) => [
      booking.name || "N/A",
      booking.email,
      booking.mobile,
      booking.package || "N/A",
      new Date(booking.created_at).toLocaleDateString(),
    ]);

    autoTable(doc, {
      head: [["Name", "Email", "Mobile", "Package", "Date"]],
      body: tableData,
      startY: 28,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [35, 41, 70] },
    });

    doc.save(
      `perfume-bar-bookings-${new Date().toISOString().split("T")[0]}.pdf`
    );
  };

  // Export Orders to CSV
  const exportOrdersToCSV = () => {
    if (filteredOrders.length === 0) {
      alert("No orders to export");
      return;
    }

    const headers = [
      "Order ID",
      "Customer Name",
      "Email",
      "Mobile",
      "Amount",
      "Status",
      "Order Status",
      "Payment ID",
      "Date",
    ];
    const rows = filteredOrders.map((order) => [
      order.order_id,
      order.user?.name || "N/A",
      order.user?.email || "N/A",
      order.user?.mobile || "N/A",
      `₹${order.amount}`,
      order.status,
      order.order_status || "pending",
      order.razorpay_payment_id || "N/A",
      new Date(order.created_at).toLocaleDateString(),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  // Export Orders to PDF
  const exportOrdersToPDF = () => {
    if (filteredOrders.length === 0) {
      alert("No orders to export");
      return;
    }

    const doc = new jsPDF("landscape");
    const pageWidth = doc.internal.pageSize.getWidth();

    // Title
    doc.setFontSize(18);
    doc.text("Orders Report", pageWidth / 2, 15, { align: "center" });

    // Date range or generation date
    doc.setFontSize(10);
    if (startDate && endDate) {
      doc.text(`Period: ${startDate} to ${endDate}`, pageWidth / 2, 22, {
        align: "center",
      });
    } else {
      doc.text(
        `Generated: ${new Date().toLocaleDateString()}`,
        pageWidth / 2,
        22,
        { align: "center" }
      );
    }

    // Table
    const tableData = filteredOrders.map((order) => [
      order.order_id,
      order.user?.name || "N/A",
      order.user?.email || "N/A",
      `₹${order.amount}`,
      order.status,
      order.order_status || "pending",
      new Date(order.created_at).toLocaleDateString(),
    ]);

    autoTable(doc, {
      head: [
        [
          "Order ID",
          "Customer",
          "Email",
          "Amount",
          "Payment",
          "Order Status",
          "Date",
        ],
      ],
      body: tableData,
      startY: 28,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [35, 41, 70] },
    });

    doc.save(`orders-${new Date().toISOString().split("T")[0]}.pdf`);
  };

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
      const response = await axios.delete(API_ENDPOINTS.ADMIN_DELETE(adminId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to delete admin";
      setAdminFormMessage("✗ " + errorMsg);
      setTimeout(() => setAdminFormMessage(""), 5000);
    }
  };

  // Fetch all sliders
  const fetchSliders = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      setSlidersLoading(true);
      const response = await axios.get(API_ENDPOINTS.ADMIN_SLIDERS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setAllSliders(response.data.sliders);
      }
    } catch (error) {
      console.error("Error fetching sliders:", error);
      setSliderMessage("✗ Failed to fetch sliders");
      setTimeout(() => setSliderMessage(""), 5000);
    } finally {
      setSlidersLoading(false);
    }
  };

  // Validate slider image dimensions
  const validateSliderImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        const width = img.width;
        const height = img.height;

        if (width < 1400 || height < 450) {
          reject(
            `Image dimensions ${width}x${height}px are too small. Minimum required: 1400x450px`
          );
        } else {
          resolve({ width, height });
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject("Failed to load image");
      };

      img.src = url;
    });
  };

  // Handle slider image upload
  const handleSliderUpload = async (e) => {
    e.preventDefault();

    if (!sliderUploadFile) {
      setSliderMessage("✗ Please select an image file");
      setTimeout(() => setSliderMessage(""), 5000);
      return;
    }

    // Validate image dimensions before upload
    try {
      setSliderUploadLoading(true);
      setSliderMessage("⏳ Validating image dimensions...");

      const dimensions = await validateSliderImageDimensions(sliderUploadFile);
      console.log(
        `Image dimensions: ${dimensions.width}x${dimensions.height}px`
      );
    } catch (error) {
      setSliderUploadLoading(false);
      setSliderMessage("✗ " + error);
      setTimeout(() => setSliderMessage(""), 7000);
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      setSliderMessage("⏳ Uploading slider...");

      const formData = new FormData();
      formData.append("page", selectedSliderPage);
      formData.append("image", sliderUploadFile);

      // Debug: Log what we're sending
      console.log("Uploading slider:");
      console.log("- Page:", selectedSliderPage);
      console.log("- File:", sliderUploadFile);
      console.log("- File name:", sliderUploadFile?.name);
      console.log("- File size:", sliderUploadFile?.size);
      console.log("- File type:", sliderUploadFile?.type);

      const response = await axios.post(
        API_ENDPOINTS.ADMIN_SLIDERS_UPLOAD,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSliderMessage("✓ Slider uploaded successfully!");
        setSliderUploadFile(null);
        // Reset file input
        const fileInput = document.getElementById("slider-upload-input");
        if (fileInput) fileInput.value = "";
        // Refresh sliders
        fetchSliders();
        setTimeout(() => setSliderMessage(""), 5000);
      }
    } catch (error) {
      console.error("Error uploading slider:", error);
      console.error("Error response:", error.response?.data);
      console.error("Validation errors:", error.response?.data?.errors);

      let errorMsg = "Failed to upload slider";

      // Handle validation errors
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        console.error("Detailed errors:", errors);
        // Log each error field individually
        Object.keys(errors).forEach((field) => {
          console.error(`Field '${field}':`, errors[field]);
        });
        errorMsg = Object.values(errors).flat().join(", ");
      } else if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }

      setSliderMessage("✗ " + errorMsg);
      setTimeout(() => setSliderMessage(""), 10000);
    } finally {
      setSliderUploadLoading(false);
    }
  };

  // Handle slider deletion
  const handleDeleteSlider = async (sliderId, sliderPage) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this slider from ${sliderPage} page?\n\nThis action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.delete(
        API_ENDPOINTS.ADMIN_SLIDERS_DELETE(sliderId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSliderMessage("✓ Slider deleted successfully!");
        fetchSliders();
        setTimeout(() => setSliderMessage(""), 5000);
      }
    } catch (error) {
      console.error("Error deleting slider:", error);
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to delete slider";
      setSliderMessage("✗ " + errorMsg);
      setTimeout(() => setSliderMessage(""), 5000);
    }
  };

  // Handle slider reordering (move up/down)
  const handleReorderSlider = async (page, currentIndex, direction) => {
    const pageSliders = allSliders.filter((s) => s.page === page);
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    // Validate bounds
    if (newIndex < 0 || newIndex >= pageSliders.length) return;

    // Create new order array by swapping positions
    const reorderedSliders = [...pageSliders];
    [reorderedSliders[currentIndex], reorderedSliders[newIndex]] = [
      reorderedSliders[newIndex],
      reorderedSliders[currentIndex],
    ];

    // Extract slider IDs in new order
    const sliderIds = reorderedSliders.map((slider) => slider.id);

    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.post(
        API_ENDPOINTS.ADMIN_SLIDERS_REORDER,
        {
          page: page,
          slider_ids: sliderIds,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSliderMessage("✓ Slider order updated successfully!");
        fetchSliders();
        setTimeout(() => setSliderMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error reordering slider:", error);
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to reorder slider";
      setSliderMessage("✗ " + errorMsg);
      setTimeout(() => setSliderMessage(""), 5000);
    }
  };

  // Fetch all uproducts
  const fetchUproducts = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      setUproductsLoading(true);
      const response = await axios.get(API_ENDPOINTS.ADMIN_UPRODUCTS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setUproducts(response.data.uproducts);
      }
    } catch (error) {
      console.error("Error fetching uproducts:", error);
      setUproductMessage("✗ Failed to fetch uproducts");
      setTimeout(() => setUproductMessage(""), 5000);
    } finally {
      setUproductsLoading(false);
    }
  };

  // Validate uproduct image dimensions
  const validateUproductImageDimensions = (file, imageType = "Main") => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        const width = img.width;
        const height = img.height;

        if (width < 350 || height < 450) {
          reject(
            `${imageType} image dimensions ${width}x${height}px are too small. Minimum required: 350x450px`
          );
        } else {
          resolve({ width, height });
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(`Failed to load ${imageType.toLowerCase()} image`);
      };

      img.src = url;
    });
  };

  // Handle uproduct upload/update
  const handleUproductUpload = async (e) => {
    e.preventDefault();

    if (!isEditingUproduct && !uproductImageFile) {
      setUproductMessage("✗ Please select a main image");
      setTimeout(() => setUproductMessage(""), 5000);
      return;
    }

    // Validate image dimensions before upload
    try {
      setUproductUploadLoading(true);
      setUproductMessage("⏳ Validating image dimensions...");

      // Validate main image if provided
      if (uproductImageFile) {
        const dimensions = await validateUproductImageDimensions(
          uproductImageFile,
          "Main"
        );
        console.log(
          `Main image dimensions: ${dimensions.width}x${dimensions.height}px`
        );
      }

      // Validate hover image if provided
      if (uproductHoverImageFile) {
        const hoverDimensions = await validateUproductImageDimensions(
          uproductHoverImageFile,
          "Hover"
        );
        console.log(
          `Hover image dimensions: ${hoverDimensions.width}x${hoverDimensions.height}px`
        );
      }
    } catch (error) {
      setUproductUploadLoading(false);
      setUproductMessage("✗ " + error);
      setTimeout(() => setUproductMessage(""), 7000);
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      setUproductMessage("⏳ Uploading product image...");

      const formData = new FormData();
      if (uproductImageFile) {
        formData.append("image", uproductImageFile);
      }
      if (uproductHoverImageFile) {
        formData.append("hover_image", uproductHoverImageFile);
      }

      const url = isEditingUproduct
        ? API_ENDPOINTS.ADMIN_UPRODUCTS_UPDATE(editingUproductId)
        : API_ENDPOINTS.ADMIN_UPRODUCTS_UPLOAD;

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setUproductMessage(
          `✓ Uproduct ${
            isEditingUproduct ? "updated" : "uploaded"
          } successfully!`
        );
        setUproductImageFile(null);
        setUproductHoverImageFile(null);
        setIsEditingUproduct(false);
        setEditingUproductId(null);
        // Reset file inputs
        const imageInput = document.getElementById("uproduct-image-input");
        const hoverInput = document.getElementById(
          "uproduct-hover-image-input"
        );
        if (imageInput) imageInput.value = "";
        if (hoverInput) hoverInput.value = "";
        fetchUproducts();
        setTimeout(() => setUproductMessage(""), 5000);
      }
    } catch (error) {
      console.error("Error saving uproduct:", error);
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        `Failed to ${isEditingUproduct ? "update" : "upload"} uproduct`;
      setUproductMessage("✗ " + errorMsg);
      setTimeout(() => setUproductMessage(""), 5000);
    } finally {
      setUproductUploadLoading(false);
    }
  };

  // Handle editing uproduct
  const handleEditUproduct = (uproduct) => {
    setIsEditingUproduct(true);
    setEditingUproductId(uproduct.id);
    setUproductImageFile(null);
    setUproductHoverImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cancel editing uproduct
  const handleCancelEditUproduct = () => {
    setIsEditingUproduct(false);
    setEditingUproductId(null);
    setUproductImageFile(null);
    setUproductHoverImageFile(null);
    const imageInput = document.getElementById("uproduct-image-input");
    const hoverInput = document.getElementById("uproduct-hover-image-input");
    if (imageInput) imageInput.value = "";
    if (hoverInput) hoverInput.value = "";
  };

  // Handle uproduct deletion
  const handleDeleteUproduct = async (uproductId) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this product image?\n\nThis action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.delete(
        API_ENDPOINTS.ADMIN_UPRODUCTS_DELETE(uproductId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setUproductMessage("✓ Uproduct deleted successfully!");
        fetchUproducts();
        setTimeout(() => setUproductMessage(""), 5000);
      }
    } catch (error) {
      console.error("Error deleting uproduct:", error);
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to delete uproduct";
      setUproductMessage("✗ " + errorMsg);
      setTimeout(() => setUproductMessage(""), 5000);
    }
  };

  // Validate How It Works image dimensions (350x400px minimum)
  const validateHowItWorksImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        const width = img.width;
        const height = img.height;

        if (width < 350 || height < 400) {
          reject(
            `Image dimensions ${width}x${height}px are too small. Minimum required: 350x400px`
          );
        } else {
          resolve({ width, height });
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject("Failed to load image for validation");
      };

      img.src = url;
    });
  };

  // Fetch all how_it_works items
  const fetchHowItWorks = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      setHowItWorksLoading(true);
      const response = await axios.get(API_ENDPOINTS.ADMIN_HOW_IT_WORKS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setHowItWorks(response.data.items);
      }
    } catch (error) {
      console.error("Error fetching how it works:", error);
      setHowItWorksMessage("✗ Failed to fetch how it works items");
      setTimeout(() => setHowItWorksMessage(""), 5000);
    } finally {
      setHowItWorksLoading(false);
    }
  };

  // Handle how_it_works form submission
  const handleHowItWorksSubmit = async (e) => {
    e.preventDefault();

    if (!howItWorksFormData.title || !howItWorksFormData.subtitle) {
      setHowItWorksMessage("✗ Please fill in all fields");
      setTimeout(() => setHowItWorksMessage(""), 5000);
      return;
    }

    if (!isEditingHowItWorks && !howItWorksFormData.image) {
      setHowItWorksMessage("✗ Please select an image");
      setTimeout(() => setHowItWorksMessage(""), 5000);
      return;
    }

    // Validate image dimensions if image is provided
    if (howItWorksFormData.image) {
      try {
        setHowItWorksMessage("⏳ Validating image dimensions...");
        await validateHowItWorksImageDimensions(howItWorksFormData.image);
      } catch (error) {
        setHowItWorksMessage("✗ " + error);
        setTimeout(() => setHowItWorksMessage(""), 7000);
        return;
      }
    }

    try {
      const token = localStorage.getItem("adminToken");
      setHowItWorksUploadLoading(true);
      setHowItWorksMessage("");

      const formData = new FormData();
      formData.append("title", howItWorksFormData.title);
      formData.append("subtitle", howItWorksFormData.subtitle);
      if (howItWorksFormData.image) {
        formData.append("image", howItWorksFormData.image);
      }

      const url = isEditingHowItWorks
        ? API_ENDPOINTS.ADMIN_HOW_IT_WORKS_UPDATE(howItWorksFormData.id)
        : API_ENDPOINTS.ADMIN_HOW_IT_WORKS_CREATE;

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setHowItWorksMessage(
          `✓ How It Works item ${
            isEditingHowItWorks ? "updated" : "created"
          } successfully!`
        );
        setHowItWorksFormData({
          id: null,
          title: "",
          subtitle: "",
          image: null,
        });
        setIsEditingHowItWorks(false);
        document.getElementById("how-it-works-image-input").value = "";
        fetchHowItWorks();
        setTimeout(() => setHowItWorksMessage(""), 5000);
      }
    } catch (error) {
      console.error("Error saving how it works:", error);
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to save item";
      setHowItWorksMessage("✗ " + errorMsg);
      setTimeout(() => setHowItWorksMessage(""), 5000);
    } finally {
      setHowItWorksUploadLoading(false);
    }
  };

  // Handle editing how_it_works item
  const handleEditHowItWorks = (item) => {
    setHowItWorksFormData({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle,
      image: null,
    });
    setIsEditingHowItWorks(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle deleting how_it_works item
  const handleDeleteHowItWorks = async (itemId) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this How It Works item?\n\nThis action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.delete(
        API_ENDPOINTS.ADMIN_HOW_IT_WORKS_DELETE(itemId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setHowItWorksMessage("✓ How It Works item deleted successfully!");
        fetchHowItWorks();
        setTimeout(() => setHowItWorksMessage(""), 5000);
      }
    } catch (error) {
      console.error("Error deleting how it works:", error);
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to delete item";
      setHowItWorksMessage("✗ " + errorMsg);
      setTimeout(() => setHowItWorksMessage(""), 5000);
    }
  };

  // Cancel editing how_it_works
  const handleCancelEditHowItWorks = () => {
    setHowItWorksFormData({
      id: null,
      title: "",
      subtitle: "",
      image: null,
    });
    setIsEditingHowItWorks(false);
    document.getElementById("how-it-works-image-input").value = "";
  };

  // Validate Product image dimensions (1020x1020px minimum)
  const validateProductImageDimensions = (file, imageName = "Image") => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        const width = img.width;
        const height = img.height;

        if (width < 1020 || height < 1020) {
          reject(
            `${imageName} dimensions ${width}x${height}px are too small. Minimum required: 1020x1020px`
          );
        } else {
          resolve({ width, height });
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject("Failed to load image for validation");
      };

      img.src = url;
    });
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
    setProductFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle image file selection
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  // Handle drag and drop events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  // Compress image before upload
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Max dimensions
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;

          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob with quality 0.8
          canvas.toBlob(
            (blob) => {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            "image/jpeg",
            0.8
          );
        };
      };
    });
  };

  // Process selected files
  const handleFiles = async (files) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      alert("Please select only image files");
      return;
    }

    // Compress images before adding to state
    const compressedImages = await Promise.all(
      imageFiles.map(async (file, index) => {
        const compressedFile = await compressImage(file);
        return {
          id: Date.now() + index,
          file: compressedFile,
          preview: URL.createObjectURL(compressedFile),
          name: file.name,
        };
      })
    );

    setProductImages((prev) => [...prev, ...compressedImages]);
  };

  // Remove image from list
  const handleRemoveImage = async (imageId) => {
    const imageToRemove = productImages.find((img) => img.id === imageId);

    // If it's an existing image (from database), delete via API
    if (
      imageToRemove &&
      imageToRemove.isExisting &&
      isEditMode &&
      editingProduct
    ) {
      try {
        // Extract actual database ID by removing 'existing-' prefix
        const actualImageId = imageId.toString().replace("existing-", "");

        const token = localStorage.getItem("adminToken");
        const response = await axios.delete(
          API_ENDPOINTS.ADMIN_PRODUCT_IMAGE_DELETE(
            editingProduct.id,
            actualImageId
          ),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          console.log("Image deleted from database successfully");
        }
      } catch (error) {
        console.error("Error deleting image from database:", error);
        alert("Failed to delete image. Please try again.");
        return; // Don't remove from UI if API call failed
      }
    }

    // Remove from local state
    setProductImages((prev) => {
      if (imageToRemove && !imageToRemove.isExisting) {
        // Only revoke blob URLs for new images, not existing ones
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter((img) => img.id !== imageId);
    });
  };

  // Reorder images (drag to reorder)
  const handleImageReorder = (fromIndex, toIndex) => {
    setProductImages((prev) => {
      const newImages = [...prev];
      const [removed] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, removed);
      return newImages;
    });
  };

  // Set image as primary (move to first position)
  const handleSetAsPrimary = (imageId) => {
    setProductImages((prev) => {
      const imageIndex = prev.findIndex((img) => img.id === imageId);
      if (imageIndex === -1 || imageIndex === 0) return prev; // Already first or not found

      const newImages = [...prev];
      const [movedImage] = newImages.splice(imageIndex, 1);
      newImages.unshift(movedImage); // Add to beginning
      return newImages;
    });
  };

  // Handle creating a new product
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setProductFormLoading(true);
    setProductFormMessage("");

    // Validate image dimensions before proceeding
    const imagesToValidate = productImages.filter(
      (img) => img.file && !img.isExisting
    );
    if (imagesToValidate.length > 0) {
      try {
        setProductFormMessage("⏳ Validating image dimensions...");
        for (let i = 0; i < imagesToValidate.length; i++) {
          const img = imagesToValidate[i];
          await validateProductImageDimensions(img.file, `Image ${i + 1}`);
        }
        setProductFormMessage(""); // Clear validation message
      } catch (error) {
        setProductFormMessage("✗ " + error);
        setProductFormLoading(false);
        setTimeout(() => setProductFormMessage(""), 7000);
        return;
      }
    }

    try {
      const token = localStorage.getItem("adminToken");

      // Create FormData for file upload
      const formData = new FormData();

      // Required fields that must always have a value (not NULL)
      const requiredFields = ["name", "flag", "price"];

      // Fields that need default values when empty (DB doesn't allow NULL and has no default)
      const fieldsWithDefaults = {
        about_product: "N/A",
        note: "none", // Backend converts empty string to NULL, so use 'none'
      };

      // Add all product data
      Object.entries(productFormData).forEach(([key, value]) => {
        if (typeof value === "string") {
          let processedValue = value;

          // Remove "ml" from volume_ml field before sending (case-insensitive)
          if (key === "volume_ml" && value) {
            processedValue = value.replace(/ml/gi, "").trim();
          }

          // Special handling for fields that need defaults
          if (fieldsWithDefaults.hasOwnProperty(key)) {
            formData.append(
              key,
              processedValue && processedValue.trim() !== ""
                ? processedValue
                : fieldsWithDefaults[key]
            );
          }
          // For other required fields, always send the value
          else if (requiredFields.includes(key)) {
            formData.append(key, processedValue || "");
          }
          // For optional fields, only send if not empty (backend will set to NULL)
          else if (processedValue && processedValue.trim() !== "") {
            formData.append(key, processedValue);
          }
        } else if (typeof value === "boolean") {
          // Convert boolean to 1 or 0 for Laravel validation
          formData.append(key, value ? "1" : "0");
        } else if (typeof value === "number") {
          formData.append(key, value);
        }
      });

      // Handle images differently for legacy vs new products
      const isLegacy = productFormData.source_table === "freshner_mist";

      if (isLegacy) {
        // Legacy products: single image upload only
        if (productImages.length > 0 && productImages[0].file) {
          formData.append("image", productImages[0].file);
        }
      } else {
        // New products: multiple images support
        productImages.forEach((img, index) => {
          // Only append new images (those with file objects), skip existing ones
          if (img.file && !img.isExisting) {
            formData.append(`images[]`, img.file);
          }
        });

        // Send existing images order for update mode
        if (isEditMode && editingProduct) {
          const imageOrder = productImages
            .filter((img) => img.isExisting)
            .map((img, index) => ({
              id: img.id.replace("existing-", ""), // Remove 'existing-' prefix to get actual DB id
              sort_order: index,
              is_primary: index === 0,
            }));
          formData.append("existing_images_order", JSON.stringify(imageOrder));
        }
      }

      // Pass source_table for backend to route correctly
      if (productFormData.source_table) {
        formData.append("source_table", productFormData.source_table);
      }

      let response;
      if (isEditMode && editingProduct) {
        // UPDATE existing product
        formData.append("_method", "PUT"); // Laravel requires this for FormData PUT requests
        response = await axios.post(
          API_ENDPOINTS.ADMIN_PRODUCT_UPDATE(editingProduct.id),
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            timeout: 120000,
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              console.log(`Upload Progress: ${percentCompleted}%`);
            },
          }
        );
      } else {
        // CREATE new product
        response = await axios.post(API_ENDPOINTS.ADMIN_PRODUCTS, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 120000,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Upload Progress: ${percentCompleted}%`);
          },
        });
      }

      if (response.data.success) {
        setProductFormMessage(
          isEditMode
            ? "✓ Product updated successfully!"
            : "✓ Product created successfully!"
        );

        // Reset form
        setProductFormData({
          name: "",
          flag: "perfume",
          price: "",
          volume_ml: "",
          scent: "",
          note: "",
          Discription: "",
          about_product: "",
          original_price: "",
          discount_amount: "",
          is_discount_active: false,
          delivery_charge: "",
          available_quantity: "",
          image: "",
          ingredients: "",
          brand: "",
          colour: "",
          item_form: "",
          power_source: "",
          launch_date: "",
          source_table: "",
        });

        // Clear images - only revoke blob URLs for new images
        productImages.forEach((img) => {
          if (!img.isExisting && img.preview) {
            URL.revokeObjectURL(img.preview);
          }
        });
        setProductImages([]);

        // Exit edit mode
        setIsEditMode(false);
        setEditingProduct(null);
        setProductView("list"); // Switch back to list view

        // Refresh products list
        const productsResponse = await axios.get(API_ENDPOINTS.ADMIN_PRODUCTS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (productsResponse.data.success) {
          setAllProducts(productsResponse.data.products);
        }

        setTimeout(() => setProductFormMessage(""), 5000);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      console.log("Full error response:", error.response?.data);

      // Handle validation errors from Laravel
      let errorMsg = "";

      if (error.response?.data?.errors) {
        // Laravel validation errors format: { field: ["error message"] }
        const validationErrors = error.response.data.errors;
        const errorMessages = [];

        for (const [field, messages] of Object.entries(validationErrors)) {
          const fieldName = field
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
          errorMessages.push(`⚠️ ${fieldName}: ${messages[0]}`);
        }

        errorMsg =
          errorMessages.length > 1
            ? "Please fix the following errors:\n" + errorMessages.join("\n")
            : errorMessages[0];
      } else if (error.response?.data?.message) {
        const dbError = error.response.data.message;
        console.log("DB Error message:", dbError);

        // Try to extract field name from any SQL error pattern
        let fieldName = null;

        // Pattern 1: Column 'field_name' cannot be null
        let match = dbError.match(/Column '(\w+)' cannot be null/i);
        if (match) {
          fieldName = match[1];
        }

        // Pattern 2: Field 'field_name' doesn't have a default value
        if (!fieldName) {
          match = dbError.match(/Field '(\w+)' doesn't have a default value/i);
          if (match) fieldName = match[1];
        }

        // Pattern 3: Data too long for column 'field_name'
        if (!fieldName) {
          match = dbError.match(/Data too long for column '(\w+)'/i);
          if (match) fieldName = match[1];
        }

        // Pattern 4: Any other "Column 'field_name'" or "Field 'field_name'" pattern
        if (!fieldName) {
          match = dbError.match(/(?:Column|Field) '(\w+)'/i);
          if (match) fieldName = match[1];
        }

        // If we found a field name, format it nicely
        if (fieldName) {
          const formattedFieldName = fieldName
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());

          // Determine the error type and show appropriate message
          if (
            dbError.includes("cannot be null") ||
            dbError.includes("doesn't have a default value")
          ) {
            errorMsg = `⚠️ Field Required: "${formattedFieldName}" cannot be empty`;
          } else if (dbError.includes("Data too long")) {
            errorMsg = `⚠️ Field Error: "${formattedFieldName}" value is too long`;
          } else if (dbError.includes("Duplicate entry")) {
            errorMsg = `⚠️ Duplicate Error: "${formattedFieldName}" value already exists`;
          } else {
            errorMsg = `⚠️ Field Error: "${formattedFieldName}" has an issue`;
          }
        } else if (dbError.includes("Duplicate entry")) {
          // Handle duplicate without field name
          const dupMatch = dbError.match(/Duplicate entry '([^']+)'/);
          if (dupMatch) {
            errorMsg = `⚠️ Duplicate Error: The value "${dupMatch[1]}" already exists`;
          } else {
            errorMsg = "⚠️ Duplicate Error: This product already exists";
          }
        } else {
          // Generic fallback
          errorMsg =
            "⚠️ Database Error: Unable to save the product. Please check all required fields.";
        }
      } else if (error.response?.data?.error) {
        errorMsg = "⚠️ " + error.response.data.error;
      } else {
        errorMsg = `Failed to ${
          isEditMode ? "update" : "create"
        } product.\n\nPlease check all required fields are filled correctly.`;
      }

      setProductFormMessage("✗ " + errorMsg);
    } finally {
      setProductFormLoading(false);
    }
  };

  // Handle editing a product - populate form with existing data
  const handleEditProduct = (product) => {
    setIsEditMode(true);
    setEditingProduct(product);
    setProductView("add"); // Switch to add/edit view

    // Populate form with existing product data
    setProductFormData({
      name: product.name || "",
      flag: product.flag || "perfume",
      price: product.price || "",
      volume_ml: product.volume_ml || "",
      scent: product.scent || "",
      note: product.note || "",
      Discription: product.discription || product.Discription || "",
      about_product: product.about_product || "",
      original_price: product.original_price || "",
      discount_amount: product.discount_amount || "",
      is_discount_active: product.is_discount_active || false,
      delivery_charge: product.delivery_charge || "",
      available_quantity: product.available_quantity || "",
      image: product.image || "",
      ingredients: product.ingredients || "",
      brand: product.brand || "",
      colour: product.colour || "",
      item_form: product.item_form || "",
      power_source: product.power_source || "",
      launch_date: product.launch_date || "",
      source_table: product.source_table || "", // Track if it's a legacy product
    });

    // Populate existing images for preview (if available)
    if (
      product.all_images &&
      Array.isArray(product.all_images) &&
      product.all_images.length > 0
    ) {
      const existingImages = product.all_images.map((img, index) => ({
        id: `existing-${img.id || index}`,
        preview: img.url, // Use the full URL from API
        name: `Image ${index + 1}`,
        file: null, // No file object for existing images
        isExisting: true, // Flag to identify existing images
      }));
      setProductImages(existingImages);
    } else {
      setProductImages([]);
    }

    // Scroll to product form
    document
      .getElementById("product-form-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  // Cancel editing mode
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditingProduct(null);
    setProductView("list"); // Switch back to list view

    // Reset form
    setProductFormData({
      name: "",
      flag: "perfume",
      price: "",
      volume_ml: "",
      scent: "",
      note: "",
      Discription: "",
      about_product: "",
      original_price: "",
      discount_amount: "",
      is_discount_active: false,
      delivery_charge: "",
      available_quantity: "",
      image: "",
      ingredients: "",
      brand: "",
      colour: "",
      item_form: "",
      power_source: "",
      launch_date: "",
      source_table: "",
    });
    setProductImages([]);
  };

  // Handle deleting a product
  const handleDeleteProduct = async (
    productId,
    productName,
    sourceTable = null
  ) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete product: ${productName}?\n\nThis action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("adminToken");

      // Build URL with query parameter for source_table
      let deleteUrl = API_ENDPOINTS.ADMIN_PRODUCT_DELETE(productId);
      if (sourceTable) {
        deleteUrl += `?source_table=${sourceTable}`;
      }

      const response = await axios.delete(deleteUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setProductFormMessage("✓ Product deleted successfully!");

        // Refresh products list
        const productsResponse = await axios.get(API_ENDPOINTS.ADMIN_PRODUCTS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (productsResponse.data.success) {
          setAllProducts(productsResponse.data.products);
        }

        setTimeout(() => setProductFormMessage(""), 5000);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to delete product";
      setProductFormMessage("✗ " + errorMsg);
    }
  };

  // Handle toggling bestseller status
  const handleToggleBestseller = async (productId, currentStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      const newStatus = !currentStatus; // Toggle boolean value

      console.log(
        "Toggling bestseller for product",
        productId,
        "from",
        currentStatus,
        "to",
        newStatus
      );

      const response = await axios.put(
        API_ENDPOINTS.ADMIN_PRODUCT_UPDATE(productId),
        { is_bestseller: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Bestseller update response:", response.data);

      if (response.data.success) {
        setProductFormMessage(
          newStatus
            ? "✓ Product marked as bestseller!"
            : "✓ Removed from bestsellers!"
        );

        // Refresh products list
        const productsResponse = await axios.get(API_ENDPOINTS.ADMIN_PRODUCTS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (productsResponse.data.success) {
          setAllProducts(productsResponse.data.products);
        }

        // Also refresh bestsellers if on bestsellers view
        if (productView === "bestsellers") {
          fetchBestsellers();
        }

        setTimeout(() => setProductFormMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error updating bestseller status:", error);
      console.error("Error response:", error.response?.data);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update bestseller status";
      setProductFormMessage("✗ " + errorMsg);
      setTimeout(() => setProductFormMessage(""), 5000);
    }
  };

  // Fetch bestsellers for management
  const fetchBestsellers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(API_ENDPOINTS.ADMIN_PRODUCTS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const bestsellerProducts = response.data.products
          .filter((p) => p.is_bestseller)
          .sort(
            (a, b) => (a.bestseller_order || 999) - (b.bestseller_order || 999)
          );

        setBestsellers(bestsellerProducts);
      }
    } catch (error) {
      console.error("Error fetching bestsellers:", error);
    }
  };

  // Move item up in the list
  const handleMoveUp = (index) => {
    if (index === 0) return; // Already at top

    const items = Array.from(bestsellers);
    // Swap with previous item
    [items[index - 1], items[index]] = [items[index], items[index - 1]];
    setBestsellers(items);
  };

  // Move item down in the list
  const handleMoveDown = (index) => {
    if (index === bestsellers.length - 1) return; // Already at bottom

    const items = Array.from(bestsellers);
    // Swap with next item
    [items[index], items[index + 1]] = [items[index + 1], items[index]];
    setBestsellers(items);
  };

  // Save bestseller order
  const saveBestsellerOrder = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const bestsellerData = bestsellers.map((product, index) => ({
        id: product.id,
        order: index,
      }));

      const response = await axios.post(
        API_ENDPOINTS.ADMIN_BESTSELLERS_REORDER,
        { bestsellers: bestsellerData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setBestsellerMessage("✓ Bestseller order saved successfully!");
        setTimeout(() => setBestsellerMessage(""), 4000);
      }
    } catch (error) {
      console.error("Error saving bestseller order:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to save bestseller order";
      setBestsellerMessage("✗ " + errorMsg);
      setTimeout(() => setBestsellerMessage(""), 5000);
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
      alert("No customers to export");
      return;
    }

    // Define CSV headers
    const headers = [
      "ID",
      "Name",
      "Email",
      "Mobile",
      "Address",
      "City",
      "PIN",
      "GST Number",
      "Email Verified",
    ];

    // Map user data to CSV rows
    const rows = allUsers.map((user) => [
      user.id || "",
      user.name || "",
      user.email || "",
      user.mobile || "",
      user.address || "",
      user.city || "",
      user.pin || "",
      user.gst_number || "",
      user.email_verified ? "Yes" : "No",
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    // Create blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `floretta_customers_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export customers to PDF
  const exportCustomersToPDF = () => {
    if (allUsers.length === 0) {
      alert("No customers to export");
      return;
    }

    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Floretta India - Customer List", 14, 22);

    // Add export date
    doc.setFontSize(10);
    doc.text(`Export Date: ${new Date().toLocaleDateString()}`, 14, 30);

    // Prepare table data
    const tableData = allUsers.map((user) => [
      user.id || "",
      user.name || "",
      user.email || "",
      user.mobile || "",
      user.city || "",
      user.pin || "",
      user.gst_number || "",
      user.email_verified ? "Yes" : "No",
    ]);

    // Add table
    autoTable(doc, {
      head: [
        ["ID", "Name", "Email", "Mobile", "City", "PIN", "GST", "Verified"],
      ],
      body: tableData,
      startY: 35,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [243, 114, 84], textColor: 255 },
      alternateRowStyles: { fillColor: [249, 249, 249] },
      margin: { top: 35 },
    });

    // Generate PDF as blob and trigger direct download
    const pdfBlob = doc.output("blob");
    const fileName = `floretta_customers_${
      new Date().toISOString().split("T")[0]
    }.pdf`;

    // Create a link element and trigger download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(pdfBlob);
    link.download = fileName;
    link.style.display = "none";

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
              className={activeSection === "enquiries" ? "active" : ""}
              onClick={() => {
                setActiveSection("enquiries");
                setSidebarOpen(false);
              }}
            >
              <i className="fas fa-envelope"></i>
              <span>Enquiries</span>
            </li>
            <li
              className={activeSection === "reviews" ? "active" : ""}
              onClick={() => {
                setActiveSection("reviews");
                setSidebarOpen(false);
              }}
            >
              <i className="fas fa-star"></i>
              <span>Reviews</span>
            </li>
            <li
              className={activeSection === "careers" ? "active" : ""}
              onClick={() => {
                setActiveSection("careers");
                setSidebarOpen(false);
              }}
            >
              <i className="fas fa-briefcase"></i>
              <span>Career Page</span>
            </li>
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
          <h1>
            {activeSection === "orders" && `Orders (${filteredOrders.length})`}
            {activeSection === "newOrders" && "New Orders"}
            {activeSection === "products" && "Products"}
            {activeSection === "customers" && "Customers"}
            {activeSection === "analytics" && "Analytics"}
            {activeSection === "addUser" && "Add User"}
            {activeSection === "admins" && "Admin Management"}
            {activeSection === "enquiries" && "Enquiries"}
            {activeSection === "reviews" && "Reviews"}
            {activeSection === "careers" && "Career Page"}
            {activeSection === "settings" && "Settings"}
            {![
              "orders",
              "newOrders",
              "products",
              "customers",
              "analytics",
              "addUser",
              "admins",
              "enquiries",
              "reviews",
              "careers",
              "settings",
            ].includes(activeSection) && "Dashboard"}
          </h1>
          <div className="admin-header-right">
            <span className="admin-user">
              Welcome,{" "}
              {adminInfo?.email ? adminInfo.email.split("@")[0] : "Admin"}
            </span>
            <img
              src={`https://ui-avatars.com/api/?name=${
                adminInfo?.email ? adminInfo.email.split("@")[0] : "Admin"
              }`}
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
            {/* Top Actions */}
            <div
              className="top-actions"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                margin: "10px 0",
              }}
            >
              <button
                className="new-orders-btn"
                onClick={() => setActiveSection("newOrders")}
                title="View New (Unverified) Orders"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <i className="fas fa-inbox"></i>
                <span>View New Orders</span>
                <span
                  className="badge"
                  style={{
                    background: "#f37254",
                    color: "#fff",
                    borderRadius: "12px",
                    padding: "2px 8px",
                    fontSize: "12px",
                  }}
                >
                  {orders.filter((o) => !o.is_verified).length}
                </span>
              </button>
            </div>
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
                  <div
                    className="zoom-controls"
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    {/* Export Buttons */}
                    <div
                      className="export-buttons"
                      style={{ display: "flex", gap: "8px" }}
                    >
                      <button
                        onClick={exportOrdersToCSV}
                        className="export-btn"
                        style={{
                          backgroundColor: "#28a745",
                          color: "white",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "5px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "13px",
                          fontWeight: "500",
                        }}
                        title="Export to CSV"
                      >
                        <i className="fas fa-file-csv"></i> CSV
                      </button>
                      <button
                        onClick={exportOrdersToPDF}
                        className="export-btn"
                        style={{
                          backgroundColor: "#dc3545",
                          color: "white",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "5px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "13px",
                          fontWeight: "500",
                        }}
                        title="Export to PDF"
                      >
                        <i className="fas fa-file-pdf"></i> PDF
                      </button>
                    </div>

                    {/* Zoom Buttons */}
                    <div
                      style={{
                        display: "flex",
                        gap: "5px",
                        alignItems: "center",
                      }}
                    >
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
                          <th>Order Status</th>
                          <th>Verification</th>
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
                              <select
                                value={order.order_status || "Order Placed"}
                                onChange={(e) =>
                                  handleChangeOrderStatus(
                                    order.id,
                                    e.target.value,
                                    "orders"
                                  )
                                }
                                disabled={updatingStatusIds.includes(order.id)}
                                className="order-status-select"
                                title="Update order status"
                              >
                                {ORDER_STATUS_OPTIONS.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td>
                              {order.is_verified ? (
                                <span className="status-badge status-verified">
                                  Verified
                                  {order.verified_at
                                    ? ` (${new Date(
                                        order.verified_at
                                      ).toLocaleDateString()})`
                                    : ""}
                                </span>
                              ) : (
                                <span className="status-badge status-pending">
                                  Not Verified
                                </span>
                              )}
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
                    </table>
                  </div>
                </div>
              </>
            )}
          </section>
        )}

        {/* New Orders Section */}
        {activeSection === "newOrders" && (
          <section className="admin-section orders-section">
            <div
              className="section-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <h2 style={{ margin: 0 }}>New Orders (Unverified)</h2>
              <div
                className="section-actions"
                style={{ display: "flex", gap: "10px" }}
              >
                <button
                  className="back-to-orders-btn"
                  onClick={() => setActiveSection("orders")}
                  title="Back to All Orders"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <i className="fas fa-arrow-left"></i>
                  <span>Back to Orders</span>
                </button>
              </div>
            </div>

            {loadingNewOrders ? (
              <div className="loading-spinner">
                <p>Loading new orders...</p>
              </div>
            ) : errorNewOrders ? (
              <div className="error-message">
                <p>{errorNewOrders}</p>
              </div>
            ) : newOrders.length === 0 ? (
              <div className="orders-placeholder">
                <p>No new orders found.</p>
                <div className="orders-illustration">
                  <i className="fas fa-inbox fa-3x"></i>
                </div>
              </div>
            ) : (
              <div className="orders-table-container">
                <div
                  className="table-zoom-wrapper"
                  style={{
                    transform: `scale(${zoomLevel / 100})`,
                    transformOrigin: "top left",
                  }}
                >
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
                        <th>Order Status</th>
                        <th>Verification</th>
                        <th>Date & Time</th>
                        <th>Invoice</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newOrders.map((order) => (
                        <tr key={order.id}>
                          <td className="order-number">{order.order_number}</td>
                          <td>{order.customer_name || "N/A"}</td>
                          <td>{order.customer_email || "N/A"}</td>
                          <td>{order.customer_phone || "N/A"}</td>
                          <td
                            style={{ maxWidth: "220px", whiteSpace: "normal" }}
                          >
                            {order.customer_address || "N/A"}
                          </td>
                          <td>
                            <div className="order-items">
                              {Array.isArray(order.order_items) &&
                              order.order_items.length > 0 ? (
                                order.order_items.map((item, idx) => (
                                  <div key={idx} className="item-row">
                                    <div className="item-details">
                                      <span className="item-name">
                                        {item.name || `Item ${idx + 1}`}
                                      </span>
                                      <span className="item-qty">
                                        Qty: {item.quantity || 0}
                                      </span>
                                      <span className="item-price">
                                        ₹
                                        {parseFloat(item.price || 0).toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <span>No items</span>
                              )}
                            </div>
                          </td>
                          <td>{order.order_quantity || 0}</td>
                          <td className="order-total">
                            ₹{parseFloat(order.order_value || 0).toFixed(2)}
                          </td>
                          <td>
                            <select
                              value={order.order_status || "Order Placed"}
                              onChange={(e) =>
                                handleChangeOrderStatus(
                                  order.id,
                                  e.target.value,
                                  "newOrders"
                                )
                              }
                              disabled={updatingStatusIds.includes(order.id)}
                              className="order-status-select"
                              title="Update order status"
                            >
                              {ORDER_STATUS_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            {order.is_verified ? (
                              <span className="status-badge status-verified">
                                Verified
                              </span>
                            ) : (
                              <span className="status-badge status-pending">
                                Not Verified
                              </span>
                            )}
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
                          <td>
                            <button
                              className="verify-btn"
                              onClick={() => handleVerifyOrder(order.id)}
                              title="Mark as Verified"
                            >
                              ✓ Verify
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Customers Section */}
        {activeSection === "customers" && (
          <section className="admin-section settings-section customers-section">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2 style={{ margin: 0 }}>Customers</h2>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={exportCustomersToCSV}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "background-color 0.3s",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#218838")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "#28a745")
                  }
                >
                  <i className="fas fa-file-csv"></i>
                  Export CSV
                </button>
                <button
                  onClick={exportCustomersToPDF}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "background-color 0.3s",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#c82333")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "#dc3545")
                  }
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
                        style={{ cursor: "pointer" }}
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
                            <i className="fas fa-receipt"></i> GST:{" "}
                            {user.gst_number}
                          </span>
                        )}
                        <span className="admin-date">
                          Joined:{" "}
                          {new Date(user.created_at).toLocaleDateString()}
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
            <div className="section-header-with-actions">
              <h2>Products</h2>
              <div className="product-view-toggle">
                <button
                  className={`toggle-btn ${
                    productView === "add" ? "active" : ""
                  }`}
                  onClick={() => setProductView("add")}
                >
                  <i className="fas fa-plus-circle"></i> Add Product
                </button>
                <button
                  className={`toggle-btn ${
                    productView === "list" ? "active" : ""
                  }`}
                  onClick={() => setProductView("list")}
                >
                  <i className="fas fa-list"></i> All Products
                </button>
                <button
                  className={`toggle-btn ${
                    productView === "bestsellers" ? "active" : ""
                  }`}
                  onClick={() => setProductView("bestsellers")}
                >
                  <i className="fas fa-star"></i> Manage Bestsellers
                </button>
              </div>
            </div>

            <div className="add-user-container">
              {/* Add Product Form */}
              {productView === "add" && (
                <div
                  className="settings-card add-user-form"
                  id="product-form-section"
                >
                  <h3>{isEditMode ? "Edit Product" : "Add New Product"}</h3>
                  <p className="settings-description">
                    {isEditMode
                      ? "Update the product information below."
                      : "Create a new product for your store. Fill in the required fields marked with *."}
                  </p>

                  {isEditMode && (
                    <div
                      style={{
                        marginBottom: "15px",
                        padding: "10px",
                        backgroundColor: "#fff3cd",
                        borderRadius: "4px",
                        borderLeft: "4px solid #ffc107",
                      }}
                    >
                      <strong>Editing:</strong> {editingProduct?.name}
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        style={{
                          marginLeft: "15px",
                          padding: "5px 10px",
                          backgroundColor: "#dc3545",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Cancel Edit
                      </button>
                    </div>
                  )}

                  <form
                    className="admin-form product-form"
                    onSubmit={handleCreateProduct}
                  >
                    {/* Required Fields */}
                    <div className="form-group">
                      <label htmlFor="product-name">
                        Product Name *
                        <span className="required-indicator">Required</span>
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#666",
                            marginLeft: "8px",
                          }}
                        >
                          ({productFormData.name?.length || 0}/255)
                        </span>
                      </label>
                      <input
                        type="text"
                        id="product-name"
                        name="name"
                        value={productFormData.name}
                        onChange={handleProductFormChange}
                        placeholder="Enter product name"
                        maxLength={255}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="product-flag">
                        Product Type *
                        <span className="required-indicator">Required</span>
                      </label>
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
                        <label htmlFor="product-price">
                          Price *
                          <span className="required-indicator">Required</span>
                        </label>
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
                        <label htmlFor="product-volume">
                          Volume (ml)
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#666",
                              marginLeft: "8px",
                            }}
                          >
                            ({productFormData.volume_ml?.length || 0}/10)
                          </span>
                        </label>
                        <input
                          type="text"
                          id="product-volume"
                          name="volume_ml"
                          value={productFormData.volume_ml}
                          onChange={handleProductFormChange}
                          placeholder="e.g., 50ml, 100ml"
                          maxLength={10}
                        />
                      </div>
                    </div>

                    {/* Optional Fields */}
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="product-scent">
                          Scent
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#666",
                              marginLeft: "8px",
                            }}
                          >
                            ({productFormData.scent?.length || 0}/100)
                          </span>
                        </label>
                        <input
                          type="text"
                          id="product-scent"
                          name="scent"
                          value={productFormData.scent}
                          onChange={handleProductFormChange}
                          placeholder="e.g., Floral, Woody"
                          maxLength={100}
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
                      <label htmlFor="product-description">
                        Description
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#666",
                            marginLeft: "8px",
                          }}
                        >
                          ({productFormData.Discription?.length || 0}/1000)
                        </span>
                      </label>
                      <textarea
                        id="product-description"
                        name="Discription"
                        value={productFormData.Discription}
                        onChange={handleProductFormChange}
                        placeholder="Enter product description"
                        rows="3"
                        maxLength={1000}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="product-about">
                        About Product
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#666",
                            marginLeft: "8px",
                          }}
                        >
                          ({productFormData.about_product?.length || 0}/2000)
                        </span>
                      </label>
                      <textarea
                        id="product-about"
                        name="about_product"
                        value={productFormData.about_product}
                        onChange={handleProductFormChange}
                        placeholder="Additional information about the product"
                        rows="3"
                        maxLength={2000}
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="product-original-price">
                          Original Price
                        </label>
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
                        <label htmlFor="product-discount">
                          Discount Amount
                        </label>
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
                        <label htmlFor="product-delivery">
                          Delivery Charge
                        </label>
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
                        <label htmlFor="product-quantity">
                          Available Quantity
                        </label>
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

                    <div className="form-group checkbox-group">
                      <label>
                        <input
                          type="checkbox"
                          name="is_bestseller"
                          checked={productFormData.is_bestseller}
                          onChange={handleProductFormChange}
                        />
                        <span>Mark as Bestseller</span>
                      </label>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="product-brand">
                          Brand
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#666",
                              marginLeft: "8px",
                            }}
                          >
                            ({productFormData.brand?.length || 0}/100)
                          </span>
                        </label>
                        <input
                          type="text"
                          id="product-brand"
                          name="brand"
                          value={productFormData.brand}
                          onChange={handleProductFormChange}
                          placeholder="Enter brand name"
                          maxLength={100}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="product-colour">
                          Colour
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#666",
                              marginLeft: "8px",
                            }}
                          >
                            ({productFormData.colour?.length || 0}/50)
                          </span>
                        </label>
                        <input
                          type="text"
                          id="product-colour"
                          name="colour"
                          value={productFormData.colour}
                          onChange={handleProductFormChange}
                          placeholder="Enter colour"
                          maxLength={50}
                        />
                      </div>
                    </div>

                    {/* Multiple Image Upload with Drag & Drop */}
                    <div className="form-group">
                      <label>
                        Product Images *
                        {productFormData.source_table === "freshner_mist" && (
                          <span
                            style={{
                              marginLeft: "10px",
                              fontSize: "12px",
                              color: "#ff9800",
                              fontWeight: "normal",
                            }}
                          >
                            (Legacy: Single image only)
                          </span>
                        )}
                      </label>

                      {/* Helper text with image requirements */}
                      <div
                        style={{
                          background: "#e8f4fd",
                          border: "1px solid #b3d9f2",
                          borderRadius: "5px",
                          padding: "10px",
                          marginBottom: "10px",
                          fontSize: "13px",
                          color: "#0066cc",
                        }}
                      >
                        <strong>📐 Image Requirements:</strong>
                        <ul style={{ margin: "5px 0 0 20px", paddingLeft: 0 }}>
                          <li>
                            Minimum resolution:{" "}
                            <strong>1020 x 1020 pixels</strong>
                          </li>
                          <li>Aspect ratio: 1:1 (square)</li>
                          <li>Format: JPEG, PNG, GIF, WebP</li>
                          <li>Max file size: 5MB per image</li>
                          <li>
                            Multiple images supported (first image will be
                            primary)
                          </li>
                        </ul>
                      </div>

                      {productFormData.source_table === "freshner_mist" && (
                        <div
                          style={{
                            padding: "10px",
                            backgroundColor: "#fff3e0",
                            border: "1px solid #ff9800",
                            borderRadius: "4px",
                            marginBottom: "10px",
                            fontSize: "13px",
                          }}
                        >
                          ℹ️ This is a legacy product. Only single image upload
                          is supported. To use multiple images, please create a
                          new product.
                        </div>
                      )}
                      <div
                        className={`image-upload-container ${
                          dragActive ? "drag-active" : ""
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <input
                          type="file"
                          id="product-images"
                          multiple={
                            productFormData.source_table !== "freshner_mist"
                          }
                          accept="image/*"
                          onChange={handleImageSelect}
                          style={{ display: "none" }}
                        />
                        <label
                          htmlFor="product-images"
                          className="upload-label"
                        >
                          <div className="upload-icon">📁</div>
                          <p>
                            <strong>Drag & drop images here</strong> or click to
                            browse
                          </p>
                          <small>Supported formats: JPG, PNG, GIF, WebP</small>
                        </label>
                      </div>

                      {/* Image Preview Grid */}
                      {productImages.length > 0 && (
                        <div className="image-preview-grid">
                          {productImages.map((img, index) => (
                            <div key={img.id} className="image-preview-item">
                              <img
                                src={img.preview}
                                alt={`Product ${index + 1}`}
                              />
                              <div className="image-preview-overlay">
                                <span className="image-order">
                                  {index === 0 ? "★ " : ""}
                                  {index + 1}
                                </span>
                                <button
                                  type="button"
                                  className="remove-image-btn"
                                  onClick={() => handleRemoveImage(img.id)}
                                  title="Remove image"
                                >
                                  ✕
                                </button>
                              </div>
                              {index !== 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleSetAsPrimary(img.id)}
                                  style={{
                                    position: "absolute",
                                    bottom: "35px",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    backgroundColor: "#4CAF50",
                                    color: "white",
                                    border: "none",
                                    padding: "4px 8px",
                                    borderRadius: "4px",
                                    fontSize: "11px",
                                    cursor: "pointer",
                                    opacity: 0,
                                    transition: "opacity 0.2s",
                                    whiteSpace: "nowrap",
                                    zIndex: 10,
                                  }}
                                  className="set-primary-btn"
                                  title="Set as first image"
                                >
                                  Set as First
                                </button>
                              )}
                              <small className="image-name">{img.name}</small>
                            </div>
                          ))}
                        </div>
                      )}
                      <small
                        style={{
                          display: "block",
                          marginTop: "10px",
                          color: "#666",
                        }}
                      >
                        First image will be the main product image. You can add
                        multiple images.
                      </small>
                    </div>

                    <div className="form-group">
                      <label htmlFor="product-image">
                        Legacy Image Path (Optional)
                      </label>
                      <input
                        type="text"
                        id="product-image"
                        name="image"
                        value={productFormData.image}
                        onChange={handleProductFormChange}
                        placeholder="e.g., products/perfume.jpg (for backward compatibility)"
                        maxLength="255"
                      />
                      <small
                        style={{
                          display: "block",
                          marginTop: "5px",
                          color: "#666",
                        }}
                      >
                        This field is optional if you upload images above.
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
                        <label htmlFor="product-power-source">
                          Power Source
                        </label>
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
                          productFormMessage.startsWith("✓")
                            ? "success"
                            : "error"
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
                      {productFormLoading
                        ? isEditMode
                          ? "Updating..."
                          : "Creating..."
                        : isEditMode
                        ? "Update Product"
                        : "Create Product"}
                    </button>
                  </form>
                </div>
              )}

              {/* Products List */}
              {productView === "list" && (
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
                          <li
                            key={product.id}
                            className="admin-item product-item"
                          >
                            <div className="product-card-layout">
                              {/* Product Image */}
                              <div className="product-card-image">
                                {product.all_images &&
                                product.all_images.length > 0 ? (
                                  <img
                                    src={product.all_images[0].url}
                                    alt={product.name}
                                    onError={(e) => {
                                      e.target.src = "/fallback.jpg";
                                    }}
                                  />
                                ) : (
                                  <div className="no-image-placeholder">
                                    <i className="fas fa-image"></i>
                                    <span>No Image</span>
                                  </div>
                                )}
                                {product.all_images &&
                                  product.all_images.length > 1 && (
                                    <span className="image-count-badge">
                                      <i className="fas fa-images"></i>{" "}
                                      {product.all_images.length}
                                    </span>
                                  )}
                              </div>

                              {/* Product Info */}
                              <div className="product-card-content">
                                <div className="admin-item-header">
                                  <span className="admin-email product-name">
                                    {product.name}
                                  </span>
                                  <div style={{ display: "flex", gap: "5px" }}>
                                    <span
                                      className={`admin-badge ${product.flag}`}
                                    >
                                      {product.flag === "perfume"
                                        ? "Perfume"
                                        : product.flag === "freshner"
                                        ? "Freshner"
                                        : "Face Mist"}
                                    </span>
                                    {product.source_table ===
                                      "freshner_mist" && (
                                      <span
                                        className="admin-badge"
                                        style={{
                                          backgroundColor: "#ff9800",
                                          fontSize: "10px",
                                        }}
                                        title="Old database table - editing disabled. Please recreate this product to enable full editing."
                                      >
                                        Legacy
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="product-details">
                                  <span className="product-info">
                                    <i className="fas fa-tag"></i> Price: ₹
                                    {product.price}
                                  </span>
                                  {product.volume_ml && (
                                    <span className="product-info">
                                      <i className="fas fa-flask"></i>{" "}
                                      {product.volume_ml}
                                    </span>
                                  )}
                                  {product.available_quantity !== null && (
                                    <span className="product-info">
                                      <i className="fas fa-boxes"></i> Stock:{" "}
                                      {product.available_quantity}
                                    </span>
                                  )}
                                </div>

                                {product.scent && (
                                  <span className="product-scent">
                                    <i className="fas fa-leaf"></i>{" "}
                                    {product.scent}
                                  </span>
                                )}

                                <div className="product-bestseller-toggle">
                                  <label className="toggle-label">
                                    <span className="toggle-text">
                                      <i className="fas fa-star"></i> Bestseller
                                    </span>
                                    <div className="toggle-switch">
                                      <input
                                        type="checkbox"
                                        checked={product.is_bestseller || false}
                                        onChange={() =>
                                          handleToggleBestseller(
                                            product.id,
                                            product.is_bestseller
                                          )
                                        }
                                      />
                                      <span className="toggle-slider"></span>
                                    </div>
                                  </label>
                                </div>

                                <div className="product-actions">
                                  <button
                                    className="product-edit-btn"
                                    onClick={() => handleEditProduct(product)}
                                    title={
                                      product.source_table === "freshner_mist"
                                        ? "Edit legacy product (limited features)"
                                        : "Edit product"
                                    }
                                  >
                                    <i className="fas fa-edit"></i> Edit
                                  </button>

                                  <button
                                    className="product-delete-btn"
                                    onClick={() =>
                                      handleDeleteProduct(
                                        product.id,
                                        product.name,
                                        product.source_table
                                      )
                                    }
                                    title="Delete product"
                                  >
                                    <i className="fas fa-trash"></i> Delete
                                  </button>
                                </div>

                                <span className="admin-date">
                                  <i className="fas fa-calendar-alt"></i>{" "}
                                  {new Date(
                                    product.created_at
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {/* Bestseller Management */}
              {productView === "bestsellers" && (
                <div className="settings-card admin-list">
                  <h3>
                    <i className="fas fa-star"></i> Manage Bestsellers
                  </h3>
                  <p className="settings-description">
                    Use the up/down arrows to reorder bestseller products.
                    Position #1 will appear as the featured product on the
                    homepage, and positions #2-5 will appear in the bestseller
                    grid.
                  </p>

                  {bestsellerMessage && (
                    <div
                      className={`form-message ${
                        bestsellerMessage.startsWith("✓") ? "success" : "error"
                      }`}
                      style={{
                        marginBottom: "20px",
                        padding: "15px",
                        borderRadius: "8px",
                        fontSize: "15px",
                        fontWeight: "500",
                        textAlign: "center",
                        animation: "fadeIn 0.3s ease-in",
                      }}
                    >
                      {bestsellerMessage}
                    </div>
                  )}

                  <div className="bestseller-management">
                    {bestsellers.length === 0 ? (
                      <div className="no-bestsellers">
                        <i
                          className="fas fa-star"
                          style={{
                            fontSize: "48px",
                            color: "#ccc",
                            marginBottom: "10px",
                          }}
                        ></i>
                        <p>No bestseller products yet</p>
                        <p style={{ fontSize: "14px", color: "#666" }}>
                          Go to "All Products" and toggle the bestseller switch
                          to add products
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="bestseller-list">
                          {bestsellers.map((product, index) => (
                            <div key={product.id} className="bestseller-item">
                              <div className="bestseller-order-controls">
                                <button
                                  className="order-btn order-btn-up"
                                  onClick={() => handleMoveUp(index)}
                                  disabled={index === 0}
                                  title="Move up"
                                >
                                  <i className="fas fa-chevron-up"></i>
                                </button>
                                <span className="order-number">
                                  #{index + 1}
                                </span>
                                <button
                                  className="order-btn order-btn-down"
                                  onClick={() => handleMoveDown(index)}
                                  disabled={index === bestsellers.length - 1}
                                  title="Move down"
                                >
                                  <i className="fas fa-chevron-down"></i>
                                </button>
                              </div>

                              <div className="bestseller-position">
                                <span
                                  className={`position-badge ${
                                    index === 0
                                      ? "featured"
                                      : index < 5
                                      ? "grid"
                                      : "extra"
                                  }`}
                                >
                                  {index === 0 ? (
                                    <>
                                      <i className="fas fa-crown"></i> Featured
                                    </>
                                  ) : index < 5 ? (
                                    <>
                                      <i className="fas fa-th"></i> Grid #
                                      {index}
                                    </>
                                  ) : (
                                    <>Extra #{index + 1}</>
                                  )}
                                </span>
                              </div>

                              <div className="bestseller-image">
                                {product.all_images &&
                                product.all_images.length > 0 ? (
                                  <img
                                    src={product.all_images[0].url}
                                    alt={product.name}
                                    onError={(e) => {
                                      e.target.src = "/fallback.jpg";
                                    }}
                                  />
                                ) : (
                                  <div className="no-image-small">
                                    <i className="fas fa-image"></i>
                                  </div>
                                )}
                              </div>

                              <div className="bestseller-info">
                                <h4>{product.name}</h4>
                                <div className="bestseller-meta">
                                  <span className="bestseller-price">
                                    <i className="fas fa-tag"></i> ₹
                                    {product.price}
                                  </span>
                                  {product.volume_ml && (
                                    <span className="bestseller-volume">
                                      <i className="fas fa-flask"></i>{" "}
                                      {product.volume_ml}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="bestseller-actions">
                                <button
                                  className="bestseller-remove-btn"
                                  onClick={() =>
                                    handleToggleBestseller(product.id, true)
                                  }
                                  title="Remove from bestsellers"
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="bestseller-save-section">
                          <button
                            className="btn-primary save-order-btn"
                            onClick={saveBestsellerOrder}
                          >
                            <i className="fas fa-save"></i> Save Order
                          </button>
                          <p className="save-hint">
                            <i className="fas fa-info-circle"></i> Remember to
                            save after reordering
                          </p>

                          {/* Message display near save button */}
                          {bestsellerMessage && (
                            <div
                              style={{
                                marginTop: "15px",
                                padding: "12px 20px",
                                borderRadius: "6px",
                                fontSize: "14px",
                                fontWeight: "500",
                                textAlign: "center",
                                backgroundColor: bestsellerMessage.startsWith(
                                  "✓"
                                )
                                  ? "#d4edda"
                                  : "#f8d7da",
                                color: bestsellerMessage.startsWith("✓")
                                  ? "#155724"
                                  : "#721c24",
                                border: `1px solid ${
                                  bestsellerMessage.startsWith("✓")
                                    ? "#c3e6cb"
                                    : "#f5c6cb"
                                }`,
                                animation: "fadeIn 0.3s ease-in",
                              }}
                            >
                              {bestsellerMessage}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
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
                            onClick={() =>
                              handleDeleteAdmin(admin.id, admin.email)
                            }
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

        {/* Enquiries Section */}
        {activeSection === "enquiries" && (
          <section className="admin-section">
            <h2>User Enquiries</h2>

            {/* Tab Navigation */}
            <div className="enquiry-tabs" style={{ marginBottom: "20px" }}>
              <button
                className={
                  userEnquiryTab === "contact" ? "tab-active" : "tab-inactive"
                }
                onClick={() => setUserEnquiryTab("contact")}
                style={{
                  padding: "10px 20px",
                  marginRight: "10px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  backgroundColor:
                    userEnquiryTab === "contact" ? "#232946" : "#e9ecef",
                  color: userEnquiryTab === "contact" ? "#fff" : "#232946",
                  fontWeight: userEnquiryTab === "contact" ? "bold" : "normal",
                }}
              >
                <i className="fas fa-hotel"></i> Hotel Amenities Contact (
                {contactMeta.total || 0})
              </button>
              <button
                className={
                  userEnquiryTab === "perfume" ? "tab-active" : "tab-inactive"
                }
                onClick={() => setUserEnquiryTab("perfume")}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  backgroundColor:
                    userEnquiryTab === "perfume" ? "#232946" : "#e9ecef",
                  color: userEnquiryTab === "perfume" ? "#fff" : "#232946",
                  fontWeight: userEnquiryTab === "perfume" ? "bold" : "normal",
                }}
              >
                <i className="fas fa-calendar-check"></i> Perfume Bar Bookings (
                {perfumeMeta.total || 0})
              </button>
            </div>

            {/* Filters */}
            <div
              className="enquiry-filters"
              style={{
                marginBottom: "20px",
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                placeholder="Search by name, email, mobile..."
                value={enquiryFilters.q}
                onChange={(e) => updateEnquiryFilter("q", e.target.value)}
                style={{
                  flex: "1",
                  minWidth: "200px",
                  padding: "8px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
              <input
                type="date"
                value={enquiryFilters.start_date}
                onChange={(e) =>
                  updateEnquiryFilter("start_date", e.target.value)
                }
                style={{
                  padding: "8px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
              <input
                type="date"
                value={enquiryFilters.end_date}
                onChange={(e) =>
                  updateEnquiryFilter("end_date", e.target.value)
                }
                style={{
                  padding: "8px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />

              {/* Export Buttons */}
              <div style={{ display: "flex", gap: "8px", marginLeft: "auto" }}>
                <button
                  onClick={
                    userEnquiryTab === "contact"
                      ? exportContactEnquiriesToCSV
                      : exportPerfumeBookingsToCSV
                  }
                  style={{
                    padding: "8px 16px",
                    borderRadius: "5px",
                    border: "none",
                    backgroundColor: "#28a745",
                    color: "white",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                  title="Export to CSV"
                >
                  <i className="fas fa-file-csv"></i> CSV
                </button>
                <button
                  onClick={
                    userEnquiryTab === "contact"
                      ? exportContactEnquiriesToPDF
                      : exportPerfumeBookingsToPDF
                  }
                  style={{
                    padding: "8px 16px",
                    borderRadius: "5px",
                    border: "none",
                    backgroundColor: "#dc3545",
                    color: "white",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                  title="Export to PDF"
                >
                  <i className="fas fa-file-pdf"></i> PDF
                </button>
              </div>
            </div>

            {/* Contact Enquiries Tab */}
            {userEnquiryTab === "contact" && (
              <div>
                {contactLoading ? (
                  <div className="loading-spinner">
                    <p>Loading contact enquiries...</p>
                  </div>
                ) : contactError ? (
                  <div className="error-message">
                    <p>{contactError}</p>
                  </div>
                ) : contactEnquiries.length === 0 ? (
                  <p
                    style={{
                      textAlign: "center",
                      color: "#666",
                      padding: "20px",
                    }}
                  >
                    No contact enquiries found.
                  </p>
                ) : (
                  <>
                    <div className="enquiries-grid">
                      {contactEnquiries.map((contact) => (
                        <div key={contact.id} className="enquiry-card">
                          <div className="enquiry-header">
                            <h4>{contact.hotel_name || "N/A"}</h4>
                            <span className="enquiry-date">
                              {new Date(
                                contact.created_at
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="enquiry-body">
                            <p>
                              <strong>📧 Email:</strong> {contact.email}
                            </p>
                            <p>
                              <strong>📱 Mobile:</strong> {contact.mobile}
                            </p>
                            <p>
                              <strong>📦 Packaging:</strong>{" "}
                              {contact.packaging_option || "N/A"}
                            </p>
                            <p>
                              <strong>🌸 Fragrance:</strong>{" "}
                              {contact.preferred_fragrance || "N/A"}
                            </p>
                            <p>
                              <strong>📊 Quantity:</strong>{" "}
                              {contact.estimated_quantity || "N/A"}
                            </p>
                            {contact.additional_requirements && (
                              <p>
                                <strong>📝 Requirements:</strong>{" "}
                                {contact.additional_requirements}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {contactMeta.last_page > 1 && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: "20px",
                          gap: "10px",
                        }}
                      >
                        <button
                          onClick={() =>
                            updateEnquiryFilter(
                              "page",
                              contactMeta.current_page - 1
                            )
                          }
                          disabled={contactMeta.current_page === 1}
                          style={{
                            padding: "8px 15px",
                            borderRadius: "5px",
                            border: "1px solid #232946",
                            backgroundColor:
                              contactMeta.current_page === 1
                                ? "#ccc"
                                : "#232946",
                            color: "#fff",
                            cursor:
                              contactMeta.current_page === 1
                                ? "not-allowed"
                                : "pointer",
                          }}
                        >
                          Previous
                        </button>
                        <span>
                          Page {contactMeta.current_page} of{" "}
                          {contactMeta.last_page}
                        </span>
                        <button
                          onClick={() =>
                            updateEnquiryFilter(
                              "page",
                              contactMeta.current_page + 1
                            )
                          }
                          disabled={
                            contactMeta.current_page === contactMeta.last_page
                          }
                          style={{
                            padding: "8px 15px",
                            borderRadius: "5px",
                            border: "1px solid #232946",
                            backgroundColor:
                              contactMeta.current_page === contactMeta.last_page
                                ? "#ccc"
                                : "#232946",
                            color: "#fff",
                            cursor:
                              contactMeta.current_page === contactMeta.last_page
                                ? "not-allowed"
                                : "pointer",
                          }}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Perfume Bookings Tab */}
            {userEnquiryTab === "perfume" && (
              <div>
                {perfumeLoading ? (
                  <div className="loading-spinner">
                    <p>Loading perfume bar bookings...</p>
                  </div>
                ) : perfumeError ? (
                  <div className="error-message">
                    <p>{perfumeError}</p>
                  </div>
                ) : perfumeBookings.length === 0 ? (
                  <p
                    style={{
                      textAlign: "center",
                      color: "#666",
                      padding: "20px",
                    }}
                  >
                    No perfume bar bookings found.
                  </p>
                ) : (
                  <>
                    <div className="enquiries-grid">
                      {perfumeBookings.map((booking) => (
                        <div key={booking.id} className="enquiry-card">
                          <div className="enquiry-header">
                            <h4>{booking.name || "N/A"}</h4>
                            <span className="enquiry-date">
                              {new Date(
                                booking.created_at
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="enquiry-body">
                            <p>
                              <strong>📧 Email:</strong> {booking.email}
                            </p>
                            <p>
                              <strong>📱 Mobile:</strong> {booking.mobile}
                            </p>
                            <p>
                              <strong>📦 Package:</strong>{" "}
                              {booking.package || "N/A"}
                            </p>
                            {booking.message && (
                              <p>
                                <strong>💬 Message:</strong> {booking.message}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {perfumeMeta.last_page > 1 && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: "20px",
                          gap: "10px",
                        }}
                      >
                        <button
                          onClick={() =>
                            updateEnquiryFilter(
                              "page",
                              perfumeMeta.current_page - 1
                            )
                          }
                          disabled={perfumeMeta.current_page === 1}
                          style={{
                            padding: "8px 15px",
                            borderRadius: "5px",
                            border: "1px solid #232946",
                            backgroundColor:
                              perfumeMeta.current_page === 1
                                ? "#ccc"
                                : "#232946",
                            color: "#fff",
                            cursor:
                              perfumeMeta.current_page === 1
                                ? "not-allowed"
                                : "pointer",
                          }}
                        >
                          Previous
                        </button>
                        <span>
                          Page {perfumeMeta.current_page} of{" "}
                          {perfumeMeta.last_page}
                        </span>
                        <button
                          onClick={() =>
                            updateEnquiryFilter(
                              "page",
                              perfumeMeta.current_page + 1
                            )
                          }
                          disabled={
                            perfumeMeta.current_page === perfumeMeta.last_page
                          }
                          style={{
                            padding: "8px 15px",
                            borderRadius: "5px",
                            border: "1px solid #232946",
                            backgroundColor:
                              perfumeMeta.current_page === perfumeMeta.last_page
                                ? "#ccc"
                                : "#232946",
                            color: "#fff",
                            cursor:
                              perfumeMeta.current_page === perfumeMeta.last_page
                                ? "not-allowed"
                                : "pointer",
                          }}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </section>
        )}

        {/* Reviews Section */}
        {activeSection === "reviews" && (
          <section className="admin-section" style={{ padding: 0 }}>
            <AdminReviews />
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

              {/* Settings Navigation Buttons */}
              <div className="settings-card">
                <h3>Manage Content</h3>
                <p className="settings-description">
                  Select a section to manage images and content for your
                  website.
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    marginTop: "20px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    onClick={() => setSettingsView("slider")}
                    style={{
                      flex: 1,
                      minWidth: "150px",
                      padding: "15px 20px",
                      background:
                        settingsView === "slider" ? "#232946" : "#f8f9fa",
                      color: settingsView === "slider" ? "white" : "#232946",
                      border:
                        settingsView === "slider"
                          ? "2px solid #232946"
                          : "2px solid #ddd",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "16px",
                      fontWeight: "600",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <i className="fas fa-images"></i> Sliders
                  </button>
                  {/* <button
                    onClick={() => setSettingsView("ourproducts")}
                    style={{
                      flex: 1,
                      minWidth: "150px",
                      padding: "15px 20px",
                      background: settingsView === "ourproducts" ? "#232946" : "#f8f9fa",
                      color: settingsView === "ourproducts" ? "white" : "#232946",
                      border: settingsView === "ourproducts" ? "2px solid #232946" : "2px solid #ddd",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "16px",
                      fontWeight: "600",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <i className="fas fa-box-open"></i> Our Products
                  </button> */}
                  <button
                    onClick={() => setSettingsView("howitworks")}
                    style={{
                      flex: 1,
                      minWidth: "150px",
                      padding: "15px 20px",
                      background:
                        settingsView === "howitworks" ? "#232946" : "#f8f9fa",
                      color:
                        settingsView === "howitworks" ? "white" : "#232946",
                      border:
                        settingsView === "howitworks"
                          ? "2px solid #232946"
                          : "2px solid #ddd",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "16px",
                      fontWeight: "600",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <i className="fas fa-lightbulb"></i> How It Works
                  </button>
                </div>
              </div>

              {/* Slider Management */}
              {settingsView === "slider" && (
                <div className="settings-card">
                  <h3>Slider Management</h3>
                  <p className="settings-description">
                    Upload and manage slider images for different pages of your
                    website.
                  </p>

                  {/* Upload Form */}
                  <form
                    onSubmit={handleSliderUpload}
                    style={{ marginBottom: "30px" }}
                  >
                    <div className="form-group">
                      <label htmlFor="slider-page">Select Page</label>
                      <select
                        id="slider-page"
                        value={selectedSliderPage}
                        onChange={(e) => setSelectedSliderPage(e.target.value)}
                        style={{
                          padding: "10px",
                          borderRadius: "5px",
                          border: "1px solid #ccc",
                          width: "100%",
                          marginBottom: "15px",
                        }}
                      >
                        <option value="home">Home</option>
                        <option value="products">Products</option>
                        <option value="liveperfume">Live Perfume Bar</option>
                        <option value="hotelamenities">Hotel Amenities</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="slider-upload-input">
                        Upload Slider Image
                      </label>
                      <div
                        style={{
                          background: "#e8f4fd",
                          border: "1px solid #b3d9f2",
                          borderRadius: "5px",
                          padding: "10px",
                          marginBottom: "10px",
                          fontSize: "13px",
                          color: "#0066cc",
                        }}
                      >
                        <strong>📐 Image Requirements:</strong>
                        <ul style={{ margin: "5px 0 0 20px", paddingLeft: 0 }}>
                          <li>
                            Minimum resolution:{" "}
                            <strong>1400 x 450 pixels</strong>
                          </li>
                          <li>
                            Recommended: <strong>1920 x 500 pixels</strong>{" "}
                            (Full HD)
                          </li>
                          <li>Format: JPEG, PNG, WebP</li>
                          <li>Max file size: 5MB</li>
                        </ul>
                      </div>
                      <input
                        type="file"
                        id="slider-upload-input"
                        accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                        onChange={(e) => setSliderUploadFile(e.target.files[0])}
                        style={{
                          padding: "10px",
                          borderRadius: "5px",
                          border: "1px solid #ccc",
                          width: "100%",
                          marginBottom: "15px",
                        }}
                      />
                      {sliderUploadFile && (
                        <p
                          style={{
                            fontSize: "14px",
                            color: "#666",
                            marginTop: "5px",
                          }}
                        >
                          Selected: {sliderUploadFile.name}
                        </p>
                      )}
                    </div>

                    {sliderMessage && (
                      <div
                        className={`form-message ${
                          sliderMessage.startsWith("✓") ? "success" : "error"
                        }`}
                        style={{ marginBottom: "15px" }}
                      >
                        {sliderMessage}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="btn-create-admin"
                      disabled={sliderUploadLoading || !sliderUploadFile}
                      style={{
                        opacity:
                          sliderUploadLoading || !sliderUploadFile ? 0.6 : 1,
                        cursor:
                          sliderUploadLoading || !sliderUploadFile
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      {sliderUploadLoading ? "Uploading..." : "Upload Slider"}
                    </button>
                  </form>

                  {/* Sliders List */}
                  <div className="sliders-list">
                    <h4>Existing Sliders</h4>
                    {slidersLoading ? (
                      <p>Loading sliders...</p>
                    ) : (
                      <div>
                        {[
                          "home",
                          "products",
                          "liveperfume",
                          "hotelamenities",
                        ].map((page) => {
                          const pageSliders = allSliders.filter(
                            (s) => s.page === page
                          );

                          return (
                            <div key={page} style={{ marginBottom: "30px" }}>
                              <h5
                                style={{
                                  textTransform: "capitalize",
                                  marginBottom: "15px",
                                  color: "#232946",
                                }}
                              >
                                {page === "liveperfume"
                                  ? "Live Perfume Bar"
                                  : page === "hotelamenities"
                                  ? "Hotel Amenities"
                                  : page.charAt(0).toUpperCase() +
                                    page.slice(1)}{" "}
                                ({pageSliders.length})
                              </h5>
                              {pageSliders.length === 0 ? (
                                <p
                                  style={{
                                    color: "#999",
                                    fontStyle: "italic",
                                    padding: "10px",
                                    background: "#f9f9f9",
                                    borderRadius: "5px",
                                  }}
                                >
                                  No sliders uploaded yet. Use the form above to
                                  add sliders for this page.
                                </p>
                              ) : (
                                <div
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                      "repeat(auto-fill, minmax(200px, 1fr))",
                                    gap: "15px",
                                  }}
                                >
                                  {pageSliders.map((slider, index) => (
                                    <div
                                      key={slider.id}
                                      style={{
                                        border: "1px solid #ddd",
                                        borderRadius: "8px",
                                        overflow: "hidden",
                                        position: "relative",
                                      }}
                                    >
                                      <img
                                        src={slider.image_url}
                                        alt={`Slider ${slider.id}`}
                                        style={{
                                          width: "100%",
                                          height: "150px",
                                          objectFit: "cover",
                                        }}
                                      />
                                      <button
                                        onClick={() =>
                                          handleDeleteSlider(
                                            slider.id,
                                            slider.page
                                          )
                                        }
                                        style={{
                                          position: "absolute",
                                          top: "5px",
                                          right: "5px",
                                          background: "rgba(220, 53, 69, 0.9)",
                                          color: "white",
                                          border: "none",
                                          borderRadius: "5px",
                                          padding: "5px 10px",
                                          cursor: "pointer",
                                          fontSize: "12px",
                                        }}
                                      >
                                        <i className="fas fa-trash"></i> Delete
                                      </button>
                                      <div
                                        style={{
                                          padding: "10px",
                                          background: "#f8f9fa",
                                          fontSize: "12px",
                                          color: "#666",
                                          display: "flex",
                                          justifyContent: "space-between",
                                          alignItems: "center",
                                        }}
                                      >
                                        <span>Order: {slider.order + 1}</span>
                                        <div
                                          style={{
                                            display: "flex",
                                            gap: "5px",
                                          }}
                                        >
                                          <button
                                            onClick={() =>
                                              handleReorderSlider(
                                                page,
                                                index,
                                                "up"
                                              )
                                            }
                                            disabled={index === 0}
                                            style={{
                                              background:
                                                index === 0
                                                  ? "#ccc"
                                                  : "#007bff",
                                              color: "white",
                                              border: "none",
                                              borderRadius: "3px",
                                              padding: "3px 8px",
                                              cursor:
                                                index === 0
                                                  ? "not-allowed"
                                                  : "pointer",
                                              fontSize: "12px",
                                            }}
                                            title="Move up"
                                          >
                                            <i className="fas fa-arrow-up"></i>
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleReorderSlider(
                                                page,
                                                index,
                                                "down"
                                              )
                                            }
                                            disabled={
                                              index === pageSliders.length - 1
                                            }
                                            style={{
                                              background:
                                                index === pageSliders.length - 1
                                                  ? "#ccc"
                                                  : "#007bff",
                                              color: "white",
                                              border: "none",
                                              borderRadius: "3px",
                                              padding: "3px 8px",
                                              cursor:
                                                index === pageSliders.length - 1
                                                  ? "not-allowed"
                                                  : "pointer",
                                              fontSize: "12px",
                                            }}
                                            title="Move down"
                                          >
                                            <i className="fas fa-arrow-down"></i>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Our Products (Uproducts) Management */}
              {settingsView === "ourproducts" && (
                <div className="settings-card">
                  <h3>Our Products Section (Homepage)</h3>
                  <p className="settings-description">
                    Upload and manage product images displayed in the "Our
                    Products" section on the homepage.
                  </p>

                  {/* Upload Form */}
                  <form
                    onSubmit={handleUproductUpload}
                    style={{ marginBottom: "30px" }}
                  >
                    {isEditingUproduct && (
                      <div
                        style={{
                          background: "#fff3cd",
                          padding: "10px",
                          borderRadius: "5px",
                          marginBottom: "15px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ color: "#856404" }}>
                          <i className="fas fa-edit"></i> Editing product (ID:{" "}
                          {editingUproductId})...
                        </span>
                        <button
                          type="button"
                          onClick={handleCancelEditUproduct}
                          style={{
                            background: "#856404",
                            color: "white",
                            border: "none",
                            borderRadius: "3px",
                            padding: "5px 10px",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                        >
                          Cancel Edit
                        </button>
                      </div>
                    )}

                    <div className="form-group">
                      <label htmlFor="uproduct-image">
                        Main Image{" "}
                        {isEditingUproduct
                          ? "(Optional - leave empty to keep current)"
                          : "*"}
                      </label>
                      <div
                        style={{
                          background: "#e8f4fd",
                          border: "1px solid #b3d9f2",
                          borderRadius: "5px",
                          padding: "10px",
                          marginBottom: "10px",
                          fontSize: "13px",
                          color: "#0066cc",
                        }}
                      >
                        <strong>📐 Image Requirements:</strong>
                        <ul style={{ margin: "5px 0 0 20px", paddingLeft: 0 }}>
                          <li>
                            Minimum resolution:{" "}
                            <strong>350 x 450 pixels</strong>
                          </li>
                          <li>Aspect ratio: 7:9 (portrait)</li>
                          <li>Format: JPEG, PNG, WebP</li>
                          <li>Max file size: 5MB</li>
                          <li>Both images should have same dimensions</li>
                        </ul>
                      </div>
                      <input
                        type="file"
                        id="uproduct-image-input"
                        accept="image/*"
                        onChange={(e) =>
                          setUproductImageFile(e.target.files[0])
                        }
                        style={{
                          width: "100%",
                          padding: "10px",
                          border: "1px solid #ddd",
                          borderRadius: "5px",
                          marginBottom: "15px",
                        }}
                      />
                      {uproductImageFile && (
                        <p
                          style={{
                            fontSize: "14px",
                            color: "#666",
                            marginTop: "5px",
                          }}
                        >
                          Selected: {uproductImageFile.name}
                        </p>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="uproduct-hover-image">
                        Hover Image (Optional)
                      </label>
                      <input
                        type="file"
                        id="uproduct-hover-image-input"
                        accept="image/*"
                        onChange={(e) =>
                          setUproductHoverImageFile(e.target.files[0])
                        }
                        style={{
                          width: "100%",
                          padding: "10px",
                          border: "1px solid #ddd",
                          borderRadius: "5px",
                          marginBottom: "15px",
                        }}
                      />
                      {uproductHoverImageFile && (
                        <p
                          style={{
                            fontSize: "14px",
                            color: "#666",
                            marginTop: "5px",
                          }}
                        >
                          Selected: {uproductHoverImageFile.name}
                        </p>
                      )}
                    </div>

                    {uproductMessage && (
                      <div
                        className={`form-message ${
                          uproductMessage.startsWith("✓") ? "success" : "error"
                        }`}
                        style={{ marginBottom: "15px" }}
                      >
                        {uproductMessage}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="btn-create-admin"
                      disabled={
                        uproductUploadLoading ||
                        (!isEditingUproduct && !uproductImageFile)
                      }
                      style={{
                        opacity:
                          uproductUploadLoading ||
                          (!isEditingUproduct && !uproductImageFile)
                            ? 0.6
                            : 1,
                        cursor:
                          uproductUploadLoading ||
                          (!isEditingUproduct && !uproductImageFile)
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      {uproductUploadLoading
                        ? "Saving..."
                        : isEditingUproduct
                        ? "Update Product"
                        : "Upload Product Image"}
                    </button>
                  </form>

                  {/* Display Uploaded Uproducts */}
                  <div>
                    <h4
                      style={{
                        marginTop: "30px",
                        marginBottom: "15px",
                        color: "#232946",
                      }}
                    >
                      Uploaded Product Images ({uproducts.length})
                    </h4>
                    {uproductsLoading ? (
                      <p style={{ color: "#999", fontStyle: "italic" }}>
                        Loading...
                      </p>
                    ) : uproducts.length === 0 ? (
                      <p
                        style={{
                          color: "#999",
                          fontStyle: "italic",
                          padding: "10px",
                          background: "#f9f9f9",
                          borderRadius: "5px",
                        }}
                      >
                        No product images uploaded yet. Use the form above to
                        add images.
                      </p>
                    ) : (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fill, minmax(200px, 1fr))",
                          gap: "15px",
                        }}
                      >
                        {uproducts.map((uproduct) => (
                          <div
                            key={uproduct.id}
                            style={{
                              border: "1px solid #ddd",
                              borderRadius: "8px",
                              overflow: "hidden",
                              position: "relative",
                            }}
                          >
                            <div
                              style={{ position: "relative", height: "150px" }}
                            >
                              <img
                                src={uproduct.image_url}
                                alt="Main"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                }}
                              />
                              {uproduct.hover_image_url && (
                                <img
                                  src={uproduct.hover_image_url}
                                  alt="Hover"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    opacity: 0,
                                    transition: "opacity 0.3s ease",
                                  }}
                                  onMouseEnter={(e) =>
                                    (e.target.style.opacity = 1)
                                  }
                                  onMouseLeave={(e) =>
                                    (e.target.style.opacity = 0)
                                  }
                                />
                              )}
                            </div>
                            <div
                              style={{
                                padding: "10px 15px",
                                background: "#f8f9fa",
                                display: "flex",
                                gap: "10px",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <span style={{ fontSize: "12px", color: "#666" }}>
                                ID: {uproduct.id}
                              </span>
                              <div style={{ display: "flex", gap: "5px" }}>
                                <button
                                  onClick={() => handleEditUproduct(uproduct)}
                                  style={{
                                    background: "#007bff",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    padding: "5px 10px",
                                    cursor: "pointer",
                                    fontSize: "12px",
                                  }}
                                >
                                  <i className="fas fa-edit"></i> Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteUproduct(uproduct.id)
                                  }
                                  style={{
                                    background: "#dc3545",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    padding: "5px 10px",
                                    cursor: "pointer",
                                    fontSize: "12px",
                                  }}
                                >
                                  <i className="fas fa-trash"></i> Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* How It Works Management */}
              {settingsView === "howitworks" && (
                <div className="settings-card">
                  <h3>How It Works (Live Perfume Page)</h3>
                  <p className="settings-description">
                    Manage the "How It Works" section items displayed on the
                    Live Perfume Bar page.
                  </p>

                  {/* Form */}
                  <form
                    onSubmit={handleHowItWorksSubmit}
                    style={{ marginBottom: "30px" }}
                  >
                    {isEditingHowItWorks && (
                      <div
                        style={{
                          background: "#fff3cd",
                          padding: "10px",
                          borderRadius: "5px",
                          marginBottom: "15px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ color: "#856404" }}>
                          <i className="fas fa-edit"></i> Editing item...
                        </span>
                        <button
                          type="button"
                          onClick={handleCancelEditHowItWorks}
                          style={{
                            background: "#856404",
                            color: "white",
                            border: "none",
                            borderRadius: "3px",
                            padding: "5px 10px",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                        >
                          Cancel Edit
                        </button>
                      </div>
                    )}

                    <div className="form-group">
                      <label htmlFor="how-it-works-title">Title *</label>
                      <input
                        type="text"
                        id="how-it-works-title"
                        value={howItWorksFormData.title}
                        onChange={(e) =>
                          setHowItWorksFormData({
                            ...howItWorksFormData,
                            title: e.target.value,
                          })
                        }
                        placeholder="e.g., Step 1: Choose Your Scent"
                        style={{
                          width: "100%",
                          padding: "10px",
                          border: "1px solid #ddd",
                          borderRadius: "5px",
                          marginBottom: "15px",
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="how-it-works-subtitle">
                        Description *
                      </label>
                      <textarea
                        id="how-it-works-subtitle"
                        value={howItWorksFormData.subtitle}
                        onChange={(e) =>
                          setHowItWorksFormData({
                            ...howItWorksFormData,
                            subtitle: e.target.value,
                          })
                        }
                        placeholder="Enter detailed description..."
                        rows="4"
                        style={{
                          width: "100%",
                          padding: "10px",
                          border: "1px solid #ddd",
                          borderRadius: "5px",
                          marginBottom: "15px",
                          resize: "vertical",
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="how-it-works-image">
                        Image{" "}
                        {isEditingHowItWorks
                          ? "(Optional - leave empty to keep current)"
                          : "*"}
                      </label>

                      {/* Helper text with image requirements */}
                      <div
                        style={{
                          background: "#e8f4fd",
                          border: "1px solid #b3d9f2",
                          borderRadius: "5px",
                          padding: "10px",
                          marginBottom: "10px",
                          fontSize: "13px",
                          color: "#0066cc",
                        }}
                      >
                        <strong>📐 Image Requirements:</strong>
                        <ul style={{ margin: "5px 0 0 20px", paddingLeft: 0 }}>
                          <li>
                            Minimum resolution:{" "}
                            <strong>350 x 400 pixels</strong>
                          </li>
                          <li>Aspect ratio: 7:8 (portrait)</li>
                          <li>Format: JPEG, PNG, WebP</li>
                          <li>Max file size: 5MB</li>
                          <li>
                            Image will be displayed in "How It Works" section
                          </li>
                        </ul>
                      </div>

                      <input
                        type="file"
                        id="how-it-works-image-input"
                        accept="image/*"
                        onChange={(e) =>
                          setHowItWorksFormData({
                            ...howItWorksFormData,
                            image: e.target.files[0],
                          })
                        }
                        style={{
                          width: "100%",
                          padding: "10px",
                          border: "1px solid #ddd",
                          borderRadius: "5px",
                          marginBottom: "15px",
                        }}
                      />
                      {howItWorksFormData.image && (
                        <p
                          style={{
                            fontSize: "14px",
                            color: "#666",
                            marginTop: "5px",
                          }}
                        >
                          Selected: {howItWorksFormData.image.name}
                        </p>
                      )}
                    </div>

                    {howItWorksMessage && (
                      <div
                        className={`form-message ${
                          howItWorksMessage.startsWith("✓")
                            ? "success"
                            : "error"
                        }`}
                        style={{ marginBottom: "15px" }}
                      >
                        {howItWorksMessage}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="btn-create-admin"
                      disabled={howItWorksUploadLoading}
                      style={{
                        opacity: howItWorksUploadLoading ? 0.6 : 1,
                        cursor: howItWorksUploadLoading
                          ? "not-allowed"
                          : "pointer",
                      }}
                    >
                      {howItWorksUploadLoading
                        ? "Saving..."
                        : isEditingHowItWorks
                        ? "Update Item"
                        : "Create Item"}
                    </button>
                  </form>

                  {/* Display How It Works Items */}
                  <div>
                    <h4
                      style={{
                        marginTop: "30px",
                        marginBottom: "15px",
                        color: "#232946",
                      }}
                    >
                      Existing Items ({howItWorks.length})
                    </h4>
                    {howItWorksLoading ? (
                      <p style={{ color: "#999", fontStyle: "italic" }}>
                        Loading...
                      </p>
                    ) : howItWorks.length === 0 ? (
                      <p
                        style={{
                          color: "#999",
                          fontStyle: "italic",
                          padding: "10px",
                          background: "#f9f9f9",
                          borderRadius: "5px",
                        }}
                      >
                        No items created yet. Use the form above to add items.
                      </p>
                    ) : (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fill, minmax(250px, 1fr))",
                          gap: "15px",
                        }}
                      >
                        {howItWorks.map((item) => (
                          <div
                            key={item.id}
                            style={{
                              border: "1px solid #ddd",
                              borderRadius: "8px",
                              overflow: "hidden",
                              position: "relative",
                            }}
                          >
                            <img
                              src={item.image_url}
                              alt={item.title}
                              style={{
                                width: "100%",
                                height: "150px",
                                objectFit: "cover",
                              }}
                            />
                            <div style={{ padding: "15px" }}>
                              <h5
                                style={{
                                  margin: "0 0 10px 0",
                                  color: "#232946",
                                }}
                              >
                                {item.title}
                              </h5>
                              <p
                                style={{
                                  fontSize: "13px",
                                  color: "#666",
                                  margin: 0,
                                  lineHeight: "1.5",
                                }}
                              >
                                {item.subtitle.substring(0, 100)}
                                {item.subtitle.length > 100 && "..."}
                              </p>
                            </div>
                            <div
                              style={{
                                padding: "10px 15px",
                                background: "#f8f9fa",
                                display: "flex",
                                gap: "10px",
                              }}
                            >
                              <button
                                onClick={() => handleEditHowItWorks(item)}
                                style={{
                                  flex: 1,
                                  background: "#007bff",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "5px",
                                  padding: "8px",
                                  cursor: "pointer",
                                  fontSize: "12px",
                                }}
                              >
                                <i className="fas fa-edit"></i> Edit
                              </button>
                              <button
                                onClick={() => handleDeleteHowItWorks(item.id)}
                                style={{
                                  flex: 1,
                                  background: "#dc3545",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "5px",
                                  padding: "8px",
                                  cursor: "pointer",
                                  fontSize: "12px",
                                }}
                              >
                                <i className="fas fa-trash"></i> Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Careers Section */}
        {activeSection === "careers" && (
          <section className="admin-section" style={{ padding: 0 }}>
            <AdminCareer />
          </section>
        )}

        {/* Analytics Section */}
        {activeSection === "analytics" && (
          <section className="admin-section" style={{ padding: 0 }}>
            <Analytics />
          </section>
        )}

        {/* User Detail Modal */}
        {showUserModal && selectedUser && (
          <div className="modal-overlay" onClick={closeUserModal}>
            <div
              className="modal-content user-detail-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Customer Details</h2>
                <button className="modal-close" onClick={closeUserModal}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="user-detail-section">
                  <h3>
                    <i className="fas fa-user"></i> Personal Information
                  </h3>
                  <div className="detail-row">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">
                      {selectedUser.name || "N/A"}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{selectedUser.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Mobile:</span>
                    <span className="detail-value">
                      {selectedUser.mobile || "N/A"}
                    </span>
                  </div>
                  {selectedUser.gst_number && (
                    <div className="detail-row">
                      <span className="detail-label">GST Number:</span>
                      <span className="detail-value">
                        {selectedUser.gst_number}
                      </span>
                    </div>
                  )}
                </div>

                <div className="user-detail-section">
                  <h3>
                    <i className="fas fa-map-marker-alt"></i> Address
                    Information
                  </h3>
                  {selectedUser.address && (
                    <div className="detail-row">
                      <span className="detail-label">Address:</span>
                      <span className="detail-value">
                        {selectedUser.address}
                      </span>
                    </div>
                  )}
                  {selectedUser.address1 && (
                    <div className="detail-row">
                      <span className="detail-label">Address Line 1:</span>
                      <span className="detail-value">
                        {selectedUser.address1}
                      </span>
                    </div>
                  )}
                  {selectedUser.address2 && (
                    <div className="detail-row">
                      <span className="detail-label">Address Line 2:</span>
                      <span className="detail-value">
                        {selectedUser.address2}
                      </span>
                    </div>
                  )}
                  {selectedUser.address3 && (
                    <div className="detail-row">
                      <span className="detail-label">Address Line 3:</span>
                      <span className="detail-value">
                        {selectedUser.address3}
                      </span>
                    </div>
                  )}
                  {selectedUser.address4 && (
                    <div className="detail-row">
                      <span className="detail-label">Address Line 4:</span>
                      <span className="detail-value">
                        {selectedUser.address4}
                      </span>
                    </div>
                  )}
                  {selectedUser.address5 && (
                    <div className="detail-row">
                      <span className="detail-label">Address Line 5:</span>
                      <span className="detail-value">
                        {selectedUser.address5}
                      </span>
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
                  {!selectedUser.address &&
                    !selectedUser.address1 &&
                    !selectedUser.city &&
                    !selectedUser.pin && (
                      <p className="no-data">
                        No address information available
                      </p>
                    )}
                </div>

                <div className="user-detail-section">
                  <h3>
                    <i className="fas fa-calendar"></i> Account Information
                  </h3>
                  <div className="detail-row">
                    <span className="detail-label">Customer ID:</span>
                    <span className="detail-value">#{selectedUser.id}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Joined Date:</span>
                    <span className="detail-value">
                      {new Date(selectedUser.created_at).toLocaleDateString(
                        "en-IN",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
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
