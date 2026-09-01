import axios from "axios";
import { ENV } from "../config/env";
import { store } from "../store";
import { logout } from "../store/slices/authSlice";

export const baseAPI = axios.create({
  baseURL: ENV.API_URL,
  timeout: 10000,
});

// Since user routes are under /api/user, we replace /api/public with /api/user
const userBaseURL = ENV.API_URL.replace("/api/public", "/api/user");

export const userAPI = axios.create({
  baseURL: userBaseURL,
  timeout: 10000,
});

// Request interceptor to automatically attach authorization header
userAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to immediately log out on 401 / 403 unauthorized
userAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn("[Auth Interceptor] 401/403 Unauthorized detected. Logging out immediately.");
      store.dispatch(logout());
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }
    }
    return Promise.reject(error);
  }
);

export default baseAPI;
