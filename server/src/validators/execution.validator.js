const { SUPPORTED_LANGUAGES, EXECUTION_LIMITS } = require('../config/constants');
const { sendError } = require('../utils/responseHelper');

const validateExecution = (req, res, next) => {
  const { language, code, stdin } = req.body;
  const errors = {};

  if (!language || !SUPPORTED_LANGUAGES.includes(language.toLowerCase())) {
    errors.language = `Language is required and must be one of: ${SUPPORTED_LANGUAGES.join(', ')}`;
  }

  if (typeof code !== 'string' || code.trim().length === 0) {
    errors.code = 'Source code cannot be empty.';
  } else if (Buffer.byteLength(code, 'utf8') > EXECUTION_LIMITS.MAX_CODE_BYTES) {
    errors.code = `Source code exceeds the maximum allowed size of ${EXECUTION_LIMITS.MAX_CODE_BYTES / 1024} KB.`;
  }

  if (stdin !== undefined && stdin !== null && typeof stdin !== 'string') {
    errors.stdin = 'Standard input (stdin) must be a string.';
  }

  if (Object.keys(errors).length > 0) {
    return sendError(res, 'Execution request validation failed', 400, errors);
  }

  req.body.language = language.toLowerCase();
  req.body.stdin = stdin || '';
  next();
};

module.exports = {
  validateExecution
};
