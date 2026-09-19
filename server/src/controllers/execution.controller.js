const executionService = require('../services/execution.service');
const { sendSuccess } = require('../utils/responseHelper');

const executeCode = async (req, res, next) => {
  try {
    const { language, code, stdin } = req.body;
    const userId = req.user ? req.user.id : null;

    const result = await executionService.executeUserCode({
      language,
      code,
      stdin,
      userId
    });

    return sendSuccess(res, result, 'Execution completed.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  executeCode
};
