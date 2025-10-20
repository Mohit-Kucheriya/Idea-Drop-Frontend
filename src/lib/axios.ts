import axios from "axios";
import { getStoredAccessToken, setStoredAccessToken } from "./authToken";
import { refreshAccessToken } from "@/api/auth";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_PRODUCTION_API_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token on refresh
api.interceptors.request.use((config) => {
  const token = getStoredAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;
      try {
        const { accessToken: newToken } = await refreshAccessToken();
        if (!newToken) throw new Error("No new token");
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        setStoredAccessToken(newToken);
        return api(originalRequest);
      } catch (refreshError) {
        console.log("Refresh failed, logging out...");
        setStoredAccessToken(null);
      }
    }

    return Promise.reject(err);
  },
);

export default api;
