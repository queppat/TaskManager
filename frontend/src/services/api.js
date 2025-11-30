import axios from 'axios';
import { authService } from './authService';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  for (const prom of failedQueue) {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  }
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    throw error;
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh')) {

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          throw err;
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await authService.refreshTokens();

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        processQueue(null, newToken);

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        authService.clearTokens();

        if (!originalRequest.url.includes('/auth/') &&
          !globalThis.location.pathname.includes('/login') &&
          !globalThis.location.pathname.includes('/register')) {
          globalThis.location.href = '/login';
        }

        throw refreshError;
      } finally {
        isRefreshing = false;
      }
    }

    throw error;
  }
);

export default api;