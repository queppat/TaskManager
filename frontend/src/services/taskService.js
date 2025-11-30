import api from './api';
import dayjs from 'dayjs'

export const taskService = {

  async getAllTasks(page = 0, size = 10, filters = {}, sort = 'createdAt,desc') {
    try {
      const params = {
        page: page,
        size: size,
        sort: sort
      };

      if (filters.title) {
        params.title = filters.title;
      }

      if (filters.status) {
        params.status = filters.status;
      }

      if (filters.deadline) {
        params.deadline = dayjs(filters.deadline).format('YYYY-MM-DD');
      }

      const response = await api.get('/tasks', {
        params: params
      });

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  },

  async createTask(taskData) {
    try {
      const response = await api.post('/tasks', taskData);

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  },

  async updateTask(taskId, updateData) {
    try {
      const response = await api.patch(`/tasks/${taskId}`, updateData);

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  },

  async deleteTask(taskId) {
    try {
      const response = await api.delete(`/tasks/${taskId}`)

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  },

  handleError(error) {
    if (error.response?.data) {
      const backendError = error.response.data;
      throw new Error(backendError.message || 'Произошла ошибка');
    } else {
      throw new Error('Сетевая ошибка или сервер недоступен');
    }
  }
};