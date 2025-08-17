// src/services/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://leaderboard.runasp.net/api',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

export const getContestants = () => apiClient.get('/Racer');

export const addContestant = (contestantData) => apiClient.post('/Racer', contestantData);


export const addPoints = (racerId, pointsData) => apiClient.post(`/Racer/${racerId}/Start`, pointsData);


export const addAward = (racerId, awardData) => apiClient.post(`/Racer/${racerId}/Accolade`, awardData);

export const deleteContestant = (racerId) => apiClient.delete(`/Racer/${racerId}`);