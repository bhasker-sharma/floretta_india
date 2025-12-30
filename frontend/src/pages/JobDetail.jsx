import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "../styles/carrier.css";

const JobDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cover_letter_text: "",
    cover_letter_file: null,
    resume: null,
  });
  const [coverLetterType, setCoverLetterType] = useState("text");
  const [formLoading, setFormLoading] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  // Create slug from job title
  const createSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.CAREERS);
        if (response.data.success) {
          // Try to find job by ID from location state first
          let selectedJob;
          if (location.state?.jobId) {
            selectedJob = response.data.jobs.find(
              (j) => j.id === location.state.jobId
            );
          }

          // If not found, try to find by matching slug
          if (!selectedJob) {
            selectedJob = response.data.jobs.find(
              (j) => createSlug(j.title) === slug
            );
          }

          if (selectedJob) {
            setJob(selectedJob);
          } else {
            navigate("/carrier");
          }
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
        navigate("/carrier");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [slug, location.state, navigate]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input
  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        e.target.value = "";
        return;
      }
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Only PDF, DOC, and DOCX files are allowed");
        e.target.value = "";
        return;
      }

      if (fileType === "resume") {
        setFormData({ ...formData, resume: file });
      } else if (fileType === "cover_letter") {
        setFormData({ ...formData, cover_letter_file: file });
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormMessage("");

    try {
      const submitData = new FormData();
      submitData.append("job_vacancy_id", job.id);
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("phone", formData.phone);

      // Add cover letter based on type
      if (coverLetterType === "text" && formData.cover_letter_text) {
        submitData.append("cover_letter_text", formData.cover_letter_text);
      } else if (coverLetterType === "file" && formData.cover_letter_file) {
        submitData.append("cover_letter_file", formData.cover_letter_file);
      }

      submitData.append("resume", formData.resume);

      const response = await axios.post(
        API_ENDPOINTS.CAREER_APPLY,
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setFormMessage(response.data.message);
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          cover_letter_text: "",
          cover_letter_file: null,
          resume: null,
        });
        setCoverLetterType("text");
        document.getElementById("resume-input").value = "";
        const coverLetterFileInput = document.getElementById(
          "cover-letter-file-input"
        );
        if (coverLetterFileInput) coverLetterFileInput.value = "";

        // Navigate back to career page after 3 seconds
        setTimeout(() => {
          navigate("/carrier");
        }, 3000);
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      const errorMsg =
        error.response?.data?.error ||
        "Failed to submit application. Please try again.";
      setFormMessage(errorMsg);
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="job-detail-loading">
          <div className="spinner"></div>
          <p>Loading job details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!job) {
    return (
      <>
        <Navbar />
        <div className="job-not-found">
          <h2>Job not found</h2>
          <button onClick={() => navigate("/carrier")}>
            Back to Careers
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="job-detail-page">
        <div className="job-detail-container">
          <button className="btn-back-to-careers" onClick={() => navigate("/carrier")}>
            <i className="fas fa-arrow-left"></i> Back to Careers
          </button>

          <div className="job-detail-header">
            <h1>{job.title}</h1>
            <div className="job-detail-meta">
              <span>
                <i className="fas fa-map-marker-alt"></i> {job.location}
              </span>
              <span>
                <i className="fas fa-clock"></i>{" "}
                {job.job_type.charAt(0).toUpperCase() +
                  job.job_type.slice(1).replace("-", " ")}
              </span>
              {job.experience_required && (
                <span>
                  <i className="fas fa-briefcase"></i>{" "}
                  {job.experience_required}
                </span>
              )}
            </div>
          </div>

          <div className="job-detail-content">
            {!showApplicationForm ? (
              <>
                <div className="job-detail-section">
                  <h3>Job Description</h3>
                  <p>{job.description}</p>
                </div>

                {job.qualifications && (
                  <div className="job-detail-section">
                    <h3>Qualifications</h3>
                    <p>{job.qualifications}</p>
                  </div>
                )}

                {job.responsibilities && (
                  <div className="job-detail-section">
                    <h3>Responsibilities</h3>
                    <p>{job.responsibilities}</p>
                  </div>
                )}

                <div className="job-detail-footer">
                  <button
                    className="btn-apply-job"
                    onClick={() => setShowApplicationForm(true)}
                  >
                    Apply Now
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="application-form-carrier">
                <h3 style={{ marginBottom: "20px", color: "#a33d3d" }}>
                  Application Form
                </h3>

                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Cover Letter</label>
                  <div className="cover-letter-options">
                    <label
                      className={`radio-option ${
                        coverLetterType === "text" ? "active" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        value="text"
                        checked={coverLetterType === "text"}
                        onChange={(e) => setCoverLetterType(e.target.value)}
                      />
                      <span className="radio-label">
                        <i className="fas fa-pen"></i>
                        Write Text
                      </span>
                    </label>
                    <label
                      className={`radio-option ${
                        coverLetterType === "file" ? "active" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        value="file"
                        checked={coverLetterType === "file"}
                        onChange={(e) => setCoverLetterType(e.target.value)}
                      />
                      <span className="radio-label">
                        <i className="fas fa-upload"></i>
                        Upload File
                      </span>
                    </label>
                  </div>

                  {coverLetterType === "text" ? (
                    <textarea
                      id="cover_letter_text"
                      name="cover_letter_text"
                      value={formData.cover_letter_text}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Tell us why you're a great fit for this role..."
                    />
                  ) : (
                    <>
                      <input
                        type="file"
                        id="cover-letter-file-input"
                        name="cover_letter_file"
                        onChange={(e) => handleFileChange(e, "cover_letter")}
                        accept=".pdf,.doc,.docx"
                      />
                      {formData.cover_letter_file && (
                        <p className="file-selected">
                          <i className="fas fa-file"></i>{" "}
                          {formData.cover_letter_file.name}
                        </p>
                      )}
                    </>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="resume">
                    Resume/CV * (PDF, DOC, DOCX - Max 5MB)
                  </label>
                  <input
                    type="file"
                    id="resume-input"
                    name="resume"
                    onChange={(e) => handleFileChange(e, "resume")}
                    accept=".pdf,.doc,.docx"
                    required
                  />
                  {formData.resume && (
                    <p className="file-selected">
                      <i className="fas fa-file"></i> {formData.resume.name}
                    </p>
                  )}
                </div>

                {formMessage && (
                  <div
                    className={`form-message ${
                      formMessage.includes("successfully") ? "success" : "error"
                    }`}
                  >
                    {formMessage}
                  </div>
                )}

                <div className="form-buttons">
                  <button
                    type="button"
                    className="btn-back"
                    onClick={() => setShowApplicationForm(false)}
                  >
                    Back to Details
                  </button>
                  <button
                    type="submit"
                    className="btn-submit-application"
                    disabled={formLoading}
                  >
                    {formLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> Submitting...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i> Submit Application
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default JobDetail;
