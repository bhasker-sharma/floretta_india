import React from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import '../styles/carrier.css';

const Carrier = () => {
  return (
    <>
      <Navbar />

      {/* Section 1: Header */}
      <div className="carrier-header">
        <h5 className="carrier-subtitle">Find the career of your dreams</h5>
        <h2 className="carrier-title">
          We’re more than just a workplace.<br />We’re a Family.
        </h2>
        <p className="carrier-description">
          We know that finding a meaningful and rewarding job can be a long journey. Our goal is to make that process
          as easy as possible for you, and to create a work environment that's satisfying – one where you’ll look
          forward to coming to every day. Start your journey with us by browsing available jobs.
        </p>
        <button className="carrier-button">View Opening</button>
      </div>

      {/* Section 2: Job Listings */}
      <div className="job-section">
        <div className="job-header">
          <div className="job-left">
            <h2 className="job-title">join us</h2>
            <p className="job-subtitle">Current opening</p>
          </div>
          <div className="job-filter">
            <label htmlFor="job-filter">Filter</label>
            <select id="job-filter">
              <option value="all">All</option>
              <option value="fulltime">Full Time</option>
              <option value="parttime">Part Time</option>
              <option value="remote">Remote</option>
            </select>
          </div>
        </div>

        <div className="job-info">
          <span>Job Title</span>
          <span className="job-count">20 jobs</span>
        </div>

        <div className="job-grid">
          {Array(6).fill().map((_, i) => (
            <div className="job-card" key={i}>
              <p className="job-time">Time Of Jobs</p>
              <h4 className="job-position">Title of job</h4>
              <p className="job-location">Location</p>
            </div>
          ))}
        </div>
      </div>
          <Footer />
    </>
  );
};

export default Carrier;
