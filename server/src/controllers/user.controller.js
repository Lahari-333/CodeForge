const userService = require('../services/user.service');
const { sendSuccess } = require('../utils/responseHelper');

const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await userService.getUserProfile(userId);
    return sendSuccess(res, result, 'User profile data retrieved.');
  } catch (error) {
    next(error);
  }
};

const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await userService.getDashboardStats(userId);
    return sendSuccess(res, result, 'Dashboard data retrieved.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  getDashboard
};
