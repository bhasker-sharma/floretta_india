import { create } from 'zustand';
import api from '../lib/api';

// Seed guest session id if not present
if (!localStorage.getItem('fl_session')) {
  localStorage.setItem('fl_session', crypto.randomUUID());
}

const stored = () => {
  try {
    const u = localStorage.getItem('fl_user');
    return u ? JSON.parse(u) : null;
  } catch { return null; }
};

export const useAuthStore = create((set, get) => ({
  user:    stored(),
  token:   localStorage.getItem('fl_token') || null,
  loading: false,
  error:   null,

  // ---------- auth ----------

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/login', { email, password });
      localStorage.setItem('fl_token', data.token);
      localStorage.setItem('fl_user',  JSON.stringify(data.user));
      set({ user: data.user, token: data.token, loading: false });
      return { ok: true };
    } catch (e) {
      const msg = e.response?.data?.message || 'Login failed.';
      set({ error: msg, loading: false });
      return { ok: false, message: msg };
    }
  },

  register: async ({ name, email, phone, password }) => {
    set({ loading: true, error: null });
    try {
      await api.post('/register', { name, email, phone, password });
      set({ loading: false });
      return { ok: true };
    } catch (e) {
      const msg = e.response?.data?.message
        || Object.values(e.response?.data?.errors || {})[0]?.[0]
        || 'Registration failed.';
      set({ error: msg, loading: false });
      return { ok: false, message: msg };
    }
  },

  verifyEmail: async (email, otp) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/verify-email', { email, otp });
      localStorage.setItem('fl_token', data.token);
      localStorage.setItem('fl_user',  JSON.stringify(data.user));
      set({ user: data.user, token: data.token, loading: false });
      return { ok: true };
    } catch (e) {
      const msg = e.response?.data?.message || 'Invalid OTP.';
      set({ error: msg, loading: false });
      return { ok: false, message: msg };
    }
  },

  resendOtp: async (email) => {
    try {
      await api.post('/resend-otp', { email });
      return { ok: true };
    } catch (e) {
      return { ok: false, message: e.response?.data?.message || 'Failed.' };
    }
  },

  forgotPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      await api.post('/forgot-password', { email });
      set({ loading: false });
      return { ok: true };
    } catch (e) {
      const msg = e.response?.data?.message || 'Failed.';
      set({ error: msg, loading: false });
      return { ok: false, message: msg };
    }
  },

  verifyResetOtp: async (email, otp) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/verify-reset-otp', { email, otp });
      set({ loading: false });
      return { ok: true, reset_token: data.reset_token };
    } catch (e) {
      const msg = e.response?.data?.message || 'Invalid OTP.';
      set({ error: msg, loading: false });
      return { ok: false, message: msg };
    }
  },

  resetPassword: async (email, resetToken, password) => {
    set({ loading: true, error: null });
    try {
      await api.post('/reset-password', { email, reset_token: resetToken, password, password_confirmation: password });
      set({ loading: false });
      return { ok: true };
    } catch (e) {
      const msg = e.response?.data?.message || 'Failed.';
      set({ error: msg, loading: false });
      return { ok: false, message: msg };
    }
  },

  logout: async () => {
    try { await api.post('/logout'); } catch (_) {}
    localStorage.removeItem('fl_token');
    localStorage.removeItem('fl_user');
    set({ user: null, token: null });
  },

  refreshMe: async () => {
    if (!get().token) return;
    try {
      const { data } = await api.get('/me');
      localStorage.setItem('fl_user', JSON.stringify(data));
      set({ user: data });
    } catch (_) {}
  },

  clearError: () => set({ error: null }),
}));
