const submissionService = require('../services/submission.service');
const { sendSuccess } = require('../utils/responseHelper');

const runSampleTests = async (req, res, next) => {
  try {
    const { problemId, language, code } = req.body;
    const result = await submissionService.runSampleTests({
      problemId: parseInt(problemId, 10),
      language,
      code
    });
    return sendSuccess(res, result, 'Sample tests executed.');
  } catch (error) {
    next(error);
  }
};

const submitSolution = async (req, res, next) => {
  try {
    const { problemId, language, code } = req.body;
    const userId = req.user.id;

    const result = await submissionService.submitSolution({
      userId,
      problemId: parseInt(problemId, 10),
      language,
      code
    });

    return sendSuccess(res, result, 'Solution submitted successfully.');
  } catch (error) {
    next(error);
  }
};

const getMySubmissions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page, limit } = req.query;

    const result = await submissionService.getUserSubmissions({
      userId,
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10
    });

    return sendSuccess(res, result, 'Submissions retrieved.');
  } catch (error) {
    next(error);
  }
};

const getSubmissionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const submission = await submissionService.getSubmissionById({
      submissionId: parseInt(id, 10),
      userId,
      userRole
    });

    return sendSuccess(res, { submission }, 'Submission retrieved.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  runSampleTests,
  submitSolution,
  getMySubmissions,
  getSubmissionById
};
