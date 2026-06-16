import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${BASE}/api`,
  headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
});

// Attach JWT + session-id on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fl_token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;

  const sid = localStorage.getItem('fl_session');
  if (sid) config.headers['X-Session-Id'] = sid;

  return config;
});

// On 401, clear auth and let the UI react via the store
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('fl_token');
      localStorage.removeItem('fl_user');
    }
    return Promise.reject(err);
  }
);

export const STORAGE_URL = `${BASE}/storage`;

export const imageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${STORAGE_URL}/${path}`;
};

export default api;
