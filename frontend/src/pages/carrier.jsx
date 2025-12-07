import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "../styles/carrier.css";

const Carrier = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState("all");
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
  const [coverLetterType, setCoverLetterType] = useState("text"); // "text" or "file"
  const [formLoading, setFormLoading] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  // Fetch active jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.CAREERS);
        if (response.data.success) {
          setJobs(response.data.jobs);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs based on job type
  const filteredJobs =
    filterType === "all"
      ? jobs
      : jobs.filter((job) => job.job_type === filterType);

  // Handle job card click
  const handleJobClick = (job) => {
    setSelectedJob(job);
    setShowModal(true);
    setShowApplicationForm(false);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedJob(null);
    setShowApplicationForm(false);
    setFormMessage("");
    setCoverLetterType("text");
    setFormData({
      name: "",
      email: "",
      phone: "",
      cover_letter_text: "",
      cover_letter_file: null,
      resume: null,
    });
  };

  // Scroll to job section
  const scrollToJobs = () => {
    document.getElementById("job-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

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
      submitData.append("job_vacancy_id", selectedJob.id);
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
        const coverLetterFileInput = document.getElementById("cover-letter-file-input");
        if (coverLetterFileInput) coverLetterFileInput.value = "";

        // Hide modal after 3 seconds
        setTimeout(() => {
          closeModal();
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

  return (
    <>
      <Navbar />

      {/* Section 1: Header */}
      <div className="carrier-header">
        <h5 className="carrier-subtitle">Find the career of your dreams</h5>
        <h2 className="carrier-title">
          We're more than just a workplace.
          <br />
          We're a Family.
        </h2>
        <p className="carrier-description">
          We know that finding a meaningful and rewarding job can be a long
          journey. Our goal is to make that process as easy as possible for you,
          and to create a work environment that's satisfying – one where you'll
          look forward to coming to every day. Start your journey with us by
          browsing available jobs.
        </p>
        <button className="carrier-button" onClick={scrollToJobs}>
          View Opening
        </button>
      </div>

      {/* Section 2: Job Listings */}
      <div className="job-section" id="job-section">
        <div className="job-header">
          <div className="job-left">
            <h2 className="job-title">join us</h2>
            <p className="job-subtitle">Current opening</p>
          </div>
          <div className="job-filter">
            <label htmlFor="job-filter">Filter</label>
            <select
              id="job-filter"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>
        </div>

        <div className="job-info">
          <span>Job Title</span>
          <span className="job-count">{filteredJobs.length} jobs</span>
        </div>

        {loading ? (
          <div className="job-loading">
            <div className="spinner"></div>
            <p>Loading opportunities...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="no-jobs-message">
            <i className="fas fa-briefcase"></i>
            <p>No job openings available at the moment.</p>
          </div>
        ) : (
          <div className="job-grid">
            {filteredJobs.map((job) => (
              <div
                className="job-card"
                key={job.id}
                onClick={() => handleJobClick(job)}
                style={{ cursor: "pointer" }}
              >
                <p className="job-time">
                  {job.job_type.charAt(0).toUpperCase() +
                    job.job_type.slice(1).replace("-", " ")}
                </p>
                <h4 className="job-position">{job.title}</h4>
                <p className="job-location">
                  <i className="fas fa-map-marker-alt"></i> {job.location}
                </p>
                {job.experience_required && (
                  <p className="job-experience">
                    <i className="fas fa-briefcase"></i>{" "}
                    {job.experience_required}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Job Details Modal */}
      {showModal && selectedJob && (
        <div className="job-modal-overlay" onClick={closeModal}>
          <div
            className="job-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="job-modal-close" onClick={closeModal}>
              <i className="fas fa-times"></i>
            </button>

            <div className="job-modal-header">
              <h2>{selectedJob.title}</h2>
              <div className="job-modal-meta">
                <span>
                  <i className="fas fa-map-marker-alt"></i>{" "}
                  {selectedJob.location}
                </span>
                <span>
                  <i className="fas fa-clock"></i>{" "}
                  {selectedJob.job_type.charAt(0).toUpperCase() +
                    selectedJob.job_type.slice(1).replace("-", " ")}
                </span>
                {selectedJob.experience_required && (
                  <span>
                    <i className="fas fa-briefcase"></i>{" "}
                    {selectedJob.experience_required}
                  </span>
                )}
              </div>
            </div>

            <div className="job-modal-body">
              {!showApplicationForm ? (
                <>
                  <div className="job-modal-section">
                    <h3>Job Description</h3>
                    <p>{selectedJob.description}</p>
                  </div>

                  {selectedJob.qualifications && (
                    <div className="job-modal-section">
                      <h3>Qualifications</h3>
                      <p>{selectedJob.qualifications}</p>
                    </div>
                  )}

                  {selectedJob.responsibilities && (
                    <div className="job-modal-section">
                      <h3>Responsibilities</h3>
                      <p>{selectedJob.responsibilities}</p>
                    </div>
                  )}

                  <div className="job-modal-footer">
                    <button
                      className="btn-apply-modal"
                      onClick={() => setShowApplicationForm(true)}
                    >
                      Apply Now
                    </button>
                  </div>
                </>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="application-form-carrier"
                >
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
                      <label className={`radio-option ${coverLetterType === "text" ? "active" : ""}`}>
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
                      <label className={`radio-option ${coverLetterType === "file" ? "active" : ""}`}>
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
                        formMessage.includes("successfully")
                          ? "success"
                          : "error"
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
                          <i className="fas fa-spinner fa-spin"></i>{" "}
                          Submitting...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane"></i> Submit
                          Application
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Carrier;
