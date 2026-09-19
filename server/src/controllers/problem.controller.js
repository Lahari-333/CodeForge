const problemService = require('../services/problem.service');
const { sendSuccess } = require('../utils/responseHelper');

const getProblems = async (req, res, next) => {
  try {
    const { search, difficulty, category, page, limit } = req.query;
    const userId = req.user ? req.user.id : null;

    const result = await problemService.getAllProblems({
      search,
      difficulty,
      category,
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
      userId
    });

    return sendSuccess(res, result, 'Problems retrieved successfully.');
  } catch (error) {
    next(error);
  }
};

const getProblem = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const userId = req.user ? req.user.id : null;

    const problem = await problemService.getProblemBySlug(slug, userId);
    return sendSuccess(res, { problem }, 'Problem retrieved successfully.');
  } catch (error) {
    next(error);
  }
};

const createProblem = async (req, res, next) => {
  try {
    const createdBy = req.user.id;
    const problem = await problemService.createProblem({
      ...req.body,
      created_by: createdBy
    });
    return sendSuccess(res, { problem }, 'Problem created successfully.', 201);
  } catch (error) {
    next(error);
  }
};

const updateProblem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await problemService.updateProblem(id, req.body);
    return sendSuccess(res, result, 'Problem updated successfully.');
  } catch (error) {
    next(error);
  }
};

const deleteProblem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await problemService.deleteProblem(id);
    return sendSuccess(res, result, 'Problem deleted successfully.');
  } catch (error) {
    next(error);
  }
};

const getAdminTestCases = async (req, res, next) => {
  try {
    const { id } = req.params;
    const testCases = await problemService.getAdminTestCases(id);
    return sendSuccess(res, { testCases }, 'Test cases retrieved.');
  } catch (error) {
    next(error);
  }
};

const addTestCase = async (req, res, next) => {
  try {
    const { id } = req.params;
    const testCase = await problemService.addTestCase(id, req.body);
    return sendSuccess(res, { testCase }, 'Test case added successfully.', 201);
  } catch (error) {
    next(error);
  }
};

const updateTestCase = async (req, res, next) => {
  try {
    const { testCaseId } = req.params;
    const result = await problemService.updateTestCase(testCaseId, req.body);
    return sendSuccess(res, result, 'Test case updated successfully.');
  } catch (error) {
    next(error);
  }
};

const deleteTestCase = async (req, res, next) => {
  try {
    const { testCaseId } = req.params;
    const result = await problemService.deleteTestCase(testCaseId);
    return sendSuccess(res, result, 'Test case deleted successfully.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProblems,
  getProblem,
  createProblem,
  updateProblem,
  deleteProblem,
  getAdminTestCases,
  addTestCase,
  updateTestCase,
  deleteTestCase
};
