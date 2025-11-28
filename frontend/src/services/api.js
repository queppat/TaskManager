import axios from 'axios';
import { authService } from './authService';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
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
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Если ошибка 401 и это не запрос на обновление токена
    if (error.response?.status === 401 && !originalRequest._retry) {

      if (isRefreshing) {
        // Если уже обновляем токен, добавляем запрос в очередь
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Пытаемся обновить токен
        const newToken = await authService.refreshTokens();

        // Обновляем заголовок оригинального запроса
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Обрабатываем очередь запросов
        processQueue(null, newToken);

        // Повторяем оригинальный запрос
        return api(originalRequest);
      } catch (refreshError) {
        // Если refresh не удался, очищаем токены
        processQueue(refreshError, null);
        authService.clearTokens();

        // Редиректим на логин только если мы на защищенной странице
        if (!originalRequest.url.includes('/auth/') &&
          !window.location.pathname.includes('/login') &&
          !window.location.pathname.includes('/register')) {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;