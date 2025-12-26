import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS, getImageUrl } from "../config/api";
import "../styles/Blog.css";

const AdminBlogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all"); // all, draft, published

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(API_ENDPOINTS.ADMIN_BLOGS, {
        headers: { Authorization: `Bearer ${token}` },
        params: { q: searchQuery },
      });
      if (response.data.success) {
        setBlogs(response.data.data.data || response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(API_ENDPOINTS.ADMIN_BLOG_CATEGORIES, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleEdit = (blog) => {
    navigate(`/admin/blogs/edit/${blog.id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(API_ENDPOINTS.ADMIN_BLOG_DELETE(id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(
        API_ENDPOINTS.ADMIN_BLOG_STATUS(id),
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchBlogs();
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBlogs();
  };

  // Filter blogs based on status
  const filteredBlogs = blogs.filter((blog) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "draft")
      return blog.is_draft === 1 || blog.is_draft === true;
    if (statusFilter === "published")
      return blog.is_draft === 0 || blog.is_draft === false;
    return true;
  });

  return (
    <div className="admin-blogs-container">
      <div className="admin-blogs-header">
        <h1>Manage Blogs</h1>
        <button
          className="btn-primary"
          onClick={() => navigate("/admin/blogs/new")}
        >
          Add New Blog
        </button>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Status Filter Tabs */}
      <div className="status-filter-tabs">
        <button
          className={`filter-tab ${statusFilter === "all" ? "active" : ""}`}
          onClick={() => setStatusFilter("all")}
        >
          All ({blogs.length})
        </button>
        <button
          className={`filter-tab ${statusFilter === "draft" ? "active" : ""}`}
          onClick={() => setStatusFilter("draft")}
        >
          Draft (
          {blogs.filter((b) => b.is_draft === 1 || b.is_draft === true).length})
        </button>
        <button
          className={`filter-tab ${
            statusFilter === "published" ? "active" : ""
          }`}
          onClick={() => setStatusFilter("published")}
        >
          Published (
          {blogs.filter((b) => b.is_draft === 0 || b.is_draft === false).length}
          )
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading blogs...</div>
      ) : (
        <div className="blogs-list">
          {/* Show count of filtered results */}
          {statusFilter !== "all" && filteredBlogs.length > 0 && (
            <div
              style={{
                marginBottom: "20px",
                padding: "12px 20px",
                background: "#f0f7ff",
                borderRadius: "8px",
                color: "#2563eb",
                fontSize: "0.95rem",
                fontWeight: "500",
              }}
            >
              Showing {filteredBlogs.length} {statusFilter} blog
              {filteredBlogs.length !== 1 ? "s" : ""}
            </div>
          )}
          {filteredBlogs.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "80px 20px",
                background: "white",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              }}
            >
              <div style={{ fontSize: "4rem", marginBottom: "20px" }}>📝</div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  color: "#333",
                  marginBottom: "10px",
                  fontWeight: "600",
                }}
              >
                No blogs found
              </h3>
              <p style={{ color: "#666", marginBottom: "30px" }}>
                Get started by creating your first blog post
              </p>
              <button
                className="btn-primary"
                onClick={() => navigate("/admin/blogs/new")}
              >
                Create Your First Blog
              </button>
            </div>
          ) : (
            <div className="admin-blogs-grid">
              {filteredBlogs.map((blog) => (
                <div key={blog.id} className="admin-blog-card">
                  <div className="admin-blog-image-container">
                    <img
                      src={getImageUrl(blog.image)}
                      alt={blog.title}
                      className="admin-blog-image"
                    />
                    <span
                      className={`status-badge ${
                        blog.is_draft ? "draft" : "published"
                      }`}
                    >
                      {blog.is_draft ? "Draft" : "Published"}
                    </span>
                  </div>
                  <div className="admin-blog-content">
                    <div className="admin-blog-categories">
                      {blog.categories && blog.categories.length > 0 ? (
                        blog.categories.map((cat) => (
                          <span key={cat.id} className="blog-category">
                            {cat.name}
                          </span>
                        ))
                      ) : (
                        <span className="blog-category">{blog.category}</span>
                      )}
                    </div>
                    <h3 className="admin-blog-title">
                      {(() => {
                        const doc = new DOMParser().parseFromString(
                          blog.title,
                          "text/html"
                        );
                        return doc.body.textContent || "";
                      })()}
                    </h3>
                    {blog.author && (
                      <p className="admin-blog-author">By {blog.author}</p>
                    )}
                    <p className="admin-blog-date">
                      {new Date(blog.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <div className="admin-blog-actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(blog)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-toggle"
                        onClick={() => toggleStatus(blog.id)}
                      >
                        {blog.is_draft ? "Publish" : "Draft"}
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(blog.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminBlogs;
