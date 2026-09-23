const rawApiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

export const API_BASE_URL = String(rawApiBaseUrl).replace(/\/$/, "");
export const API = `${API_BASE_URL}/api`;

export const buildApiUrl = (path = "") => {
  const safePath = path.startsWith("/") ? path : `/${path}`;
  return `${API}${safePath}`;
};

export default API;
