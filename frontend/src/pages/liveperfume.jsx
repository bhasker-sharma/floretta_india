import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import Slider from '../components/slider';
import Footer from '../components/footer';
import '../styles/liveperfume.css';


const LivePerfume = () => {
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/how-it-works')
      .then((res) => res.json())
      .then((data) => setSteps(data))
      .catch((err) => console.error('Failed to fetch how-it-works data:', err));
  }, []);

  return (
    <>
      <Navbar />
      <Slider />

      {/* Live Perfume Bar Description */}
      <div className="live-bar-container">
        <h2 className="live-bar-heading">FLORETTA LIVE PERFUME BAR</h2>
        <p className="live-bar-description">
          The perfume bar at the wedding venue features Floretta India's collections, enhanced
          by floral arrangements and decor that align with the theme. Its design complements the
          venue, creating a welcoming and sophisticated atmosphere for guests.
        </p>
      </div>

     
    {/* HOW IT WORKS SECTION */}
<div className="hiw-container">
  <h2 className="hiw-title">HOW IT WORKS?</h2>

  {/* Info Row */}
  <div className="hiw-step-info-row">
    {steps.map((step) => (
      <div className="hiw-step-info" key={step.id}>
        <h3 className="hiw-step-title">{step.title}</h3>
        <p className="hiw-step-subtitle">{step.subtitle}</p>
      </div>
    ))}
  </div>

  {/* Image Row */}
  <div className="hiw-step-image-row">
    {steps.map((step) => (
      <div className="hiw-step-image-container" key={step.id}>
        <img
          src={`http://localhost:8000/storage/${step.image}`}
          alt={step.title}
          className="hiw-image"
        />
      </div>
    ))}
  </div>
</div>


      <Footer />
    </>
  );
};

export default LivePerfume;
