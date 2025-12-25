import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS, getImageUrl } from "../config/api";
import { getBlogUrl } from "../utils/urlHelpers";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "../styles/Blog.css";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);

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
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.BLOGS);
      if (response.data.success) {
        setBlogs(response.data.data.data); // data.data because of pagination wrapper often used
      } else {
        // Fallback if pagination is not used or structure differs
        setBlogs(response.data.data || []);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Failed to load blogs.");
      setLoading(false);
    }
  };

  /* Removed handleReadMore and handleBackToList as we now navigate to a new page */

  return (
    <>
      <Navbar />
      <div className="blog-page">
        <div className="blog-header">
          <h1>Our Blog</h1>
          <p>Discover stories, tips, and trends from the world of perfumes.</p>
        </div>

        {loading ? (
          <div className="blog-grid">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="skeleton-card">
                <div className="skeleton skeleton-image"></div>
                <div className="skeleton skeleton-text"></div>
                <div
                  className="skeleton skeleton-text"
                  style={{ width: "60%" }}
                ></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : blogs.length === 0 ? (
          <div className="no-blogs">No blogs found.</div>
        ) : (
          <div className="blog-grid">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                to={getBlogUrl(blog.id, blog.title)}
                className="blog-card"
                style={{
                  cursor: "pointer",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div className="blog-image-container">
                  <img
                    src={getImageUrl(blog.image)}
                    alt={blog.title}
                    className="blog-card-image"
                  />
                </div>
                <div className="blog-card-content">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "8px",
                      padding: 0,
                    }}
                  >
                    <h2
                      className="blog-title"
                      style={{ flex: 1 }}
                      dangerouslySetInnerHTML={{ __html: blog.title }}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "6px",
                        justifyContent: "flex-end",
                      }}
                    >
                      {blog.categories && blog.categories.length > 0 ? (
                        blog.categories.map((cat, index) => {
                          const colors = getCategoryColor(index);
                          return (
                            <span
                              key={cat.id}
                              className="blog-category"
                              style={{
                                background: colors.bg,
                                color: colors.color,
                                border: `1px solid ${colors.border}`,
                              }}
                            >
                              {cat.name}
                            </span>
                          );
                        })
                      ) : (
                        <span className="blog-category">{blog.category}</span>
                      )}
                    </div>
                  </div>
                  <p className="blog-excerpt">
                    {blog.content
                      ? blog.content.replace(/<[^>]+>/g, "").substring(0, 150) +
                        "..."
                      : "Read more to discover the full story."}
                  </p>
                  {blog.author && (
                    <p className="blog-author">By {blog.author}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Blog;
