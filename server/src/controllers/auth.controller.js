const authService = require('../services/auth.service');
const { sendSuccess, sendError } = require('../utils/responseHelper');

const register = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;
    const result = await authService.registerUser({ name, username, email, password });
    return sendSuccess(res, result, 'User registered successfully.', 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;
    const result = await authService.loginUser({ identifier, password });
    return sendSuccess(res, result, 'Login successful.');
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user.id);
    return sendSuccess(res, { user }, 'User profile retrieved.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe
};
