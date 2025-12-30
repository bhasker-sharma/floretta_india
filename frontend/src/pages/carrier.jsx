import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "../styles/carrier.css";

const Carrier = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");

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

  // Create slug from job title
  const createSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Handle job card click - navigate to job detail page
  const handleJobClick = (job) => {
    const slug = createSlug(job.title);
    navigate(`/carrier/${slug}`, { state: { jobId: job.id } });
  };

  // Scroll to job section
  const scrollToJobs = () => {
    document.getElementById("job-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
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

      <Footer />
    </>
  );
};

export default Carrier;
