import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import "../styles/AdminCareer.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function AdminCareer() {
  const [careerTab, setCareerTab] = useState("jobs"); // "jobs" or "applications"

  // Jobs state
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobFormData, setJobFormData] = useState({
    id: null,
    title: "",
    description: "",
    location: "",
    job_type: "full-time",
    experience_required: "",
    qualifications: "",
    responsibilities: "",
    is_active: true,
  });
  const [isEditingJob, setIsEditingJob] = useState(false);
  const [jobFormLoading, setJobFormLoading] = useState(false);
  const [jobMessage, setJobMessage] = useState("");

  // Applications state
  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [selectedJobFilter, setSelectedJobFilter] = useState("");

  // File viewer state
  const [fileViewerOpen, setFileViewerOpen] = useState(false);
  const [viewerFileUrl, setViewerFileUrl] = useState("");
  const [viewerFileName, setViewerFileName] = useState("");
  const [viewerFileType, setViewerFileType] = useState(""); // "resume" or "cover_letter"

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      setJobsLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(API_ENDPOINTS.ADMIN_CAREERS, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setJobs(response.data.jobs);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobMessage("✗ Failed to fetch jobs");
      setTimeout(() => setJobMessage(""), 5000);
    } finally {
      setJobsLoading(false);
    }
  };

  // Fetch applications
  const fetchApplications = async (jobId = "") => {
    try {
      setApplicationsLoading(true);
      const token = localStorage.getItem("adminToken");
      const url = jobId
        ? `${API_ENDPOINTS.ADMIN_CAREER_APPLICATIONS}?job_id=${jobId}`
        : API_ENDPOINTS.ADMIN_CAREER_APPLICATIONS;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setApplications(response.data.applications);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setApplicationsLoading(false);
    }
  };

  // Load jobs on mount
  useEffect(() => {
    fetchJobs();
  }, []);

  // Load applications when tab changes
  useEffect(() => {
    if (careerTab === "applications") {
      fetchApplications(selectedJobFilter);
    }
  }, [careerTab, selectedJobFilter]);

  // Handle job form submission
  const handleJobSubmit = async (e) => {
    e.preventDefault();
    setJobFormLoading(true);
    setJobMessage("");

    try {
      const token = localStorage.getItem("adminToken");
      let response;

      if (isEditingJob) {
        response = await axios.put(
          API_ENDPOINTS.ADMIN_CAREER_UPDATE(jobFormData.id),
          jobFormData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        response = await axios.post(
          API_ENDPOINTS.ADMIN_CAREER_CREATE,
          jobFormData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      if (response.data.success) {
        setJobMessage(
          `✓ Job ${isEditingJob ? "updated" : "created"} successfully!`
        );
        resetJobForm();
        fetchJobs();
        setTimeout(() => setJobMessage(""), 5000);
      }
    } catch (error) {
      console.error("Error saving job:", error);
      const errorMsg = error.response?.data?.error || "Failed to save job";
      setJobMessage("✗ " + errorMsg);
      setTimeout(() => setJobMessage(""), 5000);
    } finally {
      setJobFormLoading(false);
    }
  };

  // Reset job form
  const resetJobForm = () => {
    setJobFormData({
      id: null,
      title: "",
      description: "",
      location: "",
      job_type: "full-time",
      experience_required: "",
      qualifications: "",
      responsibilities: "",
      is_active: true,
    });
    setIsEditingJob(false);
  };

  // Handle edit job
  const handleEditJob = (job) => {
    setJobFormData(job);
    setIsEditingJob(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle delete job
  const handleDeleteJob = async (jobId, jobTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${jobTitle}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.delete(
        API_ENDPOINTS.ADMIN_CAREER_DELETE(jobId),
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setJobMessage("✓ Job deleted successfully!");
        fetchJobs();
        setTimeout(() => setJobMessage(""), 5000);
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      setJobMessage("✗ Failed to delete job");
      setTimeout(() => setJobMessage(""), 5000);
    }
  };

  // Toggle job status
  const handleToggleStatus = async (jobId) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.post(
        API_ENDPOINTS.ADMIN_CAREER_TOGGLE_STATUS(jobId),
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setJobMessage("✓ Job status updated!");
        fetchJobs();
        setTimeout(() => setJobMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      setJobMessage("✗ Failed to update status");
      setTimeout(() => setJobMessage(""), 5000);
    }
  };

  // View file (Resume or Cover Letter)
  const handleViewFile = (fileUrl, fileName, fileType) => {
    setViewerFileUrl(fileUrl);
    setViewerFileName(fileName);
    setViewerFileType(fileType);
    setFileViewerOpen(true);
  };

  // Download file from viewer
  const handleDownloadFromViewer = async () => {
    try {
      const link = document.createElement("a");
      link.href = viewerFileUrl;
      link.setAttribute("download", viewerFileName);
      link.setAttribute("target", "_blank");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file");
    }
  };

  // Close file viewer
  const closeFileViewer = () => {
    setFileViewerOpen(false);
    setViewerFileUrl("");
    setViewerFileName("");
    setViewerFileType("");
  };

  // Update application status
  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.put(
        API_ENDPOINTS.ADMIN_CAREER_APPLICATION_UPDATE_STATUS(applicationId),
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        // Update the applications list
        fetchApplications(selectedJobFilter);
        alert("Application status updated successfully!");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  // Update application comments
  const handleUpdateComments = async (applicationId, comments) => {
    console.log("handleUpdateComments called", { applicationId, comments });
    try {
      const token = localStorage.getItem("adminToken");
      console.log("Token:", token ? "exists" : "missing");
      console.log("API Endpoint:", API_ENDPOINTS.ADMIN_CAREER_APPLICATION_UPDATE_COMMENTS(applicationId));

      const response = await axios.put(
        API_ENDPOINTS.ADMIN_CAREER_APPLICATION_UPDATE_COMMENTS(applicationId),
        { comments },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Response:", response.data);

      if (response.data.success) {
        // Update the applications list
        fetchApplications(selectedJobFilter);
        alert("Comments updated successfully!");
      }
    } catch (error) {
      console.error("Error updating comments:", error);
      console.error("Error details:", error.response?.data);
      alert("Failed to update comments: " + (error.response?.data?.error || error.message));
    }
  };

  // Export applications to CSV
  const handleExportCSV = () => {
    if (applications.length === 0) {
      alert("No applications to export");
      return;
    }

    // Prepare CSV data
    const headers = [
      "Name",
      "Job Title",
      "Email",
      "Phone",
      "Applied On",
      "Cover Letter",
    ];
    const rows = applications.map((app) => [
      app.name,
      app.job_title,
      app.email,
      app.phone,
      new Date(app.created_at).toLocaleDateString(),
      app.cover_letter || "N/A",
    ]);

    // Create CSV content
    let csvContent = headers.join(",") + "\n";
    rows.forEach((row) => {
      const escapedRow = row.map((cell) => {
        // Escape quotes and wrap in quotes if contains comma or newline
        const cellStr = String(cell).replace(/"/g, '""');
        return cellStr.includes(",") || cellStr.includes("\n")
          ? `"${cellStr}"`
          : cellStr;
      });
      csvContent += escapedRow.join(",") + "\n";
    });

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `job_applications_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export applications to PDF
  const handleExportPDF = () => {
    if (applications.length === 0) {
      alert("No applications to export");
      return;
    }

    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Job Applications Report", 14, 22);

    // Add date
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Prepare table data
    const tableData = applications.map((app) => [
      app.name,
      app.job_title,
      app.email,
      app.phone,
      new Date(app.created_at).toLocaleDateString(),
    ]);

    // Add table
    autoTable(doc, {
      head: [["Name", "Job Title", "Email", "Phone", "Applied On"]],
      body: tableData,
      startY: 35,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [163, 61, 61] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 35 },
    });

    // Save PDF
    doc.save(`job_applications_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <div className="admin-career-container">
      <h2>Career Page Management</h2>

      {/* Tab Navigation */}
      <div className="career-tabs">
        <button
          className={`career-tab ${careerTab === "jobs" ? "active" : ""}`}
          onClick={() => setCareerTab("jobs")}
        >
          <i className="fas fa-briefcase"></i> Job Vacancies
        </button>
        <button
          className={`career-tab ${
            careerTab === "applications" ? "active" : ""
          }`}
          onClick={() => setCareerTab("applications")}
        >
          <i className="fas fa-file-alt"></i> Applications
        </button>
      </div>

      {/* Jobs Tab */}
      {careerTab === "jobs" && (
        <div className="career-tab-content">
          {/* Job Form */}
          <div className="career-card">
            <h3>{isEditingJob ? "Edit Job Vacancy" : "Add New Job Vacancy"}</h3>
            {isEditingJob && (
              <div className="editing-banner">
                <span>
                  <i className="fas fa-edit"></i> Editing job...
                </span>
                <button onClick={resetJobForm} className="btn-cancel-edit">
                  Cancel Edit
                </button>
              </div>
            )}

            <form onSubmit={handleJobSubmit} className="job-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Job Title *</label>
                  <input
                    type="text"
                    value={jobFormData.title}
                    onChange={(e) =>
                      setJobFormData({ ...jobFormData, title: e.target.value })
                    }
                    required
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>
                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    value={jobFormData.location}
                    onChange={(e) =>
                      setJobFormData({
                        ...jobFormData,
                        location: e.target.value,
                      })
                    }
                    required
                    placeholder="e.g., Mumbai, India"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Job Type *</label>
                  <select
                    value={jobFormData.job_type}
                    onChange={(e) =>
                      setJobFormData({
                        ...jobFormData,
                        job_type: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="full-time">Full-Time</option>
                    <option value="part-time">Part-Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Experience Required</label>
                  <input
                    type="text"
                    value={jobFormData.experience_required}
                    onChange={(e) =>
                      setJobFormData({
                        ...jobFormData,
                        experience_required: e.target.value,
                      })
                    }
                    placeholder="e.g., 3-5 years"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Job Description *</label>
                <textarea
                  value={jobFormData.description}
                  onChange={(e) =>
                    setJobFormData({
                      ...jobFormData,
                      description: e.target.value,
                    })
                  }
                  required
                  rows="4"
                  placeholder="Describe the job role..."
                />
              </div>

              <div className="form-group">
                <label>Qualifications</label>
                <textarea
                  value={jobFormData.qualifications}
                  onChange={(e) =>
                    setJobFormData({
                      ...jobFormData,
                      qualifications: e.target.value,
                    })
                  }
                  rows="3"
                  placeholder="Required qualifications and skills..."
                />
              </div>

              <div className="form-group">
                <label>Responsibilities</label>
                <textarea
                  value={jobFormData.responsibilities}
                  onChange={(e) =>
                    setJobFormData({
                      ...jobFormData,
                      responsibilities: e.target.value,
                    })
                  }
                  rows="3"
                  placeholder="Key responsibilities..."
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={jobFormData.is_active}
                    onChange={(e) =>
                      setJobFormData({
                        ...jobFormData,
                        is_active: e.target.checked,
                      })
                    }
                  />
                  <span>Active (visible on career page)</span>
                </label>
              </div>

              {jobMessage && (
                <div
                  className={`form-message ${
                    jobMessage.startsWith("✓") ? "success" : "error"
                  }`}
                >
                  {jobMessage}
                </div>
              )}

              <button
                type="submit"
                className="btn-submit"
                disabled={jobFormLoading}
              >
                {jobFormLoading
                  ? "Saving..."
                  : isEditingJob
                  ? "Update Job"
                  : "Create Job"}
              </button>
            </form>
          </div>

          {/* Jobs List */}
          <div className="career-card">
            <h3>All Job Vacancies ({jobs.length})</h3>
            {jobsLoading ? (
              <p className="loading-text">Loading jobs...</p>
            ) : jobs.length === 0 ? (
              <p className="no-data-text">
                No job vacancies yet. Create your first job posting above.
              </p>
            ) : (
              <div className="jobs-grid">
                {jobs.map((job) => (
                  <div key={job.id} className="job-card">
                    <div className="job-header">
                      <div>
                        <h4>{job.title}</h4>
                        <p className="job-meta">
                          <i className="fas fa-map-marker-alt"></i>{" "}
                          {job.location} • <i className="fas fa-clock"></i>{" "}
                          {job.job_type.charAt(0).toUpperCase() +
                            job.job_type.slice(1)}
                        </p>
                      </div>
                      <div className="job-status">
                        <span
                          className={`status-badge ${
                            job.is_active ? "active" : "inactive"
                          }`}
                        >
                          {job.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>

                    <p className="job-description">{job.description}</p>

                    {job.experience_required && (
                      <p className="job-detail">
                        <strong>Experience:</strong> {job.experience_required}
                      </p>
                    )}

                    <div className="job-stats">
                      <span>
                        <i className="fas fa-users"></i>{" "}
                        {job.applications_count || 0} Applications
                      </span>
                      <span>
                        <i className="fas fa-calendar"></i>{" "}
                        {new Date(job.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="job-actions">
                      <button
                        onClick={() => handleToggleStatus(job.id)}
                        className="btn-toggle"
                        title={job.is_active ? "Deactivate" : "Activate"}
                      >
                        <i
                          className={`fas fa-${
                            job.is_active ? "eye-slash" : "eye"
                          }`}
                        ></i>
                      </button>
                      <button
                        onClick={() => handleEditJob(job)}
                        className="btn-edit"
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id, job.title)}
                        className="btn-delete"
                        title="Delete"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Applications Tab */}
      {careerTab === "applications" && (
        <div className="career-tab-content">
          <div className="career-card">
            <div className="applications-header">
              <h3>Job Applications ({applications.length})</h3>
              <div className="applications-actions">
                <div className="filter-group">
                  <label>Filter by Job:</label>
                  <select
                    value={selectedJobFilter}
                    onChange={(e) => setSelectedJobFilter(e.target.value)}
                  >
                    <option value="">All Jobs</option>
                    {jobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="export-buttons">
                  <button
                    onClick={handleExportCSV}
                    className="btn-export btn-export-csv"
                    title="Export to CSV"
                  >
                    <i className="fas fa-file-csv"></i> Export CSV
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="btn-export btn-export-pdf"
                    title="Export to PDF"
                  >
                    <i className="fas fa-file-pdf"></i> Export PDF
                  </button>
                </div>
              </div>
            </div>

            {applicationsLoading ? (
              <p className="loading-text">Loading applications...</p>
            ) : applications.length === 0 ? (
              <p className="no-data-text">No applications received yet.</p>
            ) : (
              <div className="applications-table-container">
                <table className="applications-table">
                  <thead>
                    <tr>
                      <th>Applicant</th>
                      <th>Job Title</th>
                      <th>Contact</th>
                      <th>Status</th>
                      <th>Applied On</th>
                      <th>Resume</th>
                      <th>Cover Letter</th>
                      <th>Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app.id}>
                        <td data-label="Applicant">
                          <strong>{app.name}</strong>
                        </td>
                        <td data-label="Job Title">{app.job_title}</td>
                        <td data-label="Contact">
                          <div className="contact-info">
                            <div>
                              <i className="fas fa-envelope"></i> {app.email}
                            </div>
                            <div>
                              <i className="fas fa-phone"></i> {app.phone}
                            </div>
                          </div>
                        </td>
                        <td data-label="Status">
                          <select
                            value={app.status || "pending"}
                            onChange={(e) =>
                              handleUpdateStatus(app.id, e.target.value)
                            }
                            className={`status-select status-${app.status || "pending"}`}
                            style={{
                              padding: "5px 10px",
                              borderRadius: "4px",
                              border: "1px solid #ddd",
                              fontSize: "13px",
                              fontWeight: "500",
                              cursor: "pointer",
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="interviewing">Interviewing</option>
                            <option value="selected">Selected</option>
                            <option value="rejected">Rejected</option>
                            <option value="offered">Offered</option>
                          </select>
                        </td>
                        <td data-label="Applied On">{new Date(app.created_at).toLocaleDateString()}</td>
                        <td data-label="Resume">
                          <button
                            onClick={() =>
                              handleViewFile(
                                app.resume_url,
                                `${app.name}_resume.pdf`,
                                "resume"
                              )
                            }
                            className="btn-download"
                            title="View Resume"
                          >
                            <i className="fas fa-eye"></i> View
                          </button>
                        </td>
                        <td data-label="Cover Letter">
                          {app.cover_letter_path ? (
                            <div>
                              <button
                                onClick={() =>
                                  handleViewFile(
                                    app.cover_letter_url,
                                    `${app.name}_cover_letter.pdf`,
                                    "cover_letter"
                                  )
                                }
                                className="btn-download"
                                title="View Cover Letter File"
                              >
                                <i className="fas fa-eye"></i> View
                              </button>
                            </div>
                          ) : app.cover_letter ? (
                            <details className="cover-letter-details">
                              <summary>View Text</summary>
                              <p>{app.cover_letter}</p>
                            </details>
                          ) : (
                            <span className="no-data">-</span>
                          )}
                        </td>
                        <td data-label="Comments">
                          <textarea
                            className="comments-textarea"
                            placeholder="Add comments..."
                            defaultValue={app.comments || ""}
                            onBlur={(e) => {
                              console.log("onBlur triggered", {
                                appId: app.id,
                                newValue: e.target.value,
                                oldValue: app.comments || "",
                                isDifferent: e.target.value !== (app.comments || "")
                              });
                              if (e.target.value !== (app.comments || "")) {
                                handleUpdateComments(app.id, e.target.value);
                              }
                            }}
                            rows="2"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* File Viewer Modal */}
      {fileViewerOpen && (
        <div className="file-viewer-modal" onClick={closeFileViewer}>
          <div
            className="file-viewer-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="file-viewer-header">
              <h3>
                <i className={`fas fa-${viewerFileType === "resume" ? "file-alt" : "envelope"}`}></i>{" "}
                {viewerFileType === "resume" ? "Resume" : "Cover Letter"}
              </h3>
              <button className="close-viewer" onClick={closeFileViewer}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="file-viewer-body">
              <iframe
                src={viewerFileUrl}
                title={viewerFileName}
                className="file-iframe"
              />
            </div>

            <div className="file-viewer-footer">
              <button
                className="btn-download-viewer"
                onClick={handleDownloadFromViewer}
              >
                <i className="fas fa-download"></i> Download
              </button>
              <button className="btn-close-viewer" onClick={closeFileViewer}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCareer;
