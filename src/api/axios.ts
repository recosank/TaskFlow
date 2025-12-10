import axios from "axios";
import { getAccessToken, setAccessToken, clearAccessToken } from "./authMemory";

const api = axios.create({
  // baseURL: "http://localhost:4000/api",
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest?.url?.includes("/auth/")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = axios
          .post(
            "/auth/refresh",
            {},
            {
              baseURL: "http://localhost:4000/api",
              withCredentials: true,
            }
          )
          .then((res) => {
            const newToken = res.data?.accessToken;
            if (!newToken) throw new Error("No access token received");
            setAccessToken(newToken);
            return newToken;
          })
          .catch((err) => {
            clearAccessToken();
            throw err;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      try {
        const newToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
