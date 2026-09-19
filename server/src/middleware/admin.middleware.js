const { sendError } = require('../utils/responseHelper');
const { USER_ROLES } = require('../config/constants');

const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return sendError(res, 'Authentication required.', 401);
  }

  if (req.user.role !== USER_ROLES.ADMIN) {
    return sendError(res, 'Access denied. Administrative privileges required.', 403);
  }

  next();
};

module.exports = {
  requireAdmin
};
