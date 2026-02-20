import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // baseURL: "https://zpr7gwss-5000.inc1.devtunnels.ms/",
});

// attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
