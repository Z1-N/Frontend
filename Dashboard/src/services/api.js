// src/services/api.js
import axios from 'axios';

// Resolve base URL to avoid mixed-content under HTTPS
const envBase = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE;
let resolvedBase = envBase || null;
if (!resolvedBase) {
  const isBrowser = typeof window !== 'undefined';
  const isHttps = isBrowser && window.location && window.location.protocol === 'https:';
  // On HTTPS (e.g., Cloudflare Pages), go through same-origin function proxy at /api
  // Else fallback to the direct backend for local/dev
  resolvedBase = isHttps ? '/api' : 'http://leaderboard.runasp.net/api';
}

const apiClient = axios.create({
  baseURL: resolvedBase,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- JWT Auth scaffolding ---
let AUTH_TOKEN = null;
try {
  if (typeof window !== 'undefined') {
    const saved = window.localStorage.getItem('authToken');
    if (saved) AUTH_TOKEN = saved;
  }
} catch (_) {}

apiClient.interceptors.request.use((config) => {
  if (AUTH_TOKEN) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${AUTH_TOKEN}`;
  }
  return config;
});

export const setAuthToken = (token) => {
  AUTH_TOKEN = token || null;
  try {
    if (typeof window !== 'undefined') {
      if (token) window.localStorage.setItem('authToken', token);
      else window.localStorage.removeItem('authToken');
    }
  } catch (_) {}
};

export const clearAuthToken = () => setAuthToken(null);

// Login endpoint: POST /api/Auth/Login with { username, password }
export const login = (username, password) => apiClient.post('/Auth/Login', { username, password });

export const getContestants = () => apiClient.get('/Racer/Details');

export const getContestantDetails = (name) => apiClient.get(`/Racer/Search/${name}`);

export const addContestant = (contestantData) => apiClient.post('/Racer/', contestantData);


export const addPoints = (RacerId, pointsData) => apiClient.post(`/Racer/${RacerId}/Start`, pointsData);


export const deleteContestant = (RacerId) => apiClient.delete(`/Racer/${RacerId}`);

// 🔽 أضف هذه الدالة الجديدة لجلب قائمة الأوسمة
export const getAccolades = () => apiClient.get('/Accolade');

// 🔽 قم بتحديث هذه الدالة لإرسال البيانات بالهيكل الصحيح
export const addAward = (racerId, accoladeId, reason) => {
  const payload = {
    racerId: racerId,
    accoladeId: accoladeId,
    dateTime: new Date().toISOString(),
    reason: reason || "Granted via dashboard" // استخدام السبب المرسل أو قيمة افتراضية
  };
  return apiClient.post(`/Racer/${racerId}/Accolade`, payload);
};
