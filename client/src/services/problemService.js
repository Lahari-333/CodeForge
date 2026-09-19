import api from './api';

export const problemService = {
  async getProblems({ search = '', difficulty = '', category = '', page = 1, limit = 10 } = {}) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (difficulty && difficulty !== 'All') params.append('difficulty', difficulty);
    if (category && category !== 'All') params.append('category', category);
    params.append('page', page);
    params.append('limit', limit);

    const res = await api.get(`/problems?${params.toString()}`);
    return res.data;
  },

  async getProblemBySlug(slug) {
    const res = await api.get(`/problems/${slug}`);
    return res.data;
  },

  // Admin APIs
  async createProblem(data) {
    const res = await api.post('/problems', data);
    return res.data;
  },

  async updateProblem(id, data) {
    const res = await api.put(`/problems/${id}`, data);
    return res.data;
  },

  async deleteProblem(id) {
    const res = await api.delete(`/problems/${id}`);
    return res.data;
  },

  async getAdminTestCases(problemId) {
    const res = await api.get(`/problems/${problemId}/test-cases`);
    return res.data;
  },

  async addTestCase(problemId, data) {
    const res = await api.post(`/problems/${problemId}/test-cases`, data);
    return res.data;
  },

  async updateTestCase(testCaseId, data) {
    const res = await api.put(`/problems/test-cases/${testCaseId}`, data);
    return res.data;
  },

  async deleteTestCase(testCaseId) {
    const res = await api.delete(`/problems/test-cases/${testCaseId}`);
    return res.data;
  }
};
