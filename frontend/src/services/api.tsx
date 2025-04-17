import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log("No token found on local storage");
  }
  return config;
});

export default API;
