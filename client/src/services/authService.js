import api from './api';

export const authService = {
  async register(data) {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  async login(identifier, password) {
    const res = await api.post('/auth/login', { identifier, password });
    return res.data;
  },

  async getMe() {
    const res = await api.get('/auth/me');
    return res.data;
  },

  logout() {
    localStorage.removeItem('codeforge_token');
    localStorage.removeItem('codeforge_user');
  }
};
