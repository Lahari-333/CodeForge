import api from './api';

export const userService = {
  async getProfile() {
    const res = await api.get('/users/profile');
    return res.data;
  },

  async getDashboard() {
    const res = await api.get('/users/dashboard');
    return res.data;
  }
};
