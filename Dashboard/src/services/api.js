// src/services/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://leaderboard.runasp.net/api',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

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
