import api from './api';

export const executionService = {
  // Freeform execution (editor page)
  async executeCode({ language, code, stdin = '' }) {
    const res = await api.post('/execute', { language, code, stdin });
    return res.data;
  },

  // Run code against public sample tests
  async runSampleTests({ problemId, language, code }) {
    const res = await api.post('/submissions/run-sample', { problemId, language, code });
    return res.data;
  },

  // Submit code for grading against all tests (including hidden)
  async submitSolution({ problemId, language, code }) {
    const res = await api.post('/submissions/submit', { problemId, language, code });
    return res.data;
  },

  // User submissions history
  async getMySubmissions({ page = 1, limit = 10 } = {}) {
    const res = await api.get(`/submissions/my?page=${page}&limit=${limit}`);
    return res.data;
  },

  // View specific submission details and source code
  async getSubmissionById(id) {
    const res = await api.get(`/submissions/${id}`);
    return res.data;
  }
};
