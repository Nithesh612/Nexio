/**
 * Centralized API Configuration
 * Reads from Vite environment variable with local fallback.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace(/\/+$/, '')
  : 'http://localhost:5000';

export const API_URL = `${API_BASE_URL}/hub`;

export default {
  BASE_URL: API_BASE_URL,
  API_URL,
};
