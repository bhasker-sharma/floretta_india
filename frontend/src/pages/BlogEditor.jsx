import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { API_ENDPOINTS, getImageUrl } from "../config/api";
import "../styles/BlogEditor.css";

const BlogEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get blog ID from URL if editing
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    content: "",
    is_draft: false,
    image_file: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryInputs, setCategoryInputs] = useState([{ id: 1, value: "" }]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Quill editor modules configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "list",
    "indent",
    "align",
    "blockquote",
    "code-block",
    "link",
    "image",
    "video",
  ];

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchBlog();
    }
  }, [id]);

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

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(API_ENDPOINTS.ADMIN_BLOGS, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const blogs = response.data.data.data || response.data.data;
        const blog = blogs.find(b => b.id === parseInt(id));

        if (blog) {
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
        }
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
      alert("Failed to load blog");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleContentChange = (value) => {
    setFormData({ ...formData, content: value });
  };

  const handleTitleChange = (value) => {
    setFormData({ ...formData, title: value });
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
    setSaving(true);

    try {
      const token = localStorage.getItem("adminToken");

      // First, ensure all category names exist in the database and collect their IDs
      const categoryIds = [];

      for (const catInput of categoryInputs) {
        const categoryName = catInput.value.trim();
        if (categoryName === "") continue;

        try {
          const response = await axios.post(
            API_ENDPOINTS.ADMIN_BLOG_CATEGORIES,
            { name: categoryName },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          categoryIds.push(response.data.data.id);
        } catch (error) {
          if (error.response?.status === 422) {
            const existingCat = categories.find(
              (c) => c.name.toLowerCase() === categoryName.toLowerCase()
            );
            if (existingCat) {
              categoryIds.push(existingCat.id);
            }
          }
        }
      }

      const data = new FormData();
      data.append("title", formData.title);
      data.append("author", formData.author || "");
      data.append("category", formData.category);
      data.append("content", formData.content);
      data.append("is_draft", formData.is_draft ? "1" : "0");
      if (formData.image_file) {
        data.append("image_file", formData.image_file);
      }

      categoryIds.forEach((catId, index) => {
        data.append(`category_ids[${index}]`, catId);
      });

      if (id) {
        await axios.post(API_ENDPOINTS.ADMIN_BLOG_UPDATE(id), data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Blog updated successfully!");
      } else {
        await axios.post(API_ENDPOINTS.ADMIN_BLOGS, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Blog created successfully!");
      }

      navigate("/admin/blogs");
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("Failed to save blog");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="blog-editor-loading">
        <div className="spinner"></div>
        <p>Loading blog...</p>
      </div>
    );
  }

  return (
    <div className="blog-editor-container">
      <div className="blog-editor-header">
        <h1>{id ? "Edit Blog" : "Create New Blog"}</h1>
        <button
          type="button"
          className="btn-back"
          onClick={() => navigate("/admin/blogs")}
        >
          ← Back to Blogs
        </button>
      </div>

      <form onSubmit={handleSubmit} className="blog-editor-form">
        <div className="form-group">
          <label>Title *</label>
          <ReactQuill
            theme="snow"
            value={formData.title}
            onChange={handleTitleChange}
            modules={{
              toolbar: [
                ["bold", "italic", "underline"],
                [{ color: [] }],
                ["clean"],
              ],
            }}
            formats={["bold", "italic", "underline", "color"]}
            placeholder="Enter blog title"
            className="title-editor"
          />
        </div>

        <div className="form-group">
          <label>Author</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            placeholder="Enter author name (optional)"
          />
        </div>

        <div className="form-group">
          <label>Categories *</label>
          {categoryInputs.map((input, index) => (
            <div key={input.id} className="category-input-row">
              <input
                type="text"
                value={input.value}
                onChange={(e) => {
                  const newInputs = [...categoryInputs];
                  newInputs[index].value = e.target.value;
                  setCategoryInputs(newInputs);
                  if (index === 0) {
                    setFormData({ ...formData, category: e.target.value });
                  }
                }}
                placeholder="Enter category name"
                required={index === 0}
              />
              <button
                type="button"
                className="btn-add-category"
                onClick={() => {
                  setCategoryInputs([
                    ...categoryInputs,
                    { id: Date.now(), value: "" },
                  ]);
                }}
              >
                + Add
              </button>
              {categoryInputs.length > 1 && (
                <button
                  type="button"
                  className="btn-remove-category"
                  onClick={() => {
                    const newInputs = categoryInputs.filter((_, i) => i !== index);
                    setCategoryInputs(newInputs);
                    if (index === 0 && newInputs.length > 0) {
                      setFormData({ ...formData, category: newInputs[0].value });
                    }
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="form-group">
          <label>Featured Image</label>
          <div className="image-upload-container">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              id="image-upload"
            />
            <label htmlFor="image-upload" className="image-upload-label">
              {imagePreview ? "Change Image" : "Upload Image"}
            </label>
            {imagePreview && (
              <div className="image-preview-container">
                <img src={imagePreview} alt="Preview" className="image-preview" />
              </div>
            )}
          </div>
        </div>

        <div className="form-group content-editor">
          <label>Blog Content *</label>
          <ReactQuill
            theme="snow"
            value={formData.content}
            onChange={handleContentChange}
            modules={modules}
            formats={formats}
            placeholder="Start writing your blog content here..."
          />
        </div>

        <div className="form-actions-bottom">
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_draft"
                checked={formData.is_draft}
                onChange={handleInputChange}
              />
              <span>Save as Draft</span>
            </label>
          </div>

          <div className="action-buttons">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/admin/blogs")}
            >
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? "Saving..." : id ? "Update Blog" : "Publish Blog"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BlogEditor;
