import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { API_ENDPOINTS, getImageUrl } from "../config/api";
import "../styles/BlogEditor.css";
import "../styles/Blog.css"; // For preview to match blog detail page exactly

// Register custom font sizes with Quill
const Size = Quill.import("formats/size");
Size.whitelist = [
  "10px",
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "28px",
  "32px",
  "36px",
];
Quill.register(Size, true);

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
  const [showPreview, setShowPreview] = useState(false);

  // Reference to Quill editor instance
  const quillRef = React.useRef(null);

  // State for image resize modal
  const [resizeModalOpen, setResizeModalOpen] = useState(false);
  const [resizeTarget, setResizeTarget] = useState(null);
  const [resizeWidth, setResizeWidth] = useState("");

  // Handle double-click on images to open resize modal
  useEffect(() => {
    const handleImageDoubleClick = (e) => {
      const target = e.target;
      if (target.tagName === "IMG" && target.closest(".ql-editor")) {
        e.preventDefault();
        setResizeTarget(target);
        setResizeWidth(target.offsetWidth.toString());
        setResizeModalOpen(true);
      }
    };

    document.addEventListener("dblclick", handleImageDoubleClick);
    return () =>
      document.removeEventListener("dblclick", handleImageDoubleClick);
  }, []);

  // Apply size and close modal
  const applyResize = (width) => {
    if (!resizeTarget) {
      console.log("No resize target");
      return;
    }

    const imageSrc = resizeTarget.getAttribute("src");
    console.log("Applying resize:", width, "to image:", imageSrc);

    // Get the Quill editor
    const quill = quillRef.current?.getEditor?.();
    if (!quill) {
      console.log("Quill editor not found");
      return;
    }

    // Get current HTML content
    let currentContent = quill.root.innerHTML;

    // Calculate the width value (Quill preserves width attribute but strips style)
    const widthAttr = width === "100%" ? "100%" : width;

    // Find and replace the image with updated width attribute
    const escapedSrc = imageSrc.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Match the img tag and capture parts
    const imgRegex = new RegExp(
      `(<img[^>]*src="${escapedSrc}"[^>]*?)(?:\\s+width="[^"]*")?([^>]*>)`,
      "gi"
    );

    const updatedContent = currentContent.replace(
      imgRegex,
      (match, before, after) => {
        // Remove any existing width attribute from the captured parts
        const cleanBefore = before.replace(/\s+width="[^"]*"/gi, "");
        const cleanAfter = after.replace(/\s+width="[^"]*"/gi, "");
        return `${cleanBefore} width="${widthAttr}"${cleanAfter}`;
      }
    );

    console.log("Updated content with width attribute");

    // Update the form data content which will trigger React re-render with new content
    setFormData((prev) => ({ ...prev, content: updatedContent }));

    setResizeModalOpen(false);
    setResizeTarget(null);
  };

  const closeResizeModal = () => {
    setResizeModalOpen(false);
    setResizeTarget(null);
  };

  const applyAlignment = (alignment) => {
    if (!resizeTarget) return;

    const quill = quillRef.current?.getEditor?.();
    if (!quill) return;

    const imageSrc = resizeTarget.getAttribute("src");
    let currentContent = quill.root.innerHTML;
    const escapedSrc = imageSrc.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Find the image and wrap it in aligned paragraph
    const imgRegex = new RegExp(`<img[^>]*src="${escapedSrc}"[^>]*>`, "gi");

    const updatedContent = currentContent.replace(imgRegex, (match) => {
      // Wrap image in paragraph with text-align
      return `<p style="text-align: ${alignment};">${match}</p>`;
    });

    setFormData((prev) => ({ ...prev, content: updatedContent }));
    setResizeModalOpen(false);
    setResizeTarget(null);
  };

  // Image upload handler for Quill editor
  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const uploadFormData = new FormData();
        uploadFormData.append("image", file);

        try {
          const token = localStorage.getItem("adminToken");
          const response = await axios.post(
            API_ENDPOINTS.ADMIN_BLOG_UPLOAD_IMAGE,
            uploadFormData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );

          const imageUrl = response.data.url;

          // Get Quill editor instance
          const quill = quillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection(true);
            // Insert image at cursor position with default width
            quill.insertEmbed(range.index, "image", imageUrl);

            // Add custom attributes to allow resizing
            setTimeout(() => {
              const editor = quill.root;
              const images = editor.querySelectorAll("img");
              const lastImage = images[images.length - 1];
              if (lastImage && lastImage.src === imageUrl) {
                lastImage.style.width = "400px";
                lastImage.style.maxWidth = "100%";
                lastImage.style.height = "auto";
                lastImage.setAttribute("contenteditable", "false");
                lastImage.setAttribute("draggable", "true");
              }
            }, 100);

            // Move cursor after the image
            quill.setSelection(range.index + 1);
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          alert("Failed to upload image");
        }
      }
    };
  };

  // Quill editor modules configuration
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [
            {
              size: [
                "10px",
                "12px",
                "14px",
                "16px",
                "18px",
                "20px",
                "24px",
                "28px",
                "32px",
                "36px",
              ],
            },
          ],
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
        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  );

  const formats = useMemo(
    () => [
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
    ],
    []
  );

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
        const blog = blogs.find((b) => b.id === parseInt(id));

        if (blog) {
          setFormData({
            title: blog.title,
            author: blog.author || "",
            category: blog.category,
            content: blog.content || "",
            is_draft: blog.is_draft,
            is_draft: blog.is_draft,
            image_file: null,
            remove_image: false,
          });

          // Populate category inputs from blog's categories relationship
          if (blog.categories && blog.categories.length > 0) {
            const categoryInputsFromBlog = blog.categories.map(
              (cat, index) => ({
                id: index + 1,
                value: cat.name,
              })
            );
            setCategoryInputs(categoryInputsFromBlog);
          } else {
            setCategoryInputs([{ id: 1, value: blog.category || "" }]);
          }

          setImagePreview(blog.image ? getImageUrl(blog.image) : null);
          // Add listeners to images after loading content
          setTimeout(addImageInteractionListeners, 500);
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

  // State for image overlay button
  const [imgOverlay, setImgOverlay] = useState({
    visible: false,
    top: 0,
    left: 0,
    target: null,
  });

  const addImageInteractionListeners = () => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const editorRoot = quill.root;

    // Double click to open resize modal
    editorRoot.addEventListener("dblclick", (e) => {
      if (e.target.tagName === "IMG") {
        setResizeTarget(e.target);
        setResizeWidth(e.target.getAttribute("width") || e.target.width || "");
        setResizeModalOpen(true);
        setImgOverlay((prev) => ({ ...prev, visible: false })); // Hide overlay when modal opens
      }
    });

    // Hover to show remove button
    editorRoot.addEventListener("mouseover", (e) => {
      if (e.target.tagName === "IMG") {
        const img = e.target;
        const editorContainer = document.querySelector(".editor-with-resize");
        if (!editorContainer) return;

        const editorRect = editorContainer.getBoundingClientRect();
        const imgRect = img.getBoundingClientRect();

        setImgOverlay({
          visible: true,
          top: imgRect.top - editorRect.top,
          left: imgRect.left - editorRect.left + imgRect.width - 30, // 30px offset for button
          target: img,
        });
      }
    });
  };

  // Re-attach listeners when content changes
  useEffect(() => {
    const timer = setTimeout(addImageInteractionListeners, 1000);
    return () => clearTimeout(timer);
  }, [id, formData.content]);

  const handleOverlayRemove = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (imgOverlay.target) {
      const target = imgOverlay.target;
      if (
        target.parentElement &&
        target.parentElement.tagName === "P" &&
        (target.parentElement.style.textAlign ||
          target.parentElement.className.includes("ql-align-"))
      ) {
        target.parentElement.remove();
      } else {
        target.remove();
      }

      if (quillRef.current) {
        const editor = quillRef.current.getEditor();
        setFormData((prev) => ({ ...prev, content: editor.root.innerHTML }));
      }

      setImgOverlay({ visible: false, top: 0, left: 0, target: null });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = function () {
        // Enforce width between 800px and 1600px
        if (this.width < 800 || this.width > 1600) {
          alert(
            `Invalid image width. Please upload an image between 800px and 1600px wide.\nCurrent width: ${this.width}px`
          );
          // Clear the file input
          e.target.value = "";
          URL.revokeObjectURL(objectUrl);
          return;
        }

        // Valid image
        setFormData((prev) => ({
          ...prev,
          image_file: file,
          remove_image: false,
        }));
        setImagePreview(objectUrl);
      };

      img.onerror = function () {
        alert("Invalid image file.");
        e.target.value = "";
        URL.revokeObjectURL(objectUrl);
      };

      img.src = objectUrl;
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({
      ...prev,
      image_file: null,
      remove_image: true,
    }));
    // Reset file input if exists
    const fileInput = document.getElementById("image-upload");
    if (fileInput) fileInput.value = "";
  };

  /* Function to remove the image from content */
  const handleRemoveContentImage = () => {
    if (resizeTarget) {
      // If the image is wrapped in a p tag (alignment), remove the wrapper
      if (
        resizeTarget.parentElement &&
        resizeTarget.parentElement.tagName === "P" &&
        (resizeTarget.parentElement.style.textAlign ||
          resizeTarget.parentElement.className.includes("ql-align-"))
      ) {
        resizeTarget.parentElement.remove();
      } else {
        // Otherwise just remove the image
        resizeTarget.remove();
      }

      // Update the editor content state to reflect the removal
      if (quillRef.current) {
        const editor = quillRef.current.getEditor();
        const newContent = editor.root.innerHTML;
        setFormData((prev) => ({ ...prev, content: newContent }));
      }

      setResizeModalOpen(false);
      setResizeTarget(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("adminToken");

      // First, ensure all category names exist in the database and collect their IDs
      const categoryIds = [];

      // Fetch latest categories first to ensure we have up-to-date list
      const categoriesResponse = await axios.get(
        API_ENDPOINTS.ADMIN_BLOG_CATEGORIES,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const latestCategories = categoriesResponse.data.success
        ? categoriesResponse.data.data
        : [];

      for (const catInput of categoryInputs) {
        const categoryName = catInput.value.trim();
        if (categoryName === "") continue;

        // Check if category already exists
        const existingCat = latestCategories.find(
          (c) => c.name.toLowerCase() === categoryName.toLowerCase()
        );

        if (existingCat) {
          // Use existing category ID
          categoryIds.push(existingCat.id);
        } else {
          // Create new category
          try {
            const response = await axios.post(
              API_ENDPOINTS.ADMIN_BLOG_CATEGORIES,
              { name: categoryName },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            categoryIds.push(response.data.data.id);
          } catch (error) {
            console.error("Error creating category:", error);
            // If creation fails, skip this category
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
      if (formData.remove_image) {
        data.append("remove_image", "true");
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
                    const newInputs = categoryInputs.filter(
                      (_, i) => i !== index
                    );
                    setCategoryInputs(newInputs);
                    if (index === 0 && newInputs.length > 0) {
                      setFormData({
                        ...formData,
                        category: newInputs[0].value,
                      });
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
            <div className="image-upload-controls">
              <label htmlFor="image-upload" className="image-upload-label">
                {imagePreview ? "Change Image" : "Upload Image"}
              </label>
              {imagePreview && (
                <button
                  type="button"
                  className="btn-remove-image-text"
                  onClick={handleRemoveImage}
                >
                  Remove Image
                </button>
              )}
            </div>
            <p className="image-upload-hint">Required width: 800px - 1600px</p>
            {imagePreview && (
              <div className="image-preview-container">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="image-preview"
                />
              </div>
            )}
          </div>
        </div>

        <div className="form-group content-editor">
          <label>Blog Content *</label>
          <div className="editor-with-resize">
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={formData.content}
              onChange={handleContentChange}
              modules={modules}
              formats={formats}
              placeholder="Start writing your blog content here..."
            />
            {/* Overlay Remove Button */}
            {imgOverlay.visible && imgOverlay.target && (
              <button
                type="button"
                className="btn-content-image-overlay-remove"
                style={{
                  top: `${imgOverlay.top}px`,
                  left: `${imgOverlay.left}px`,
                }}
                onClick={handleOverlayRemove}
                title="Remove Image"
                onMouseEnter={() =>
                  setImgOverlay((prev) => ({ ...prev, visible: true }))
                }
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Image Resize Modal */}
        {resizeModalOpen && (
          <div
            className="image-resize-modal-overlay"
            onClick={closeResizeModal}
          >
            <div
              className="image-resize-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Resize Image</h3>
              <p className="modal-hint">Double-click any image to resize it</p>

              {/* Image Preview */}
              {resizeTarget && (
                <div className="image-preview-modal">
                  <div
                    className="image-container-relative"
                    style={{ position: "relative", display: "inline-block" }}
                  >
                    <img
                      src={resizeTarget.getAttribute("src")}
                      alt="Preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "150px",
                        objectFit: "contain",
                        borderRadius: "8px",
                        border: "1px solid #e0e0e0",
                      }}
                    />
                    <button
                      type="button"
                      className="btn-remove-content-image-overlay"
                      onClick={handleRemoveContentImage}
                      title="Remove Image"
                    >
                      ×
                    </button>
                  </div>
                  <p className="current-size">
                    Current width: {resizeTarget.offsetWidth}px
                  </p>
                </div>
              )}

              <div className="size-presets">
                <button type="button" onClick={() => applyResize("150")}>
                  Small (150px)
                </button>
                <button type="button" onClick={() => applyResize("300")}>
                  Medium (300px)
                </button>
                <button type="button" onClick={() => applyResize("500")}>
                  Large (500px)
                </button>
                <button type="button" onClick={() => applyResize("100%")}>
                  Full Width
                </button>
              </div>

              <div className="custom-size">
                <label>Custom Width:</label>
                <div className="custom-size-input">
                  <input
                    type="number"
                    value={resizeWidth}
                    onChange={(e) => setResizeWidth(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && applyResize(resizeWidth)
                    }
                    min="50"
                    max="2000"
                    autoFocus
                  />
                  <span>px</span>
                  <button
                    type="button"
                    onClick={() => applyResize(resizeWidth)}
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="alignment-options">
                <label>Alignment:</label>
                <div className="alignment-buttons">
                  <button type="button" onClick={() => applyAlignment("left")}>
                    ⬅ Left
                  </button>
                  <button
                    type="button"
                    onClick={() => applyAlignment("center")}
                  >
                    ⬛ Center
                  </button>
                  <button type="button" onClick={() => applyAlignment("right")}>
                    Right ➡
                  </button>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-close"
                  onClick={closeResizeModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

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
            <button
              type="button"
              className="btn-preview"
              onClick={() => setShowPreview(true)}
            >
              Preview
            </button>
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? "Saving..." : id ? "Update Blog" : "Publish Blog"}
            </button>
          </div>
        </div>
      </form>

      {/* Blog Preview Modal - Exact match to Blog Detail Page */}
      {showPreview && (
        <div
          className="blog-preview-overlay"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="blog-preview-wrapper"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="preview-toolbar">
              <span>Preview Mode</span>
              <button
                type="button"
                className="btn-close-preview"
                onClick={() => setShowPreview(false)}
              >
                ✕ Close Preview
              </button>
            </div>

            {/* Exact Blog Detail Page Structure */}
            <div className="blog-page preview-blog-page">
              <div className="blog-detail">
                {imagePreview && (
                  <div className="blog-detail-image-wrapper">
                    <img
                      src={imagePreview}
                      alt="Featured"
                      className="blog-detail-image"
                    />
                  </div>
                )}
                <div className="blog-detail-header">
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      justifyContent: "center",
                      marginBottom: "8px",
                      color: "#8C3F45",
                      textTransform: "uppercase",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      letterSpacing: "1px",
                    }}
                  >
                    {categoryInputs.filter((c) => c.value).length > 0
                      ? categoryInputs
                          .filter((c) => c.value)
                          .map((c) => c.value)
                          .join(", ")
                      : "Category"}
                  </div>
                  <h1
                    className="blog-detail-title"
                    dangerouslySetInnerHTML={{
                      __html: formData.title || "Blog Title",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "12px",
                      marginTop: "12px",
                    }}
                  >
                    {formData.author && (
                      <p
                        className="blog-author"
                        style={{ fontSize: "1.05rem", margin: 0 }}
                      >
                        By {formData.author}
                      </p>
                    )}
                    {formData.author && (
                      <span style={{ color: "#ccc" }}>•</span>
                    )}
                    <div
                      className="blog-date"
                      style={{ fontSize: "0.95rem", color: "#666" }}
                    >
                      {new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>
                <div className="blog-detail-body">
                  <div className="blog-detail-content">
                    {formData.content ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: formData.content }}
                      />
                    ) : (
                      <p>Blog content will appear here...</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogEditor;
