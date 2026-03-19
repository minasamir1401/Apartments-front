import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// For uploads, we might need a separate base URL
export const UPLOADS_BASE = import.meta.env.VITE_UPLOADS_URL || '/uploads';

export default api;
