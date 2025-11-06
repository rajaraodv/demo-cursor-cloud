// API configuration
// In development, this will be empty (uses relative paths with Vite proxy)
// In production/cloud, set VITE_API_URL to the full backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const getApiUrl = (path) => {
  // Remove leading slash from path if API_BASE_URL is set (it will have trailing slash)
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return API_BASE_URL ? `${API_BASE_URL.replace(/\/$/, '')}/${cleanPath}` : path;
};

