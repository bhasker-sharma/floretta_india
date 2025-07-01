// src/components/UserProfile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/userprofile.css';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/me', { withCredentials: true })
      .then(response => {
        setUser(response.data.user);
      })
      .catch(err => {
        setError('You must be logged in to view this page.');
        console.error(err);
      });
  }, []);

  if (error) {
    return <div className="user-profile"><p className="error">{error}</p></div>;
  }

  if (!user) {
    return <div className="user-profile"><p>Loading...</p></div>;
  }

  return (
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
  );
}

export default UserProfile;
