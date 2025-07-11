import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/navbar';
import '../styles/userprofile.css'; // You can extend this or use Tailwind if needed

function UserProfile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    axios
      .get('http://localhost:8000/api/me', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })
      .then((res) => setUser(res.data))
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError('Something went wrong!');
        }
      });
  }, [navigate]);

  if (error) return <div>{error}</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="profile-container">
        {/* LEFT PROFILE CARD */}
       <div className="left-panel">
          <div className="avatar"></div>
          <div className="info-box">
            <h3>{user.name}</h3>
            <p>📧 {user.email}</p>
            <p>📞 {user.mobile}</p>
            <p>🇮🇳 India</p>
            <p>🧾 {user.pin || '149630'}</p>
            <p>🏙️ {user.city || 'Punjab'}</p>
            <p>📍 {user.address || 'Street123, Pc Roads'}</p>
          </div>
        </div>


        {/* RIGHT ACTION PANEL */}
        <div className="right-panel">
          <div className="action-grid">
            <button>🛍️ Orders</button>
            <button>❤️ Wishlist</button>
            <button>🏷️ Coupons</button>
            <button>🆘 Help Centre</button>
          </div>

          <h4>Account Settings</h4>
          <ul className="settings-list">
            <li>👤 Edit Profile</li>
            <li>📍 Saved Addresses</li>
            <li>🌐 Select Language</li>
            <li>🔔 Notification Setting</li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default UserProfile;
