import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/navbar';
import '../styles/userprofile.css';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // ✅ Hook inside the component

  useEffect(() => {
    axios.get('http://localhost:8000/api/me', {
      withCredentials: true,
      headers: { Accept: 'application/json' }
    })
    .then(response => {
      if (response.data.user) {
        setUser(response.data.user);
      } else {
        navigate('/login');
      }
    })
    .catch(err => {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('UserProfile fetch error:', err.response || err.message);
    });
  }, [navigate]);

  if (error) {
    return <div className="user-profile"><p className="error">{error}</p></div>;
  }

  if (!user) {
    return <div className="user-profile"><p>Loading...</p></div>;
  }

  return (
    <>
      <Navbar />
      <div className="user-profile">
        <h2>👤 User Profile</h2>
        <div className="profile-box">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Mobile:</strong> {user.mobile || 'N/A'}</p>
          <p><strong>Address:</strong> {user.address || 'N/A'}</p>
          <p><strong>Registered At:</strong> {new Date(user.created_at).toLocaleString()}</p>
        </div>
      </div>
    </>
  );
}

export default UserProfile;
