import axios from "axios";
import { ENV } from "../config/env";

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

export default baseAPI;
