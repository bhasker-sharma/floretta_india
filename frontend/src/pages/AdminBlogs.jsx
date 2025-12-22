import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS, getImageUrl } from "../config/api";
import "../styles/Blog.css";

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    content: "",
    is_draft: false,
    image_file: null,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryInputs, setCategoryInputs] = useState([{ id: 1, value: "" }]);

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image_file: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");

      // First, ensure all category names exist in the database and collect their IDs
      const categoryIds = [];

      for (const catInput of categoryInputs) {
        const categoryName = catInput.value.trim();
        if (categoryName === "") continue;

        try {
          // Try to create the category (will fail if it already exists)
          const response = await axios.post(
            API_ENDPOINTS.ADMIN_BLOG_CATEGORIES,
            { name: categoryName },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          categoryIds.push(response.data.data.id);
        } catch (error) {
          // If category already exists (422 error), find it in the categories list
          if (error.response?.status === 422) {
            const existingCat = categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
            if (existingCat) {
              categoryIds.push(existingCat.id);
            }
          } else {
            console.error("Error adding category:", error);
          }
        }
      }

      // Then save the blog
      const data = new FormData();
      data.append("title", formData.title);
      data.append("author", formData.author || "");
      data.append("category", formData.category);
      data.append("content", formData.content);
      data.append("is_draft", formData.is_draft ? "1" : "0");
      if (formData.image_file) {
        data.append("image_file", formData.image_file);
      }

      // Append category IDs as array
      categoryIds.forEach((id, index) => {
        data.append(`category_ids[${index}]`, id);
      });

      if (editingBlog) {
        await axios.post(API_ENDPOINTS.ADMIN_BLOG_UPDATE(editingBlog.id), data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axios.post(API_ENDPOINTS.ADMIN_BLOGS, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      fetchBlogs();
      fetchCategories(); // Refresh categories list
      closeModal();
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("Failed to save blog");
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      author: blog.author || "",
      category: blog.category,
      content: blog.content || "",
      is_draft: blog.is_draft,
      image_file: null,
    });

    // Populate category inputs from blog's categories relationship
    if (blog.categories && blog.categories.length > 0) {
      const categoryInputsFromBlog = blog.categories.map((cat, index) => ({
        id: index + 1,
        value: cat.name,
      }));
      setCategoryInputs(categoryInputsFromBlog);
    } else {
      setCategoryInputs([{ id: 1, value: blog.category || "" }]);
    }

    setImagePreview(blog.image ? getImageUrl(blog.image) : null);
    setShowModal(true);
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

  const closeModal = () => {
    setShowModal(false);
    setEditingBlog(null);
    setFormData({
      title: "",
      author: "",
      category: "",
      content: "",
      is_draft: false,
      image_file: null,
    });
    setCategoryInputs([{ id: 1, value: "" }]);
    setImagePreview(null);
  };


  const handleSearch = (e) => {
    e.preventDefault();
    fetchBlogs();
  };

  return (
    <div className="admin-blogs-container">
      <div className="admin-blogs-header">
        <h1>Manage Blogs</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
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

      {loading ? (
        <div className="loading">Loading blogs...</div>
      ) : (
        <div className="blogs-list">
          {blogs.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "80px 20px",
              background: "white",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)"
            }}>
              <div style={{ fontSize: "4rem", marginBottom: "20px" }}>📝</div>
              <h3 style={{
                fontSize: "1.5rem",
                color: "#333",
                marginBottom: "10px",
                fontWeight: "600"
              }}>No blogs found</h3>
              <p style={{ color: "#666", marginBottom: "30px" }}>
                Get started by creating your first blog post
              </p>
              <button className="btn-primary" onClick={() => setShowModal(true)}>
                Create Your First Blog
              </button>
            </div>
          ) : (
            <div className="admin-blogs-grid">
              {blogs.map((blog) => (
                <div key={blog.id} className="admin-blog-card">
                  <div className="admin-blog-image-container">
                    <img
                      src={getImageUrl(blog.image)}
                      alt={blog.title}
                      className="admin-blog-image"
                    />
                    <span className={`status-badge ${blog.is_draft ? "draft" : "published"}`}>
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
                    <h3 className="admin-blog-title">{blog.title}</h3>
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
                      <button className="btn-edit" onClick={() => handleEdit(blog)}>
                        Edit
                      </button>
                      <button className="btn-toggle" onClick={() => toggleStatus(blog.id)}>
                        {blog.is_draft ? "Publish" : "Draft"}
                      </button>
                      <button className="btn-delete" onClick={() => handleDelete(blog.id)}>
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

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingBlog ? "Edit Blog" : "Add New Blog"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Author</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  placeholder="Optional"
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                {categoryInputs.map((input, index) => (
                  <div key={input.id} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                    <input
                      type="text"
                      value={input.value}
                      onChange={(e) => {
                        const newInputs = [...categoryInputs];
                        newInputs[index].value = e.target.value;
                        setCategoryInputs(newInputs);
                        // Update formData with the first category value
                        if (index === 0) {
                          setFormData({ ...formData, category: e.target.value });
                        }
                      }}
                      placeholder="Enter category name"
                      style={{ flex: 1 }}
                      required={index === 0}
                    />
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => {
                        setCategoryInputs([
                          ...categoryInputs,
                          { id: Date.now(), value: "" },
                        ]);
                      }}
                      style={{ padding: "10px 16px", whiteSpace: "nowrap" }}
                    >
                      + Add
                    </button>
                    {categoryInputs.length > 1 && (
                      <button
                        type="button"
                        className="btn-delete"
                        onClick={() => {
                          const newInputs = categoryInputs.filter((_, i) => i !== index);
                          setCategoryInputs(newInputs);
                          // Update formData if removing the first field
                          if (index === 0 && newInputs.length > 0) {
                            setFormData({ ...formData, category: newInputs[0].value });
                          }
                        }}
                        style={{ padding: "10px 16px" }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label>Content</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows="10"
                />
              </div>

              <div className="form-group">
                <label>Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="image-preview"
                  />
                )}
              </div>

              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="is_draft"
                    checked={formData.is_draft}
                    onChange={handleInputChange}
                  />
                  Save as Draft
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingBlog ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminBlogs;
