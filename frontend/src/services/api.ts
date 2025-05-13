import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL + "/api/v1",
});

// Request interceptor - adds authorization header except for auth paths
API.interceptors.request.use(
  (config) => {
    // Skip adding auth token for authentication endpoints
    const isAuthPath = config.url && config.url.startsWith("/auth");

    const token = sessionStorage.getItem("token");
    if (token && !isAuthPath) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
