import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS, getImageUrl } from "../config/api";
import { getItemBySlug } from "../utils/urlHelpers";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "../styles/Blog.css";

const BlogDetail = () => {
  const { slug } = useParams(); // changed from id to slug
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categoryColors = [
    { bg: "#e3f2fd", color: "#1976d2", border: "#bbdefb" },
    { bg: "#f3e5f5", color: "#7b1fa2", border: "#e1bee7" },
    { bg: "#e8f5e9", color: "#388e3c", border: "#c8e6c9" },
    { bg: "#fff3e0", color: "#f57c00", border: "#ffe0b2" },
    { bg: "#fce4ec", color: "#c2185b", border: "#f8bbd0" },
    { bg: "#e0f2f1", color: "#00796b", border: "#b2dfdb" },
  ];

  const getCategoryColor = (index) => {
    return categoryColors[index % categoryColors.length];
  };

  useEffect(() => {
    fetchBlog();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all blogs to find the one matching the slug
      const response = await axios.get(API_ENDPOINTS.BLOGS);

      let blogList = [];
      if (response.data.success) {
        blogList = response.data.data.data || [];
      } else {
        blogList = response.data.data || [];
      }

      if (blogList.length > 0) {
        const foundBlog = getItemBySlug(blogList, slug, "title");

        if (foundBlog) {
          setBlog(foundBlog);
        } else {
          setError("Blog not found.");
        }
      } else {
        setError("Blog not found.");
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching blog:", err);
      setError("Failed to load blog.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="blog-page">
          <div className="blog-loading">
            <div className="spinner"></div>
            <p>Loading article...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !blog) {
    return (
      <>
        <Navbar />
        <div className="blog-page">
          <div className="error-message">
            {error || "Blog not found"}
            <button className="back-btn" onClick={() => navigate("/blogs")}>
              Back to Blogs
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="blog-page">
        <div className="blog-detail-arrow-wrapper">
          <button className="back-arrow" onClick={() => navigate("/blogs")}>
            <i className="fas fa-arrow-left"></i>
          </button>
        </div>

        <div className="blog-detail">
          {blog.image && (
            <div className="blog-detail-image-wrapper">
              <img
                src={getImageUrl(blog.image)}
                alt={blog.title}
                className="blog-detail-image"
              />
            </div>
          )}
          <div
            className="blog-detail-header"
            style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                justifyContent: "center",
                marginBottom: "16px",
                color: "#8C3F45", // Using specific brand/theme color or a generic one
                textTransform: "uppercase",
                fontSize: "0.75rem",
                fontWeight: "600",
                letterSpacing: "1px",
              }}
            >
              {blog.categories && blog.categories.length > 0
                ? blog.categories.map((cat) => cat.name).join(", ")
                : blog.category}
            </div>

            <h1
              className="blog-detail-title"
              dangerouslySetInnerHTML={{ __html: blog.title }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                marginTop: "12px",
                flexWrap: "wrap",
              }}
            >
              {blog.author && (
                <p
                  className="blog-author"
                  style={{ fontSize: "1.05rem", margin: 0 }}
                >
                  By {blog.author}
                </p>
              )}
              {blog.author && <span style={{ color: "#ccc" }}>•</span>}
              <div
                className="blog-date"
                style={{ fontSize: "0.95rem", color: "#666" }}
              >
                {new Date(blog.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
          <div className="blog-detail-body">
            <div className="blog-detail-content">
              {blog.content ? (
                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
              ) : (
                <p>No content available for this blog.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogDetail;
