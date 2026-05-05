import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const uploadJudgment = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(`${API_URL}/judgments/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const getJudgments = async () => {
  const response = await axios.get(`${API_URL}/judgments/`);
  return response.data;
};

export const getJudgmentDetail = async (id) => {
  const response = await axios.get(`${API_URL}/judgments/${id}`);
  return response.data;
};

export const verifyJudgment = async (id, status, verifiedBy) => {
  const response = await axios.post(`${API_URL}/judgments/${id}/verify`, {
    status,
    verified_by: verifiedBy
  });
  return response.data;
};
