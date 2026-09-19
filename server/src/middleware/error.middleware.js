const { sendError } = require('../utils/responseHelper');

const errorHandler = (err, req, res, next) => {
  console.error('[Error Middleware]:', err);

  // Handle SyntaxError (e.g. invalid JSON in request body)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return sendError(res, 'Malformed JSON payload in request body.', 400);
  }

  // Handle MySQL errors safely
  if (err.code && err.code.startsWith('ER_')) {
    if (err.code === 'ER_DUP_ENTRY') {
      return sendError(res, 'A record with this identifier already exists.', 409);
    }
    return sendError(res, 'Database error occurred while processing the request.', 500);
  }

  // Generic fallback: never expose raw stack traces to the client
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error.';
  return sendError(res, message, statusCode);
};

module.exports = {
  errorHandler
};
