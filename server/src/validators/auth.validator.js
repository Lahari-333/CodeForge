const { sendError } = require('../utils/responseHelper');

const validateRegister = (req, res, next) => {
  const { name, username, email, password, confirmPassword } = req.body;
  const errors = {};

  if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
    errors.name = 'Full name is required (between 2 and 100 characters).';
  }

  const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
  if (!username || typeof username !== 'string' || !usernameRegex.test(username.trim())) {
    errors.username = 'Username must be 3-30 characters containing only letters, numbers, underscores, or hyphens.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    errors.email = 'A valid email address is required.';
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.password = 'Password must be at least 6 characters long.';
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  if (Object.keys(errors).length > 0) {
    return sendError(res, 'Validation failed', 400, errors);
  }

  // Normalize trimmed values
  req.body.name = name.trim();
  req.body.username = username.trim().toLowerCase();
  req.body.email = email.trim().toLowerCase();

  next();
};

const validateLogin = (req, res, next) => {
  const { identifier, password } = req.body;
  const errors = {};

  if (!identifier || typeof identifier !== 'string' || identifier.trim().length === 0) {
    errors.identifier = 'Username or email is required.';
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    errors.password = 'Password is required.';
  }

  if (Object.keys(errors).length > 0) {
    return sendError(res, 'Validation failed', 400, errors);
  }

  req.body.identifier = identifier.trim();
  next();
};

module.exports = {
  validateRegister,
  validateLogin
};
